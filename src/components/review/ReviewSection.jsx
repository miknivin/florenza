"use client";
import { Button, Col, Container, Row } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import CreateReview from "./CreateReview";
import ShowReview from "./ShowReview";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { gsap } from "gsap";
import { SplitText } from "@/plugins";

export default function ReviewSection({ productId }) {
  const [createReview, setCreateReview] = useState(false);
  const [canReview, setCanReview] = useState(true); // Hardcoded for demo
  const animationTitle = useRef();
  const [reviews] = useState([
    {
      _id: "670c7e5a1f2b3c4d5e6f7a01",
      star: 5,
      comment: "This perfume has an elegant blend of floral and woody notes that create a long-lasting fragrance, leaving a sophisticated trail that feels both warm and refreshing throughout the day.",
      productId: "prod_001",
      createdAt: "2025-10-01T10:15:30.123Z",
      userName: "Elizabeth",
    },
    {
      _id: "670c7e5a1f2b3c4d5e6f7a02",
      star: 4,
      comment: "I was amazed by how this scent evolves over time—from a fresh burst of citrus in the beginning to a deep, sensual undertone that lingers beautifully on clothes and skin for hours.",
      productId: "prod_001",
      createdAt: "2025-09-28T14:22:45.456Z",
      userName: "Vishnu",
    },
    {
      _id: "670c7e5a1f2b3c4d5e6f7a03",
      star: 3,
      comment: "It’s the kind of fragrance that instantly lifts your mood and boosts confidence, making it perfect for both daily wear and special occasions when you want to stand out effortlessly.",
      productId: "prod_001",
      createdAt: "2025-09-20T09:05:12.789Z",
      userName: "Alwin",
    },
    {
      _id: "670c7e5a1f2b3c4d5e6f7a04",
      star: 5,
      comment: "The perfume has an exquisite balance between sweetness and spice, offering a luxurious aroma that feels timeless, classy, and suitable for any season or mood.",
      productId: "prod_001",
      createdAt: "2025-09-15T18:33:21.321Z",
      userName: "Vineeth",
    },
    {
      _id: "670c7e5a1f2b3c4d5e6f7a05",
      star: 4,
      comment: "I found the fragrance to be overpowering and not to my taste. It didn’t last as long as I expected, and the scent became unpleasant after a short while.",
        productId: "prod_001",
      createdAt: "2025-09-15T18:33:21.321Z",
      userName: "savad",  
    }
  ]);

  // GSAP animation for title
  useEffect(() => {
    if (typeof window !== "undefined") {
      let tHero = gsap.context(() => {
        let title = animationTitle.current;
        let split_title = new SplitText(title, { type: "chars, words" });
        gsap.from(split_title.chars, {
          duration: 1,
          x: 70,
          autoAlpha: 0,
          stagger: 0.05,
        });
      });
      return () => tHero.revert();
    }
  }, []);

  useEffect(() => {
    if (!reviews.length) {
      setStarPercent({
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      });
      return;
    }

    const fullStar = {
      five: 0,
      four: 0,
      three: 0,
      two: 0,
      one: 0,
    };

    reviews.forEach((el) => {
      if (el.star === 5) fullStar.five += 1;
      else if (el.star === 4) fullStar.four += 1;
      else if (el.star === 3) fullStar.three += 1;
      else if (el.star === 2) fullStar.two += 1;
      else if (el.star === 1) fullStar.one += 1;
    });

    const totalReview = reviews.length;
    const percent = {
      five: totalReview ? (fullStar.five / totalReview) * 100 : 0,
      four: totalReview ? (fullStar.four / totalReview) * 100 : 0,
      three: totalReview ? (fullStar.three / totalReview) * 100 : 0,
      two: totalReview ? (fullStar.two / totalReview) * 100 : 0,
      one: totalReview ? (fullStar.one / totalReview) * 100 : 0,
    };

    setStarPercent(percent);
  }, [reviews]);

  const [starPercent, setStarPercent] = useState({
    five: 50, // 2/4 reviews are 5 stars
    four: 25, // 1/4 reviews are 4 stars
    three: 0,  // 0/4 reviews are 3 stars
    two: 0,    // 0/4 reviews are 2 stars
    one: 25,   // 1/4 reviews are 1 star
  });

  const calculateAverageStar = (data) => {
    if (!data || data.length === 0) return 0;
    const totalStar = data.reduce((sum, el) => sum + parseInt(el.star), 0);
    return Math.round(totalStar / data.length);
  };

  const handleReviewSubmitted = () => {
    toast.success("Review submitted successfully (simulated)");
  };

  return (
    <section className="review__area-6">
      <Container>
        <Row className="my-5">
 <Col md={{ span: 6, order: 1 }} xs={{ span: 12, order: 2 }} className="mt-5 mt-md-0">
  <div>
    <h2 className="sec-title-2" ref={animationTitle} style={{ fontSize: "2.0rem" }}>
      {calculateAverageStar(reviews)} out of 5
    </h2>
    <h1 style={{ fontWeight: "700", fontSize: "1.4rem" }}>
      Review Count: {reviews.length}
    </h1>
  </div>
  {canReview && (
    <Button
      onClick={() => setCreateReview(!createReview)}
      className="mt-3"
      size="sm"
      variant="dark"
    >
      Add Review
    </Button>
  )}
</Col>
          <Col md={{ span: 6, order: 2 }} xs={{ span: 12, order: 1 }}>
            <div>
              {[
                { label: "5", value: starPercent.five },
                { label: "4", value: starPercent.four },
                { label: "3", value: starPercent.three },
                { label: "2", value: starPercent.two },
                { label: "1", value: starPercent.one },
              ].map(({ label, value }) => (
                <Row key={label} className="align-items-center mb-2">
                  <Col xs={1}>{label}</Col>
                  <Col xs={11}>
                    <ProgressBar now={value} variant="warning" style={{ height: "10px" }} />
                  </Col>
                </Row>
              ))}
            </div>
          </Col>
        </Row>

        {createReview && canReview && (
          <div className="py-4" style={{ borderTop: "1px solid #e3dcd6" }}>
            <CreateReview productId={productId} onReviewSubmitted={handleReviewSubmitted} />
          </div>
        )}

        <div style={{ borderTop: "1px solid #e3dcd6" }}>
          <ShowReview reviews={reviews} />
        </div>
      </Container>
    </section>
  );
}