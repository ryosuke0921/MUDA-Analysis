import { GoogleGenAI } from "@google/genai";
import { VideoFile } from "../types";

const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // Limit client-side base64 to 200MB
const INLINE_DATA_LIMIT_BYTES = 20 * 1024 * 1024; // 20MB limit for inline data

export const checkFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE_BYTES;
};

// --- Helper Functions for Frame Extraction ---

/**
 * Extracts frames from a video file as a sequence of base64 images.
 * This strategy bypasses the 20MB inline limit for video files by converting them
 * into a sequence of optimized JPEG images, which Gemini can process as a "video".
 */
const extractFramesFromVideo = async (file: File): Promise<{ part: any, timestamp: string }[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const fileUrl = URL.createObjectURL(file);
    video.src = fileUrl;

    const frames: { part: any, timestamp: string }[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Resize target for frames to optimize token usage and payload size
    // 512px is sufficient for TPS motion analysis
    const TARGET_LONG_SIDE = 512;
    const MAX_FRAMES = 200; // Hard limit to prevent payload explosion

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      
      // Calculate dynamic sampling interval
      // If video is short (e.g. 60s), we can take 2-3 fps.
      // If video is long (e.g. 600s), we reduce fps to stay under MAX_FRAMES.
      // Target at least 0.5 FPS (1 frame every 2s) for very long videos.
      let fps = 2; 
      if (duration * fps > MAX_FRAMES) {
        fps = MAX_FRAMES / duration;
      }
      // Ensure we don't go below reasonable visibility (e.g., 0.2 fps)
      fps = Math.max(fps, 0.2);

      let width = video.videoWidth;
      let height = video.videoHeight;
      
      // Calculate aspect-ratio preserving dimensions
      if (width > height) {
        if (width > TARGET_LONG_SIDE) {
          height = Math.round(height * (TARGET_LONG_SIDE / width));
          width = TARGET_LONG_SIDE;
        }
      } else {
        if (height > TARGET_LONG_SIDE) {
          width = Math.round(width * (TARGET_LONG_SIDE / height));
          height = TARGET_LONG_SIDE;
        }
      }
      canvas.width = width;
      canvas.height = height;

      const totalFramesToCapture = Math.floor(duration * fps);
      let capturedCount = 0;
      let currentTime = 0;

      // Recursive function to seek and capture
      const seekAndCapture = () => {
        if (currentTime >= duration || capturedCount >= totalFramesToCapture) {
          URL.revokeObjectURL(fileUrl);
          resolve(frames);
          return;
        }

        video.currentTime = currentTime;
      };

      video.onseeked = () => {
        if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            // Compress as JPEG with 0.6 quality to save space
            const base64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
            
            // Format timestamp as MM:SS
            const minutes = Math.floor(video.currentTime / 60);
            const seconds = Math.floor(video.currentTime % 60);
            const timestampStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            frames.push({
                part: {
                  inlineData: {
                      data: base64,
                      mimeType: 'image/jpeg'
                  }
                },
                timestamp: timestampStr
            });
        }
        
        capturedCount++;
        currentTime += (1 / fps);
        seekAndCapture();
      };

      video.onerror = (e) => {
          URL.revokeObjectURL(fileUrl);
          reject(new Error("Error during video playback for frame extraction"));
      };

      // Start processing
      seekAndCapture();
    };
    
    video.onerror = () => {
        URL.revokeObjectURL(fileUrl);
        reject(new Error("Invalid video file"));
    };
  });
};

// --- Standard Inline Helper ---

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // remove data:video/mp4;base64, part
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const analyzeVideo = async (
  videos: VideoFile[],
  prompt: string,
  systemInstruction: string,
  modelName: string
) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare contents using "Frame Extraction" for large files
  const processedParts: { isFrames: boolean, parts: any[], filename: string }[] = [];

  for (const v of videos) {
    if (v.file.size > INLINE_DATA_LIMIT_BYTES) {
      // Large file: Extract frames
      console.log(`File ${v.file.name} is too large for inline video (${(v.file.size/1024/1024).toFixed(2)}MB). Extracting frames...`);
      try {
        const frames = await extractFramesFromVideo(v.file);
        console.log(`Extracted ${frames.length} frames from ${v.file.name}`);
        processedParts.push({
          isFrames: true,
          parts: frames, // This is now an array of { part, timestamp }
          filename: v.file.name
        });
      } catch (e) {
        console.error("Frame extraction failed:", e);
        throw new Error(`Failed to process large video ${v.file.name}. Please try a smaller file or check format.`);
      }
    } else {
      // Small file: Use standard inline video
      processedParts.push({
        isFrames: false,
        parts: [await fileToGenerativePart(v.file)],
        filename: v.file.name
      });
    }
  }
  
  // Construct the prompt content array
  // We need to flatten the parts array for the API call
  const contentParts: any[] = [];
  const fileMetadata: string[] = [];

  processedParts.forEach((vp, index) => {
    if (vp.isFrames) {
      // For frames, we wrap them with text markers so the model understands context
      fileMetadata.push(`Video ${index + 1}: ${vp.filename} (Analyzed as Image Sequence)`);
      contentParts.push({ text: `\n[Start of Image Sequence for Video ${index + 1}: ${vp.filename}. Treat these images as a continuous video.]\n` });
      
      // Inject timestamp text before each image frame
      vp.parts.forEach((item: any) => {
         contentParts.push({ text: `Timestamp: ${item.timestamp}` });
         contentParts.push(item.part);
      });

      contentParts.push({ text: `\n[End of Image Sequence for Video ${index + 1}]\n` });
    } else {
      fileMetadata.push(`Video ${index + 1}: ${vp.filename}`);
      contentParts.push(...vp.parts);
    }
  });

  const detailedPrompt = `
${prompt}

---
[Video File Metadata]
The following videos have been uploaded (in order):
${fileMetadata.join('\n')}

Please use these filenames in your report headers instead of generic numbers.
`;

  // Add the prompt text at the end
  contentParts.push({ text: detailedPrompt });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: contentParts
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, 
      },
    });

    const text = response.text;

    if (!text) {
        console.warn("Model returned no text. Finish reason:", response.candidates?.[0]?.finishReason);
        return "Analysis completed, but no text was generated. This might be due to safety filters or an unexpected model response. Please try a different video or context.";
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};