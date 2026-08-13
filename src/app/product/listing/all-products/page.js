import CommonListing from "@/components/CommonListing";
import { getAllAdminProducts } from "@/services/product";


export default async function AdminAllProducts() {
  const getAllProducts = await getAllAdminProducts();

  return <CommonListing data={getAllProducts && getAllProducts.data} />;
}