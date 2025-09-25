import Link from "next/link";
import { useState } from "react";

export default function AllCategoryMobile({ allData }) {
  const [parentActive, setParentActive] = useState(null);
  const [childActive, setChildActive] = useState(null);
  const validUrl = (data) => {
    return data.toLowerCase().split(" ").join("-");
  };
  return (
    <>
      <div className="category_mobile">
        {allData && allData.length
          ? allData.map((el) => (
              <div
                key={el.id}
                className={
                  parentActive == el.id
                    ? "parent_category active"
                    : "parent_category"
                }
              >
                <p
                  onClick={() =>
                    setParentActive(parentActive == el.id ? null : el.id)
                  }
                >
                  <Link href={`/category/${validUrl(el.name)}`}>{el.name}</Link>{" "}
                  <i className="fa-solid fa-plus cat-icon cat_plus"></i>{" "}
                  <i className="fa-solid fa-minus cat-icon cat_minus"></i>
                </p>
                {parentActive == el.id ? (
                  <div>
                    {el.first_child && el.first_child.length
                      ? el.first_child.map((el2) => (
                          <div
                            key={el2.id}
                            className={
                              childActive == el2.id
                                ? "first_child active"
                                : "first_child"
                            }
                          >
                            <p
                              onClick={() =>
                                setChildActive(
                                  childActive == el2.id ? null : el2.id
                                )
                              }
                            >
                              <Link href={`/category/${validUrl(el2.name)}`}>
                                {el2.name}
                              </Link>{" "}
                              <i className="fa-solid fa-plus cat-icon cat_plus2"></i>{" "}
                              <i className="fa-solid fa-minus cat-icon cat_minus2"></i>
                            </p>
                            {childActive == el2.id ? (
                              <div>
                                {el2.second_child && el2.second_child.length
                                  ? el2.second_child.map((el3) => (
                                      <div
                                        key={el3.id}
                                        className="second_child"
                                      >
                                        <p>
                                          <Link
                                            href={`/category/${validUrl(
                                              el3.name
                                            )}`}
                                          >
                                            {el3.name}
                                          </Link>
                                        </p>
                                      </div>
                                    ))
                                  : ""}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ))
                      : ""}
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))
          : ""}
      </div>
    </>
  );
}
