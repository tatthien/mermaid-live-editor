import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { messages } = req.body

  const systemMessages = [
    {
      role: 'system',
      content: `You are a system that parses natural languages to diagrams in PlantUML format. Only respond the valid PlantUML code that can be rendered without any syntax errors and short explanation. Respond using markdown.`,
    },
  ]

  const payload = {
    model: 'gpt-3.5-turbo-0301',
    messages: [...systemMessages, ...messages],
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 300,
    stream: false,
    temperature: 0.7,
  }

  try {
    const { data } = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
      },
    })
    const result = data?.choices?.[0]?.message?.content ?? '```ERROR```'
    res.status(200).json({
      id: data.id,
      result,
    })
  } catch (err: any) {
    res.status(err.response.status).json({ message: err.response.data.error.message })
  }
}
