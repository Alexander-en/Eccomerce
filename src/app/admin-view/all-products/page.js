import CommonListing from "@/components/CommonListing";
import { getAllAdminProducts } from "@/services/product";
export const dynamic = "force-dynamic";
export default async function AllProducts() {
  const getAllProducts = await getAllAdminProducts();
  console.log("All products: " ,getAllProducts)

  return <CommonListing data={getAllProducts && getAllProducts.data} />;
}