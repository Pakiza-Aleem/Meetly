export default function Logo({ size = 40, withText = true }) {
  return (
    <div
      className="meetly-logo"
      style={{
        "--logo-size": `${size}px`,
      }}
    >
      <svg
        className="meetly-mark"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Meetly"
      >
        {/* Meetly M / Connection Mark */}

        {/* Left half */}
        <path
          d="
            M12 42
            V24
            C12 17.373 17.373 12 24 12
            C28.2 12 31.9 14.15 34 17.4
            C36.1 14.15 39.8 12 44 12
            C50.627 12 56 17.373 56 24
            V42
            H45
            V25
            C45 22.239 42.761 20 40 20
            C37.239 20 35 22.239 35 25
            V42
            H29
            V25
            C29 22.239 26.761 20 24 20
            C21.239 20 19 22.239 19 25
            V42
            H12Z
          "
          fill="#000000"
        />

        {/* Connection / meeting point */}
        <circle
          cx="32"
          cy="46"
          r="5"
          fill="#000000"
        />
      </svg>

      {withText && (
        <span className="meetly-wordmark">
          Meetly
        </span>
      )}
    </div>
  );
}