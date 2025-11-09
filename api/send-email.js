// الملف: api/send-email.js
// هذا الكود يعمل على خادم Vercel الآمن

export default async function handler(req, res) {
  // 1. التأكد أن الطلب هو POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    // 2. قراءة البيانات القادمة من الواجهة (مثل menu.html)
    const { external_user_id, template_id } = req.body;

    if (!external_user_id || !template_id) {
      return res.status(400).json({ message: 'Missing required fields: external_user_id or template_id' });
    }

    // 3. جلب المفاتيح السرية من Vercel
    const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
    const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      console.error("Secrets are missing in Vercel config");
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    // 4. تجهيز الطلب إلى OneSignal
    const body = {
      app_id: ONESIGNAL_APP_ID,
      template_id: template_id,
      
      // الإرسال للمستخدم المحدد
      include_external_user_ids: [external_user_id],
    };

    // 5. إرسال الطلب إلى OneSignal
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
    console.error("OneSignal API Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
