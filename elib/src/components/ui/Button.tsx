import React, { type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode;
  className?: string;
  primary?: boolean;
  rounded?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export const Button = ({
  children,
  className = '',
  type = 'button',
  primary = false,
  rounded = false,
  onClick,
  ...props
}: Readonly<ButtonProps>): React.JSX.Element => {
  return (
    <button
      className={cn(
        'border border-black p-2 rounded text-black' + 'transition',
        {
          'bg-gray hover:bg-main': primary,
          'bg-main hover:bg-gray': !primary,
          'w-10 h-10 flex justify-center items-center': rounded,
        },
        className,
      )}
      {...props}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
