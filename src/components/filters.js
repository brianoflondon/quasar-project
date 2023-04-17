import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function formatDuration(value) {
  const duration = dayjs.duration(value)
  let output = ''

  if (duration.days() > 0) {
    output += `${duration.days()}d `
  }

  if (duration.hours() > 0) {
    output += `${duration.hours()}h `
  }

  if (duration.minutes() > 0) {
    output += `${duration.minutes()}m `
  }

  if (duration.seconds() > 0) {
    output += `${duration.seconds()}s `
  }

  if (duration.milliseconds() > 0) {
    output += `${duration.milliseconds()}ms `
  }

  return output.trim()
}
