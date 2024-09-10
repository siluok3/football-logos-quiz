import {useMutation} from '@tanstack/react-query';
import {GameCompletionMessage} from '../types/game';
import {sendGameCompletion} from '../services/gameService';

export const useSendGameCompletion = () => {
  return useMutation<void, Error, GameCompletionMessage>({
    mutationFn: (message: GameCompletionMessage) => sendGameCompletion(message)
  })
}