<template>
  <div v-if="showDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ $t('system_status_title') }}
        </div>
        <div class="text-h6">
          <div>
            {{ $t('system_status_intro') }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue'
defineProps({ showDialog: Boolean })

defineComponent({
  name: 'SystemStatus',
})
</script>
