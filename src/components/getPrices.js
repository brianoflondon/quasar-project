// getPrices.js
//
// Fetch prices from internal API

import { ref } from 'vue'

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
