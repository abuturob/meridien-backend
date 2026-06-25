const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// SOZLAMALAR - Bu yerlarni to'ldiring:
// =============================================
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'TOKEN_BU_YERGA';
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID   || 'CHAT_ID_BU_YERGA';
// =============================================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Leads bazasi fayli
const DB_PATH = path.join(__dirname, 'leads.json');
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, '[]');
}

// -----------------------------------------------
// Yordamchi funksiya: Telegramga xabar yuborish
// -----------------------------------------------
async function sendToTelegram(lead) {
  const text =
`🔥 <b>Yangi Zayavka — Meridien Tibbiy Turizm</b>

👤 <b>Ism:</b> ${lead.name}
📞 <b>Telefon:</b> ${lead.phone}
📦 <b>Paket:</b> ${lead.package}
💬 <b>Izoh:</b> ${lead.message}

⏰ <b>Vaqt:</b> ${lead.date}`;

  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML'
    },
    { timeout: 8000 }
  );
}

// -----------------------------------------------
// POST /api/lead — Yangi ariza qabul qilish
// -----------------------------------------------
app.post('/api/lead', async (req, res) => {
  try {
    const { name, phone, package: pkg, message } = req.body;

    // Validatsiya
    if (!name) {
      return res.status(400).json({ success: false, error: "Ism majburiy" });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: "Telefon majburiy" });
    }

    // Bazaga saqlash
    const leads = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const newLead = {
      id: Date.now(),
      name:    name.trim(),
      phone:   phone.trim(),
      package: pkg     ? pkg.trim()     : "Tanlanmagan",
      message: message ? message.trim() : "Izoh yo'q",
      date:    new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })
    };
    leads.push(newLead);
    fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));

    // Telegramga yuborish (xato bo'lsa ham javob qaytaradi)
    try {
      await sendToTelegram(newLead);
    } catch (tgErr) {
      console.error('Telegram xatosi:', tgErr.message);
      // Telegram xatosi bo'lsa ham foydalanuvchiga muvaffaqiyat ko'rsatamiz
    }

    return res.json({ success: true, message: "Zayavka qabul qilindi!" });

  } catch (error) {
    console.error('Server xatosi:', error);
    return res.status(500).json({ success: false, error: "Server xatosi yuz berdi" });
  }
});

// -----------------------------------------------
// GET /api/leads — Barcha arizalarni ko'rish
// -----------------------------------------------
app.get('/api/leads', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    return res.json(leads.reverse());
  } catch {
    return res.json([]);
  }
});

// -----------------------------------------------
// GET /api/health — Server ishlayotganini tekshirish
// -----------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// -----------------------------------------------
// Boshqa barcha route'larni index.html ga yo'naltirish
// -----------------------------------------------
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server http://localhost:${PORT} da ishlamoqda`);
});
