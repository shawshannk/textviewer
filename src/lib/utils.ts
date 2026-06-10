import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combines clsx (conditional classes) with tailwind-merge (conflict resolution).
// "px-2 px-4" → "px-4" (last wins, correctly)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
