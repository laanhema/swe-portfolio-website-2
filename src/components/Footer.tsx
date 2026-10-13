import React from 'react';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer
      className={`bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white${className ? ` ${className}` : ''}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-2xl font-bold uppercase tracking-tighter">
          Dev<span className="text-[#ff3e00]">.</span>Portfolio
        </div>
        <p className="font-bold">
          © {new Date().getFullYear()} All rights reserved.
        </p>
        <div className="flex gap-6 font-bold uppercase">
          <a
            href="https://github.com/laanhema"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff3e00] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/laanhema"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff3e00] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
