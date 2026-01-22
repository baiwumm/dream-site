'use client';

import { type VariantProps } from 'class-variance-authority';

import { buttonVariants } from '@/components/animate-ui/components/buttons/button';
import {
  RippleButton as RippleButtonPrimitive,
  type RippleButtonProps as RippleButtonPrimitiveProps,
  RippleButtonRipples as RippleButtonRipplesPrimitive,
  type RippleButtonRipplesProps as RippleButtonRipplesPrimitiveProps,
} from '@/components/animate-ui/primitives/buttons/ripple';
import { cn } from '@/lib/utils';

const rippleButtonVariants = {
  default: '[--ripple-button-ripple-color:var(--primary-foreground)]',
  accent: '[--ripple-button-ripple-color:var(--accent-foreground)]',
  destructive: '[--ripple-button-ripple-color:var(--destructive-foreground)]',
  outline: '[--ripple-button-ripple-color:var(--foreground)]',
  secondary: '[--ripple-button-ripple-color:var(--secondary-foreground)]',
  ghost: '[--ripple-button-ripple-color:var(--foreground)]',
  link: '[--ripple-button-ripple-color:var(--primary-foreground)]',
};

type RippleButtonProps = RippleButtonPrimitiveProps &
  VariantProps<typeof buttonVariants>;

function RippleButton({
  className,
  variant,
  radius,
  appearance,
  mode,
  size,
  autoHeight,
  underlined,
  underline,
  asChild = false,
  placeholder = false,
  ...props
}: RippleButtonProps) {
  return (
    <RippleButtonPrimitive
      className={cn(
        buttonVariants({
          variant,
          size,
          radius,
          appearance,
          mode,
          autoHeight,
          placeholder,
          underlined,
          underline,
          className,
        }),
        asChild && props.disabled && 'pointer-events-none opacity-50',
        rippleButtonVariants[variant as keyof typeof rippleButtonVariants]
      )}
      {...props}
    />
  );
}

type RippleButtonRipplesProps = RippleButtonRipplesPrimitiveProps;

function RippleButtonRipples(props: RippleButtonRipplesProps) {
  return <RippleButtonRipplesPrimitive {...props} />;
}

export {
  RippleButton,
  type RippleButtonProps,
  RippleButtonRipples,
  type RippleButtonRipplesProps,
};
