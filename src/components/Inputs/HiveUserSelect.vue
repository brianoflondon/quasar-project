<template>
  <pre>Input:    |{{ input }}|</pre>
  <pre>Selected: |{{ selected }}|</pre>
  <pre>Fullname: |{{ fullName }}|</pre>
  <pre>{{ usernameSuggestions }}</pre>
  <div>
    <q-select
      v-autofocus
      :label="label"
      :multiple="false"
      clearable
      filled
      input-debounce="100"
      hide-selected
      fill-input
      use-input
      v-model="input"
      :options="usernameSuggestions"
      @filter="filterFn"
      @virtual-scroll="vScroll"
      @keyup.esc="clearInput"
      @keyup.backspace="resetSuggestions"
      style="width: 400px; padding-bottom: 32px"
      hint="Minimum 2 characters to trigger filtering"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            {{ $t('no_results') }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStoreUser } from 'src/stores/storeUser'
import { useHiveProfile } from 'src/use/useHiveAvatar'
import badActorList from '@hiveio/hivescript/bad-actors.json'

const staticSuggestions = [
  'brianoflondon',
  'hivehydra',
  'v4vapp',
  'v4vapp.tre',
  'v4vapp.dhf',
]

const storeUser = useStoreUser()
const input = ref('')
const usernameSuggestions = ref(staticSuggestions)
const selected = ref('')
const fullName = ref('')
const badActors = ref(badActorList)
let vscrollAcc = null

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

const emits = defineEmits(['selectUsername'])

watch(
  () => input.value,
  async (username) => {
    console.log('input.value', username)
    try {
      await updateHiveProfile(username)
    } catch (e) {
      console.log('updateHiveProfile error', e)
    }
  }
)

if (props.useLoggedInUser && storeUser.isLoggedIn) {
  input.value = storeUser.hiveAccname
}

console.log('----------------------- HiveUserSelect -----------------------')

async function vScroll(val) {
  console.log('vScroll', val)
  selected.value = usernameSuggestions.value[val.index]
  if (usernameSuggestions.value.length === 1) {
    input.value = selected.value
  }
  console.log('selectedUser', selected.value)
}

async function checkInput() {
  console.log('checkInput', input.value)
}

async function updateHiveProfile() {
  const hiveProfile = await useHiveProfile(selected.value)
  fullName.value = hiveProfile.name
  console.log('fullName', fullName.value)
}

function filterFn(val, update, abort) {
  if (val.length < 2) {
    abort()
    if (val.length === 0) {
      clearInput()
    }
    return
  }
  console.log('filterFn input', input.value)
  console.log('filterFn val', val)
  update(() => {
    const needle = val.toLowerCase().trim()
    console.log('needle', needle)
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
  input.value = ''
  selected.value = ''
  fullName.value = ''
  resetSuggestions()
}

function resetSuggestions() {
  usernameSuggestions.value = staticSuggestions
}

// filterFn (val, update, abort) {
//   if (val.length < 2) {
//     abort()
//     return
//   }

//   update(() => {
//     const needle = val.toLowerCase()
//     options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
//   })
</script>
