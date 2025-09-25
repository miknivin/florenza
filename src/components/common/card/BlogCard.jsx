import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCard = ({ el }) => {
  return (
    <>
      <article className="blog__item">
        <div className="blog__img-wrapper">
          <Link href={`/blog/${el.id}`}>
            <div className="img-box">
              <Image
                priority
                width={390}
                height={450}
                style={{ width: "auto", height: "auto" }}
                className="image-box__item"
                src={`/assets/imgs/${el.img}`}
                alt="Blog Thumbnail"
              />
              <Image
                priority
                width={390}
                height={450}
                style={{ width: "auto", height: "auto" }}
                className="image-box__item"
                src={`/assets/imgs/${el.img}`}
                alt="BLog Thumbnail"
              />
            </div>
          </Link>
        </div>
        <h4 className="blog__meta">
          <Link href="/blog">{el.category}</Link> . {el.date}
        </h4>
        <h5>
          <Link href={`/blog/${el.id}`} className="blog__title">
            {el.title}
          </Link>
        </h5>
        <Link href={`/blog/${el.id}`} className="blog__btn">
          Read More{" "}
          <span>
            <i className="fa-solid fa-arrow-right"></i>
          </span>
        </Link>
      </article>
    </>
  );
};

export default BlogCard;
