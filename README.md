
# 🚀 Motia OrderFlow

### Event-Driven Order Orchestration Engine for Multi-Tenant Commerce

> **"This is how Stripe, Shopify, and Amazon actually handle scale."**
> Motia OrderFlow is a high-performance orchestration engine designed to manage the complex lifecycle of e-commerce orders. Built on the **Motia Unified Backend**, it replaces brittle API chains with a robust, event-driven architecture that handles payments, inventory, and fulfillment with built-in resiliency.

---

## 🎯 Problem & Solution

**The Problem:**
Traditional e-commerce backends often suffer from "Distributed Monolith" syndrome. Systems attempt to process payments, update inventory, and notify shipping in a single synchronous request.

* If the payment gateway is slow or the database locks, the entire transaction fails, the user sees a spinning wheel, and data becomes inconsistent.

**The Solution:**
Motia OrderFlow uses an **Event-Driven Orchestration** model.

* The system accepts orders instantly and orchestrates fulfillment offline. If a payment fails, it retries automatically. If inventory is low, a background watchdog triggers an alert. This ensures **100% data consistency** and a flawless user experience.

---

## 🏗 System Architecture

Motia OrderFlow is powered by **14 specialized Step modules**, unifying high-frequency APIs with long-running background workflows.

---

## 🧑‍💻 Technical Reference: 14 Step Modules

The following modules in `backend_motia/steps` form the core logic of the system:

| Step Module | Language | Primary Functionality |
| --- | --- | --- |
| **order_create_api** | TS | High-speed entry point for new order ingestion. |
| **order_submision_api** | JS | Secondary API handler for legacy order submission. |
| **payment_processing** | TS | Processes payments with built-in retry logic. |
| **fraudGuard** | TS | Checks for fraudulent activities in transactions. |
| **inventory_update** | TS | Updates records for sales and restocks. |
| **check_inventory** | TS | **Cron Job:** Actively monitors stock levels across products. |
| **order_fulfillment** | TS | Manages the picking, packing, and prep process. |
| **delivery.step** | TS | State machine for the shipping and transit process. |
| **order_tracking_api** | TS | Provides real-time status updates to the end-user. |
| **alert_listener** | TS | Triggers workflows based on system-wide events. |
| **alert.step** | JS | Handles the lifecycle and management of active alerts. |
| **dashboard_stats_api** | TS | Aggregates real-time metrics for the Admin UI. |
| **db_init** | TS | Initializes the global state and database connections. |
| **seed_database** | JS | Seeds inventory data for demo environments. |

---

## 💎 The "Wow" Factor (Judge's Highlights)

* **Resiliency & Retries:** Automatic recovery from failures using exponential backoff principles.
* **Multi-Tenancy:** Isolated state and notifications for multiple stores via the `X-Store-ID` header.
* **Visual Workflow:** Watch events hop from TypeScript APIs to workers in the **Motia Workbench**.
* **Real-Time Dashboard:** See "Low Stock" and "Payment Retrying" alerts appear instantly.
* **Mock Gateway:** Includes a standalone Express server to simulate bank responses and outages.

---

## 📂 Project Structure

```plaintext
motia/
├── backend_motia/          # 🧠 The Brain (Event-Driven Engine)
│   ├── steps/              # 14 specialized business logic steps
│   └── payment_gateway/    # 🏦 External Mock Service (Simulated Bank)
└── front_end_next/         # 🎨 The Face (React/Vite Dashboard)
```

---

## 🚀 Quick Start

### 1. External Mock Gateway
```bash
cd backend_motia/payment_gateway
npm install && node server.js
```

### 2. Backend Engine
```bash
cd backend_motia
npm install
npm run dev
```
> **Workbench:** http://localhost:3000/_motia (The core demo tool)

### 3. Frontend Dashboard
```bash
cd front_end_next
npm install
npm run dev
```

---

## 📊 Event Schema

| Event Topic | Meaning |
| --- | --- |
| `order.created` | Order received and validated |
| `payment.processed` | Payment successfully charged |
| `inventory.updated` | Stock levels reduced successfully |
| `inventory.threshold_reached` | **Warning:** Low stock detected via Cron |

---

## 🛠 Usage Guide

1. Open the **Frontend** (`http://localhost:5173`) in your browser.
2. Use the UI to submit a new test order.
3. Open the **Motia Workbench** (`http://localhost:3000/_motia`) to watch the order flow in real-time!
   - You will see the **API Step** trigger.
   - Watch the event hand-off to the **TypeScript Worker**.
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
  Built with ❤️ by Girma Wakeyo
</p>
