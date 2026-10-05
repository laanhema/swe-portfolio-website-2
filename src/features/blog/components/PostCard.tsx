import React from 'react';
import { Link } from 'react-router';
import type { BlogPost } from '../types';

export interface PostCardProps {
  slug?: string;
  title?: string;
  date?: string;
  displayDate?: string;
  readingTime?: string;
  excerpt?: string;
  tags?: string[];
  backgroundColor?: string;
  color?: string;
  featured?: boolean;
  className?: string;
  post?: BlogPost;
}

export const PostCard: React.FC<PostCardProps> = ({
  slug: propSlug,
  title: propTitle,
  date: propDate,
  displayDate: propDisplayDate,
  readingTime: propReadingTime,
  excerpt: propExcerpt,
  tags: propTags,
  backgroundColor,
  color,
  featured = false,
  className = '',
  post,
}) => {
  const slug = post?.slug ?? propSlug ?? '';
  const title = post?.title ?? propTitle ?? '';
  const date = post?.date ?? propDate ?? '';
  const displayDate = post?.displayDate ?? propDisplayDate ?? date;
  const readingTime = post?.readingTime ?? propReadingTime ?? '';
  const excerpt = post?.excerpt ?? propExcerpt ?? '';
  const tags = post?.tags ?? propTags ?? [];

  const bgColor =
    backgroundColor ??
    color ??
    post?.accentColor ??
    (featured ? '#00e5ff' : '#ffffff');

  return (
    <article
      className={`brutal-border brutal-shadow brutal-shadow-hover p-6 md:p-8 flex flex-col gap-4 h-full ${className}`.trim()}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider">
        <time dateTime={date}>{displayDate}</time>
        <span aria-hidden="true">/</span>
        <span>{readingTime}</span>
      </div>

      <h3 className="text-3xl md:text-4xl font-bold uppercase leading-tight tracking-tight">
        <Link
          to={`/blog/${slug}`}
          className="hover:underline decoration-4 underline-offset-4"
        >
          {title}
        </Link>
      </h3>

      <p className="text-lg font-medium leading-relaxed">
        {excerpt}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {tags.map((tag) => (
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
