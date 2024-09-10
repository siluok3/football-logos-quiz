export interface Logo {
  id: number;
  name: string;
  imageKey: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  enabled : boolean;
  league: string;
  country: string;
  division: number;
}

export type AvailableCountries = 'England' | 'Spain' | 'Italy' | ''

export interface LogosBySearchTermInput {
  difficulty?: string
  country?: AvailableCountries
}