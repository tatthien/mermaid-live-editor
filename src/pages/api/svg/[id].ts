import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  try {
    const { data } = await axios.get(`http://www.plantuml.com/plantuml/svg/${id}`)
    res.setHeader('Cache-Control', 's-maxage=86400')
    res.status(200).json({ data })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
