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
   git clone https://github.com/abhishekkumar5115/GullyClean_Waste_management_system.git
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API=your_cloudinary_api_key
   CLOUDINARY_SECRET=your_cloudinary_api_secret
   ```

3. **Setup the Frontends (Citizen, Worker, Admin):**
   You will need to run `npm install` inside each of the three frontend directories:
   ```bash
   cd frontend && npm install
   cd ../worker && npm install
   cd ../admin && npm install
   ```

   For each frontend, create a `.env` file containing the deployed backend URL:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

---

## 🏃‍♂️ Running the System Locally

To test the full ecosystem locally, you will need to open **four** separate terminal windows.

1. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Citizen Portal:**
   ```bash
   cd frontend
   npm run dev
   # Accessible at http://localhost:5173
   ```

3. **Start the Worker Portal:**
   ```bash
   cd worker
   npm run dev
   # Accessible at http://localhost:5174
   ```

4. **Start the Admin Portal:**
   ```bash
   cd admin
   npm run dev
   # Accessible at http://localhost:5175
   ```

---

## 👨‍💻 Contributing

Pull requests are welcome! If you are introducing a new feature, please ensure that you add it to the correct portal logic (`frontend` for public actions, `worker` for task completion, and `admin` for oversight).
