import {GameCompletionMessage} from '../types/game';

export const sendGameCompletion = async (message: GameCompletionMessage) => {
  const response = await fetch(`${process.env.API_URL}/sendGameCompletion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  })
  console.log('Game was completed for: ', message)

  if (!response.ok) throw new Error('Error sending game completion message')
}