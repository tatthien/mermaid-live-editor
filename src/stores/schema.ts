import { schema } from 'normalizr'

export const diagram = new schema.Entity('diagrams')

export const diagramArr = new schema.Array(diagram)
