"use client";

import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { getAllOrdersForUser } from "@/services/order";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";





export default function order() {
    const {
        user,
        pageLevelLoader,
        setPageLevelLoader,
        allOrdersForUser,
        setAllOrdersForUser,
    } = useContext(GlobalContext);

    const router = useRouter();

    async function extractAllOrders() {
        setPageLevelLoader(true);
        const res = await getAllOrdersForUser(user?._id);

        if (res?.success) {
            setPageLevelLoader(false);

            setAllOrdersForUser(res.data);
            toast.success(res?.message, {
                position: "top-right",
            });
        } else {
            setPageLevelLoader(false);
            toast.error(res?.message, {
                position: "top-right",
            });
        }
    }

    useEffect(() => {
        if (user !== null) extractAllOrders();
    }, [user]);

    console.log(allOrdersForUser);

    if (pageLevelLoader) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <PulseLoader
                    color={"#000000"}
                    loading={pageLevelLoader}
                    size={30}
                    data-testid="loader"
                />
            </div>
        );

    }






    return (
        <section className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View and manage your recent orders.
                    </p>
                </div>

                {/* Orders */}
                {allOrdersForUser && allOrdersForUser.length ? (
                    <div className="space-y-5">
                        {allOrdersForUser.map((item) => (
                            <div
                                key={item._id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-sm font-semibold text-gray-900">
                                                Order #{item._id}
                                            </h2>

                                            {/* Status */}
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isProcessing
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {item.isProcessing ? "Processing" : "Delivered"}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Order details and purchased items
                                        </p>
                                    </div>

                                    {/* Total */}
                                    <div className="sm:text-right">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Total
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-gray-900">
                                            ${item.totalPrice}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="px-5 py-5 sm:px-6">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                        {/* Products */}
                                        <div className="flex min-w-0 items-center">
                                            <div className="flex -space-x-3">
                                                {item.orderItems
                                                    .slice(0, 4)
                                                    .map((orderItem, index) => (
                                                        <div
                                                            key={index}
                                                            className="h-16 w-16 overflow-hidden rounded-xl border-2 border-white bg-gray-100 shadow-sm"
                                                        >
                                                            <img
                                                                src={
                                                                    orderItem?.product?.imageUrl ||
                                                                    "/placeholder.png"
                                                                }
                                                                alt="Order item"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                            </div>

                                            <div className="ml-5">
                                                <p className="font-semibold text-gray-900">
                                                    {item.orderItems.length}{" "}
                                                    {item.orderItems.length === 1 ? "item" : "items"}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Products in this order
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <button
                                            onClick={() => router.push(`/orders/${item._id}`)}
                                            className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto cursor-pointer"
                                        >
                                            View Order Details
                                        </button>
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
                                    strokeWidth={1.5}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h14m-7-4v4"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-900">
                            No orders yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                            You haven't placed any orders yet. Start shopping to see your
                            orders here.
                        </p>

                        <button
                            onClick={() => router.push("/")}
                            className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>

            <Notification />
        </section>
    );
}