import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: 'stripe' | 'paypal';
}

const StripeForm = ({ onSuccess, onError }: { onSuccess: () => void; onError: (error: string) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // Create payment intent
      const response = await fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: formData.name,
            email: formData.email
          }
        }
      });

      if (result.error) {
        onError(result.error.message || 'Errore nel pagamento');
      } else {
        onSuccess();
      }
    } catch (error) {
      onError('Errore nella connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Dati carta</Label>
        <div className="border rounded-md p-3 mt-2">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Elaborazione...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Paga €17 con Carta
          </>
        )}
      </Button>
    </form>
  );
};

const PayPalForm = ({ onSuccess, onError }: { onSuccess: () => void; onError: (error: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handlePayPal = async () => {
    if (!formData.name || !formData.email) {
      onError('Nome e email sono richiesti');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.redirectUrl) {
        // Apri il link PayPal personalizzato o WhatsApp come fallback
        window.open(data.redirectUrl, '_blank');
        onSuccess();
      } else {
        onError('Errore nella configurazione del pagamento PayPal');
      }
    } catch (error) {
      onError('Errore nella creazione dell\'ordine PayPal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <Button onClick={handlePayPal} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Elaborazione...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h8.418c2.508 0 4.514.893 5.836 2.478 1.411 1.693 1.625 3.815.574 5.972-.91 1.866-2.573 3.24-4.605 3.786C9.5 1.4 7.076 21.337 7.076 21.337z"/>
            </svg>
            Paga €17 con PayPal
          </>
        )}
      </Button>
    </div>
  );
};

export default function PaymentModal({ isOpen, onClose, paymentType }: PaymentModalProps) {
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [message, setMessage] = useState('');

  const handleSuccess = () => {
    setStatus('success');
    setMessage('Pagamento completato con successo! Ti contatteremo presto per il tuo sito web.');
  };

  const handleError = (error: string) => {
    setStatus('error');
    setMessage(error);
  };

  const resetModal = () => {
    setStatus('form');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {status === 'success' ? '✅ Pagamento Completato' : 
             status === 'error' ? '❌ Errore' :
             `Prenota con ${paymentType === 'stripe' ? 'Carta' : 'PayPal'}`}
          </DialogTitle>
        </DialogHeader>

        {status === 'form' && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Versa €17 per prenotare il tuo slot. Il resto (€180) lo pagherai alla consegna del sito completato.
            </p>
            {paymentType === 'stripe' ? (
              <Elements stripe={stripePromise}>
                <StripeForm onSuccess={handleSuccess} onError={handleError} />
              </Elements>
            ) : (
              <PayPalForm onSuccess={handleSuccess} onError={handleError} />
            )}
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <div className="text-center">
            <p className={`mb-4 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
            <Button onClick={resetModal} className="w-full">
              {status === 'success' ? 'Chiudi' : 'Riprova'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}