import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import Nav from '../navigation/Nav';
import ContactForm from '../contact/ContactForm';
import { ArticleHeader } from './components/ArticleHeader';
import { BLOG_POSTS } from './data/posts';
import { useGsapAnimations } from '../../hooks/useGsapAnimations';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : undefined;

  useGsapAnimations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] text-[#121212] flex flex-col font-sans selection:bg-[#ff3e00] selection:text-white">
        <Nav />

        <main className="px-6 md:px-12 py-24 flex-1 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white brutal-border brutal-shadow p-8 md:p-12 text-center">
            <span className="inline-block bg-[#ff3e00] text-white font-mono text-sm font-bold uppercase px-3 py-1 mb-6">
              404 Error
            </span>
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">
              Post Not <span className="text-[#ff3e00]">Found.</span>
            </h1>
            <p className="text-lg font-medium text-gray-700 mb-8">
              The article you are looking for does not exist or may have been moved.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-[#ff3e00] text-white brutal-border py-3 px-6 font-bold uppercase text-lg brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all"
            >
              ← Back to All Posts
            </Link>
          </div>
        </main>

        <footer className="bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white">
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
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#121212] flex flex-col font-sans selection:bg-[#ff3e00] selection:text-white">
      <Nav />

      <main className="px-6 md:px-12 pb-24 flex-1">
        <ArticleHeader post={post} />
        <div className="max-w-4xl mx-auto">
          <div
            className="brutal-prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>

      <ContactForm />

      <footer className="bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white">
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

export default BlogPost;
