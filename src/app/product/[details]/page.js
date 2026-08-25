"use client";

import CommonDetails from "@/components/CommonDetails";
import { productById } from "@/services/product";
import { useParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "@/context";
import { PulseLoader } from "react-spinners";

export default function ProductDetails() {
  const params = useParams();

  const {
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function getProduct() {
      try {
        setPageLevelLoader(true);

        const res = await productById(params.details);

        console.log(res, "sangam");

        setProduct(res?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setPageLevelLoader(false);
      }
    }

    if (params.details) {
      getProduct();
    }
  }, [params.details, setPageLevelLoader]);

  if (!product) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color="#000000"
          loading={pageLevelLoader}
          size={30}
        />
      </div>
    );
  }

  return <CommonDetails item={product} />;
}