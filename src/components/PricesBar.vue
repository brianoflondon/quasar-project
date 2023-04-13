<template>
  <div class="text-center">
    Bitcoin <b>${{ storeAPIStatus.bitcoin }}</b> ▪️ Hive
    <b>${{ storeAPIStatus.hive }}</b> ▪️ HBD <b>${{ storeAPIStatus.hbd }}</b> ▪️
    {{ storeAPIStatus.statusDisp }}
    <span v-if="isKeychainIn">
      ▪️
      <img src="/keychain/hive-keychain-keys.svg" width="15" height="15" />
    </span>
    ▪️
    <q-btn
      flat
      dense
      @click="$q.dark.toggle()"
      :color="$q.dark.isActive ? 'black' : 'white'"
      :title="$q.dark.isActive ? 'Change to light mode' : 'Change to dark mode'"
      :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
      size="sm"
    />
    <q-btn icon="replay" flat dense @click="storeAPIStatus.update()" />
  </div>
</template>

<script setup>
import { defineComponent, ref, computed, onMounted } from 'vue'
// import { getAPIStatus } from 'src/components/getPrices.js'
import { useQuasar } from 'quasar'
import { KeychainSDK } from 'keychain-sdk'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
const storeAPIStatus = useStoreAPIStatus()
storeAPIStatus.update()
// console.log('storeAPIStatus before doing anything is ' + storeAPIStatus)

const $q = useQuasar()
$q.dark.set('auto')

defineComponent({
  name: 'PricesBar',
})

const emit = defineEmits(['response'])
// const { apiStatus, apiError, statusDisp } = getAPIStatus()
console.log('storeAPIStatus before doing anything is ' + storeAPIStatus)

// emit('response', apiStatus)

// // const bitcoin = ref('💰💰💰')
// const bitcoin = computed(() => {
//   return apiStatus.value ? apiStatus.value.crypto.fmt.bitcoin : '💰💰💰'
// })
// const hive = computed(() => {
//   return apiStatus.value ? apiStatus.value.crypto.fmt.hive : '💰💰'
// })
// const hbd = computed(() => {
//   return apiStatus.value ? apiStatus.value.crypto.fmt.hbd : '💰💰'
// })
// const prices = computed(() => {
//   return apiStatus.value ? apiStatus.value.crypto : 'fetching prices'
// })

/*
Check Keychain
*/
const keychain = new KeychainSDK(window)
const isKeychainIn = ref(false)

onMounted(async () => {
  await checkKeychain()
})

async function checkKeychain() {
  try {
    isKeychainIn.value = await keychain.isKeychainInstalled()
    console.log(isKeychainIn.value)
    if (!isKeychainIn.value) {
      keychainError.value = 'Keychain is not installed'
    }
  } catch (error) {
    keychainError.value = 'Keychain is not installed'
    console.log({ error })
  }
}
</script>

<style>
/* This is where your CSS goes */
</style>
