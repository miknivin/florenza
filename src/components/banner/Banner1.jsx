import Image from "next/image";
import Link from "next/link";

const Banner1 = ({ banner }) => {
  return (
    <>
      <section className="woocomerce__exclusive woocomerce-padding">
        <div className="woocomerce__exclusive-wrapper">
          {banner.map((el) => (
            <div key={el.id} className="woocomerce__exclusive-item">
              <div className="woocomerce__exclusive-img">
                <Image
                  width={900}
                  height={599}
                  src={`/assets/imgs/${el.img}`}
                  alt="Image"
                  data-speed="auto"
                />
              </div>

              <div className="woocomerce__exclusive-content">
                <span className="woocomerce__exclusive-subtitle title-anim fw-4">
                  {el.sub_title}
                </span>
                <h2 className="woocomerce__exclusive-title title-anim w-100 fw-4">
                  {el.title}
                </h2>
                <div className="woocomerce__exclusive-btnwraper wc_btn_wrapper">
                  <Link
                    className="woocomerce__exclusive-btn"
                    href={el.link ? `shop/${el.link}` : "shop/full"}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Banner1;
