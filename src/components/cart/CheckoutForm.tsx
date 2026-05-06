"use client";

import Input from "@/components/ui/Input";
import Link from "next/link";

type Address = {
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

type CheckoutFormProps = {
  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
  onPay: () => void;
  total: number;
};

export default function CheckoutForm({
  address,
  setAddress,
  onPay,
  total,
}: CheckoutFormProps) {
  /* ================= CHECK IF PROFILE COMPLETE ================= */

  const isIncomplete =
    !address.phone.trim() ||
    !address.street.trim() ||
    !address.city.trim() ||
    !address.postalCode.trim() ||
    !address.country.trim();

  return (
    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Checkout</h2>

        <p className="text-sm text-gray-500 mt-1">
          Delivery details for your order
        </p>
      </div>

      {/* PHONE */}
      <Input
        label="Phone"
        value={address.phone}
        onChange={(v) =>
          setAddress((prev) => ({
            ...prev,
            phone: v,
          }))
        }
      />

      {/* STREET */}
      <Input
        label="Street"
        value={address.street}
        onChange={(v) =>
          setAddress((prev) => ({
            ...prev,
            street: v,
          }))
        }
      />

      {/* CITY + POSTAL */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="City"
          value={address.city}
          onChange={(v) =>
            setAddress((prev) => ({
              ...prev,
              city: v,
            }))
          }
        />

        <Input
          label="Postal Code"
          value={address.postalCode}
          onChange={(v) =>
            setAddress((prev) => ({
              ...prev,
              postalCode: v,
            }))
          }
        />
      </div>

      {/* COUNTRY */}
      <Input
        label="Country"
        value={address.country}
        onChange={(v) =>
          setAddress((prev) => ({
            ...prev,
            country: v,
          }))
        }
      />

      {/* WARNING */}
      {isIncomplete && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700 leading-relaxed">
            Please complete your delivery details before proceeding to payment.
          </p>

          <Link
            href="/profile"
            className="inline-block mt-2 text-sm font-semibold text-red-600 underline"
          >
            Go to Profile
          </Link>
        </div>
      )}

      {/* PAY BUTTON */}
      <button
        onClick={onPay}
        disabled={isIncomplete}
        className={`w-full py-3 rounded-full font-bold transition
          ${
            isIncomplete
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }
        `}
      >
        Pay ₹{total}
      </button>
    </div>
  );
}
