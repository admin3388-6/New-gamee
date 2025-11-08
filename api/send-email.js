// هذا الكود سيعمل على الخادم (Vercel Serverless Function)
// هنا يمكننا الوصول إلى المتغيرات الحساسة!

import fetch from 'node-fetch'; // يجب التأكد من توفر هذه الحزمة في بيئة Vercel

// جلب المتغيرات الحساسة من بيئة Vercel
const ONESIGNAL_APP_ID = process.env.VITE_ONESIGNAL_APP_ID;
const ONESIGNAL_AUTH = process.env.ONESIGNAL_REST_KEY; 

export default async function (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { email, action } = req.body; // نستقبل البريد والإجراء (تسجيل/إعادة اشتراك)

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        let subject = "✅ شكراً لاشتراكك في SkyData!";
        let body_content = `
          <h3>مرحباً بك في SkyData!</h3>
          <p>شكراً جزيلاً لاشتراكك في قائمتنا البريدية. سيصلك الآن أحدث الأخبار والتحديثات.</p>
          <p>يمكنك إلغاء الاشتراك في أي وقت عبر صفحة إدارة الاشتراكات.</p>
          <hr>
          <p>فريق SkyData يتمنى لك يوماً سعيداً!</p>
        `;

        if (action === 'resubscribe') {
             subject = "✅ شكراً لإعادة اشتراكك في SkyData!";
             body_content = `
                <h3>مرحباً بك مجدداً!</h3>
                <p>تم تأكيد إعادة اشتراكك في قائمتنا البريدية. سيصلك الآن أحدث الأخبار والتحديثات.</p>
                <p>يمكنك إلغاء الاشتراك في أي وقت عبر هذه الصفحة.</p>
                <hr>
                <p>فريق SkyData.</p>
            `;
        }

        const oneSignalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ONESIGNAL_AUTH, // 🛑 المفتاح السري يُستخدم هنا فقط
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                include_email_tokens: [email],
                email_subject: subject,
                email_body: body_content
            })
        });

        const data = await oneSignalResponse.json();

        if (oneSignalResponse.ok) {
            res.status(200).json({ success: true, message: 'Email sent via proxy', oneSignalData: data });
        } else {
            console.error("OneSignal Error:", data);
            res.status(oneSignalResponse.status).json({ success: false, message: 'OneSignal API Error', details: data });
        }

    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
