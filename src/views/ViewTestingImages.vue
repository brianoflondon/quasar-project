<template>
  <q-page>
    <div>
      <q-btn @click="clearAllStorage">Clear Storage</q-btn>
      <h1>Testing Images</h1>
      <LogoTest :size="100" class="q-pa-sm" />
      <LogoTest :size="200" class="q-pa-sm" />
      <LogoTest :size="500" class="q-pa-sm" />
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, onMounted } from 'vue'
import LogoTest from 'src/components/LogoTest.vue'

defineComponent({
  name: 'ImagesPage',
})

function clearAllStorage() {
  console.log('clearing local storage')
  window.sessionStorage.clear()
  window.localStorage.clear()
}
</script>
