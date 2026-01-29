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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.jpeg" 
            alt="EventPlan Logo" 
            style={{ height: '50px', width: 'auto', borderRadius: '8px' }} 
          />
        </Link>
        
        {/* Simple Nav - Landing Page Only */}
        <nav className="desktop-nav">
          <Link href="#events" style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}>
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
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
