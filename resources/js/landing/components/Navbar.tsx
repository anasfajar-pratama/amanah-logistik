import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LINKS: [string, string][] = [
  ['/', 'Home'],
  ['#about', 'Tentang Kami'],
  ['#services', 'Layanan'],
  ['/galeri', 'Galeri'],
  ['#advantages', 'Keunggulan'],
  ['#contact', 'Kontak'],
];

export default function Navbar({ companyName }: { companyName: string }) {
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    setNavOpen(false);
    const onScroll = () => {
      if (window.scrollY < 120) setActiveSection('');
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') { setActiveSection(''); return; }
    const sections = ['about', 'services', 'advantages', 'contact']
      .map(id => document.getElementById(id))
      .filter(Boolean) as Element[];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href.startsWith('/')) {
      if (href === '/') return location.pathname === '/' && !activeSection;
      return location.pathname === href;
    }
    return activeSection === href.replace('#', '');
  };

  const navClass = (href: string) => {
    const base = 'text-sm font-medium transition-colors hover:text-accent-300';
    if (isActive(href)) return `${base} text-accent-400 font-semibold`;
    return `${base} text-white/90`;
  };

  const label = (href: string) => LINKS.find(([h]) => h === href)?.[1] ?? href;

  const anchorTo = (href: string) => ({ pathname: '/', hash: href });
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-700 shadow-md">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 px-0 md:px-3 py-1.5 rounded-xl">
            <Link to="/" onClick={scrollTop} className="flex items-center gap-3">
              <img src="/logo-web.png" alt={companyName} className="h-10 w-auto" />
              <span className="font-extrabold text-[1.216rem] md:text-[1.43rem] tracking-wide text-white">
                {companyName}
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map(([href], idx) => (
              href.startsWith('/')
                ? <Link key={idx} to={href} onClick={scrollTop} className={navClass(href)}>{label(href)}</Link>
                : <Link key={idx} to={anchorTo(href)} className={navClass(href)}>{label(href)}</Link>
            ))}
            <Link to={anchorTo('#contact')}
              className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
              Minta Penawaran
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setNavOpen(!navOpen)}>
            {navOpen
              ? <X className="w-6 h-6 text-white" />
              : <Menu className="w-6 h-6 text-white" />
            }
          </button>
        </div>
      </div>
      {navOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
          {LINKS.map(([href], idx) => {
            const active = isActive(href);
            const cls = `block font-medium py-2 ${active ? 'text-accent-600 font-semibold' : 'text-slate-700 hover:text-accent-500'}`;
            return href.startsWith('/')
              ? <Link key={idx} to={href} onClick={() => { setNavOpen(false); scrollTop(); }} className={cls}>{label(href)}</Link>
              : <Link key={idx} to={anchorTo(href)} onClick={() => setNavOpen(false)} className={cls}>{label(href)}</Link>;
          })}
          <Link to={anchorTo('#contact')} onClick={() => setNavOpen(false)}
            className="block bg-accent-500 text-white text-center font-semibold py-2.5 rounded-full">
            Minta Penawaran
          </Link>
        </div>
      )}
    </nav>
  );
}
