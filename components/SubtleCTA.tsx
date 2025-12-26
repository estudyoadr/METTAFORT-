
import React from 'react';

interface SubtleCTAProps {
  text: string;
  buttonText: string;
  onClick: () => void;
}

export const SubtleCTA: React.FC<SubtleCTAProps> = ({ text, buttonText, onClick }) => {
  return (
    <div className="mt-8 p-5 bg-teal-50/50 border border-teal-100 rounded-lg text-center animate-fade-in">
      <p className="text-teal-800 text-sm md:text-base mb-4">{text}</p>
      <button
        onClick={onClick}
        className="inline-block bg-teal-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm hover:shadow-md"
      >
        {buttonText}
      </button>
    </div>
  );
};
