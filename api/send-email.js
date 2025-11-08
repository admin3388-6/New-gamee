// المسار: /api/send-email.js
// هذا الكود مصمم ليعمل على Vercel (Node.js)

// يتطلب تثبيت 'node-fetch' إذا كنت تستخدم إصدار Node.js أقدم من 18
// Vercel يدعم Fetch API افتراضياً، لذا قد لا تحتاج لتثبيته.
// إذا واجهت مشاكل، استخدم 'npm install node-fetch@2'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export default async function handler(req, res) {
  // 1. التأكد من أن الطلب هو POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. استخراج البيانات من الطلب القادم (من login.html)
  const { email, action, template_id } = req.body;

  // 3. التحقق من وجود البريد الإلكتروني
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // 4. (هام جداً!) إخفاء مفاتيح API الخاصة بك
  //    يجب عليك إضافتها كـ "Environment Variables" في إعدادات Vercel
  const ONESIGNAL_APP_ID = process.env.VITE_ONESIGNAL_APP_ID;
  const ONESIGNAL_REST_API_KEY = process.env.VITE_ONESIGNAL_REST_API_KEY;

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    console.error('Missing OneSignal Environment Variables');
    return res.status(500).json({ error: 'Server configuration error.' });
  }
  
  // 5. تجهيز البيانات لإرسالها إلى OneSignal
  const body = {
    app_id: ONESIGNAL_APP_ID,
    email_to: [email],
    
    // ⬇️⬇️ هذا هو التعديل ⬇️⬇️
    // سيستخدم القالب الذي أرسلته (Welcome)
    // إذا لم يتم إرسال template_id من login.html، سيستخدم القالب الافتراضي (للتوافق)
    template_id: template_id || 'DEFAULT_WELCOME_TEMPLATE_ID_HERE', // ⬅️ ضع هنا ID قالب ترحيب افتراضي إذا أردت
    
    // (اختياري) يمكنك إضافة اسم المستخدم هنا إذا أردت تخصيص القالب
    // "include_custom_data": {
    //   "user_name": "New User" 
    // }
  };

  // 6. إرسال الطلب إلى OneSignal
  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-F-8',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      // تم الإرسال بنجاح
      return res.status(200).json({ success: true, data: data });
    } else {
      // فشل الإرسال (خطأ من OneSignal)
      console.error('OneSignal Error:', data);
      return res.status(response.status).json({ error: 'Failed to send email', details: data });
    }

  } catch (error) {
    // فشل في الاتصال
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Server fetch error', details: error.message });
  }
}
