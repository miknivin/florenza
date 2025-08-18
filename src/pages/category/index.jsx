import { Preloader } from "@/components";
import AllCategory from "@/components/category/AllCategory";
import AllCategory2 from "@/components/category/AllCategory2";
import AllCategoryMobile from "@/components/category/AllCategoryMobile";
import ProductLayout from "@/components/common/layout/ProductLayout";
import Head from "next/head";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Category() {
  const { data: allCategories, error } = useSWR(
    "../assets/json/allCategories.json",
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!allCategories)
    return (
      <div>
        <Preloader />
      </div>
    );

  const allData = allCategories.categories;
  return (
    <>
      <Head>
        <title>All Category</title>
        <meta name="description" content="All Category Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          {/* <div className="my-md-5 my-4 pt-md-3 text-center">
            <h1>All Categories</h1>
          </div> */}
          {/* <AllCategory allData={allData} /> */}
          <div>
          <div className="custom_category_big_screen">
          <AllCategory2 allData={allData} />
          </div>
          <div className="custom_category_small_screen">
          <AllCategoryMobile allData={allData} />
          </div>
          </div>
          
        </ProductLayout>
      </main>
    </>
  );
}
