import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { Download } from 'lucide-react';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="secondary">Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--secondary');
  });

  it('applies the correct size class', () => {
    render(<Button size="lg">Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--lg');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Button</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('button--disabled');
  });

  it('is disabled when loading is true', () => {
    render(<Button loading>Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('button--loading');
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Button</Button>);
    expect(document.querySelector('.button__spinner')).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    render(
      <Button icon={<Download data-testid="download-icon" />}>
        Download
      </Button>
    );
    expect(screen.getByTestId('download-icon')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    render(
      <Button iconRight={<Download data-testid="download-icon" />}>
        Download
      </Button>
    );
    expect(screen.getByTestId('download-icon')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders as icon-only button', () => {
    render(
      <Button icon={<Download data-testid="download-icon" />} aria-label="Download" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--icon-only');
    expect(screen.getByTestId('download-icon')).toBeInTheDocument();
  });

  it('applies full width class', () => {
    render(<Button fullWidth>Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--full-width');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes through additional props', () => {
    render(<Button data-testid="custom-button" type="submit">Button</Button>);
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('prevents click when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Button</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('prevents click when loading', () => {
    const handleClick = jest.fn();
    render(<Button loading onClick={handleClick}>Button</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has correct default props', () => {
    render(<Button>Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--primary', 'button--md');
    expect(button).not.toHaveClass('button--loading', 'button--disabled', 'button--full-width');
  });
});