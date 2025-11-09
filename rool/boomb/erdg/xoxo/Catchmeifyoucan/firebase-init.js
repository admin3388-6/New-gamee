// 1. استيراد المكتبات
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// 2. كود الإعداد الخاص بك (نفسه)
const firebaseConfig = {
  apiKey: "AIzaSyD7QnPaJTYiawCz6SrtdBGT_NDeAPX9bBc",
  authDomain: "pixelrpg-5ebc3.firebaseapp.com",
  databaseURL: "https://pixelrpg-5ebc3-default-rtdb.europe-west1.firebasedabase.app",
  projectId: "pixelrpg-5ebc3",
  storageBucket: "pixelrpg-5ebc3.firebasestorage.app",
  messagingSenderId: "1041585714383",
  appId: "1:1041585714383:web:3f6912a5d6bddebe5573ba",
  measurementId: "G-8MENZDEGB1"
};

// 3. تشغيل فايربيس وتصدير الخدمات
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
