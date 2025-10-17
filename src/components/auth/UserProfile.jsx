"use client";

import { useGetMeQuery } from "@/store/api/userApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserProfile() {
  const { error, isLoading } = useGetMeQuery();
  const router = useRouter();

  useEffect(() => {
    const prefetchPages = async () => {
      await Promise.all([
        router.prefetch("/cart"),
        router.prefetch("/about"),
        router.prefetch("/checkout"),
      ]);
    };

    prefetchPages();
  }, [router]);

  return null;
}
