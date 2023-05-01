import { diagramArr } from '@/stores/schema'
import { Diagram, DiagramResponse } from '@/types'
import { normalize } from 'normalizr'

import { api } from './api'

export const diagramApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDiagrams: builder.query<DiagramResponse, void>({
      query: () => '/diagrams',
      providesTags: (result) => {
        return result
          ? [
              ...result.allIds.map((id) => ({ type: 'Diagrams' as const, id })),
              { type: 'Diagrams', id: 'LIST' },
            ]
          : [{ type: 'Diagrams', id: 'LIST' }]
      },
      transformResponse: (data) => {
        const { entities, result } = normalize<Diagram>(data, diagramArr)
        return {
          byId: entities.diagrams,
          allIds: result,
        } as DiagramResponse
      },
    }),
    getDiagram: builder.query<Diagram, string>({
      query: (id) => `/diagrams/${id}`,
      transformResponse: (data) => {
        return data
      },
      providesTags: (result, error, id) => [{ type: 'Diagrams', id }],
    }),
    createDiagram: builder.mutation<Diagram, Partial<Diagram>>({
      query() {
        return {
          url: `/diagrams`,
          method: 'POST',
        }
      },
      invalidatesTags: [{ type: 'Diagrams', id: 'LIST' }],
    }),
    updateDiagram: builder.mutation<Diagram, Partial<Diagram>>({
      query(data) {
        const { id, ...body } = data
        return {
          url: `/diagrams/${id}`,
          method: 'PATCH',
          body,
        }
      },
      async onQueryStarted({ id, title, content }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          diagramApi.util.updateQueryData('getDiagrams', undefined, (draft) => {
            const diagram = draft.byId[String(id)]
            if (diagram) {
              diagram.content = content ?? diagram.content
              diagram.title = title ?? diagram.title
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
    deleteDiagram: builder.mutation<{ id: string }, string>({
      query(id) {
        return {
          url: `/diagrams/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: () => [{ type: 'Diagrams', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetDiagramsQuery,
  useGetDiagramQuery,
  useCreateDiagramMutation,
  useUpdateDiagramMutation,
  useDeleteDiagramMutation,
} = diagramApi
