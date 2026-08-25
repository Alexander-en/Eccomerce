'use client'

import TileComponent from "@/components/FormElements/TileComponent"
import { adminAddProductformControls, AvailableSizes } from "@/utils"
import InputComponent from "@/components/FormElements/InputComponent"
import SelectComponent from "@/components/FormElements/SelectComponent"
import { supabase } from "@/utils"
import { useContext, useState, useRef, useEffect } from "react"
import { addNewProduct,updateAProduct } from "@/services/product"
import Notification from "@/components/Notification"
import { GlobalContext } from "@/context"
import { toast } from "react-toastify"
import ComponentLevelLoader from "@/components/Loader/componentLevelLoader"


const initialFormData = {
    name: "",
    price: 0,
    description: "",
    category: "men",
    sizes: [],
    deliveryInfo: "",
    onSale: "no",
    imageUrl: "",
    priceDrop: 0,
};



const createUniqueFileName = (file) => {
    const extension = file.name.split(".").pop();

    return `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${extension}`;
};

async function helperForUploadingImageToSupabase(file) {
    if (!supabase) {
        throw new Error("Supabase storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local.");
    }

    const fileName = createUniqueFileName(file);
    const storagePath = `products/${fileName}`;

    const { error } = await supabase.storage
        .from("EcommerceNextJS")
        .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw new Error(error.message || "Supabase rejected the image upload.");

    const { data } = supabase.storage
        .from("EcommerceNextJS")
        .getPublicUrl(storagePath);

    return data?.publicUrl || "";
}

export default function AdminAddProduct() {
    const [formData, setFormData] = useState(initialFormData);
    const { componentLevelLoader, setComponentLevelLoader,currentUpdatedProduct,setCurrentUpdatedProduct } = useContext(GlobalContext)
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const hasExistingImage = Boolean(formData.imageUrl || currentUpdatedProduct?.imageUrl);
    const isFormValid =
        formData.name.trim() !== "" &&
        formData.description.trim() !== "" &&
        formData.deliveryInfo.trim() !== "" &&
        Number(formData.price) > 0 &&
        formData.sizes.length > 0 &&
        (Boolean(selectedImage) || hasExistingImage);

    useEffect(() => {
      if(currentUpdatedProduct !== null) setFormData(currentUpdatedProduct)
  
    }, [currentUpdatedProduct])
    

    function handleTileClick(getCurrentItem) {
        let cpySizes = [...formData.sizes];
        const index = cpySizes.findIndex((item) => item.id === getCurrentItem.id);
        if (index === -1) { cpySizes.push(getCurrentItem); }
        else { cpySizes = cpySizes.filter((item) => item.id !== getCurrentItem.id); }
        setFormData({ ...formData, sizes: cpySizes, });
    }


    function handleImage(event) {
        const file = event.target.files[0];

        if (!file) return;

        setSelectedImage(file);
    }

    async function handleAddProduct() {
        if (!selectedImage && currentUpdatedProduct === null) {
            toast.error("Please upload an image first.");
            return;
        }

        if (componentLevelLoader.loading) {
            return;
        }

        setComponentLevelLoader({ loading: true, id: "" });

        let imageUrl;
        try {
            imageUrl = selectedImage
                ? await helperForUploadingImageToSupabase(selectedImage)
                : formData.imageUrl || currentUpdatedProduct?.imageUrl || "";
        } catch (error) {
            setComponentLevelLoader({ loading: false, id: "" });
            const message = error instanceof TypeError && error.message === "Failed to fetch"
                ? "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and your internet connection."
                : error.message || "Image upload failed.";
            toast.error(message);
            return;
        }

        if (selectedImage && !imageUrl) {
            setComponentLevelLoader({
                loading: false,
                id: "",
            });
            toast.error("Image upload failed.");
            return;
        }

        const productData = {
            ...formData,
            price: Number(formData.price),
            priceDrop: Number(formData.priceDrop),
            imageUrl,
        };

        const res = currentUpdatedProduct!==null ? await updateAProduct(productData) : await addNewProduct(productData);

        if (res?.success) {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.success(res.message, {
                position: "top-right",
            });
            setFormData(initialFormData);
            setSelectedImage(null);
            setCurrentUpdatedProduct(null)

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } else {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.error(res?.message || "Failed to add product", {
                position: "top-right",
            });
        }
    }

    return (
        <div className="w-full m-0  relative" >
            <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative ">
                <div className="w-full m-0 mt-6 space-y-8 ">
                    <input
                        ref={fileInputRef}
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-700 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept="image/*"
                        type="file"
                        onChange={handleImage}
                    />
                    <div className="flex gap-2 flex-col">
                        <label >Available Sizes</label>
                        <TileComponent selected={formData.sizes} onClick={handleTileClick} data={AvailableSizes} />
                    </div>
                    {adminAddProductformControls.map((controlItem) =>
                        controlItem.componentType === "input" ? (
                            <InputComponent key={controlItem.id}
                                type={controlItem.type}
                                placeholder={controlItem.placeholder}
                                label={controlItem.label}
                                value={formData[controlItem.id]}
                                onChange={(event) => {
                                    setFormData({
                                        ...formData,
                                        [controlItem.id]: event.target.value,
                                    });
                                }}
                            />
                        ) : controlItem.componentType === "select" ? (
                            <SelectComponent key={controlItem.id}
                                label={controlItem.label}
                                options={controlItem.options}
                                value={formData[controlItem.id]}
                                onChange={(event) => {
                                    setFormData({
                                        ...formData,
                                        [controlItem.id]: event.target.value,
                                    });
                                }}
                            />
                        ) : null
                    )}

                    <button  disabled={!isFormValid} onClick={handleAddProduct} className="items-center justify-center inline-flex text-lg py-4 px-6 uppercase tracking-wide text-white font-bold bg-black w-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">

                        {componentLevelLoader && componentLevelLoader.loading ? (<ComponentLevelLoader text={currentUpdatedProduct!=null? 'Updating Product':'Adding Product'} color={"#ffffff"} loading={componentLevelLoader.loading} />) :currentUpdatedProduct!== null ? ("Update Product"):("Add Product")}
                    </button>

                </div>
            </div>
            <Notification />
        </div>
    )
}