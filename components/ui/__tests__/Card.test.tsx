import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { describe, it, expect } from 'vitest';

describe('Card', () => {
    it('renders card with children', () => {
        render(<Card>Card Content</Card>);
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('renders card subcomponents', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                </CardHeader>
                <CardContent>Content</CardContent>
            </Card>
        );
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<Card className="custom-card">Card</Card>);
        expect(screen.getByText('Card')).toHaveClass('custom-card');
    });
});
