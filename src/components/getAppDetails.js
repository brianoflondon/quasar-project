// getAppDetails.js
import { name, version } from '../../package.json'
import { ref } from 'vue'

export function getAppDetails() {
  const appVersion = ref(version)
  const appName = ref(name)
  return { appName, appVersion }
}
