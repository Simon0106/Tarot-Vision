'use client'
import { useState } from 'react'

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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem' }}>Your Reading</h2>
      
      <div style={{ whiteSpace: 'pre-line', lineHeight: '1.7', marginBottom: '1.5rem' }}>
        {reading}
      </div>

      {followUps.map((fu, i) => (
        <div key={i} style={{ background: '#2a2a3e', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '0.5rem' }}>
            You: {fu.question}
          </div>
          <div style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.6' }}>
            {fu.answer}
          </div>
        </div>
      ))}

      {followUps.length < 3 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '0.5rem' }}>
            {3 - followUps.length} follow-up {3 - followUps.length === 1 ? 'message' : 'messages'} remaining
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            style={{ minHeight: '60px', marginBottom: '0.5rem' }}
          />
          <button onClick={sendFollowUp} disabled={!input.trim() || loading} style={{ width: '100%' }}>
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      )}

      <button onClick={onDrawAgain} style={{ width: '100%', marginTop: '1rem' }}>
        Draw Again (£1.99)
      </button>
    </div>
  )
}
