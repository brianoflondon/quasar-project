<template>
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
      emit-value
      use-input
      :model-value="input"
      :options="usernameSuggestions"
      @input-value="inputValueFn"
      @focus="focusFn"
      @filter="filterFn"
      @virtual-scroll="vScroll"
      @keyup.esc="clearInput"
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
      <pre>Input:    |{{ input }}|</pre>
      <pre>Selected: |{{ selected }}|</pre>
      <pre>Fullname: |{{ fullName }}|</pre>
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
import { onMounted, onBeforeMount, ref, watch } from 'vue'
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
const input = ref('')
const usernameSuggestions = ref(staticSuggestions)
const selected = ref('')
const fullName = ref('')
const hiveProfile = ref({})
const hiveAvatar = ref(useHiveAvatar(''))
const badActors = ref(badActorList)

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

const emits = defineEmits(['hiveProfile'])

watch(
  function () {
    console.log('watch: input.value', input.value)
    if (selected.value) {
      if (!input.value) {
        input.value = selected.value
      }
    }
    return input.value
  },
  async function (username) {
    console.log('input.value ---->', username)
    if (!username) {
      clearInput()
    }
    console.log('input.value ---->', username)
    try {
      await updateHiveProfile(username)
    } catch (e) {
      console.log('updateHiveProfile error', e)
    }
    emits('hiveProfile', hiveProfile.value)
  }
)

function inputValueFn(val) {
  console.log('inputValueFn')
  console.log('inputValueFn val', val)
  if (!val) {
    input.value = selected.value
  }
}

function focusFn() {
  console.log('focusFn')
}

onBeforeMount(async () => {
  console.log('onBeforeMount')
  if (props.useLoggedInUser && storeUser.isLoggedIn) {
    usernameSuggestions.value = [storeUser.hiveAccname]
    input.value = storeUser.hiveAccname
    selected.value = input.value
    await updateHiveProfile()
    emits('hiveProfile', hiveProfile.value)
  } else if (props.preFilled) {
    usernameSuggestions.value = [props.preFilled]
    input.value = props.preFilled
    selected.value = input.value
    await updateHiveProfile()
    emits('hiveProfile', hiveProfile.value)
  }
})

console.log('----------------------- HiveUserSelect -----------------------')

async function vScroll(val) {
  console.log('vScroll', val)
  selected.value = usernameSuggestions.value[val.index]
  if (usernameSuggestions.value.length === 1) {
    input.value = selected.value
    await updateHiveProfile()
    emits('hiveProfile', hiveProfile.value)
  }
  hiveAvatar.value = useHiveAvatar(selected.value)
  console.log('selectedUser', selected.value)
}

async function updateHiveProfile() {
  hiveProfile.value = await useHiveProfile(selected.value)
  fullName.value = hiveProfile.value.name
  hiveAvatar.value = useHiveAvatar(selected.value)
  console.log('fullName', fullName.value)
}

async function filterFn(val, update, abort) {
  if (val.length < 2) {
    abort()
    if (val.length === 0) {
      clearInput()
    }
    return
  }
  const needle = val.toLowerCase().trim()
  usernameSuggestions.value = await useLoadHiveAccountsReputation(needle)
  console.log('filterFn input', input.value)
  console.log('filterFn val', val)
  update(() => {
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
  hiveProfile.value = {}
  hiveAvatar.value = useHiveAvatar('')
  resetSuggestions()
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
