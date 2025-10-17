"use client";
import Image from "next/image";

export default function ShowReview({ reviews }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className="fa-solid fa-star"
          style={{
            color: i <= parseInt(rating) ? "#FFAE4F" : "gray",
            marginRight: "2px",
          }}
        />
      );
    }
    return stars;
  };

  // Map _id to avatar image paths with JPG, PNG, WebP
  const avatarMap = {
    "670c7e5a1f2b3c4d5e6f7a01": "/assets/imgs/testimonial/img1.jpg",  // Marianna
    "670c7e5a1f2b3c4d5e6f7a02": "/assets/imgs/testimonial/img2.jpg",  // Thomas
    "670c7e5a1f2b3c4d5e6f7a03": "/assets/imgs/testimonial/img3.jpg", // Anonymous
    "670c7e5a1f2b3c4d5e6f7a04": "/assets/imgs/testimonial/img4.jpg",  // John
    "670c7e5a1f2b3c4d5e6f7a05": "/assets/imgs/testimonial/img5.jpg",  // Vineeth
  };

  // Fallback avatar if no match
  const getAvatarSrc = (id) => avatarMap[id] || "/assets/imgs/woocomerce/review/user.svg";

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <div key={review._id} className="my-4 p-3 border rounded">
          <div className="d-flex align-items-center mb-2">
            <div
              style={{ width: "60px", height: "60px" }}
              className="rounded-circle overflow-hidden me-3"
            >
              <Image
                width={60}
                height={60}
                src={getAvatarSrc(review._id)}
                alt={`${review.userName} avatar`}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <small className="fw-bold">{review.userName}</small>
              <div className="mt-1">{renderStars(review.star)}</div>
            </div>
          </div>
          <div>
            <p className="mb-0">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}