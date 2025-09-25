import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, SplitText } from "@/plugins";
gsap.registerPlugin(ScrollTrigger);

const CommonAnimation = ({ children }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Common Animation
      let tHero = gsap.context(() => {
        try {
          let splitTitleLines = gsap.utils.toArray(".title-anim");

          splitTitleLines.forEach((splitTextLine) => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: splitTextLine,
                start: "top 90%",
                end: "bottom 60%",
                scrub: false,
                markers: false,
                toggleActions: "play none none none",
              },
            });

            const itemSplitted = new SplitText(splitTextLine, {
              type: "words, lines",
            });
            gsap.set(splitTextLine, { perspective: 400 });
            itemSplitted.split({ type: "lines" });
            tl.from(itemSplitted.lines, {
              duration: 1,
              delay: 0.3,
              opacity: 0,
              rotationX: -80,
              force3D: true,
              transformOrigin: "top center -50",
              stagger: 0.1,
            });
          });
          let splitTextLines = gsap.utils.toArray(".text-anim p");

          splitTextLines.forEach((splitTextLine) => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: splitTextLine,
                start: "top 90%",
                duration: 2,
                end: "bottom 60%",
                scrub: false,
                markers: false,
                toggleActions: "play none none none",
              },
            });

            const itemSplitted = new SplitText(splitTextLine, {
              type: "lines",
            });
            gsap.set(splitTextLine, { perspective: 400 });
            itemSplitted.split({ type: "lines" });
            tl.from(itemSplitted.lines, {
              duration: 1,
              delay: 0.5,
              opacity: 0,
              rotationX: -80,
              force3D: true,
              transformOrigin: "top center -50",
              stagger: 0.1,
            });
          });
        } catch (e) {
          console.log(e);
        }
      });
      return () => tHero.revert();
    }
  }, []);
  return children;
};

export default CommonAnimation;
