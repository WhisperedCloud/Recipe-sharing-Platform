# 🍽️ Foodiespace - AI-Powered Recipe Platform

Welcome to **Foodiespace**, a full-stack, responsive web application that leverages the power of Artificial Intelligence to dynamically generate and share beautiful recipes!

## ✨ Features
* **🤖 AI Recipe Generation**: Powered by the hyper-fast **Groq AI (Llama 3)**, simply type what you're craving (e.g., "Spicy Garlic Pasta") and the AI will write a complete, structured recipe for you in seconds.
* **📸 Dynamic AI Photography**: Uses **Pollinations AI** to dynamically generate high-quality, professional food photography perfectly matching the generated recipe's title.
* **📱 Fully Responsive Design**: A beautiful, premium UI built with custom SCSS that looks stunning on desktops, tablets, and mobile devices.
* **☁️ Cloud Database**: Recipes, authors (Chefs), and metadata are securely stored in a cloud **PostgreSQL** database.

## 🛠️ Tech Stack
* **Frontend**: React.js, React Router, SCSS (Deployed on **Vercel**)
* **Backend**: Node.js, Express.js, Sequelize ORM, JWT Authentication (Deployed on **Render**)
* **Database**: PostgreSQL (Hosted on **Render**)
* **AI Integrations**: Groq Cloud API, Pollinations AI Image Generation

---

## 🚀 Live Demo
* **Frontend UI**: [https://foodiespace.vercel.app](https://foodiespace.vercel.app)
* **Backend API**: [https://recipe-sharing-platform-k1dx.onrender.com](https://recipe-sharing-platform-k1dx.onrender.com)

---

## 💻 Local Development Setup

If you want to run this project locally, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/WhisperedCloud/Recipe-sharing-Platform.git
cd Recipe-sharing-Platform
```

### 2. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory and add the following:
```env
PORT=5001
DB_NAME=recipe_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
JWT_SECRET=your_super_secret_jwt_key
GROK_API_KEY=your_groq_api_key_here
```
*(Make sure you have PostgreSQL installed and running locally, or replace the DB credentials with a cloud database).*

Start the backend server:
```bash
npm start
```

### 3. Setup the Frontend
Open a *new* terminal and navigate to the root folder:
```bash
npm install
```

Start the React frontend:
```bash
npm start
```
The application will open in your browser at `http://localhost:3000`.

---

## 🌍 Environment Variables (Production)

If deploying to production (like Vercel and Render), ensure you set the following environment variables in your respective dashboards:

**Frontend (Vercel)**
* `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`

**Backend (Render)**
* `DB_HOST` = `your_render_internal_db_host`
* `DB_NAME` = `your_render_db_name`
* `DB_USER` = `your_render_db_user`
* `DB_PASSWORD` = `your_render_db_password`
* `JWT_SECRET` = `a_secure_random_string`
* `GROK_API_KEY` = `your_groq_api_key`

---
*Built with ❤️ and AI.*
