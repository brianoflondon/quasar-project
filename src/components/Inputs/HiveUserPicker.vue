<template>
  <div>
    <q-select
      filled
      :label="label"
      clearable
      autocomplete="options"
      :model-value="model"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="options"
      @filter="filterFn"
      @input-value="setModel"
      @keyup.esc="clearInput"
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
import { useHiveAvatar } from 'src/use/useHiveAvatar'
import { ref, watch } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['hiveAccname'])

const options = ref([])
const model = ref(null)
const hiveAvatar = ref(useHiveAvatar(''))

function setModel(val) {
  model.value = val
}

watch(model, (val) => {
  if (val === null) {
    hiveAvatar.value = useHiveAvatar('')
    return
  }
  model.value = val.trim()
  hiveAvatar.value = useHiveAvatar(val)
  emits('hiveAccname', val)
  console.log('watch - selected', val)
})

async function searchHiveUsernames(val) {
  console.log(val)
  if (val.length < 2) {
    return
  }
  try {
    const res = await hiveTx.call('condenser_api.get_account_reputations', [
      val,
      6,
    ])
    const accounts = res.result.map((el) => el.account)
    console.log(accounts)
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
  console.log('filterFn', val)
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
