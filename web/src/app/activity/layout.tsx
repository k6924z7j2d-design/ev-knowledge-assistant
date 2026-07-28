import type { ReactNode } from "react";

export default function ActivityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[1390px] mx-auto px-10 py-8 pb-20">
      <div>
        <h1 className="text-[28px] font-bold mb-1">Activity</h1>
        <p className="text-text-secondary text-[15px] m-0">
          Your OpenRouter account and chat usage
        </p>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
