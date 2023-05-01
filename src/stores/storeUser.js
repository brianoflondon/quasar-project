import { defineStore } from 'pinia'
import 'src/assets/hive-tx.min.js'
import { useHiveProfile, useHiveAvatarURL } from 'src/use/useHive.js'
import HAS from 'hive-auth-wrapper'
import QRCodeStyling from 'qr-code-styling'

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

export const useStoreUser = defineStore('storeUser', {
  state: () => ({
    isLoggedIn: false,
    hiveAccname: '',
    hiveProfile: null,
    keySelected: '',
    users: [],
  }),

  getters: {
    profileImageUrl: (state) => {
      return useHiveAvatarURL({ hiveAccname: state.hiveAccname })
    },
    profileImageUrlAlby: (state) => {
      return useHiveAvatarURL({
        hiveAccname: state.hiveAccname,
        reason: 'alby',
      })
    },
  },

  actions: {
    async login(hiveAccname, keySelected) {
      const newUser = new HiveUser(hiveAccname, keySelected)
      this.users = this.users.filter(
        (obj) => obj.hiveAccname !== this.hiveAccname
      )
      this.users.push(newUser)
      this.isLoggedIn = true
      this.hiveAccname = hiveAccname
      this.keySelected = keySelected
      try {
        this.hiveProfile = await useHiveProfile(hiveAccname)
      } catch (err) {
        console.log(err)
        console.log('session save failed')
      }
    },
    async loginHAS(hiveAccname, keySelected) {
      const newUser = new HiveUser(hiveAccname, keySelected)
      console.log(hiveAccname, keySelected)
      this.hiveAccname = hiveAccname
      this.keySelected = keySelected
      const status = HAS.status()
      console.log(status)
      const APP_META = {
        name: 'V4VAPP',
        description: 'Value 4 Value Lightning Hive',
        icon: 'https://v4v.app/hivelightning-dark.png',
      }
      const auth = {
        username: this.hiveAccname,
        token: undefined,
        expire: undefined,
        key: this.keySelected,
      }
      const challenge_data = {
        key_type: this.keySelected,
        challenge: JSON.stringify({
          login: auth.username,
          ts: Date.now(),
        }),
      }
      res = await HAS.authenticate(
        auth,
        APP_META,
        challenge_data,
        this.processAuthWaitEvent
      )
      console.log(res)
    },
    processAuthWaitEvent(evt) {
      console.log('processAuthWaitEvent: ', evt)
      const authPayload = {
        account: this.hiveAccname,
        uuid: evt.uuid,
        key: evt.key,
        host: 'v4v.app',
      }
      const encoded = btoa(JSON.stringify(authPayload))
      const url = `has://auth_req/${encoded}`
      const qrCodeText = url
      const onScreen = url
      console.log(url)
      const hiveAvatar = useHiveAvatarURL({ hiveAccname: this.hiveAccname })
      console.log(hiveAvatar)
      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: 'svg',
        data: url,
        // image: hiveAvatar,
        dotsOptions: {
          color: '#4267b2',
          type: 'rounded',
        },
        backgroundOptions: {
          color: '#e9ebee',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 20,
        },
      })
      // qrCode.append(qrCodeContainer.value)
      console.log(qrCode)
    },

    logout() {
      console.log('logout')
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
        this.hiveProfile = await useHiveProfile(this.hiveAccname)
      }
      getAccounts()
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: [
          'users',
          'keySelected',
          'hiveAccname',
          'hiveProfile',
          'isLoggedIn',
        ],
      },
    ],
  },
})
