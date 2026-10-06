"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { X, ChevronLeft, ChevronRight, Search, Star, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------- Button ------------------------------- */

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg";

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:opacity-90",
  secondary: "bg-surface-2 text-ink hover:bg-surface-3",
  outline: "border border-edge text-ink-2 hover:bg-surface-2 hover:text-ink",
  ghost: "text-ink-3 hover:bg-surface-2 hover:text-ink",
  danger: "bg-danger text-white hover:opacity-90",
};

const BTN_SIZE: Record<ButtonSize, string> = {
  xs: "h-7 px-2 text-[11px] gap-1",
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-3.5 text-[13px] gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "focusable inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-100",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        BTN_VARIANT[variant],
        BTN_SIZE[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
});

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3.5 animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps & { label: string }>(function IconButton(
  { label, className, variant = "ghost", size = "sm", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        "focusable inline-flex items-center justify-center rounded-lg transition-colors duration-100",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        BTN_VARIANT[variant],
        size === "xs" ? "size-7" : size === "sm" ? "size-8" : "size-9",
        className,
      )}
      {...rest}
    />
  );
});

/* ------------------------------- Inputs ------------------------------- */

interface FieldWrapProps {
  label?: string;
  hint?: string;
  error?: string;
  children: (id: string) => ReactNode;
  className?: string;
}

function FieldWrap({ label, hint, error, children, className }: FieldWrapProps) {
  const id = useId();
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label htmlFor={id} className="lbl">
          {label}
        </label>
      ) : null}
      {children(id)}
      {hint && !error ? <p className="mt-1 text-[11px] text-ink-3">{hint}</p> : null}
      {error ? (
        <p role="alert" className="mt-1 text-[11px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, icon, wrapperClassName, className, ...rest },
  ref,
) {
  return (
    <FieldWrap label={label} hint={hint} error={error} className={wrapperClassName}>
      {(id) => (
        <div className="relative">
          {icon ? <span className="pointer-events-none absolute inset-y-0 start-2.5 flex items-center text-ink-3">{icon}</span> : null}
          <input
            id={id}
            ref={ref}
            aria-invalid={error ? true : undefined}
            className={cn("field", Boolean(icon) && "ps-9", error && "border-danger", className)}
            {...rest}
          />
        </div>
      )}
    </FieldWrap>
  );
});

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, wrapperClassName, className, ...rest },
  ref,
) {
  return (
    <FieldWrap label={label} hint={hint} error={error} className={wrapperClassName}>
      {(id) => (
        <textarea
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          className={cn("field min-h-24 resize-y", error && "border-danger", className)}
          {...rest}
        />
      )}
    </FieldWrap>
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, wrapperClassName, className, children, ...rest },
  ref,
) {
  return (
    <FieldWrap label={label} hint={hint} error={error} className={wrapperClassName}>
      {(id) => (
        <select id={id} ref={ref} className={cn("field appearance-none pe-8", error && "border-danger", className)} {...rest}>
          {children}
        </select>
      )}
    </FieldWrap>
  );
});

export function SearchInput({
  value,
  onChange,
  placeholder = "جستجو…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute inset-y-0 start-2.5 my-auto size-4 text-ink-3" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="field ps-9"
      />
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("focusable relative h-5.5 w-10 shrink-0 rounded-full transition-colors duration-150", checked ? "bg-accent" : "bg-surface-3")}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4.5 rounded-full bg-white transition-transform duration-150",
          checked ? "-translate-x-4.5 start-0.5" : "start-0.5",
        )}
      />
    </button>
  );
}

/* ------------------------------- Display ------------------------------- */

const BADGE_TONES: Record<string, string> = {
  default: "bg-surface-2 text-ink-2",
  accent: "bg-accent-soft text-accent",
  cyan: "bg-cyan-soft text-cyan",
  success: "bg-ok-soft text-ok",
  warning: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  violet: "bg-violet-soft text-violet",
  info: "bg-accent-soft text-accent",
};

export function Badge({
  children,
  tone = "default",
  className,
  size = "sm",
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES | string;
  className?: string;
  size?: "xs" | "sm";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap",
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        BADGE_TONES[tone] ?? BADGE_TONES.default,
        className,
      )}
    >
      {children}
    </span>
  );
}

const AVATAR_SIZE: Record<string, string> = {
  xs: "size-6 text-[9px]",
  sm: "size-8 text-[10px]",
  md: "size-10 text-[12px]",
  lg: "size-12 text-sm",
  xl: "size-16 text-lg",
};

export function Avatar({
  name,
  color = "#4c9aff",
  size = "md",
  className,
}: {
  name: string;
  color?: string;
  size?: keyof typeof AVATAR_SIZE;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white", AVATAR_SIZE[size], className)}
      style={{ backgroundColor: color }}
      aria-hidden="true"
      title={name}
    >
      {initials || "•"}
    </span>
  );
}

export function Panel({ children, className, as: Tag = "section" }: { children: ReactNode; className?: string; as?: "section" | "div" | "article" | "aside" }) {
  return <Tag className={cn("panel", className)}>{children}</Tag>;
}

export function PanelHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-4 py-3">
      <div className="min-w-0">
        <h2 className="truncate text-[13px] font-bold text-ink">{title}</h2>
        {subtitle ? <p className="mt-0.5 truncate text-[11px] text-ink-3">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", compact ? "px-4 py-8" : "px-6 py-16")}>
      <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-surface-2 text-ink-3">
        {icon ?? <PackageOpen className="size-6" />}
      </div>
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-[12.5px] text-ink-3">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<X className="size-6 text-danger" />}
      title="خطایی رخ داد"
      description={message ?? "بارگذاری داده‌ها با خطا مواجه شد. لطفاً دوباره تلاش کنید."}
      action={onRetry ? <Button size="sm" onClick={onRetry}>تلاش دوباره</Button> : undefined}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-surface-2", className)} aria-hidden="true" />;
}

export function LoadingBlock({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4" aria-busy="true" aria-label="در حال بارگذاری">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}

export function Rating({ value, count, size = "sm" }: { value: number; count?: number; size?: "xs" | "sm" }) {
  const star = size === "xs" ? "size-3" : "size-3.5";
  return (
    <span className="inline-flex items-center gap-1" aria-label={`امتیاز ${value} از ۵`}>
      <Star className={cn(star, "text-warn")} aria-hidden="true" />
      <span className={cn("font-semibold text-ink", size === "xs" ? "text-[11px]" : "text-xs")}>{value.toFixed(1)}</span>
      {count !== undefined ? <span className="text-[11px] text-ink-3">({count})</span> : null}
    </span>
  );
}

export function Progress({ value, max = 100, tone = "accent" }: { value: number; max?: number; tone?: "accent" | "ok" | "warn" | "danger" }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const bar = tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : tone === "danger" ? "bg-danger" : "bg-accent";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full transition-all duration-300", bar)} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ------------------------------- Overlays ------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => ref.current?.querySelector<HTMLElement>("input,select,textarea,button")?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const width = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size];

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn("flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-edge bg-surface shadow-elevated sm:rounded-2xl", width)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-edge px-5 py-3.5">
          <div>
            <h2 className="text-sm font-bold text-ink">{title}</h2>
            {description ? <p className="mt-0.5 text-[11.5px] text-ink-3">{description}</p> : null}
          </div>
          <IconButton label="بستن" onClick={onClose} className="-me-1 -mt-1">
            <X className="size-4" />
          </IconButton>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <footer className="flex items-center justify-end gap-2 border-t border-edge px-5 py-3">{footer}</footer> : null}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "تأیید",
  tone = "danger",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  tone?: "danger" | "primary";
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button size="sm" onClick={onClose}>انصراف</Button>
          <Button
            size="sm"
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[13px] leading-6 text-ink-2">{message}</p>
    </Modal>
  );
}

export function Drawer({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/55 backdrop-blur-[2px]" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col border-s border-edge bg-surface shadow-elevated"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-edge px-4 py-3">
          <h2 className="text-sm font-bold text-ink">{title}</h2>
          <IconButton label="بستن" onClick={onClose}>
            <X className="size-4" />
          </IconButton>
        </header>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer ? <footer className="border-t border-edge px-4 py-3">{footer}</footer> : null}
      </aside>
    </div>
  );
}

export function Dropdown({
  trigger,
  items,
  align = "end",
}: {
  trigger: ReactNode;
  items: { label: string; onClick: () => void; icon?: ReactNode; tone?: "danger" | "default" }[];
  align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} className="focusable rounded-lg">
        {trigger}
      </button>
      {open ? (
        <div
          role="menu"
          className={cn("absolute top-full z-50 mt-1 min-w-44 overflow-hidden rounded-xl border border-edge bg-surface-elevated p-1 shadow-pop", align === "end" ? "end-0" : "start-0")}
        >
          {items.map((item) => (
            <button
              key={item.label}
              role="menuitem"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={cn(
                "focusable flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-[12.5px] transition-colors hover:bg-surface-2",
                item.tone === "danger" ? "text-danger" : "text-ink-2",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { id: string; label: string; icon?: ReactNode; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={cn("flex flex-wrap items-center gap-1 rounded-xl border border-edge bg-surface-2 p-1", className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "focusable inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
            active === t.id ? "bg-surface text-ink shadow-card" : "text-ink-3 hover:text-ink",
          )}
        >
          {t.icon}
          {t.label}
          {t.count !== undefined ? <span className="text-[10px] text-ink-3">({t.count})</span> : null}
        </button>
      ))}
    </div>
  );
}

export function Pagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (p: number) => void }) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label="صفحه‌بندی" className="flex items-center justify-between gap-3 border-t border-edge px-4 py-3">
      <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronRight className="size-3.5" />
        قبلی
      </Button>
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn("focusable size-7 rounded-lg text-[12px] font-semibold transition-colors", p === page ? "bg-accent text-white" : "text-ink-3 hover:bg-surface-2 hover:text-ink")}
          >
            {p}
          </button>
        ))}
      </div>
      <Button size="sm" variant="outline" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
        بعدی
        <ChevronLeft className="size-3.5" />
      </Button>
    </nav>
  );
}

export function DataTable({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("table-wrap", className)}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

export function Th({ children, className, align = "right" }: { children?: ReactNode; className?: string; align?: "right" | "center" | "left" }) {
  return <th scope="col" className={cn("th", align === "center" && "text-center", align === "left" && "text-left", className)}>{children}</th>;
}

export function Td({ children, className, align = "right" }: { children?: ReactNode; className?: string; align?: "right" | "center" | "left" }) {
  return <td className={cn("td", align === "center" && "text-center", align === "left" && "text-left", className)}>{children}</td>;
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="table-wrap">
      <table className={cn("w-full border-collapse", className)}>{children}</table>
    </div>
  );
}

export function THead({ children, className }: { children: ReactNode; className?: string }) {
  return <thead className={cn("", className)}>{children}</thead>;
}

export function TBody({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={cn("", className)}>{children}</tbody>;
}

export function TRow({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn("border-b border-edge/60 last:border-0", className)}>{children}</tr>;
}

export function THeadCell({ children, className, align = "right" }: { children?: ReactNode; className?: string; align?: "right" | "center" | "left" }) {
  return <th scope="col" className={cn("th", align === "center" && "text-center", align === "left" && "text-left", className)}>{children}</th>;
}

export function TCell({ children, className, align = "right" }: { children?: ReactNode; className?: string; align?: "right" | "center" | "left" }) {
  return <td className={cn("td", align === "center" && "text-center", align === "left" && "text-left", className)}>{children}</td>;
}
