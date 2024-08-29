export interface Logo {
  id: number;
  name: string;
  imageKey: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
}

export const getLogosFromBackend = async (difficulty: 'easy' | 'medium' | 'hard') => {
  try {
    const response = await fetch(`${process.env.LOGO_API_URL}`)
    const logos: Logo[] = await response.json()

    //TODO this should be done on the backend
    const filteredLogos = logos.filter(logo => logo.difficulty === difficulty)

    return shuffleArray(filteredLogos)
  } catch (error) {
    console.error('Error fetching logos:', error);
    return []
  }
}

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5)
}