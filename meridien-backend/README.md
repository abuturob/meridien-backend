# 🏥 Meridien Tibbiy Turizm — Backend

Meridien sayohat agentligi veb-sayti uchun to'liq backend server.

---

## 📁 Loyiha tuzilmasi

```
meridien-backend/
├── public/
│   └── index.html       ← Sizning HTML saytingiz
├── server.js            ← Asosiy backend
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 GitHub ga yuklash (1-marta)

```bash
# 1. Papkaga kiring
cd meridien-backend

# 2. Git boshlash
git init
git add .
git commit -m "Initial commit"

# 3. GitHub da yangi repo yarating (github.com) va:
git remote add origin https://github.com/SIZNING_USERNAME/meridien-backend.git
git branch -M main
git push -u origin main
```

---

## 🌐 Render.com da bepul deploy qilish

1. **https://render.com** ga kiring (GitHub akkaunt bilan)
2. **"New +"** → **"Web Service"** bosing
3. GitHub repo'ingizni ulang
4. Quyidagi sozlamalarni kiriting:

| Maydon | Qiymat |
|--------|--------|
| **Name** | meridien-backend |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

5. **"Environment Variables"** bo'limida qo'shing:

| Key | Value |
|-----|-------|
| `TELEGRAM_BOT_TOKEN` | Botingiz tokeni |
| `TELEGRAM_CHAT_ID` | Guruh yoki kanal ID |

6. **"Create Web Service"** bosing → Deploy bo'ladi ✅

---

## 🤖 Telegram Bot sozlash

1. Telegram'da **@BotFather** ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting → **Token** olasiz
4. Botni guruhingizga qo'shing
5. **Chat ID** olish: `https://api.telegram.org/botTOKEN/getUpdates`

---

## 🔗 API Endpointlar

| Method | URL | Vazifasi |
|--------|-----|---------|
| `POST` | `/api/lead` | Yangi ariza qabul qilish |
| `GET` | `/api/leads` | Barcha arizalarni ko'rish |
| `GET` | `/api/health` | Server holatini tekshirish |

---

## 💻 Lokal test qilish

```bash
npm install
npm start
# http://localhost:3000 da ochiladi
```
