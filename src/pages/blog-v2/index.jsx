import Head from "next/head";
import { Preloader, CTA, BlogElementV2 } from "@/components";

import useSWR from "swr";
import ProductLayout from "@/components/common/layout/ProductLayout";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const BlogV2 = () => {
  const { data, error } = useSWR("assets/json/allBlogs.json", fetcher);

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
        <title>Blog V2</title>
        <meta name="description" content="Blog V2 Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <BlogElementV2 blogs={blogs} />
          <CTA />
        </ProductLayout>
      </main>
    </>
  );
};

export default BlogV2;
