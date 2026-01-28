"use client";

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Loader2, CheckCircle } from 'lucide-react';
import { createBooking } from '@/lib/db';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSubmit: (data: any) => void;
}

export default function BookingModal({ isOpen, onClose, event, onSubmit }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: event.availableDates ? event.availableDates[0] : event.date,
    tableType: 'regular',
    quantity: 1
  });

  // Lock body scroll when modal is open
    useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const tables = {
    regular: { price: 50, label: 'Regular Table' },
    wall: { price: 60, label: 'Wall Spot' },
    premium: { price: 70, label: 'Premium Spot' }
  };

  const total = tables[formData.tableType as keyof typeof tables].price * formData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Direct Database Save (Skipping Stripe)
    const result = await createBooking({
      ...formData,
      // Phone is now the standard
      phone: formData.phone,
      totalAmount: total,
      eventId: event.id,
      status: 'confirmed', // Mark as confirmed directly
      tableType: formData.tableType as any
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSubmit({ ...formData, total, eventId: event.id });
        onClose();
        setSuccess(false);
        setLoading(false);
        setFormData({ 
            name: '', 
            email: '', 
            phone: '', 
            date: event.availableDates ? event.availableDates[0] : event.date, 
            tableType: 'regular', 
            quantity: 1 
        });
      }, 1500);
    } else {
      console.error("Booking failed:", result.error);
      setError(result.error || 'Booking failed.'); // Improved error reporting
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <CheckCircle size={64} className="text-secondary" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Booking Confirmed!</h3>
          <p style={{ color: 'var(--text-muted)' }}>See you at {event.locationCity} on {formData.date}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-highlight)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Reserve Your Table</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1rem 1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h4 className="text-gradient" style={{ marginBottom: '0.25rem' }}>{event.title}</h4>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {event.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {event.locationAddress}, {event.locationCity}</span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ marginBottom: '0.25rem' }}>Select Date</label>
             <select 
              className="form-select"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}
            >
              {event.availableDates ? (
                  event.availableDates.map((d: string) => (
                      <option key={d} value={d}>{d}</option>
                  ))
              ) : (
                  <option value={event.date}>{event.date}</option>
              )}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ marginBottom: '0.25rem' }}>Select Table Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {Object.entries(tables).map(([key, details]) => (
                <div 
                  key={key}
                  onClick={() => setFormData({...formData, tableType: key})}
                  style={{ 
                    border: `1px solid ${formData.tableType === key ? 'var(--primary)' : 'var(--border-highlight)'}`,
                    background: formData.tableType === key ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{details.label}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>${details.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem' }}>Quantity</label>
              <input 
                type="number" 
                className="form-input" 
                min="1" 
                max="10" 
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                style={{ padding: '0.5rem 1rem' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem' }}>Full Name</label>
              <input 
                required
                type="text" 
                className="form-input" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                style={{ padding: '0.5rem 1rem' }}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem' }}>Email</label>
              <input 
                required
                type="email" 
                className="form-input" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                style={{ padding: '0.5rem 1rem' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem' }}>Phone Number</label>
              <input 
                required
                type="tel" 
                className="form-input" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 234 567 890"
                style={{ padding: '0.5rem 1rem' }}
              />
            </div>
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ 
            marginTop: '1.5rem', 
            padding: '0.75rem 1rem', 
            background: 'var(--surface-highlight)', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Amount</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>${total}</div>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
            >
              {loading ? <><Loader2 className="animate-spin" size={16} /> Processing...</> : 'Confirm Booking'}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
            Instant confirmation. No payment detailed required for this demo.
          </p>
        </form>
      </div>
    </div>
  );
}
