"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { ProfileBlock } from "./ProfileBlock";
import { NavItem } from "./NavItem";
import { LayoutDashboard, Car, Layers, FileText } from "lucide-react";

export function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className={[
        "hidden md:flex md:flex-col shrink-0 bg-chrome-sidebar overflow-x-hidden",
        "transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-60",
      ].join(" ")}
    >
      <WorkspaceSwitcher
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <ProfileBlock collapsed={collapsed} />

      <div className="px-2 py-3 flex flex-col gap-1">
        <NavItem
          icon={Car}
          label="EVs"
          href="/evs"
          active={pathname.startsWith("/evs")}
          collapsed={collapsed}
        />
        <NavItem
          icon={Layers}
          label="Models"
          href="/models"
          active={pathname.startsWith("/models")}
          collapsed={collapsed}
        />
        <NavItem
          icon={LayoutDashboard}
          label="Activity"
          href="/activity"
          active={pathname.startsWith("/activity")}
          collapsed={collapsed}
        />
        <NavItem
          icon={FileText}
          label="Docs"
          href="/docs"
          active={pathname.startsWith("/docs")}
          collapsed={collapsed}
        />
      </div>

      <div className="flex-1" />
    </nav>
  );
}
