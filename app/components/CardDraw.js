'use client'
import { useState } from 'react'
import { TAROT_CARDS, CARD_LOOKS } from '../../lib/cards'

export default function CardDraw({ onComplete }) {
  const [cards, setCards] = useState([])
  const [revealed, setRevealed] = useState([])
  const [context, setContext] = useState('')
  const [flipping, setFlipping] = useState([])

  const drawCards = () => {
    const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5)
    const drawn = shuffled.slice(0, 3).map((card, i) => ({
      ...card,
      look: CARD_LOOKS[Math.floor(Math.random() * CARD_LOOKS.length)],
      position: ['Past', 'Present', 'Future'][i]
    }))
    setCards(drawn)
    setRevealed([])
    setFlipping([])
  }

  const revealCard = (i) => {
    if (!revealed.includes(i) && !flipping.includes(i)) {
      setFlipping([...flipping, i])
      setTimeout(() => {
        setRevealed([...revealed, i])
        setFlipping(flipping.filter(f => f !== i))
      }, 300)
    }
  }

  const revealAll = () => {
    const unrevealed = [0, 1, 2].filter(i => !revealed.includes(i))
    unrevealed.forEach((i, index) => {
      setTimeout(() => {
        setFlipping([...flipping, i])
        setTimeout(() => {
          setRevealed(prev => [...prev, i])
          setFlipping(prev => prev.filter(f => f !== i))
        }, 300)
      }, index * 400)
    })
  }

  const handleComplete = () => {
    onComplete({ cards, context })
  }

  const getCardImagePath = (cardName) => {
    return `/cards/${cardName.toLowerCase().replace(/\s+/g, '-')}.svg`
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
              perspective: '1000px',
              marginBottom: '1rem',
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '167%',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: revealed.includes(i) || flipping.includes(i) ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}>
                {/* Card back */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  borderRadius: '16px',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                }}>
                  <img 
                    src="/cards/card-back.svg"
                    alt="Card back"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                      display: 'block',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Card front */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '16px',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  boxShadow: revealed.includes(i) 
                    ? '0 8px 30px rgba(212, 175, 55, 0.3)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.3)',
                }}>
                  <img 
                    src={getCardImagePath(card.name)}
                    alt={card.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                      display: 'block',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>

              {revealed.includes(i) && (
                <div style={{ 
                  marginTop: '0.75rem',
                  fontSize: '12px', 
                  opacity: 0.7,
                  color: '#c9c9d8',
                  fontStyle: 'italic'
                }}>
                  {card.look}
                </div>
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
        <button onClick={revealAll} style={{ marginBottom: '1rem', width: '100%' }}>
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
