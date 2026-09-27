export default function Logo({ size = 36, withText = true }) {
  return (
    <div className="logo">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        {/* Black circular background */}
        <circle cx="32" cy="32" r="30" fill="#000000" />

        {/* Left speech bubble */}
        <path
          d="M17 23
             C17 18.5 20.5 16 25 16
             H34
             C38.5 16 42 19.5 42 24
             V29
             C42 33.5 38.5 37 34 37
             H27
             L20 42
             V36
             C18 34.5 17 32 17 29 Z"
          fill="#FFFFFF"
        />

        {/* Right speech bubble */}
        <path
          d="M47 29
             C47 24.5 43.5 22 39 22
             H34
             C36 23.5 37 25.5 37 28
             V33
             C37 38.5 33 42 28 42
             H25
             C26.5 46 30 48 34 48
             H40
             L46 52
             V46
             C48 44 49 41 49 37 Z"
          fill="#FFFFFF"
          opacity="0.92"
        />

        {/* Small connection point */}
        <circle cx="32" cy="29" r="2.5" fill="#000000" />
      </svg>

      {withText && (
        <span className="logo-text">
          Meetly
        </span>
      )}
    </div>
  );
}