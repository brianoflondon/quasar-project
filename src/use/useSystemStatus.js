import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
import { useI18n } from 'vue-i18n'

// import { useQuasar } from 'quasar'

const storeAPIStatus = useStoreAPIStatus()
// const $q = useQuasar()

const longMessage = useI18n().t('system_status_intro')
// const longMessage = 'system_status_intro'

export function systemStatus() {
  systemStatus = `
  ${storeAPIStatus.textBar}
  ${longMessage}`
  return systemStatus
}
