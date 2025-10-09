"use client"; // Mark this as a client component

import { useGetMeQuery } from "@/store/api/userApi"; // Adjust the import path based on your project structure
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserProfile() {
  const { error, isLoading } = useGetMeQuery(); // Use the RTK Query hook
  const router = useRouter();

  useEffect(() => {
    // Prefetch the cart and checkout pages
    router.prefetch("/cart");
    router.prefetch("/checkout");
  }, [router]);

  return null; // No HTML rendering
}
