// getPrices.js
//
// Fetch prices from internal API

import { ref } from 'vue'
import { api } from 'boot/axios'

const prices = ref('loading')

function tidyNumber(x) {
  if (x) {
    const parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  } else {
    return null
  }
}


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


async function getPrices() {
  try {
    const res = await api.get('/cryptoprices/')
    prices.value = res.data
    console.log(prices.value)
    bitcoin.value = tidyNumber(prices.value.bitcoin.usd.toFixed(0))
    hive.value = tidyNumber(prices.value.hive.usd.toFixed(2))
    hbd.value = tidyNumber(prices.value.hive_dollar.usd.toFixed(2))
    prices.value.fmt = {
      bitcoin: bitcoin.value,
      hive: hive.value,
      hbd: hbd.value,
    }
    return prices
  } catch (err) {
    console.error(err)
  }
}
