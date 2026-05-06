import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { ok, fail } from "@/lib/response";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    await connectDB();

    const orders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return ok(orders);
  } catch {
    return fail("Unauthorized", 401);
  }
}
