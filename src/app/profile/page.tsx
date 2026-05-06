"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageSection from "@/components/layout/PageSection";
import SectionHeaders from "@/components/layout/SectionHeaders";
import Input from "@/components/ui/Input";

import { useUser } from "@/hooks/useUser";

export default function ProfilePage() {
  const { user, loading, fetchUser } = useUser();

  const [editing, setEditing] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders/my", {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();

      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center mt-20">Please login</p>;
  }

  function startEdit() {
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        postalCode: user.address?.postalCode || "",
        country: user.address?.country || "",
      },
    });

    setEditing(true);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      return toast.error("Update failed");
    }

    await fetchUser();

    setEditing(false);

    toast.success("Profile updated");
  }

  const fullAddress = [
    user.address?.street,
    user.address?.city,
    user.address?.state,
    user.address?.postalCode,
    user.address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  function getStatusColor(status: string) {
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
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <PageSection className="space-y-16">
      <SectionHeaders
        subHeader="Your Profile"
        mainHeader="Manage Your Account"
      />

      {/* PROFILE CARD */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        {!editing ? (
          <div className="space-y-6">
            <ProfileRow label="Name" value={user.name} />
            <ProfileRow label="Email" value={user.email} />
            <ProfileRow label="Phone" value={user.phone || "—"} />

            <div>
              <p className="text-xs uppercase tracking-wide text-red-700">
                Delivery Address
              </p>

              <p className="mt-2 text-gray-800 leading-relaxed">
                {fullAddress || "—"}
              </p>
            </div>

            <button
              onClick={startEdit}
              className="w-full bg-red-600 text-white py-3 rounded-full font-semibold"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={saveProfile} className="space-y-5">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(v) =>
                setForm({
                  ...form,
                  name: v,
                })
              }
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(v) =>
                setForm({
                  ...form,
                  phone: v,
                })
              }
            />

            <Input
              label="Street"
              value={form.address.street}
              onChange={(v) =>
                setForm({
                  ...form,
                  address: {
                    ...form.address,
                    street: v,
                  },
                })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                value={form.address.city}
                onChange={(v) =>
                  setForm({
                    ...form,
                    address: {
                      ...form.address,
                      city: v,
                    },
                  })
                }
              />

              <Input
                label="State"
                value={form.address.state}
                onChange={(v) =>
                  setForm({
                    ...form,
                    address: {
                      ...form.address,
                      state: v,
                    },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Postal"
                value={form.address.postalCode}
                onChange={(v) =>
                  setForm({
                    ...form,
                    address: {
                      ...form.address,
                      postalCode: v,
                    },
                  })
                }
              />

              <Input
                label="Country"
                value={form.address.country}
                onChange={(v) =>
                  setForm({
                    ...form,
                    address: {
                      ...form.address,
                      country: v,
                    },
                  })
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 rounded-full"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-3 rounded-full "
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* orders */}
      <div className="space-y-8">
        <SectionHeaders subHeader="Your Orders" mainHeader="Order History" />

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-12 text-center">
            <p className="text-2xl mb-2">🍔</p>

            <p className="text-lg font-semibold text-gray-700">No orders yet</p>

            <p className="text-sm text-gray-500 mt-1">
              Your delicious meals will appear here
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition"
              >
                {/* TOP */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        Order Placed
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize
                  ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "preparing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                  }
                `}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="mt-6 space-y-3">
                    {order.items.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-start gap-4"
                      >
                        <div>
                          <p className="font-medium text-gray-800 leading-snug">
                            {item.quantity}× {item.name}
                          </p>

                          {item.selectedSize?.name && (
                            <p className="text-sm text-gray-500 mt-0.5">
                              Size: {item.selectedSize.name}
                            </p>
                          )}

                          {item.selectedExtras?.length > 0 && (
                            <p className="text-sm text-gray-500 mt-0.5">
                              Extras:{" "}
                              {item.selectedExtras
                                .map((e: any) => e.name)
                                .join(", ")}
                            </p>
                          )}
                        </div>

                        <p className="font-semibold text-gray-700 whitespace-nowrap">
                          ₹
                          {item.finalPrice
                            ? item.finalPrice * item.quantity
                            : item.basePrice * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="border-t px-6 py-4 bg-gray-50 flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total Amount</p>

                  <p className="text-2xl font-extrabold text-red-600">
                    ₹{order.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageSection>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-red-700">{label}</p>

      <p className="text-lg font-medium text-gray-900">{value}</p>
    </div>
  );
}
