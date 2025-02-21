# Personal Finance Tracker

## 📌 Overview

This is a **Personal Finance Tracking Web Application** built with **Next.js, React, MongoDB, and ShadCN UI**. It allows users to manage their expenses by adding, editing, and removing transactions. The app also provides a **monthly expenses chart** using **Recharts**.

## 🚀 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, ShadCN UI
- **Backend:** Next.js API Routes, MongoDB
- **UI Components:** ShadCN UI
- **Charts:** Recharts
- **Version Control:** Git & GitHub
- **Deployment:** Vercel

## ✨ Features

- Add new transactions with title, amount, category, date, and type.
- Edit or delete existing transactions.
- View a **list of transactions**.
- **Visualize monthly expenses** using Recharts.
- Fully responsive UI with **ShadCN UI components**.

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Chad-007/finance-tracker.git
cd finance-tracker
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:3000`

## 📊 Monthly Expenses Chart

The **Monthly Expense Chart** is implemented using **Recharts** to visualize the expenses dynamically.

## 🔥 ShadCN UI Setup

ShadCN UI has been successfully initialized. You can add new UI components using:

```bash
npx shadcn-ui add [component-name]
```

## 🚀 Deployment

The app is deployed on **Vercel**.

To deploy manually:

```bash
vercel
```

## 📌 Troubleshooting

If you encounter issues with ShadCN UI or dependencies, try:

```bash
npx shadcn-ui init
```

If GitHub rejects your push due to conflicts:

```bash
git pull --rebase origin main
git push origin main
```
