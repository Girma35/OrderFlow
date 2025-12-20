# 🚀 MVP Setup Guide - OrderFlow

This guide will help you set up OrderFlow for MVP/demo purposes.

## ✅ What's Been Fixed/Improved

### Security Fixes
- ✅ **Removed hardcoded MongoDB credentials** - Now uses environment variables only
- ✅ **Added .env.example files** - Template for environment configuration

### Feature Completions
- ✅ **Fraud Guard Implementation** - Basic fraud detection with multiple rules:
  - High order amount detection (>$10,000)
  - Multiple failed payments tracking
  - Suspicious bulk orders
  - Rapid successive orders
  - Failed high-value payment flagging

- ✅ **Dashboard Stats API** - Real-time statistics endpoint:
  - Total orders (last 7 days)
  - Revenue calculation
  - Active alerts count
  - Fulfillment rate
  - Recent orders list

- ✅ **Alerts API** - Notification endpoint for frontend polling

- ✅ **Order Tracking API** - Proper order tracking endpoint

### Frontend Updates
- ✅ **Real Dashboard Data** - Connected to backend API instead of mock data
- ✅ **Auto-refresh** - Dashboard refreshes every 10 seconds
- ✅ **Better Error Handling** - Graceful fallbacks

### Workflow Fixes
- ✅ **Delivery Step** - Fixed subscription to listen to `order.completed` event
- ✅ **Order Persistence** - Orders now saved to MongoDB for dashboard stats

---

## 📋 Setup Instructions

### 1. Backend Setup

```bash
cd backend_motia

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your MongoDB URI
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orderflow?retryWrites=true&w=majority
```

**Important**: You must set `MONGODB_URI` in your `.env` file. The hardcoded credentials have been removed for security.

### 2. Frontend Setup

```bash
cd front_end_next

# Install dependencies
npm install

# Create .env file (optional, defaults to localhost:3000)
cp .env.example .env
```

### 3. Seed Inventory (Optional but Recommended)

```bash
cd backend_motia
npm run seed:inventory
```

This will populate your database with sample products for stores X, Y, and Z.

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend_motia
npm run dev
```

Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd front_end_next
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🎯 Demo Flow

### 1. Submit an Order
- Navigate to `http://localhost:5173`
- Fill out the order form
- Select a store (X, Y, or Z)
- Submit the order

### 2. Watch the Workflow
- Open Motia Workbench: `http://localhost:3000/_motia`
- See the order flow through:
  - Order Creation → Payment Processing → Inventory Update → Fulfillment → Delivery

### 3. View Dashboard
- Click "Overview" in the navigation
- See real-time stats:
  - Total orders
  - Revenue
  - Active alerts
  - Fulfillment rate
  - Recent orders table

### 4. Track Order
- After submitting, click "Track"
- See real-time order status updates
- Watch delivery progress

---

## 🔍 Key Features for Demo

### Fraud Detection
- Submit multiple orders with high amounts (>$10,000)
- Submit orders with very high quantities (>100)
- Watch fraud guard flag suspicious orders

### Real-time Notifications
- Alerts appear automatically for:
  - Payment failures
  - Inventory threshold warnings
  - Order completions
  - Inventory errors

### Dashboard Analytics
- Real-time order statistics
- Revenue tracking
- Fulfillment rate monitoring
- Recent orders timeline

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- **Error**: "MONGODB_URI environment variable is required"
- **Solution**: Create `.env` file in `backend_motia/` with your MongoDB URI

### Dashboard Shows Zero Stats
- **Cause**: No orders in database yet
- **Solution**: Submit a few orders first, or seed the database

### Alerts Not Showing
- **Cause**: No recent events triggered
- **Solution**: Submit orders, wait for payment processing, or trigger inventory threshold

### Order Tracking Not Working
- **Cause**: Order not found or API error
- **Solution**: Check backend logs, ensure order was created successfully

---

## 📊 API Endpoints

### Order Submission
```
POST /api/order
Headers: x-store-id: X|Y|Z
Body: { orderId, customerName, items[], totalAmount }
```

### Dashboard Stats
```
GET /api/dashboard/stats
Headers: x-store-id: X|Y|Z
```

### Alerts
```
GET /api/alerts
Headers: x-store-id: X|Y|Z
```

### Order Tracking
```
GET /api/order/tracking/:orderId
Headers: x-store-id: X|Y|Z
```

---

## 🎨 Demo Tips

1. **Start with Inventory Seeding** - Makes demo smoother
2. **Submit Multiple Orders** - Shows workflow orchestration
3. **Use Different Stores** - Demonstrates multi-tenant support
4. **Watch Motia Workbench** - Visual workflow execution
5. **Monitor Dashboard** - Real-time stats updates
6. **Check Notifications** - Real-time alert system

---

## ✨ What Makes This MVP-Ready

- ✅ **Security**: No hardcoded credentials
- ✅ **Complete Features**: All major features implemented
- ✅ **Real Data**: No mock data, everything connected
- ✅ **Error Handling**: Graceful fallbacks
- ✅ **Documentation**: Clear setup instructions
- ✅ **Demo-Friendly**: Easy to demonstrate features

---

**Ready for Demo! 🚀**



