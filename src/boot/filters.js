import { boot } from 'quasar/wrappers'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.config.globalProperties.$filters = {
    formatDuration(value) {
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
    },
  }
})
