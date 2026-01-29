import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: '5rem', padding: '4rem 0', background: 'var(--bg-deep)' }}>
      <div className="container">
        <div className="grid-2" style={{ gap: '4rem' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="EventPlan Logo" 
                style={{ height: '100px', width: 'auto', borderRadius: '8px' }} 
              />
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '400px' }}>
              Premium trading card and collectibles events across the Midwest. 
              Join thousands of collectors for unforgettable experiences.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {[
                { Icon: Instagram, href: 'https://www.instagram.com/bstcardshows' },
                { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61572845743764' }
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>

            <div>
              <h4 style={{ marginBottom: '1rem' }}>Contact</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} /> bstcollect@gmail.com
                </li>
                <li>Carpentersville, IL 60110</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '3rem', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          © 2026 BST Card Shows. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
