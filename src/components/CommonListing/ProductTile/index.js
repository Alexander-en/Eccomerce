'use client'
import {useRouter} from "next/navigation"
export default function ProductTile({ item }){
    const router= useRouter()
    const productId = item?._id || item?.id
    const imgSrc = item?.imageUrl || item?.image || "/file.svg"
    const onSale =
        item?.onSale === true ||
        String(item?.onSale).toLowerCase() === "yes" ||
        String(item?.onSale).toLowerCase() === "true"

    if (!item) return null

    return <div onClick={()=>{ if (productId) router.push(`/product/${productId}`)}} className="w-full flex flex-col h-full cursor-pointer">
        <div className="relative w-full overflow-hidden h-56 bg-gray-100">
            <img src={imgSrc} alt={item?.name || "Product Image"}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {onSale && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                    Sale
                </span>
            )}
        </div>

        <div className="px-4 py-4 flex flex-col gap-2 flex-1">
            <div className="flex">
                <p className={`text-lg font-semibold text-gray-900 ${item?.onSale==="yes"?"line-through":""}`}>{`$${Number(item?.price ?? 0).toFixed(2)}`}</p>
                {
                    item.onSale==="yes"?
                <p className={`text-lg font-semibold text-red-600 ml-3`}>{`  $${item?.price-(item?.price*(item?.priceDrop/100)).toFixed(2)}`}</p>:null
                }
            </div>
            <h3 className="text-sm text-gray-600 truncate w-full" title={item?.name}>{item?.name}</h3>
        </div>

    </div>
}