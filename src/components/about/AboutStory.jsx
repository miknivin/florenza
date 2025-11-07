import Image from "next/image";

const AboutStory = ({ story }) => {
  return (
    <>
      <section className="story__area">
        {story && Object.keys(story).length ? (
          <div className="container g-0 line pt-140">
            <span className="line-3"></span>
            <div className="sec-title-wrapper">
              {/* <div className="from-text">
                from <span>{story.from}</span>
              </div> */}

              <div className="row">
                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
                  <h2
                    
                    className="sec-sub-title title-anim"
                  >
                    {story.sub_title}
                  </h2>
                  <h3  className="sec-title title-anim font-roboto-serif">
                    {story.title}
                  </h3>
                </div>
                <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
                  <div className="story__text">
                    <p>{story.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3">
                <div className="story__img-wrapper">
                  <Image
                    priority
                    width={300}
                    height={450}
                    style={{ height: "auto" }}
                    src={`/assets/imgs/${story.story_image_1}`}
                    alt="Story Thumbnail"
                    className="w-100"
                  />
                </div>
              </div>
              <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
                <div className="story__img-wrapper img-anim">
                  <Image
                    priority
                    width={520}
                    height={700}
                    style={{ height: "auto" }}
                    src={`/assets/imgs/${story.story_image_2}`}
                    alt="Story Thumbnail"
                    data-speed="auto"
                  />
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                <div className="story__img-wrapper">
                  <Image
                    priority
                    width={230}
                    height={140}
                    style={{ height: "auto" }}
                    src={`/assets/imgs/${story.story_image_3}`}
                    alt="Story Thumbnail"
                  />
                  <Image
                    priority
                    width={410}
                    height={330}
                    style={{ height: "auto" }}
                    src={`/assets/imgs/${story.story_image_4}`}
                    alt="Story Thumbnail"
                  />
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

export default AboutStory;
