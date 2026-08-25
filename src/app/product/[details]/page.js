"use client";

import CommonDetails from "@/components/CommonDetails";
import { productById } from "@/services/product";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function getProduct() {
      const res = await productById(params.details);

      console.log(res, "sangam");

      setProduct(res?.data);
    }

    if (params.details) {
      getProduct();
    }
  }, [params.details]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return <CommonDetails item={product} />;
}