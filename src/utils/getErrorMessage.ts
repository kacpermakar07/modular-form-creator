import { ApiError } from '../api/ApiError'

function capitalize(message: string): string {
  return message.charAt(0).toUpperCase() + message.slice(1)
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return capitalize(error.message)
  }
  if (error instanceof Error) {
    return capitalize(error.message)
  }
  return 'Something went wrong. Please try again.'
}
