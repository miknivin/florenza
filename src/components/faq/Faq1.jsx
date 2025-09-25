import { Accordion } from "react-bootstrap";

const Faq1 = ({ faqData }) => {
  return (
    <>
      <section className="faq__area-6">
        {faqData && Object.keys(faqData).length ? (
          <div className="container g-0 line pt-130 pb-140">
            <div className="line-3"></div>

            <div className="row">
              <div className="col-xxl-12">
                <div className="sec-title-wrapper" style={{zIndex: 0}}>
                  <h2 className="sec-title-2 animation__char_come">
                    {faqData.title}
                  </h2>
                  <p className="">{faqData.sub_title}</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xxl-12">
                <div className="faq__list-6">
                  <Accordion
                    defaultActiveKey={0}
                    className="accordion"
                    id="accordionExample"
                  >
                    {faqData.items.map((el, i) => (
                      <Accordion.Item
                        key={el.id}
                        eventKey={i}
                        className="accordion-item"
                      >
                        <Accordion.Header
                          className="accordion-header"
                          id="headingOne"
                        >
                          {el.title}
                        </Accordion.Header>

                        <Accordion.Body className="accordion-body">
                          <p>{el.description}</p>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  );
};

export default Faq1;
