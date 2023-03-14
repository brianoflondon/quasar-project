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
      <q-card-section>
        {{ prices }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { defineComponent, ref } from 'vue'

defineComponent({
  name: 'TestingPage',
})

const boxTitle = ref('Prices')
const prices = ref('Loading')

async function fetchData() {
  try {
    let res = await fetch(
      `https://api.v4v.app/v1/cryptoprices/?use_cache=false`)
    prices.value = await res.json()
  } catch (err) {
    console.error(err)
  }
}

fetchData()
</script>

<!--
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TestingPage',
  setup() {
    const name = ref("Testing Page")
    const prices = ref({
      something: 23,
    })

    return { prices, name }
  },
})
</script>
-->
