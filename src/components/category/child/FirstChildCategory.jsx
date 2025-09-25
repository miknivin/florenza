import Image from "next/image";
import SecondChildCategory from "./SecondChildCategory";
import Link from "next/link";
import { useRouter } from "next/router";

export default function FirstChildCategory({ firstChild, advertisement, parentName }) {
  const router = useRouter();
  const redirect = (data) => {
    router.push(`/category/${validUrl(data)}`);
  }
  const validUrl = (data) => {
    return data.toLowerCase().split(" ").join("-")
  }
  return (
    <div>
      <div className="woocomerce__categoryp-items">
        {firstChild && firstChild.length
          ? firstChild.map((el, i) => (
              <div
                className="woocomerce__categoryp-item"
                key={i + "first_child"}
              >
                <div className="woocomerce__categoryp-titlewrapper">
                  <span className="woocomerce__categoryp-itemtitle">
                    <Link
                      style={{ color: "black" }}
                      href={`/category/${validUrl(el.name)}`}
                    >
                      {el.name}
                    </Link>
                  </span>
                </div>
                {el.second_child && el.second_child.length ? (
                  <SecondChildCategory secondChild={el.second_child} />
                ) : (
                  ""
                )}
              </div>
            ))
          : ""}
        <div className="woocomerce__categoryp-item d-none d-lg-block">
          <Image
            priority={true}
            onClick={() => redirect(parentName)}
            width={375}
            height={590}
            style={{ width: "100%", height: "100%" }}
            src={`/assets/imgs/${advertisement}`}
            alt="cat-img"
          />
        </div>
      </div>
    </div>
  );
}
