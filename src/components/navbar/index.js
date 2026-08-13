'use client'
import { Fragment, useContext,useEffect } from "react"
import { navOptions, adminNavOptions, styles } from "@/utils";
import { GlobalContext } from "@/context";
import CommonModal from "../CommonModal";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import CartModal from "../CartModal";





function NavItems({ isModalView = false,isAdminView }) {
    const router=useRouter()
    return (
        <div className={`items-center justify-between w-full lg:flex lg:w-auto ${isModalView ? "" : "hidden"}`} id="nav-items">
            <ul className={`flex flex-col p-4 lg:p-0 mt-4 font-medium rounded-lg lg:flex-row lg:space-x-8 lg:mt-0 lg:border-0 bg-white ${isModalView ? "border-none" : "border border-gray-100"}`}>
                {isAdminView
                    ? adminNavOptions.map((item) => {
                        return (<li className="cursor-pointer block py-2 pl-3 pr-4 text-gray-900 rounded md:p-0" key={item.id} onClick={() => router.push(item.path)}>
                            {item.label}
                        </li>)
                    })
                    : navOptions.map((item) => {
                        return (<li className="cursor-pointer block py-2 pl-3 pr-4 text-gray-900 rounded md:p-0" key={item.id} onClick={() => router.push(item.path)}>
                            {item.label}
                        </li>)
                    })
                }
            </ul>
        </div>
    )
}

function ActionButtons({ isModalView = false,isAdminView }) {

    const { user, isAuthUser, setUser, setIsAuthUser, isHydrated, setShowCartModal,setShowNavModal } = useContext(GlobalContext)
    const router = useRouter()

    if (!isHydrated) {
        return (
            <div className={`flex ${isModalView ? "flex-col gap-2 w-full" : "items-center gap-2"}`}>
                <div className={`h-10 rounded bg-gray-100 ${isModalView ? "w-full" : "w-24"}`} />
            </div>
        )
    }

    function handleLogOut() {
        setIsAuthUser(false)
        setUser(null)
        Cookies.remove('token')
        localStorage.clear()
        router.push('/')
    }
    return (
        <div className={`flex ${isModalView ? "flex-col gap-2 w-full" : "items-center gap-2"}`}>
            {
                !isAdminView && isAuthUser ?
                    <Fragment>
                        <button className={`mt-1.5 inline-block bg-black px-3 py-2 text-sm font-medium uppercase tracking-wide text-white cursor-pointer ${isModalView ? "w-full text-center" : ""}`} onClick={()=>{router.push('/account')}}>Account</button>
                        <button className={`mt-1.5 inline-block bg-black px-3 py-2 text-sm font-medium uppercase tracking-wide text-white cursor-pointer ${isModalView ? "w-full text-center" : ""}`} onClick={()=>{setShowNavModal(false);setShowCartModal(true)}}>Cart</button>
                    </Fragment>
                    : null
            }
            {
                user?.role === 'admin' ? (
                    isAdminView ? (<button onClick={()=>{router.push('/')}} className={`mt-1.5 inline-block bg-black px-3 py-2 text-sm font-medium uppercase tracking-wide text-white cursor-pointer ${isModalView ? "w-full text-center" : ""}`}>Client View</button>) : (<button onClick={()=>{router.push('/admin-view')}} className={`mt-1.5 inline-block bg-black px-3 py-2 text-sm font-medium uppercase tracking-wide text-white cursor-pointer ${isModalView ? "w-full text-center" : ""}`}>Admin View</button>)
                ) : null
            }
            {
                isAuthUser ? <button onClick={handleLogOut} className={`mt-1.5 inline-block bg-black px-3 py-2 text-sm font-medium uppercase tracking-wide text-white cursor-pointer ${isModalView ? "w-full text-center" : ""}`}>log out</button> : <button onClick={() => router.push('/login')} className={`mt-1.5 inline-block bg-black px-3 py-2 text-sm font-medium uppercase tracking-wide text-white cursor-pointer ${isModalView ? "w-full text-center" : ""}`}>login</button>
            }
        </div>
    )
}

export default function Navbar() {
    const { showNavModal, setShowNavModal,showCartModal, setShowCartModal } = useContext(GlobalContext)
    const { currentUpdatedProduct,setCurrentUpdatedProduct } = useContext(GlobalContext)
    const pathName = usePathname()
    const isAdminView=pathName.includes('admin-view')
    const router = useRouter()

    useEffect(() => {
      if(pathName!=="/admin-view/add-product" && currentUpdatedProduct!==null) setCurrentUpdatedProduct(null)
    }, [pathName])
    
    return (
        <>

            <nav className="border-b bg-white fixed w-full z-20 top-0 left-0 border-gray-200 p-2 px-4 sm:px-8 lg:px-12">
                <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4 ">
                    <div onClick={() => { router.push('/') }} className="flex items-center cursor-pointer">
                        <span className="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap">Eccomercy</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 lg:order-2">
                        <ActionButtons isAdminView={isAdminView}/>
                    </div>
                    <button
                        data-collapse-toggle="navbar-sticky"
                        type="button"
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 cursor-pointer dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded="false"
                        onClick={() =>{showNavModal?setShowNavModal(false):setShowNavModal(true)}}

                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>

                    <NavItems isAdminView={isAdminView}/>
                </div>

            </nav>
                    <CommonModal show={showNavModal} setShow={setShowNavModal} modalTitle="Menu" showModalTitle={true} mainContent={<div><ActionButtons isModalView={true} isAdminView={isAdminView} /><NavItems isModalView={true} isAdminView={isAdminView} /></div>} />
                    {showCartModal && <CartModal/>}
        </>
    )
}

