# 🚀 Motia OrderFlow

> A next-generation full-stack application demonstrating the power of **Motia's Unified Backend** combined with a high-performance **React/Vite Frontend**.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech Stack](https://img.shields.io/badge/stack-Motia%20%7C%20React%20%7C%20TypeScript%20%7C%20Python-blueviolet)

## 📖 Overview

**Motia OrderFlow** represents a paradigm shift in backend development. By leveraging the **Motia** framework, this project unifies APIs, background jobs, and workflows into a single coherent system—without the need for complex infrastructure glue code.

This repository contains a full end-to-end demonstration:
- **Backend**: A polyglot system (TypeScript & Python) handling Order Submission and Payment Processing.
- **Frontend**: A sleek, responsive Dashboard built with React, Vite, and TailwindCSS.

---

## 🏗 Architecture

The project is organized as a monorepo with clear separation of concerns:

```mermaid
graph TD
    User[User] --> |HTTP| FE[Frontend (React + Vite)]
    FE --> |API Requests| BE[Backend (Motia Node)]
    
    subgraph "Backend (Motia Engine)"
        API[API Steps (TypeScript)]
        Worker[Worker Steps (Python)]
        State[Distributed State]
        
        API --> |Events| Worker
        Worker --> |Updates| State
    end
```

### 📂 Directory Structure

```plaintext
motia/
├── backend_motia/         # 🧠 The Brain
│   └── OrderFlow/         # Motia backend service
│       ├── steps/         # Business logic (API & Workers)
│       │   ├── order_submit/      # Order ingestion
│       │   └── payment_processing/# Payment logic
│       └── motia.config.ts # Engine config
│
└── front_end_next/        # 🎨 The Face
    ├── src/               # React source code
    ├── tailwind.config.js # Styling config
    └── vite.config.ts     # Build config
```

---

## ⚡ Features

### 🔌 Unified Backend (Motia)
- **Polyglot Runtime**: Seamlessly executes TypeScript steps in event-driven workflows.
- **Auto-scaling**: Built-in support for event-driven architecture.
- **Workflow Engine**: Manages complex `Order -> Payment -> Inventory -> Fulfillment -> Delivery` flows automatically.
- **Visual Debugging**: Includes **Motia Workbench** for visualizing step executions.
- **Fraud Detection**: Built-in fraud guard with multiple detection rules.
- **Real-time Analytics**: Dashboard stats API with live order tracking.

### 🎨 Modern Frontend
- **React 18**: Utilizing the latest hooks and patterns.
- **Vite**: Lightning-fast hot module replacement (HMR).
- **TailwindCSS**: Utility-first styling for a beautiful, responsive UI.
- **Real-time Updates**: Live dashboard stats and order tracking.
- **Dark Mode**: Full dark mode support with smooth transitions.

---

## 🚀 Getting Started

Follow these steps to get the entire system running locally.

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB Atlas account** (or local MongoDB instance)
- **npm** or **pnpm**

### ⚡ Quick Start (MVP Ready)

1. **Backend Setup:**
```bash
cd backend_motia

# Install dependencies
npm install

# Create .env file (REQUIRED - see .env.example)
# Add your MongoDB URI: MONGODB_URI=mongodb+srv://...

# Start the Motia Dev Server & Workbench
npm run dev
```
> Backend: `http://localhost:3000` | Workbench: `http://localhost:3000/_motia`

2. **Frontend Setup:**
```bash
cd front_end_next

# Install dependencies
npm install

# Start the Development Server
npm run dev
```
> Frontend: `http://localhost:5173`

3. **Seed Inventory (Optional but Recommended):**
```bash
cd backend_motia
npm run seed:inventory
```

**📋 For detailed setup instructions, see [MVP_SETUP.md](./MVP_SETUP.md)**

---

## 🛠 Usage Guide

1. Open the **Frontend** (`http://localhost:5173`) in your browser.
2. Use the UI to submit a new test order.
3. Open the **Motia Workbench** (`http://localhost:3000/_motia`) to watch the order flow in real-time!
   - You will see the **API Step** trigger.
   - Watch the event hand-off to the **Python Worker**.
   - Observe the final state updates.

---

## 🧩 Tech Stack Details

| Component | Technology | Description |
|-----------|------------|-------------|
| **Core Framework** | [Motia](https://motia.dev) | The unified backend primitive. |
| **Backend Langs** | TypeScript, Python | For logic and data processing. |
| **Frontend UI** | React + Tailwind | Component-based interactive UI. |
| **Build Tool** | Vite | Next-generation frontend tooling. |
| **Event Bus** | Motia Events | Implicitly managed event distribution. |

---

## 🤝 Contributing

We welcome contributions! Please see the `CONTRIBUTING.md` (coming soon) for details on how to submit pull requests, report issues, and request features.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  Built with ❤️ by the Girma Wakeyo
</p>
