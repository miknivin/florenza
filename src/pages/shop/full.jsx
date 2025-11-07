"use client";
import { FullWidth, Preloader } from "@/components";
import ProductLayout from "@/components/common/layout/ProductLayout";
import FullWidthNewUi from "@/components/shop/FullWidthNewUi";
import Head from "next/head";

const Full = () => {
  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="All products" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <FullWidthNewUi />
        </ProductLayout>
      </main>
    </>
  );
};

export default Full;
