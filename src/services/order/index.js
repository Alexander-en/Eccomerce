import Cookies from "js-cookie";

export const createNewOrder = async (formData) => {
  try {
    const res = await fetch("/api/order/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const message = await res.text();
      console.error("Order API error", res.status, message);
      return { success: false, message: message || "Order request failed" };
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Order fetch failed", e);
    return { success: false, message: e.message || "Network error" };
  }
};

export const getAllOrdersForUser = async (id) => {
  try {
    const res = await fetch(`/api/order/get-all-orders?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    if (!res.ok) {
      const message = await res.text();
      return { success: false, message: message || "Failed to load orders" };
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return { success: false, message: e.message || "Network error" };
  }
};

export const getOrderDetails = async (id) => {
  try {
    const res = await fetch(`/api/order/order-details?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    if (!res.ok) {
      const message = await res.text();
      return { success: false, message: message || "Failed to load order details" };
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return { success: false, message: e.message || "Network error" };
  }
};

export const getAllOrdersForAllUsers = async () => {
  try {
    const res = await fetch(`/api/admin/orders/get-all-orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    if (!res.ok) {
      const message = await res.text();
      return { success: false, message: message || "Failed to load admin orders" };
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return { success: false, message: e.message || "Network error" };
  }
};

export const updateStatusOfOrder = async (formData) => {
  try {
    const res = await fetch(`/api/admin/orders/update-order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};