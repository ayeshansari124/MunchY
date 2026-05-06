import mongoose, { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema({
  name: String,
  image: String,
  quantity: Number,

  selectedSize: {
    name: String,
    price: Number,
  },

  selectedExtras: [
    {
      name: String,
      price: Number,
    },
  ],

  finalPrice: Number,
});

const AddressSchema = new Schema({
  phone: String,
  street: String,
  city: String,
  postalCode: String,
  country: String,
});

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    userEmail: String,

    customerName: String,

    items: [OrderItemSchema],

    address: AddressSchema,

    total: Number,

    paid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Order = models.Order || model("Order", OrderSchema);

export default Order;
