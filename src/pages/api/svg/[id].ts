import axios from 'axios'
import DOMPurify from 'dompurify'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const { data } = await axios.get(`http://www.plantuml.com/plantuml/svg/${id}`)
  res.status(200).json({ data })
}
