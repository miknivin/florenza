import { Preloader } from "@/components";
import ProductLayout from "@/components/common/layout/ProductLayout";
import ProductDetailsNewUi from "@/components/shop/product-details-new-ui/ProductDetailsNewUi";
import ProductDetails from "@/components/shop/ProductDetails";
import Head from "next/head";
import { useRouter } from "next/router"; // Temporary fallback

const Details = ({ params }) => {
  // console.log("Server/Client params (prop):", params); // Log params from props
  // if (typeof window !== "undefined") {
  //   console.log("Client-side params (prop):", params); // Client-side only
  // }

  // Fallback to useRouter if params is undefined (temporary)
  const router = useRouter();
  const id = params?.id || router.query.id; // Use params first, then router.query

  // console.log(
  //   "Resolved ID:",
  //   id,
  //   "from params:",
  //   params,
  //   "or query:",
  //   router.query
  // );

  if (!id) {
    console.log("ID is missing, params:", params, "query:", router.query);
    return (
      <div className="flex items-center justify-center h-screen">
        <Preloader />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Product Details</title>
        <meta name="description" content="Product Details Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          {/* <ProductDetails id={id} /> */}
          <ProductDetailsNewUi id={id}/>
        </ProductLayout>
      </main>
    </>
  );
};

export default Details;
