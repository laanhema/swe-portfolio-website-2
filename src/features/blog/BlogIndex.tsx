import React from 'react';
import Nav from '../navigation/Nav';
import { PostCard } from './components/PostCard';
import { BLOG_POSTS } from './data/posts';
import { useGsapAnimations } from '../../hooks/useGsapAnimations';
import { useScrollReset } from '../../hooks/useScrollReset';
import Footer from '../../components/Footer';

export const BlogIndex: React.FC = () => {
  useGsapAnimations();
  useScrollReset();

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
              What worked, what broke, and what I learned building them.
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
                  className="animate-on-scroll"
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer className="mt-24" />
    </div>
  );
};

export default BlogIndex;
