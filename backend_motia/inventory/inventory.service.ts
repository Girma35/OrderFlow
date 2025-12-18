interface ProductStock {
  [productName: string]: number;
}

export const inventory: ProductStock = {
  "Motia Smartwatch V2": 50,
  "Motia IoT Sensor Kit": 30,
  "Motia Pro Headset": 25,
  "Motia AI Dev Board": 15,
}

export async function decreaseStock(productName: string, quantity: number) {
  if (!inventory[productName]) {
    throw new Error(`Product "${productName}" does not exist in inventory`);
  }

  if (inventory[productName] < quantity) {
    throw new Error(`Not enough stock for "${productName}"`);
  }

  inventory[productName] -= quantity;
  return inventory[productName];
}

export async function getStock(productName: string) {
  return inventory[productName] || 0;
}

export async function listInventory() {
  return { ...inventory };
}
