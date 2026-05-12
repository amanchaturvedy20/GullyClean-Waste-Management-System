# ♻️ Gully Clean: Smart Waste Management System

> **Smart. Efficient. Sustainable.**  
A technology-driven solution to make waste collection, monitoring, and disposal more efficient, eco-friendly, and transparent.

---

## 🚀 Features

- 📍 **Smart Bin Tracking** – Monitor bin levels in real-time.
- 🔔 **Automated Assignments** – Randomly auto-assign pickup requests to active workers.
- � **Photo Verification** – Workers and Citizens can upload pictures of bins (powered by Cloudinary).
- 📊 **Triple Portal Architecture** – Dedicated frontends for Citizens, Workers, and System Administrators.
- 📈 **Analytics Dashboard** – Detailed KPI tracking for total collected bins, assigned workers, and more.

---

## 🛠️ Tech Stack

- **Frontend Ecosystem:** React.js, Tailwind CSS, Vite, Redux Toolkit, React Router, React Query
- **Backend API:** Node.js, Express.js
- **Database:** MongoDB
- **File Storage:** Cloudinary (via `multer-storage-cloudinary`)
- **Authentication:** JWT with Bearer Tokens & LocalStorage

---

## � Project Structure & Architecture

This system is divided into **four** primary sub-projects to keep logic separated and secure:

```
GullyClean_Waste_management_system/
├── backend/    # Node.js API (Runs on Port 3000)
├── frontend/   # Citizen Public Portal (Runs on Port 5173)
├── worker/     # Worker Dashboard Portal (Runs on Port 5174)
└── admin/      # Admin Dashboard Portal (Runs on Port 5175)
```

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amanchaturvedy20/GullyClean-Waste-Management-System.git
   cd GullyClean-Waste-Management-System
   ```

2. **Install all dependencies:**
   From the root folder, run:
   ```bash
   npm install
   npm run install-all
   ```

3. **Setup Environment Variables:**
   - Create a `.env` file in the `backend` directory:
     ```env
     PORT=3000
     MONGO_URL=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API=your_cloudinary_api_key
     CLOUDINARY_SECRET=your_cloudinary_api_secret
     ```
   - For each frontend (`frontend`, `worker`, `admin`), create a `.env` file:
     ```env
     VITE_API_URL=http://localhost:3000/api
     ```

---

## 🏃‍♂️ Running the System Locally

We have integrated a **Unified Launcher Dashboard** that starts all four services automatically!

From the root project directory, simply run:
```bash
npm start
```

This single command will:
1. Open a beautiful **Launcher Dashboard** in your default web browser.
2. Automatically start the **Backend API**, **Citizen Portal**, **Worker Portal**, and **Admin Portal** in the background.
3. Show you live status indicators to confirm when each service is online.

*Press `Ctrl+C` in the terminal when you want to shut down all services.*

---

## 👨‍💻 Contributing

Pull requests are welcome! If you are introducing a new feature, please ensure that you add it to the correct portal logic (`frontend` for public actions, `worker` for task completion, and `admin` for oversight).
