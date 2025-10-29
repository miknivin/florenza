import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ProductLayout from "@/components/common/layout/ProductLayout";
import { useRef } from "react";
import SignUpForm from "@/components/auth/SignupForm";
import AuthLayout from "@/components/common/layout/AuthLayout";

const SignUp = () => {
  const passwordInput = useRef();
  const hidePassword = () => {
    if (passwordInput.current.type === "password") {
      passwordInput.current.type = "text";
    } else {
      passwordInput.current.type = "password";
    }
  };
  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Sign Up Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <AuthLayout>
          <ProductLayout>
            <SignUpForm />
          </ProductLayout>
        </AuthLayout>
      </main>
    </>
  );
};

export default SignUp;
