import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold font-headline transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary-container/20 text-primary border border-primary-container/30',
        secondary:
          'bg-secondary-container/20 text-secondary border border-secondary-container/30',
        destructive:
          'bg-error-container/20 text-error border border-error/30',
        outline:
          'border border-outline-variant/30 text-on-surface-variant',
        success:
          'bg-primary-container/15 text-primary-fixed-dim border border-primary-container/25',
        warning:
          'bg-tertiary-container/20 text-tertiary-fixed-dim border border-tertiary-container/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
