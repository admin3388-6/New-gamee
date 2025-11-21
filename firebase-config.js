// firebase-config.js
// هذا الملف يحتوي على إعدادات الاتصال بـ Firebase ويتم استدعاؤه في كل الصفحات

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

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// دالة عامة لتحديث واجهة الهيدر (زر الدخول/البروفايل)
// سنستخدم هذه الدالة في كل الصفحات لاختصار الكود
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

// تصدير الوظائف لاستخدامها في الملفات الأخرى
export { 
    app, 
    auth, 
    db, 
    googleProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged, 
    ref, 
    set, 
    get, 
    child, 
    push, 
    serverTimestamp,
    updateAuthUI 
};