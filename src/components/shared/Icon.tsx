interface IconProps {
  src: string;
  size?: number;
  alt?: string;
  className?: string;
}

export function Icon({ src, size = 20, alt = "", className = "" }: IconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img src={src} alt={alt} width={size} height={size} className="block h-full w-full max-w-none" />
    </span>
  );
}
