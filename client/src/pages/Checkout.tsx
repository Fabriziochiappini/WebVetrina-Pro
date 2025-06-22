import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from 'lucide-react';

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/thankyou`,
      },
    });

    if (error) {
      toast({
        title: "Errore Pagamento",
        description: error.message,
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Completa il Pagamento
        </h2>
        <div className="text-3xl font-bold text-secondary mb-2">€197</div>
        <p className="text-gray-600">Sito Web Professionale</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <PaymentElement />
        </div>
        
        <button 
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Elaborazione...
            </div>
          ) : (
            'PAGA ORA €197'
          )}
        </button>

        <div className="text-center text-xs text-gray-500">
          <p>Pagamento sicuro elaborato da Stripe</p>
          <p>SSL 256-bit • Protezione dati garantita</p>
        </div>
      </form>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create PaymentIntent per €197
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: 197,
        description: "Sito Web Professionale - Offerta Speciale"
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret received:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-white mx-auto mb-4" />
          <p className="text-white">Preparazione pagamento...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Errore nel caricamento del sistema di pagamento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-lg">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}