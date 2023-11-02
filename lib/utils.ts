import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPluralString(num: number, str: string) {
  return num > 1 ? `${str}s` : str
}

export function getTimestamp(createdAt: string) {
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * month

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const now = new Date()
  const createdDate = new Date(createdAt)
  const createdDay = createdDate.getDate()
  const createdMonth = createdDate.getMonth()
  const createdYear = createdDate.getFullYear()
  const timeDifferent = now.getTime() - createdDate.getTime()

  if (timeDifferent < minute) {
    return "less a minute"
  } else if (timeDifferent < hour) {
    const minutes = createdDate.getMinutes()
    return `${minutes} ${getPluralString(minutes, "minute")} ago`
  } else if (timeDifferent > hour && timeDifferent < day) {
    const hours = createdDate.getHours()
    return `${hours} ${getPluralString(hours, "hour")} ago`
  } else if (timeDifferent > day && timeDifferent < week) {
    return `${createdDay} ${getPluralString(createdDay, "day")} ago`
  } else if (timeDifferent > week && timeDifferent < month) {
    const currentWeek = Math.ceil(createdDay / 7)
    return `${currentWeek} ${getPluralString(currentWeek, "week")} ago`
  } else if (timeDifferent > month && timeDifferent < year) {
    return `${months[createdMonth]} ${createdDay}`
  } else {
    return `${createdDay} ${months[createdMonth]} ${createdYear}`
  }

}

export function getFormatNumber(num: number) {
  const thousand = 1000
  const million = 10 ** 6
  const billion = 10 ** 12

  if (num < 1000) {
    return num
  } else if (num >= thousand && num < million) {
    const divide = Number.isInteger(num) ? num / thousand : (num / thousand).toFixed(1)
    return `${divide}k`
  } else if (num >= million && num < billion) {
    const divide = Number.isInteger(num) ? num / million : (num / million).toFixed(1)
    return `${divide}m`
  } else {
    const divide = Number.isInteger(num) ? num / billion : (num / billion).toFixed(1)
    return `${divide}b`
  }
}