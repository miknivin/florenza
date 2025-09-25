import { Button, Col, Container, Row } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import CreateReview from "./CreateReview";
import ShowReview from "./ShowReview";
import { useEffect, useState } from "react";

export default function ReviewSection({ reviews }) {
  const [createReview, setCreateReview] = useState(false);
  const [starPercent, setStarPercent] = useState({});
  const star = (data) => {
    let totalStar = 0;
    data.map((el) => {
      totalStar += parseInt(el.star);
    });
    return Math.round(totalStar / data.length);
  };

  useEffect(() => {
    let fullStar = {
      five: 0,
      four: 0,
      three: 0,
      two: 0,
      one: 0,
    };
    let totalReview = 0;
    reviews.map((el) => {
      if (el.star == 5) {
        fullStar.five += 1;
      } else if (el.star == 4) {
        fullStar.four += 1;
      } else if (el.star == 3) {
        fullStar.three += 1;
      } else if (el.star == 2) {
        fullStar.two += 1;
      } else if (el.star == 1) {
        fullStar.one += 1;
      }
      totalReview += 1;
    });

    let percent = {
      five: (fullStar.five / totalReview) * 100,
      four: (fullStar.four / totalReview) * 100,
      three: (fullStar.three / totalReview) * 100,
      two: (fullStar.two / totalReview) * 100,
      one: (fullStar.one / totalReview) * 100,
    };

    setStarPercent(percent);
  }, [reviews]);
  return (
    <>
      <Container>
        <Row className="my-5">
          <Col
            md={{ span: 6, order: 1 }}
            xs={{ span: 12, order: 2 }}
            className="mt-5 mt-md-0"
          >
            <div>
              <h2>{reviews && reviews.length ? star(reviews) : 0} out of 5</h2>
              <h1 style={{fontWeight: '700'}}>
                Review Count: {reviews && reviews.length ? reviews.length : 0}
              </h1>
            </div>
            <Button
              onClick={() => setCreateReview(!createReview)}
              className="mt-3"
              size="sm"
              variant="dark"
            >
              Add Review
            </Button>
          </Col>
          <Col md={{ span: 6, order: 2 }} xs={{ span: 12, order: 1 }}>
            <div>
              <Row className="align-items-center">
                <Col xs={1}>5</Col>
                <Col xs={11}>
                  <ProgressBar now={starPercent.five} />
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs={1}>4</Col>
                <Col xs={11}>
                  <ProgressBar now={starPercent.four} />
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs={1}>3</Col>
                <Col xs={11}>
                  <ProgressBar now={starPercent.three} />
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs={1}>2</Col>
                <Col xs={11}>
                  <ProgressBar now={starPercent.two} />
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs={1}>1</Col>
                <Col xs={11}>
                  <ProgressBar now={starPercent.one} />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        {createReview ? (
          <div className="py-4" style={{ borderTop: "1px solid #e3dcd6" }}>
            <CreateReview />
          </div>
        ) : (
          ""
        )}

        <div style={{ borderTop: "1px solid #e3dcd6" }}>
          <ShowReview reviews={reviews} />
        </div>
      </Container>
    </>
  );
}
