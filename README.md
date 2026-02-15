# ⚡ GigaHz - Smart PC Building Platform

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📌 Overview

**GigaHz** is a full-stack PC-building + shopping platform designed to prevent invalid PC builds using real compatibility logic.

Unlike traditional e-commerce platforms, GigaHz enforces hardware constraints such as:

- CPU ↔ Motherboard socket compatibility  
- RAM type ↔ Motherboard support  
- PSU wattage budgeting vs estimated system power  
- Extendable validation logic (GPU size, case form factor, etc.)

This project demonstrates:

- Full-stack architecture  
- Constraint-based validation modeling  
- REST API design  
- Structured database schema  
- Clean frontend–backend separation  

---

## 🖥️ Screenshots

### Homepage
![Homepage](screenshots/home.png)

### Build Your PC Flow

### 🪛 Build Step 1 — Select CPU 
![Build Step 1](screenshots/build0.png)

![Build Step 2](screenshots/build1.png)

### 🪛 Build Step 2 — Select other parts
![Build Step 3](screenshots/build2.png)

### 🪛 Build Step 3 — AI suggestios 
![Build Step 4](screenshots/build3.png)

### Checkout Page

![Build Step 5](screenshots/build4.png)
---

## ✨ Key Features

- Step-by-step **Build Your Own PC** flow  
- Real-time compatibility validation  
- PSU power budgeting logic  
- Product catalog browsing by category  
- REST API–driven architecture  
- Monorepo project structure  

---

## 🏗️ Architecture

```
React Frontend  →  Express API  →  PostgreSQL Database
```

- Frontend handles UI + build flow interactions  
- Backend handles validation rules + data access  
- Database stores hardware components + constraints  

---

## 🧱 Tech Stack

### Frontend
- React (SPA)
- CSS / TailwindCSS
- Vite (if used)

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM (if enabled)

---

## 📂 Monorepo Structure

```
GigaHz/
│
├── gigahz-frontend/   # React client
└── gigahz-backend/    # Express API server
```

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/DilshanNarankotuwa/GigaHz.git
cd GigaHz
```

---

### 2️⃣ Backend Setup

```bash
cd gigahz-backend
npm install
```

Create a `.env` file inside `gigahz-backend`:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=gigahz
```

Start backend server:

```bash
npm run dev
```

API runs at:

```
http://localhost:3000
```

---

### 3️⃣ Frontend Setup

```bash
cd gigahz-frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🗄️ Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE gigahz;
```

If using Prisma:

```bash
npx prisma migrate dev
```

(Optional) Seed database with sample hardware data.

---

## 🔌 Example API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /products | Get all products |
| GET | /categories | Get all categories |
| POST | /builds | Create new PC build |
| GET | /builds/:id | Get saved build |

---

## 🌍 Deployment (Optional)

Frontend:
- Vercel
- Netlify

Backend:
- Railway
- Render

Database:
- Supabase
- Neon
- Railway PostgreSQL

---

## 👨‍💻 Author

**Dilshan Narankotuwa**  
Full Stack Developer | Systems-Oriented Engineer  

GitHub: https://github.com/DilshanNarankotuwa

---

## ⭐ Project Status

Active development.  
Designed as a portfolio-grade full-stack system demonstrating structured compatibility validation logic.
