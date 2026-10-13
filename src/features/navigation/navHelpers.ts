export interface NavLinkItem {
  readonly label: string;
  readonly to: string;
  readonly sectionId?: string;
}

export const NAV_LINKS: readonly NavLinkItem[] = [
  { label: 'Work', to: '/#work', sectionId: 'work' },
  { label: 'About', to: '/#about', sectionId: 'about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/#contact', sectionId: 'contact' },
];

export const scrollToSection = (targetId: string): void => {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    if (window.location.hash !== `#${targetId}`) {
      history.pushState(null, '', `#${targetId}`);
    }
  }
};
