import React, { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode;
  className?: string;
}

export const Button = ({
  children,
  className = '',
  ...props
}: ButtonProps): React.JSX.Element => {
  return (
    <button className={cn(className)} {...props}>
      {children}
    </button>
  );
};
