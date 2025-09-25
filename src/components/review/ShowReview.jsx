import Image from "next/image";

export default function ShowReview({ reviews }) {
  const star = (data) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i + "star"}
          className="fa-solid fa-star"
          style={{ color: i <= parseInt(data) ? "#FFAE4F" : "gray"}}
        />
      );
    }
    return stars;
  };
  return (
    <>
      {reviews && reviews.length
        ? reviews.map((el, i) => (
            <div key={i + "review"} className="my-4">
              <div>
                <div
                  style={{ width: "64px" }}
                  className="rounded-circle overflow-hidden"
                >
                  <Image
                    width={64}
                    height={64}
                    src="/assets/imgs/woocomerce/review/user.svg"
                    alt="Avatar"
                  />
                </div>
                <small style={{marginLeft: '9px'}}>{el.name}</small>
                <div>
                  {star(el.star)}
                </div>
              </div>
              <div>
                <p>
                  {el.details}
                </p>
              </div>
            </div>
          ))
        : ""}
    </>
  );
}
