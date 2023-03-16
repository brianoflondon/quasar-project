<template>
  <div class="text-center">
    Bitcoin <b>${{ bitcoin }}</b> ▪️ Hive <b>${{ hive }}</b> ▪️ HBD
    <b>${{ hbd }}</b> ▪️ {{ statusDisp }}
    <q-btn
      flat
      dense
      @click="$q.dark.toggle()"
      :color="$q.dark.isActive ? 'black' : 'white'"
      :title="$q.dark.isActive ? 'Change to light mode' : 'Change to dark mode'"
      :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
      size="sm"
    />
  </div>
</template>

<script setup>
import { defineComponent, ref, computed } from 'vue'
import { api } from 'boot/axios'
import { getSomething } from 'src/components/getSomething.js'
import { getAPI } from 'src/components/getPrices.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()
$q.dark.set('auto')
console.log('Getting something')
console.log(getSomething())

defineComponent({
  name: 'PricesBar',
})
const emit = defineEmits(['response'])
// const prices = ref('Loading')

const { apiStatus, apiError, statusDisp } = getAPI()

// const bitcoin = ref('💰💰💰')
const bitcoin = computed(() => {
  return apiStatus.value ? apiStatus.value.crypto.fmt.bitcoin : '💰💰💰'
})
const hive = computed(() => {
  return apiStatus.value ? apiStatus.value.crypto.fmt.hive : '💰💰'
})
const hbd = computed(() => {
  return apiStatus.value ? apiStatus.value.crypto.fmt.hbd : '💰💰'
})
const prices = computed(() => {
  return apiStatus.value ? apiStatus.value.crypto : 'fetching prices'
})

// console.log(apiStatus.value.crypto.bitcoin)

// setInterval(() => {
//   // const { apiStatus, apiError, statusDisp } = getAPI()
//   console.log('hello')
// }, 30000)

// function tidyNumber(x) {
//   if (x) {
//     const parts = x.toString().split('.')
//     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//     return parts.join('.')
//   } else {
//     return null
//   }
// }

// async function fetchPrices() {
//   try {
//     const res = await api.get('', {
//       params: { get_crypto: true },
//     })
//     prices.value = res.data.crypto
//     console.log(prices.value)
//     bitcoin.value = tidyNumber(prices.value.bitcoin.usd.toFixed(0))
//     hive.value = tidyNumber(prices.value.hive.usd.toFixed(2))
//     hbd.value = tidyNumber(prices.value.hive_dollar.usd.toFixed(2))
//     prices.value.fmt = {
//       bitcoin: bitcoin.value,
//       hive: hive.value,
//       hbd: hbd.value,
//     }
//   } catch (err) {
//     console.error(err)
//   }
// }

// fetchPrices()
emit('response', prices)
</script>

<style>
/* This is where your CSS goes */
</style>
