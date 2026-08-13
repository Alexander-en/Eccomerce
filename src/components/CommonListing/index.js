"use client"
import React, { useEffect } from "react"
import ProductButton from "./ProductButtons"
import ProductTile from "./ProductTile"
import { useRouter } from "next/navigation"
import Notification from "../Notification"


export default function CommonListing({ data }){
    const router = useRouter()
    useEffect(()=>{
        router.refresh()
    },[])

    const safeData = Array.isArray(data) ? data.filter(Boolean) : []

    return <section className="bg-gray-50 py-8 sm:py-12">
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6 lg:gap-8 lg:mt-16 px-4">
            { safeData.length ?
                safeData.map((item, index) => {
                    const productId = item?._id || item?.id || `product-${index}`

                    return (
                        <article key={productId} className="w-full bg-white rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col h-full">
                            <ProductTile item={item}></ProductTile>
                            <div className="px-4 pb-4 mt-auto">
                                <ProductButton item={item}></ProductButton>
                            </div>
                        </article>
                    )
                })
                : null
            }
        </div>
        <Notification/>
    </section>
}