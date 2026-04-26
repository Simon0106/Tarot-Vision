'use client'
import { useState } from 'react'
import CardDraw from './components/CardDraw'
import Reading from './components/Reading'

export default function Home() {
  const [screen, setScreen] = useState('home')
  const [readingData, setReadingData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }} className="fade-in">
      <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '0.5rem', textAlign: 'center' }}>
        Tarot-Vision
      </h1>
      <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '2rem', textAlign: 'center' }}>
        Contextual tarot readings
      </p>

      {screen === 'home' && (
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }} className="fade-in">
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ 
              fontSize: '18px', 
              lineHeight: '1.8', 
              marginBottom: '2rem',
              color: '#c9c9d8'
            }}>
              Get personalized tarot readings powered by deep intuition and context. 
              Draw your cards, share your situation, and receive insights tailored to your life.
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '1.5rem',
              marginBottom: '3rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>🎴</div>
                <div style={{ fontSize: '14px', color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
                  Draw Cards
                </div>
              </div>
              <div>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>💬</div>
                <div style={{ fontSize: '14px', color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
                  Add Context
                </div>
              </div>
              <div>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>✨</div>
                <div style={{ fontSize: '14px', color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
                  Get Insights
                </div>
              </div>
            </div>
          </div>

          <button onClick={handlePayment} style={{ padding: '18px 48px', fontSize: '18px' }}>
            ✨ Begin Reading
          </button>
          <p style={{ fontSize: '13px', opacity: 0.5, marginTop: '1rem' }}>
            Free while in beta
          </p>

          <div style={{ 
            marginTop: '4rem', 
            paddingTop: '2rem', 
            borderTop: '1px solid rgba(212, 175, 55, 0.2)',
            fontSize: '12px',
            opacity: 0.6,
            lineHeight: '1.8'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              Tarot readings are for entertainment and reflection purposes only.
            </p>
            <p>
              © 2026 Tarot-Vision • Created by S.R. Moore
            </p>
          </div>
        </div>
      )}

      {screen === 'draw' && !loading && (
        <div className="fade-in">
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
    </div>
  )
}
