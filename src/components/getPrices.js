// getPrices.js
//
// Fetch APIStatus and prices from internal API

import { ref } from 'vue'
import { api } from 'boot/axios'

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
      apiStatus.value.crypto = prettyPrices(apiStatus.value.crypto)
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
