<template>
  <div>
    <q-select
      filled
      new-value-mode="add"
      autocomplete="on"
      autofocus
      hide-selected
      model-value="model"
      :value="model"
      use-input
      fill-input
      input-debounce="10"
      v-model="model"
      :label="changingLabel"
      :options="options"
      no-icon
      @keyup.esc="clearInput"
      @input="inputRecv"
      @input-value="setModel"
      @new-value="newValue"
    >
      <!-- @filter="filterFn"
        menu dialog forces the iphone like behaviour on desktop.
        behavior="dialog"
      -->
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
import { useHiveAvatarURL } from 'src/use/useHive'
// This comes from https://github.com/ecency/hivescript
import badActorList from '@hiveio/hivescript/bad-actors.json'
import 'src/assets/hive-tx.min.js'

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

const changingLabel = ref(props.label)

// start off using the logged in user if available
const model = ref(null)
const hiveAvatar = ref(useHiveAvatarURL(''))

if (props.useLoggedInUser && storeUser.isLoggedIn) {
  model.value = storeUser.hiveAccname
  hiveAvatar.value = useHiveAvatarURL(storeUser.hiveAccname)
}

const emits = defineEmits(['hiveAccname'])

const options = ref([])

function newValue(e) {
  console.log('newValue', e)
}

function setModel(val) {
  console.log('setModel', val)
  val = val.toLowerCase().trim()
  model.value = val
}

watch(model, async (val) => {
  if (val === null) {
    hiveAvatar.value = useHiveAvatarURL('')
    return
  }
  hiveAvatar.value = useHiveAvatarURL(val)
  changingLabel.value = props.label + ' @' + options.value[0]
  console.log(changingLabel.value)
  emits('hiveAccname', model.value)
  // await hiveUserProperties(model.value)
})

async function hiveUserProperties(val) {
  if (val.length < 2) {
    return
  }
  try {
    const res = await hiveTx.call('condenser_api.get_accounts', [[val]])
    console.log(res)
  } catch (error) {
    console.log(error)
  }
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
    hiveAvatar.value = useHiveAvatarURL(accounts[0])
  } catch (error) {
    console.log(error)
  }
}

function clearInput() {
  model.value = ''
  options.value = []
  hiveAvatar.value = useHiveAvatarURL('')
}

async function inputRecv(e) {
  try {
    model.value = e.target.value.trim().toLowerCase()
    await searchHiveUsernames(model.value)
  } catch (error) {}
}

const filterFn = async (val, update) => {
  console.log('filterFn', val)
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
