<template>
  <div>
    <q-input
      outlined
      :value="modelValue"
      :label="label"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
  <div>Model Value is {{ modelValue }}</div>
</template>

<script setup>
import { defineComponent, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Default Label',
  },
})
defineEmits(['update:modelValue'])

defineComponent({
  name: 'HiveUserPicker',
})

const user = ref(props.modelValue)
const modelValue = ref(props.modelValue)
console.log('inside hive user picker')
console.log(user)
</script>
