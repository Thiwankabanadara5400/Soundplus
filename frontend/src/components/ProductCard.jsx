import React from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaShoppingCart } from 'react-icons/fa'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { _id, name, image, price, brand, category, rating, discount, noiseCancellation } = product

  return (
    <div className="product-card">
      <Link to={`/products/${_id}`} className="product-link">
        {discount && discount !== '0%' && (
          <span className="product-badge">{discount} OFF</span>
        )}
        {noiseCancellation && (
          <span className="product-badge badge-feature">NC</span>
        )}

        <div className="product-image-wrapper">
          <img
            src={image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={name}
            className="product-image"
            loading="lazy"
          />
        </div>

        <div className="product-info">
          <span className="product-category">{category}</span>
          <h3 className="product-name">{name}</h3>
          <p className="product-brand">{brand}</p>

          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.floor(rating || 0) ? 'star-filled' : 'star-empty'}
              />
            ))}
            <span className="rating-text">({rating?.toFixed(1) || '0.0'})</span>
          </div>

          <div className="product-footer">
            <div className="product-price">
              <span className="price-current">${price}</span>
              {discount && discount !== '0%' && (
                <span className="price-original">${(price * 1.2).toFixed(2)}</span>
              )}
            </div>
            <button className="add-to-cart-btn" aria-label="Add to cart">
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
