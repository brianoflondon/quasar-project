// src/boot/axios.js

import { boot } from 'quasar/wrappers'
import axios from 'axios'

// let URL = 'https://devapi.v4v.app/v1'
let URL = 'https://api.v4v.app/v1'


// api = axios.create({ baseURL: 'https://api.v4v.app/v1' })
if (window.location.hostname === 'localhost') {
  try {
    res = axios.get('http://0.0.0.0:1818/v1', {timeout: 500})
    if (res.status === 200) URL = 'http://0.0.0.0:1818/v1'
  } catch (err) { console.log('local api not found')}
  URL = URL
}
console.log('Base URL set: ' + URL)
const api = axios.create({ baseURL: URL })

const apiURL = URL

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
