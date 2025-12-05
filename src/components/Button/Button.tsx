import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The variant style of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** The size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Icon to display before the button text */
  icon?: React.ReactNode;
  /** Icon to display after the button text */
  iconRight?: React.ReactNode;
  /** Make the button full width */
  fullWidth?: boolean;
  /** Button content */
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconRight,
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={clsx(
          'button',
          `button--${variant}`,
          `button--${size}`,
          {
            'button--loading': loading,
            'button--disabled': isDisabled,
            'button--full-width': fullWidth,
            'button--icon-only': !children && (icon || iconRight),
          },
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="button__spinner" />
            <span className="button__loading-text">
              {children || 'Loading...'}
            </span>
          </>
        ) : (
          <>
            {icon && <span className="button__icon button__icon--left">{icon}</span>}
            {children && <span className="button__text">{children}</span>}
            {iconRight && <span className="button__icon button__icon--right">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';