import { EventConfig } from "motia"

export const config: EventConfig = {
  name: 'fraudGuard',
  type: 'event',
  subscribes: ['payment.failed', 'fraud.check.requested'],
  emits: [
    'order.cleared',
    'order.flagged'
  ],
  flows: ['order-saga'],
};


export const handler = async (event: EventConfig) => {


}