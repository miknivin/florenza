"use client"; // Mark this as a client component

import Image from "next/image";
import { toast } from "react-toastify";
import { auth } from "@/lib/firebase/firebase.config"; // Adjust path to your Firebase config
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useGoogleSignInMutation } from "@/store/api/authApi";
import { useDispatch } from "react-redux";
import {
  setIsAuthenticated,
  setUser,
  clearUser,
} from "@/store/features/userSlice";
import axios from "axios";

const GoogleSignInButton = ({ onHide }) => {
  const [googleSignIn, { isLoading }] = useGoogleSignInMutation();
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Extract user info
      const idToken = await user.getIdToken();
      const { email, displayName, uid, photoURL } = user;

      // Send data to the backend via googleSignIn mutation
      await googleSignIn({
        idToken,
        email,
        displayName,
        uid,
        photoURL,
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

      toast.success("Successfully signed in with Google!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      // Close the modal if onHide is provided
      if (onHide) {
        onHide();
      }
    } catch (error) {
      console.error("Google sign-in or getMe error:", error);
      const errorMessage =
        error?.data?.error || error.message || "Google sign-in failed";
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
    <button
      type="button"
      className="google-btn btn"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <div className="google-icon">
        <Image
          width={24}
          height={24}
          src="/assets/imgs/shape/google-logo.png"
          alt="Google"
        />
      </div>
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default GoogleSignInButton;
