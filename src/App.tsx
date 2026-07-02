
import Nav from './features/navigation/Nav';
import ProjectCard from './features/showcase/ProjectCard';
import ContactForm from './features/contact/ContactForm';
import { useGsapAnimations } from './hooks/useGsapAnimations';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './components/Icons';

const PROJECTS = [
  {
    title: 'Nexus Data Pipeline',
    description: 'High-throughput event streaming architecture processing 10k+ events/sec with fault tolerance.',
    techStack: ['Kafka', 'Go', 'PostgreSQL', 'Redis'],
    repoUrl: 'https://github.com/example/nexus-data',
    color: '#ff3e00' // Orange accent
  },
  {
    title: 'Aura UI Framework',
    description: 'Accessible, component-driven design system built for enterprise dashboard applications.',
    techStack: ['React', 'TypeScript', 'Tailwind', 'Storybook'],
    repoUrl: 'https://github.com/example/aura-ui',
    liveUrl: 'https://aura-ui.example.com',
    color: '#00e5ff' // Cyan accent
  },
  {
    title: 'Quantum Ledger',
    description: 'Distributed ledger system utilizing cryptographic proofs for immutable transaction history.',
    techStack: ['Rust', 'WebAssembly', 'Cryptography'],
    repoUrl: 'https://github.com/example/quantum-ledger',
    color: '#facc15' // Yellow accent
  },
  {
    title: 'Echo Chat Services',
    description: 'Real-time WebSocket based chat microservice with sub-10ms latency.',
    techStack: ['Node.js', 'Socket.io', 'MongoDB', 'Docker'],
    repoUrl: 'https://github.com/example/echo-chat',
    liveUrl: 'https://echo-chat.example.com',
    color: '#a855f7' // Purple accent
  }
];

function App() {
  useGsapAnimations();

  return (
    <div className="min-h-screen">
      <Nav />
      
      {/* Hero Section */}
      <header className="pt-32 pb-24 px-6 md:px-12 flex flex-col items-start min-h-[85vh] justify-center relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#ff3e00] rounded-full blur-[120px] opacity-20 -z-10"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#00e5ff] rounded-full blur-[150px] opacity-20 -z-10"></div>
        
        <div className="max-w-5xl z-10">
          <p className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-6 animate-on-scroll">
            Software Engineer
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-10 animate-on-scroll">
            Building <br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '3px #121212' }}>Robust</span> <br/>
            Systems.
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl font-medium mb-12 border-l-8 border-[#ff3e00] pl-6 animate-on-scroll">
            I specialize in architecting scalable backend services and crafting highly interactive, performant frontend experiences.
          </p>
          
          <div className="flex flex-wrap gap-6 animate-on-scroll">
            <a 
              href="#work" 
              className="bg-[#121212] text-white px-8 py-4 text-xl font-black uppercase brutal-shadow brutal-shadow-hover"
            >
              View Work
            </a>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212]"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212]"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212]"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 bg-[#121212] text-white border-y-4 border-[#121212]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 animate-on-scroll">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-8">
              The <span className="text-[#00e5ff]">Dev</span> <br/> Behind <br/> The Code.
            </h2>
            <p className="text-xl leading-relaxed font-medium">
              With over 5 years of experience in full-stack development, I&apos;ve built everything from internal developer tools to high-traffic consumer applications. I believe in clean code, robust testing, and obsessing over the user experience.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6 animate-on-scroll w-full">
            <div className="bg-[#facc15] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center">
              <span className="text-5xl font-black mb-2">5+</span>
              <span className="text-xl font-bold uppercase">Years Exp.</span>
            </div>
            <div className="bg-[#ff3e00] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center translate-y-8">
              <span className="text-5xl font-black mb-2">30+</span>
              <span className="text-xl font-bold uppercase">Projects</span>
            </div>
            <div className="bg-[#00e5ff] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center">
              <span className="text-5xl font-black mb-2">1M+</span>
              <span className="text-xl font-bold uppercase">Users Reached</span>
            </div>
            <div className="bg-white text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center translate-y-8">
              <span className="text-5xl font-black mb-2">∞</span>
              <span className="text-xl font-bold uppercase">Coffee Cups</span>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="work" className="py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 animate-on-scroll">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
              Selected <br/> <span className="text-[#ff3e00]">Works.</span>
            </h2>
            <p className="max-w-sm text-xl font-bold pb-4">
              A curated selection of my recent open-source and commercial projects.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {PROJECTS.map((project, index) => (
              <div 
                key={project.title} 
                className={`${index % 2 === 1 ? 'md:translate-y-16' : ''}`}
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm />

      {/* Footer */}
      <footer className="bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black uppercase tracking-tighter">
            Dev<span className="text-[#ff3e00]">.</span>Portfolio
          </div>
          <p className="font-bold">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex gap-6 font-bold uppercase">
            <a href="https://github.com" className="hover:text-[#ff3e00] transition-colors">GitHub</a>
            <a href="https://twitter.com" className="hover:text-[#ff3e00] transition-colors">Twitter</a>
            <a href="https://linkedin.com" className="hover:text-[#ff3e00] transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
