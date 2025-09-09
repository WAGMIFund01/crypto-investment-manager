'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [investorId, setInvestorId] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInvestorLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/validate-investor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ investorId }),
      })

      const data = await response.json()
      
      if (data.success) {
        sessionStorage.setItem('investorId', investorId)
        router.push('/investor')
      } else {
        alert('Invalid Investor ID')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1A1A1A',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ 
        color: '#00FF95', 
        fontSize: '2.5rem', 
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        WAGMI
      </h1>
      
      <div style={{
        backgroundColor: '#2D2D2D',
        border: '1px solid #404040',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ 
          color: '#FFFFFF', 
          fontSize: '1.5rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Investor Login
        </h2>
        
        <form onSubmit={handleInvestorLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              color: '#E0E0E0', 
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Investor ID
            </label>
            <input
              type="text"
              value={investorId}
              onChange={(e) => setInvestorId(e.target.value)}
              placeholder="Enter your Investor ID"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#404040',
                border: '1px solid #666',
                borderRadius: '0.375rem',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#666' : '#00FF95',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
