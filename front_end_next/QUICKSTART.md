# 🚀 Quick Start Guide - Motia Frontend

## Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

## Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd front_end_next
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - React & React DOM
   - TypeScript
   - Tailwind CSS
   - Lucide React (icons)
   - Recharts (charts)
   - Axios (API client)
   - Vite (build tool)

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Navigate to `http://localhost:5173`
   - You should see the Motia application

## Using the Integrated Dashboard

### Main Navigation

The app has three main views accessible from the top navigation:

1. **Submit** 📝
   - Submit new orders
   - Fill in customer and product details
   - Select store configuration

2. **Overview** 📊 ⭐ **NEW UNIFIED DASHBOARD**
   - Access all dashboard components
   - Real-time metrics and analytics
   - System monitoring

3. **Track** 📍
   - Track submitted orders
   - View order status and timeline
   - (Appears after submitting an order)

### Dashboard Tabs

When you click **Overview**, you'll see 5 tabs:

#### 1. 📊 System Pulse
- Platform health metrics
- Active store tenants count
- API throughput statistics
- Transaction success rates
- Traffic distribution charts
- System latency monitoring
- Anomalous activity alerts

#### 2. 🔄 Saga Engine
- Visual order processing workflow
- Step-by-step saga orchestration
- Current processing status
- Merchant override controls
- Idempotency lock indicators
- Live log access

#### 3. 🛡️ Integrity
- Idempotency-Key engine statistics
- Duplicate attempt blocking metrics
- Live webhook dispatcher logs
- Retry & recovery strategies
- Exactly-once processing guarantees

#### 4. 🧩 Plugins
- Plugin marketplace
- Install/uninstall modules
- Enable/disable plugins
- View plugin hooks
- Sandboxed execution info
- Developer portal access

#### 5. 🏪 Tenants
- Multi-tenant store management
- Store health status
- Revenue tracking (24h)
- API throughput per tenant
- Active plugins per store
- Provision new tenants

## Features

### 🎨 Premium Design
- Glassmorphism effects
- Smooth animations
- Gradient backgrounds
- Aurora grid effects
- Professional typography

### 🌙 Dark Mode
- Click the moon/sun icon in the top-right
- Theme persists across sessions
- All components support dark mode

### 🔔 Notifications
- Real-time toast notifications
- Auto-dismiss with progress bar
- Type-based styling (success, error, warning, info)
- Appears in top-right corner

### 📱 Responsive
- Works on desktop, tablet, and mobile
- Adaptive layouts
- Touch-friendly controls

## Development

### Project Structure
```
src/
├── components/      # Reusable UI components
├── pages/          # Page-level components
├── types/          # TypeScript definitions
├── utils/          # Utility functions
├── App.tsx         # Main application
└── index.css       # Global styles
```

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking
npm run typecheck
```

### Making Changes

1. **Edit components** in `src/components/`
2. **Hot reload** will update the browser automatically
3. **Check types** with `npm run typecheck`
4. **Lint code** with `npm run lint`

## Connecting to Backend

The frontend expects the backend API to be running on:
- **Default**: `http://localhost:3000`

To change the API URL, update `src/utils/api.ts`:

```typescript
const API_BASE_URL = 'http://your-backend-url:port';
```

## Environment Variables

Create a `.env` file in the `front_end_next` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# Kill the process using the port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change the port in vite.config.ts
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npm run typecheck

# Check for lint errors
npm run lint
```

## Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Preview the build**:
   ```bash
   npm run preview
   ```

3. **Deploy**:
   - The `dist` folder contains the production build
   - Deploy to Vercel, Netlify, or any static hosting

## Next Steps

1. ✅ Explore all dashboard tabs
2. ✅ Submit a test order
3. ✅ Toggle dark mode
4. ✅ Check notifications
5. ✅ Review the code structure
6. ✅ Read `FRONTEND_README.md` for detailed documentation
7. ✅ Check `INTEGRATION_SUMMARY.md` for integration details

## Support

For issues or questions:
- Check the documentation in `FRONTEND_README.md`
- Review the integration summary in `INTEGRATION_SUMMARY.md`
- Inspect browser console for errors
- Check network tab for API issues

---

**Enjoy your unified Motia frontend! 🎉**
