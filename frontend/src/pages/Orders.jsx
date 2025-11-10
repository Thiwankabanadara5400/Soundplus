import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/orders/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '1.25rem' }}>No orders yet</p>
          </div>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  padding: '2rem',
                  background: 'var(--dark-gray)',
                  borderRadius: '15px',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Status:</strong> <span style={{ color: 'var(--tech-blue)' }}>{order.status}</span></p>
                  </div>
                  <div>
                    <p style={{ fontSize: '1.5rem', color: 'var(--primary-yellow)', fontWeight: '700' }}>
                      ${order.totalAmount}
                    </p>
                  </div>
                </div>
                <div>
                  <p><strong>Items:</strong></p>
                  {order.items?.map((item, idx) => (
                    <p key={idx}>{item.name} x {item.quantity}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
