import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { cards, context } = await request.json()
    
    const prompt = context 
      ? `Given the context: "${context}", provide a tarot reading for these cards: ${cards.map(c => `${c.position}: ${c.name}`).join(', ')}`
      : `Provide a tarot reading for these cards: ${cards.map(c => `${c.position}: ${c.name}`).join(', ')}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Anthropic API error:', data)
      return NextResponse.json({ error: data.error?.message || 'API error' }, { status: 500 })
    }
    
    const reading = data.content[0].text

    return NextResponse.json({ reading })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
