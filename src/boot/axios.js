// src/boot/axios.js

import { boot } from 'quasar/wrappers'
import axios from 'axios'

let api = ''
api = axios.create({ baseURL: 'https://api.v4v.app/v1' })
// if (window.location.hostname === 'localhost') {
//   console.log('Base URL set: http://0.0.0.0:1818/v1')
//   api = axios.create({ baseURL: 'http://0.0.0.0:1818/v1' })
// } else {
//   console.log('Base URL set: https://api.v4v.app/v1')
//   api = axios.create({ baseURL: 'https://api.v4v.app/v1' })
// }

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
