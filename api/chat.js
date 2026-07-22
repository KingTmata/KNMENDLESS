export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Chỉ chấp nhận POST' });
    }

    const { message, image } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

    // Tạo mảng dữ liệu gửi sang Gemini (Hỗ trợ cả Text và Hình ảnh)
    const parts = [];
    if (message) {
        parts.push({ text: message });
    }
    if (image) {
        parts.push({
            inlineData: {
                mimeType: "image/jpeg",
                data: image
            }
        });
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: parts }]
            })
        });
        
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Đã có lỗi phía Server' });
    }
}