// Composant pour afficher et sélectionner des étoiles
'use client';
import Image from 'next/image';
import '../styles/StarRating.css';

export default function StarRating({ rating, onRatingChange, readonly = false, size = 'medium' }) {
  const stars = [1, 2, 3, 4, 5];
  
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <div
          key={star}
          className={`star-wrapper ${!readonly ? 'interactive' : ''}`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
        >
          <Image
            src="/review.png"
            alt="étoile"
            width={sizeMap[size]}
            height={sizeMap[size]}
            className={`star-icon ${star <= rating ? 'filled' : 'empty'}`}
          />
        </div>
      ))}
    </div>
  );
}