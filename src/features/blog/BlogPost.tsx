import React from 'react';
import { useParams, Link } from 'react-router';
import Nav from '../navigation/Nav';
import ContactForm from '../contact/ContactForm';
import { ArticleHeader } from './components/ArticleHeader';
import { BLOG_POSTS } from './data/posts';
import { useGsapAnimations } from '../../hooks/useGsapAnimations';
import { useScrollReset } from '../../hooks/useScrollReset';
import Footer from '../../components/Footer';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : undefined;

  useGsapAnimations();
  useScrollReset();

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans selection:bg-accent selection:text-white">
        <Nav />

        <main className="px-6 md:px-12 py-24 flex-1 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white brutal-border brutal-shadow p-8 md:p-12 text-center">
            <span className="inline-block bg-accent text-white font-mono text-sm font-bold uppercase px-3 py-1 mb-6">
              404 Error
            </span>
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">
              Post Not <span className="text-accent">Found.</span>
            </h1>
            <p className="text-lg font-medium text-gray-700 mb-8">
              The article you are looking for does not exist or may have been moved.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-accent text-white brutal-border py-3 px-6 font-bold uppercase text-lg brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all"
            >
              ← Back to All Posts
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans selection:bg-accent selection:text-white">
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

      <Footer />
    </div>
  );
};

export default BlogPost;
