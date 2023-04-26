<template>
  <div class="q-pa-lg">
    <div v-if="storeUser.isLoggedIn">
      ✅ Logged In as {{ keychainParams.data.username }} with
      {{ keySelected }} Key
    </div>
    <div v-if="!storeUser.isLoggedIn">▪️ Not Logged In</div>
    <div class="row">
      <div class="col q-pa-sm vertical-middle">
        <q-input class="v4v-simple-hiveaccount-input"
          outlined
          v-model="keychainParams.data.username"
          label="Hive Account"
        >
        <template v-slot:prepend>
          <q-avatar size="md">
            <q-img
              :src="inputAvatar"
              @error="handleImageError"
              spinner="bars"
              loading="lazy"
            />
          </q-avatar>
        </template>
          <template v-slot:append>
            <q-icon name="fa-brands fa-hive" color="orange" />
          </template>
        </q-input>
        <HiveUserSelect
          label="Login:"
          :use-logged-in-user="false"
          @hiveProfile="
            (hiveProfile) =>
              hiveProfile
                ? (keychainParams.data.username = hiveProfile.hive_accname)
                : (keychainParams.data.username = '')
          "
        />
      </div>
      <div class="col-2 q-pa-sm vertical-middle">
        <q-btn class="vertical-middle" rounded @click="login">Login</q-btn>
      </div>
      <div class="col-2 q-pa-sm vertical-middle">
        <q-btn @click="logout">Logout</q-btn>
      </div>
    </div>
    <q-select v-model="keySelected" :options="keyOptions" label="Key" />
    <div v-if="keychainError">
      <div>❌ Error</div>
      <div>{{ keychainError }}</div>
    </div>
    <div>
      <div v-for="user in userList" :key="user.hiveAccname">
        {{ user.hiveAccname }} - {{ $filters.formatDuration(user.loginAge) }}
      </div>
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
import { HiveUser, useStoreUser } from 'src/stores/storeUser'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
import { useLoadHiveAvatar } from 'src/use/useHive'
import { useQuasar, useMeta } from 'quasar'
import HiveUserSelect from 'src/components/Inputs/HiveUserSelect.vue'
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

const inputAvatar = ref('')

let timeoutId = null
// watch for changes in the keychainParams.value.data.username
watch(
  () => keychainParams.value.data.username,
  async (username) => {
    if(!username) return
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

function handleImageError() {
  inputAvatar.value = 'avatars/unkown_hive_user.png'
}

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
    console.log('✅ success', login)
    storeUser.hiveAccname = keychainParams.value.data.username
    storeUser.login(keychainParams.value.data.username, keySelected.value)
    $q.notify(`User ${keychainParams.value.data.username} logged in`)
    // add Meta tags for Alby
    console.log('alby')
    storeUser.getHiveProfile()
    const albyNameContent = storeUser.hiveProfile
      ? storeUser.hiveProfile.name
      : storeUser.hiveAccname
    console.log('albyNameContent', albyNameContent)
    const albyImageContent = storeUser.profileImageUrlAlby
    console.log('albyImageContent', albyImageContent)
    const albyLightningContent = `${storeUser.hiveAccname}@v4v.app`
    const metaData = {
      meta: {
        albyName: {
          name: 'alby:name',
          content: albyNameContent,
        },
        albyImage: {
          name: 'alby:image',
          content: albyImageContent,
        },
        property: {
          name: 'lightning',
          content: albyLightningContent,
        },
        description: {
          name: 'description',
          content: `Hive User ${storeUser.hiveAccname} is using V4V.app`,
        },
      },
    }
    useMeta(metaData)
  } catch (error) {
    console.log('❌ failure')
    console.log({ error })
    keychainError.value = error
    $q.notify(`${error.message}`)
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
</script>
