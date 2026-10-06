// Lightweight clsx + tailwind-merge replacement (no external deps)

export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

export function clsx(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    const t = typeof input;
    if (t === "string" || t === "number") {
      out.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = clsx(...input);
      if (inner) out.push(inner);
    } else if (t === "object") {
      for (const key of Object.keys(input as Record<string, unknown>)) {
        if ((input as Record<string, unknown>)[key]) out.push(key);
      }
    }
  }

  return out.join(" ");
}

const CONFLICTS: Array<[RegExp, string]> = [
  [/^(p|px|py|pt|pr|pb|pl|ps|pe)-/, "p"],
  [/^(m|mx|my|mt|mr|mb|ml|ms|me)-/, "m"],
  [/^(w|s?min-w|s?max-w)-/, "w"],
  [/^(h|s?min-h|s?max-h)-/, "h"],
  [/^text-(xs|sm|base|lg|xl|\d*xl)$/, "text-size"],
  [/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/, "font-weight"],
  [/^rounded(-(none|sm|md|lg|xl|2xl|3xl|full))?$/, "rounded"],
  [/^border(-(0|2|4|8))?$/, "border-w"],
  [/^gap-/, "gap"],
  [/^flex-(1|auto|initial|none)$/, "flex"],
  [/^leading-/, "leading"],
  [/^tracking-/, "tracking"],
  [/^opacity-/, "opacity"],
  [/^bg-\[.*\]$/, "bg-arb"],
];

function conflictGroup(cls: string): string {
  for (const [re, group] of CONFLICTS) {
    if (re.test(cls)) return group;
  }
  return cls;
}

export function twMerge(...inputs: ClassValue[]): string {
  const parts = clsx(...inputs).split(" ").filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];

  for (let i = parts.length - 1; i >= 0; i--) {
    const cls = parts[i];
    const group = conflictGroup(cls);
    if (seen.has(group)) continue;
    seen.add(group);
    out.unshift(cls);
  }

  return out.join(" ");
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(...inputs);
}
