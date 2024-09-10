import {useQuery} from '@tanstack/react-query'
import {Logo} from '../types/logo'
import {fetchLogos} from '../services/logoService'

export const useRandomLogos = () => {
  return useQuery<Logo[], Error>({
    queryKey: ['logos'],
    queryFn: fetchLogos,
    staleTime: 1000 * 60 * 30
  })
}