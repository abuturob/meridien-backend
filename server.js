const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram sozlamalari - o'zingiznikini qo'yasiz
const TELEGRAM_BOT_TOKEN = 'BOT_TOKEN_BU_YERGA'; 
const TELEGRAM_CHAT_ID = 'CHAT_ID_BU_YERGA'; // Guruh yoki kanal ID

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // HTML faylingiz shu papkada bo'ladi

// Zayavkalarni saqlash uchun oddiy JSON "baza"
const DB_PATH = path.join(__dirname, 'leads.json');
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, '[]');
}

// Forma yuborilganda ishlaydi
app.post('/api/lead', async (req, res) => {
  try {
    const { name, phone, package, message } = req.body;

    // 1. Validatsiya
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: "Ism va telefon majburiy" });
    }

    // 2. Bazaga saqlash
    const leads = JSON.parse(fs.readFileSync(DB_PATH));
    const newLead = {
      id: Date.now(),
      name,
      phone,
      package: package || "Tanlanmagan",
      message: message || "Izoh yo'q",
      date: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })
    };
    leads.push(newLead);
    fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));

    // 3. Telegramga yuborish
    const telegramText = `
🔥 Yangi Zayavka - Meridien Tibbiy Turizm

👤 Ism: ${name}
📞 Telefon: ${phone}
📦 Paket: ${package}
💬 Izoh: ${message}

⏰ Vaqt: ${newLead.date}
    `;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramText,
      parse_mode: 'HTML'
    });

    res.json({ success: true, message: "Zayavka qabul qilindi!" });

  } catch (error) {
    console.error('Xatolik:', error);
    res.status(500).json({ success: false, error: "Server xatosi" });
  }
});

// Hamma zayavkalarni ko'rish uchun - admin panel
app.get('/api/leads', (req, res) => {
  const leads = JSON.parse(fs.readFileSync(DB_PATH));
  res.json(leads.reverse()); // Eng yangisi tepada
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlamoqda`);
});