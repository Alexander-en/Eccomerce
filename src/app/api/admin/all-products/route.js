import connectToDB from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const extractAllproducts = await Product.find({});

    if (extractAllproducts && extractAllproducts.length) {
      return NextResponse.json({
        success: true,
        data: extractAllproducts,
      });
    }

    return NextResponse.json({
      success: false,
      status: 204,
      message: "No Products found",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}