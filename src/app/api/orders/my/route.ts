import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const user = await requireUser();

    const orders = await Order.find({
      user: user._id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
