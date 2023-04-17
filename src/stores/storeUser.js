import { defineStore } from 'pinia'
// import { LocalStorage, SessionStorage } from 'quasar'

// Declaration
export class HiveUser {
  constructor(hiveAccname, keySelected, timestamp) {
    this.hiveAccname = hiveAccname
    this.keySelected = keySelected
    this.timestamp = timestamp || Date.now()
  }

  toJSON() {
    return {
      hiveAccname: this.hiveAccname,
      keySelected: this.keySelected,
      timestamp: this.timestamp,
    }
  }

  getLoginAge() {
    return Date.now() - this.timestamp
  }

  getAllData() {
    return {
      hiveAccname: this.hiveAccname,
      keySelected: this.keySelected,
      timestamp: this.timestamp,
      loginAge: this.getLoginAge(),
    }
  }
}

// bad idea
// const customStorageUsers = {
//   getItem(key) {
//     const value = localStorage.getItem(key)
//     if (value) {
//       console.log('key', key, 'value', value)
//       return value
//       const users = JSON.parse(JSON.parse(value)).users
//       const hiveUsers = users.map((user) => {
//         const { hiveAccname, keySelected, timestamp } = user
//         return new HiveUser(hiveAccname, keySelected, timestamp)
//       })
//       return hiveUsers
//       // return value
//     }
//     return undefined
//   },
//   setItem(key, value) {
//     localStorage.setItem(key, JSON.stringify(value))
//     console.log('key', key, 'value', value)
//   },
// }

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
    },
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
        this.getHiveProfile()
      } catch (err) {
        console.log(err)
        console.log('session save failed')
      }
    },
    logout() {
      console.log('logout')
      // this.users = this.users.filter(
      //   (obj) => obj.hiveAccname !== this.hiveAccname
      // )
      this.isLoggedIn = false
      this.hiveAccname = ''
      this.keySelected = ''
      this.hiveProfile = null
    },
    getUserList() {
      // loop through storeusers.users and return all data including the login age
      // converts user list back into user objects
      let answer = []
      console.log('length', this.users.length)
      console.log('users', this.users)
      for (let i = 0; i < this.users.length; i++) {
        let { hiveAccname, keySelected, timestamp } = this.users[i]
        const user = new HiveUser(hiveAccname, keySelected, timestamp)
        answer.push(user.getAllData())
      }
      return answer
    },
    getHiveProfile() {
      const getAccounts = async () => {
        try {
          const res = await hiveTx.call('condenser_api.get_accounts', [
            [this.hiveAccname],
          ])
          const postingJsonMetadat = JSON.parse(
            res.result[0].posting_json_metadata
          )
          this.hiveProfile = postingJsonMetadat.profile
        } catch (err) {
          console.log(err)
        }
      }
      getAccounts()
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['users'] }],
  },
})
