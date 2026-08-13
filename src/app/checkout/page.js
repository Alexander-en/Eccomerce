"use client";

import Notification from "@/components/Notification";
import { loadStripe } from "@stripe/stripe-js";
import { GlobalContext } from "@/context";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { fetchAllAddresses } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { callStripeSession } from "@/services/stripe";


export default function Checkout() {

    const {
        cartItems,
        user,
        addresses,
        setAddresses,
        checkoutFormData,
        setCheckoutFormData,
    } = useContext(GlobalContext);


    const [selectedAddress, setSelectedAddress] = useState(null)
    const [isOrderProcessing, setIsOrderProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const router = useRouter();
    const params = useSearchParams();

    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

    console.log(cartItems);

    async function getAllAddresses() {
        const res = await fetchAllAddresses(user?._id);

        if (res.success) {
            setAddresses(res.data);
        }
    }
    useEffect(() => {
        if (user !== null) getAllAddresses();
    }, [user]);



    useEffect(() => {
        async function createFinalOrder() {
            const isStripe = JSON.parse(localStorage.getItem("stripe"));

            if (
                isStripe &&
                params.get("status") === "success" &&
                cartItems &&
                cartItems.length > 0
            ) {
                setIsOrderProcessing(true);
                const getCheckoutFormData = JSON.parse(
                    localStorage.getItem("checkoutFormData")
                );

                const createFinalCheckoutFormData = {
                    user: user?._id,
                    shippingAddress: getCheckoutFormData.shippingAddress,
                    orderItems: cartItems.map((item) => ({
                        qty: 1,
                        product: item.productID,
                    })),
                    paymentMethod: "Stripe",
                    totalPrice: cartItems.reduce(
                        (total, item) => item.productID.price + total,
                        0
                    ),
                    isPaid: true,
                    isProcessing: true,
                    paidAt: new Date(),
                };

                const res = await createNewOrder(createFinalCheckoutFormData);

                if (res?.success) {
                    setIsOrderProcessing(false);
                    setOrderSuccess(true);
                    toast.success(res.message, {
                        position: "top-right",
                    });
                } else {
                    setIsOrderProcessing(false);
                    setOrderSuccess(false);
                    toast.error(res?.message || "Unable to complete order.", {
                        position: "top-right",
                    });
                }
            }
        }

        createFinalOrder();
    }, [params.get("status"), cartItems]);


    function handleSelectedAddress(getAddress) {
        if (getAddress._id === selectedAddress) {
            setSelectedAddress(null);
            setCheckoutFormData({
                ...checkoutFormData,
                shippingAddress: {},
            });

            return;
        }
        console.log("working")
        setSelectedAddress(getAddress._id);
        setCheckoutFormData({
            ...checkoutFormData,
            shippingAddress: {
                ...checkoutFormData.shippingAddress,
                fullName: getAddress.fullName,
                city: getAddress.city,
                country: getAddress.country,
                postalCode: getAddress.postalCode,
                address: getAddress.address,
            },
        });
    }


    async function handleCheckout() {
        try {
            const stripe = await stripePromise;

            const createLineItems = cartItems.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        images: [item.productID.imageUrl],
                        name: item.productID.name,
                    },
                    unit_amount: item.productID.price * 100,
                },
                quantity: 1,
            }));

            const res = await callStripeSession(createLineItems);

            // require either session id or session url
            if (!res || (!res.id && !res.url)) {
                console.error("Stripe session creation failed:", res);
                toast.error(res?.message || "Unable to initiate payment. Please try again.");
                setIsOrderProcessing(false);
                return;
            }

            // persist checkout info and attempt redirect
            localStorage.setItem("stripe", true);
            localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));

            if (!stripe || typeof stripe.redirectToCheckout !== "function") {
                toast.error("Stripe client failed to load. Please refresh and try again.");
                return;
            }

            // fallback: clear loader after 8s if redirect does not occur
            const fallbackTimer = setTimeout(() => {
                setIsOrderProcessing(false);
                toast.error("Payment redirect timed out. Please try again.");
            }, 8000);

            // Newer Stripe.js approach: server returns `session.url` for direct redirect
            if (res.url) {
                setIsOrderProcessing(true);
                window.location.href = res.url;
                return;
            }

            // Fallback to older redirectToCheckout if available
            setIsOrderProcessing(true);
            const { error } = await stripe.redirectToCheckout({ sessionId: res.id });
            clearTimeout(fallbackTimer);

            if (error) {
                console.error(error);
                toast.error("Stripe redirect failed. Please try again.");
                setIsOrderProcessing(false);
            }
        } catch (e) {
            console.error(e);
            toast.error("An error occurred during checkout. Please try again.");
            setIsOrderProcessing(false);
        }
    }

    console.log(checkoutFormData);

    useEffect(() => {
        if (orderSuccess) {
            setTimeout(() => {
                setOrderSuccess(true);
                router.push("/orders");
            }, [2000]);
        }
    }, [orderSuccess]);

    if (orderSuccess) {
        return (
            <section className="h-screen bg-gray-200">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8 ">
                        <div className="bg-white shadow">
                            <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                                <h1 className="font-bold text-lg">
                                    Your payment is successfull and you will be redirected to
                                    orders page in 2 seconds !
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (isOrderProcessing) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <PulseLoader
                    color={"#000000"}
                    loading={isOrderProcessing}
                    size={30}
                    data-testid="loader"
                />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-white py-8 sm:px-8 lg:px-16 xl:px-32">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                <div className="rounded-lg bg-gray-50 border border-white shadow py-4 px-2 space-y-4 flow-root h-fit">
                    <p className="text-xl font-bold mb-5">Cart Summary</p>
                    {cartItems && cartItems.length ? (
                        cartItems.map((item) => (
                            <div className="flex flex-col sm:flex-row border-gray-50 rounded-lg shadow p-4  items-center" key={item._id}>
                                <img src={item?.productID?.imageUrl} alt="" className="h-24 w-24 object-cover rounded-lg" />
                                <div className="flex w-full flex-col px-4 py-4 justify-center items-center sm:justify-start sm:items-start">
                                    <span className="font-bold">
                                        {item?.productID?.name}
                                    </span>
                                    <span className="font-semibold">
                                        {item?.productID?.price}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : <p className="font-bold tracking-wide text-2xl">Your cart is empty!</p>

                    }
                </div>
                <div className="border rounded-lg bg-gray-50 border-white shadow py-4 px-2 h-fit flex flex-col">
                    <div>
                        <p className="text-xl font-bold">Shipping Address details</p>
                        <p className="text-gray-400 font-bold">Complete your order by selecting address below</p>
                    </div>

                    <div className="space-y-4 mt-4">
                        {addresses && addresses.length ? (
                            addresses.map((item) => (
                                <div className={`p-4 border-gray-200 border cursor-pointer ${item._id === selectedAddress ? "border-red-900" : ""}
                                    `} key={item._id} onClick={() => handleSelectedAddress(item)}>
                                    <p>Name : {item.fullName}</p>
                                    <p>Address : {item.address}</p>
                                    <p>City : {item.city}</p>
                                    <p>Country : {item.country}</p>
                                    <p>PostalCode : {item.postalCode}</p>
                                    <button className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide cursor-pointer ">
                                        {item._id === selectedAddress
                                            ? "Selected Address"
                                            : "Select Address"}
                                    </button>
                                </div>

                            ))
                        ) : <p className="font-bold tracking-wide text-xl">No addresses added!</p>

                        }
                    </div>

                    <button
                        onClick={() => router.push("/account")}
                        className="mt-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide cursor-pointer"
                    >
                        Add new address
                    </button>

                </div>


            </div>

            <div className="mt-6 border p-4 border-gray-50 shadow ">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Subtotal</p>
                    <p className="text-lg font-bold text-gray-900">
                        $
                        {cartItems && cartItems.length
                            ? cartItems.reduce(
                                (total, item) => item.productID.price + total,
                                0
                            )
                            : "0"}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Shipping</p>
                    <p className="text-lg font-bold text-gray-900">Free</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                        $
                        {cartItems && cartItems.length
                            ? cartItems.reduce(
                                (total, item) => item.productID.price + total,
                                0
                            )
                            : "0"}
                    </p>
                </div>
                <div className="pb-10">
                    <button
                        disabled={
                            (cartItems && cartItems.length === 0) ||
                            Object.keys(checkoutFormData.shippingAddress).length === 0
                        }
                        onClick={() => { handleCheckout(); console.log("clicked") }}
                        className="disabled:opacity-50 mt-5 mr-5 w-full  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide cursor-pointer"
                    >
                        Checkout
                    </button>
                </div>
            </div>
            <Notification />
        </section>
    )
}