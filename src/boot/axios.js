// src/boot/axios.js

import { boot } from 'quasar/wrappers'
import axios from 'axios'

// let URL = 'https://devapi.v4v.app/v1'
let URL = 'https://api.v4v.app/v1'
// api = axios.create({ baseURL: 'https://api.v4v.app/v1' })
function checkLocal() {
  if (window.location.hostname === 'localhost') {
    console.log('searching for local API server')
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://0.0.0.0:1818/v1', false) // make synchronous request
    xhr.send()
    if (xhr.readyState === 4) {
      // request completed
      if (xhr.status === 200) {
        console.log('Local API server found')
        URL = 'http://0.0.0.0:1818/v1'
      } else {
        console.log('Local API server not found')
      }
    }
  }
}


checkLocal()
const apiURL = URL
console.log('Base URL set: ' + URL)
const api = axios.create({ baseURL: URL })

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  app.config.globalProperties.$apiURL = apiURL
})

export { axios, api, apiURL }
