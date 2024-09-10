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

export interface LogosBySearchTermInput {
  difficulty?: string
  country?: string //TODO create a type of available countries
}