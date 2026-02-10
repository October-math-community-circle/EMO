import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';
import { describe, it, expect } from 'vitest';

describe('Badge', () => {
    it('renders the badge with children', () => {
        render(<Badge>Test Badge</Badge>);
        expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('applies default variant classes', () => {
        render(<Badge>Default</Badge>);
        const badge = screen.getByText('Default');
        expect(badge).toHaveClass('bg-primary');
    });

    it('applies secondary variant classes', () => {
        render(<Badge variant="secondary">Secondary</Badge>);
        const badge = screen.getByText('Secondary');
        expect(badge).toHaveClass('bg-secondary');
    });

    it('applies custom className', () => {
        render(<Badge className="custom-class">Custom</Badge>);
        const badge = screen.getByText('Custom');
        expect(badge).toHaveClass('custom-class');
    });
});
