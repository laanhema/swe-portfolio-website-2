import React, { useEffect } from 'react';
import Nav from '../navigation/Nav';
import { PostCard } from './components/PostCard';
import { BLOG_POSTS } from './data/posts';
import { useGsapAnimations } from '../../hooks/useGsapAnimations';

export const BlogIndex: React.FC = () => {
  useGsapAnimations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#121212] flex flex-col font-sans selection:bg-[#ff3e00] selection:text-white">
      <Nav />

      <main className="py-24 px-6 md:px-12 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 mb-16 animate-on-scroll">
            <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter">
              Field <br /> <span className="text-[#ff3e00]">Notes.</span>
            </h1>
            <p className="max-w-sm text-xl font-bold pb-4">
              Write-ups from the projects: what worked, what broke, what I&apos;d do again.
            </p>
          </div>

          {/* Staggered Post Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            {BLOG_POSTS.map((post, index) => (
              <div
                key={post.slug}
                className={index % 2 === 1 ? 'md:translate-y-16' : ''}
              >
                <PostCard
                  post={post}
                  featured={index === 0}
                  backgroundColor={index === 0 ? '#00e5ff' : '#ffffff'}
                  className="animate-on-scroll"
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white mt-24">
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
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff3e00] transition-colors"
            >
              Twitter
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
    </div>
  );
};

export default BlogIndex;
