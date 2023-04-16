<template>
  <div class="text-center">
    Bitcoin <b>${{ storeAPIStatus.bitcoin }}</b> ▪️ Hive
    <b>${{ storeAPIStatus.hive }}/ṩ{{ storeAPIStatus.hiveSats }}</b> ▪️ HBD
    <b>${{ storeAPIStatus.hbd }} ▪️ </b>
    <q-btn flat dense :title="storeAPIStatus.apiError ? 'Failure' : 'Working'">
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
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
const storeAPIStatus = useStoreAPIStatus()
storeAPIStatus.update()

const $q = useQuasar()
$q.dark.set('auto')

defineComponent({
  name: 'PricesBar',
})

// const emit = defineEmits(['response'])
</script>

<style>
/* This is where your CSS goes */
</style>
