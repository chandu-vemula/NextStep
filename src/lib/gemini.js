// AI Service - Using Groq's free API (generous free tier: 14,400 requests/day)
// Get your free API key at: https://console.groq.com/keys

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const CAREER_SYSTEM_PROMPT = `You are NextStep AI, an expert career counselor and coach. Your role is to provide personalized career guidance, help users explore career paths, identify skill gaps, and offer actionable advice.

Key responsibilities:
1. Help users discover suitable career paths based on their skills, interests, and goals
2. Provide insights on industry trends and job market demands
3. Suggest specific skills to develop and learning resources
4. Offer resume and interview tips
5. Guide users on networking and professional development
6. Be encouraging but realistic about career transitions

Guidelines:
- Ask clarifying questions to understand the user's background and goals
- Provide specific, actionable advice rather than generic suggestions
- Consider the user's experience level and current situation
- Mention specific job titles, skills, and technologies when relevant
- Be supportive and motivating while being honest about challenges
- Keep responses concise but comprehensive (2-4 paragraphs typically)
- Use bullet points for lists of skills, steps, or recommendations

Remember: You're a career expert helping real people make important life decisions. Be thoughtful and personalized in your responses.`

export async function sendMessage(messages) {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key is not configured. Get a free key at https://console.groq.com/keys')
  }

  const url = 'https://api.groq.com/openai/v1/chat/completions'

  // Format messages for OpenAI-compatible API
  const formattedMessages = [
    { role: 'system', content: CAREER_SYSTEM_PROMPT },
    ...messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ]

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Free, fast, high quality
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to get response from AI')
    }

    const data = await response.json()

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated')
    }

    const text = data.choices[0].message?.content

    if (!text) {
      throw new Error('Empty response from AI')
    }

    return text
  } catch (error) {
    console.error('AI API error:', error)
    throw error
  }
}
