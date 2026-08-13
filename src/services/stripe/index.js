import Cookies from "js-cookie";

export const callStripeSession = async (formData) => {
  try {
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const message = await res.text();
      console.error("Stripe API error", res.status, message);
      return { success: false, message: message || "Stripe request failed" };
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Stripe fetch failed", e);
    return { success: false, message: e.message || "Network error" };
  }
};