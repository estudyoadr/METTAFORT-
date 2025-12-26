
import React from 'react';

export const DumbbellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.4 14.4 9.6 9.6" />
    <path d="M18 11h.01" />
    <path d="M6 13h.01" />
    <path d="M2 8.82a15 15 0 0 1 4.18-4.18" />
    <path d="M22 8.82a15 15 0 0 0-4.18-4.18" />
    <path d="M15.18 22a15 15 0 0 1-4.18-4.18" />
    <path d="M8.82 2a15 15 0 0 0-4.18 4.18" />
    <path d="m12 12 4.2 4.2c.5.5 1.2.8 2.1.8s1.6-.3 2.1-.8c.9-1 .9-2.6 0-3.5l-4.2-4.2c-.9-1-2.6-.9-3.5 0" />
    <path d="m12 12-4.2-4.2c-.5-.5-1.2-.8-2.1-.8s-1.6.3-2.1.8c-1 .9-1 2.6 0 3.5l4.2 4.2c.9.9 2.6.9 3.5 0" />
  </svg>
);
