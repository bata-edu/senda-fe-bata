import React from "react";
import Hero from "../../components/landing/Hero";
import Languages from "../../components/landing/Languages";
import Features from "../../components/landing/Features";
import PricingTables from "../../components/landing/Pricing";
import Faqs from "../../components/landing/Faqs";
import Footer from "../../components/landing/ui/Footer";
import Header from "../../components/landing/ui/Header";

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Languages />
      <Features />
      <PricingTables />
      <Faqs />
      <Footer />
    </div>
  );
};

export default LandingPage;
