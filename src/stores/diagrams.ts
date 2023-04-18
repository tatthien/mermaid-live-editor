import { createSlice } from '@reduxjs/toolkit'

const diagramSlice = createSlice({
  name: 'diagrams',
  initialState: {
    byId: {},
    allIds: [],
    selectedId: '',
  },
  reducers: {
    setDiagramById: (state: any, action) => {
      state.byId = { ...action.payload }
    },
    setDiagramAllIds: (state: any, action) => {
      state.allIds = [...action.payload]
    },
    addDiagram: (state: any, action) => {
      state.byId = {
        [action.payload.id]: action.payload,
        ...state.byId,
      }
      state.allIds = [action.payload.id, ...state.allIds]
    },
    editDiagram: (state: any, action) => {
      state.byId = {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          ...action.payload,
        },
      }
    },
    deleteDiagram: (state: any, action) => {
      const newDiagrams = { ...state.byId }
      delete newDiagrams[action.payload.id]
      state.byId = {
        ...newDiagrams,
      }
      state.allIds = state.allIds.filter((id: string) => id !== action.payload.id)
    },
    setSelectedDiagramId: (state, action) => {
      state.selectedId = action.payload
    },
  },
})

export const {
  setDiagramById,
  setDiagramAllIds,
  addDiagram,
  editDiagram,
  deleteDiagram,
  setSelectedDiagramId,
} = diagramSlice.actions

export default diagramSlice.reducer
