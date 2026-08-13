'use client'
import { Fragment, useContext } from "react"
import CommonModal from "../CommonModal"
import { GlobalContext } from "@/context"
import { deleteFromCart, getAllCartItems } from "@/services/cart"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import ComponentLevelLoader from "../Loader/componentLevelLoader"
import { useEffect } from "react"

export default function CartModal() {
    const { showCartModal,
        setShowCartModal,
        cartItems,
        setCartItems,
        user,
        setComponentLevelLoader,
        componentLevelLoader, } = useContext(GlobalContext)
    const router = useRouter()

    async function extractAllCartItems() {
        const res = await getAllCartItems(user?._id)
        if (res?.success) {
            const updatedData = res.data ? res.data.map((item) => ({
                ...item,
                productID: {
                    ...item.productID,
                    price:
                        item.productID.onSale === "yes" ? parseInt(
                            (
                                item.productID.price -
                                item.productID.price * (item.productID.priceDrop / 100)
                            ).toFixed(2)
                        )
                            : item.productID.price,
                }

            })) : []
            setCartItems(updatedData)
            localStorage.setItem("cartItems", JSON.stringify(updatedData))
        }
    }

    useEffect(() => {
        if (user && Object.keys(user).length > 0) extractAllCartItems();
    }, [user]);

    async function handleDeleteCartItem(getCartItemID) {
        setComponentLevelLoader({ loading: true, id: getCartItemID })
        const res = await deleteFromCart(getCartItemID)
        if (res.success) {
            setComponentLevelLoader({ loading: false, id: "" })
            toast.success(res.message, {
                position: "top-right"
            })
            extractAllCartItems()
        }
        else {
            toast.error(res.message, {
                position: "top-right"
            })

            setComponentLevelLoader({ loading: false, id: getCartItemID })
        }

    }
    return (
        <CommonModal
            show={showCartModal} setShow={setShowCartModal}
            modalTitle={"Cart Panel"}
            showModalTitle={true}
            mainContent={cartItems && cartItems.length ? (
                <ul role="list" className="-my-6 divide-y divide-gray-300">
                    {cartItems.map((cartItem) => (
                        <li className="flex py-6" key={cartItem._id}>
                            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img src={cartItem?.productID?.imageUrl} alt="Cart Item" className="object-cover object-center h-full w-full" />
                            </div>
                            <div className="ml-4 flex flex-col flex-1">
                                <div className="flex flex-col">
                                    <div className="text-gray-900 text-sm font-medium">{cartItem?.productID?.name}</div>
                                    <p className="mt-1 text-sm text-gray-600">${cartItem?.productID?.price}</p>
                                </div>
                                <div className="items-end text-sm flex flex-1 justify-between">
                                    <button
                                        type="button"
                                        className="font-medium text-yellow-600 hover:text-yellow-700 sm:order-2 cursor-pointer"
                                        onClick={() => handleDeleteCartItem(cartItem._id)}
                                    >
                                        {componentLevelLoader &&
                                            componentLevelLoader.loading &&
                                            componentLevelLoader.id === cartItem._id ? (
                                            <ComponentLevelLoader
                                                text={"Removing"}
                                                color={"#ca8a04"}
                                                size={4}
                                                loading={
                                                    componentLevelLoader && componentLevelLoader.loading
                                                }
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

            ) : null}
            showButtons={true}
            buttonComponent={
                <Fragment>
                    <button onClick={() => { router.push("/cart"); setShowCartModal(false); }} className="mt-1.5 w-full justify-center bg-black text-white px-5 py-3 text-sm font-medium uppercase tracking-wide cursor-pointer">Go to Cart</button>
                    <button onClick={() => { router.push("/checkout"); setShowCartModal(false); }} disabled={cartItems && cartItems.length === 0} className=" mt-1.5 w-full justify-center bg-black text-white px-5 py-3 text-sm font-medium uppercase tracking-wide cursor-pointer disabled:opacity-50">Checkout</button>
                </Fragment>
            }
        />
    )
}