import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Sample data for orders
  const orderData = [];

  // Generate 20 sample orders
  for (let i = 1; i <= 20; i++) {
    const customerName = `Customer ${i}`;
    const address = `${i} Main St`;
    const status = i % 3 === 0 ? "Shipped" : i % 3 === 1 ? "Pending" : "Canceled"; // Alternate statuses
    const orderItems = [];

    // Randomly create between 1 and 3 order items
    const numberOfItems = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numberOfItems; j++) {
      orderItems.push({
        product: `Product ${String.fromCharCode(65 + j)}`, // A, B, C, etc.
        quantity: Math.floor(Math.random() * 5) + 1, // Random quantity between 1 and 5
      });
    }

    orderData.push({
      customer_name: customerName,
      address: address,
      status: status,
      order_items: {
        create: orderItems,
      },
    });
  }

  // Insert sample orders into the database
  for (const order of orderData) {
    await prisma.order.create({
      data: order,
    });
  }

  console.log("Sample data inserted!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
