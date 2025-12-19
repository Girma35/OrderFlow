import { CronConfig, Handlers } from 'motia';

export const config: CronConfig = {
  name: 'checkInventoryStep',
  type: 'cron', 
    description: 'Periodically checks inventory levels',
    cron: '0 */6 * * *', // Every 6 hours
 emits: ['inventory.threshold.reached'],
    flows: ['inventory-management-flow']
};
export const handler = async (input:any, { state, logger, emit }: any) => {
  const stores = ['X', 'Y', 'Z'];

  for (const storeId of stores) {
    try {
      logger.info(`Checking inventory for Store: ${storeId}`);

      const inventoryPath = `public/data/${storeId}/inventory`;
      const products = await state.getGroup(inventoryPath);

      for (const [productId, productData] of Object.entries(products)) {

        const threshold = productData.threshold || 10;
        if (productData.stock <= threshold) {
          logger.warn(`Inventory threshold reached for ${productData.productName} in Store ${storeId}`, {
            productId,
            currentStock: productData.stock,
            threshold
          });       
            await emit('inventory.threshold.reached', {
                storeId,
                productId,
                currentStock: productData.stock,
                threshold
            });
        }   
            // Update last checked timestamp
            

        if (productData.status === 'stale') {
          await state.set(`${inventoryPath}/${productId}`, {
            ...productData,
            lastChecked: new Date().toISOString(),
            status: 'active'
          });
        }
      }
    } catch (error) {
      logger.error(`Failed inventory update for Store ${storeId}`, { error });
    }
  }
  
  logger.info('Global daily inventory check completed.');
};