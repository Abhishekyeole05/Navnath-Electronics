import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FiStar, FiMessageSquare } from 'react-icons/fi';

const reviews = [
  {
    id: 1,
    name: 'Rajesh Patil',
    role: 'Electrical Contractor, Nashik',
    rating: 5,
    comment: 'I have been purchasing Havells wires and Anchor Roma modular switches from New Navnath Electricals for my construction projects for 8 years. Their wholesale rates and genuine billing are the best in market.',
    date: '2 Days Ago'
  },
  {
    id: 2,
    name: 'Sanjay Wagh',
    role: 'Homeowner, Gangapur Road',
    rating: 5,
    comment: 'We booked their Home Electrical Repair service because our main DB board MCB was tripping continuously. The certified technician Prakash arrived within 2 hours and fixed the fault quickly. Outstanding service!',
    date: '1 Week Ago'
  },
  {
    id: 3,
    name: 'Sunil Shinde',
    role: 'Industrial Engineer, SATPUR MIDC',
    rating: 5,
    comment: 'Ordered Schneider 32A MCBs and L&T motor starters for our manufacturing unit. Delivery was done same-day and every product came with authentic company hologram.',
    date: '2 Weeks Ago'
  },
  {
    id: 4,
    name: 'Priya Kulkarni',
    role: 'Interior Designer, Nashik',
    rating: 5,
    comment: 'New Navnath is my go-to shop for Philips LED downlights and Crompton SilentPro BLDC fans. My clients love the sleek designs and energy efficiency.',
    date: '3 Weeks Ago'
  }
];

const CustomerReviews = () => {
  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 46px' }}>
          <span className="badge badge-yellow" style={{ marginBottom: '10px' }}>
            VERIFIED TESTIMONIALS
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '14px', color: 'var(--text-primary)' }}>
            What Our Customers Say
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Over 10,000+ satisfied homeowners, electricians, and contractors trust New Navnath Electronics & Electricals.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500 }}
          spaceBetween={28}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          style={{ paddingBottom: '48px' }}
        >
          {reviews.map((rev) => (
            <SwiperSlide key={rev.id}>
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxShadow: 'var(--card-shadow)',
                position: 'relative'
              }}>
                <FiMessageSquare style={{
                  position: 'absolute',
                  top: '20px',
                  right: '24px',
                  fontSize: '2.4rem',
                  color: 'rgba(11, 61, 145, 0.1)'
                }} />

                {/* Rating */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <FiStar key={idx} style={{ color: 'var(--accent-yellow)', fill: 'var(--accent-yellow)' }} />
                  ))}
                </div>

                {/* Comment */}
                <p style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-primary)',
                  lineHeight: '1.65',
                  marginBottom: '20px',
                  flex: 1,
                  fontStyle: 'italic'
                }}>
                  "{rev.comment}"
                </p>

                {/* Author */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {rev.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {rev.role}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {rev.date}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CustomerReviews;
