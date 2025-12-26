import React from 'react';

interface SubtleCTAProps {
  text: string;
  buttonText: string;
  onClick?: () => void;
  externalLink?: string;
}

export const SubtleCTA: React.FC<SubtleCTAProps> = ({ text, buttonText, onClick, externalLink }) => {
  const buttonClasses = "inline-block bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-teal-700 transition-all shadow-sm hover:shadow-md active:scale-95";

  return (
    <div className="mt-8 p-6 bg-teal-50/50 border border-teal-100 rounded-2xl text-center animate-fade-in">
      <p className="text-teal-900 text-sm md:text-base mb-4 font-medium">{text}</p>
      {externalLink ? (
        <a
          href={externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses}
        >
          {buttonText}
        </a>
      ) : (
        <button
          onClick={onClick}
          className={buttonClasses}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};