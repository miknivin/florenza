import Image from "next/image";
import Link from "next/link";

export default function ComboSlide({
  title,
  imageUrl,
  description,
  buttonText,
  buttonLink,
  bgColor,
}) {
  return (
    <div
      className="overflow-hidden shadow-lg"
      style={{
        minHeight: "380px",
      }}
    >
      <div className="row g-4 align-items-center">
        {/* LEFT: IMAGE (logo inside) */}
        <div className="col-md-4 text-center position-relative">
          <Image
            src={imageUrl}
            alt={title}
            width={440}
            height={463}
            className="img-fluid rounded-3 image-custom"
            priority
          />
        </div>

        {/* RIGHT: TEXT + BUTTON */}
        <div
          style={{ padding: "0 30px" }}
          className="col-md-7 d-flex flex-column justify-content-center px-md-5 position-relative"
        >
          <div
            style={{
              minWidth: "81vw",
              maxWidth: "90vw",
              height: "calc(100% + 190px)",
              left: "-15vw",
              top: "-16vh",
              borderRadius: "15px",
              backgroundColor: `${bgColor}`,
            }}
            className="position-absolute d-none d-md-block"
          ></div>
          <h2 className="display-6 fw-bold mb-3">{title}</h2>
          <p className="mb-4 small text-dark pe-1 pe-md-5">{description}</p>

          <Link
            href={buttonLink}
            className="btn btn-dark rounded-pill px-4 py-2 align-self-start text-white"
            style={{
              background: "linear-gradient(45deg, #222, #000)",
              border: "none",
            }}
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
