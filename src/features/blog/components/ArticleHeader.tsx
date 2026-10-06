import React from 'react';
import { Link } from 'react-router';
import type { BlogPost } from '../types';

export interface ArticleHeaderProps {
  title?: string;
  titleHighlight?: string;
  tags?: string[];
  author?: string;
  date?: string;
  displayDate?: string;
  readingTime?: string;
  summary?: string;
  className?: string;
  post?: BlogPost;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title: propTitle,
  titleHighlight: propTitleHighlight,
  tags: propTags,
  author: propAuthor,
  date: propDate,
  displayDate: propDisplayDate,
  readingTime: propReadingTime,
  summary: propSummary,
  className = '',
  post,
}) => {
  const title = post?.title ?? propTitle ?? '';
  const titleHighlight = post?.titleHighlight ?? propTitleHighlight ?? '';
  const tags = post?.tags ?? propTags ?? [];
  const author = post?.author ?? propAuthor ?? 'Lauri Makkonen';
  const date = post?.date ?? propDate ?? '';
  const displayDate = post?.displayDate ?? propDisplayDate ?? date;
  const readingTime = post?.readingTime ?? propReadingTime ?? '';
  const summary = post?.summary ?? propSummary ?? '';

  const renderTitle = () => {
    if (!titleHighlight) {
      return title;
    }

    const cleanHighlight = titleHighlight.endsWith('.')
      ? titleHighlight.slice(0, -1)
      : titleHighlight;

    if (title.endsWith(cleanHighlight)) {
      const prefix = title.slice(0, title.length - cleanHighlight.length);
      return (
        <>
          {prefix}
          <span className="text-[#ff3e00]">{titleHighlight}</span>
        </>
      );
    }

    if (title.includes(cleanHighlight)) {
      const index = title.indexOf(cleanHighlight);
      const before = title.slice(0, index);
      const after = title.slice(index + cleanHighlight.length);
      return (
        <>
          {before}
          <span className="text-[#ff3e00]">{titleHighlight}</span>
          {after}
        </>
      );
    }

    return (
      <>
        {title} <span className="text-[#ff3e00]">{titleHighlight}</span>
      </>
    );
  };

  return (
    <header className={`max-w-4xl mx-auto pt-16 md:pt-20 pb-12 ${className}`.trim()}>
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 relative group"
      >
        ← All posts
        <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full"></span>
      </Link>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter mb-8">
        {renderTitle()}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider mb-10">
        <span>{author}</span>
        <span aria-hidden="true">/</span>
        <time dateTime={date}>{displayDate}</time>
        <span aria-hidden="true">/</span>
        <span>{readingTime}</span>
      </div>

      <p className="text-xl md:text-2xl font-medium border-l-8 border-[#ff3e00] pl-6">
        {summary}
      </p>
    </header>
  );
};

export default ArticleHeader;
