<template>
  <div class="text-center">
    <span class="btc-price q-pa-sm">
      <i class="fa-brands fa-btc" />&thinsp;
      <strong>${{ storeAPIStatus.bitcoin }}</strong>
    </span>
    <span class="hive-price q-pa-sm">
      <i class="fa-brands fa-hive" />&thinsp;
      <strong>
        ${{ storeAPIStatus.hive }}
        &thinsp;/&thinsp;
        {{ storeAPIStatus.hiveSats }}{{ $t('sats') }}
      </strong>
    </span>
    <span class="hbd-price q-pa-sm">
      HBD
      <strong>${{ storeAPIStatus.hbd }}</strong>
    </span>
    <q-btn flat dense :title="storeAPIStatus.apiError ? $t('failure') : $t('working')">
      {{ storeAPIStatus.statusDisp }}
    </q-btn>
    <span v-if="storeAPIStatus.isKeychainIn">
      <q-btn flat dense title="Keychain Installed">
        <img src="/keychain/hive-keychain-keys.svg" width="15" height="15" />
      </q-btn>
    </span>
    <q-btn icon="replay" flat dense @click="storeAPIStatus.update()" />
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
import { defineComponent, onBeforeMount, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
import { useStoreUser } from 'src/stores/storeUser'

const storeAPIStatus = useStoreAPIStatus()
storeAPIStatus.update()

const storeUser = useStoreUser()

const $q = useQuasar()
$q.dark.set('auto')

defineComponent({
  name: 'PricesBar',
})

onMounted(() => {
  console.log('PricesBar: onBeforeMount')
})
</script>

<style>
/* This is where your CSS goes */
</style>
