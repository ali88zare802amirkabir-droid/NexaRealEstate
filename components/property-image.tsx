"use client";

/**
 * Deterministic, self-contained property artwork.
 * Renders an SVG "photograph" (sky + building + ground) so the demo needs no
 * external image requests and never suffers layout shift.
 */

const PALETTES: Array<[string, string, string]> = [
  ["#1b3a5c", "#4c9aff", "#0d1a2b"],
  ["#123a3a", "#2fd4e8", "#0a1f1f"],
  ["#2a2a4a", "#9d8bf5", "#15152a"],
  ["#3a2a1a", "#f5b53d", "#1f150a"],
  ["#1a3a2a", "#35d08a", "#0a1f14"],
  ["#3a1a2a", "#f4736f", "#1f0a12"],
  ["#1a2a3a", "#64748b", "#0a121a"],
  ["#2a1a3a", "#c084fc", "#150a1f"],
];

const BUILDING = ["apartment", "villa", "penthouse", "land"] as const;

type Variant = (typeof BUILDING)[number];

const FA_TYPE: Record<string, Variant> = {
  "آپارتمان": "apartment",
  "ویلا": "villa",
  "خانه ویلایی": "villa",
  "پنت‌هاوس": "penthouse",
  "زمین": "land",
  "تجاری": "apartment",
  apartment: "apartment",
  villa: "villa",
  penthouse: "penthouse",
  land: "land",
};

export function PropertyImage({
  tone = 0,
  type = "apartment",
  className,
  label,
}: {
  tone?: number;
  type?: string;
  className?: string;
  label?: string;
}) {
  const [sky, accent, ground] = PALETTES[tone % PALETTES.length];
  const variant: Variant = FA_TYPE[type] ?? "apartment";
  const gid = `pg${tone % PALETTES.length}${variant}`;

  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={label ?? "تصویر ملک"} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky} />
          <stop offset="100%" stopColor={accent} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${gid}-bld`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={ground} />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${gid}-sky)`} />

      <circle cx="330" cy="52" r="26" fill="#ffffff" opacity="0.22" />
      <circle cx="330" cy="52" r="16" fill="#ffffff" opacity="0.3" />

      <rect y="238" width="400" height="62" fill={ground} />
      <rect y="234" width="400" height="6" fill={accent} opacity="0.35" />

      {variant === "apartment" ? (
        <g>
          <rect x="120" y="70" width="160" height="168" rx="4" fill={`url(#${gid}-bld)`} />
          <rect x="120" y="70" width="160" height="10" rx="4" fill={accent} opacity="0.5" />
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, c) => (
              <rect
                key={`${r}-${c}`}
                x={136 + c * 36}
                y={92 + r * 28}
                width="22"
                height="16"
                rx="2"
                fill="#ffffff"
                opacity={(r + c) % 3 === 0 ? 0.5 : 0.18}
              />
            )),
          )}
          <rect x="186" y="200" width="28" height="38" rx="2" fill={ground} opacity="0.8" />
        </g>
      ) : null}

      {variant === "villa" ? (
        <g>
          <rect x="110" y="150" width="180" height="88" rx="3" fill={`url(#${gid}-bld)`} />
          <path d="M100 152 L200 96 L300 152 Z" fill={accent} opacity="0.85" />
          <rect x="186" y="196" width="28" height="42" rx="2" fill={ground} opacity="0.85" />
          <rect x="132" y="168" width="26" height="22" rx="2" fill="#ffffff" opacity="0.3" />
          <rect x="242" y="168" width="26" height="22" rx="2" fill="#ffffff" opacity="0.3" />
          <rect x="150" y="120" width="14" height="18" rx="2" fill={ground} opacity="0.7" />
        </g>
      ) : null}

      {variant === "penthouse" ? (
        <g>
          <rect x="100" y="110" width="200" height="128" rx="6" fill={`url(#${gid}-bld)`} />
          <rect x="100" y="110" width="200" height="14" rx="6" fill={accent} opacity="0.6" />
          <rect x="118" y="140" width="164" height="40" rx="3" fill="#ffffff" opacity="0.22" />
          <rect x="118" y="192" width="76" height="34" rx="3" fill="#ffffff" opacity="0.14" />
          <rect x="206" y="192" width="76" height="34" rx="3" fill="#ffffff" opacity="0.14" />
          <rect x="186" y="212" width="28" height="26" rx="2" fill={ground} opacity="0.8" />
        </g>
      ) : null}

      {variant === "land" ? (
        <g>
          <path d="M0 238 Q100 210 200 232 T400 226 V300 H0 Z" fill={accent} opacity="0.35" />
          <path d="M0 252 Q120 232 240 248 T400 244 V300 H0 Z" fill={ground} opacity="0.7" />
          <circle cx="90" cy="120" r="34" fill={accent} opacity="0.5" />
          <rect x="86" y="150" width="8" height="40" rx="3" fill={ground} opacity="0.8" />
          <circle cx="300" cy="140" r="26" fill={accent} opacity="0.4" />
          <rect x="297" y="162" width="7" height="34" rx="3" fill={ground} opacity="0.75" />
        </g>
      ) : null}

      <g opacity="0.5">
        <rect x="30" y="200" width="6" height="34" rx="3" fill={ground} />
        <circle cx="33" cy="192" r="18" fill={accent} opacity="0.5" />
        <rect x="356" y="206" width="5" height="28" rx="3" fill={ground} />
        <circle cx="358" cy="200" r="14" fill={accent} opacity="0.45" />
      </g>
    </svg>
  );
}
