import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
})

export const api = createApi({
  reducerPath: 'splitApi',
  baseQuery,
  tagTypes: ['Diagrams'],
  endpoints: () => ({}),
})
