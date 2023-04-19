<template>
  <q-card-section>
    <div class="text-h6">
      {{ $t('system_status_title') }}
    </div>
    <div class="text-h6">
      <div>
        {{ $t('system_status_intro') }}
      </div>
    </div>
    <div>
      <pre>Hello World</pre>
    </div>
  </q-card-section>
</template>

<script setup>
import { defineComponent } from 'vue'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
defineComponent({
  name: 'SystemStatus',
})

const storeAPIStatus = useStoreAPIStatus()
</script>
