// api/upload.js
export default async function handler(req, res) {
    // السماح فقط بطلبات POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // جلب مفتاح API من متغيرات البيئة (سنقوم بإعداده في Vercel لاحقاً)
    const apiKey = process.env.IMGBB_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key configuration missing' });
    }

    try {
        const { image } = req.body; // الصورة ستصل بصيغة Base64

        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // إرسال الصورة إلى ImgBB
        const formData = new URLSearchParams();
        formData.append('image', image);
        formData.append('key', apiKey);

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        // إرجاع النتيجة إلى الواجهة الأمامية
        return res.status(200).json(data);

    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: 'Upload failed', details: error.message });
    }
}
