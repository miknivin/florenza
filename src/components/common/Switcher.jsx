import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";

const Switcher = ({cursor1, cursor2}) => {
  const switcherIcon = useRef();
  const switcherItem = useRef();
  const switcherOpen = useRef();
  const switcherClose = useRef();
  const cursorStyle = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      switcherIcon.current.style.zIndex = "1000";
      switcherItem.current.style.zIndex = "1000";
    }
  }, []);
  const open = () => {
    switcherOpen.current.style.display = "none";
    switcherClose.current.style.display = "flex";
    switcherIcon.current.style.right = "280px";
    switcherItem.current.style.right = "0";
  };
  const close = () => {
    switcherClose.current.style.display = "none";
    switcherOpen.current.style.display = "flex";
    switcherIcon.current.style.right = "0";
    switcherItem.current.style.right = "-280px";
  };

  const cursor = () => {
    let cursor_val = cursorStyle.current.value;

    if (cursor_val == "1") {
      cursor1.current.style.display = "none";
      cursor2.current.style.display = "none";
    } else {
      cursor1.current.style.display = "";
      cursor2.current.style.display = "";
    }
  };
  return (
    <>
      <div className="switcher__area">
        <div ref={switcherIcon} className="switcher__icon">
          <button ref={switcherOpen} onClick={open} id="switcher_open">
            <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
          </button>
          <button ref={switcherClose} onClick={close} id="switcher_close">
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
        </div>

        <div ref={switcherItem} className="switcher__items">
          <div className="switcher__item">
            <div className="switch__title-wrap">
              <h2 className="switcher__title">Cursor</h2>
            </div>
            <div className="switcher__btn">
              <select
                defaultValue={2}
                name="cursor-style"
                ref={cursorStyle}
                onChange={cursor}
                id="cursor_style"
              >
                <option value="1">default</option>
                <option value="2">animated</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Switcher;
