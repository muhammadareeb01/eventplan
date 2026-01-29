"use client";

import { useEffect, useState, useRef } from 'react';

const stats = [
  { value: "50+", label: "ANNUAL EVENTS" },
  { value: "500K+", label: "ACTIVE ATTENDEES" },
  { value: "$100M+", label: "MARKETPLACE VOLUME" },
  { value: "50", label: "STATES COVERED" }
];

export default function StatsBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={bannerRef}
      style={{
        width: '100%',
        background: 'var(--primary)',
        color: '#050505', // Deep black for contrast against gold
        padding: '1.5rem 0',
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 0 40px rgba(212, 175, 55, 0.15)',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden' // Ensure shine effect stays inside
      }}
    >
        {/* Shine Effect */}
        <div className="shine-effect" style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '50%',
            height: '100%',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'skewX(-20deg)',
            animation: 'shine 3s infinite linear' 
        }} />

      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              style={{
                flex: 1,
                minWidth: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Divider line for all except last */}
              {index !== stats.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '10%',
                  height: '80%',
                  width: '1px',
                  background: 'rgba(0,0,0,0.15)',
                  display: 'none', 
                }} className="desktop-divider" />
              )}
              
              <div 
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {stat.value}
              </div>
              <div 
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  opacity: 0.8
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
