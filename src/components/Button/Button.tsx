import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { ButtonProps } from './Button.types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-colors',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-blue-500',
      'focus-visible:ring-offset-2',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'rounded-md',
    ];

    const variantStyles = {
      primary: [
        'bg-blue-600',
        'text-white',
        'hover:bg-blue-700',
        'active:bg-blue-800',
      ],
      secondary: [
        'bg-gray-100',
        'text-gray-900',
        'hover:bg-gray-200',
        'active:bg-gray-300',
        'border',
        'border-gray-300',
      ],
      outline: [
        'bg-transparent',
        'text-blue-600',
        'border',
        'border-blue-600',
        'hover:bg-blue-50',
        'active:bg-blue-100',
      ],
      ghost: [
        'bg-transparent',
        'text-gray-700',
        'hover:bg-gray-100',
        'active:bg-gray-200',
      ],
      destructive: [
        'bg-red-600',
        'text-white',
        'hover:bg-red-700',
        'active:bg-red-800',
      ],
    };

    const sizeStyles = {
      small: ['h-8', 'px-3', 'text-sm'],
      medium: ['h-10', 'px-4', 'text-base'],
      large: ['h-12', 'px-6', 'text-lg'],
    };

    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      loading && 'cursor-not-allowed',
      className
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={buttonClasses}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';