import { boot } from 'quasar/wrappers'
import HAS from 'hive-auth-wrapper'

export default boot(({ app }) => {
  app.config.globalProperties.$HAS = HAS
})

export { HAS }
