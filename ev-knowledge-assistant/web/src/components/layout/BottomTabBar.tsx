"use client";

import { usePathname } from "next/navigation";
import { NavItem } from "./NavItem";
import { LayoutDashboard, Car, Layers, FileText } from "lucide-react";

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 flex bg-chrome-sidebar border-t border-white/10">
      <NavItem
        icon={Car}
        label="EVs"
        href="/evs"
        active={pathname.startsWith("/evs")}
        collapsed={false}
        variant="stacked"
      />
      <NavItem
        icon={Layers}
        label="Models"
        href="/models"
        active={pathname.startsWith("/models")}
        collapsed={false}
        variant="stacked"
      />
      <NavItem
        icon={LayoutDashboard}
        label="Activity"
        href="/activity"
        active={pathname.startsWith("/activity")}
        collapsed={false}
        variant="stacked"
      />
      <NavItem
        icon={FileText}
        label="Docs"
        href="/docs"
        active={pathname.startsWith("/docs")}
        collapsed={false}
        variant="stacked"
      />
    </nav>
  );
}
