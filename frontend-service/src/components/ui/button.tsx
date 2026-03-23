import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium font-headline transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary-container text-primary-on-container font-semibold shadow-glow-primary hover:shadow-glow-primary-lg hover:bg-primary-fixed-dim active:scale-[0.97]',
        destructive:
          'bg-error-container text-error hover:bg-error/90',
        outline:
          'ghost-border bg-transparent text-on-surface hover:bg-surface-container-high',
        secondary:
          'bg-secondary-container text-secondary-on-container hover:bg-secondary-fixed-dim',
        ghost:
          'bg-transparent text-on-surface hover:bg-surface-container-high',
        link: 'text-primary underline-offset-4 hover:underline',
        tactical:
          'border border-primary-container/40 bg-surface-container text-primary hover:bg-surface-container-high hover:border-primary-container/80 hover:shadow-glow-primary',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
