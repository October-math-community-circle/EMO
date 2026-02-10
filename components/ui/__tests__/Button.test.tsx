import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';
import { describe, it, expect, vi } from 'vitest';

describe('Button', () => {
    it('renders the button with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByRole('button', { name: /click me/i }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
    });

    it('applies primary variant classes by default', () => {
        render(<Button>Primary</Button>);
        const button = screen.getByRole('button', { name: /primary/i });
        expect(button).toHaveClass('bg-primary');
    });

    it('applies danger variant classes', () => {
        render(<Button variant="danger">Danger</Button>);
        const button = screen.getByRole('button', { name: /danger/i });
        expect(button).toHaveClass('bg-danger');
    });

    it('applies small size classes', () => {
        render(<Button size="sm">Small</Button>);
        const button = screen.getByRole('button', { name: /small/i });
        expect(button).toHaveClass('h-9');
    });
});
