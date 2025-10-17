"use client";

import { countries } from "@/data/countries";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

import axios from "axios";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setUser } from "@/store/features/userSlice";
import { auth } from "@/lib/firebase/firebase.config";

const PhoneOTP = ({ onClearFields, onAuthSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null);
  const dispatch = useDispatch();

  // Initialize reCAPTCHA
  useEffect(() => {
    // Ensure DOM is ready and auth is initialized
    if (
      !recaptchaRef.current &&
      document.getElementById("recaptcha-container")
    ) {
      try {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible", // Or "normal" for visible reCAPTCHA
            callback: () => {
              // reCAPTCHA solved
            },
            "expired-callback": () => {
              toast.error("reCAPTCHA expired, please try again", {
                position: "top-center",
                autoClose: 1000,
              });
            },
          }
        );

        // Enable testing mode for development (bypass reCAPTCHA, use test numbers)
        if (process.env.NODE_ENV === "development") {
          // Use Firebase test phone numbers (e.g., +16505550123, OTP: 123456)
          recaptchaRef.current.appVerificationDisabledForTesting = true;
        }
      } catch (error) {
        console.error("reCAPTCHA init error:", error);
        toast.error("Failed to initialize reCAPTCHA", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }

    // Cleanup reCAPTCHA on unmount
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);

  const handleGetOTP = async (e) => {
    e.preventDefault(); // Prevent any default form behavior
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    const fullPhone = `+${selectedCountry.phoneCode}${phoneNumber.trim()}`;
    setIsLoading(true);

    try {
      if (!recaptchaRef.current) {
        throw new Error("reCAPTCHA not initialized");
      }

      // Prevent scrolling by maintaining scroll position
      const scrollY = window.scrollY;
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaRef.current
      );
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast.success("OTP sent successfully!", {
        position: "top-center",
        autoClose: 1000,
      });
      if (onClearFields) {
        onClearFields();
      }
      // Restore scroll position
      window.scrollTo(0, scrollY);
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error(error.message || "Failed to send OTP", {
        position: "top-center",
        autoClose: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP client-side
      const credential = await confirmationResult.confirm(otp);
      const idToken = await credential.user.getIdToken();

      // Send idToken to backend
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "/api"}/auth/otp`,
        { phone: credential.user.phoneNumber, idToken },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { user, token } = response.data;
        console.log(user, "user");

        dispatch(
          setUser({
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
          })
        );
        dispatch(setIsAuthenticated(true));
        toast.success("Successfully signed in!", {
          position: "top-center",
          autoClose: 1000,
        });
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      } else {
        throw new Error(response.data.error || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verify error:", error);
      toast.error(error.message || "Invalid OTP", {
        position: "top-center",
        autoClose: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="phone-otp-wrapper">
        <div id="recaptcha-container"></div>
        <label
          htmlFor={isOtpSent ? "otp" : "phoneNumber"}
          className="phone-label"
        >
          {isOtpSent ? "Enter OTP" : "Phone number"}
        </label>
        <div className="phone-input-container">
          {!isOtpSent ? (
            <>
              <div className="country-select-wrapper">
                <select
                  className="country-select"
                  value={selectedCountry.id}
                  onChange={(e) => {
                    const country = countries.find(
                      (c) => c.id === parseInt(e.target.value)
                    );
                    setSelectedCountry(country);
                  }}
                >
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      +{country.phoneCode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="phone-input-wrapper">
                <input
                  type="tel"
                  id="phoneNumber"
                  className="phone-input"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleGetOTP();
                    }
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  role="button"
                  className="otp-button"
                  onClick={handleGetOTP}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Get OTP"}
                </button>
              </div>
            </>
          ) : (
            <div className="phone-input-wrapper">
              <input
                type="text"
                id="otp"
                role="button"
                maxLength={"6"}
                className="phone-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleVerifyOTP();
                  }
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="otp-button"
                onClick={handleVerifyOTP}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}
        </div>

        {isLoading && (
          <div>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PhoneOTP;
