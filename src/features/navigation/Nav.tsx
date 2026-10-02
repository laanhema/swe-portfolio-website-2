import React, { useState } from 'react';

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className='sticky top-0 z-50 w-full bg-[#f8f9fa] border-b-4 border-[#121212]'>
      <div className='py-4 px-6 md:px-12 flex justify-between items-center'>
        <div className='text-2xl md:text-3xl font-bold uppercase tracking-tighter'>
          laanhema<span className='text-[#ff3e00]'>.</span>dev
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex gap-8 text-lg font-bold'>
          <a
            href='#work'
            className='hover:text-[#ff3e00] transition-colors relative group'
          >
            Work
            <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
          </a>
          <a
            href='#about'
            className='hover:text-[#ff3e00] transition-colors relative group'
          >
            About
            <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
          </a>
          <a
            href='#contact'
            className='hover:text-[#ff3e00] transition-colors relative group'
          >
            Contact
            <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className='md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer'
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls='mobile-menu'
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div
          id='mobile-menu'
          className='md:hidden border-t-4 border-[#121212] bg-[#f8f9fa] px-6 py-6 flex flex-col gap-4 text-xl font-bold uppercase tracking-wide'
        >
          <a
            href='#work'
            onClick={closeMenu}
            className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
          >
            Work
          </a>
          <a
            href='#about'
            onClick={closeMenu}
            className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
          >
            About
          </a>
          <a
            href='#contact'
            onClick={closeMenu}
            className='py-2 hover:text-[#ff3e00] transition-colors'
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Nav;
