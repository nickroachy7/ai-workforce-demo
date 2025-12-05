# Button Component

A flexible and accessible button component with multiple variants and sizes.

## Features

- 🎨 **Multiple Variants**: Primary, Secondary, Outline, Ghost, Destructive
- 📏 **Three Sizes**: Small, Medium, Large
- ♿ **Accessible**: Proper ARIA attributes and keyboard navigation
- 🔄 **Loading State**: Built-in loading spinner
- 🎯 **TypeScript**: Fully typed with IntelliSense support
- 🎨 **Tailwind CSS**: Styled with utility classes

## Usage

```tsx
import { Button } from './components/Button';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="secondary" size="large">
  Secondary Button
</Button>

// Loading state
<Button loading>
  Please wait...
</Button>

// Disabled state
<Button disabled>
  Can't click this
</Button>

// Custom onClick handler
<Button onClick={() => console.log('Clicked!')}>
  Click me
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Button content |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'primary'` | Visual variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `loading` | `boolean` | `false` | Whether button is in loading state |
| `className` | `string` | - | Additional CSS classes |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |

All standard HTML button attributes are also supported.

## Variants

- **Primary**: Main call-to-action buttons
- **Secondary**: Secondary actions with less emphasis
- **Outline**: Outlined buttons for subtle actions
- **Ghost**: Minimal buttons with no background
- **Destructive**: For dangerous actions like delete

## Accessibility

The Button component includes:
- Proper focus management with visible focus indicators
- ARIA attributes for screen readers
- Loading state indication with `aria-busy`
- Disabled state handling

## Dependencies

- `clsx` and `tailwind-merge` for class name handling
- Tailwind CSS for styling