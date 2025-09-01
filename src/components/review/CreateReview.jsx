import React, { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";

export default function CreateReview() {
  const [activeStar, setActiveStar] = useState(0)
  const [selected, setSelected] = useState(null)
  return (
    <>
      <div>
        <div>
          <i
            className="fa-solid fa-star"
            onMouseEnter={() => setActiveStar(1)}
            onMouseLeave={() => setActiveStar(0)}
            onClick={() => setSelected(1)}
            style={{ color: (selected ? selected : activeStar) >= 1 ? "#FFAE4F" : 'gray', fontSize: "25px" }}
          />
          <i
            className="fa-solid fa-star"
            onMouseEnter={() => setActiveStar(2)}
            onMouseLeave={() => setActiveStar(0)}
            onClick={() => setSelected(2)}
            style={{ color: (selected ? selected : activeStar) >= 2 ? "#FFAE4F" : 'gray', fontSize: "25px" }}
          />
          <i
            className="fa-solid fa-star"
            onMouseEnter={() => setActiveStar(3)}
            onMouseLeave={() => setActiveStar(0)}
            onClick={() => setSelected(3)}
            style={{ color: (selected ? selected : activeStar) >= 3 ? "#FFAE4F" : 'gray', fontSize: "25px" }}
          />
          <i
            className="fa-solid fa-star"
            onMouseEnter={() => setActiveStar(4)}
            onMouseLeave={() => setActiveStar(0)}
            onClick={() => setSelected(4)}
            style={{ color: (selected ? selected : activeStar) >= 4 ? "#FFAE4F" : 'gray', fontSize: "25px" }}
          />
          <i
            className="fa-solid fa-star"
            onMouseEnter={() => setActiveStar(5)}
            onMouseLeave={() => setActiveStar(0)}
            onClick={() => setSelected(5)}
            style={{ color: (selected ? selected : activeStar) >= 5 ? "#FFAE4F" : 'gray', fontSize: "25px" }}
          />
        </div>
        <div className="mt-3">
          <Form.Control
            as="textarea"
            placeholder="Leave a review here"
            className="review_textarea"
            style={{ height: "100px"}}
          />
        </div>
        <div className="mt-1">
        <Button className="mt-3" size="sm" variant="dark">Submit</Button>
        </div>
      </div>
    </>
  );
}
