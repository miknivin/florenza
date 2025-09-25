import Head from "next/head";
import { Preloader, Contact1 } from "@/components";
import useSWR from "swr";
import ProductLayout from "@/components/common/layout/ProductLayout";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Contact = () => {
  const { data, error } = useSWR("assets/json/contact.json", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data)
    return (
      <div>
        <Preloader />
      </div>
    );

  const contact = data.contact;
  return (
    <>
      <Head>
        <title>Contact</title>
        <meta name="description" content="Contact Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <Contact1 contact={contact} />
        </ProductLayout>
      </main>
    </>
  );
};

export default Contact;
