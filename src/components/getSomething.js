// getSomething.js
import { ref } from 'vue'
import { api } from 'boot/axios'

export async function getSomething() {
  return 'something'
}

// https://www.vuemastery.com/blog/coding-better-composables-5-of-5/
// https://stackoverflow.com/questions/71664934/async-await-not-working-in-composable-function-vue-3


export function getAPI() {
  // Returns the api status or an error
  const apiStatus = ref(null)
  const apiError = ref(null)
  const statusDisp = ref('⚡️')
  console.log('api status fetching')
  const onDownload = async () => {
    try {
      const res = await api.get('', {
        params: { get_crypto: true },
      })
      apiStatus.value = res.data
      if (apiStatus.value.message != 'alive') {
        throw new Error('Server is not alive')
      }
      statusDisp.value = '🟢'
      console.log(statusDisp.value)
    } catch (err) {
      console.log(err.message)
      apiError.value = err
      statusDisp.value = '🟥'
      console.log(statusDisp.value)
    }
  }
  onDownload()
  return { apiStatus, apiError, statusDisp }

}
