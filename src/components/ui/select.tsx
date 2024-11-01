// src/components/ui/select.tsx
import React from 'react';

export const Select = ({ children, ...props }) => (
  <select {...props} className="rounded-md border border-gray-300 bg-gray-50 text-gray-800">
    {children}
  </select>
);

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
