"use client";

import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import BookingModal from './BookingModal';

export default function EventCard({ event }: { event: any }) {
  const [showModal, setShowModal] = useState(false);

  const handleBookingSubmit = async (data: any) => {
    // Booking successful - Don't close immediately so user sees success message
    console.log("Booking confirmed for:", data);
    // setShowModal(false); // Let the modal's internal close button handle this
  };

  return (
    <>
      <div 
        className="card glass-card hover-glow animate-fade-in" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          padding: 0, 
          border: '1px solid rgba(212, 175, 55, 0.15)',
          background: 'linear-gradient(180deg, rgba(20,20,20,0.7) 0%, rgba(10,10,10,0.9) 100%)',
          textAlign: 'center'
        }}
      >
        
        {/* Image Section */}
        <div className="image-zoom-container" style={{ 
            position: 'relative', 
            width: '100%', 
            height: '240px', 
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
           {event.featured && (
            <div style={{ 
              position: 'absolute', 
              top: '1rem', 
              right: '1rem', 
              background: 'rgba(5,5,5,0.8)', 
              color: 'var(--accent)',
              border: '1px solid var(--primary)',
              padding: '0.25rem 0.75rem', 
              borderRadius: '99px', 
              fontSize: '0.7rem', 
              fontWeight: 700,
              zIndex: 10,
              backdropFilter: 'blur(4px)',
              letterSpacing: '0.05em',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
            }}>
              FEATURED
            </div>
          )}
          {event.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
          ) : (
             <div style={{ width: '100%', height: '100%', background: 'var(--surface-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No Image
             </div>
          )}
          {/* Overlay Gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to top, rgba(5,5,5,1), transparent)' }} />
        </div>

        {/* Content Section */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ marginBottom: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ 
                    color: 'var(--primary)', 
                    fontWeight: 700, 
                    fontSize: '0.7rem', 
                    letterSpacing: '0.15em', 
                    textTransform: 'uppercase',
                    background: 'rgba(212, 175, 55, 0.08)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '50px',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                    Upcoming Event
                </div>
            </div>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>{event.title}</h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '90%' }}>
                {event.description}
            </p>
          </div>

          {/* Details Grid */}
          <div style={{ 
            width: '100%',
            display: 'grid', 
            gap: '1rem', 
            marginBottom: '1.5rem',
            padding: '1.25rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'left' // Keep details left aligned for readability
          }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{ color: 'var(--primary)', background: 'rgba(212, 175, 55, 0.1)', padding: '8px', borderRadius: '50%', boxShadow: '0 0 10px rgba(212, 175, 55, 0.05)' }}>
                  <Calendar size={16} />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{event.date}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
               <div style={{ color: 'var(--primary)', background: 'rgba(212, 175, 55, 0.1)', padding: '8px', borderRadius: '50%', boxShadow: '0 0 10px rgba(212, 175, 55, 0.05)' }}>
                  <Clock size={16} />
              </div>
              <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 400, marginRight: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event:</span>
                        {event.time}
                      </div>
                      {event.vendorTime && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.8, marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vendor:</span>
                             {event.vendorTime}
                          </div>
                      )}
                  </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--primary)', background: 'rgba(212, 175, 55, 0.1)', padding: '8px', borderRadius: '50%', marginTop: '2px', boxShadow: '0 0 10px rgba(212, 175, 55, 0.05)' }}>
                  <MapPin size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{event.locationName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.locationCity}</div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Entry</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)', textShadow: '0 0 10px rgba(245, 230, 202, 0.2)' }}>{event.entryFee}</div>
            </div>
            <button 
                onClick={() => setShowModal(true)} 
                className="btn btn-primary"
                style={{ 
                    padding: '0.75rem 1.5rem', 
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
                    borderRadius: '50px'
                }}
            >
              Reserve <ArrowRight size={16} style={{ marginLeft: '4px' }} />
            </button>
          </div>

        </div>
      </div>

      <BookingModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        event={event}
        onSubmit={handleBookingSubmit}
      />
    </>
  );
}
