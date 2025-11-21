// api/verify-captcha.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { token } = req.body;
    
    // هذا المفتاح ستضيفه في إعدادات Vercel لاحقاً
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!token) {
        return res.status(400).json({ error: 'Token missing' });
    }

    try {
        // الاتصال بسيرفرات جوجل للتحقق
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
        
        const response = await fetch(verifyUrl, { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, error: 'Captcha verification failed' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}
