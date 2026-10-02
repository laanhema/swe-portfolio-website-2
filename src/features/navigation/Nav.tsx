import React from 'react';

const Nav: React.FC = () => {
  return (
    <nav className='sticky top-0 z-50 w-full bg-[#f8f9fa] border-b-4 border-[#121212] py-4 px-6 md:px-12 flex justify-between items-center'>
      <div className='text-2xl md:text-3xl font-bold uppercase tracking-tighter'>
        laanhema<span className='text-[#ff3e00]'>.</span>dev
      </div>

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

      <button
        className='md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all'
        aria-label='Menu'
      >
        Menu
      </button>
    </nav>
  );
};

export default Nav;
