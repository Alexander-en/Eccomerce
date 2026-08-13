import CommonDetails from "@/components/CommonDetails";
import { productById } from "@/services/product";

export default async function ProductDetails({ params }) {
  const {details} = await params
  const productDetailsData = await productById(details);

  console.log(productDetailsData, "sangam");
    // condition && value
  return <CommonDetails item={productDetailsData?.data} />;
}