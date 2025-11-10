// 1. استيراد المكتبات
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// 2. كود الإعداد الخاص بك (الجديد والصحيح)
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

// 3. تشغيل فايربيس وتصدير الخدمات
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);