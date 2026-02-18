"use client";

import { useEffect } from 'react'; // Checking if I need other imports, likely not for the embed
// import { useState, useEffect } from 'react';
// import { Calendar, MapPin, Clock, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
// import { createBooking, ensureEventExists, getEventAvailability } from '@/lib/db';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from './CheckoutForm';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSubmit: (data: any) => void;
}

export default function BookingModal({ isOpen, onClose, event, onSubmit }: BookingModalProps) {
  // --- NEW EMBEDDED CODE (HOST PROFILE) ---
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === "https://www.ontreasure.com" &&
        event.data &&
        typeof event.data === "object" &&
        event.data.height &&
        event.data.iframeId
      ) {
        const iframe = document.getElementById(event.data.iframeId);
        if (iframe) {
          const height = Math.max(parseInt(event.data.height, 10), 10);
          iframe.style.height = height + "px";
        }
      }
    };

    if (isOpen) {
        window.addEventListener("message", handleMessage);
    }
    
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ 
            maxWidth: '1000px', 
            width: '95%',
            height: '90vh', // Fixed height for the modal
            overflowY: 'auto', // Allow scrolling within the modal if the iframe gets very tall
            padding: '0' 
        }}
      >
         <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 15px', background: 'var(--surface)' }}>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
         </div>
         <div className="iframe-section" style={{ width: '100%', minHeight: '600px' }}>
          <iframe
            style={{ width: '100%', border: 'none', borderRadius: '10px', padding: '0px', minHeight: '600px' }}
            id="treasure-embed-profile-bstcardshows"
            sandbox="allow-same-origin allow-forms allow-scripts allow-popups allow-popups-to-escape-sandbox"
            src="https://www.ontreasure.com/u/bstcardshows/embed?iframeId=treasure-embed-profile-bstcardshows"
            title="Host Profile"
            loading="lazy"
            allow="fullscreen; payment"
          ></iframe>
        </div>
      </div>
    </div>
  );
  // --- END NEW EMBEDDED CODE ---

  /*
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  const [fetchingAvailability, setFetchingAvailability] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: event.availableDates ? event.availableDates[0] : event.date,
    tableType: '', // Start empty, will be set to first available ID
    quantity: 1
  });

  // Lock body scroll when modal is open
    useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Fetch availability
      setFetchingAvailability(true);
      getEventAvailability(event.id).then(data => {
          setAvailability(data);
          setFetchingAvailability(false);
          
          // Auto-select first available table ID
          if (data) {
             const firstAvailableId = Object.keys(data).find(k => data[k].remaining > 0);
             if (firstAvailableId) {
                 setFormData(prev => ({ ...prev, tableType: firstAvailableId }));
             }
          }
      }).catch(err => {
          console.error("Failed to fetch availability", err);
          setFetchingAvailability(false);
      });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, event.id]);

  if (!isOpen) return null;

  // Default fallback if availability fetch fails or is loading, 
  // but prefer using availability data if present.
  const defaultTables = {}; 

  const tables = availability || defaultTables;

  const currentTable = formData.tableType ? tables[formData.tableType] : null;
  // If selected type doesn't exist in availability (e.g. data mismatch), fallback.
   const price = currentTable?.price || 0;
   // User Requirement: Add event fee to total
   const eventFee = event.eventPrice || 0;
   const subtotal = price * formData.quantity;
   const total = subtotal; // Exclude eventFee per user request

   const isFullyBooked = currentTable?.remaining <= 0;
 
   const handleFormSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!formData.tableType || !currentTable) {
         setError("Please select a table type.");
         return;
     }

     setLoading(true);
     setError('');
 
     try {
       if (currentTable.remaining < formData.quantity) {
           throw new Error(`Only ${currentTable.remaining} spots left.`);
       }
 
       // Lazy Sync: Ensure event exists in Firestore before we try to pay for it
       await ensureEventExists(event);
 
       const res = await fetch('/api/create-payment-intent', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ amount: total }),
       });
       
       const data = await res.json();
       
       if (data.error) {
         throw new Error(data.error);
       }
 
       setClientSecret(data.clientSecret);
       setShowPayment(true);
     } catch (err: any) {
       console.error("Payment init failed:", err);
       setError(err.message || "Failed to initialize payment");
     } finally {
       setLoading(false);
     }
   };
 
   const handleFinalClose = () => {
     setSuccess(false);
     setLoading(false);
     setShowPayment(false);
     setClientSecret('');
     setFormData({ 
         name: '', 
         email: '', 
         phone: '', 
         date: event.availableDates ? event.availableDates[0] : event.date, 
         tableType: '', 
         quantity: 1 
     });
     onClose();
   };
 
   const handlePaymentSuccess = async (paymentId: string) => {
     setLoading(true);
     
     // Save to Firestore after successful payment
     const result = await createBooking({
       ...formData,
       phone: formData.phone,
       totalAmount: total,
       eventId: event.id,
       status: 'paid', // Mark as paid
       tableType: formData.tableType as any,
       paymentId: paymentId
     });
 
     if (result.success) {
       setSuccess(true);
       onSubmit({ ...formData, total, eventId: event.id });
     } else {
       console.error("Booking save failed:", result.error);
       setError(result.error || 'Payment successful but booking failed. Please contact support.'); 
       setLoading(false);
     }
   };
 
   if (success) {
     return (
       <div className="modal-overlay">
         <div className="modal-content" style={{ textAlign: 'center', padding: '3rem' }}>
           <CheckCircle size={64} className="text-secondary" style={{ margin: '0 auto 1rem auto' }} />
           <h3>Booking Confirmed!</h3>
           <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>See you at {event.locationCity} on {formData.date}</p>
           <button onClick={handleFinalClose} className="btn btn-primary" style={{ width: '100%' }}>
             Close
           </button>
         </div>
       </div>
     );
   }
 
   return (
     <div className="modal-overlay" onClick={onClose}>
       <div className="modal-content" onClick={e => e.stopPropagation()}>
         <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-highlight)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             {showPayment && (
               <button 
                 onClick={() => setShowPayment(false)} 
                 style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
               >
                 <ArrowLeft size={20} />
               </button>
             )}
             <h3 style={{ fontSize: '1.25rem' }}>{showPayment ? 'Complete Payment' : 'Reserve Your Table'}</h3>
           </div>
           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
         </div>
 
         {showPayment && clientSecret ? (
           <div style={{ padding: '1.5rem' }}>
             <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '8px', border: '1px solid var(--border-highlight)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: 'var(--text-muted)' }}>Event</span>
                   <span style={{ fontWeight: 500 }}>{event.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: 'var(--text-muted)' }}>Date</span>
                   <span>{formData.date}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Tables ({formData.quantity}x)</span>
                    <span>${subtotal}</span>
                </div>
               
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-highlight)' }}>
                   <span>Total</span>
                   <span style={{ color: 'var(--primary)' }}>${total}</span>
                </div>
             </div>
            
            <Elements options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#d4af37' } } }} stripe={stripePromise}>
              <CheckoutForm onSuccess={handlePaymentSuccess} amount={total} />
            </Elements>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} style={{ padding: '1rem 1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h4 className="text-gradient" style={{ marginBottom: '0.25rem' }}>{event.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {event.date}</span>
              <span style={{ display: 'flex', alignItems: 'start', gap: '0.25rem' }}>
                <MapPin size={14} style={{ marginTop: '3px', flexShrink: 0 }} /> 
                <span>{event.locationAddress}, {event.locationCity}</span>
              </span>
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
            {Object.keys(tables).length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {Object.entries(tables).map(([key, details]: [string, any]) => {
                    const booked = details.remaining <= 0;
                    return (
                    <div 
                    key={key}
                    onClick={() => !booked && setFormData({...formData, tableType: key as any})}
                    style={{ 
                        border: `1px solid ${formData.tableType === key ? 'var(--primary)' : 'var(--border-highlight)'}`,
                        background: formData.tableType === key ? 'rgba(212, 175, 55, 0.1)' : (booked ? 'rgba(255,255,255,0.05)' : 'transparent'),
                        padding: '0.5rem',
                        borderRadius: '8px',
                        cursor: booked ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        opacity: booked ? 0.5 : 1
                    }}
                    >
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{details.label || key}</div>
                    <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>${details.price}</div>
                    <div style={{ fontSize: '0.7rem', color: booked ? '#ef4444' : 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {booked ? 'Fully Booked' : 'Available'}
                    </div>
                    </div>
                )})}
                </div>
            ) : (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-highlight)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                    {fetchingAvailability ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : 'No table types configured for this event.'}
                </div>
            )}
          </div>
 
          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem' }}>Quantity</label>
              <input 
                type="text" 
                pattern="[0-9]*"
                inputMode="numeric"
                className="form-input" 
                value={formData.quantity || ''}
                onChange={e => {
                    const val = e.target.value;
                    if (val === '') {
                        setFormData({...formData, quantity: 0});
                    } else if (/^\d*$/.test(val)) {
                         setFormData({...formData, quantity: parseInt(val)});
                    }
                }}
                onBlur={() => {
                     // Auto-correct on blur if needed, or leave it to user to see valid range
                     if (formData.quantity === 0) setFormData({...formData, quantity: 1});
                }}
                placeholder="1"
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
              {loading ? <><Loader2 className="animate-spin" size={16} /> Processing...</> : 'Proceed to Payment'}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
             Secure payment via Stripe. Your booking is confirmed instantly after payment.
          </p>
        </form>
        )}
      </div>
    </div>
  );
  */
}
