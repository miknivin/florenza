import ProductLayout from "@/components/common/layout/ProductLayout";
import AllProfileContent from "@/components/profile/AllProfileContent";
import Head from "next/head";

export default function profile() {
  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Profile Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <AllProfileContent />
        </ProductLayout>
      </main>
    </>
  );
}
