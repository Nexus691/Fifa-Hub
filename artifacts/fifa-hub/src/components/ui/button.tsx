import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
" hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default:
           // @replit: no hover, and add primary border
           "bg-primary text-primary-foreground border border-primary-border",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm border-destructive-border",
        outline:
          // @replit Shows the background color of whatever card / sidebar / accent background it is inside of.
          // Inherits the current text color. Uses shadow-xs. no shadow on active
          // No hover state
          " border [border-color:var(--button-outline)] shadow-xs active:shadow-none ",
        secondary:
          // @replit border, no hover, no shadow, secondary border.
          "border bg-secondary text-secondary-foreground border border-secondary-border ",
        // @replit no hover, transparent border
        ghost: "border border-transparent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // @replit changed sizes
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

import { motion } from "framer-motion"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // @ts-ignore - motion(Slot) works but types can be finicky
    const Comp = asChild ? motion.create ? motion.create(Slot) : motion(Slot) : motion.button;
    
    let motionProps = {};
    if (variant === "default") {
      motionProps = {
        whileHover: {
          scale: 1.02,
          boxShadow: '0 6px 24px rgba(212,175,55,0.3), 0 2px 8px rgba(212,175,55,0.2)',
          transition: { duration: 0.2 }
        },
        whileTap: {
          scale: 0.97,
          boxShadow: '0 2px 8px rgba(212,175,55,0.15)',
          transition: { duration: 0.1 }
        }
      };
    } else if (variant === "outline") {
      motionProps = {
        whileHover: { backgroundColor: 'rgba(212,175,55,0.08)', scale: 1.02 },
        whileTap: { scale: 0.97 }
      };
    } else {
      motionProps = {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.95 }
      };
    }

    return (
      // @ts-ignore - framer-motion props clash with standard DOM props for onDrag
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...motionProps}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
