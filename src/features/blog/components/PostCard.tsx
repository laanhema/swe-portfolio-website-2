import React from 'react';
import { Link } from 'react-router';
import { formatDate } from '../formatDate';
import type { BlogPost } from '../types';

export interface PostCardProps {
  post: BlogPost;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  className = '',
}) => {
  return (
    <article
      className={`brutal-border brutal-shadow brutal-shadow-hover p-6 md:p-8 flex flex-col gap-4 h-full ${className}`.trim()}
      style={{ backgroundColor: post.accentColor || '#ffffff' }}
    >
      <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">/</span>
        <span>{post.readingTime}</span>
      </div>

      <h3 className="text-3xl md:text-4xl font-bold uppercase leading-tight tracking-tight">
        <Link
          to={`/blog/${post.slug}`}
          className="hover:underline decoration-4 underline-offset-4"
        >
          {post.title}
        </Link>
      </h3>

      <p className="text-lg font-medium leading-relaxed">
        {post.summary}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};

export default PostCard;
