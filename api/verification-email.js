// الملف: api/send-verification-email.js
// هذا الكود يعمل على خادم Vercel الآمن

// استيراد مكتبات Firebase Admin لإنشاء الرابط (يجب أن تكون Vercel قادرة على تثبيتها)
// سنحتاج إلى ملف "firebase-admin-key.json" في الخطوة التالية
import admin from 'firebase-admin';

// ------------------------------------------------------------------
// ❗️❗️ إعدادات Firebase Admin (مهم جداً) ❗️❗️
// ------------------------------------------------------------------
// ستحتاج إلى جلب هذه المفاتيح من إعدادات Firebase
// اذهب إلى: Project Settings > Service Accounts > Generate new private key
// سيتم تحميل ملف JSON. انسخ محتوياته إلى متغيرات البيئة في Vercel

// تحقق مما إذا كان التطبيق قد تم تهيئته بالفعل (ضروري لبيئة Vercel)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // إصلاح تنسيق المفتاح
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL, // أضف هذا من إعدادات Firebase
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}
// ------------------------------------------------------------------

export default async function handler(req, res) {
  // 1. التأكد أن الطلب هو POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    // 2. قراءة البيانات القادمة من login.html
    const { email, template_id } = req.body;

    if (!email || !template_id) {
      return res.status(400).json({ message: 'Missing fields: email or template_id' });
    }

    // 3. جلب مفاتيح OneSignal السرية
    const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
    const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

    // 4. [جديد] إنشاء رابط تفعيل Firebase
    // هذا الرابط يشير إلى صفحة verify.html التي أنشأناها
    const actionLink = await admin.auth().generateEmailVerificationLink(email, {
      url: 'https://skydata.kozow.com/verify.html', // ❗️ استبدل هذا برابط موقعك
    });

    // 5. تجهيز الطلب إلى OneSignal
    const body = {
      app_id: ONESIGNAL_APP_ID,
      template_id: template_id,
      
      // إرسال البريد إلى الإيميل المحدد
      include_aliases: {
        "email": [email]
      },

      // هذا هو أهم جزء: إرسال الرابط كمتغير للقالب
      custom_data: {
        "verification_link": actionLink 
      }
    };

    // 6. إرسال الطلب إلى OneSignal
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return res.status(200).json({ success: true, onesignalResponse: data });

  } catch (error) {
    console.error("Handler Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
