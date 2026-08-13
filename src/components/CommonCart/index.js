"use client"
import { useRouter } from "next/navigation";
import ComponentLevelLoader from "../Loader/componentLevelLoader";
export default function CommonCart({
    cartItems = [],
    handleDeleteCartItem,
    componentLevelLoader,
}
) {
    const router = useRouter()
    return (
        <section className="h-screen bg-gray-100 border border-gray-100">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-8  ">
                <div className="flow-root bg-white px-4 py-6 sm:px-8  shadow">


                    {cartItems && cartItems.length ? (
                        <ul>
                            {cartItems.map((cartItem) => (
                                <li
                                    key={cartItem._id}
                                    className="flex flex-col gap-4 py-6 border-b border-gray-200 sm:flex-row sm:items-center sm:gap-5"
                                >
                                    {/* Product Image */}
                                    <div className="shrink-0">
                                        <img
                                            src={cartItem?.productID?.imageUrl}
                                            alt="Product Image"
                                            className="h-24 w-24 sm:h-28 sm:w-28 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                        {/* Name */}
                                        <div className="min-w-0">
                                            <div className="font-semibold text-gray-900 wrap-break-word">
                                                {cartItem?.productID?.name}
                                            </div>
                                        </div>

                                        {/* Price + Remove */}
                                        <div className="flex items-center justify-between gap-6 sm:justify-end">
                                            <p className="font-semibold text-gray-950">
                                                ${cartItem?.productID?.price}
                                            </p>

                                            <button
                                                type="button"
                                                className="font-medium text-yellow-600 hover:text-yellow-700 cursor-pointer whitespace-nowrap"
                                                onClick={() =>
                                                    handleDeleteCartItem(cartItem._id)
                                                }
                                            >
                                                {componentLevelLoader &&
                                                    componentLevelLoader.loading &&
                                                    componentLevelLoader.id === cartItem._id ? (
                                                    <ComponentLevelLoader
                                                        text="Removing"
                                                        color="#ca8a04"
                                                        size={4}
                                                        loading={componentLevelLoader.loading}
                                                    />
                                                ) : (
                                                    "Remove"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (<h1 className="font-bold text-lg">Your cart is Empty !</h1>)}
                    <div className="border-y-gray-400 border-y py-3 space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400">Subtotal:</p>
                            <p className="text-lg text-black font-semibold">
                                $
                                {cartItems && cartItems.length
                                    ? cartItems.reduce(
                                        (total, item) => item.productID.price + total,
                                        0
                                    )
                                    : "0"}
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">Delivery Fee:</p>
                            <p className="text-lg text-black font-semibold">$0</p>
                        </div>
                    </div>
                        <div className="flex justify-between items-center my-3">
                            <p className="text-lg text-black font-bold">Total:</p>
                            <p className="text-2xl text-black font-semibold">$
                                {cartItems && cartItems.length
                                    ? cartItems.reduce(
                                        (total, item) => item.productID.price + total,
                                        0
                                    )
                                    : "0"}</p>
                        </div>
                        <button onClick={() => { router.push("/checkout"); }} disabled={cartItems && cartItems.length === 0} className=" mt-1.5 w-full justify-center bg-black text-white px-5 py-3 text-sm font-medium uppercase tracking-wide cursor-pointer disabled:opacity-50">Checkout</button>
                </div>
            </div>

        </section>
    )
}