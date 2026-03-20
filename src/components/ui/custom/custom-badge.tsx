import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateHexColorFromString } from "@/helpers/utils";
import { cn } from "@/lib/utils";

type TagVariant = "filled" | "solid" | "outlined";
type TagSize = "sm" | "md" | "lg";

interface CustomTagProps {
  tag_text?: string;
  variant?: TagVariant;
  showTooltip?: boolean;
  tooltipText?: string;
  size?: TagSize;
  className?: string;
}

const SIZE_STYLES: Record<TagSize, React.CSSProperties> = {
  sm: {
    fontSize: "10px",
    padding: "0 6px",
    lineHeight: "18px",
  },
  md: {
    fontSize: "12px",
    padding: "0 8px",
    lineHeight: "22px",
  },
  lg: {
    fontSize: "14px",
    padding: "0 10px",
    lineHeight: "26px",
  },
};

export const CustomTag: React.FC<CustomTagProps> = ({
  tag_text,
  variant = "solid",
  showTooltip = false,
  tooltipText,
  size = "md",
  className,
}) => {
  if (!tag_text) return null;

  const color = generateHexColorFromString(tag_text);

  const variantStyles: React.CSSProperties =
    variant === "outlined"
      ? {
          border: `1px solid ${color}`,
          color,
          background: "transparent",
        }
      : variant === "filled"
        ? {
            background: `${color}20`,
            color,
          }
        : {
            background: color,
            color: "#fff",
          };

  const tagElement = (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium capitalize",
        className,
      )}
      style={{
        ...SIZE_STYLES[size],
        ...variantStyles,
      }}
    >
      {tag_text}
    </span>
  );

  if (!showTooltip) return tagElement;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{tagElement}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText || tag_text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTag;
