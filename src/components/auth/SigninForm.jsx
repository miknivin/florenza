"use client"; // Mark this as a client component

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useLoginMutation } from "@/store/api/authApi";
import GoogleSignInButton from "./GoogleSigninButton";

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
      await login({
        email: formData.email,
        password: formData.password,
        signupMethod: "Email/Password",
      }).unwrap();
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
      console.error("Login error:", error);
      toast.error(error.data?.error || "Login failed", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
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
      
          <div className="woocomerce__signin-btnwrap pb-0">
            <button
              type="submit"
              className="woocomerce__checkout-submitbtn"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
          <div className="text-center position-relative">
            <h6
              style={{ left: "0", top: "-8px" }}
              className="position-absolute w-100"
            >
              OR
            </h6>
            <hr />
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
