import Head from "next/head";
import { Preloader, CTA, Blog1 } from "@/components";

import useSWR from "swr";
import ProductLayout from "@/components/common/layout/ProductLayout";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Blog = () => {
  const { data, error } = useSWR("../assets/json/allBlogs.json", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data)
    return (
      <div>
        <Preloader />
      </div>
    );

  const blogs = data.blogs;
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Blog Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <Blog1 blogs={blogs} />
          <CTA />
        </ProductLayout>
      </main>
    </>
  );
};

export default Blog;
