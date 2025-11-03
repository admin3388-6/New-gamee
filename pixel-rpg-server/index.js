// هذا هو ملف الخادم: index.js

// 1. جلب الأدوات التي نحتاجها
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

// 2. إعداد الخادم الأساسي
const app = express();
const server = http.createServer(app);

// 3. إعداد Socket.io (الوسيط)
//    نحن نسمح لـ CORS (cors: { origin: "*" }) للسماح لملف اللعبة
//    (الذي سيكون على هاتفك أو Vercel) بالاتصال بالخادم.
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// 4. تحديد المنفذ (Port) الذي سيعمل عليه الخادم
//    Railway سيعطينا المنفذ (PORT) تلقائياً
const PORT = process.env.PORT || 3000;

// 5. هذا هو "لوب" الخادم الرئيسي - ماذا يحدث عند اتصال اللاعبين
io.on('connection', (socket) => {
  
  // "socket" هو اللاعب الفردي الذي اتصل للتو
  console.log('لاعب جديد اتصل:', socket.id);

  // === (أ) الاستماع للحركة ===
  // عندما يرسل اللاعب "playerMoved"، قم بإبلاغ "كل اللاعبين الآخرين"
  socket.on('playerMoved', (positionData) => {
    // positionData ستحتوي على { x: 100, y: 150 }
    socket.broadcast.emit('otherPlayerMoved', { 
      id: socket.id, 
      position: positionData 
    });
  });

  // === (ب) الاستماع للدردشة ===
  socket.on('chatMessage', (msg) => {
    // (هنا سنضيف فلترة الكلمات السيئة لاحقاً)
    console.log(`رسالة من ${socket.id}: ${msg}`);
    
    // إرسال الرسالة إلى "الجميع" (بما في ذلك المرسل)
    io.emit('chatMessage', { id: socket.id, text: msg });
  });

  // === (ج) الاستماع لانقطاع الاتصال ===
  socket.on('disconnect', () => {
    console.log('لاعب قطع الاتصال:', socket.id);
    // إبلاغ "كل اللاعبين الآخرين" أن هذا اللاعب قد غادر
    socket.broadcast.emit('playerDisconnected', socket.id);
  });

});


// 6. تشغيل الخادم
server.listen(PORT, () => {
  console.log(`*** الخادم يعمل الآن على المنفذ ${PORT} ***`);
});
