import React from 'react';
import { GithubIcon } from '../../components/Icons';

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  liveUrl?: string;
  liveLabel?: string;
  color: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  techStack,
  repoUrl,
  liveUrl,
  liveLabel = 'Live Demo',
  color,
}) => {
  return (
    <article 
      className={`brutal-border brutal-shadow p-6 md:p-8 flex flex-col h-full animate-on-scroll group`}
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
          className="flex-1 bg-white brutal-border py-3 px-3 flex items-center justify-center gap-2 font-bold uppercase text-center leading-tight brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all"
        >
          <GithubIcon className="w-5 h-5 shrink-0" />
          <span>Code</span>
        </a>
        
        {liveUrl && (
          <a 
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#121212] text-white border-4 border-[#121212] py-3 px-3 flex items-center justify-center font-bold uppercase text-center leading-tight brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all"
          >
            <span>{liveLabel}</span>
          </a>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
