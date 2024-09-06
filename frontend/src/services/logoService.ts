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

export const getRandomLogos = async () => {
  try {
    const response = await fetch(`${process.env.LOGO_API_URL}`)
    const logos: Logo[] = await response.json()

    return logos.length ? shuffleArray(logos) : logos
  } catch (error) {
    console.error('Error fetching logos:', error);
    return []
  }
}

export const getLogosBySearchTerm = async ({ difficulty, country }: LogosBySearchTermInput) => {
  try {
    const url = new URL(`${process.env.LOGO_API_URL}/logosBy`)

    if (difficulty) url.searchParams.append('difficulty', difficulty)
    if (country) url.searchParams.append('country', country)

    const response = await fetch(url)
    const logos: Logo[] = await response.json()

    return logos.length ? shuffleArray(logos) : logos
  } catch (error) {
    console.error('Error fetching logos:', error);
    return []
  }
}

export const sendGameCompletionMessage = async () => {
  try {
    const response = await fetch(`${process.env.LOGO_API_URL}/sendGameCompletion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'dummyUser123',
        completionTime: new Date().toISOString(),
      }),
    })

    const data = await response.json()
    if (response.ok) {
      console.log('Game completion message sent:', data);
    } else {
      console.error('Failed to send game completion message:', data);
    }
  } catch (error) {
    console.error('Error sending game completion message:', error);
  }
}

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5)
}