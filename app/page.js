'use client'
import { useState } from 'react'
import CardDraw from '@/components/CardDraw'
import Reading from '@/components/Reading'

export default function Home() {
  const [screen, setScreen] = useState('home')
  const [readingData, setReadingData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    // For now, skip payment and go straight to draw
    // We'll add Stripe later
    setScreen('draw')
  }

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
    setScreen('home')
    setReadingData(null)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '0.5rem', textAlign: 'center' }}>
        Tarot-Vision
      </h1>
      <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '2rem', textAlign: 'center' }}>
        Contextual tarot readings
      </p>

      {screen === 'home' && (
        <div style={{ textAlign: 'center' }}>
          <button onClick={handlePayment} style={{ padding: '16px 32px', fontSize: '16px' }}>
            Draw Cards (£1.99)
          </button>
          <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '0.5rem' }}>
            Payment coming soon - free for now
          </p>
        </div>
      )}

      {screen === 'draw' && !loading && (
        <CardDraw onComplete={handleDrawComplete} />
      )}

      {loading && <div style={{ textAlign: 'center' }}>Generating your reading...</div>}

      {screen === 'reading' && readingData && (
        <Reading 
          cards={readingData.cards} 
          reading={readingData.reading}
          onDrawAgain={handleDrawAgain}
        />
      )}
    </div>
  )
}
