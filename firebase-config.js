// firebase-config.js
// إعدادات الاتصال والحماية المركزية

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    set, 
    get, 
    child, 
    push, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// استيراد مكتبة App Check للحماية من السبام والبوتات
import { 
    initializeAppCheck, 
    ReCaptchaV3Provider 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app-check.js";

// إعدادات مشروعك
const firebaseConfig = {
    apiKey: "AIzaSyAw_EI5sOrqvxWn-5DZgG_t0rgF910T-wE",
    authDomain: "skydata-ai.firebaseapp.com",
    databaseURL: "https://skydata-ai-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "skydata-ai",
    storageBucket: "skydata-ai.firebasestorage.app",
    messagingSenderId: "165531796197",
    appId: "1:165531796197:web:8dcd76fc9ec5dedb994a0c",
    measurementId: "G-JYS7P7FY3Z"
};

// 1. تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// 2. تفعيل الحماية (App Check)
// استبدل 'YOUR_RECAPTCHA_V3_SITE_KEY' بمفتاحك الحقيقي من الخطوة السابقة
try {
    // تفعيل وضع التصحيح محلياً (اختياري، يساعدك أثناء التطوير على localhost)
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

    initializeAppCheck(app, {
        // المفتاح العام الذي حصلت عليه من كونسول reCAPTCHA v3
        provider: new ReCaptchaV3Provider('6LcFHxMsAAAAAE4lAelw_z56QzIj_UoMKBTl2Lel'),
        
        // تجديد التوكن تلقائياً لضمان استمرار الاتصال
        isTokenAutoRefreshEnabled: true
    });
    console.log("🛡️ Firebase App Check Activated!");
} catch (e) {
    console.warn("App Check Warning:", e);
}

// 3. تهيئة الخدمات
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// دالة تحديث واجهة المستخدم (تستخدم في كل الصفحات)
function updateAuthUI() {
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        const ico = authLink.querySelector('i');
        const txt = authLink.querySelector('span');
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
                authLink.href = 'menu.html';
                if (ico) ico.className = 'fas fa-user-circle';
                if (txt) txt.textContent = 'ملف الشخصي';
            } else {
                authLink.href = 'login.html';
                if (ico) ico.className = 'fas fa-sign-in-alt';
                if (txt) txt.textContent = 'تسجيل الدخول';
            }
        });
    }
}

// التصدير
export { 
    app, auth, db, googleProvider, 
    signInWithPopup, signOut, onAuthStateChanged, 
    ref, set, get, child, push, serverTimestamp,
    updateAuthUI 
};