import { format, parseISO } from 'date-fns'

export function formatDate(isoString: string): string {
  try {
    return format(parseISO(isoString), 'MMM d, yyyy')
  } catch {
    return isoString
  }
}

export function formatVolume(kg: number): string {
  return `${kg.toLocaleString()} kg`
}

export function formatWeight(kg: number): string {
  return `${kg} kg`
}

export function formatShortDate(isoString: string): string {
  try {
    return format(parseISO(isoString), 'MMM d')
  } catch {
    return isoString
  }
}
