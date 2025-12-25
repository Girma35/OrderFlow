# Motia Frontend - Component Integration Guide

## Overview

The Motia frontend is a **premium, enterprise-grade order processing interface** built with React, TypeScript, and Tailwind CSS. All components have been unified into a cohesive system with centralized type definitions and a beautiful tabbed dashboard interface.

## Architecture

### Component Structure

```
src/
├── components/           # Reusable UI components
│   ├── APIMonitor.tsx           # Idempotency & webhook monitoring
│   ├── DarkModeToggle.tsx       # Theme switcher
│   ├── DashboardOverview.tsx    # System metrics & analytics
│   ├── Footer.tsx               # App footer
│   ├── NotificationPopup.tsx    # Toast notifications
│   ├── PluginMarketplace.tsx    # Plugin management
│   ├── StoreManager.tsx         # Multi-tenant store management
│   ├── WorkflowBuilder.tsx      # Saga orchestration visualizer
│   └── index.ts                 # Barrel exports
├── pages/                # Page-level components
│   ├── DashboardPage.tsx        # Legacy dashboard (kept for reference)
│   ├── OrderFormPage.tsx        # Order submission form
│   ├── OrderTrackingPage.tsx    # Order tracking view
│   └── UnifiedDashboard.tsx     # ⭐ NEW: Integrated dashboard
├── types/                # TypeScript definitions
│   └── index.ts                 # Centralized type definitions
├── utils/                # Utility functions
│   └── api.ts                   # API client
├── App.tsx               # Main application
├── index.css             # Global styles
└── main.tsx              # Entry point
```

## Key Features

### 🎨 **Unified Dashboard**
The new `UnifiedDashboard` component integrates all dashboard features into a single, cohesive interface with five main sections:

1. **System Pulse** - Real-time platform metrics and traffic analytics
2. **Saga Engine** - Order orchestration state machine visualization
3. **Integrity** - Idempotency engine and webhook monitoring
4. **Plugins** - Hot-swappable extension module marketplace
5. **Tenants** - Multi-tenant isolation management

### 🔧 **Component Integration**

All components now use **centralized type definitions** from `src/types/index.ts`:

```typescript
import { OrderWorkflowStep, Plugin, Store, WebhookLog } from '../types';
```

### 📦 **Barrel Exports**

Components can be imported easily using the barrel export pattern:

```typescript
import { 
  DashboardOverview, 
  WorkflowBuilder, 
  APIMonitor 
} from '../components';
```

## Component Details

### 1. **DashboardOverview**
- Real-time system metrics (health, tenants, throughput, transactions)
- Traffic distribution charts
- System latency monitoring
- Anomalous activity tracking

### 2. **WorkflowBuilder**
- Visual saga orchestration
- Step-by-step order processing flow
- Merchant override controls
- Idempotency lock indicators

### 3. **APIMonitor**
- Idempotency-Key engine statistics
- Live webhook dispatcher logs
- Retry & recovery strategy information
- Integrity confidence metrics

### 4. **PluginMarketplace**
- Plugin installation and management
- Hot-swappable module system
- Sandboxed execution environment
- Hook subscription visualization

### 5. **StoreManager**
- Multi-tenant store listing
- Health status monitoring
- Revenue and throughput tracking
- Plugin usage per tenant

### 6. **NotificationPopup**
- Toast-style notifications
- Auto-dismiss with progress bar
- Type-based styling (success, error, warning, info)
- Glassmorphism effects

## Usage

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Navigating the Dashboard

The main navigation includes three views:

1. **Submit** - Order submission form
2. **Overview** - Unified dashboard with all components
3. **Track** - Order tracking (appears after submitting an order)

Within the **Overview** tab, use the tabbed interface to switch between:
- System Pulse
- Saga Engine
- Integrity
- Plugins
- Tenants

## Type System

All shared types are defined in `src/types/index.ts`:

```typescript
// Workflow
OrderWorkflowStep

// API & Webhooks
WebhookLog

// Plugins
Plugin
PluginStatus (enum)

// Stores
Store

// Dashboard
DashboardStats
OrderRecord

// Notifications
Notification
```

## Styling

The application uses:
- **Tailwind CSS** for utility-first styling
- **Glassmorphism** effects for premium UI
- **Dark mode** support with theme persistence
- **Custom animations** and micro-interactions
- **Gradient backgrounds** with aurora effects

## API Integration

The frontend connects to the backend via:
- `submitOrder()` - Submit new orders
- `fetchAlerts()` - Poll for notifications
- `fetchDashboardStats()` - Load dashboard metrics

## Best Practices

1. **Import from barrel exports** when using multiple components
2. **Use centralized types** for consistency
3. **Follow the component pattern** established in existing files
4. **Maintain dark mode compatibility** in all new components
5. **Use glassmorphism** for premium visual effects

## Future Enhancements

- [ ] Real-time WebSocket integration for live updates
- [ ] Advanced filtering and search in StoreManager
- [ ] Plugin upload and custom development portal
- [ ] Workflow builder drag-and-drop editor
- [ ] Advanced analytics and reporting

## Contributing

When adding new components:
1. Create the component in `src/components/`
2. Add types to `src/types/index.ts`
3. Export from `src/components/index.ts`
4. Update this README with component details

---

**Built with ❤️ for enterprise-grade order processing**
