import CommonListing from "@/components/CommonListing";
import connectToDB from "@/database";
import Product from "@/models/product";

export default async function KidsAllProducts() {
  await connectToDB();
  const getAllProducts = await Product.find({ category: "kid" }).lean();

  return <CommonListing data={getAllProducts} />;
}