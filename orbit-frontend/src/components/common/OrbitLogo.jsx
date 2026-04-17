/**
 * OrbitLogo — inline SVG version of the SLIIT Orbit logo.
 * No image file, no white background, renders cleanly on any dark background.
 *
 * Props:
 *   size   — px size of the square SVG (default 32)
 *   color  — stroke color (default "white")
 */
const OrbitLogo = ({ size = 32, color = 'white' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 75"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="SLIIT Orbit logo"
  >
    {/* Outer orbit ellipse */}
    <ellipse
      cx="50" cy="37.5" rx="48" ry="19"
      stroke={color} strokeWidth="3.2" strokeLinecap="round"
    />
    {/* Inner orbit ellipse (tilted) */}
    <ellipse
      cx="50" cy="37.5" rx="31" ry="12"
      stroke={color} strokeWidth="3.2" strokeLinecap="round"
      transform="rotate(-18 50 37.5)"
    />
    {/* Centre planet / node */}
    <circle cx="50" cy="37.5" r="7" fill={color} />
    {/* Sparkle top-right */}
    <path
      d="M78 10 L79.5 6 L81 10 L85 11.5 L81 13 L79.5 17 L78 13 L74 11.5 Z"
      fill={color} opacity="0.85"
    />
    {/* Sparkle bottom-left */}
    <path
      d="M18 60 L19 57 L20 60 L23 61 L20 62 L19 65 L18 62 L15 61 Z"
      fill={color} opacity="0.6"
    />
  </svg>
)

export default OrbitLogo
