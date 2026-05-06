import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const updated = await Order.findByIdAndUpdate(
      id,
      {
        status: body.status,
      },
      { new: true },
    );

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
