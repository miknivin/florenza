import Link from "next/link";

export default function SecondChildCategory({ secondChild }) {
  const validUrl = (data) => {
    return data.toLowerCase().split(" ").join("-");
  };
  return (
    <>
      <ul className="woocomerce__categoryp-rlist">
        {secondChild && secondChild.length
          ? secondChild.map((el, i) => (
              <li key={i + "second_child"}>
                <Link href={`/category/${validUrl(el.name)}`}>{el.name}</Link>
              </li>
            ))
          : ""}
      </ul>
    </>
  );
}
