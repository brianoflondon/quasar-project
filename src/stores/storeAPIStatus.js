import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useStoreAPIStatus = defineStore('storeAPIStatus', {
  state: () => ({
    count: 0,
    fetchTimestamp: null,
    apiStatus: null,
    apiError: null,
    statusDisp: '⚡️',
  }),

  getters: {
    bitcoin: (state) => {
      return state.apiStatus ? state.apiStatus.crypto.fmt.bitcoin : '💰💰💰'
    },
    hive: (state) => {
      return state.apiStatus ? state.apiStatus.crypto.fmt.hive : '💰💰'
    },
    hbd: (state) => {
      return state.apiStatus ? state.apiStatus.crypto.fmt.hbd : '💰💰'
    },
    prices: (state) => {
      return state.apiStatus ? state.apiStatus.crypto : 'fetching prices'
    },
  },

  actions: {
    update() {
      const onDownload = async () => {
        try {
          const res = await api.get('', {
            params: { get_crypto: true },
          })
          this.count++
          if (this.count % 3 === 0) {
            throw new Error('Api failed')
          }
          this.fetchTimestamp = Date.now()
          this.apiStatus = res.data
          this.apiError = null
          this.apiStatus.crypto = prettyPrices(this.apiStatus.crypto)
          this.statusDisp = '🟢'
        } catch (err) {
          let age = (Date.now() - this.fetchTimestamp) / 1000
          console.log('api call age', age)
          if (age > 5 && this.apiStatus) {
            this.apiStatus = null
          }
          this.apiError = err
          this.statusDisp = '🟥'
        }
      }
      onDownload()
    },
  },
})

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

function tidyNumber(x) {
  if (x) {
    const parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  } else {
    return null
  }
}
