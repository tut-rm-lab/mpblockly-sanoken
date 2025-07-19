import type { PropsWithChildren } from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function Button({
  onClick,
  disabled,
  children,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
