import { toast } from "react-toastify";
import { setOrderProduct, clearCart } from "@/store/features/cartSlice";
import {
  clearErrors,
  clearShippingInfo,
} from "@/store/features/orderValidationSlice";

export const handleRazorpayPayment = async ({
  orderData,
  razorpayCheckoutSession,
  razorpayWebhook,
  dispatch,
  router,
  shippingInfo,
  onHide,
  setLoading, // Added callback to control loader
}) => {
  try {
    // Create Razorpay checkout session
    const response = await razorpayCheckoutSession({
      cartItems: orderData.cartItems,
      shippingInfo: orderData.shippingInfo,
      paymentMethod: orderData.paymentMethod,
      taxAmount: orderData.taxAmount,
      shippingAmount: orderData.shippingAmount,
    }).unwrap();
    const { orderId: razorpayOrderId } = response;

    // Initialize Razorpay payment modal
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      order_id: razorpayOrderId,
      amount: orderData.totalAmount * 100, // Convert to paise
      currency: "INR",
      name: "Florenza",
      description: "Order Payment",
      handler: async (response) => {
        try {
          const webhookResponse = await razorpayWebhook({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            cartItems: orderData.cartItems,
            shippingInfo: orderData.shippingInfo,
            taxAmount: orderData.taxAmount,
            shippingAmount: orderData.shippingAmount,
            orderNotes: orderData.orderNotes,
            couponApplied: orderData.couponApplied || "No",
          }).unwrap();

          if (webhookResponse.success) {
            dispatch(setOrderProduct(orderData.cartItems));
            dispatch(clearCart());
            dispatch(clearErrors());
            dispatch(clearShippingInfo());
            toast.success("Order created successfully!", {
              position: "top-center",
              autoClose: 1000,
            });
            router.push({
              pathname: "/profile",
              query: { tab: "order" },
            });
          }
        } catch (err) {
          console.error("Webhook error:", err);
          toast.error("Payment verification failed. Please try again.", {
            position: "top-center",
            autoClose: 2000,
          });
          setLoading(false); // Stop loader on webhook failure
          throw err;
        } finally {
          setLoading(false); // Stop loader after webhook completes
        }
      },
      prefill: {
        name: shippingInfo.fullName,
        email: shippingInfo.email,
        contact: shippingInfo.phoneNo,
      },
      notes: {
        address: shippingInfo.address,
      },
      theme: {
        color: "#6c757d", // Neutral gray
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    onHide(); // Close the modal after opening the Razorpay payment modal
    setLoading(true); // Keep loader active for webhook processing
  } catch (err) {
    console.error("Razorpay checkout session failed:", err);
    toast.error(
      err?.data?.message || "Failed to initiate payment. Please try again.",
      {
        position: "top-center",
        autoClose: 2000,
      }
    );
    setLoading(false); // Stop loader on session creation failure
    throw err;
  }
};
