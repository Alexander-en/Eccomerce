import CommonListing from "@/components/CommonListing";
import connectToDB from "@/database";
import Product from "@/models/product";


export default async function AdminAllProducts() {
  await connectToDB();
  const getAllProducts = await Product.find({}).lean();

  return <CommonListing data={getAllProducts} />;
}