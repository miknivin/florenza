import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, SplitText } from "@/plugins";
import BlogCard from "../common/card/BlogCard";

gsap.registerPlugin(ScrollTrigger);

const Blog1 = ({ blogs }) => {
  const animationCharCome = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.set(".blog__animation .blog__item", { x: 50, opacity: 0 });

        if (device_width < 1023) {
          const blogList = gsap.utils.toArray(".blog__animation .blog__item");
          blogList.forEach((item, i) => {
            let blogTl = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: "top center+=200",
              },
            });
            blogTl.to(item, {
              x: 0,
              opacity: 1,
              ease: "power2.out",
              duration: 1.5,
            });
          });
        } else {
          gsap.to(".blog__animation .blog__item", {
            scrollTrigger: {
              trigger: ".blog__animation .blog__item",
              start: "top center+=300",
              markers: false,
            },
            x: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 2,
            stagger: {
              each: 0.3,
            },
          });
        }
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
      <section className="blog__area-6 blog__animation">
        <div className="container g-0 line pt-110 pb-110">
          <span className="line-3"></span>
          <div className="row pb-130">
            <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
              <div className="sec-title-wrapper" style={{ zIndex: 0 }}>
                <h2
                  className="sec-title-2 animation__char_come"
                  ref={animationCharCome}
                >
                  We always <br />
                  think
                </h2>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
              <div className="blog__text">
                <p>
                  Crafting new bright brands, unique visual systems and digital
                  experience focused on a wide range of original collabs.{" "}
                </p>
              </div>
            </div>
          </div>

          {blogs && blogs.length ? (
            <div className="row reset-grid">
              {blogs.map((el) => (
                <div
                  key={el.id}
                  className="col-xxl-4 col-xl-4 col-lg-4 col-md-4"
                >
                  <BlogCard el={el} />
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
    </>
  );
};

export default Blog1;
