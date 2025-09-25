import SignInForm from "@/components/auth/SigninForm";
import ProductLayout from "@/components/common/layout/ProductLayout";
import Head from "next/head";

import { useRef } from "react";

const SignIn = () => {
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
        <title>Sign In</title>
        <meta name="description" content="Sign In Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <SignInForm/>
        </ProductLayout>
      </main>
    </>
  );
};

export default SignIn;
