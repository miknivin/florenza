import Head from "next/head";
import { Preloader, Faq1, FaqCTA } from "@/components";

import useSWR from "swr";
import ProductLayout from "@/components/common/layout/ProductLayout";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Faq = () => {
  const { data, error } = useSWR("assets/json/faq.json", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data)
    return (
      <div>
        <Preloader />
      </div>
    );

  const faqData = data.faq;
  return (
    <div>
      <Head>
        <title>FAQ</title>
        <meta name="description" content="FAQ Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <Faq1 faqData={faqData} />
          <FaqCTA />
        </ProductLayout>
      </main>
    </div>
  );
};

export default Faq;
