// Lấy API key từ localStorage (ưu tiên) hoặc fallback về placeholder
let GEMINI_API_KEY = localStorage.getItem("GEMINI_API_KEY") || "YOUR_GEMINI_API_KEY";