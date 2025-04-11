import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import Programs from './Programs';
import Pricing from './Pricing';
import Testimonials from './Testimonials';
import GymFooter from './GymFooter';

function LandingPage() {
  return (
    <div>
      <Header />
      <section id="hero-section">
        <HeroSection />
      </section>
      <section id="programs-section">
        <Programs />
      </section>
      <section id="pricing-section">
        <Pricing />
      </section>
      <section id="testimonials-section">
        <Testimonials />
      </section>
      <GymFooter />
    </div>
  );
}

export default LandingPage;
