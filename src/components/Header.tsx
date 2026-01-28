"use client";

import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 50, 
      backdropFilter: 'blur(12px)', 
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      height: 'var(--header-height)'
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 800 }}>
          <Sparkles className="text-secondary" />
          <span className='text-black'>Event<span className="text-gradient">Plan</span></span>
        </Link>
        
        {/* Simple Nav - Landing Page Only */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="#events" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}>
            Events
          </Link>
          <a href="#events" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            Reserve Table
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <style jsx>{`
        .desktop-nav { display: none !important; }
        .mobile-toggle { display: block; }
        
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none; }
        }
      `}</style>
    </header>
  );
}
