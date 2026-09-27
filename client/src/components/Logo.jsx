// Original "Meetly" mark: two interlocking speech/link shapes in emerald tones.
export default function Logo({ size = 36, withText = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="#0B1914" />
        <path
          d="M20 24 C20 20 24 18 28 20 L36 24 C40 26 40 32 36 34 L28 38 C24 40 20 38 20 34 Z"
          fill="#43E6A5"
        />
        <path
          d="M44 30 C44 26 40 24 36 26 L28 30 C24 32 24 38 28 40 L36 44 C40 46 44 44 44 40 Z"
          fill="#8FFFC7"
          opacity="0.85"
        />
      </svg>
      {withText && (
        <span style={{ fontWeight: 700, fontSize: size * 0.5, letterSpacing: "-0.02em" }}>
          Link<span style={{ color: "#43E6A5" }}>Up</span>
        </span>
      )}
    </div>
  );
}
