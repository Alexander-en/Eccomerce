import CommonListing from "@/components/CommonListing";
import connectToDB from "@/database";
import Product from "@/models/product";

export const dynamic = "force-dynamic";

export default async function KidsAllProducts() {
  await connectToDB();
  const getAllProducts = await Product.find({ category: { $in: ["kids", "kid"] } }).lean();

  return <CommonListing data={JSON.parse(JSON.stringify(getAllProducts))} />;
}