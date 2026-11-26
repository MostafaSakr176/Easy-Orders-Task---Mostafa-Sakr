export const shareChannels = ["facebook", "whatsapp", "pinterest", "x", "copy", "native"] as const;
export type ShareChannel = (typeof shareChannels)[number];

export function shareUrl(channel: ShareChannel, title: string, pageUrl: string): string | null {
  const url = encodeURIComponent(pageUrl);
  const text = encodeURIComponent(`${title} ${pageUrl}`);
  if (channel === "facebook") return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  if (channel === "whatsapp") return `https://wa.me/?text=${text}`;
  if (channel === "pinterest") return `https://pinterest.com/pin/create/button/?url=${url}&description=${encodeURIComponent(title)}`;
  if (channel === "x") return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`;
  return null;
}
