<template>
  <div class="q-pa-lg">
    <div class="row">
      <div class="col q-pa-sm vertical-middle">
        <HiveUserSelect
          :label="loginLabel"
          :use-logged-in-user="false"
          @hiveProfile="
            (hiveProfile) =>
              hiveProfile
                ? (keychainParams.data.username = hiveProfile.hive_accname)
                : (keychainParams.data.username = '')
          "
          @hiveEnterPressed="login"
        />
      </div>
    </div>
    <div class="row">
      <div class="col q-pa-sm vertical-middle">
        <q-btn
          icon="img:keychain/hive-keychain-keys.svg"
          size="20px"
          class="login-button hive-keychain"
          rounded
          @click="login"
        >
        </q-btn>
      </div>
      <div class="col q-pa-sm vertical-middle">
        <q-btn
          icon="img:has/HiveAuth_logo_safezone.svg"
          size="20px"
          class="login-button hive-has"
          rounded
          @click="loginHAS"
        >
        </q-btn>
      </div>
      <div class="col q-pa-sm vertical-middle">
        <q-btn
          rounded
          size="20px"
          @click="logout"
          class="login-button hive-logout"
          >Logout</q-btn
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { KeychainSDK } from 'keychain-sdk'
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useStoreUser } from 'src/stores/storeUser'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
import { useLoadHiveAvatar, useHiveKeychainLogin } from 'src/use/useHive'
import { useQuasar } from 'quasar'
import { useSetAlbyMeta } from 'src/use/useAlby'
import HiveUserSelect from 'src/components/Inputs/HiveUserSelect.vue'
// import HASAuthenticate from './Inputs/HASAuthenticate.vue'
import { useI18n } from 'vue-i18n'
const t = useI18n().t
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

const inputAvatar = ref(null)

const loginLabel = computed(() => {
  console.log('loginLabel')
  if (keychainParams.value.data.username !== '') {
    return `Login as: ${keychainParams.value.data.username}`
  }
  return storeUser.hiveAccname ? `Logged in ${storeUser.hiveAccname}` : 'Login:'
})

onMounted(async () => {
  document.addEventListener('keydown', handleKeyboard)
  inputAvatar.value = await useLoadHiveAvatar(
    keychainParams.value.data.username
  )
  console.log('mounted users', storeUser.users)
  console.log(userList.value)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboard)
})

let timeoutId = null
// watch for changes in the keychainParams.value.data.username
watch(
  () => keychainParams.value.data.username,
  async (username) => {
    console.log(loginLabel.value)
    if (!username) return
    keychainParams.value.data.username = username.toLowerCase().trim()
    storeUser.isLoggedIn = false
    // Timeout function used to stop excessive calls to missing avatars
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      if (username !== '') {
        inputAvatar.value = await useLoadHiveAvatar(username)
      }
    }, 500)
  }
)

watch(
  () => keychainParams.value.data.method,
  () => {
    storeUser.isLoggedIn = false
  }
)

async function loginHAS() {
  console.log('loginHAS')
  showHASDialog()
  // await useHAS(keychainParams.value.data.username)
}

function showHASDialog() {
  $q.dialog({
    component: HASAuthenticate,

    // props forwarded to your custom component
    componentProps: {
      hiveAccname: keychainParams.value.data.username,
      // ...more..props...
    },
  })
    .onOk(() => {
      console.log('OK')
    })
    .onCancel(() => {
      console.log('Cancel')
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel')
    })
}

async function login() {
  try {
    if (!storeAPIStatus.isKeychainIn) {
      $q.notify(t('keychain_missing'))
      console.log(t('keychain_missing'))
      return
    }
    $q.notify('Contacting Keychain')
    const loginResult = await useHiveKeychainLogin({
      hiveAccname: keychainParams.value.data.username,
      keyType: keySelected.value,
    })
    // const loginResult = await keychain.login(
    //   keychainParams.value.data,
    //   keychainParams.value.options
    // )
    keychainError.value = ''
    console.log('✅ success', loginResult)
    storeUser.hiveAccname = keychainParams.value.data.username
    storeUser.login(keychainParams.value.data.username, keySelected.value)
    $q.notify(`User ${keychainParams.value.data.username} logged in`)
    await useSetAlbyMeta(keychainParams.value.data.username)
  } catch (error) {
    console.log('❌ failure')
    console.log({ error })
    keychainError.value = error
    // $q.notify(`${error.message}`)
  }
}

async function logout() {
  storeUser.logout()
}

const userList = computed(() => {
  return storeUser.getUserList()
})

/*
Keyboard
*/

const handleKeyboard = (event) => {
  if (event.key === 'Enter') {
    login()
  }
}
</script>

<style lang="sass" scoped>
.login-button
  background-color: $primary
  color: $secondary
  width: 120px
</style>
