import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const AdminDashboard = ({ user }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'headphones',
    brand: '',
    model: '',
    connectivity: 'wireless',
    available: 0
  })
  const [imageFile, setImageFile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchProducts()
  }, [user])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      Object.keys(formData).forEach((key) => data.append(key, formData[key]))
      if (imageFile) data.append('image', imageFile)

      await axios.post(`${API_URL}/add-product`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Product added successfully!')
      setShowForm(false)
      fetchProducts()
    } catch (error) {
      toast.error('Failed to add product')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/delete-product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Product deleted!')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Admin Dashboard</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--dark-gray)', padding: '2rem', borderRadius: '15px', marginBottom: '2rem' }}>
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
              <input name="name" placeholder="Product Name" className="input" onChange={handleChange} required />
              <input name="brand" placeholder="Brand" className="input" onChange={handleChange} required />
              <input name="model" placeholder="Model" className="input" onChange={handleChange} required />
              <input name="price" type="number" step="0.01" placeholder="Price" className="input" onChange={handleChange} required />
              <select name="category" className="select" onChange={handleChange}>
                <option value="headphones">Headphones</option>
                <option value="earbuds">Earbuds</option>
                <option value="earphones">Earphones</option>
                <option value="wireless">Wireless</option>
                <option value="gaming">Gaming</option>
              </select>
              <select name="connectivity" className="select" onChange={handleChange}>
                <option value="wireless">Wireless</option>
                <option value="wired">Wired</option>
                <option value="bluetooth">Bluetooth</option>
              </select>
              <textarea name="description" placeholder="Description" className="textarea" rows="4" onChange={handleChange} required />
              <input name="available" type="number" placeholder="Stock" className="input" onChange={handleChange} required />
              <input type="file" accept="image/*" onChange={handleImageChange} className="input" />
              <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
          </div>
        )}

        <div>
          <h2>All Products ({products.length})</h2>
          <div style={{ marginTop: '1.5rem' }}>
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  padding: '1.5rem',
                  background: 'var(--dark-gray)',
                  borderRadius: '15px',
                  marginBottom: '1rem',
                  alignItems: 'center'
                }}
              >
                <img
                  src={product.image || 'https://via.placeholder.com/100'}
                  alt={product.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <div style={{ flex: 1 }}>
                  <h3>{product.name}</h3>
                  <p>{product.brand} - {product.category}</p>
                  <p style={{ color: 'var(--primary-yellow)', fontSize: '1.25rem', fontWeight: '700' }}>
                    ${product.price}
                  </p>
                </div>
                <button className="btn btn-outline" onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
