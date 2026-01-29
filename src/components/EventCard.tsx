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
      <div className="card glass-card hover-glow" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          padding: 0, /* Remove default padding to let image bleed */
          border: '1px solid rgba(255,255,255,0.08)' 
        }}>
        
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
              letterSpacing: '0.05em'
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
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, rgba(5,5,5,0.9), transparent)' }} />
        </div>

        {/* Content Section */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ marginBottom: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ 
                    color: 'var(--primary)', 
                    fontWeight: 700, 
                    fontSize: '0.75rem', 
                    letterSpacing: '0.1em', 
                    textTransform: 'uppercase',
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px'
                }}>
                    Upcoming Event
                </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.02em' }}>{event.title}</h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {event.description}
            </p>
          </div>

          {/* Details Grid */}
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ color: 'var(--primary)', background: 'rgba(212, 175, 55, 0.1)', padding: '6px', borderRadius: '50%' }}>
                  <Calendar size={16} />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{event.date}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
               <div style={{ color: 'var(--primary)', background: 'rgba(212, 175, 55, 0.1)', padding: '6px', borderRadius: '50%' }}>
                  <Clock size={16} />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{event.time}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--primary)', background: 'rgba(212, 175, 55, 0.1)', padding: '6px', borderRadius: '50%', marginTop: '2px' }}>
                  <MapPin size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{event.locationName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.locationCity}</div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entry</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>{event.entryFee}</div>
            </div>
            <button 
                onClick={() => setShowModal(true)} 
                className="btn btn-primary"
                style={{ 
                    padding: '0.6rem 1.25rem', 
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)'
                }}
            >
              Reserve <ArrowRight size={16} />
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
