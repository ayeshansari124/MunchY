"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Order = {
  _id: string;

  user?: {
    name: string;
  };

  items: any[];

  total: number;

  status: string;

  createdAt: string;
};

const statuses = [
  "pending",
  "preparing",
  "out-for-delivery",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function fetchOrders() {
    const res = await fetch("/api/admin/orders", {
      credentials: "include",
    });

    const data = await res.json();

    setOrders(data);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      return toast.error("Failed");
    }

    setOrders((prev) =>
      prev.map((o) =>
        o._id === id
          ? {
              ...o,
              status,
            }
          : o,
      ),
    );

    toast.success("Status updated");
  }

  function statusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "preparing":
        return "bg-blue-100 text-blue-700";

      case "out-for-delivery":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100";
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border rounded-2xl p-5 shadow-sm space-y-4"
        >
          {/* TOP */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold">#{order._id.slice(-6)}</p>

              <p className="text-sm text-gray-500">
                {order.user?.name || "Guest"}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                order.status,
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <div className="space-y-2 text-sm">
            {order.items.map((i: any, idx: number) => (
              <div key={idx}>
                <span className="font-medium">
                  {i.quantity}× {i.name}
                </span>

                {i.selectedSize?.name && (
                  <span className="text-gray-500">
                    {" "}
                    ({i.selectedSize.name})
                  </span>
                )}

                {i.selectedExtras?.length > 0 && (
                  <span className="text-gray-500">
                    {" "}
                    +{i.selectedExtras.length}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="text-red-600 text-xl font-bold">₹{order.total}</div>

          {/* STATUS SELECT */}
          <select
            value={order.status}
            onChange={(e) => updateStatus(order._id, e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
