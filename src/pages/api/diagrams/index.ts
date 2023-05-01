import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    res.status(401).json({ msg: 'Unauthorized' })
    return
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('diagrams')
      .insert({
        title: 'Untitled',
        content: `@startuml\nBob->Alice: Hello\n@enduml`,
        user_id: user?.id,
      })
      .select('*,shares(*)')
      .single()

    if (error) {
      res.status(422).json({ error })
      return
    }

    res.json(data)
    return
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*,shares(*)')
      .order('created_at', { ascending: false })
    if (error) {
      res.status(400).json({ error })
      return
    }
    res.json(data)
  }
}
