"use client";

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
}

export default function CheckoutForm({ onSuccess, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "An unexpected error occurred.");
        } else {
          setMessage("An unexpected error occurred.");
        }
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
         onSuccess(paymentIntent.id);
      } else {
          setMessage("Payment status: " + (paymentIntent?.status || "unknown"));
      }
    } catch (e) {
      console.error(e);
      setMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{layout: "tabs"}} />
      
      {message && (
        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
          {message}
        </div>
      )}

      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="btn btn-primary"
        style={{ 
          width: '100%', 
          marginTop: '1.5rem', 
          padding: '0.75rem',
          opacity: (isLoading || !stripe || !elements) ? 0.7 : 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {isLoading ? <><Loader2 className="animate-spin" size={16} /> Processing...</> : `Pay $${amount}`}
      </button>
    </form>
  );
}
