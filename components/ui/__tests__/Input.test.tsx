import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';
import { describe, it, expect, vi } from 'vitest';

describe('Input', () => {
    it('renders the input', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('displays the label when provided', () => {
        render(<Input label="Username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('displays the error message when provided', () => {
        render(<Input error="Invalid input" />);
        expect(screen.getByText('Invalid input')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveClass('border-danger');
    });

    it('renders the right element when provided', () => {
        render(<Input rightElement={<span data-testid="right-icon">🔍</span>} />);
        expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('updates value on change', () => {
        render(<Input placeholder="Type here" />);
        const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Hello' } });
        expect(input.value).toBe('Hello');
    });
});
