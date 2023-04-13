// getPrices.js
//
// Fetch APIStatus and prices from internal API

import { ref } from 'vue'
import { api } from 'boot/axios'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'

// const storeAPIStatus = useStoreAPIStatus()

function tidyNumber(x) {
  if (x) {
    const parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  } else {
    return null
  }
}

export function getAPIStatus() {
  // Returns the api status or an error
  const apiStatus = ref(null)
  const apiError = ref(null)
  const statusDisp = ref('⚡️')

  const onDownload = async () => {
    console.log('api status fetching from '+ api.defaults.baseURL)
    try {
      const res = await api.get('', {
        params: { get_crypto: true },
      })
      console.log(res.data)
      apiStatus.value = res.data
      if (apiStatus.value.message != 'alive') {
        throw new Error('Server is not alive')
      }
      statusDisp.value = '🟢'
      apiStatus.value.crypto = prettyPrices(apiStatus.value.crypto)
      // storeAPIStatus.apiStatus = apiStatus.value
      console.log(statusDisp.value)
    } catch (err) {
      console.log(err.message)
      apiError.value = err
      statusDisp.value = '🟥'
      // storeAPIStatus.apiStatus = null
      // storeAPIStatus.apiError = err
      console.log(statusDisp.value)
    }
  }
  onDownload()
  return { apiStatus, apiError, statusDisp }
}

function prettyPrices(prices) {
  //
  const bitcoin = tidyNumber(prices.bitcoin.usd.toFixed(0))
  const hive = tidyNumber(prices.hive.usd.toFixed(2))
  const hbd = tidyNumber(prices.hive_dollar.usd.toFixed(2))
  prices.fmt = {
    bitcoin: bitcoin,
    hive: hive,
    hbd: hbd,
  }
  return prices
}
