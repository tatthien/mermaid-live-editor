import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient(
    String(process.env.NEXT_PUBLIC_SP_PROJECT_URL),
    String(process.env.NEXT_PUBLIC_SP_ANON_KEY)
  )

  if (req.method === 'POST') {
    const body = JSON.parse(req.body)

    if (body.content === '') {
      res.status(422).end()
      return
    }

    const { data: shareData } = await client.from('shares').select().eq('diagram_id', body.id)
    if (shareData && shareData.length) {
      res.status(204).end()
      return
    }

    const { data, error } = await client
      .from('shares')
      .insert({
        share_id: random(10),
        content: body.content,
        diagram_id: body.id,
        user_id: body.user_id,
      })
      .select('share_id')

    if (error) {
      res.status(422).json({ ...error })
      return
    }

    res.status(200).json({
      id: data[0].share_id,
    })
  }
}

function random(len: number): string {
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < len; i++) {
    result += c[Math.floor(Math.random() * c.length)]
  }
  return result
}
