import CommonListing from "@/components/CommonListing";
import connectToDB from "@/database";
import Product from "@/models/product";

export const dynamic = "force-dynamic";

export default async function MenAllProducts() {
  await connectToDB();
  const getAllProducts = await Product.find({ category: "men" }).lean();

  return <CommonListing data={getAllProducts} />;
}