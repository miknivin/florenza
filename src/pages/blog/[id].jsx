import Head from "next/head";
import { Preloader, CTA, BlogDetails1 } from "@/components";

import useSWR from "swr";
import ProductLayout from "@/components/common/layout/ProductLayout";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Blog = () => {

  const { data, error } = useSWR("../assets/json/allBlogDetails.json", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data)
    return (
      <div>
        <Preloader />
      </div>
    );

  const blogDetails = data.details;
  return (
    <>
      <Head>
        <title>Blog Details</title>
        <meta name="description" content="Blog Details Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <BlogDetails1 blogDetails={blogDetails} />
          <CTA />
        </ProductLayout>
      </main>
    </>
  );
};

export default Blog;
