"use client"; // Mark this as a client component

import Image from "next/image";
import { toast } from "react-toastify";
import { auth } from "@/lib/firebase/firebase.config"; // Adjust path to your Firebase config
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useGoogleSignInMutation } from "@/store/api/authApi";

const GoogleSignInButton = ({ onHide }) => {
  const [googleSignIn, { isLoading }] = useGoogleSignInMutation();

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
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Google sign-in failed", {
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
