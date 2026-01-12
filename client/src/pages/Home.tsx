import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import OnlineBenefits from '../components/OnlineBenefits';
import Benefits from '../components/Benefits';
import PricingPlans from '../components/PricingPlans';

import ValueProposition from '../components/ValueProposition';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import Faq from '../components/Faq';
import Cta from '../components/Cta';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import FloatingCta from '../components/FloatingCta';
import ChatBot from '../components/ChatBot';
import PerformanceStats from '../components/PerformanceStats';

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
    <div className="antialiased bg-gray-50 text-dark min-h-screen">
      <Navbar />
      <Hero scrollToSection={scrollToSection} />
      <OnlineBenefits />
      <Benefits />
      <PricingPlans scrollToSection={scrollToSection} />

      <ValueProposition scrollToSection={scrollToSection} />
      <Process />
      <Testimonials />
      <PerformanceStats />
      <Faq scrollToSection={scrollToSection} />
      <Cta scrollToSection={scrollToSection} />
      <ContactForm />
      <Footer />
      <FloatingCta />
      <ChatBot />
    </div>
  );
};

export default Home;
