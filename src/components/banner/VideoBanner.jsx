const VideoBanner = () => {
  return (
    <>
      <div className="woocomerce__bigImg" style={{ width: "100vw", position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw", borderRadius: "0", overflow: "hidden" }}>
        <video
          src="assets/video/hero-5.mp4"
          autoPlay
          loop
          muted
          style={{ width: "100%", height: "100%", minHeight: "400px", objectFit: "cover", borderRadius: "0", display: "block" }}
        ></video>
      </div>
    </>
  );
};

export default VideoBanner;
