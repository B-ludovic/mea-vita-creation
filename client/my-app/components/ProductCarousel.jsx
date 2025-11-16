'use client';

import { useState } from 'react';
import Image from 'next/image';
import OptimizedImage from './OptimizedImage';
import '../styles/ProductCarousel.css';

export default function ProductCarousel({ images, productName, categorySlug }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation vers l'image précédente
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Navigation vers l'image suivante
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Navigation directe via les miniatures
  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="carousel-placeholder">
        <div className="placeholder-icon">📸</div>
        <p>Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className="product-carousel">
      {/* Image principale */}
      <div className="carousel-main">
        <OptimizedImage
          src={images[currentIndex]}
          alt={`${productName} - Photo ${currentIndex + 1}`}
          size="large"
          context="detail"
          width={600}
          height={600}
          className="carousel-image"
          priority={currentIndex === 0}
        />

        {/* Flèches de navigation (seulement si plusieurs images) */}
        {images.length > 1 && (
          <>
            <button 
              className="carousel-btn carousel-btn-prev" 
              onClick={goToPrevious}
              aria-label="Image précédente"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button 
              className="carousel-btn carousel-btn-next" 
              onClick={goToNext}
              aria-label="Image suivante"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Indicateurs de position */}
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniatures (seulement si plusieurs images) */}
      {images.length > 1 && (
        <div className="carousel-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
            >
              <OptimizedImage
                src={image}
                alt={`${productName} - Miniature ${index + 1}`}
                size="thumbnail"
                context="thumbnail"
                width={80}
                height={80}
                className="thumbnail-image"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
