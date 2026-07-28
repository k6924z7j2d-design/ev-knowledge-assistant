import { PanelLeftOpen } from "lucide-react";
import { NavCollapseToggle } from "./NavCollapseToggle";

export function WorkspaceSwitcher({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  if (collapsed) {
    return (
      <div className="border-b border-border px-3.5 py-4 flex justify-center">
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Expand"
          className="group relative w-7 h-7 rounded-md"
        >
          <div className="absolute inset-0 rounded-md bg-accent text-text-on-dark flex items-center justify-center font-bold text-sm transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0">
            EV
          </div>
          <PanelLeftOpen
            size={16}
            className="absolute inset-0 m-auto text-text-on-dark-secondary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="border-b border-border min-w-0 px-3.5 py-4 flex items-center gap-2.5">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-7 h-7 rounded-md bg-accent text-text-on-dark flex items-center justify-center font-bold text-sm shrink-0">
          EV
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-text-on-dark truncate">
            EV Research
          </div>
          <div className="text-xs text-text-on-dark-secondary truncate">
            Acme Motors Inc.
          </div>
        </div>
      </div>
      <NavCollapseToggle collapsed={collapsed} onClick={onToggleCollapse} />
    </div>
  );
}
