import {Logo, LogosBySearchTermInput} from '../types/logo';
import {shuffleArray} from '../utils/shuffleArray';

export const fetchLogos = async (): Promise<Logo[]> => {
  const response = await fetch(`${process.env.API_URL}/logos`)
  if (!response.ok) throw new Error('Error fetching logos')
  const logos: Logo[] = await response.json()

  return logos.length ? shuffleArray(logos) : logos
}

export const fetchLogosBySearchTerm = async ({ difficulty, country }: LogosBySearchTermInput) => {
  const url = new URL(`${process.env.API_URL}/logosBy`)

  console.log('API URL', process.env.API_URL);

  if (difficulty) url.searchParams.append('difficulty', difficulty)
  if (country) url.searchParams.append('country', country)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error('Error fetching logos')
  const logos: Logo[] = await response.json()

  return logos.length ? shuffleArray(logos) : logos
}