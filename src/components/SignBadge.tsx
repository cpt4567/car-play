import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  size?: "sm" | "md";
};

export function SignBadge({ src, alt, size = "md" }: Props) {
  const dim = size === "sm" ? "h-16 w-20" : "h-24 w-28";
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-sm bg-white/95 ${dim}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={size === "sm" ? "80px" : "112px"}
        className="object-contain p-1.5"
      />
    </div>
  );
}
