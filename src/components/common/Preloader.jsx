const Preloader = ({ isDark = false }) => {
  return (
    <>
      <div
        style={{
          height: "100%",
          minHeight: "100dvh",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: 999,
        }}
        className={`w-100 d-flex justify-content-center align-items-center ${
          isDark ? "bg-dark" : "bg-white"
        }`}
      >
        <svg viewBox="0 0 240 240" height={240} width={240} className="pl">
          <circle
            strokeLinecap="round"
            strokeDashoffset={-330}
            strokeDasharray="0 660"
            strokeWidth={20}
            stroke="#000"
            fill="none"
            r={105}
            cy={120}
            cx={120}
            className="pl__ring pl__ring--a"
          />
          <circle
            strokeLinecap="round"
            strokeDashoffset={-110}
            strokeDasharray="0 220"
            strokeWidth={20}
            stroke="#000"
            fill="none"
            r={35}
            cy={120}
            cx={120}
            className="pl__ring pl__ring--b"
          />
          <circle
            strokeLinecap="round"
            strokeDasharray="0 440"
            strokeWidth={20}
            stroke="#000"
            fill="none"
            r={70}
            cy={120}
            cx={85}
            className="pl__ring pl__ring--c"
          />
          <circle
            strokeLinecap="round"
            strokeDasharray="0 440"
            strokeWidth={20}
            stroke="#000"
            fill="none"
            r={70}
            cy={120}
            cx={155}
            className="pl__ring pl__ring--d"
          />
        </svg>
      </div>
    </>
  );
};

export default Preloader;
