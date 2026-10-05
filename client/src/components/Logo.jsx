export default function Logo({ size = 38, withText = true }) {
  return (
    <div
      className="meetly-logo"
      style={{
        "--logo-size": `${size}px`,
      }}
    >
      {/* Meetly Icon */}
      <svg
        className="meetly-logo-icon"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Meetly"
      >
        {/* Black rounded square */}
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="17"
          fill="#000000"
        />

        {/* Main video/chat shape */}
        <path
          d="M17 22.5
             C17 19.46 19.46 17 22.5 17
             H36
             C39.04 17 41.5 19.46 41.5 22.5
             V33.5
             C41.5 36.54 39.04 39 36 39
             H28.5
             L21 45
             V39
             C18.79 38.34 17 36.25 17 33.5
             V22.5Z"
          fill="white"
        />

        {/* Video/collaboration cutout */}
        <path
          d="M29 24
             L38 29
             L29 34
             V24Z"
          fill="black"
        />

        {/* Small connection bubble */}
        <path
          d="M39 29
             L47 24
             C48.1 23.3 49.5 24.1 49.5 25.4
             V38.6
             C49.5 39.9 48.1 40.7 47 40
             L39 35V29Z"
          fill="white"
        />
      </svg>

      {withText && (
        <span className="meetly-logo-text">
          Meetly
        </span>
      )}
    </div>
  );
}