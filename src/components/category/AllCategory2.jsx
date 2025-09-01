import { Nav, Tab } from "react-bootstrap";
import FirstChildCategory from "./child/FirstChildCategory";

export default function AllCategory2({ allData }) {
  return (
    <>
      <div className="woocomerce__categoryp woocomerce-padding">
        <Tab.Container id="left-tabs-example" defaultActiveKey={allData[0]?.name?.toLowerCase()}>
          <div className="woocomerce__categoryp-wrapper">
            <div className="woocomerce__categoryp-left">
              <Nav
                className="woocomerce__categoryp-list flex-column"
                variant="underline"
              >
                {allData && allData.length
                  ? allData.map((el, i) => (
                      <Nav.Item key={i + "nat-item"}>
                        <Nav.Link
                          className="cateitem"
                          eventKey={el.name.toLowerCase()}
                        >
                          {el.name}{" "}
                          <i className="fa-solid fa-plus cat-icon plus"></i>
                          <i className="fa-solid fa-minus cat-icon minus"></i>
                        </Nav.Link>
                      </Nav.Item>
                    ))
                  : ""}
              </Nav>
            </div>
            <div className="woocomerce__categoryp-right">
              <Tab.Content className="tab-content" id="nav-tabContent">
                {allData && allData.length
                  ? allData.map((el, i) => (
                      <Tab.Pane
                        eventKey={el.name.toLowerCase()}
                        key={i + "tab-content"}
                      >
                        {el.first_child && el.first_child.length ? (
                          <FirstChildCategory firstChild={el.first_child} advertisement={el.advertisement} parentName={el.name} />
                        ) : (
                          "No Category Found"
                        )}
                      </Tab.Pane>
                    ))
                  : ""}
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </div>
    </>
  );
}
