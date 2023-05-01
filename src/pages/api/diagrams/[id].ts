import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })
  const { error } = await supabase.auth.getUser()

  if (error) {
    res.status(401).json({ msg: 'Unauthorized' })
    return
  }

  if (req.method === 'GET') {
    const { id } = req.query
    const { data, error } = await supabase.from('diagrams').select('*,shares(*)').eq('id', id).single()
    if (error) {
      res.status(400).json(error)
      return
    }
    res.json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    const { error } = await supabase.from('diagrams').delete().eq('id', id)
    if (error) {
      res.status(422).json({ error })
      return
    }
    res.json({ id })
  }

  if (req.method === 'PATCH') {
    const { id } = req.query
    const { data, error } = await supabase
      .from('diagrams')
      .update({ ...req.body })
      .eq('id', id)
      .select('*,shares(*)')
      .single()
    if (error) {
      res.status(422).json(error)
      return
    }
    res.json(data)
  }
}
