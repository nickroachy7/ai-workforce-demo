import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  style,
  ...props
}) => {
  const getVariantStyles = (variant: ButtonVariant): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      border: '2px solid',
      borderRadius: '6px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
      fontFamily: 'inherit',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      textDecoration: 'none',
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyles, backgroundColor: '#3b82f6', borderColor: '#3b82f6', color: '#ffffff' };
      case 'secondary':
        return { ...baseStyles, backgroundColor: '#6b7280', borderColor: '#6b7280', color: '#ffffff' };
      case 'outline':
        return { ...baseStyles, backgroundColor: 'transparent', borderColor: '#d1d5db', color: '#374151' };
      case 'danger':
        return { ...baseStyles, backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#ffffff' };
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = (size: ButtonSize): React.CSSProperties => {
    switch (size) {
      case 'small': return { padding: '6px 12px', fontSize: '14px', lineHeight: '20px' };
      case 'medium': return { padding: '8px 16px', fontSize: '16px', lineHeight: '24px' };
      case 'large': return { padding: '12px 24px', fontSize: '18px', lineHeight: '28px' };
      default: return {};
    }
  };

  const getDisabledStyles = (): React.CSSProperties => {
    if (!disabled && !loading) return {};
    return { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' };
  };

  const LoadingSpinner = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="32" opacity="0.3" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="24" />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </svg>
  );

  const buttonStyles: React.CSSProperties = {
    ...getVariantStyles(variant),
    ...getSizeStyles(size),
    ...getDisabledStyles(),
    ...style,
  };

  return (
    <button {...props} disabled={disabled || loading} style={buttonStyles}>
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
export default Button;