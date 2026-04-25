'use client'
import { useState } from 'react'
import { TAROT_CARDS, CARD_LOOKS } from '@/lib/cards'

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
    return <button onClick={drawCards}>Draw Cards</button>
  }

  return (
    <div>
      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Add context (optional)"
        style={{ marginBottom: '1rem', minHeight: '80px' }}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        {cards.map((card, i) => (
          <div key={i} onClick={() => revealCard(i)} style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div style={{
              background: revealed.includes(i) ? '#6c5ce7' : '#2a2a3e',
              border: '1px solid #444',
              borderRadius: '8px',
              aspectRatio: '2/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              marginBottom: '0.5rem'
            }}>
              {revealed.includes(i) ? (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>{card.name}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>{card.look}</div>
                </div>
              ) : (
                <div style={{ fontSize: '28px' }}>🎴</div>
              )}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>{card.position}</div>
          </div>
        ))}
      </div>

      {revealed.length < 3 && (
        <button onClick={() => setRevealed([0, 1, 2])} style={{ marginBottom: '1rem', width: '100%' }}>
          Reveal All
        </button>
      )}

      {revealed.length === 3 && (
        <button onClick={handleComplete} style={{ width: '100%' }}>Get Reading</button>
      )}
    </div>
  )
}
