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