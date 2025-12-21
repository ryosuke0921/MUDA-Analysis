export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AnalysisResult {
  markdown: string;
  timestamp: number;
}

export interface VideoFile {
  file: File;
  previewUrl: string;
}

export interface TpsConfig {
  context: string;
  model: string;
}

export type Language = 'en' | 'ja' | 'vi';