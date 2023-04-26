<template>
  <div>
    <q-select
      v-autofocus
      :label="label"
      :multiple="false"
      clearable
      filled
      input-debounce="300"
      hide-selected
      fill-input
      emit-value
      use-input
      :model-value="model"
      :options="usernameSuggestions"
      @focus="focusFn"
      @filter="filterFn"
      @virtual-scroll="vScroll"
      @keyup.esc="clearInput"
      @keyup.enter="enterFn"
      @clear="clearInput"
      @keyup.backspace="resetSuggestions"
    >
      <!--
        hint="Minimum 2 characters to trigger filtering"
        :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
      -->
      <template v-slot:prepend>
        <q-avatar>
          <img :src="hiveAvatar" />
        </q-avatar>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            {{ $t('no_results') }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
  <div v-if="testing">
    <div v-if="hiveProfile">
      <HiveProfileTestCard :hiveProfile="hiveProfile" />
      <pre>Input Model: |{{ model }}|</pre>
      <pre>Selected:    |{{ selected }}|</pre>
      <pre>Fullname:    |{{ fullName }}|</pre>
      <pre>{{ usernameSuggestions }}</pre>
      <ul>
        <li v-for="(value, key) in hiveProfile" :key="key">
          {{ key }}: {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useStoreUser } from 'src/stores/storeUser'
import {
  useHiveProfile,
  useLoadHiveAccountsReputation,
  useHiveAvatar,
} from 'src/use/useHive'
import HiveProfileTestCard from 'src/components/Display/HiveProfileTestCard.vue'
import badActorList from '@hiveio/hivescript/bad-actors.json'

const staticSuggestions = []

const storeUser = useStoreUser()
const model = ref('')
const usernameSuggestions = ref(staticSuggestions)
const selected = ref('')
const fullName = ref('')
const hiveProfile = ref({})
const hiveAvatar = ref(useHiveAvatar(''))
const badActors = ref(badActorList)
let clearingInput = false // used as a flag to allow deliberate clearing of the input

const props = defineProps({
  // Label for the input
  label: {
    type: String,
    default: '',
  },
  // Prefill with the logged in user
  useLoggedInUser: {
    type: Boolean,
    default: false,
  },
  preFilled: {
    type: String,
    default: '',
  },
  // Show Testing information
  testing: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['hiveProfile', 'hiveEnterPressed'])

watch(model, async (newModel, oldModel) => {
  console.log('watching model new', newModel)
  console.log('watching model old', oldModel)
  console.log('selected.value is ', selected.value)
  console.log('clearingInput is ', clearingInput)
  if (clearingInput) {
    console.log('clearingInput is true')
    return
  }
  if (!newModel && oldModel) {
    console.log('model is empty')
    model.value = oldModel
    selected.value = oldModel
    await updateHiveProfile(oldModel)
  }
  clearingInput = false
})

function inputValueFn(val) {
  console.log('inputValueFn')
  console.log('inputValueFn val', val)
  if (!val) {
    model.value = selected.value
  }
}

function focusFn() {
  console.log('focusFn')
}

onBeforeMount(async () => {
  console.log('onBeforeMount')
  if (props.useLoggedInUser && storeUser.isLoggedIn) {
    usernameSuggestions.value = [storeUser.hiveAccname]
    model.value = storeUser.hiveAccname
    selected.value = model.value
    await updateHiveProfile()
    emits('hiveProfile', hiveProfile.value)
  } else if (props.preFilled) {
    usernameSuggestions.value = [props.preFilled]
    model.value = props.preFilled
    selected.value = model.value
    await updateHiveProfile()
    emits('hiveProfile', hiveProfile.value)
  }
})

console.log('----------------------- HiveUserSelect -----------------------')

async function vScroll(val) {
  console.log('vScroll', val)
  hiveAvatar.value = useHiveAvatar(selected.value)
  selected.value = usernameSuggestions.value[val.index]
  model.value = selected.value
  await updateHiveProfile()
  // emits('hiveProfile', hiveProfile.value)
}

async function updateHiveProfile() {
  hiveProfile.value = await useHiveProfile(selected.value)
  fullName.value = hiveProfile.value.name ? hiveProfile.value.name : ''
  hiveAvatar.value = useHiveAvatar(selected.value)
  console.log('fullName', fullName.value)
  emits('hiveProfile', hiveProfile.value)
}

async function enterFn() {
  console.log('enterFn')
  console.log('selected.value', selected.value)
  console.log('model.value', model.value)
  if (selected.value !== model.value) {
    console.log('selected.value !== model.value')
    selected.value = model.value
    await updateHiveProfile()
  }
  emits('hiveProfile', hiveProfile.value)
  emits('hiveEnterPressed', true)
}

async function filterFn(val, update, abort) {
  if (val.length < 2) {
    abort()
    if (val.length === 0) {
      console.log('filterFn with Val length 0')
    }
    return
  }
  const needle = val.toLowerCase().replace(/\s/g, '').trim()
  usernameSuggestions.value = await useLoadHiveAccountsReputation(needle)

  console.log('needle', needle)
  console.log('filterFn input', model.value)
  console.log('filterFn val', val)
  console.log('usernameSuggestions', usernameSuggestions.value)
  update(async () => {
    const needle = val.toLowerCase().replace(/\s/g, '').trim()
    usernameSuggestions.value = await useLoadHiveAccountsReputation(needle)
    usernameSuggestions.value = usernameSuggestions.value.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    )
  })
}

const vAutofocus = {
  mounted(el) {
    el.focus()
  },
}

function clearInput() {
  console.log('clearInput')
  clearingInput = true
  model.value = ''
  selected.value = ''
  fullName.value = ''
  hiveProfile.value = {}
  hiveAvatar.value = useHiveAvatar('')
  resetSuggestions()
  emits('hiveProfile', hiveProfile.value)
}

function resetSuggestions() {
  usernameSuggestions.value = staticSuggestions
}
</script>

<style lang="sass" scoped>
.test-card
  width: 100%
  max-width: 400px
  height: 100%

.test-card img
  width: 100%
  height: 100%
  object-fit: cover
</style>
