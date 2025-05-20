import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import OnlineBenefits from '@/components/OnlineBenefits';
import Benefits from '@/components/Benefits';
import ValueProposition from '@/components/ValueProposition';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import Cta from '@/components/Cta';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

const Home = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 70; // Approximate height of the navbar
      const topPosition = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Scroll to section if URL contains a hash
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        scrollToSection(id);
      }, 500);
    }

    // Handle smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        e.preventDefault();
        const id = anchor.hash.substring(1);
        scrollToSection(id);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="antialiased bg-light text-dark">
      <Navbar />
      <Hero scrollToSection={scrollToSection} />
      <OnlineBenefits />
      <Benefits />
      <ValueProposition scrollToSection={scrollToSection} />
      <Process />
      <Testimonials />
      <Faq />
      <Cta scrollToSection={scrollToSection} />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Home;
