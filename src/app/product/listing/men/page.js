import CommonListing from "@/components/CommonListing";
import { productByCategory } from "@/services/product";
export const dynamic = "force-dynamic";
export default async function MenAllProducts() {
  const getAllProducts = await productByCategory("men");

  return <CommonListing data={getAllProducts && getAllProducts.data} />;
}