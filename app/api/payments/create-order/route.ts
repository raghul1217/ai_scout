import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createOrderForPlan } from "@/lib/payments/razorpay";
import { z } from "zod";

const createOrderSchema = z.object({
  planId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to initiate checkout." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId } = createOrderSchema.parse(body);

    const orderData = await createOrderForPlan(planId, user.id);

    return NextResponse.json(orderData);
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment order." },
      { status: 400 }
    );
  }
}
