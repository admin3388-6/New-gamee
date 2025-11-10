import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// عرض ملفاتك الثابتة (HTML / CSS / JS)
app.use(express.static(__dirname));

// أي مسار آخر غير معروف → يوجّه إلى index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Railway يعطيك منفذ PORT تلقائي
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
