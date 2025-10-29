// components/auth/AuthLayout.jsx
"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated → redirect to profile
    if (isAuthenticated && user) {
      router.replace("/profile"); // replace = no back button to login
    }
  }, [isAuthenticated, user, router]);

  // Show children only if NOT authenticated
  if (isAuthenticated && user) {
    return null; // or <Loading /> if you want
  }

  return <>{children}</>;
}
