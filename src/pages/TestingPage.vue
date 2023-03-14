<template>
  <q-page class="flex flex-center">
    <q-card
      class="my-card text-white q-ma-lg"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <div class="text-h6">{{ boxTitle }}</div>
        <div class="text-subtitle2">from v4v.app</div>
      </q-card-section>
      <q-card-section v-if="prices.bitcoin">
        {{ prices.bitcoin }}
        {{ prices.fmt.bitcoin }}
        {{ prices.fmt.hive }}
      </q-card-section>
    </q-card>
    <q-footer>
      <PricesBar @response="(childPrices) => (prices = childPrices)" />
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
const prices = ref('Loading')
</script>
