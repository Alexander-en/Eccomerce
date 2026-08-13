'use client'

import { createContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";


//children is all the nested components that will be passing from our individual pages to the context provider
export const GlobalContext = createContext(null)
export const initialCheckoutFormData = {
    shippingAddress: {},
    paymentMethod: "",
    totalPrice: 0,
    isPaid: false,
    paidAt: new Date(),
    isProcessing: true,
};

const protectedRoutes = ["/cart", "/checkout", "/account", "/orders", "/admin-view"];

const protectedAdminRoutes = [
    "/admin-view",
    "/admin-view/add-product",
    "/admin-view/all-products",
];



export default function GlobalState({ children }) {
    const [showNavModal, setShowNavModal] = useState(false)
    const [showCartModal, setShowCartModal] = useState(false)
    const [pageLevelLoader, setPageLevelLoader] = useState(true)
    const [componentLevelLoader, setComponentLevelLoader] = useState({ loading: false, id: '' })
    const [isAuthUser, setIsAuthUser] = useState(false)
    const [user, setUser] = useState(null)
    const [isHydrated, setIsHydrated] = useState(false)
    const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState(null)
    const [cartItems, setCartItems] = useState(null)
    const [checkoutFormData, setCheckoutFormData] = useState(initialCheckoutFormData)
    const [addresses, setAddresses] = useState(null)
    const [addressFormData, setAddressFormData] = useState({
        fullName: '',
        city: '',
        country: '',
        postalCode: '',
        address: ''
    })

    const [allOrdersForUser, setAllOrdersForUser] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [allOrdersForAllUsers, setAllOrdersForAllUsers] = useState([]);


    const router = useRouter();
    const pathName = usePathname();


    // useEffect(() => {
    //     if (typeof window === "undefined") return;

    //     const token = Cookies.get("token");
    //     if (token) {
    //         setIsAuthUser(true);
    //         try {
    //             const userData = JSON.parse(localStorage.getItem("user") || "{}")
    //             setUser(userData)
    //         } catch {
    //             setUser(null)
    //         }
    //     } else {
    //         setIsAuthUser(false)
    //         setUser(null)
    //     }

    //     setIsHydrated(true)
    // }, [Cookies])

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            setIsAuthUser(true);
            const userData = JSON.parse(localStorage.getItem("user")) || null;
            const getCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            setUser(userData);
            setCartItems(getCartItems);
        } else {
            setIsAuthUser(false);
            setUser(null);
            setCartItems([]);
        }
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        const token = Cookies.get("token");
        const isAuthenticated = !!token || (user && Object.keys(user).length > 0);
        const isStripeReturn =
            typeof window !== "undefined" &&
            window.location.pathname === "/checkout" &&
            window.location.search.includes("status=");

        if (
            pathName !== "/register" &&
            !pathName.includes("product") &&
            pathName !== "/" &&
            !isAuthenticated &&
            protectedRoutes.includes(pathName) &&
            !(pathName === "/checkout" && isStripeReturn)
        )
            router.replace("/login");
    }, [isHydrated, user, pathName, router]);

    useEffect(() => {
        if (
            user &&
            Object.keys(user).length > 0 &&
            user?.role !== "admin" &&
            protectedAdminRoutes.indexOf(pathName) > -1
        )
            router.replace("/Unauthorized-Page");
    }, [user, pathName]);

    const value = useMemo(() => ({
        allOrdersForAllUsers, setAllOrdersForAllUsers,
        orderDetails, setOrderDetails,
        allOrdersForUser, setAllOrdersForUser,
        addresses, setAddresses,
        addressFormData, setAddressFormData,
        checkoutFormData,
        setCheckoutFormData,
        cartItems,
        setCartItems,
        showCartModal,
        setShowCartModal,
        showNavModal,
        setShowNavModal,
        pageLevelLoader,
        setPageLevelLoader,
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        componentLevelLoader,
        setComponentLevelLoader,
        currentUpdatedProduct,
        setCurrentUpdatedProduct,
        isHydrated

    }), [orderDetails,allOrdersForAllUsers,allOrdersForUser,addresses, checkoutFormData, addressFormData, showCartModal, cartItems, showNavModal, pageLevelLoader, componentLevelLoader, isAuthUser, user, currentUpdatedProduct, isHydrated]);

    const isProtectedRoute = protectedRoutes.some(
        (route) => pathName === route || pathName.startsWith(`${route}/`)
    );
    const isAdminRoute = protectedAdminRoutes.includes(pathName);
    const shouldBlockPage =
        !isHydrated ||
        (isProtectedRoute && (!user || Object.keys(user).length === 0)) ||
        (isAdminRoute && user?.role && user.role !== "admin");

    return (
        <GlobalContext.Provider value={value}>
            {shouldBlockPage ? (
                <div className="min-h-screen flex items-center justify-center">
                    Loading...
                </div>
            ) : children}
        </GlobalContext.Provider>
    )
}


/*I created context to share state between components without passing props through our individual pages to the context provider. I use context because it keeps the code cleaner, avoids prop drilling, and makes the shared state easier to manage. */

/*useMemo is a built-in React hook that caches the result of a function calculation between re-renders. It prevents React from needlessly running heavy, resource-intensive operations on every render by only recalculating the value when its specific dependencies change */