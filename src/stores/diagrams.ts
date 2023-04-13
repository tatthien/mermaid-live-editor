import { createSlice } from '@reduxjs/toolkit'

const diagramSlice = createSlice({
  name: 'diagrams',
  initialState: {
    data: [],
    item: null,
  },
  reducers: {
    fetchDiagram: (state: any, action) => {
      state.data = [...action.payload]
    },
    addDiagram: (state: any, action) => {
      state.data.unshift(action.payload)
    },
    setDiagramItem: (state, action) => {
      state.item = { ...action.payload }
    },
  },
})

export const { fetchDiagram, addDiagram, setDiagramItem } = diagramSlice.actions

export default diagramSlice.reducer
