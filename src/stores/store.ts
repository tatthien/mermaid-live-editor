import { configureStore } from '@reduxjs/toolkit'

import diagramReducer from './diagrams'

export default configureStore({
  reducer: {
    diagrams: diagramReducer,
  },
})
