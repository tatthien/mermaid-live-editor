import { createSlice } from '@reduxjs/toolkit'

const diagramSlice = createSlice({
  name: 'diagrams',
  initialState: {
    diagrams: {},
    selectedDiagramId: '',
  },
  reducers: {
    fetchDiagram: (state: any, action) => {
      state.diagrams = { ...action.payload }
    },
    addDiagram: (state: any, action) => {
      state.diagrams = {
        [action.payload.id]: action.payload,
        ...state.diagrams,
      }
    },
    editDiagram: (state: any, action) => {
      state.diagrams = {
        ...state.diagrams,
        [action.payload.id]: action.payload,
      }
    },
    setSelectedDiagramId: (state, action) => {
      state.selectedDiagramId = action.payload
    },
  },
})

export const { fetchDiagram, addDiagram, editDiagram, setSelectedDiagramId } = diagramSlice.actions

export default diagramSlice.reducer
