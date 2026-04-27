'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import CardDraw from '../components/CardDraw'
import Reading from '../components/Reading'

function SuccessContent() {
  const [screen, setScreen] = useState('draw')
  const [readingData, setReadingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const handleDrawComplete = async ({ cards, context }) => {
    setLoading(true)
    const res = await fetch('/api/generate-reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards, context })
    })
    
    const data = await res.json()
    setReadingData({ cards, reading: data.reading })
    setScreen('reading')
    setLoading(false)
  }

  const handleDrawAgain = () => {
    window.location.href = '/'
  }

  return (
    <>
      {screen === 'draw' && !loading && (
        <div className="fade-in">
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(106, 76, 147, 0.2)',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>✨</div>
            <div style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', fontSize: '16px' }}>
              Payment successful! Draw your cards below.
            </div>
          </div>
          <CardDraw onComplete={handleDrawComplete} />
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }} className="fade-in">
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1.5rem',
            border: '4px solid rgba(212, 175, 55, 0.2)',
            borderTop: '4px solid #d4af37',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ 
            fontSize: '16px', 
            color: '#d4af37',
            fontFamily: 'Cinzel, serif',
            letterSpacing: '2px'
          }}>
            Consulting the cards...
          </div>
        </div>
      )}

      {screen === 'reading' && readingData && (
        <div className="fade-in">
          <Reading 
            cards={readingData.cards} 
            reading={readingData.reading}
            onDrawAgain={handleDrawAgain}
          />
        </div>
      )}
    </>
  )
}

export default function SuccessPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }} className="fade-in">
      <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '0.5rem', textAlign: 'center' }}>
        Tarot-Vision
      </h1>
      <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '2rem', textAlign: 'center' }}>
        Contextual tarot readings
      </p>

      <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
