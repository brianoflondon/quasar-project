<template>
  <q-page class="flex flex-center">
    <q-card
      class="my-card text-white q-ma-lg"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <div class="text-h6">{{ boxTitle }}</div>
        <div class="text-subtitle2">from v4v.app</div>
        Host: {{ host }}
      </q-card-section>
      <q-card-section v-if="apiStatus">
        {{ apiStatus.crypto.bitcoin }}<br />
        {{ apiStatus.crypto.fmt.bitcoin }}<br />
        {{ apiStatus.crypto.fmt.hive }}<br />
      </q-card-section>
    </q-card>
    <q-footer>
      <PricesBar @response="(apiStatusC) => (apiStatus = apiStatusC)" />
    </q-footer>
  </q-page>
</template>

<script setup>
import { defineComponent, computed, ref } from 'vue'
import PricesBar from 'src/components/PricesBar.vue'

defineComponent({
  name: 'TestingPage',
})
const boxTitle = ref('Prices')
const apiStatus = ref(null)
const host = ref(window.location.hostname)
</script>
