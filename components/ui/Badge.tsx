import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ className = '', variant = 'default', ...props }, ref) => {
        const variants = {
            default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
            secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
            success: 'border-transparent bg-success text-success-foreground',
            warning: 'border-transparent bg-warning text-warning-foreground',
            danger: 'border-transparent bg-danger text-danger-foreground',
            outline: 'text-foreground border-border',
        };

        return (
            <div
                ref={ref}
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
                {...props}
            />
        );
    }
);
Badge.displayName = 'Badge';
