<template>
  <div class="text-center">
    Bitcoin: ${{ bitcoin }} Hive: ${{ hive }} Hive Dollars: ${{ hbd }}
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
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

defineComponent({
  name: 'PricesBar',
})
const $q = useQuasar()
$q.dark.set('auto')
const emit = defineEmits(['response'])
// const prices = ref('Loading')
const bitcoin = ref('💰💰💰')
const hive = ref('💰💰')
const hbd = ref('💰💰')
const prices = ref('loading')
// const api = axios.create({ baseURL: 'https://api.v4v.app/v1/' })

function tidyNumber(x) {
  if (x) {
    const parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  } else {
    return null
  }
}

async function fetchPrices() {
  try {
    const res = await fetch(
      `https://api.v4v.app/v1/cryptoprices/?use_cache=true`
    )
    prices.value = await res.json()
    bitcoin.value = tidyNumber(prices.value.bitcoin.usd.toFixed(0))
    hive.value = tidyNumber(prices.value.hive.usd.toFixed(2))
    hbd.value = tidyNumber(prices.value.hive_dollar.usd.toFixed(2))
    prices.value.fmt = {
      bitcoin: bitcoin.value,
      hive: hive.value,
      hbd: hbd.value,
    }
    const res2 = await api.get('/cryptoprices/')
  } catch (err) {
    console.error(err)
  }
}

fetchPrices()
emit('response', prices)
</script>

<style>
/* This is where your CSS goes */
</style>
