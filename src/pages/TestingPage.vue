<template>
  <q-page class="flex flex-center">
    <q-card>
      <LogoTest :size="300" />
      <LogoTest :size="100" />
    </q-card>
    <q-card>
      <QuasarLazyLoad />
    </q-card>
    <q-card
      class="my-card text-white q-ma-lg"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <div class="text-h6">{{ boxTitle }}</div>
        <div class="text-subtitle2">from v4v.app</div>
        Host: {{ host }} <br />
      </q-card-section>
      <q-card-section v-if="appName">
        <div>{{ appName }} v{{ appVersion }}</div>
        {{ bitcoin }}
      </q-card-section>
      <q-card-section v-if="storeAPIStatus.apiStatus">
        {{ storeAPIStatus.apiStatus.crypto.bitcoin }}<br />
        {{ storeAPIStatus.apiStatus.crypto.fmt.bitcoin }}<br />
        {{ storeAPIStatus.apiStatus.crypto.fmt.hive }}<br />
      </q-card-section>
    </q-card>
    <q-card
      class="my-card text-white q-ma-lg"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <HiveUserSelect />
    </q-card>

    <q-footer>
      <PricesBar />
    </q-footer>
  </q-page>
</template>

<script setup>
import { defineComponent, ref, computed } from 'vue'
// import { name, version } from '../../package.json'
import { getAppDetails } from 'src/components/getAppDetails.js'
import PricesBar from 'src/components/PricesBar.vue'
import HiveUserSelect from 'src/components/HiveUserSelect.vue'
import QuasarLazyLoad from 'src/components/QuasarLazyLoad.vue'
import LogoTest from 'src/components/LogoTest.vue'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
const storeAPIStatus = useStoreAPIStatus()

defineComponent({
  name: 'TestingPage',
})
const { appName, appVersion } = getAppDetails()

const boxTitle = ref('Prices')
const host = ref(window.location.hostname)

const accName = ref('')

console.log(accName)
</script>
