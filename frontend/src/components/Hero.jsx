import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import './Hero.css'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: 'Premium Wireless',
      subtitle: 'Headphones',
      description: 'Experience studio-quality sound with our premium wireless headphones',
      category: 'wireless',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    },
    {
      title: 'Ultra Compact',
      subtitle: 'Earbuds',
      description: 'True wireless freedom with exceptional audio clarity',
      category: 'earbuds',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'
    },
    {
      title: 'Gaming Pro',
      subtitle: 'Headsets',
      description: 'Immersive gaming experience with crystal clear communication',
      category: 'gaming',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="hero">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay"></div>
            <div className="container">
              <div className="hero-content">
                <span className="hero-label">New Arrival</span>
                <h1 className="hero-title">
                  {slide.title}
                  <br />
                  <span className="hero-subtitle">{slide.subtitle}</span>
                </h1>
                <p className="hero-description">{slide.description}</p>
                <div className="hero-buttons">
                  <Link to={`/products?category=${slide.category}`} className="btn btn-primary">
                    Shop Now <FaArrowRight />
                  </Link>
                  <Link to="/products" className="btn btn-outline">
                    View All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide">
        <FaChevronLeft />
      </button>
      <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide">
        <FaChevronRight />
      </button>

      {/* Slider Dots */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
