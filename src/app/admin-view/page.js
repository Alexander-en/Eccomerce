


// 'use client'

// import { useContext, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { GlobalContext } from "@/context";

// export default function AdminView(){
//     const router = useRouter();
//     const { isHydrated, isAuthUser, user } = useContext(GlobalContext);

//     useEffect(() => {
//         if (isHydrated && (!isAuthUser || user?.role !== "admin")) {
//             router.replace("/");
//         }
//     }, [isHydrated, isAuthUser, user, router]);

//     if (!isHydrated) {
//         return <div className="p-8">Loading...</div>
//     }

//     return(
//         <div className="p-8">Admin View !</div>
//     )
// }



"use client";

import ComponentLevelLoader from "@/components/Loader/componentLevelLoader";
import { GlobalContext } from "@/context";
import {
  getAllOrdersForAllUsers,
  updateStatusOfOrder,
} from "@/services/order";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";

export default function AdminView() {
  const {
    allOrdersForAllUsers,
    setAllOrdersForAllUsers,
    user,
    pageLevelLoader,
    setPageLevelLoader,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  async function extractAllOrdersForAllUsers() {
    setPageLevelLoader(true);

    const res = await getAllOrdersForAllUsers();

    if (res?.success) {
      setAllOrdersForAllUsers(Array.isArray(res.data) ? res.data : []);
    } else {
      setAllOrdersForAllUsers([]);
    }

    setPageLevelLoader(false);
  }

  useEffect(() => {
    if (user !== null) {
      extractAllOrdersForAllUsers();
    }
  }, [user]);

  async function handleUpdateOrderStatus(getItem) {
    setComponentLevelLoader({
      loading: true,
      id: getItem._id,
    });

    const res = await updateStatusOfOrder({
      ...getItem,
      isProcessing: false,
    });

    if (res?.success) {
      setComponentLevelLoader({
        loading: false,
        id: "",
      });

      extractAllOrdersForAllUsers();
    } else {
      setComponentLevelLoader({
        loading: false,
        id: "",
      });
    }
  }

  if (pageLevelLoader) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <PulseLoader color="#000000" size={12} />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Administration
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Orders
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage customer orders and update their delivery status.
              </p>
            </div>

            {/* Total Orders */}
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Total Orders
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {allOrdersForAllUsers?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {allOrdersForAllUsers?.length ? (
          <div className="space-y-5">
            {allOrdersForAllUsers.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Order ID + Status */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900">
                          Order #{item._id}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.isProcessing
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.isProcessing
                            ? "Processing"
                            : "Delivered"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.orderItems?.length || 0}{" "}
                        {item.orderItems?.length === 1
                          ? "product"
                          : "products"}{" "}
                        in this order
                      </p>
                    </div>

                    {/* Customer Information */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Customer
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {item?.user?.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 max-w-55 truncate text-sm font-medium text-gray-700">
                          {item?.user?.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          ${item?.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Products */}
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Products
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {item.orderItems?.map((orderItem, index) => (
                          <div
                            key={index}
                            className="group h-20 w-20 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                          >
                            <img
                              src={
                                orderItem?.product?.imageUrl ||
                                "/placeholder.png"
                              }
                              alt={
                                orderItem?.product?.name ||
                                "Order Item"
                              }
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                      {/* Current Status */}
                      <div
                        className={`flex items-center justify-center rounded-lg px-5 py-3 text-xs font-semibold uppercase tracking-wide ${
                          item.isProcessing
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {item.isProcessing
                          ? "Order is Processing"
                          : "Order is Delivered"}
                      </div>

                      {/* Update Button */}
                      <button
                        onClick={() => handleUpdateOrderStatus(item)}
                        disabled={!item.isProcessing}
                        className="min-w-47.5 rounded-lg bg-black px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                      >
                        {componentLevelLoader?.loading &&
                        componentLevelLoader?.id === item._id ? (
                          <ComponentLevelLoader
                            text="Updating..."
                            color="#ffffff"
                            loading={componentLevelLoader.loading}
                          />
                        ) : item.isProcessing ? (
                          "Mark as Delivered"
                        ) : (
                          "Already Delivered"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a4 4 0 00-8 0v2"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              No customer orders
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no orders to manage.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}