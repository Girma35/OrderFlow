# Alerts System - Event-Driven Architecture

## Changes Made

### ✅ Alert Listener (Event-Driven Only)

**File**: `backend_motia/steps/alert/alert_listener.step.ts`

**Changes**:
- ✅ Only subscribes to 3 critical events:
  1. `order.created` - New order alerts
  2. `inventory.threshold_reached` - Low inventory alerts  
  3. `payment.failed` - Payment failure alerts

- ✅ Removed subscriptions to:
  - `order.completed` (not needed)
  - `inventory.failed` (not needed)
  - `payment.processed` (not needed)

- ✅ Simplified notification creation:
  - Only handles the 3 critical alert types
  - Better error messages with more context
  - Stores alerts in both MongoDB and Motia State

### ✅ Alerts API (Read-Only, Event-Driven)

**File**: `backend_motia/steps/alerts/alerts_api.step.ts`

**Changes**:
- ✅ **No events emitted** - API is read-only
- ✅ Prioritizes Motia State (event-driven alerts stored there)
- ✅ Falls back to MongoDB only if state is empty
- ✅ Filters alerts by type: `info`, `warning`, `error` only
- ✅ Updated description to clarify event-driven nature

## Alert Flow

```
1. Event Occurs
   ├─ order.created
   ├─ inventory.threshold_reached  
   └─ payment.failed

2. Alert Listener (Event Step)
   ├─ Subscribes to event
   ├─ Creates notification
   ├─ Saves to MongoDB
   └─ Updates Motia State

3. Frontend Polls API
   ├─ GET /api/alerts
   ├─ Reads from Motia State (fast)
   └─ Falls back to MongoDB if needed
```

## Alert Types

| Event | Alert Type | Title | Description |
|-------|-----------|-------|-------------|
| `order.created` | `info` | New Order Created | Order placed notification |
| `inventory.threshold_reached` | `warning` | Low Inventory Alert | Product below threshold |
| `payment.failed` | `error` | Payment Failed | Payment processing failed |

## Benefits

1. ✅ **Event-Driven**: Alerts created automatically when events occur
2. ✅ **No API Creation**: Alerts API is read-only
3. ✅ **Focused**: Only 3 critical alert types
4. ✅ **Fast**: Reads from Motia State first
5. ✅ **Reliable**: Falls back to MongoDB if needed

## Testing

To verify alerts are working:

1. **Order Created Alert**:
   - Create a new order via POST /api/order
   - Check alerts API - should show "New Order Created"

2. **Inventory Threshold Alert**:
   - Wait for cron job (every 2 minutes)
   - If product stock < threshold, alert should appear

3. **Payment Failed Alert**:
   - Create order with payment that fails
   - Alert should appear automatically

---

**Status**: ✅ **Alerts Now Event-Driven - Only 3 Critical Types**

