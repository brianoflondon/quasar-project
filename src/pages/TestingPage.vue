<template>
  <q-page class="flex flex-center">
    <q-card
      class="my-card text-white q-ma-lg"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <div class="text-h6">{{ boxTitle }}</div>
        <div class="text-subtitle2">from v4v.app</div>
        Host: {{ host }} <br />
        {{ apiStatus }}
      </q-card-section>
      <q-card-section v-if="childApiStatus">
        <p>commented out</p>
        {{ childApiStatus.crypto.bitcoin }}<br />
        <!--{{ childApiStatus.crypto.fmt.bitcoin }}<br />
        {{ childApiStatus.crypto.fmt.hive }}<br /> -->
      </q-card-section>
    </q-card>
    <q-footer>
      <PricesBar @response="(apiStatus) => (childApiStatus = apiStatus)" />
    </q-footer>
  </q-page>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
import PricesBar from 'src/components/PricesBar.vue'

defineComponent({
  name: 'TestingPage',
})
const boxTitle = ref('Prices')
const childApiStatus = ref(null)
const host = ref(window.location.hostname)
</script>
