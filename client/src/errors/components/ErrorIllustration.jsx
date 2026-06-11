/**
 * ErrorIllustration.jsx
 * Inline SVG illustrations keyed by error icon type.
 * All colors use CSS variables — auto-adapt to dark/light theme.
 */

const illustrations = {
  not_found: (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Planet */}
      <circle
        cx="48"
        cy="52"
        r="28"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-border)"
        strokeWidth="1.5"
      />
      {/* Ring */}
      <ellipse
        cx="48"
        cy="52"
        rx="38"
        ry="10"
        stroke="var(--theme-purple)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
      />
      {/* Craters */}
      <circle
        cx="38"
        cy="48"
        r="4"
        fill="var(--theme-border-hover)"
        opacity="0.6"
      />
      <circle
        cx="55"
        cy="58"
        r="3"
        fill="var(--theme-border-hover)"
        opacity="0.4"
      />
      {/* Question mark */}
      <text
        x="42"
        y="57"
        fill="var(--theme-accent)"
        fontSize="16"
        fontWeight="700"
        fontFamily="DM Sans, sans-serif"
      >
        ?
      </text>
      {/* Stars */}
      <circle
        cx="14"
        cy="20"
        r="1.5"
        fill="var(--theme-purple)"
        opacity="0.8"
      />
      <circle
        cx="80"
        cy="16"
        r="1"
        fill="var(--theme-accent)"
        opacity="0.7"
      />
      <circle
        cx="76"
        cy="34"
        r="1.5"
        fill="var(--theme-purple-light)"
        opacity="0.5"
      />
      <circle
        cx="20"
        cy="38"
        r="1"
        fill="var(--theme-accent)"
        opacity="0.6"
      />
      {/* Astronaut helmet suggestion */}
      <circle
        cx="48"
        cy="20"
        r="10"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-purple)"
        strokeWidth="1.5"
      />
      <circle
        cx="48"
        cy="20"
        r="5"
        fill="var(--theme-purple-dim)"
        stroke="var(--theme-purple)"
        strokeWidth="1"
      />
    </svg>
  ),

  lock: (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Lock body */}
      <rect
        x="22"
        y="44"
        width="52"
        height="38"
        rx="8"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-border)"
        strokeWidth="1.5"
      />
      {/* Shackle */}
      <path
        d="M32 44V32a16 16 0 0 1 32 0v12"
        stroke="var(--theme-purple)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Keyhole */}
      <circle
        cx="48"
        cy="59"
        r="5"
        fill="var(--theme-accent)"
        opacity="0.9"
      />
      <rect
        x="45.5"
        y="62"
        width="5"
        height="8"
        rx="2"
        fill="var(--theme-accent)"
        opacity="0.9"
      />
      {/* Stars */}
      <circle
        cx="15"
        cy="25"
        r="1.5"
        fill="var(--theme-accent)"
        opacity="0.7"
      />
      <circle
        cx="82"
        cy="18"
        r="1"
        fill="var(--theme-purple-light)"
        opacity="0.6"
      />
      <circle
        cx="78"
        cy="36"
        r="1.5"
        fill="var(--theme-purple)"
        opacity="0.5"
      />
    </svg>
  ),

  shield: (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Shield */}
      <path
        d="M48 12 L76 24 L76 48 C76 64 48 80 48 80 C48 80 20 64 20 48 L20 24 Z"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-border)"
        strokeWidth="1.5"
      />
      {/* Inner shield glow */}
      <path
        d="M48 20 L68 30 L68 48 C68 60 48 72 48 72 C48 72 28 60 28 48 L28 30 Z"
        fill="var(--theme-purple-dim)"
        stroke="var(--theme-purple)"
        strokeWidth="1"
        opacity="0.7"
      />
      {/* X mark */}
      <path
        d="M40 40 L56 56 M56 40 L40 56"
        stroke="var(--theme-red)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="15"
        cy="22"
        r="1.5"
        fill="var(--theme-accent)"
        opacity="0.7"
      />
      <circle
        cx="80"
        cy="20"
        r="1"
        fill="var(--theme-purple)"
        opacity="0.6"
      />
    </svg>
  ),

  server: (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Server rack */}
      <rect
        x="18"
        y="20"
        width="60"
        height="18"
        rx="4"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-border)"
        strokeWidth="1.5"
      />
      <rect
        x="18"
        y="42"
        width="60"
        height="18"
        rx="4"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-border)"
        strokeWidth="1.5"
      />
      <rect
        x="18"
        y="64"
        width="60"
        height="18"
        rx="4"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-border)"
        strokeWidth="1.5"
      />
      {/* Status lights */}
      <circle
        cx="30"
        cy="29"
        r="3"
        fill="var(--theme-green)"
        opacity="0.9"
      />
      <circle
        cx="30"
        cy="51"
        r="3"
        fill="var(--theme-red)"
        opacity="0.9"
      />
      <circle
        cx="30"
        cy="73"
        r="3"
        fill="var(--theme-accent)"
        opacity="0.9"
      />
      {/* Bars */}
      <rect
        x="38"
        y="26"
        width="20"
        height="3"
        rx="1.5"
        fill="var(--theme-border-hover)"
      />
      <rect
        x="38"
        y="48"
        width="14"
        height="3"
        rx="1.5"
        fill="var(--theme-red)"
        opacity="0.5"
      />
      <rect
        x="38"
        y="70"
        width="18"
        height="3"
        rx="1.5"
        fill="var(--theme-border-hover)"
      />
      {/* Warning triangle over middle server */}
      <path
        d="M68 42 L76 56 L60 56 Z"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-red)"
        strokeWidth="1.5"
      />
      <text
        x="66.5"
        y="54"
        fill="var(--theme-red)"
        fontSize="8"
        fontWeight="700"
        fontFamily="DM Sans, sans-serif"
      >
        !
      </text>
    </svg>
  ),

  network: (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Wifi arcs — faded except bottom */}
      <path
        d="M48 64 L48 64"
        stroke="var(--theme-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M38 56 Q48 50 58 56"
        stroke="var(--theme-purple)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M28 46 Q48 36 68 46"
        stroke="var(--theme-purple)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.15"
      />
      <path
        d="M18 36 Q48 20 78 36"
        stroke="var(--theme-purple)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.08"
      />
      {/* Dot center */}
      <circle
        cx="48"
        cy="68"
        r="4"
        fill="var(--theme-accent)"
      />
      {/* X slash across */}
      <path
        d="M24 20 L72 76"
        stroke="var(--theme-red)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M72 20 L24 76"
        stroke="var(--theme-red)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle
        cx="48"
        cy="48"
        r="30"
        stroke="var(--theme-border)"
        strokeWidth="1"
        strokeDasharray="3 4"
        fill="none"
      />
    </svg>
  ),

  ai: (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Brain outline */}
      <path
        d="M36 28 C28 28 22 34 22 42 C22 47 24 51 28 54 C26 56 25 59 25 62 C25 68 30 72 36 72 L60 72 C66 72 71 68 71 62 C71 59 70 56 68 54 C72 51 74 47 74 42 C74 34 68 28 60 28 C57 24 53 22 48 22 C43 22 39 24 36 28 Z"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-purple)"
        strokeWidth="1.5"
      />
      {/* Circuit lines */}
      <path
        d="M36 44 L44 44 L44 52 L52 52 L52 44 L60 44"
        stroke="var(--theme-purple)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <circle
        cx="44"
        cy="44"
        r="2"
        fill="var(--theme-purple)"
        opacity="0.8"
      />
      <circle
        cx="52"
        cy="52"
        r="2"
        fill="var(--theme-purple)"
        opacity="0.8"
      />
      {/* Sleeping Zzz */}
      <text
        x="58"
        y="30"
        fill="var(--theme-accent)"
        fontSize="10"
        fontWeight="700"
        opacity="0.9"
        fontFamily="DM Sans, sans-serif"
      >
        z
      </text>
      <text
        x="64"
        y="24"
        fill="var(--theme-accent)"
        fontSize="8"
        fontWeight="700"
        opacity="0.7"
        fontFamily="DM Sans, sans-serif"
      >
        z
      </text>
      <text
        x="70"
        y="18"
        fill="var(--theme-accent)"
        fontSize="6"
        fontWeight="700"
        opacity="0.5"
        fontFamily="DM Sans, sans-serif"
      >
        z
      </text>
      {/* Stars */}
      <circle
        cx="14"
        cy="48"
        r="1.5"
        fill="var(--theme-accent)"
        opacity="0.6"
      />
      <circle
        cx="82"
        cy="52"
        r="1"
        fill="var(--theme-purple-light)"
        opacity="0.5"
      />
    </svg>
  ),

  empty: (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Open box */}
      <path
        d="M20 52 L20 72 L76 72 L76 52"
        stroke="var(--theme-border-hover)"
        strokeWidth="1.5"
        fill="var(--theme-surface-2)"
        strokeLinejoin="round"
      />
      <path
        d="M16 44 L48 52 L80 44 L48 36 Z"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-border-hover)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 44 L20 52"
        stroke="var(--theme-border-hover)"
        strokeWidth="1.5"
      />
      <path
        d="M80 44 L76 52"
        stroke="var(--theme-border-hover)"
        strokeWidth="1.5"
      />
      {/* Stars drifting out */}
      <circle
        cx="48"
        cy="25"
        r="2"
        fill="var(--theme-purple)"
        opacity="0.5"
      />
      <circle
        cx="36"
        cy="18"
        r="1.5"
        fill="var(--theme-accent)"
        opacity="0.4"
      />
      <circle
        cx="60"
        cy="16"
        r="1"
        fill="var(--theme-purple-light)"
        opacity="0.3"
      />
    </svg>
  ),

  unknown: (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Shattered circle */}
      <circle
        cx="48"
        cy="48"
        r="30"
        fill="var(--theme-surface-2)"
        stroke="var(--theme-border)"
        strokeWidth="1.5"
      />
      <path
        d="M48 28 L52 42 L44 42 Z"
        fill="var(--theme-purple-dim)"
        stroke="var(--theme-purple)"
        strokeWidth="1"
      />
      <path
        d="M48 56 L48 64"
        stroke="var(--theme-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="48"
        cy="50"
        r="2.5"
        fill="var(--theme-accent)"
      />
      {/* Crack lines */}
      <path
        d="M48 28 L42 36 M48 28 L55 34"
        stroke="var(--theme-border-hover)"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle
        cx="20"
        cy="20"
        r="1.5"
        fill="var(--theme-accent)"
        opacity="0.5"
      />
      <circle
        cx="76"
        cy="22"
        r="1"
        fill="var(--theme-purple)"
        opacity="0.6"
      />
      <circle
        cx="78"
        cy="72"
        r="1.5"
        fill="var(--theme-accent)"
        opacity="0.4"
      />
      <circle
        cx="18"
        cy="70"
        r="1"
        fill="var(--theme-purple-light)"
        opacity="0.5"
      />
    </svg>
  ),
};

const ErrorIllustration = ({ icon = "unknown", className }) => {
  return (
    <div className={className}>
      {illustrations[icon] ?? illustrations.unknown}
    </div>
  );
};

export default ErrorIllustration;
