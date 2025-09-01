import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";

const ScrollTop = () => {
  const topScroll = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      let scroll_top = topScroll.current;
      if (scroll_top) {
        window.onscroll = function () {
          if (
            document.body.scrollTop > 50 ||
            document.documentElement.scrollTop > 50
          ) {
            scroll_top.style.display = "block";
          } else {
            scroll_top.style.display = "none";
          }
        };
      }
    }
  }, []);

  const goToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  return (
    <>
      <button ref={topScroll} className="scroll-top" onClick={goToTop}>
        <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
      </button>
    </>
  );
};

export default ScrollTop;
