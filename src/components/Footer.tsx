import { Twitter, Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: '5rem', padding: '4rem 0', background: 'var(--bg-deep)' }}>
      <div className="container">
        <div className="grid-2" style={{ gap: '4rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Event<span className="text-gradient">Plan</span></h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '400px' }}>
              Premium trading card and collectibles events across the Midwest. 
              Join thousands of collectors for unforgettable experiences.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {[Twitter, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>
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
                  <Mail size={16} /> support@eventplan.com
                </li>
                <li>Carpentersville, IL 60110</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '3rem', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          © 2026 EventPlan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
