<template>
  <div>
    <q-select
      filled
      clearable
      autocomplete
      hide-selected
      :value="model"
      use-input
      fill-input
      input-debounce="0"
      :model-value="model"
      v-model="model"
      :label="label"
      :options="options"
      @keyup.esc="clearInput"
      @filter="filterFn"
      @input-value="setModel"
    >
      <template v-slot:prepend>
        <q-avatar>
          <img :src="hiveAvatar" />
        </q-avatar>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStoreUser } from 'src/stores/storeUser'
import { useHiveAvatar } from 'src/use/useHiveAvatar'

const storeUser = useStoreUser()
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

// start off using the logged in user if available
const model = ref(null)
const hiveAvatar = ref(useHiveAvatar(''))

if (props.useLoggedInUser && storeUser.isLoggedIn) {
  model.value = storeUser.hiveAccname
  hiveAvatar.value = useHiveAvatar(storeUser.hiveAccname)
}

const emits = defineEmits(['hiveAccname'])

const options = ref([])

function setModel(val) {
  val = val.toLowerCase().trim()
  model.value = val
}

watch(model, (val) => {
  if (val === null) {
    hiveAvatar.value = useHiveAvatar('')
    return
  }
  // model.value = val.toLowerCase()
  // model.value = val.trim()
  hiveAvatar.value = useHiveAvatar(val)
  emits('hiveAccname', model.value)
  // console.log('watch - selected', model.value)
})

async function virtualScroll(val) {
  console.log('virtualScroll', val)
}

async function searchHiveUsernames(val) {
  if (val.length < 2) {
    return
  }
  try {
    const res = await hiveTx.call('condenser_api.get_account_reputations', [
      val,
      6,
    ])
    const accounts = res.result.map((el) => el.account)
    options.value = accounts
    hiveAvatar.value = useHiveAvatar(accounts[0])
  } catch (error) {
    console.log(error)
  }
}

function clearInput() {
  model.value = ''
  options.value = []
  hiveAvatar.value = useHiveAvatar('')
}

const filterFn = async (val, update) => {
  // console.log('filterFn', val)
  val = val.toLowerCase()
  model.value = val
  await searchHiveUsernames(val)
  if (val === '') {
    update(() => {
      options.value = []

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    })
    return
  }

  update(() => {
    // const needle = val.toLowerCase()
    // options.value = stringOptions.filter(
    //   (v) => v.toLowerCase().indexOf(needle) > -1
    // )
  })
}
</script>
