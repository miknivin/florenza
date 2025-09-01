import Head from "next/head";
import {
  Preloader,
  Brand2,
  CTA,
  AboutHero,
  AboutStory,
  AboutCounter,
  AboutTestimonial,
} from "@/components";

import useSWR from "swr";
import ProductLayout from "@/components/common/layout/ProductLayout";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const About = () => {
  const { data, error } = useSWR("assets/json/about.json", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data)
    return (
      <div>
        <Preloader />
      </div>
    );

  const intro = data.intro;
  const story = data.story;
  const counter = data.counter;
  const brand = data.brand;
  const testimonial = data.testimonial;
  return (
    <div>
      <Head>
        <title>About</title>
        <meta name="description" content="About Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <AboutHero intro={intro} />
          <AboutStory story={story} />
          <AboutCounter counter={counter} />
          {/* <Brand2 brand={brand} /> */}
          <AboutTestimonial testimonial={testimonial} />
          <CTA />
        </ProductLayout>
      </main>
    </div>
  );
};

export default About;
