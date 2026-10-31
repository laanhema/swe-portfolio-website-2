import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, Link } from 'react-router';
import { NAV_LINKS, scrollToSection } from './navHelpers';

// Mobile browsers skip :active on taps that follow a scroll (#71), so the menu button's press
// style is driven from pointer events and held long enough to be seen on a quick tap.
const MIN_PRESS_MS = 150;

export const Nav: React.FC = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const pressedAt = useRef(0);
  const releaseTimer = useRef<number | undefined>(undefined);

  const pressMenuButton = () => {
    clearTimeout(releaseTimer.current);
    pressedAt.current = performance.now();
    setIsPressed(true);
  };
  const releaseMenuButton = () => {
    clearTimeout(releaseTimer.current);
    const remaining = MIN_PRESS_MS - (performance.now() - pressedAt.current);
    releaseTimer.current = window.setTimeout(() => {
      setIsPressed(false);
    }, Math.max(0, remaining));
  };

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType) {
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
      scrollToSection(targetId);
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
          {NAV_LINKS.map((link) => {
            const sectionId = link.sectionId;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={
                  sectionId
                    ? (e) => {
                        handleSectionClick(e, sectionId);
                      }
                    : undefined
                }
                className='hover:text-[#ff3e00] transition-colors relative group'
              >
                {link.label}
                <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          onPointerDown={pressMenuButton}
          onPointerUp={releaseMenuButton}
          onPointerCancel={releaseMenuButton}
          onPointerLeave={releaseMenuButton}
          data-pressed={isPressed || undefined}
          className='md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none data-pressed:translate-x-1 data-pressed:translate-y-1 data-pressed:shadow-none transition-all duration-75 touch-manipulation cursor-pointer'
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls='mobile-menu'
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        id='mobile-menu'
        hidden={!isOpen}
        className='md:hidden border-t-4 border-[#121212] bg-[#f8f9fa] px-6 py-6 flex flex-col gap-4 text-xl font-bold uppercase tracking-wide'
      >
        {NAV_LINKS.map((link, index) => {
          const sectionId = link.sectionId;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={
                sectionId
                  ? (e) => {
                      handleSectionClick(e, sectionId);
                    }
                  : closeMenu
              }
              className={`py-2${index < NAV_LINKS.length - 1 ? ' border-b-2 border-[#121212]' : ''} hover:text-[#ff3e00] transition-colors`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Nav;
