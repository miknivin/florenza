"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Payment from "@/components/checkout/Payment";
import Address from "@/components/checkout/Address";
import Modal from "../common/modal/ReusableModal";
import SignInForm from "@/components/auth/SigninForm";
import SignUpForm from "@/components/auth/SignupForm";
import { setOrderProduct, clearCart } from "@/store/features/cartSlice";
import {
  useCreateNewOrderMutation,
  useRazorpayCheckoutSessionMutation,
  useRazorpayWebhookMutation,
} from "@/store/api/orderApi";
import { Preloader } from "..";

export default function CheckoutContent() {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isWebhookLoading, setIsWebhookLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleOpenSignUpModal = () => {
    setIsSignUp(true);
  };

  const handleOpenSignInModal = () => {
    setIsSignUp(false);
  };
  const dispatch = useDispatch();
  const { cartData, totalCost } = useSelector((state) => state.cart);
  const formRef = useRef();
  const [createNewOrder, { isLoading, error }] = useCreateNewOrderMutation();
  const [razorpayCheckoutSession, { isLoading: sessionLoading }] =
    useRazorpayCheckoutSessionMutation();
  const [razorpayWebhook] = useRazorpayWebhookMutation();
  const { isAuthenticated } = useSelector((state) => state.user);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleOrderSubmission = async () => {
    // Check if cart is empty
    if (!cartData || cartData.length === 0) {
      toast.error("Your cart is empty. Please add items before placing an order.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (!isAuthenticated) {
      toast.error("You need to log in to place an order.", {
        position: "top-center",
        autoClose: 2000,
      });
      setShowModal(true);
      return;
    }

    if (!formRef.current || typeof formRef.current.submitForm !== "function") {
      console.error("Form reference or submitForm method not available");
      toast.error("Form submission error. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      // Trigger form submission and validation
      const { isValid, formData } = await formRef.current.submitForm();
      console.log("isValid:", isValid, "formData:", formData);
      if (!isValid) {
        toast.error("Please fill in all required address fields correctly", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }
      if (!formData || Object.keys(formData).length === 0) {
        console.error("Form data is empty after submission", { formData });
        toast.error("Form data could not be processed. Please try again.", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      const itemsPrice = cartData.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const taxAmount = 0;
      const shippingAmount = 0;
      const totalAmount = itemsPrice;

      const shippingInfo = {
        email: formData.email,
        country: formData.country,
        fullName: formData.fullName,
        state: formData.state,
        city: formData.city,
        zipCode: formData.zipCode,
        phoneNo: formData.phone,
        address: formData.address,
        msg: formData.msg,
      };

      if (paymentMethod === 1) {
        // Razorpay payment
        const orderData = {
          cartItems: cartData,
          shippingInfo,
          taxAmount,
          shippingAmount,
          paymentMethod: "Online",
        };

        const response = await razorpayCheckoutSession(orderData).unwrap();
        const { orderId: razorpayOrderId } = response;

        // Initialize Razorpay payment modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          order_id: razorpayOrderId,
          amount: totalAmount * 100,
          currency: "INR",
          name: "Florenza",
          description: "Order Payment",
          handler: async (response) => {
            try {
              setIsWebhookLoading(true);
              console.log(response.razorpay_order_id, "Razorpay Order ID");
              console.log(razorpayOrderId, "Generated Order ID");

              const webhookResponse = await razorpayWebhook({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartItems: cartData,
                shippingInfo,
                taxAmount,
                shippingAmount,
                orderNotes: formData.msg || "",
                couponApplied: "No",
              }).unwrap();

              if (webhookResponse.success) {
                dispatch(setOrderProduct(cartData));
                dispatch(clearCart());
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
            } finally {
              setIsWebhookLoading(false);
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            address: formData.address,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // COD payment
        const orderData = {
          cartItems: cartData,
          shippingInfo,
          paymentMethod: "COD",
          taxAmount,
          shippingAmount,
        };

        const response = await createNewOrder(orderData).unwrap();

        dispatch(setOrderProduct(cartData));
        dispatch(clearCart());
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
      console.error("Order creation failed:", err);
      toast.error(
        err?.data?.message || "Failed to create order. Please try again.",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={isSignUp ? "Sign Up" : "Sign In"}
        size="md"
      >
        {isSignUp ? (
          <SignUpForm
            className="m-0"
            isHeading={false}
            isModal={true}
            onOpenSignInModal={handleOpenSignInModal}
          />
        ) : (
          <SignInForm
            className="m-0"
            isHeading={false}
            isModal={true}
            onHide={() => setShowModal(false)}
            onOpenSignUpModal={handleOpenSignUpModal}
          />
        )}
      </Modal>
      {(isLoading || sessionLoading || isWebhookLoading) && <Preloader />}
      <div
        className="woocomerce__cart checkout-page"
        style={{
          display:
            isLoading || sessionLoading || isWebhookLoading ? "none" : "block",
        }}
      >
        <div className="woocomerce__cart-wrapper">
          <Payment
            paymentSubmit={handleOrderSubmission}
            totalCost={totalCost}
            setPaymentMethod={setPaymentMethod}
            isLoading={isLoading}
          />
          <Address reference={formRef} />
        </div>
      </div>
    </>
  );
}