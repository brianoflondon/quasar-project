<template>
  <q-page>
    <div class="q-pa-lg">
      <div v-if="isLoggedIn">
        ✅ Logged In as {{ keychainParams.data.username }} with
        {{ keySelected }} Key
      </div>
      <div v-if="!isLoggedIn">▪️ Not Logged In</div>
      <q-input v-model="keychainParams.data.username" />
      <q-btn @click="login">Login</q-btn>
      <q-select v-model="keySelected" :options="keyOptions" label="Key" />
      <div v-if="keychainError">
        <div>❌ Error</div>
        <div>{{ keychainError }}</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { KeychainSDK } from 'keychain-sdk'
import { ref, watch } from 'vue'
const keySelected = ref('Posting')
const keyOptions = ref(['Posting', 'Active', 'Owner', 'Memo', 'Other'])
const keychain = new KeychainSDK(window)
const timestamp = new Date().getTime()
const isLoggedIn = ref(false)
const keychainError = ref(null)

const message = `{"login":login-to-my-site-at-${timestamp}}`
console.log(keychain)
const keychainParams = ref({
  data: {
    username: 'hivehydra',
    message: message,
    method: keySelected,
    title: 'Login',
  },
  options: {},
})

// watch for changes in the formParamsAsObject
watch(
  () => keychainParams.value.data.username,
  (username) => {
    isLoggedIn.value = false
  }
)

async function login() {
  try {
    const isKeychainInstalled = await keychain.isKeychainInstalled()
    console.log(isKeychainInstalled)
  } catch (error) {
    console.log({ error })
  }
  try {
    const login = await keychain.login(
      keychainParams.value.data,
      keychainParams.value.options
    )
    keychainError.value = ''
    console.log('✅ success' + { login })
    isLoggedIn.value = true
  } catch (error) {
    console.log('❌ failure')
    console.log({ error })
    keychainError.value = error
  }
}
</script>
