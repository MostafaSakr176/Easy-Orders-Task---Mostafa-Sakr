import type { KeyboardEvent } from "react";
import type { ShareChannel } from "../../lib/share";

interface ShareMenuProps {
  onShare: (channel: ShareChannel) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  align?: "left" | "right";
  native?: boolean;
}

const channels = [
  { id: "facebook", label: "Facebook" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "pinterest", label: "Pinterest" },
  { id: "x", label: "Post on X" },
  { id: "copy", label: "Copy link" },
] as const;

export function ShareMenu({ onShare, onKeyDown, align = "right", native = false }: ShareMenuProps) {
  const position = align === "left" ? "left-14 top-0" : "right-0 top-12";
  return (
    <div
      role="menu"
      aria-label="Share"
      onKeyDown={onKeyDown}
      className={`absolute z-20 w-44 rounded-lg border border-[#e6e6e6] bg-white p-2 text-sm shadow-lg ${position}`}
    >
      {native ? (
        <button type="button" role="menuitem" className="block w-full rounded px-2 py-2 text-left hover:bg-[#f2f2f2]" onClick={() => onShare("native")}>
          Share…
        </button>
      ) : null}
      {channels.map((channel) => (
        <button
          key={channel.id}
          type="button"
          role="menuitem"
          className="block w-full rounded px-2 py-2 text-left hover:bg-[#f2f2f2]"
          onClick={() => onShare(channel.id)}
        >
          {channel.label}
        </button>
      ))}
    </div>
  );
}
