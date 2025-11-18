import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Instagram = () => {
  const { data: instagramData, error } = useSWR(
    "assets/json/allInstagram.json",
    fetcher
  );

  if (error) return <div>Failed to load Instagram feed</div>;
  if (!instagramData) return null; // or a skeleton loader

  const instagram = instagramData.instagram;

  return (
    <section className="woocomerce__instagram woocomerce-padding">
      <span className="woocomerce__instagram-subtitle">Follow Us</span>
      <h2 className="woocomerce__instagram-title">
        <Link href="https://www.instagram.com/florenza_italiya?utm_source=ig_web_button_share_sheet&igsh=MXZ5eDBpaGZ6ejBmZQ==">
          @florenza_italiya
        </Link>
      </h2>
      <div className="woocomerce__instagram-wrapper">
        {instagram &&
          instagram.length > 0 &&
          instagram.map((el) => (
            <div key={el.id} className="woocomerce__instagram-item">
              <Link href="https://www.instagram.com/florenza_italiya?utm_source=ig_web_button_share_sheet&igsh=MXZ5eDBpaGZ6ejBmZQ==">
                <Image
                  priority={true}
                  width={210}
                  height={550}
                  style={{ height: "auto" }}
                  src={`/assets/imgs/${el.img}`}
                  alt="instagram img"
                />
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Instagram;
