
import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 5a3.5 3.5 0 0 0-3.5 3.5c0 1.3.5 2.5 1.4 3.2.9.7 2.1 1 3.1.9 1.1.1 2.2-.4 3.1-.9.9-1.9 1.4-3.1 1.4-1.3 0-2.5-.5-3.4-1.4" />
    <path d="M12 5a3.5 3.5 0 0 1 3.5 3.5c0 1.3-.5 2.5-1.4 3.2-.9.7-2.1 1-3.1.9-1.1.1-2.2-.4-3.1-.9-.9-1.9-1.4-3.1-1.4-1.3 0-2.5.5-3.4-1.4" />
    <path d="M12 21a8.5 8.5 0 0 0 8.5-8.5c0-2.9-1.4-5.5-3.6-7.1" />
    <path d="M12 21a8.5 8.5 0 0 1-8.5-8.5c0-2.9 1.4-5.5 3.6-7.1" />
    <path d="M12 21v-3" />
    <path d="M12 5V2" />
    <path d="M4.5 12.5H2" />
    <path d="M19.5 12.5H22" />
  </svg>
);
