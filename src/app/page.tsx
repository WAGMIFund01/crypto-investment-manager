import Link from 'next/link'

export default function Home() {
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
        fontSize: '3rem', 
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        WAGMI
      </h1>
      <p style={{ 
        color: '#E0E0E0', 
        fontSize: '1.25rem',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        Crypto Investment Manager
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/login" style={{
          backgroundColor: '#00FF95',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Investor Login
        </Link>
        
        <Link href="/login" style={{
          backgroundColor: 'transparent',
          color: '#00FF95',
          border: '2px solid #00FF95',
          padding: '1rem 2rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Manager Access
        </Link>
      </div>
    </div>
  )
}
