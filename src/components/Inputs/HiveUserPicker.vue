<template>
  <q-input v-model="user" filled :label="label" stack-label />
</template>

<script setup>
import { ref } from 'vue'
import { useStoreUser } from 'src/stores/storeUser'

const storeUser = useStoreUser()

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
})
const user = ref(storeUser.hiveAccname)
</script>
