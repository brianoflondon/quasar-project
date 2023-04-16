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
    hiveProfile: null,
    keySelected: '',
    users: [],
  }),

  getters: {
    profileImageUrl: (state) => {
      if (!state.hiveProfile) return null
      return `https://api.v4v.app/v1/hive/avatar/${state.hiveAccname}`
    }
  },

  actions: {
    login(hiveAccname, keySelected) {
      const newUser = new HiveUser(hiveAccname, keySelected)
      this.users = this.users.filter(
        (obj) => obj.hiveAccname !== this.hiveAccname
      )
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
        this.getHiveProfile()
      } catch (err) {
        console.log(err)
        console.log('session save failed')
      }
    },
    logout() {
      console.log('logout')
      this.users = this.users.filter(
        (obj) => obj.hiveAccname !== this.hiveAccname
      )
      this.isLoggedIn = false
      this.hiveAccname = ''
      this.keySelected = ''
      this.hiveProfile = null
      SessionStorage.set('isLoggedIn', this.isLoggedIn)
      SessionStorage.set('hiveAccname', this.hiveAccname)
      SessionStorage.set('keySelected', this.keySelected)
    },
    getHiveProfile() {
      const getAccounts = async () => {
        try {
          const res = await hiveTx.call('condenser_api.get_accounts', [
            [this.hiveAccname],
          ])
          const postingJsonMetadat = JSON.parse(res.result[0].posting_json_metadata)
          this.hiveProfile = postingJsonMetadat.profile
          console.log(this.hiveProfile)
        } catch (err) {
          console.log(err)
        }
      }
      getAccounts()
    },
  },
})
