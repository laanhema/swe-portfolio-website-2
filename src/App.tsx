import Nav from './features/navigation/Nav';
import ProjectCard from './features/showcase/ProjectCard';
import ContactForm from './features/contact/ContactForm';
import { useGsapAnimations } from './hooks/useGsapAnimations';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './components/Icons';
import portrait from './assets/lauri-makkonen-portrait.jpg';

const PROJECTS = [
  {
    title: 'GymBro App',
    description:
      'Gamified gym-tracker app for Android with workout sessions, XP progression, and unlockable achievements.',
    techStack: [
      'Angular + Ionic Frontend',
      'Express REST API Backend',
      'MongoDB',
    ],
    repoUrl: 'https://github.com/jamktiko/gymbroapp',
    liveUrl:
      'https://staticwebsiteforgymbroapp.s3.eu-north-1.amazonaws.com/index.html',
    liveLabel: 'Download APK',
    color: '#ff3e00', // Orange accent
  },
  {
    title: 'Tralla',
    description:
      'Trello-like Kanban board application made in Angular.',
    techStack: ['Angular', 'Taiga UI', 'NgRx SignalStore'],
    repoUrl: 'https://github.com/laanhema/tralla',
    color: '#00e5ff', // Cyan accent
  },
  {
    title: 'Froots Smoothie App',
    description:
      'Smoothie recipe app for browsing recipes with nutritional info and creating your own blends.',
    techStack: ['Svelte', 'TypeScript', 'Tailwind'],
    repoUrl: 'https://github.com/jamktiko/smoothie_testi',
    liveUrl: 'https://froots-smoothies.netlify.app/',
    color: '#facc15', // Yellow accent
  },
  {
    title: 'Distill Design Scraper',
    description:
      'Web development tool that scrapes color schemes, fonts, layout, and components from any website.',
    techStack: ['Next.js', 'React', 'Playwright', 'Sharp', 'Culori', 'Zod'],
    repoUrl: 'https://github.com/laanhema/distill-design-scraper',
    color: '#a855f7', // Purple accent
  },
];

function App() {
  useGsapAnimations();

  return (
    <div className='min-h-screen'>
      <Nav />

      {/* Hero Section */}
      <header className='pt-32 pb-24 px-6 md:px-12 flex flex-col items-start min-h-[85vh] justify-center relative overflow-hidden'>
        <div className='absolute top-1/4 right-0 w-64 h-64 bg-[#ff3e00] rounded-full blur-[120px] opacity-20 -z-10'></div>
        <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#00e5ff] rounded-full blur-[150px] opacity-20 -z-10'></div>

        <div className='w-full flex flex-col xl:flex-row xl:items-center gap-16 z-10'>
          <div className='max-w-5xl xl:flex-1 min-w-0'>
            <p className='text-xl md:text-2xl font-bold uppercase tracking-widest mb-6 animate-on-scroll'>
              Software Engineer
            </p>
            <h1 className='text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-tighter mb-10 animate-on-scroll'>
              Building <br />
              <span className='text-transparent text-stroke-robust'>
                Robust
              </span>{' '}
              <br />
              Systems.
            </h1>
            <p className='text-xl md:text-2xl max-w-2xl font-medium mb-12 border-l-8 border-[#ff3e00] pl-6 animate-on-scroll'>
              Full-stack software engineer dedicated to building dependable
              systems and high-craft digital experiences. Since 2019, I&apos;ve
              paired technical rigor with clear communication to take software
              from concept to production with maintainable architecture,
              performance, and attention to detail.
            </p>

            <div className='flex flex-wrap gap-6 animate-on-scroll'>
              <a
                href='#work'
                className='bg-[#121212] text-white px-8 py-4 text-xl font-bold uppercase brutal-shadow brutal-shadow-hover'
              >
                View Work
              </a>
              <div className='flex gap-4'>
                <a
                  href='https://github.com/laanhema'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212]'
                  aria-label='GitHub'
                >
                  <GithubIcon />
                </a>
                <a
                  href='https://twitter.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212]'
                  aria-label='Twitter'
                >
                  <TwitterIcon />
                </a>
                <a
                  href='https://www.linkedin.com/in/laanhema'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212]'
                  aria-label='LinkedIn'
                >
                  <LinkedinIcon />
                </a>
              </div>
            </div>
          </div>

          <div className='w-full max-w-md xl:max-w-none xl:w-[34%] shrink-0 animate-on-scroll'>
            <img
              src={portrait}
              alt='Lauri Makkonen'
              width={853}
              height={1280}
              className='w-full h-auto aspect-[2/3] object-cover brutal-border brutal-shadow bg-[#121212]'
            />
          </div>
        </div>
      </header>

      {/* About Section */}
      <section
        id='about'
        className='py-24 px-6 md:px-12 bg-[#121212] text-white border-y-4 border-[#121212]'
      >
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center'>
          <div className='flex-1 animate-on-scroll'>
            <h2 className='text-5xl md:text-7xl font-bold uppercase mb-8'>
              The <span className='text-[#00e5ff]'>Dev</span> <br /> Behind{' '}
              <br /> The Code.
            </h2>
            <p className='text-xl leading-relaxed font-medium'>
              I&apos;ve been coding since 2019, specializing in full-stack web
              development and project leadership. I combine technical skill
              with professional soft skills to take projects from idea to
              delivery.
            </p>
          </div>
          <div className='flex-1 grid grid-cols-2 gap-6 animate-on-scroll w-full'>
            <div className='bg-[#facc15] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center'>
              <span className='text-5xl font-bold mb-2'>2019</span>
              <span className='text-xl font-bold uppercase'>Coding Since</span>
            </div>
            <div className='bg-[#ff3e00] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center translate-y-8'>
              <span className='text-5xl font-bold mb-2'>25</span>
              <span className='text-xl font-bold uppercase'>Public Repos</span>
            </div>
            <div className='col-span-2 mt-8 bg-[#00e5ff] text-[#121212] brutal-border p-6 flex flex-col justify-center'>
              <span className='text-5xl font-bold mb-2'>2000+</span>
              <span className='text-xl font-bold uppercase'>
                GitHub Contributions This Year
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id='work' className='py-32 px-6 md:px-12'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-end mb-16 animate-on-scroll'>
            <h2 className='text-6xl md:text-8xl font-bold uppercase tracking-tighter'>
              Selected <br /> <span className='text-[#ff3e00]'>Works.</span>
            </h2>
            <p className='max-w-sm text-xl font-bold pb-4'>
              A curated selection of my recent open-source and commercial
              projects.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-10'>
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
      <footer className='bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6'>
          <div className='text-2xl font-bold uppercase tracking-tighter'>
            Dev<span className='text-[#ff3e00]'>.</span>Portfolio
          </div>
          <p className='font-bold'>
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <div className='flex gap-6 font-bold uppercase'>
            <a
              href='https://github.com/laanhema'
              className='hover:text-[#ff3e00] transition-colors'
            >
              GitHub
            </a>
            <a
              href='https://twitter.com'
              className='hover:text-[#ff3e00] transition-colors'
            >
              Twitter
            </a>
            <a
              href='https://www.linkedin.com/in/laanhema'
              className='hover:text-[#ff3e00] transition-colors'
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
