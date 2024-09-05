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

export const getLogosFromBackend = async () => {
  try {
    const response = await fetch(`${process.env.LOGO_API_URL}`)
    const logos: Logo[] = await response.json()

    return shuffleArray(logos)
  } catch (error) {
    console.error('Error fetching logos:', error);
    return []
  }
}

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5)
}