import CommonListing from "@/components/CommonListing";
import connectToDB from "@/database";
import Product from "@/models/product";

export default async function WomenAllProducts() {
  await connectToDB();
  const getAllProducts = await Product.find({ category: "woman" }).lean();

  return <CommonListing data={getAllProducts} />;
}