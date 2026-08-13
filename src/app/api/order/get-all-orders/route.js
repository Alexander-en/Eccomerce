import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(req);

    if (!isAuthUser) {
      return NextResponse.json({
        success: false,
        message: "You are not authticated",
      });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Please login in!",
      });
    }

    const extractAllOrders = await Order.find({ user: id })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: extractAllOrders || [],
      message: extractAllOrders.length ? "Orders fetched successfully" : "No orders found",
    });
  } catch (e) {
    console.error("Get orders error:", e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}