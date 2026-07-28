import Link from "next/link";
import type { ComponentType } from "react";

type NavItemProps = {
  icon: ComponentType<{ className?: string; size?: number }>;
  label: string;
  href?: string;
  active?: boolean;
  collapsed: boolean;
  variant?: "row" | "stacked";
};

export function NavItem({
  icon: Icon,
  label,
  href,
  active,
  collapsed,
  variant = "row",
}: NavItemProps) {
  const stacked = variant === "stacked";

  const className = stacked
    ? [
        "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px]",
        active ? "text-info font-medium" : "text-text-on-dark-secondary",
        href ? "cursor-pointer" : "opacity-40 cursor-default",
      ].join(" ")
    : [
        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm",
        collapsed ? "justify-center" : "",
        active
          ? "bg-accent/15 text-text-on-dark font-medium"
          : "text-text-on-dark-secondary",
        href ? "hover:bg-white/5 cursor-pointer" : "opacity-40 cursor-default",
      ].join(" ");

  const content = stacked ? (
    <>
      <Icon size={18} />
      <span className="truncate max-w-full">{label}</span>
    </>
  ) : (
    <>
      <Icon className="shrink-0" size={16} />
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  );

  const title = !stacked && collapsed ? label : undefined;

  if (!href) {
    return (
      <div className={className} title={title}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={className} title={title}>
      {content}
    </Link>
  );
}
