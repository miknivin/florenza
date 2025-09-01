import React, { useEffect, useReducer, useState } from "react";
import ProductCard from "../common/card/ProductCard";
import RatingFilter2 from "../shop/filter/type2/RatingFilter2";
import { Accordion } from "react-bootstrap";
import BrandFilter2 from "../shop/filter/type2/BrandFilter2";
import PriceFilter2 from "../shop/filter/type2/PriceFilter2";
import ColorFilter2 from "../shop/filter/type2/ColorFilter2";
import SortFilter2 from "../shop/filter/type2/SortFilter2";
import SortFilter from "../shop/filter/type1/SortFilter";
import RatingFilter from "../shop/filter/type1/RatingFilter";
import BrandFilter from "../shop/filter/type1/BrandFilter";
import PriceFilter from "../shop/filter/type1/PriceFilter";
import ColorFilter from "../shop/filter/type1/ColorFilter";
import filterFunction from "@/lib/utils/filterFunction";

const initialState = {
  selectedColor: [],
  selectedPrice: [],
  selectedBrand: [],
  selectedRating: [],
  selectedSort: [],
  showData: [],
  showDataHistory: [],
};
const reducer = (state, action) => {
  switch (action.type) {
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
    case "setShowDataHistory":
      return { ...state, showDataHistory: action.value };
    default:
      return state;
  }
};

export default function SingleCategory({ allData, allFilter }) {
  const [open, setOpen] = useState("");
  const [openMobile, setOpenMobile] = useState(false);
  const [productFilter, dispatch] = useReducer(reducer, initialState);

  const {
    selectedColor,
    selectedPrice,
    selectedBrand,
    selectedRating,
    selectedSort,
    showData,
    showDataHistory,
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
        selectedPrice
      ),
    });
    dispatch({
      type: "setShowDataHistory",
      value: filterFunction(
        allData,
        selectedColor,
        selectedBrand,
        selectedRating,
        selectedSort,
        selectedPrice
      ),
    });
  };
  useEffect(() => {
    dispatch({
      type: "setShowData",
      value: allData,
    });
    dispatch({
      type: "setShowDataHistory",
      value: allData,
    });
  }, [allData]);

  const searchFilter = (e) => {
    const searchData = e.target.value.toLowerCase();
    if (searchData) {
      let filter = showData.filter((el) =>
        el.title.toLowerCase().includes(searchData)
      );
      dispatch({
        type: "setShowData",
        value: filter,
      });
    } else {
      dispatch({
        type: "setShowData",
        value: showDataHistory,
      });
    }
  };

  return (
    <>
      <div className="woocomerce__filtering woocomerce-padding">
        {allFilter && Object.keys(allFilter).length ? (
          <div>
            <div className="woocomerce__filtering-wrapper">
              <div className="woocomerce__filtering-left">
                <div className="woocomerce__filtering-leftinner">
                  <span className="woocomerce__filtertitle">Shop by :</span>
                  <ul className="woocomerce__sortbuttons">
                    <li>
                      <ColorFilter
                        allColor={allFilter.color}
                        open={open}
                        setOpen={setOpen}
                        selectedColor={selectedColor}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </li>
                    <li>
                      <PriceFilter
                        allPrice={allFilter.price}
                        open={open}
                        setOpen={setOpen}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </li>
                    <li>
                      <BrandFilter
                        brand={allFilter.brand}
                        open={open}
                        setOpen={setOpen}
                        selectedBrand={selectedBrand}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </li>
                    <li>
                      <RatingFilter
                        rating={allFilter.rating}
                        open={open}
                        setOpen={setOpen}
                        selectedRating={selectedRating}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </li>
                    <li>
                      <SortFilter
                        sort={allFilter.sort_by}
                        open={open}
                        setOpen={setOpen}
                        selectedSort={selectedSort}
                        dispatch={dispatch}
                        filterAll={filterAll}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="woocommerce__filtering-right">
                <form action="#">
                  <input
                    placeholder="Type your keywords"
                    type="text"
                    name="search"
                    onChange={(e) => searchFilter(e)}
                    className="woocomerce__search"
                  />
                </form>
              </div>
            </div>
            <div className="woocomerce__filtering-mobwrapper">
              <span
                className="woocomerce__filtering-filtericon"
                onClick={() => setOpenMobile(!openMobile)}
              >
                <i className="fa-solid fa-filter"></i> filtering{" "}
              </span>
            </div>

            {/* mobile filtering */}
            {openMobile ? (
              <div className="woc__sfw_mobile">
                <div className="woocomerce__shopsidebar showed">
                  <Accordion
                    className="accordion short-by"
                    id="accordionExample"
                  >
                    <h3 className="woocomerce__shopsidebar-title">Sort by :</h3>
                    <Accordion.Item eventKey="0" className="accordion-item">
                      <Accordion.Header className="accordion-header">
                        Default
                      </Accordion.Header>
                      <Accordion.Body>
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
                        colors
                      </Accordion.Header>
                      <Accordion.Body>
                        <ColorFilter2
                          allColor={allFilter.color}
                          setOpenMobile={setOpenMobile}
                          selectedColor={selectedColor}
                          dispatch={dispatch}
                          filterAll={filterAll}
                        />
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2" className="accordion-item">
                      <Accordion.Header className="accordion-header">
                        Price
                      </Accordion.Header>
                      <Accordion.Body>
                        <PriceFilter2
                          allPrice={allFilter.price}
                          setOpenMobile={setOpenMobile}
                          dispatch={dispatch}
                          filterAll={filterAll}
                        />
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3" className="accordion-item">
                      <Accordion.Header className="accordion-header">
                        Brand
                      </Accordion.Header>
                      <Accordion.Body>
                        <BrandFilter2
                          brand={allFilter.brand}
                          setOpenMobile={setOpenMobile}
                          selectedBrand={selectedBrand}
                          dispatch={dispatch}
                          filterAll={filterAll}
                        />
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="4" className="accordion-item">
                      <Accordion.Header className="accordion-header">
                        Rating
                      </Accordion.Header>
                      <Accordion.Body>
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
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        {/* shop inner */}
        <div className="woocomerce__shopinner wc_feature_products">
          <div className="woocomerce__feature-wrapper filteringwrapper">
            {showData && showData.length ? (
              showData.map((el) => <ProductCard el={el} key={el.id} />)
            ) : (
              <p>No Product Found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
