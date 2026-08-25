"use client";

import { GlobalContext } from "@/context";
import { getAllAdminProducts } from "@/services/product";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Home() {
    const { isAuthUser } = useContext(GlobalContext);

    const [products, setProducts] = useState([]);
    const router = useRouter();

    async function getListOfProducts() {
        const res = await getAllAdminProducts();

        if (res?.success) {
            setProducts(res.data);
        }
    }

    useEffect(() => {
        getListOfProducts();
    }, []);

    const saleProducts = products
        ?.filter((item) => item.onSale === "yes")
        .slice(0, 2);


    const menProduct = products?.find(
        (item) => item.category?.toLowerCase() === "men"
    );

    const womenProduct = products?.find((item) =>
        ["women", "woman"].includes(item.category?.toLowerCase())
    );

    const kidsProduct = products?.find((item) =>
        ["kids", "kid"].includes(item.category?.toLowerCase())
    );
    return (
        <main className="bg-white text-gray-900">
            {/* ================================================= */}
            {/* HERO */}
            {/* ================================================= */}

            <section className="relative overflow-hidden bg-gray-100">
                <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                    {/* Hero Text */}
                    <div className="flex items-center px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
                        <div className="max-w-xl">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                                New Collection
                            </p>

                            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                                Style that speaks
                                <span className="block">for itself.</span>
                            </h1>

                            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
                                Discover timeless pieces and modern essentials designed
                                to elevate your everyday wardrobe.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() =>
                                        router.push("/product/listing/all-products")
                                    }
                                    className="rounded-md bg-black px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
                                >
                                    Explore Collection
                                </button>

                                <button
                                    onClick={() => router.push("/product/listing/all-products")}
                                    className="rounded-md border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-900 transition hover:bg-gray-50"
                                >
                                    Shop Now
                                </button>
                            </div>

                            {/* Small stats */}
                            <div className="mt-10 flex gap-8 border-t border-gray-200 pt-6">
                                <div>
                                    <p className="text-xl font-bold">100+</p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Products
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xl font-bold">Free</p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Shipping
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xl font-bold">24/7</p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Support
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative min-h-112.5 lg:min-h-162.5">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1170&q=80"
                            alt="Fashion collection"
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="absolute bottom-6 left-6 rounded-lg bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm">
                            <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
                                Featured
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-900">
                                Summer Collection 2026
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* SALE SECTION */}
            {/* ================================================= */}

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Sale Banner */}
                    <div className="flex min-h-87.5 items-center rounded-2xl bg-gray-100 p-8 sm:p-10 lg:p-12">
                        <div className="max-w-md">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                                Limited Time
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                                Summer Sale
                            </h2>

                            <p className="mt-4 leading-7 text-gray-600">
                                Refresh your wardrobe with selected pieces at
                                special prices.
                            </p>

                            <button
                                onClick={() =>
                                    router.push("/product/listing/all-products")
                                }
                                className="mt-7 rounded-md bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
                            >
                                Shop Sale
                            </button>
                        </div>
                    </div>

                    {/* Sale Products */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                                    Don't Miss Out
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-gray-950">
                                    On Sale
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    router.push("/product/listing/all-products")
                                }
                                className="hidden text-sm font-semibold text-gray-900 underline underline-offset-4 sm:block"
                            >
                                View All
                            </button>
                        </div>

                        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {saleProducts?.map((productItem) => (
                                <li
                                    key={productItem._id}
                                    onClick={() =>
                                        router.push(`/product/${productItem._id}`)
                                    }
                                    className="group cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                                        <img
                                            src={productItem.imageUrl}
                                            alt={productItem.name}
                                            className="aspect-4/5 w-full object-cover transition duration-500 group-hover:scale-105"
                                        />

                                        {/* Sale Badge */}
                                        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm">
                                            -{productItem.priceDrop}%
                                        </span>
                                    </div>

                                    {/* Product Info */}
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-gray-900">
                                            {productItem.name}
                                        </h3>

                                        <div className="mt-1 flex items-center gap-2">
                                            <p className="font-semibold text-gray-900">
                                                ${productItem.price}
                                            </p>

                                            <span className="text-sm text-red-600">
                                                Sale
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* CATEGORY SECTION */}
            {/* ================================================= */}

            <section className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    {/* Heading */}
                    <div className="mb-10 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                            Find Your Style
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                            Shop by Category
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500">
                            Explore our collections and find something made for
                            your style.
                        </p>
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Kids */}
                        <div
                            onClick={() => router.push("/product/listing/kids")}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl"
                        >
                            <img
                                src={kidsProduct?.imageUrl || "/file.svg"}
                                alt="Kids collection"
                                onError={(event) => { event.currentTarget.src = "/file.svg"; }}
                                className="aspect-4/5 w-full object-cover transition duration-500 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                                <p className="text-xs font-medium uppercase tracking-widest text-white/70">
                                    Collection
                                </p>

                                <h3 className="mt-1 text-2xl font-bold text-white">
                                    Kids
                                </h3>

                                <button className="mt-4 rounded-md bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-900 transition group-hover:bg-gray-100">
                                    Shop Now
                                </button>
                            </div>
                        </div>

                        {/* Women */}
                        <div
                            onClick={() =>
                                router.push("/product/listing/women")
                            }
                            className="group relative cursor-pointer overflow-hidden rounded-2xl"
                        >
                            <img
                                src={womenProduct?.imageUrl || "/file.svg"}
                                alt="Women's collection"
                                onError={(event) => { event.currentTarget.src = "/file.svg"; }}
                                className="aspect-4/5 w-full object-cover transition duration-500 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                                <p className="text-xs font-medium uppercase tracking-widest text-white/70">
                                    Collection
                                </p>

                                <h3 className="mt-1 text-2xl font-bold text-white">
                                    Women
                                </h3>

                                <button className="mt-4 rounded-md bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-900 transition group-hover:bg-gray-100">
                                    Shop Now
                                </button>
                            </div>
                        </div>

                        {/* Men */}
                        <div
                            onClick={() => router.push("/product/listing/men")}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-1"
                        >
                            <img
                                src={menProduct?.imageUrl || "/file.svg"}
                                alt="Men's collection"
                                onError={(event) => { event.currentTarget.src = "/file.svg"; }}
                                className="aspect-4/5 w-full object-cover transition duration-500 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                                <p className="text-xs font-medium uppercase tracking-widest text-white/70">
                                    Collection
                                </p>

                                <h3 className="mt-1 text-2xl font-bold text-white">
                                    Men
                                </h3>

                                <button className="mt-4 rounded-md bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-900 transition group-hover:bg-gray-100">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* BOTTOM CTA */}
            {/* ================================================= */}

            <section className="bg-black">
                <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                        Your Style Starts Here
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Find something you'll love.
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400">
                        Browse our complete collection and discover your next
                        favorite piece.
                    </p>

                    <button
                        onClick={() =>
                            router.push("/product/listing/all-products")
                        }
                        className="mt-8 rounded-md bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-gray-200"
                    >
                        Explore All Products
                    </button>
                </div>
            </section>
        </main>
    );
}