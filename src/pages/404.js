import Head from "next/head";
import { Error1 } from "@/components";
import ProductLayout from "@/components/common/layout/ProductLayout";

const ErrorDefault = () => {
  return (
    <>
      <Head>
        <title>Error</title>
        <meta name="description" content="Error Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <Error1 />
        </ProductLayout>
      </main>
    </>
  );
};

export default ErrorDefault;
