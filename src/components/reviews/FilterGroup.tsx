import type { ReactNode } from "react";
import iconChevron from "../../assets/figma/icon-chevron.svg";
import { Icon } from "../shared/Icon";

interface FilterGroupProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function FilterGroup({ title, open, onToggle, children }: FilterGroupProps) {
  return (
    <div>
      <button type="button" className="flex w-full items-center justify-between text-[16px] font-semibold tracking-[-0.2px]" onClick={onToggle}>
        {title}
        <Icon src={iconChevron} size={12} className={open ? "" : "rotate-180"} />
      </button>
      {open ? <div className="mt-3 flex flex-col gap-3">{children}</div> : null}
    </div>
  );
}
