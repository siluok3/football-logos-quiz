import {useQuery} from '@tanstack/react-query'
import {Logo, LogosBySearchTermInput} from '../types/logo'
import {fetchLogosBySearchTerm} from '../services/logoService'

export const useLogosBySearchTerm = (searchTerm: LogosBySearchTermInput) => {
  return useQuery<Logo[], Error>({
    queryKey: ['logos', searchTerm],
    queryFn: () => fetchLogosBySearchTerm(searchTerm),
    staleTime: 1000 * 60 * 30,
    enabled: !!searchTerm
  })
}