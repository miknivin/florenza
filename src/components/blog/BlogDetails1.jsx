import Image from "next/image";
import Link from "next/link";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "@/plugins";

import Detail2 from "../../../public/assets/imgs/blog/detail/2.jpg";
import Detail3 from "../../../public/assets/imgs/blog/detail/3.jpg";
import BlogRelated from "./BlogRelated";

const BlogDetails1 = ({ blogDetails }) => {
  const animationWordCome = useRef();
  const animationCharCome = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      let tHero = gsap.context(() => {
        let word_come = animationWordCome.current;
        let split_word_come = new SplitText(word_come, {
          type: "chars words",
          position: "absolute",
        });
        gsap.from(split_word_come.words, {
          duration: 1,
          x: 50,
          autoAlpha: 0,
          stagger: 0.05,
        });

        let char_come = animationCharCome.current;
        let split_char = new SplitText(char_come, { type: "chars, words" });
        gsap.from(split_char.chars, {
          duration: 1,
          x: 70,
          autoAlpha: 0,
          stagger: 0.05,
        });
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="blog__detail">
        <div className="container g-0 line pt-140">
          <span className="line-3"></span>
          {blogDetails && Object.keys(blogDetails).length ? (
            <>
              <div className="row">
                <div className="col-xxl-8 col-xl-10 offset-xxl-2 offset-xl-1">
                  <div className="blog__detail-top">
                    <h2 className="blog__detail-date animation__word_come" ref={animationWordCome}>
                      {blogDetails.category} <span>{blogDetails.date}</span>
                    </h2>
                    <h3 className="blog__detail-title animation__char_come" ref={animationCharCome}>
                      {blogDetails.title}
                    </h3>
                    <div className="blog__detail-metalist">
                      <div className="blog__detail-meta">
                        <Image
                          priority
                          width={60}
                          height={60}
                          src={`/assets/imgs/${blogDetails.author_img}`}
                          alt="Author Picture"
                        />
                        <p>
                          Writen by <span>{blogDetails.author}</span>
                        </p>
                      </div>
                      <div className="blog__detail-meta">
                        <p>
                          Viewed <span>{blogDetails.view}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-12">
                  <div className="blog__detail-thumb">
                    <Image
                      priority
                      width={1290}
                      height={700}
                      style={{ width: "auto", height: "auto" }}
                      src={`/assets/imgs/${blogDetails.img}`}
                      alt="Blog Thumbnail"
                      data-speed="0.5"
                    />
                  </div>
                </div>
                <div className="col-xxl-8 col-xl-10 offset-xxl-2 offset-xl-1">
                  {/* if data is HTML formate */}
                  {/* <div className="blog__detail-content">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `${blogDetails.description}`,
                      }}
                    />
                  </div> */}
                  <div className="blog__detail-content">
                    <p>
                      We love to bring designs to life as a developer, and I aim
                      to do this using whatever front end tools are necessary.
                      My preferred tools are more modern javascript libraries
                      like React.js but I like to use whatever is best for the
                      websites needs. There are several reasons why a business
                      would consider a rebrand and it doesn’t necessarily mean
                      the business has been unsuccessful.{" "}
                    </p>
                    <p>
                      But in order that you may see whence all this born error
                      of those who accuse pleasure and praise pain, I will open
                      the whole matter, and explain the very things which were
                      said by that discoverer of truth and, as it were, the
                      architect of a happy life.
                    </p>
                    <Image
                      priority
                      width={850}
                      style={{ height: "auto" }}
                      src={Detail2}
                      alt="Blog Image"
                    />
                    <h2>JavaScript</h2>
                    <p>
                      We love to bring designs to life as a developer, and I aim
                      to do this using whatever front end tools are necessary.
                      My preferred tools are more modern javascript libraries
                      like React.js but I like to use whatever is best for the
                      websites needs. There are several reasons why a business
                      would consider a rebrand and it doesn’t necessarily mean
                      the business has been unsuccessful.
                    </p>
                    <h2>Fremework</h2>
                    <p>
                      Always ready to push the boundaries, especially when it
                      comes to our own platform, Our analytical eye to create a
                      site that was visually engaging and also optimised for
                      maximum performance. It also perfectly reflects the
                      journey to help it tell a story to increase its
                      understanding and drive action. To create a site that was
                      visually engaging for maximum performance.
                    </p>
                    <ul>
                      <li>Brand Development</li>
                      <li>UX/UI Design</li>
                      <li>Front-end Development</li>
                      <li>Copywriting</li>
                      <li>Shopify Development</li>
                    </ul>
                    <h2>Visual Studio</h2>
                    <p>
                      Just like other pseudo-elements and pseudo-class
                      selectors, :not() can be chained with other pseudo-classes
                      and pseudo-elements. For example, the following will add a
                      “New!” word to list items that do not have a .old class
                      name, using the ::after pseudo-element:
                    </p>
                    <Image
                      priority
                      width={850}
                      style={{ height: "auto" }}
                      src={Detail3}
                      alt="Code"
                    />
                  </div>
                  <div className="blog__detail-tags">
                    <p className="sub-title-anim">
                      tags:{" "}
                      {blogDetails.tag.map((el, i) => (
                        <Link
                          style={{ marginRight: "10px" }}
                          key={i + "tag"}
                          href="/blog"
                        >
                          {el}
                        </Link>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
              <BlogRelated blogs={blogDetails.related} />
            </>
          ) : (
            ""
          )}
        </div>
      </section>
    </>
  );
};

export default BlogDetails1;
