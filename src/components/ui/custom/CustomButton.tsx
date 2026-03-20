import * as React from "react";
import { Button, type ButtonProps } from "../button";
import { cn } from "../../../lib/utils";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../tooltip";

export interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  tooltip?: string | false;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      children,
      loading = false,
      disabled,
      icon,
      iconPosition = "start",
      className,
      tooltip = false,
      variant,
      size,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const isIconOnly = size === "icon" || (!children && !!icon);

    const button = (
      <Button
        ref={ref}
        variant={variant}
        size={isIconOnly ? "icon" : size}
        disabled={isDisabled}
        className={cn(className)}
        {...props}
      >
        {loading ? (
          <div className="flex gap-1 items-center justify-center">
            <span>Loading...</span>
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            {icon && iconPosition === "start" && icon}
            {children && <span>{children}</span>}
            {icon && iconPosition === "end" && icon}
          </>
        )}
      </Button>
    );

    if (!tooltip) return button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
