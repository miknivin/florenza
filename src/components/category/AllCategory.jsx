import { Col, Container, Row } from "react-bootstrap";
import CategoryCard from "../common/card/CategoryCard";

export default function AllCategory({ allData }) {
  return (
    <>
      <Container>
        <Row>
          {allData && allData.length
            ? allData.map((el, i) => (
                <Col sm={3} key={i + "allCategory"}>
                  <CategoryCard el={el} />
                </Col>
              ))
            : "No category found"}
        </Row>
      </Container>
    </>
  );
}
