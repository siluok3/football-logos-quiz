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
    const data: Logo[] = await response.json()

    const logos = data.map((item: any) => ({
      id: parseInt(item.id.N, 10),
      name: item.name.S,
      imageKey: item.imageKey.S,
      difficulty: item.difficulty.S,
      imageUrl: item.imageUrl,
    }));

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