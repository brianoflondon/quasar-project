import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { KeychainSDK } from 'keychain-sdk'

const keychain = new KeychainSDK(window)

export const useStoreAPIStatus = defineStore('storeAPIStatus', {
  state: () => ({
    // count: 0, // for testing
    fetchTimestamp: null,
    apiStatus: null,
    apiError: null,
    statusDisp: '⚡️',
    isKeychainIn: false,
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
    hiveSats: (state) => {
      if (!state.apiStatus) return '💰💰💰'
      return tidyNumber(
        (state.apiStatus.crypto.hive.btc * 100000000).toFixed(0)
      )
    },
    hiveHBDNumber: (state) => {
      return state.apiStatus
        ? state.apiStatus.crypto.v4vapp.Hive_HBD.toFixed(5)
        : null
    },
    hiveSatsNumber: (state) => {
      return state.apiStatus
        ? state.apiStatus.crypto.hive.btc * 100000000
        : null
    },
    hiveBTCNumber: (state) => {
      return state.apiStatus ? state.apiStatus.crypto.hive.btc : null
    },
    prices: (state) => {
      return state.apiStatus ? state.apiStatus.crypto : 'fetching prices'
    },
    /**
     * @returns {string}
     */
    textBar() {
      // autocompletion ✨
      return `Bitcoin <strong>${this.bitcoin}<strong> ▪️ Hive <strong>${this.hive}<strong> ▪️ HBD<strong>${this.hbd}<strong> ▪️ ${this.statusDisp}`
    },
  },

  actions: {
    update() {
      const onDownload = async () => {
        try {
          const res = await api.get('', {
            params: { get_crypto: true },
          })
          // this.count++
          // if (this.count % 3 === 0) {
          //   throw new Error('Api failed')
          // }
          this.fetchTimestamp = Date.now()
          this.apiStatus = res.data
          this.apiError = null
          this.apiStatus.crypto = prettyPrices(this.apiStatus.crypto)
          this.statusDisp = '🟢'
        } catch (err) {
          let age = (Date.now() - this.fetchTimestamp) / 1000
          if (age > 5 && this.apiStatus) {
            this.apiStatus = null
          }
          this.apiError = err
          this.statusDisp = '🟥'
        }
      }
      const checkKeychain = async () => {
        try {
          this.isKeychainIn = await keychain.isKeychainInstalled()
          if (!this.isKeychainIn) {
            console.log('Keychain is not installed')
          }
        } catch (error) {
          console.log({ error })
        }
      }
      onDownload()
      checkKeychain()
    },
  },
  persist: {
    enabled: true,
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
