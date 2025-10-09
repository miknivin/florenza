export default function HamburgerIcon({
  size = 200,
  color = "#fff",
  strokeWidth = 2,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
    >
      {/* Top line */}
      <line
        x1="15"
        y1="45"
        x2="85"
        y2="45"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom line */}
      <line
        x1="15"
        y1="60"
        x2="85"
        y2="60"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
