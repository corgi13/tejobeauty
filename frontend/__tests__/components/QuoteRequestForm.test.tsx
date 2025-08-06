import { render, screen, fireEvent } from '@testing-library/react';
import { QuoteRequestForm } from '../../components/b2b/QuoteRequestForm';

describe('QuoteRequestForm', () => {
  it('renders form fields correctly', () => {
    render(<QuoteRequestForm />);
    
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<QuoteRequestForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/company name is required/i)).toBeInTheDocument();
  });

  it('calculates total correctly', () => {
    render(<QuoteRequestForm />);
    
    const quantityInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(quantityInput, { target: { value: '10' } });
    
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });
});