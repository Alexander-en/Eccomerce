"use client";

import { GlobalContext } from "@/context";
import { getOrderDetails } from "@/services/order";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";

export default function OrderDetails() {
    const {
        pageLevelLoader,
        setPageLevelLoader,
        orderDetails,
        setOrderDetails,
        user,
    } = useContext(GlobalContext);

    const params = useParams();
    const router = useRouter();

    async function extractOrderDetails() {
        setPageLevelLoader(true);

        const res = await getOrderDetails(params["order-details"]);

        if (res.success) {
            setOrderDetails(res.data);
        }

        setPageLevelLoader(false);
    }

    useEffect(() => {
        extractOrderDetails();
    }, []);

    if (pageLevelLoader) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
                <PulseLoader color="#000000" size={20} />
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        Order not found
                    </h2>

                    <button
                        onClick={() => router.push("/orders")}
                        className="mt-5 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const isProcessing = orderDetails.isProcessing;

    const orderDate = orderDetails.createdAt
        ? new Date(orderDetails.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    return (
        <section className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back */}
                <button
                    onClick={() => router.push("/orders")}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
                >
                    <span className="text-lg">←</span>
                    Back to Orders
                </button>

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                Order #{orderDetails._id}
                            </h1>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${isProcessing
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {isProcessing ? "Processing" : "Delivered"}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Placed on {orderDate}
                        </p>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* LEFT SIDE */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Order Items */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Order Summary
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {orderDetails.orderItems?.length || 0}{" "}
                                    {orderDetails.orderItems?.length === 1
                                        ? "item"
                                        : "items"}{" "}
                                    in this order
                                </p>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {orderDetails.orderItems?.map((item) => (
                                    <div key={item._id} className="flex flex-col items-center gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                            <img
                                                src={item?.product?.imageUrl || "/placeholder.png"}
                                                alt={item?.product?.name || "Product"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1 text-center sm:text-left">
                                            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                                                {item?.product?.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Product
                                            </p>
                                        </div>

                                        <div className="text-center sm:text-right">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Price
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-gray-900">
                                                ${item?.product?.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        className="h-5 w-5 text-gray-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.8"
                                            d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"
                                        />

                                        <circle
                                            cx="12"
                                            cy="10"
                                            r="2.5"
                                            strokeWidth="1.8"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        Shipping Address
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Delivery information
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                                <p className="font-semibold text-gray-900">
                                    {user?.name}
                                </p>

                                <p>
                                    {orderDetails?.shippingAddress?.address}
                                </p>

                                <p>
                                    {orderDetails?.shippingAddress?.city},{" "}
                                    {orderDetails?.shippingAddress?.postalCode}
                                </p>

                                <p>
                                    {orderDetails?.shippingAddress?.country}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-6">
                        {/* Payment Summary */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                Payment Summary
                            </h2>

                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        ${orderDetails.totalPrice}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Shipping
                                    </span>

                                    <span className="font-medium text-green-600">
                                        Free
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-gray-900">
                                            Total
                                        </span>

                                        <span className="text-2xl font-bold text-gray-900">
                                            ${orderDetails.totalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                Customer Details
                            </h2>

                            <div className="mt-5 space-y-5">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Name
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {user?.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-sm font-medium text-gray-900">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Status */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                Order Status
                            </h2>

                            <div className="mt-5 flex items-start gap-3">
                                <div
                                    className={`mt-1 h-3 w-3 shrink-0 rounded-full ${isProcessing
                                            ? "bg-yellow-400"
                                            : "bg-green-500"
                                        }`}
                                />

                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {isProcessing
                                            ? "Order is being processed"
                                            : "Order has been delivered"}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        {isProcessing
                                            ? "We'll update your order once it has been delivered."
                                            : "Your order has successfully reached its destination."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Shop Again */}
                        <button
                            onClick={() => router.push("/")}
                            className="w-full rounded-xl bg-black px-6 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
                        >
                            Shop Again
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}