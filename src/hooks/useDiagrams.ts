import { Diagram } from '@/types'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'

export function useDiagrams() {
  const { data, mutate, error, isLoading } = useSWR<Diagram[]>(`/api/diagrams`, fetcher)

  return {
    diagrams: data,
    isError: error,
    isLoading,
    mutate,
  }
}
