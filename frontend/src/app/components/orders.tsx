"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  id: number;
  order_id: number;
  product: string;
  quantity: number;
}

interface Order {
  id: number;
  customer_name: string;
  address: string;
  status: string;
  order_items: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = {
        input: JSON.stringify({
          page,
          limit,
        }),
      };

      if (status) {
        params.input = JSON.stringify({
          ...JSON.parse(params.input), 
          status,
        });
      }

      const response = await axios.get("http://localhost:4000/trpc/orders.getOrders", { params });

      console.log("Response data:", response.data); 
      setOrders(response.data.result.data || []); 
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, status]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>
      
      {/* Filter Options */}
      <div className="mb-4">
        <label className="mr-2">Status:</label>
        <select
          value={status || ""}
          onChange={(e) => setStatus(e.target.value || null)} 
          className="border p-1 mr-4 text-black"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Canceled">Canceled</option>
        </select>

        <label className="mr-2">Limit:</label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border p-1 mr-4 text-black"
        />
        
        <label className="mr-2">Page:</label>
        <input
          type="number"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          className="border p-1 text-black"
        />
      </div>
      
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="min-w-full bg-white border text-black">
          <thead>
            <tr>
              <th className="py-2 border-b">Order ID</th>
              <th className="py-2 border-b">Customer Name</th>
              <th className="py-2 border-b">Address</th>
              <th className="py-2 border-b">Status</th>
              <th className="py-2 border-b">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="p-2 border-b">{order.id}</td>
                <td className="p-2 border-b">{order.customer_name}</td>
                <td className="p-2 border-b">{order.address}</td>
                <td className="p-2 border-b">{order.status}</td>
                <td className="p-2 border-b">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.product}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
