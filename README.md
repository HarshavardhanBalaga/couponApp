# 🎟️ Round-Robin Coupon Distribution with Admin Panel

A full-stack web app that distributes coupons in a round-robin manner with abuse prevention and an admin panel.

## 🚀 Live Demo
- **User Side**: [Frontend URL](https://your-frontend.vercel.app)
- **Admin Panel**: [Admin URL](https://your-frontend.vercel.app/admin)

## 📌 Features
- 🎁 **Guest Users** can claim coupons without logging in.
- 🔄 **Round-Robin Distribution** ensures fair allocation.
- 🛡️ **Abuse Prevention** using **IP tracking & cookies**.
- 🏗️ **Admin Panel** for managing coupons, users, and history.
- ☁️ **Fully deployed on Render (Backend) & Vercel (Frontend).**

## 🛠️ Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **Auth:** JWT + HttpOnly Cookies
- **Deployment:** Render & Vercel

## 📝 Setup Locally
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Backend Setup
cd backend
npm install
npm run dev  # Runs on http://localhost:5000

# Frontend Setup
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
