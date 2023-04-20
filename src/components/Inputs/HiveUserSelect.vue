<template>
  <div>
    <div class="row items-top q-pa-md">
      <div class="col-8 q-pr-md">
        <q-select
          clearable
          autocomplete="on"
          hide-selected
          :value="input"
          use-input
          fill-input
          input-debounce="10"
          v-model="input"
          :label="label"
          :options="usernameSuggestions"
          @keyup.esc="clearInput"
          @filter="filterFn"
          @filter-abort="abortFilterFn"
          @input-value="virtualScroll"
          @input="$emit('selectUsername', input)"
          autofocus="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent } from 'vue'
import { useStoreUser } from 'src/stores/storeUser'
import badActorList from '@hiveio/hivescript/bad-actors.json'

const storeUser = useStoreUser()

const input = ref('')
const usernameSuggestions = ref([])
const badActors = ref(badActorList)

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  useLoggedInUser: {
    type: Boolean,
    default: false,
  },
})

if (props.useLoggedInUser) {
  input.value = storeUser.username
}

function filterFn() {
  console.log('filterFn')
}

function abortFilterFn() {
  console.log('abortFilterFn')
}

function virtualScroll(obj) {
  console.log('virtualScroll', obj)
}

function clearInput() {
  input.value = ''
}
</script>
