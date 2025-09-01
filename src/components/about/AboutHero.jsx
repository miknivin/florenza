import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "@/plugins";
import Link from "next/link.js";
import Image from "next/image.js";

const AboutHero = ({ intro }) => {
  const animationWordCome = useRef();
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
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="hero__about">
        {intro && Object.keys(intro).length ? (
          <div className="container g-0 line">
            <span className="line-3"></span>
            <div className="row">
              <div className="col-xxl-12">
                <div className="hero__about-content">
                  <h1
                    className="hero-title animation__word_come"
                    ref={animationWordCome}
                  >
                    {intro.title}
                  </h1>
                  <div className="hero__about-info">
                    <div className="hero__about-btn">
                      <div className="btn_wrapper">
                        <Link
                          href="/"
                          className="wc-btn-primary btn-hover btn-item"
                        >
                          <span></span>{" "}
                          <p style={{ width: "50%" }}>{intro.btn_text}</p>
                          <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="hero__about-text title-anim">
                      <p>{intro.description}</p>
                    </div>
                    {/* <div className="hero__about-award">
                      <Image
                        priority
                        width={126}
                        height={82}
                        src={`/assets/imgs/${intro.award_logo}`}
                        alt="Best Studio Award"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row hero__about-row">
              <div className="col-xxl-12">
                <div className="hero__about-video">
                  <video loop muted autoPlay playsInline>
                    <source
                      src={`/assets/${intro.intro_video}`}
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  );
};

export default AboutHero;
