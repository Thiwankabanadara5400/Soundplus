import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaHeadphones, FaSearch } from 'react-icons/fa'
import './Navbar.css'

const Navbar = ({ user, setUser, cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <FaHeadphones className="logo-icon" />
            <span className="logo-text">Sound<span className="logo-highlight">Plus++</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="nav-links desktop-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
            {user && (
              <Link to="/orders" className="nav-link">My Orders</Link>
            )}
          </div>

          {/* Right side */}
          <div className="nav-actions">
            <button className="icon-btn search-btn" aria-label="Search">
              <FaSearch />
            </button>

            <Link to="/cart" className="icon-btn cart-btn">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="user-menu">
                <button className="icon-btn user-btn">
                  <FaUser />
                </button>
                <div className="dropdown">
                  <p className="user-name">Hello, {user.username}</p>
                  <Link to="/orders" className="dropdown-item">My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Products
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
            {user && (
              <Link to="/orders" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                My Orders
              </Link>
            )}
            {!user && (
              <>
                <Link to="/login" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
