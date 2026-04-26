'use client'
import { useState } from 'react'
import { TAROT_CARDS, CARD_LOOKS } from '../../lib/cards'

export default function CardDraw({ onComplete }) {
  const [cards, setCards] = useState([])
  const [revealed, setRevealed] = useState([])
  const [context, setContext] = useState('')

  const drawCards = () => {
    const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5)
    const drawn = shuffled.slice(0, 3).map((card, i) => ({
      ...card,
      look: CARD_LOOKS[Math.floor(Math.random() * CARD_LOOKS.length)],
      position: ['Past', 'Present', 'Future'][i]
    }))
    setCards(drawn)
    setRevealed([])
  }

  const revealCard = (i) => {
    if (!revealed.includes(i)) setRevealed([...revealed, i])
  }

  const handleComplete = () => {
    onComplete({ cards, context })
  }

  if (cards.length === 0) {
    return (
      <div style={{ textAlign: 'center' }}>
        <button onClick={drawCards} style={{ fontSize: '18px', padding: '18px 36px' }}>
          ✨ Draw Your Cards
        </button>
      </div>
    )
  }

  return (
    <div>
      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Add context for a deeper reading (optional)..."
        style={{ marginBottom: '2rem', minHeight: '100px', fontSize: '15px' }}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {cards.map((card, i) => (
          <div key={i} onClick={() => revealCard(i)} style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div style={{
              background: revealed.includes(i) 
                ? 'linear-gradient(135deg, rgba(106, 76, 147, 0.3) 0%, rgba(139, 95, 176, 0.3) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
              border: revealed.includes(i) 
                ? '2px solid rgba(212, 175, 55, 0.6)' 
                : '2px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '16px',
              aspectRatio: '2/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              marginBottom: '1rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: revealed.includes(i) ? 'rotateY(0deg) scale(1.02)' : 'rotateY(0deg) scale(1)',
              boxShadow: revealed.includes(i) 
                ? '0 8px 30px rgba(212, 175, 55, 0.3)' 
                : '0 4px 15px rgba(0, 0, 0, 0.3)',
            }}>
              {revealed.includes(i) ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '500', 
                    color: '#d4af37',
                    marginBottom: '8px',
                    fontFamily: 'Cinzel, serif'
                  }}>
                    {card.name}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.7,
                    color: '#c9c9d8',
                    fontStyle: 'italic'
                  }}>
                    {card.look}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '48px', opacity: 0.5 }}>🎴</div>
              )}
            </div>
            <div style={{ 
              fontSize: '13px', 
              opacity: 0.6,
              fontFamily: 'Cinzel, serif',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#d4af37'
            }}>
              {card.position}
            </div>
          </div>
        ))}
      </div>

      {revealed.length < 3 && (
        <button onClick={() => setRevealed([0, 1, 2])} style={{ marginBottom: '1rem', width: '100%' }}>
          ✨ Reveal All
        </button>
      )}

      {revealed.length === 3 && (
        <button onClick={handleComplete} style={{ width: '100%', fontSize: '16px' }}>
          🔮 Get Your Reading
        </button>
      )}
    </div>
  )
}
