import type { ApiRouteConfig, Handlers } from 'motia';
import { success, z } from 'zod';

const orderSubmissionSchema = z.object({
  orderId: z.string().uuid(),
  customerName: z.string().min(1),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().min(1)
    })
  ),
  totalAmount: z.number().min(0)
});


export const config: ApiRouteConfig = {
  name: 'orderSubmissionAPI',
  type: 'api',
  path: '/api/order',
  method: 'POST',
  description: 'Receives  request and emits event',
  emits: ['receive-order-event'],
  flows: ['receive-order-event-flow'],
  responseSchema: {
    200: z.object({
      message: z.string(),
      status: z.string(),
      appName: z.string()
    })
  }
};

export const handler = async ( req:any , {emit , logger, state}:any) => {
 try {
  logger.info('Received order submission request', { body: req.body });

  const jobId = Math.random().toString(36).substring(7);
  await state.set(`job ${jobId}`, {
    status: 'pending',
    timestamp: new Date().toISOString()
  });


    const result = orderSubmissionSchema.safeParse(req.body);
    if (!result.success) {
      logger.error('Invalid request body', { errors: result.error });
      return {
        status: 400,
        body: {
          message: 'Invalid request body',
          status: 'error'
        }
      };
    }

  
  const appName = state?.appName || 'UnknownApp';
  const timestamp = new Date().toISOString();

  const order = result.data;

  logger.info('Order API endpoint called', { appName, timestamp });

  await emit({
    topic: 'order.created',
    data: {
      orderId: order.orderId,
      customerName: order.customerName,
      items: order.items,
      totalAmount: order.totalAmount,
      timestamp,
      appName,
      requestId: Math.random().toString(36).substring(7)
    }
  });
  
  return {
    status: 200,
    body: {
      success:true,
      message: 'Order received successfully',
      status: 'success',
      appName:" event emitted",
    }
  };
  } catch (error) {
    logger.error('Error processing order submission', { error });
    return {
      status: 500,
      body: {
        message: 'Internal server error',
        status: 'error'
      }
    };
  }

};
