interface ProductStock {
  [productName: string]: number;
}

export const inventory: ProductStock = {
  "Laptop": 25,
  "Smartphone": 50,
  "Headphones": 75,
  "Keyboard": 40,
  "Monitor": 30,
};

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
