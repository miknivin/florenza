"use client"; // Mark this as a client component

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRegisterMutation } from "@/store/api/authApi";
import GoogleSignInButton from "./GoogleSigninButton";
import { useDispatch } from "react-redux";
import {
  setIsAuthenticated,
  setUser,
  clearUser,
} from "@/store/features/userSlice";
import axios from "axios";
import PhoneOTP from "./PhoneOtp";

const SignUpForm = ({
  className,
  isHeading = true,
  isModal = false,
  onOpenSignInModal,
  onHide,
}) => {
  const passwordInput = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [register, { isLoading }] = useRegisterMutation();
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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        signupMethod: "Email/Password",
      }).unwrap();

      // Delay getMe by 100ms to handle server-side cookie setting
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Fetch user data from /api/auth/me
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "/api"}/auth/me`,
        {
          withCredentials: true, // Send cookies
          params: { t: Date.now() }, // Prevent browser caching
        }
      );

      // Process response
      if (response.data.success) {
        const userData = response.data.user || response.data.data;
        if (userData) {
          const user = {
            id: userData._id || "",
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
          };
          dispatch(setUser(user));
          dispatch(setIsAuthenticated(true));
        } else {
          throw new Error("No user data in response");
        }
      } else {
        throw new Error(response.data.error || "Failed to fetch user data");
      }

      toast.success("Successfully registered!", {
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
      console.error("Registration or getMe error:", error);
      const errorMessage =
        error?.data?.error || error.message || "Registration failed";
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

  return (
    <div className={`woocomerce__signin  ${className || ""}`}>
      <div className="woocomerce__signin-wrapper">
        {isHeading && (
          <div className="woocomerce__signin-titlewrap">
            <span className="woocomerce__signin-title">Sign up</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="woocomerce__signin-field">
            <PhoneOTP />
            <div className="text-center position-relative">
              <h6
                style={{ left: "0", top: "-8px" }}
                className="position-absolute w-100"
              >
                OR
              </h6>
              <hr />
            </div>
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              required
              name="Name"
              id="Name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="woocomerce__signin-field">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              name="Email"
              required
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
                name="Password"
                required
                id="Password"
                ref={passwordInput}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                role="button"
                className="woocomerce__signin-view"
              >
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
          <div className="woocomerce__signin-btnwrap signupbtn d-flex flex-column gap-3">
            <button
              type="submit"
              className="woocomerce__checkout-submitbtn"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Sign up"}
            </button>
            <GoogleSignInButton onHide={onHide} />
          </div>
        </form>
        <div className="woocomerce__signin-formfooter">
          <p>
            Already have an account?{" "}
            {isModal ? (
              <button
                type="button"
                className="btn btn-link p-0 m-0"
                style={{ textDecoration: "underline", color: "#007bff" }}
                onClick={onOpenSignInModal}
              >
                Sign in
              </button>
            ) : (
              <Link href={"/sign-in"}>Sign in</Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
