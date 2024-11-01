// src/components/ui/button.tsx
import React from 'react';

export const Button = ({ children, onClick, ...props }) => (
  <button onClick={onClick} className="button" {...props}>
    {children}
  </button>
);
