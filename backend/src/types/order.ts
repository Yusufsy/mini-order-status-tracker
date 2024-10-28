import { z } from "zod";

export const OrderItem = z.object({
  id: z.number(),
  order_id: z.number(),
  product: z.string(),
  quantity: z.number(),
});

export const OrderItemWithoutId = OrderItem.omit({ id: true });

export const Order = z.object({
  id: z.number(),
  customer_name: z.string(),
  address: z.string(),
  status: z.string(),
  order_items: z.array(OrderItem),
});

export const OrderWithoutId = Order.omit({ id: true, order_items: true }).extend({
  order_items: z.array(OrderItemWithoutId),
});

export type Order = z.infer<typeof Order>;
export type OrderWithoutId = z.infer<typeof OrderWithoutId>;
export type OrderItem = z.infer<typeof OrderItem>;
export type OrderItemWithoutId = z.infer<typeof OrderItemWithoutId>;
