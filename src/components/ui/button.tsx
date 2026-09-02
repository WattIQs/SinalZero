import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "premium-button border border-primary/65 bg-primary text-primary-foreground shadow-[0_8px_24px_-16px_rgba(255,173,0,.95)] hover:border-primary hover:bg-primary/95 hover:shadow-[0_12px_32px_-16px_rgba(255,173,0,1)]",
        destructive: "border border-destructive/60 bg-destructive text-destructive-foreground shadow-sm hover:border-destructive hover:bg-destructive/90",
        outline:
          "premium-button border border-primary/65 bg-primary/10 text-primary shadow-[0_6px_20px_-16px_rgba(255,173,0,.85)] hover:border-primary hover:bg-primary/15 hover:text-primary hover:shadow-[0_10px_28px_-16px_rgba(255,173,0,.95)]",
        secondary:
          "premium-button border border-primary/45 bg-secondary text-secondary-foreground shadow-sm hover:border-primary/70 hover:bg-primary/10 hover:text-primary",
        ghost: "premium-button border border-primary/25 text-foreground hover:border-primary/60 hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:text-primary hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
