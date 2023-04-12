import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const { data } = await axios.get(`http://www.plantuml.com/plantuml/png/${id}`, {
    responseType: 'arraybuffer',
  })
  res.setHeader('Content-Type', 'image/png')
  res.send(data)
}
