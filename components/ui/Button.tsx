import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-sm active:translate-y-[1px]';

        const variants = {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-red-900/10',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
            outline: 'border border-input bg-background hover:bg-muted hover:text-foreground text-foreground shadow-sm',
            ghost: 'hover:bg-muted hover:text-foreground text-muted-foreground shadow-none',
            danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
        };

        const sizes = {
            sm: 'h-9 px-4 text-xs',
            md: 'h-10 px-6 py-2',
            lg: 'h-12 px-8 text-base',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
