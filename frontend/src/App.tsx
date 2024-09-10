import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import AppNavigator from './navigation/AppNavigator'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  )
}
