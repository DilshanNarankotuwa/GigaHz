# GigaHz

### Homepage
![Homepage](screenshots/home.png)
**GigaHz** is a PC-building + shopping platform with a **Build Your Own PC** flow that prevents invalid builds using **real compatibility rules** (socket, RAM type, power budgeting, and more).

This repo contains:
- `gigahz-frontend` (client)
- `gigahz-backend` (API server)

---

## ✨ Key Features
- **Build Your Own PC** flow (step-by-step parts selection)
- **Compatibility validation** to prevent impossible builds
  - CPU ↔ Motherboard socket matching  
  - RAM ↔ Motherboard RAM type constraints  
  - PSU wattage budgeting vs estimated system power  
  - (Extendable for GPU length, case form factor, etc.)
- **Product catalog browsing** by category (CPUs, motherboards, GPUs, RAM, storage, PSU, etc.)
- **Clean UI + portfolio-grade structure** (frontend separated from backend)

---

## 🧱 Tech Stack
### Frontend
- React (SPA)
- UI + styling: CSS / Tailwind (depending on your setup)

### Backend
- Node.js + Express (REST API)
- PostgreSQL (data storage)
- Prisma (ORM), if enabled in your backend setup

> Repo languages show primarily **JavaScript + CSS + HTML**, consistent with a JS full-stack project. :contentReference[oaicite:2]{index=2}

---

## 🗂️ Monorepo Structure
```txt
GigaHz/
  gigahz-frontend/   # client app
  gigahz-backend/    # API server
