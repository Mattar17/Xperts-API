# 🚀 Xperts API

Production-ready RESTful API built with Node.js and Express, providing authentication, role-based authorization, posts, comments, admin management, and expert applications.

Deployed on Vercel with MongoDB as the database.

---

## 🌍 Live API

https://xperts-api.vercel.app/

---
## Xperts blog live demo:
https://xperts-frontend.vercel.app/

## 📬 Postman Documentation

Full API documentation with request/response examples:

👉 Postman Collection:  
https://documenter.getpostman.com/view/38403808/2sBXcDGgnK

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (file handling)
- Nodemailer (email verification)
- Vercel (Deployment)

---

# ✨ Features

## 🔐 Authentication & Authorization
- User registration & login
- JWT-based authentication
- Role-based access control (User / Admin)
- Change password
- Email verification
- API Key validation (production only)

---

## 👤 User Features
- View & update profile
- Upload profile picture
- Search users
- Apply as expert

---

## 📝 Posts & Comments
- Create / Update / Delete posts
- Like & interact with posts
- Add / Update / Delete comments
- Proper ownership validation
- Authorization checks

---

## 🛡 Admin Features
- Manage users
- Review expert applications
- Protected admin routes

---

## ⚡ Production Optimization

### 🔄 Cron Job (Keep-Alive Mechanism)

A cron job runs every **5 minutes** to:

- Keep the database connection hot
- Prevent cold starts on serverless deployment
- Improve API response time consistency

---

# 📂 Project Structure

```
├── controllers/
├── routers/
├── middlewares/
├── models/
├── utils/
├── config/
└── app.js
```

---

# 🧪 Running Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/xperts-api.git
cd xperts-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create .env File

```
DEV_CONNECTION_STRING = MONGO_URI
JWT_PRIVATE_KEY = jwt_private_key
GMAIL_PASSKEY = gmail_passkey
CLOUDINARY_CLOUD_NAME = cloudinary_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
SUPER_ADMIN_KEY = your_super_admin_key
API_KEY = your_api_key
```

### 4️⃣ Start Server

```bash
npm run dev
```

---

# 🔒 Environment Variables

| Variable      | Description |
|--------------|------------|
| MONGODB_URI  | MongoDB connection string |
| JWT_SECRET   | JWT signing secret |
| API_KEY      | Required in production for API access |
| NODE_ENV     | development / production |

---

# 📌 API Standards

- RESTful routing
- Proper HTTP status codes (200, 400, 403, 404, 500)
- Structured JSON responses
- Centralized error handling
- Secure middleware architecture

---

# 📈 Future Improvements

- API rate limiting
- Swagger documentation
- Unit & integration testing
- CI/CD pipeline

---

# 👨‍💻 Author

Mohamed Salah  
Backend Developer – Node.js
