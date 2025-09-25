import { useEffect, useReducer, useState } from "react";
import ProductCard from "../common/card/ProductCard";
import { Accordion } from "react-bootstrap";
import SortFilter2 from "./filter/type2/SortFilter2";
import CategoryFilter2 from "./filter/type2/CategoryFilter2";
import ColorFilter2 from "./filter/type2/ColorFilter2";
import PriceFilter2 from "./filter/type2/PriceFilter2";
import BrandFilter2 from "./filter/type2/BrandFilter2";
import RatingFilter2 from "./filter/type2/RatingFilter2";
import filterFunction from "@/lib/utils/filterFunction";

const initialState = {
  selectedCategory: [],
  selectedColor: [],
  selectedPrice: [],
  selectedBrand: [],
  selectedRating: [],
  selectedSort: [],
  showData: [],
};
const reducer = (state, action) => {
  switch (action.type) {
    case "setSelectedCategory":
      return { ...state, selectedCategory: action.value };
    case "setSelectedColor":
      return { ...state, selectedColor: action.value };
    case "setSelectedPrice":
      return { ...state, selectedPrice: action.value };
    case "setSelectedBrand":
      return { ...state, selectedBrand: action.value };
    case "setSelectedRating":
      return { ...state, selectedRating: action.value };
    case "setSelectedSort":
      return { ...state, selectedSort: action.value };
    case "setShowData":
      return { ...state, showData: action.value };
    default:
      return state;
  }
};

const SideFilter = ({ allData, allFilter }) => {
  const [openMobile, setOpenMobile] = useState(false);
  const [productFilter, dispatch] = useReducer(reducer, initialState);

  const {
    selectedColor,
    selectedPrice,
    selectedBrand,
    selectedRating,
    selectedSort,
    showData,
    selectedCategory,
  } = productFilter;

  const filterAll = () => {
    dispatch({
      type: "setShowData",
      value: filterFunction(
        allData,
        selectedColor,
        selectedBrand,
        selectedRating,
        selectedSort,
        selectedPrice,
        selectedCategory
      ),
    });
  };
  useEffect(() => {
    dispatch({
      type: "setShowData",
      value: allData,
    });
  }, [allData]);
  return (
    <>
      <div className="woocomerce__filtering woocomerce-padding">
        <div className="row">
          {allFilter && Object.keys(allFilter).length ? (
            <div className="col-lg-3">
              <div
                className={
                  openMobile
                    ? "woocomerce__shopsidebar wc_slide_btm showed"
                    : "woocomerce__shopsidebar wc_slide_btm"
                }
              >
                <Accordion className="accordion short-by">
                  <h3 className="woocomerce__shopsidebar-title">Sort by :</h3>
                  <Accordion.Item eventKey="0" className="accordion-item">
                    <Accordion.Header className="accordion-header">
                      <p>Default</p>
                    </Accordion.Header>
                    <Accordion.Body className="accordion-collapse collapse show">
                      <SortFilter2
                        sort={allFilter.sort_by}
                        setOpenMobile={setOpenMobile}
                        selectedSort={selectedSort}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </Accordion.Body>
                  </Accordion.Item>

                  <h3 className="woocomerce__shopsidebar-title title-pt">
                    Shop by :
                  </h3>
                  <Accordion.Item eventKey="1" className="accordion-item">
                    <Accordion.Header className="accordion-header">
                      <p>Category</p>
                    </Accordion.Header>
                    <Accordion.Body className="accordion-collapse collapse show">
                      <CategoryFilter2
                        category={allFilter.category}
                        setOpenMobile={setOpenMobile}
                        selectedCategory={selectedCategory}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2" className="accordion-item">
                    <Accordion.Header className="accordion-header">
                      <p>colors</p>
                    </Accordion.Header>
                    <Accordion.Body className="accordion-collapse collapse show">
                      <ColorFilter2
                        allColor={allFilter.color}
                        setOpenMobile={setOpenMobile}
                        selectedColor={selectedColor}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3" className="accordion-item">
                    <Accordion.Header className="accordion-header">
                      <p>Price</p>
                    </Accordion.Header>
                    <Accordion.Body className="accordion-collapse collapse show">
                      <PriceFilter2
                        allPrice={allFilter.price}
                        setOpenMobile={setOpenMobile}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="4" className="accordion-item">
                    <Accordion.Header className="accordion-header">
                      <p>Brand</p>
                    </Accordion.Header>
                    <Accordion.Body className="accordion-collapse collapse show">
                      <BrandFilter2
                        brand={allFilter.brand}
                        setOpenMobile={setOpenMobile}
                        selectedBrand={selectedBrand}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="5" className="accordion-item">
                    <Accordion.Header className="accordion-header">
                      <p>Rating</p>
                    </Accordion.Header>
                    <Accordion.Body className="accordion-collapse collapse show">
                      <RatingFilter2
                        setOpenMobile={setOpenMobile}
                        selectedRating={selectedRating}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
              <div className="woc__filtering-icon">
                <span
                  className="woocomerce__filtering-filtericon"
                  onClick={() => setOpenMobile(!openMobile)}
                >
                  <i className="fa-solid fa-filter"></i> filtering{" "}
                </span>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="col-lg-9">
            {/* shop inner   */}
            <div className="woocomerce__shopsidemain wc_feature_products">
              <div className="woocomerce__feature-wrapper filteringwrapper shopsidebar">
                {showData && showData.length ? (
                  showData.map((el) => <ProductCard el={el} key={el.id} />)
                ) : (
                  <p>No Product Found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideFilter;
