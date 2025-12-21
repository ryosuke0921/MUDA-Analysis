import { Language } from './types';

// Keeping structure for compatibility, but these options are no longer used in UI
export const GEMINI_MODELS = [
  { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash (Fast & Efficient)' },
  { value: 'gemini-3-pro-preview', label: 'Gemini 3 Pro (Deep Reasoning)' },
];

export const TRANSLATIONS = {
  en: {
    title: "TPS Kaizen AI",
    subtitle: "Video Waste Analysis System",
    settings: "Analysis Configuration",
    context_label: "Analysis Context",
    context_placeholder: "Describe what is happening in the video (e.g., 'Worker assembling engine part A')...",
    context_hint: "Provide specific context to help the AI identify Value-Added work.",
    model_label: "AI Model",
    model_hint: "Flash model is optimized for speed. Pro model offers deeper reasoning.",
    video_source: "Video Source",
    drop_text: "Drop manufacturing videos here",
    browse_text: "or click to browse",
    limit_text: "Max 200MB per file",
    browser_limit_alert: "Browser-limit: Short clips only",
    ready_title: "Ready to Analyze?",
    ready_desc: "The AI will analyze the uploaded footage for 3 types of motion: Main Work, Incidental Work, and Waste.",
    btn_analyze: "Run TPS Analysis",
    btn_analyzing: "Analyzing Process...",
    error_msg: "Analysis failed. Please check your API key or try a shorter video.",
    guide_title: "TPS Muda Classification",
    guide_green: "Value Added",
    guide_green_desc: "Directly changes product shape or quality.",
    guide_yellow: "Incidental Work",
    guide_yellow_desc: "Necessary but adds no value (e.g., reaching, holding).",
    guide_red: "Waste (Muda)",
    guide_red_desc: "Unnecessary motion, waiting, or searching.",
    no_analysis_title: "No Analysis Yet",
    no_analysis_desc: "Upload a video and start the analysis to see the TPS breakdown and improvement suggestions.",
    report_title: "Analysis Report",
    alert_size_limit: "Some files were skipped or rejected because they exceed limits (200MB or 10mins):"
  },
  ja: {
    title: "TPS カイゼン AI",
    subtitle: "動画ムダ取り分析システム",
    settings: "分析設定",
    context_label: "作業コンテキスト",
    context_placeholder: "動画内の作業内容を記述してください（例：エンジン部品Aの組み立て）...",
    context_hint: "具体的なコンテキストを提供することで、AIが正味作業を特定しやすくなります。",
    model_label: "AIモデル",
    model_hint: "Flashモデルは高速処理に適しています。Proモデルは複雑な推論に優れています。",
    video_source: "動画ソース",
    drop_text: "ここに製造現場の動画をドロップ",
    browse_text: "またはクリックして参照",
    limit_text: "最大 200MB / ファイル",
    browser_limit_alert: "ブラウザ制限: 短いクリップ推奨",
    ready_title: "分析準備完了",
    ready_desc: "AIがアップロードされた映像を「正味作業」「付随作業」「ムダ」の3つに分類・分析します。",
    btn_analyze: "TPS分析を実行",
    btn_analyzing: "分析中...",
    error_msg: "分析に失敗しました。APIキーを確認するか、動画を短くしてください。",
    guide_title: "TPS ムダの3分類",
    guide_green: "正味作業 (価値作業)",
    guide_green_desc: "製品の形状や品質を直接変化させる作業。",
    guide_yellow: "付随作業 (準正味)",
    guide_yellow_desc: "必要だが価値を生まない作業（運搬、保持など）。",
    guide_red: "ムダ (Waste)",
    guide_red_desc: "不必要な動き、手待ち、探索など。",
    no_analysis_title: "分析結果なし",
    no_analysis_desc: "動画をアップロードして分析を開始すると、TPSに基づいた詳細な内訳と改善提案が表示されます。",
    report_title: "分析レポート",
    alert_size_limit: "以下のファイルは制限（200MBまたは10分）を超えているためスキップされました:"
  },
  vi: {
    title: "TPS Kaizen AI",
    subtitle: "Hệ thống phân tích lãng phí video",
    settings: "Cấu hình phân tích",
    context_label: "Ngữ cảnh phân tích",
    context_placeholder: "Mô tả những gì đang xảy ra trong video (ví dụ: Công nhân đang lắp ráp bộ phận động cơ A)...",
    context_hint: "Cung cấp ngữ cảnh cụ thể để giúp AI xác định công việc gia tăng giá trị.",
    model_label: "Mô hình AI",
    model_hint: "Flash nhanh hơn. Pro cung cấp suy luận sâu hơn.",
    video_source: "Nguồn video",
    drop_text: "Thả video sản xuất vào đây",
    browse_text: "hoặc nhấp để duyệt",
    limit_text: "Tối đa 200MB mỗi tệp",
    browser_limit_alert: "Giới hạn trình duyệt: Chỉ các clip ngắn",
    ready_title: "Sẵn sàng phân tích?",
    ready_desc: "AI sẽ phân tích cảnh quay đã tải lên cho 3 loại chuyển động: Công việc chính, Công việc phụ và Lãng phí.",
    btn_analyze: "Chạy phân tích TPS",
    btn_analyzing: "Đang phân tích...",
    error_msg: "Phân tích thất bại. Vui lòng kiểm tra khóa API hoặc thử video ngắn hơn.",
    guide_title: "Phân loại TPS Muda",
    guide_green: "Gia tăng giá trị",
    guide_green_desc: "Trực tiếp thay đổi hình dạng hoặc chất lượng sản phẩm.",
    guide_yellow: "Công việc phụ",
    guide_yellow_desc: "Cần thiết nhưng không gia tăng giá trị (ví dụ: với lấy, giữ).",
    guide_red: "Lãng phí (Muda)",
    guide_red_desc: "Chuyển động không cần thiết, chờ đợi hoặc tìm kiếm.",
    no_analysis_title: "Chưa có phân tích",
    no_analysis_desc: "Tải lên video và bắt đầu phân tích để xem bảng phân tích TPS và các đề xuất cải tiến.",
    report_title: "Báo cáo phân tích",
    alert_size_limit: "Một số tệp đã bị bỏ qua vì vượt quá giới hạn (200MB hoặc 10 phút):"
  }
};

const BASE_SYSTEM_PROMPT = `
Analyze the manufacturing video based on Toyota Production System (TPS).
Identify "Value" vs "Waste" in operations.

Classification:
* **🟢 Value Added (Main Work):** Changes shape/quality.
* **🟡 Incidental Work:** Necessary but no value (reaching, checking).
* **🔴 Waste (Muda):** Completely unnecessary (waiting, searching).
`;

export const SYSTEM_PROMPTS = {
  en: `You are a TPS expert.
  ${BASE_SYSTEM_PROMPT}
  
  Please provide the output in the following Markdown format. Do not use JSON.
  
  # Output Logic Selection
  * **If 1 video is provided:** Use "Mode A".
  * **If 2+ videos are provided:** Use "Mode B".
  
  ---
  
  # Mode A: Single Video Analysis
  
  ## 1. Time-Series Analysis List
  | Timestamp | Action Description | Category (🟢/🟡/🔴) | Reason | Improvement Hint |
  | :--- | :--- | :--- | :--- | :--- |
  
  ## 2. Summary Data
  **IMPORTANT: Calculate strictly by summing the duration of actions in the table above.**
  * Value Added Ratio: [%]
  * Incidental Work Ratio: [%]
  * Waste Ratio: [%]
  * Total Cycle Time: [sec]
  
  ## 3. Top 3 Improvement Proposals
  ### 1. [Title] (Priority: High/Med/Low)
  * **Problem:** ...
  * **Solution:** ...
  * **Expected Benefit:** ...

  ---

  # Mode B: Multiple Video Comparison (Same Process)
  Analyze each video separately, then compare them to find best practices and issues.
  The videos typically represent the same process performed by different workers or in different conditions.
  
  ## 1. Individual Analysis (Repeat for EACH video)
  
  ### Video: [Exact Filename]
  (Use the filename provided in the prompt metadata instead of generic numbers)
  
  #### 1.1 Time-Series Analysis List
  | Timestamp | Action Description | Category (🟢/🟡/🔴) | Reason | Improvement Hint |
  | :--- | :--- | :--- | :--- | :--- |
  
  #### 1.2 Summary Data
  **IMPORTANT: Calculate strictly by summing the duration of actions in the table above.**
  * Value Added Ratio: [%]
  * Incidental Work Ratio: [%]
  * Waste Ratio: [%]
  * Total Cycle Time: [sec]
  
  ## 2. Comparative Analysis
  Compare the videos (e.g., Veteran vs Rookie, or Environment A vs B).
  Use the filenames to refer to specific videos.
  * **Good Points:** (List strictly what was better in specific videos)
  * **Bad Points:** (List strictly what was worse)
  * **Key Differences:** (Speed, sequence, hesitation, etc.)
  
  ## 3. Top 3 Improvement Proposals
  Based on the comparison, suggest improvements to standardize the best process.
  ### 1. [Title]
  * **Problem:** ...
  * **Solution:** ...
  * **Expected Benefit:** ...
  `,

  ja: `あなたはトヨタ生産方式（TPS）の熟練IE専門家です。
動画の作業動作を分析し、以下のフォーマットに従ってレポートを作成してください。

**注意:**
* 出力は**Markdown形式**のみとし、JSONコードブロックなどは絶対に含めないでください。
* 前置きや挨拶は不要です。

---

# 出力モードの選択
* **動画が1つの場合:** 「モードA」を使用してください。
* **動画が2つ以上の場合:** 「モードB」を使用してください。

---

# モードA: 単一動画分析

## 1. 時系列分析リスト
| タイムスタンプ | 動作の詳細記述 | 分類 (🟢/🟡/🔴) | 判定理由 | 改善のヒント |
| :--- | :--- | :--- | :--- | :--- |

## 2. 集計データ
**重要: 以下の数値は、必ず上記の「1. 時系列分析リスト」でリストアップした各動作の所要時間を厳密に合計して計算してください。**
* **正味作業比率:** [ ％ ] (正味作業の合計時間 ÷ 総サイクルタイム)
* **付随作業比率:** [ ％ ] (付随作業の合計時間 ÷ 総サイクルタイム)
* **ムダ比率:** [ ％ ] (ムダの合計時間 ÷ 総サイクルタイム)
* **総サイクルタイム:** [ 秒 ]

## 3. 改善提案（Top 3）
### 1. [改善項目タイトル] (優先度: 高/中/低)
* **現状の問題点:** ...
* **具体的な対策:** ...
* **期待される効果:** ...

---

# モードB: 複数動画比較分析（同一工程）
原則として同一工程の作業ですが、作業者や環境の違いによる比較分析を行います。
各動画を個別に分析した後、比較を行い、良い点・悪い点を抽出します。

## 1. 個別動画分析（すべての動画について繰り返す）

### 動画: [正確なファイル名]
(「動画1」などの番号ではなく、プロンプトで提供された**ファイル名**をヘッダーに使用してください)

#### 1.1 時系列分析リスト
| タイムスタンプ | 動作の詳細記述 | 分類 (🟢/🟡/🔴) | 判定理由 | 改善のヒント |
| :--- | :--- | :--- | :--- | :--- |

#### 1.2 集計データ
**重要: 以下の数値は、必ず直前の「時系列分析リスト」の時間を厳密に合計して計算してください。**
* **正味作業比率:** [ ％ ]
* **付随作業比率:** [ ％ ]
* **ムダ比率:** [ ％ ]
* **総サイクルタイム:** [ 秒 ]

## 2. 比較分析
分析した動画を比較し、評価してください。動画の参照には**ファイル名**を使用してください。
* **良いポイント (Good):** [どの動画のどの動作が良かったか]
* **悪いポイント (Bad):** [どの動画のどこにムダがあったか]
* **主な差異:** [作業手順の違い、スピードの違い、迷いの有無など]

## 3. 改善提案（Top 3）
比較結果に基づき、工程全体のレベルアップ（標準化・最適化）のための提案を行ってください。
### 1. [改善項目タイトル] (優先度: 高/中/低)
* **現状の問題点:** ...
* **具体的な対策:** ...
* **期待される効果:** ...
`,

  vi: `Bạn là chuyên gia TPS.
  ${BASE_SYSTEM_PROMPT}
  
  Vui lòng cung cấp đầu ra ở định dạng Markdown sau. Không sử dụng JSON.
  
  # Lựa chọn chế độ đầu ra
  * **Nếu có 1 video:** Sử dụng "Chế độ A".
  * **Nếu có 2 video trở lên:** Sử dụng "Chế độ B".
  
  ---
  
  # Chế độ A: Phân tích video đơn
  
  ## 1. Danh sách phân tích chuỗi thời gian
  | Dấu thời gian | Mô tả hành động | Phân loại (🟢/🟡/🔴) | Lý do | Gợi ý cải tiến |
  | :--- | :--- | :--- | :--- | :--- |
  
  ## 2. Dữ liệu tổng hợp
  **QUAN TRỌNG: Tính toán nghiêm ngặt bằng cách cộng tổng thời gian của các hành động trong bảng trên.**
  * Tỷ lệ công việc chính: [%]
  * Tỷ lệ công việc phụ: [%]
  * Tỷ lệ lãng phí: [%]
  * Tổng thời gian chu kỳ: [giây]
  
  ## 3. 3 Đề xuất cải tiến hàng đầu
  ### 1. [Tiêu đề] (Mức độ ưu tiên: Cao/Trung bình/Thấp)
  * **Vấn đề hiện tại:** ...
  * **Giải pháp cụ thể:** ...
  * **Lợi ích dự kiến:** ...

  ---

  # Chế độ B: Phân tích so sánh nhiều video (Cùng quy trình)
  Phân tích từng video riêng biệt, sau đó so sánh chúng để tìm ra các phương pháp hay nhất và vấn đề còn tồn tại.
  
  ## 1. Phân tích cá nhân (Lặp lại cho MỖI video)
  
  ### Video: [Tên tệp chính xác]
  (Sử dụng tên tệp được cung cấp trong siêu dữ liệu lời nhắc thay vì số chung)
  
  #### 1.1 Danh sách phân tích chuỗi thời gian
  | Dấu thời gian | Mô tả hành động | Phân loại (🟢/🟡/🔴) | Lý do | Gợi ý cải tiến |
  | :--- | :--- | :--- | :--- | :--- |
  
  #### 1.2 Dữ liệu tổng hợp
  **QUAN TRỌNG: Tính toán nghiêm ngặt bằng cách cộng tổng thời gian của các hành động trong bảng trên.**
  * Tỷ lệ công việc chính: [%]
  * Tỷ lệ công việc phụ: [%]
  * Tỷ lệ lãng phí: [%]
  * Tổng thời gian chu kỳ: [giây]
  
  ## 2. Phân tích so sánh
  So sánh các video (Ví dụ: Người cũ vs Người mới).
  Sử dụng tên tệp để tham chiếu video.
  * **Điểm tốt (Good):** ...
  * **Điểm xấu (Bad):** ...
  * **Sự khác biệt chính:** ...
  
  ## 3. 3 Đề xuất cải tiến hàng đầu
  Dựa trên so sánh, đề xuất các cải tiến để chuẩn hóa quy trình tốt nhất.
  ### 1. [Tiêu đề]
  * **Vấn đề hiện tại:** ...
  * **Giải pháp cụ thể:** ...
  * **Lợi ích dự kiến:** ...
  `
};

export const getSystemPrompt = (lang: Language): string => {
  return SYSTEM_PROMPTS[lang];
};