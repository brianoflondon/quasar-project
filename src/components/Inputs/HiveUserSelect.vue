<template>
  <div>
    <q-select
      clearable
      autocomplete
      hide-selected
      use-input
      fill-input
      input-debounce="0"
      v-model="input"
      :label="label"
      :options="usernameSuggestions"
      @keyup.esc="clearInput"
      @filter="filterFn"
      @filter-abort="abortFilterFn"
      @input-value="virtualScroll"
      @input="$emit('selectUsername', input)"
      autofocus
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStoreUser } from 'src/stores/storeUser'
import badActorList from '@hiveio/hivescript/bad-actors.json'
import { store } from 'quasar/wrappers'

const storeUser = useStoreUser()

const input = ref('')
const usernameSuggestions = ref([
  'brianoflondon',
  'hivehydra',
  'v4vapp',
  'v4vapp.tre',
  'v4vapp.dhf',
])
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

console.log('----------------------- HiveUserSelect -----------------------')

if (props.useLoggedInUser) {
  input.value = storeUser.hiveAccname
}

watch(input, (newState) => {
  console.log(input.value)
  input.value = newState
})

async function filterFn(val, update, abort) {
  await searchHiveUsernames(val)
  console.log('filterFn val', val)
  console.log('filterFn update', update)
  console.log('filterFn abort', abort)
  update = async function (val) {
    console.log('update', val)
    await searchHiveUsernames(val)
  }
}

async function searchHiveUsernames(val) {
  console.log('searchHiveUsernames', val)
  if (val.length < 5) {
    return
  }
  const partialUsername = val.toLowerCase()
  try {
    const data = await hiveTx.call('condenser_api.get_account_reputations', [
      partialUsername,
      6,
    ])
    console.log('data', data)
    const accounts = data.result.map((el) => el.account)
    usernameSuggestions.value = accounts
  } catch (e) {
    console.log('error', e)
  }
}

function abortFilterFn() {
  console.log('abortFilterFn')
}

async function virtualScroll(obj) {
  console.log('virtualScroll', obj)
  try {
    const data = await hiveTx.call('condenser_api.get_accounts', [[obj]])
    if (data[0] && data[0].posting_json_metadata) {
      fullName.value = JSON.parse(data[0].posting_json_metadata).profile.name
    } else {
      fullName.value = ''
    }
    console.log('data', data)
  } catch (e) {
    console.log('error', e)
  }
  vscrollAcc = obj
}

function clearInput() {
  input.value = ''
}
</script>
