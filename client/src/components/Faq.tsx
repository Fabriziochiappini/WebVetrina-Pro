import { faq } from '@/assets/faq';

const Faq = () => {
  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary font-heading">
            Domande Frequenti
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tutto quello che devi sapere sulla nostra offerta di siti web a €299.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {faq.map((item, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-primary font-heading">
                {item.question}
              </h3>
              <p className="text-gray-700">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
