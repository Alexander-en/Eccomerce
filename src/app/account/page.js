"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import ComponentLevelLoader from "@/components/Loader/componentLevelLoader";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import {
    addNewAddress,
    deleteAddress,
    fetchAllAddresses,
    updateAddress,
} from "@/services/address";
import { addNewAddressFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Account() {
    const {
        user,
        addresses,
        setAddresses,
        addressFormData,
        setAddressFormData,
        componentLevelLoader,
        setComponentLevelLoader,
        pageLevelLoader,
        setPageLevelLoader,
    } = useContext(GlobalContext);
    // setPageLevelLoader(false)

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [currentEditedAddressId, setCurrentEditedAddressId] = useState(null);
    const addressFormRef = useRef(null);
    const router = useRouter()

    async function extractAllAddresses() {
        setPageLevelLoader(true)
        const res = await fetchAllAddresses(user?._id)
        if (res?.success) {
            setPageLevelLoader(false)
            setAddresses(res.data);
        }
        else {
            setPageLevelLoader(false)
        }
    }
    async function handleAddOrUpdateAddress() {
        setComponentLevelLoader({ loading: true, id: "" });
        const res =
            currentEditedAddressId !== null
                ? await updateAddress({
                    ...addressFormData,
                    _id: currentEditedAddressId,
                })
                : await addNewAddress({ ...addressFormData, userID: user?._id });

        console.log(res);

        if (res?.success) {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.success(res.message, {
                position: "top-right",
            });
            setAddressFormData({
                fullName: "",
                city: "",
                country: "",
                postalCode: "",
                address: "",
            });
            extractAllAddresses();
            setCurrentEditedAddressId(null);
        } else {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.error(res?.message || "Unable to save address. Please try again.", {
                position: "top-right",
            });
            setAddressFormData({
                fullName: "",
                city: "",
                country: "",
                postalCode: "",
                address: "",
            });
        }
    }

    function handleUpdateAddress(getCurrentAddress) {
        setShowAddressForm(true);
        setAddressFormData({
            fullName: getCurrentAddress.fullName,
            city: getCurrentAddress.city,
            country: getCurrentAddress.country,
            postalCode: getCurrentAddress.postalCode,
            address: getCurrentAddress.address,
        });
        setCurrentEditedAddressId(getCurrentAddress._id);
    }

    async function handleDelete(getCurrentAddressID) {
        setComponentLevelLoader({ loading: true, id: getCurrentAddressID });

        const res = await deleteAddress(getCurrentAddressID);

        if (res?.success) {
            setComponentLevelLoader({ loading: false, id: "" });

            toast.success(res.message, {
                position: "top-right",
            });
            extractAllAddresses();
        } else {
            setComponentLevelLoader({ loading: false, id: "" });

            toast.error(res?.message || "Unable to delete address. Please try again.", {
                position: "top-right",
            });
        }
    }

    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            extractAllAddresses();
        }
    }, [user])

    useEffect(() => {
        if (showAddressForm && currentEditedAddressId !== null) {
            addressFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [showAddressForm, currentEditedAddressId])


    return (
        <section className="min-h-screen bg-gray-200 border border-gray-200 p-6 lg:p-12">
            <div className="border  w-full mx-auto bg-white shadow p-6 sm:p-12 flow-root">
                <div className=" sm:flex-row flex-col flex gap-4" id='user-info '>
                    <div className="w-24 h-24 mx-auto sm:mx-0">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sf4-l1Z1Vi6_xmgXZGip3PHUeUlhwt9Whm2SCme2t6u9zLbJaWbY2Tz4&s=10" className="object-cover border" alt="User Image" />
                    </div>
                    <div className="flex-col flex justify-center  text-gray-500 font-semibold">
                        <h4 className="font-bold text-lg text-black">{user?.name}</h4>
                        <p className="text-sm">{user?.role}</p>
                        <p className="text-sm">{user?.email}</p>

                    </div>

                </div>
                <button onClick={() => router.push('/orders')} className="mt-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide cursor-pointer">View your orders</button>
                <div className="mt-7">
                    <h1 className="font-bold text-lg">Your Addresses:</h1>
                    {pageLevelLoader ? (
                        <PulseLoader
                            color={"#000000"}
                            loading={pageLevelLoader}
                            size={15}
                            data-testid="loader"
                        />
                    ) : (
                        <div className="mt-4 flex flex-col gap-4">
                            {addresses && addresses.length ? (
                                addresses.map((item) => (
                                    <div className="border shadow p-6 border-gray-100" key={item._id}>
                                        <p>Name : {item.fullName}</p>
                                        <p>Address : {item.address}</p>
                                        <p>City : {item.city}</p>
                                        <p>Country : {item.country}</p>
                                        <p>PostalCode : {item.postalCode}</p>
                                        <button
                                            onClick={() => handleUpdateAddress(item)}
                                            className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide cursor-pointer"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="mt-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide cursor-pointer"
                                        >
                                            {componentLevelLoader &&
                                                componentLevelLoader.loading &&
                                                componentLevelLoader.id === item._id ? (
                                                <ComponentLevelLoader
                                                    text={"Deleting"}
                                                    color={"#ffffff"}
                                                    size={2}
                                                    loading={
                                                        componentLevelLoader &&
                                                        componentLevelLoader.loading
                                                    }
                                                />
                                            ) : (
                                                "Delete"
                                            )}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No address found ! Please add a new address below</p>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="mt-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide cursor-pointer"
                    >
                        {showAddressForm ? "Hide Address Form" : "Add New Address"}
                    </button>
                </div>
                {
                    showAddressForm ? (
                        <div ref={addressFormRef} className="mt-6 flex justify-center items-center pt-5 flex-col">
                            <div className="space-y-8 w-full m-0 mt-6">
                                {
                                    addNewAddressFormControls.map((controlItem) => (
                                        <InputComponent key={controlItem.id}
                                            type={controlItem.type}
                                            placeholder={controlItem.placeholder}
                                            label={controlItem.label}
                                            value={addressFormData[controlItem.id]}
                                            onChange={(event) =>
                                                setAddressFormData({
                                                    ...addressFormData,
                                                    [controlItem.id]: event.target.value,
                                                })
                                            }
                                        />
                                    ))
                                }
                            </div>
                            <button
                                onClick={handleAddOrUpdateAddress}
                                className="mt-5 items-center justify-center inline-flex text-lg py-4 px-6 uppercase tracking-wide text-white font-bold bg-black w-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {componentLevelLoader && componentLevelLoader.loading ? (
                                    <ComponentLevelLoader
                                        text={"Saving"}
                                        color={"#ffffff"}
                                        loading={
                                            componentLevelLoader && componentLevelLoader.loading
                                        }
                                    />
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    ) : null
                }
            </div>
            <Notification />
        </section>
    )
}