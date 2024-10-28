import { t } from '../trpc';
import { z } from 'zod';
import { prisma } from '../prisma';
import { Order, OrderWithoutId } from '../types/order';

export const orderRouter = t.router({
  getOrders: t.procedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      status: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const orders = await prisma.order.findMany({
          where: {
            status: input.status,
          },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          include: { order_items: true },
        });
        return orders.map(order => ({
          ...order,
          order_items: order.order_items.map(item => ({
            id: item.id,
            order_id: item.order_id,
            product: item.product,
            quantity: item.quantity,
          }))
        })) as Order[]; 
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
      }
    }),
});
