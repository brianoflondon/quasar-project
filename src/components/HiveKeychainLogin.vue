<template>
  <div class="q-pa-lg">
    <div v-if="storeUser.isLoggedIn">
      ✅ Logged In as {{ keychainParams.data.username }} with
      {{ keySelected }} Key
    </div>
    <div v-if="!storeUser.isLoggedIn">▪️ Not Logged In</div>
    <q-input v-model="keychainParams.data.username" />
    <q-btn @click="login">Login</q-btn>
    <q-btn @click="logout">Logout</q-btn>
    <q-select v-model="keySelected" :options="keyOptions" label="Key" />
    <div v-if="keychainError">
      <div>❌ Error</div>
      <div>{{ keychainError }}</div>
    </div>
    <h3>User Profile</h3>
    <pre>
      {{ storeUser.hiveProfile }}
    </pre>
    <h3>User List</h3>
    <pre>
      {{ userList }}
    </pre>
  </div>
</template>

<script setup>
import { KeychainSDK } from 'keychain-sdk'
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useStoreUser } from 'src/stores/storeUser'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const storeAPIStatus = useStoreAPIStatus()
const storeUser = useStoreUser()

const keySelected = ref('Posting')
const keyOptions = ref(['Posting', 'Active', 'Owner', 'Memo', 'Other'])
const keychain = new KeychainSDK(window)
const timestamp = new Date().getTime()
const keychainError = ref(null)

const message = `{"login":login-to-my-site-at-${timestamp}}`
const keychainParams = ref({
  data: {
    username: storeUser.hiveAccname,
    message: message,
    method: keySelected,
    title: 'Login',
  },
  options: {},
})

// watch for changes in the keychainParams.value.data.username
watch(
  () => keychainParams.value.data.username,
  (username) => {
    keychainParams.value.data.username = username.toLowerCase().trim()
    storeUser.isLoggedIn = false
  }
)

watch(
  () => keychainParams.value.data.method,
  () => {
    storeUser.isLoggedIn = false
  }
)

async function login() {
  try {
    if (!storeAPIStatus.isKeychainIn) {
      $q.notify('Keychain is not installed')
      console.log('Keychain is not installed')
      return
    }
    $q.notify('Contacting Keychain')
    const login = await keychain.login(
      keychainParams.value.data,
      keychainParams.value.options
    )
    keychainError.value = ''
    console.log('✅ success')
    storeUser.hiveAccname = keychainParams.value.data.username
    storeUser.login(keychainParams.value.data.username, keySelected.value)
    $q.notify(`User ${keychainParams.value.data.username} logged in`)
  } catch (error) {
    console.log('❌ failure')
    console.log({ error })
    keychainError.value = error
    $q.notify(`Error: ${error.message}`)
  }
}

async function logout() {
  storeUser.logout()
}

const userList = computed(() => {
  return storeUser.users
  // return storeUser.users.filter(obj => obj.hiveAccname === keychainParams.value.data.username)
})
/*
Keyboard
*/

const handleKeyboard = (event) => {
  if (event.key === 'Enter') {
    login()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboard)
})
</script>
