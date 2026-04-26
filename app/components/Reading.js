'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Reading({ cards, reading, onDrawAgain }) {
  const [followUps, setFollowUps] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendFollowUp = async () => {
    if (!input.trim() || followUps.length >= 3) return
    
    setLoading(true)
    const res = await fetch('/api/generate-reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        cards, 
        context: input,
        isFollowUp: true 
      })
    })
    
    const data = await res.json()
    setFollowUps([...followUps, { question: input, answer: data.reading }])
    setInput('')
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '28px', 
        fontWeight: '500', 
        marginBottom: '2rem',
        textAlign: 'center',
        fontFamily: 'Cinzel, serif'
      }}>
        ✨ Your Reading
      </h2>
      
      <div style={{ 
        lineHeight: '1.8', 
        marginBottom: '2.5rem',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        fontSize: '15px'
      }}>
        <ReactMarkdown>{reading}</ReactMarkdown>
      </div>

      {followUps.map((fu, i) => (
        <div key={i} style={{ 
          background: 'linear-gradient(135deg, rgba(106, 76, 147, 0.15) 0%, rgba(139, 95, 176, 0.15) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '12px', 
          padding: '1.5rem', 
          marginBottom: '1.5rem' 
        }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '0.75rem',
            color: '#d4af37',
            fontFamily: 'Cinzel, serif'
          }}>
            You asked: {fu.question}
          </div>
          <div style={{ 
            fontSize: '14px', 
            opacity: 0.95, 
            lineHeight: '1.7'
          }}>
            <ReactMarkdown>{fu.answer}</ReactMarkdown>
          </div>
        </div>
      ))}

      {followUps.length < 3 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '13px', 
            opacity: 0.6, 
            marginBottom: '0.75rem',
            fontStyle: 'italic'
          }}>
            {3 - followUps.length} follow-up {3 - followUps.length === 1 ? 'question' : 'questions'} remaining
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            style={{ minHeight: '80px', marginBottom: '0.75rem', fontSize: '14px' }}
          />
          <button onClick={sendFollowUp} disabled={!input.trim() || loading} style={{ width: '100%' }}>
            {loading ? '🔮 Consulting the cards...' : '💫 Ask Question'}
          </button>
        </div>
      )}

      <button onClick={onDrawAgain} style={{ width: '100%', marginTop: '1.5rem', fontSize: '16px' }}>
        🎴 Draw Again (£1.99)
      </button>
    </div>
  )
}
