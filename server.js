import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// عرض ملفات الموقع الثابتة (index.html, style.css, script.js...)
app.use(express.static(__dirname));

// توجيه أي رابط غير موجود إلى الصفحة الرئيسية
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
