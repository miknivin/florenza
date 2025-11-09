"use client";
import { countries } from "@/data/countries";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setUser } from "@/store/features/userSlice";
import { auth } from "@/lib/firebase/firebase.config";

const PhoneOTP = ({ onClearFields, onAuthSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null);
  const dispatch = useDispatch();

  /* ────── CREATE RECAPTCHA ONCE (ON MOUNT) ────── */
  useEffect(() => {
    const container = document.getElementById("recaptcha-container");
    if (!container || recaptchaRef.current) return;

    recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {
        toast.error("reCAPTCHA expired, please try again", {
          position: "top-center",
          autoClose: 1000,
        });
      },
    });

    // Required for invisible reCAPTCHA
    recaptchaRef.current.render().catch((err) => {
      console.error("reCAPTCHA render error:", err);
      toast.error("Failed to load reCAPTCHA", {
        position: "top-center",
        autoClose: 1000,
      });
    });

    if (process.env.NODE_ENV === "development") {
      recaptchaRef.current.appVerificationDisabledForTesting = true;
    }

    // Cleanup on unmount
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);

  /* ────── RESEND COUNTDOWN ────── */
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => setResendCountdown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const startResendTimer = () =>
    setResendCountdown(process.env.NODE_ENV === "development" ? 5 : 60);

  /* ────── SEND / RESEND OTP (REUSES SAME VERIFIER) ────── */
  const handleGetOTP = async (e) => {
    if (e) e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    if (!recaptchaRef.current) {
      toast.error("reCAPTCHA not ready", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    const fullPhone = `+${selectedCountry.phoneCode}${phoneNumber.trim()}`;
    setIsLoading(true);

    try {
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaRef.current // ← SAME verifier every time
      );

      setConfirmationResult(result);
      setIsOtpSent(true);
      startResendTimer();
      toast.success("OTP sent successfully!", {
        position: "top-center",
        autoClose: 1000,
      });

      if (onClearFields) onClearFields();
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

  const handleResendOTP = async () => {
    setOtp("");
    setConfirmationResult(null);
    await handleGetOTP(); // ← reuses same verifier
  };

  /* ────── VERIFY OTP ────── */
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
      const credential = await confirmationResult.confirm(otp);
      const idToken = await credential.user.getIdToken();

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "/api"}/auth/otp`,
        { phone: credential.user.phoneNumber, idToken },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { user } = response.data;
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
        if (onAuthSuccess) onAuthSuccess();
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

  /* ────── RENDER ────── */
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
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      +{c.phoneCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="phone-input-wrapper w-100">
                <input
                  type="tel"
                  id="phoneNumber"
                  className="phone-input"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGetOTP()}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="otp-button"
                  onClick={handleGetOTP}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Get OTP"}
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex flex-column w-100 align-items-start">
              <div className="phone-input-wrapper w-100">
                <input
                  type="text"
                  id="otp"
                  maxLength={6}
                  className="phone-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyPress={(e) => e.key === "Enter" && handleVerifyOTP()}
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

              {/* RESEND + LOADER */}
              <div className="d-flex align-items-start justify-content-start gap-3 mt-2 w-100">
                {isLoading && (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-link py-1 px-0 text-black"
                  onClick={handleResendOTP}
                  disabled={isLoading || resendCountdown > 0}
                  style={{ fontSize: "0.875rem" }}
                >
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : "Resend OTP"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PhoneOTP;
