// src/components/ui/input.tsx
import React from 'react';

export const Input = ({ type = 'text', placeholder, ...props }) => (
  <input type={type} placeholder={placeholder} className="input" {...props} />
);
