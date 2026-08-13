'use client'
import { GlobalContext } from "@/context";
import { useContext } from "react";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/componentLevelLoader";
import { addToCart } from "@/services/cart";
import Notification from "../Notification";
import { useRouter } from "next/navigation";

export default function CommmonDetails({ item }) {
    const {
        setComponentLevelLoader,
        componentLevelLoader,
        user,
        setShowCartModal,
    } = useContext(GlobalContext);
    const router = useRouter();

    async function handleAddToCart(getItem) {
        if (!getItem?._id) {
            toast.error("Product is missing an id.", { position: "top-right" });
            return;
        }

        if (!user?._id) {
            toast.error("Please login first to add products to cart.", { position: "top-right" });
            router.push("/login");
            return;
        }

        setComponentLevelLoader({ loading: true, id: "" });

        const res = await addToCart({ productID: getItem._id, userID: user._id });

        if (res.success) {
            toast.success(res.message, {
                position: "top-right",
            });
            setComponentLevelLoader({ loading: false, id: "" });
            setShowCartModal(true);
        } else {
            toast.error(res.message, {
                position: "top-right",
            });
            setComponentLevelLoader({ loading: false, id: "" });
            setShowCartModal(true);
        }
    }

    if (!item) return null;

    return (
        <section className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-5 grid-cols-1 gap-12 lg:gap-16 mt-4 lg:mt-12 ">
                    <div className="lg:col-span-3 lg:row-end-1">
                        <div className="lg:flex lg:items-start">
                            <div className="lg:order-2 lg:ml-5">
                                <div className="max-w-xl  overflow-hidden rounded-lg">
                                    <img src={item.imageUrl} className="h-full w-full max-w-full object-cover" alt="Product Detail" />
                                </div>
                            </div>
                            <div className="lg:order-1 mt-2 w-full lg:w-32 lg:shrink-0">
                                <div className="flex flex-row items-start lg:flex-col mt-4 lg:mt-0">
                                    <button
                                        type="button"
                                        className="flex-none aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-100 text-center"
                                    >
                                        <img
                                            src={item.imageUrl}
                                            className="h-full w-full object-cover"
                                            alt="Product Details"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-none aspect-square mb-3 h-20 overflow-hidden rounded-lg  border-2 border-gray-100 text-center"
                                    >
                                        <img
                                            src={item.imageUrl}
                                            className="h-full w-full object-cover"
                                            alt="Product Details"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 lg:row-span-2">
                        <h1 className="font-bold text-2xl text-gray-900">{item?.name}</h1>
                        <div className="mt-10 flex flex-col sm:flex-row sm:space-y-0 space-y-4 items-center justify-between py-4 border-b border-gray-200">
                            <div className="flex items-end">
                                <h1 className={`text-3xl font-bold mr-4 ${item?.onSale === "yes" ? "line-through" : ''
                                    }`}>
                                    ${item?.price}
                                </h1>
                                {item.onSale === "yes" ? (
                                    <h1 className="text-3xl font-bold text-red-700">{`$${(
                                        item.price -
                                        item.price * (item.priceDrop / 100)
                                    ).toFixed(2)}`}</h1>
                                ) : null}
                            </div>
                            <button type="button" className="mt-1.5 inline-block bg-black px-3 py-2 text-sm font-medium uppercase tracking-wide text-white cursor-pointer" onClick={() => handleAddToCart(item)}>
                                {componentLevelLoader && componentLevelLoader.loading && item._id === componentLevelLoader.id ? (
                                    <ComponentLevelLoader
                                        text={"Adding to Cart"}
                                        color={"#ffffff"}
                                        loading={
                                            componentLevelLoader && componentLevelLoader.loading
                                        }
                                    />
                                ) : (
                                    "Add to Cart"
                                )}
                            </button>
                        </div>
                        <ul className="mt-8 space-y-2">
                            <li className="flex items-center text-left text-sm font-medium text-gray-600">{item?.deliveryInfo}</li>
                            <li className="flex items-center text-left text-sm font-medium text-gray-600">{"Cancel Anytime"}</li>
                        </ul>
                        <div className="lg:col-span-3">
                            <div className="border-b border-gray-400">
                                <nav className="flex gap-4">
                                    <a href="#" className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900">
                                        Description
                                    </a>
                                </nav>
                            </div>
                            <div className="mt-8 flow-root sm:mt-12 pb-6">
                                {item?.description}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Notification />
        </section>
    )
}