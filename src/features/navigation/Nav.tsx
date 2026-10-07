import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, Link } from 'react-router';

export const Nav: React.FC = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e && (e.nativeEvent as PointerEvent).pointerType) {
      e.currentTarget.blur();
    }
    setIsOpen((prev) => !prev);
  };
  const closeMenu = () => {
    if (isOpen) {
      flushSync(() => {
        setIsOpen(false);
      });
    }
  };

  const isHome = pathname === '/';

  const handleLogoClick = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    closeMenu();
    if (isHome) {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        if (window.location.hash !== `#${targetId}`) {
          history.pushState(null, '', `#${targetId}`);
        }
      }
    }
  };

  return (
    <nav className='sticky top-0 z-50 w-full bg-[#f8f9fa] border-b-4 border-[#121212]'>
      <div className='py-4 px-6 md:px-12 flex justify-between items-center'>
        <Link
          to='/'
          onClick={handleLogoClick}
          className='text-2xl md:text-3xl font-bold uppercase tracking-tighter hover:text-[#ff3e00] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3e00]'
          aria-label='laanhema.dev - Back to top'
        >
          laanhema<span className='text-[#ff3e00]'>.</span>dev
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex gap-8 text-lg font-bold'>
          <Link
            to='/#work'
            onClick={(e) => handleSectionClick(e, 'work')}
            className='hover:text-[#ff3e00] transition-colors relative group'
          >
            Work
            <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
          </Link>
          <Link
            to='/#about'
            onClick={(e) => handleSectionClick(e, 'about')}
            className='hover:text-[#ff3e00] transition-colors relative group'
          >
            About
            <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
          </Link>
          <Link
            to='/blog'
            className='hover:text-[#ff3e00] transition-colors relative group'
          >
            Blog
            <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
          </Link>
          <Link
            to='/#contact'
            onClick={(e) => handleSectionClick(e, 'contact')}
            className='hover:text-[#ff3e00] transition-colors relative group'
          >
            Contact
            <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className='md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75 touch-manipulation cursor-pointer'
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
          <Link
            to='/#work'
            onClick={(e) => handleSectionClick(e, 'work')}
            className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
          >
            Work
          </Link>
          <Link
            to='/#about'
            onClick={(e) => handleSectionClick(e, 'about')}
            className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
          >
            About
          </Link>
          <Link
            to='/blog'
            onClick={closeMenu}
            className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
          >
            Blog
          </Link>
          <Link
            to='/#contact'
            onClick={(e) => handleSectionClick(e, 'contact')}
            className='py-2 hover:text-[#ff3e00] transition-colors'
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
