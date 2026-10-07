import React from 'react';
import { useInRouterContext, Link } from 'react-router';
import { GithubIcon } from '../../components/Icons';
import { playPress } from '../../components/playPress';

export interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  postSlug?: string;
  color: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  techStack,
  repoUrl,
  postSlug,
  color,
}) => {
  const inRouter = useInRouterContext();

  return (
    <article 
      className="brutal-border brutal-shadow p-6 md:p-8 flex flex-col h-full animate-on-scroll group"
      style={{ backgroundColor: color }}
    >
      <div className="flex-grow">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 uppercase leading-tight tracking-tight">
          {title}
        </h3>
        
        <p className="text-lg font-medium mb-6 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {techStack.map((tech) => (
            <span 
              key={tech} 
              className="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4 mt-auto">
        <a 
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-white brutal-border py-3 px-3 flex items-center justify-center gap-2 font-bold uppercase text-center leading-tight shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation"
          onPointerDown={playPress}
        >
          <GithubIcon className="w-5 h-5 shrink-0" />
          <span>Code</span>
        </a>
        
        {postSlug && (
          inRouter ? (
            <Link 
              to={`/blog/${postSlug}`}
              className="flex-1 bg-[#121212] text-white border-4 border-[#121212] py-3 px-3 flex items-center justify-center font-bold uppercase text-center leading-tight shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation"
              onPointerDown={playPress}
            >
              <span>Read Story</span>
            </Link>
          ) : (
            <a 
              href={`/blog/${postSlug}`}
              className="flex-1 bg-[#121212] text-white border-4 border-[#121212] py-3 px-3 flex items-center justify-center font-bold uppercase text-center leading-tight shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation"
              onPointerDown={playPress}
            >
              <span>Read Story</span>
            </a>
          )
        )}
      </div>
    </article>
  );
};

export default ProjectCard;

