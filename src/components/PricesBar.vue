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
import { defineComponent, computed } from 'vue'
import { getAPIStatus } from 'src/components/getPrices.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()
$q.dark.set('auto')

defineComponent({
  name: 'PricesBar',
})

const emit = defineEmits(['response'])
const { apiStatus, apiError, statusDisp } = getAPIStatus()
emit('response', apiStatus)

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

</script>

<style>
/* This is where your CSS goes */
</style>
