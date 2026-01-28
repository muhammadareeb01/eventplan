"use client";

import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import BookingModal from './BookingModal';

export default function EventCard({ event }: { event: any }) {
  const [showModal, setShowModal] = useState(false);

  const handleBookingSubmit = async (data: any) => {
    // Here we would integrate with Stripe and Firestore
    alert(`Processing payment of $${data.total} for ${data.quantity} ${data.seatType} seats. In a real app, this redirects to Stripe.`);
    console.log("Booking Data:", data);
    setShowModal(false);
  };

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {event.featured && (
          <div style={{ 
            position: 'absolute', 
            top: '1rem', 
            right: '1rem', 
            background: 'var(--accent)', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: 700 
          }}>
            FEATURED
          </div>
        )}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Upcoming Event
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>{event.title}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{event.description}</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem', 
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Calendar className="text-secondary" size={20} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date</div>
              <div style={{ fontWeight: 600 }}>{event.date}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Clock className="text-secondary" size={20} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time</div>
              <div style={{ fontWeight: 600 }}>{event.time}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', gridColumn: 'span 2' }}>
            <MapPin className="text-secondary" size={20} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
              <div style={{ fontWeight: 600 }}>{event.locationName}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{event.locationAddress}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{event.locationCity}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Entry Fee</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{event.entryFee}</div>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Reserve Table <ArrowRight size={18} />
          </button>
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
