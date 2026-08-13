"use client";

import CommonCart from "@/components/CommonCart";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import Notification from "@/components/Notification";

export default function Cart() {
  const {
    user,
    setCartItems,
    cartItems,
    pageLevelLoader,
    setPageLevelLoader,
    isHydrated,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);

  async function extractAllCartItems() {
    setPageLevelLoader(true);
    const res = await getAllCartItems(user?._id);

    if (res.success) {
      const updatedData =
        res.data && res.data.length
          ? res.data.map((item) => ({
              ...item,
              productID: {
                ...item.productID,
                price:
                  item.productID.onSale === "yes"
                    ? parseInt(
                        (
                          item.productID.price -
                          item.productID.price * (item.productID.priceDrop / 100)
                        ).toFixed(2)
                      )
                    : item.productID.price,
              },
            }))
          : [];
      setCartItems(updatedData);
      setPageLevelLoader(false);
      localStorage.setItem("cartItems", JSON.stringify(updatedData));
    }

    console.log(res);
  }

  useEffect(() => {
    if (!isHydrated) return;

    if (user && Object.keys(user).length > 0) {
      extractAllCartItems();
    } else {
      setPageLevelLoader(false);
    }
  }, [isHydrated, user]);

  async function handleDeleteCartItem(getCartItemID) {
    setComponentLevelLoader({ loading: true, id: getCartItemID });
    const res = await deleteFromCart(getCartItemID);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: "top-right",
      });

      extractAllCartItems();
    } else {
      toast.error(res.message, {
        position: "top-right",
      });
      setComponentLevelLoader({ loading: false, id: getCartItemID });
    }
  }

  return (
    <div>
      <Notification />
      {pageLevelLoader ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <PulseLoader
            color={"#000000"}
            loading={pageLevelLoader}
            size={30}
            data-testid="loader"
          />
        </div>
      ) : (
        <CommonCart
          componentLevelLoader={componentLevelLoader}
          handleDeleteCartItem={handleDeleteCartItem}
          cartItems={cartItems}
        />
      )}
    </div>
  );
}