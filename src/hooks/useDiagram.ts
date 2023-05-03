import { Diagram } from '@/types'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'

export function useDiagram(id: string) {
  const { data, error, isLoading } = useSWR(`/api/diagrams/${id}`, fetcher)

  return {
    diagram: data,
    isLoading,
    isError: error,
  }
}

export async function update(item: Partial<Diagram>) {
  const res = await fetch(`/api/diagrams/${item.id}`, {
    method: 'PATCH',
    body: JSON.stringify(item),
  })
  if (!res.ok) {
    return item
  }
  return res.json()
}
