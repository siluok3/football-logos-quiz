export type Logo = {
  id: number;
  name: string;
  image: any;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl? : string;
}

// Fake logos
const logos: Logo[] = [
  { id: 1, name: 'Real Madrid', image: require('../../assets/logos/realmadrid.png'), difficulty: 'easy' },
  { id: 2, name: 'Barcelona', image: require('../../assets/logos/barcelona.png'), difficulty: 'easy' },
  { id: 3, name: 'Chelsea', image: require('../../assets/logos/chelsea.png'), difficulty: 'easy' },
];

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5)
}

export const getRandomLogos = (difficulty: 'easy' | 'medium' | 'hard'): Logo[] => {
  const filteredLogos = logos.filter(logo => logo.difficulty === difficulty);

  return shuffleArray(filteredLogos)
};