export function ProfileBlock({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-3.5 border-b border-border min-w-0">
      <div className="w-7 h-7 rounded-full bg-info text-text-on-dark flex items-center justify-center text-xs font-semibold shrink-0">
        JD
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-text-on-dark truncate">
            Jordan Diaz
          </div>
          <div className="text-xs text-text-on-dark-secondary truncate">
            Full Stack Developer
          </div>
        </div>
      )}
    </div>
  );
}
