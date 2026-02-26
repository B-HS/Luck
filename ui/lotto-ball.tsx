import { getBallColor } from "@/lib/ball-color.ts";
import { cn } from "@/lib/utils.ts";

export const LottoBall = ({
  number,
  size = "md",
}: {
  number: number;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClass = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold shadow-md",
        sizeClass,
        getBallColor(number)
      )}
    >
      {number}
    </span>
  );
};
