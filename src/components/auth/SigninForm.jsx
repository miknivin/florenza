"use client"; // Mark this as a client component

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useLoginMutation } from "@/store/api/authApi";
import GoogleSignInButton from "./GoogleSigninButton";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setIsAuthenticated, setUser } from "@/store/features/userSlice";
import PhoneOTP from "./PhoneOtp";

const SignInForm = ({
  className,
  isHeading = true,
  isModal = false,
  onOpenSignUpModal,
  onHide,
}) => {
  const passwordInput = useRef();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const hidePassword = () => {
    if (passwordInput.current.type === "password") {
      passwordInput.current.type = "text";
    } else {
      passwordInput.current.type = "password";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting login with:", formData);
      await login({
        email: formData.email,
        password: formData.password,
        signupMethod: "Email/Password",
      }).unwrap();

      // Delay getMe by 500ms to handle server-side cookie setting
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Make axios request to /api/auth/me
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "/api"}/auth/me`,
        {
          withCredentials: true, // Send cookies
          params: { t: Date.now() }, // Prevent browser caching
        }
      );

      // Process response
      if (response.data.success) {
        const user = response.data.user || response.data.data;
        if (user) {
          const userData = {
            id: user._id || "",
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
          };
          dispatch(setUser(userData));
          dispatch(setIsAuthenticated(true));
        } else {
          throw new Error("No user data in response");
        }
      } else {
        throw new Error(response.data.error || "Failed to fetch user data");
      }

      toast.success("Successfully signed in!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      if (isModal && onHide) {
        onHide();
      }
    } catch (error) {
      console.error("Login or getMe error:", error);
      const errorMessage =
        error?.data?.error || error.message || "Login failed";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      // Clear user state on auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(clearUser());
        dispatch(setIsAuthenticated(false));
      }
    }
  };

  const handleClearFields = () => {
    setFormData({ email: "", password: "", remember: false });
  };

  const handleAuthSuccess = () => {
    if (isModal && onHide) {
      onHide();
    }
  };

  return (
    <div className={`woocomerce__signin  ${className || ""}`}>
      <div className="woocomerce__signin-wrapper">
        {isHeading && (
          <div className="woocomerce__signin-titlewrap">
            <span className="woocomerce__signin-title">Sign in</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <PhoneOTP
            onClearFields={handleClearFields}
            onAuthSuccess={handleAuthSuccess}
          />
          <div className="text-center position-relative">
            <h6
              style={{ left: "0", top: "-8px" }}
              className="position-absolute w-100"
            >
              OR
            </h6>
            <hr />
          </div>
          <div className="woocomerce__signin-field">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              required
              name="Email"
              id="Email"
              placeholder="Your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="woocomerce__signin-field">
            <label htmlFor="Password">Password</label>
            <div className="woocomerce__signin-passwordfield">
              <input
                type="password"
                required
                name="Password"
                id="Password"
                ref={passwordInput}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button type="button" className="woocomerce__signin-view">
                <Image
                  width={19}
                  height={11}
                  onClick={hidePassword}
                  src="/assets/imgs/woocomerce/view.png"
                  alt="view"
                />
              </button>
            </div>
          </div>

          <div className="woocomerce__signin-btnwrap pb-3">
            <button
              type="submit"
              className="woocomerce__checkout-submitbtn"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <GoogleSignInButton onHide={onHide} />
        </form>
        <div className="woocomerce__signin-formfooter">
          <p>
            Don’t have an account?{" "}
            {isModal ? (
              <button
                type="button"
                style={{ textDecoration: "underline", color: "inherit" }}
                onClick={onOpenSignUpModal}
              >
                Sign up
              </button>
            ) : (
              <Link href={"/sign-up"}>Sign up</Link>
            )}
          </p>
          <Link href={"/reset"}>Reset Password</Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
