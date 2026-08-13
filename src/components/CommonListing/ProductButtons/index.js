'use client'
import { GlobalContext } from "@/context"
import { usePathname, useRouter } from "next/navigation"
import { useContext } from "react"
import { deleteAProduct } from "@/services/product"
import ComponentLevelLoader from "@/components/Loader/componentLevelLoader"
import { toast } from "react-toastify"
import { addToCart } from "@/services/cart"

export default function ProductButton({ item }) {
    const pathName = usePathname()
    const { setCurrentUpdatedProduct, setComponentLevelLoader, componentLevelLoader, user, setShowCartModal } = useContext(GlobalContext)
    const router = useRouter()

    const isAdminView = pathName.includes("admin-view")
    const productId = item?._id || item?.id

    async function handleDeleteProduct(currentItem) {
        if (!currentItem?._id) return

        setComponentLevelLoader({ loading: true, id: currentItem._id })
        const res = await deleteAProduct(currentItem._id)

        if (res?.success) {
            setComponentLevelLoader({ loading: false, id: "" })
            toast.success(res.message, {
                position: "top-right",
            })
            router.refresh()
        } else {
            setComponentLevelLoader({ loading: false, id: "" })
            toast.error(res?.message || "Failed to add product", {
                position: "top-right",
            })
        }
    }

    async function handleAddToCart(getItem) {
        const currentProductId = getItem?._id || getItem?.id

        if (!currentProductId) {
            toast.error("Product is missing an id.", { position: "top-right" })
            return
        }

        if (!user?._id) {
            toast.error("Please login first to add products to cart.", { position: "top-right" })
            router.push("/login")
            return
        }

        setComponentLevelLoader({ loading: true, id: currentProductId })

        const res = await addToCart({ productID: currentProductId, userID: user._id })

        if (res?.success) {
            toast.success(res.message, {
                position: "top-right",
            })
            setComponentLevelLoader({ loading: false, id: "" })
            setShowCartModal(true)
        } else {
            toast.error(res?.message || "Failed to add product", {
                position: "top-right",
            })
            setComponentLevelLoader({ loading: false, id: "" })
            setShowCartModal(true)
        }

        console.log(res)
    }

    if (!item) return null

    return isAdminView ? (
        <>
            <button onClick={() => {
                setCurrentUpdatedProduct(item)
                router.push("/admin-view/add-product")
            }} className="mt-1.5 w-full justify-center bg-black text-white px-5 py-3 text-sm font-medium uppercase tracking-wide cursor-pointer">Update</button>
            <button onClick={() => { handleDeleteProduct(item) }} className="mt-1.5 w-full justify-center bg-black text-white px-5 py-3 text-sm font-medium uppercase tracking-wide cursor-pointer">
                {
                    componentLevelLoader && componentLevelLoader.loading && productId === componentLevelLoader.id ?
                        <ComponentLevelLoader text={"Deleting Product"} color={"#ffffff"} loading={componentLevelLoader.loading} />
                        :
                        "Delete"
                }
            </button>
        </>
    ) : (
        <>
            <button className="mt-1.5 w-full justify-center bg-black text-white px-5 py-3 text-sm font-medium uppercase tracking-wide cursor-pointer" onClick={() => handleAddToCart(item)}>
                {
                    componentLevelLoader && componentLevelLoader.loading && productId === componentLevelLoader.id ?
                        <ComponentLevelLoader text={"Adding Product"} color={"#ffffff"} loading={componentLevelLoader.loading} />
                        :
                        "Add To Cart"
                }
            </button>
        </>
    )
}