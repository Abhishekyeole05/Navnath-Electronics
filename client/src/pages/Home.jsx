import React from 'react';
import HeroBanner from './home/HeroBanner';
import AboutShop from './home/AboutShop';
import ProductCategoriesGrid from './home/ProductCategoriesGrid';
import FeaturedProducts from './home/FeaturedProducts';
import WhyChooseUs from './home/WhyChooseUs';
import CustomerReviews from './home/CustomerReviews';
import BrandPartners from './home/BrandPartners';
import StatisticsCounter from './home/StatisticsCounter';
import CallToAction from './home/CallToAction';

const Home = ({ onToast }) => {
  return (
    <div>
      <HeroBanner />
      <AboutShop />
      <ProductCategoriesGrid />
      <FeaturedProducts onToast={onToast} />
      <WhyChooseUs />
      <CustomerReviews />
      <BrandPartners />
      <StatisticsCounter />
      <CallToAction />
    </div>
  );
};

export default Home;
