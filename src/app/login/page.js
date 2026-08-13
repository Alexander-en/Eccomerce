"use client"

import { loginFormControls } from "@/utils";
import InputComponent from "@/components/FormElements/InputComponent";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { login } from "@/services/login";
import { GlobalContext } from "@/context";
import Cookies from "js-cookie";
import ComponentLevelLoader from "@/components/Loader/componentLevelLoader";
import Notification from "@/components/Notification";




const initialFormData = {
    email: '',
    password: '',
}
export default function Login() {
    const [FormData, setFormData] = useState(initialFormData)

    const { isAuthUser, setIsAuthUser, user, setUser, componentLevelLoader, setComponentLevelLoader } = useContext(GlobalContext)
    const router = useRouter()



    console.log(FormData)
    function isValidForm() {
        return FormData && FormData.email && FormData.email.trim() !== ''
            && FormData.password && FormData.password.trim() !== '' ? true : false
    }
    async function handleLogin() {
        setComponentLevelLoader({ loading: true, id: '' })
        const res = await login(FormData)
        console.log(res)
        if (res.success) {
                toast.success(res.message, {
                    position: "top-right",
                });
            setIsAuthUser(true)
            setUser(res?.finalResult?.user)
            setFormData(initialFormData)
            Cookies.set('token', res?.finalResult?.token)
            localStorage.setItem("user", JSON.stringify(res?.finalResult?.user))
            setComponentLevelLoader({ loading: false, id: '' })
        } else {
            toast.error(res.message, {
                position: "top-right",
            });
            setIsAuthUser(false)
            setComponentLevelLoader({ loading: false, id: '' })
        }
    }
    console.log(isAuthUser, user);

    useEffect(() => {
        if (isAuthUser) router.push("/")
    }, [isAuthUser])

    return (
        <div className="min-h-screen flex justify-center px-5 py-10 items-start bg-white border border-amber-500">

            {/* Card */}
            <div className="w-full max-w-2xl lg:w-5/12 bg-white shadow-2xl rounded-xl p-10 mt-10  border border-amber-500 ">

                {/* Title */}
                <h1 className="text-3xl font-serif text-center font-medium">
                    Login
                </h1>




                <div className="mt-6 space-y-6 max-h-125 ">

                    {/* Example mapped items */}
                    {
                        loginFormControls.map((controlItem) =>
                            controlItem.componentType === "input" ? (
                                <InputComponent
                                    key={controlItem.id}
                                    type={controlItem.type}
                                    placeholder={controlItem.placeholder}
                                    label={controlItem.label}
                                    value={FormData[controlItem.id]}
                                    onChange={(event) => {
                                        setFormData({
                                            ...FormData,
                                            [controlItem.id]: event.target.value
                                        })
                                    }}
                                />
                            ) : null
                        )}
                    <button className="disabled:opacity-50 w-full  bg-black text-white py-2 text-lg uppercase cursor-pointer" disabled={!isValidForm()} onClick={handleLogin}>
                        {
                            componentLevelLoader && componentLevelLoader.loading ? <ComponentLevelLoader text={"Logging In"} color={"#ffffff"} loading={componentLevelLoader.loading} /> : 'Login'
                        }
                    </button>
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-500">New to Website?</p>
                        <button className="w-full  bg-black text-white py-2 text-lg uppercase cursor-pointer" onClick={() => router.push("/register")}>
                            Register
                        </button>
                    </div>

                </div>


            </div>
            <Notification />
        </div>
    );
}


/*
That line stores the login token in a browser cookie:

Cookies.set('token', res?.finalResult?.token)
It creates/updates a cookie named token with the value from res.finalResult.token.


That line saves the user object in browser local storage:

localStorage.setItem("user", JSON.stringify(res?.finalResult?.user))
It converts res.finalResult.user to a JSON string and stores it under the key user. This lets the app later read the user data across page reloads.
*/