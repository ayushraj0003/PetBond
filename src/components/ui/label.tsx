// src/components/ui/label.tsx
import React from 'react';

export const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="label">
    {children}
  </label>
);
