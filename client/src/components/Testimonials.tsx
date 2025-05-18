import { testimonials } from '@/assets/testimonials';

const Testimonials = () => {
  return (
    <section id="testimonianze" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary font-heading">
            Cosa Dicono i Nostri Clienti
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Abbiamo aiutato centinaia di aziende a creare la loro presenza online. Ecco alcune testimonianze.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="testimonial-card bg-white p-6 rounded-xl shadow-md hover:translate-y-[-5px] transition-transform duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={`${testimonial.name} - ${testimonial.company}`} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-lg font-heading">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.company}</p>
                </div>
              </div>
              <div className="mb-3 text-yellow-400">
                {Array(5).fill(0).map((_, i) => (
                  <i key={i} 
                    className={`fas ${i < testimonial.rating ? 
                      (i === Math.floor(testimonial.rating) && testimonial.rating % 1 !== 0 ? 
                      'fa-star-half-alt' : 'fa-star') : 
                      'fa-star text-gray-300'}`}>
                  </i>
                ))}
              </div>
              <p className="text-gray-700">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
