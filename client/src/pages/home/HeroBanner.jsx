import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiTool } from 'react-icons/fi';

const slides = [
  {
    id: 1,
    tag: '100% GENUINE BRANDS • 10-YEAR WARRANTY',
    title: 'Top Brand Copper Wires & Modular Switchgear',
    description: 'Upgrade your home & industrial wiring with Havells, Polycab, Anchor Roma, and Schneider Electric MCBs at unbeatable wholesale prices.',
    buttonText: 'Shop Wires & Switches',
    buttonLink: '/products?category=wires-cables',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
    accent: '#FFC107'
  },
  {
    id: 2,
    tag: 'CERTIFIED ELECTRICIANS AT YOUR DOORSTEP',
    title: 'Expert Home Electrical Repair & Installation',
    description: 'Frequent MCB tripping, sparking switchboards, or need water pump & ceiling fan installation? Book our certified Nashik electricians today.',
    buttonText: 'Book Service Now (₹299 onwards)',
    buttonLink: '/services',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=80',
    accent: '#10B981'
  },
  {
    id: 3,
    tag: 'ENERGY SAVING BLDC FANS & LED LIGHTING',
    title: 'Save Up to 60% Electricity with Smart BLDC Fans & LEDs',
    description: 'Explore silent 5-star remote ceiling fans from Crompton and flicker-free Philips T5 LED batten lights for bright, efficient living.',
    buttonText: 'Explore Fans & LEDs',
    buttonLink: '/products?category=lighting-leds',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1400&q=80',
    accent: '#3B82F6'
  }
];

const HeroBanner = () => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-main)' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop={true}
        style={{ width: '100%', height: '520px' }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              backgroundImage: `linear-gradient(90deg, rgba(10, 25, 47, 0.92) 0%, rgba(10, 25, 47, 0.65) 60%, rgba(10, 25, 47, 0.25) 100%), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div className="container">
                <div style={{ maxWidth: '650px', color: '#FFFFFF' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    color: 'var(--accent-yellow)',
                    padding: '6px 14px',
                    borderRadius: '30px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    marginBottom: '18px',
                    border: '1px solid rgba(255, 193, 7, 0.3)'
                  }}>
                    <FiZap /> {slide.tag}
                  </div>

                  <h1 style={{
                    fontSize: '2.8rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: '1.2',
                    marginBottom: '16px',
                    letterSpacing: '-1px'
                  }}>
                    {slide.title}
                  </h1>

                  <p style={{
                    fontSize: '1.08rem',
                    color: '#CBD5E1',
                    lineHeight: '1.6',
                    marginBottom: '32px',
                    maxWidth: '560px'
                  }}>
                    {slide.description}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Link
                      to={slide.buttonLink}
                      className="btn btn-accent"
                      style={{ padding: '14px 30px', fontSize: '1.02rem', borderRadius: '10px', boxShadow: '0 8px 20px rgba(255, 193, 7, 0.35)' }}
                    >
                      {slide.buttonText} <FiArrowRight />
                    </Link>

                    <Link
                      to="/products"
                      className="btn"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        padding: '14px 26px',
                        fontSize: '1rem',
                        borderRadius: '10px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      View All Catalog
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;
