export interface Diagram {
  id: string
  user_id: string
  content: string
  title: string
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface DiagramResponse {
  byId: { [id: string]: Diagram }
  allIds: string[]
}
