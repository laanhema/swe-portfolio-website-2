import React, { useState } from 'react';
import { useLocation, useInRouterContext, Link } from 'react-router';

interface NavViewProps {
  pathname: string;
  inRouter: boolean;
}

const NavView: React.FC<NavViewProps> = ({ pathname, inRouter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const isHome = pathname === '/';
  const workHref = isHome ? '#work' : '/#work';
  const aboutHref = isHome ? '#about' : '/#about';
  const blogHref = '/blog';
  const contactHref = isHome ? '#contact' : '/#contact';

  const handleLogoClick = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className='sticky top-0 z-50 w-full bg-[#f8f9fa] border-b-4 border-[#121212]'>
      <div className='py-4 px-6 md:px-12 flex justify-between items-center'>
        {inRouter ? (
          <Link
            to='/'
            onClick={handleLogoClick}
            className='text-2xl md:text-3xl font-bold uppercase tracking-tighter hover:text-[#ff3e00] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3e00]'
            aria-label='laanhema.dev - Back to top'
          >
            laanhema<span className='text-[#ff3e00]'>.</span>dev
          </Link>
        ) : (
          <a
            href='/'
            onClick={handleLogoClick}
            className='text-2xl md:text-3xl font-bold uppercase tracking-tighter hover:text-[#ff3e00] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3e00]'
            aria-label='laanhema.dev - Back to top'
          >
            laanhema<span className='text-[#ff3e00]'>.</span>dev
          </a>
        )}

        {/* Desktop Navigation */}
        <div className='hidden md:flex gap-8 text-lg font-bold'>
          {inRouter && !isHome ? (
            <Link
              to='/#work'
              className='hover:text-[#ff3e00] transition-colors relative group'
            >
              Work
              <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
            </Link>
          ) : (
            <a
              href={workHref}
              className='hover:text-[#ff3e00] transition-colors relative group'
            >
              Work
              <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
            </a>
          )}
          {inRouter && !isHome ? (
            <Link
              to='/#about'
              className='hover:text-[#ff3e00] transition-colors relative group'
            >
              About
              <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
            </Link>
          ) : (
            <a
              href={aboutHref}
              className='hover:text-[#ff3e00] transition-colors relative group'
            >
              About
              <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
            </a>
          )}
          {inRouter ? (
            <Link
              to={blogHref}
              className='hover:text-[#ff3e00] transition-colors relative group'
            >
              Blog
              <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
            </Link>
          ) : (
            <a
              href={blogHref}
              className='hover:text-[#ff3e00] transition-colors relative group'
            >
              Blog
              <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
            </a>
          )}
          {inRouter && !isHome ? (
            <Link
              to='/#contact'
              className='hover:text-[#ff3e00] transition-colors relative group'
            >
              Contact
              <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
            </Link>
          ) : (
            <a
              href={contactHref}
              className='hover:text-[#ff3e00] transition-colors relative group'
            >
              Contact
              <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
            </a>
          )}
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
          {inRouter && !isHome ? (
            <Link
              to='/#work'
              onClick={closeMenu}
              className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
            >
              Work
            </Link>
          ) : (
            <a
              href={workHref}
              onClick={closeMenu}
              className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
            >
              Work
            </a>
          )}
          {inRouter && !isHome ? (
            <Link
              to='/#about'
              onClick={closeMenu}
              className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
            >
              About
            </Link>
          ) : (
            <a
              href={aboutHref}
              onClick={closeMenu}
              className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
            >
              About
            </a>
          )}
          {inRouter ? (
            <Link
              to={blogHref}
              onClick={closeMenu}
              className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
            >
              Blog
            </Link>
          ) : (
            <a
              href={blogHref}
              onClick={closeMenu}
              className='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'
            >
              Blog
            </a>
          )}
          {inRouter && !isHome ? (
            <Link
              to='/#contact'
              onClick={closeMenu}
              className='py-2 hover:text-[#ff3e00] transition-colors'
            >
              Contact
            </Link>
          ) : (
            <a
              href={contactHref}
              onClick={closeMenu}
              className='py-2 hover:text-[#ff3e00] transition-colors'
            >
              Contact
            </a>
          )}
        </div>
      )}
    </nav>
  );
};

const NavWithRouter: React.FC = () => {
  const location = useLocation();
  return <NavView pathname={location.pathname} inRouter={true} />;
};

const NavWithoutRouter: React.FC = () => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  return <NavView pathname={pathname} inRouter={false} />;
};

export const Nav: React.FC = () => {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return <NavWithRouter />;
  }
  return <NavWithoutRouter />;
};

export default Nav;
