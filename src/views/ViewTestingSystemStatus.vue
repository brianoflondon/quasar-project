<template>
  <q-btn flat dense @click="showDialog = !showDialog">Show/hide</q-btn>
  {{ showDialog }}
  <div>
    <SystemStatus :show-dialog="showDialog" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SystemStatus from 'src/components/SystemStatus.vue'

const showDialog = ref(true)
</script>
