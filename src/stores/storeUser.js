import { defineStore } from 'pinia'
import { LocalStorage, SessionStorage } from 'quasar'

// Declaration
class HiveUser {
  constructor(hiveAccname, keySelected) {
    this.hiveAccname = hiveAccname
    this.keySelected = keySelected
    this.timestamp = Date.now()
  }
}



export const useStoreUser = defineStore('storeUser', {
  state: () => ({
    isLoggedIn: false,
    hiveAccname: 'hivehydra',
    keySelected: '',
    users: []
  }),

  actions: {
    login(hiveAccname, keySelected) {
      const newUser = new HiveUser(hiveAccname, keySelected)
      this.users.push(newUser)
      this.isLoggedIn = true
      this.hiveAccname = hiveAccname
      this.keySelected = keySelected
      try {
        SessionStorage.set('users', this.users)
        SessionStorage.set('isLoggedIn', this.isLoggedIn)
        SessionStorage.set('hiveAccname', this.hiveAccname)
        SessionStorage.set('keySelected', this.keySelected)
        console.log('session saved')
      } catch (err) {
        console.log(err)
        console.log('session save failed')
      }
    },
    logout() {
      this.isLoggedIn = false
      this.hiveAccname = ''
      this.keySelected = ''
      SessionStorage.set('isLoggedIn', this.isLoggedIn)
      SessionStorage.set('hiveAccname', this.hiveAccname)
      SessionStorage.set('keySelected', this.keySelected)
    },
  },
})
