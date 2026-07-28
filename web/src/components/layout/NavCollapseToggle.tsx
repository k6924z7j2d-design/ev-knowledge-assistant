"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function NavCollapseToggle({
  collapsed,
  onClick,
}: {
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? "Expand" : "Collapse"}
      className="w-7 h-7 rounded-md flex items-center justify-center text-text-on-dark-secondary hover:bg-white/5 shrink-0"
    >
      {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
    </button>
  );
}
