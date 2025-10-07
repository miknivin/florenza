"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "@/plugins";
import axios from "axios";
import { toast } from "react-toastify";

const Contact1 = ({ contact }) => {
  const animationWordCome = useRef();
  const animationCharCome = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let tHero = gsap.context(() => {
        let char_come = animationCharCome.current;
        let split_char = new SplitText(char_come, { type: "chars, words" });
        gsap.from(split_char.chars, {
          duration: 1,
          x: 70,
          autoAlpha: 0,
          stagger: 0.05,
        });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error("Please provide name, email, and message");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/enquiry", formData);
      if (response.data.success) {
        toast.success("Enquiry submitted successfully");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(response?.data?.message || "Failed to submit enquiry");
      }
    } catch (error) {
      if (error) {
        toast.error(
          error?.response?.data?.message || "Error submitting enquiry"
        );
      }
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="contact__area-6">
        {contact && Object.keys(contact).length ? (
          <div className="container g-0 line pt-120 pb-110">
            <span className="line-3"></span>
            <div className="row">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                <div className="sec-title-wrapper" style={{ zIndex: 0 }}>
                  <h2
                    className="sec-title-2 animation__char_come"
                    ref={animationCharCome}
                  >
                    {contact.title}
                  </h2>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                <div className="contact__text">
                  <p>{contact.description}</p>
                </div>
              </div>
            </div>
            <div className="row contact__btm">
              <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
                <div className="contact__info">
                  <h3
                    className="sub-title-anim-top animation__word_come"
                    ref={animationWordCome}
                  >
                    {contact.sub_title}
                  </h3>
                  <ul>
                    <li>
                      <a
                        href={`tel:${contact.mobile
                          .split("-")
                          .join("")
                          .split(" ")
                          .join("")}`}
                      >
                        {contact.mobile}
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </li>
                    <li>
                      <span>{contact.address}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
                <div className="contact__form">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-xxl-6 col-xl-6 col-12">
                        <input
                          type="text"
                          name="name"
                          placeholder="Name *"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-xxl-6 col-xl-6 col-12">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email *"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-xxl-6 col-xl-6 col-12">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-xxl-6 col-xl-6 col-12">
                        <input
                          type="text"
                          name="subject"
                          placeholder="Subject *"
                          value={formData.subject || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-12">
                        <textarea
                          name="message"
                          placeholder="Messages *"
                          value={formData.message}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="btn_wrapper">
                          <button
                            className="wc-btn-primary btn-hover btn-item"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            <span></span>{" "}
                            {isSubmitting ? "Submitting..." : "Send"} <br />
                            Messages <i className="fa-solid fa-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
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

export default Contact1;
