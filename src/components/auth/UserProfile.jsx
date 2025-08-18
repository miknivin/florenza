'use client'; // Mark this as a client component

import { useGetMeQuery } from '@/store/api/userApi'; // Adjust the import path based on your project structure
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';

export default function UserProfile() {
  const { error, isLoading } = useGetMeQuery(); // Use the RTK Query hook
  const dispatch = useDispatch();


  return null; // No HTML rendering
}