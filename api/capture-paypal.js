import fetch from 'node-fetch'; // لاستدعاء PayPal
import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

// 1. تهيئة Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
try {
    initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DB_URL,
    });
} catch (e) {
    console.error("Firebase GZ (double-init):", e.message);
}

// 2. إعدادات PayPal
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = process.env.PAYPAL_API_URL;

// 3. دالة الحصول على "رمز وصول" من PayPal
async function getPayPalAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${auth}` },
        body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    return data.access_token;
}

// 4. الدالة الرئيسية التي تستدعيها الواجهة
export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { orderID, userId, uses } = req.body;
        if (!orderID || !userId || !uses) {
            return res.status(400).send('Missing required data');
        }

        const accessToken = await getPayPalAccessToken();

        // 5. التحقق من الدفع (الخطوة الأهم)
        // نتصل بـ PayPal بأنفسنا لنتأكد أن العميل دفع فعلاً
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const captureData = await response.json();

        if (captureData.status === 'COMPLETED') {
            // 6. الدفع ناجح! قم بإنشاء المفتاح في Firebase
            const randomPart = Math.random().toString(36).substr(2, 9).toUpperCase();
            const newApiKey = `SKY-${userId.slice(0, 5).toUpperCase()}-${randomPart}`;

            const db = getDatabase();
            await db.ref(`api_keys/${newApiKey}`).set({
                owner_uid: userId,
                uses: parseInt(uses),
                created_at: new Date().toISOString(),
                payment_id: captureData.id, // حفظ معرف الدفع
            });

            console.log(`تم إنشاء مفتاح للمستخدم ${userId} بـ ${uses} استخدام`);
            // 7. أرسل رسالة نجاح للواجهة
            res.status(200).json({ success: true, message: 'Key created successfully' });

        } else {
            // الدفع فشل أو لم يكتمل
            console.error("PayPal capture failed:", captureData);
            res.status(400).json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
