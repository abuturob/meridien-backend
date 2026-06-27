const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID   || '';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'meridien-backend', 'public')));

const DB_PATH = path.join(__dirname, 'leads.json');
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, '[]');
}

app.post('/api/lead', async (req, res) => {
  try {
    const { name, phone, package: pkg, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, error: "Ism va telefon majburiy" });
    }

    const leads = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const newLead = {
      id: Date.now(),
      name, phone,
      package: pkg || "Tanlanmagan",
      message: message || "Izoh yo'q",
      date: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })
    };
    leads.push(newLead);
    fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));

    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: `🔥 Yangi Zayavka\n\n👤 Ism: ${name}\n📞 Telefon: ${phone}\n📦 Paket: ${newLead.package}\n💬 Izoh: ${newLead.message}\n⏰ Vaqt: ${newLead.date}`,
        parse_mode: 'HTML'
      });
    } catch (tgErr) {
      console.error('Telegram xatosi:', tgErr.message);
    }

    res.json({ success: true, message: "Zayavka qabul qilindi!" });
  } catch (error) {
    console.error('Xatolik:', error);
    res.status(500).json({ success: false, error: "Server xatosi" });
  }
});

app.get('/api/leads', (req, res) => {
  const leads = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  res.json(leads.reverse());
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'meridien-backend', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT} portda ishlamoqda`);
});