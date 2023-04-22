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
      use-input
      :rules="[
        (val) =>
          /^(?=.{3,16}$)[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){2,}([.](?=[a-z][0-9a-z-][0-9a-z-])[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){1,}){0,}$/.test(
            val
          ) || 'Not a valid Hive username',
      ]"
      v-model="input"
      :options="usernameSuggestions"
      @filter="filterFn"
      @virtual-scroll="vScroll"
      @keyup.esc="clearInput"
      @keyup.backspace="resetSuggestions"
      style="width: 400px; padding-bottom: 32px"
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
import { h, ref, watch } from 'vue'
import { useStoreUser } from 'src/stores/storeUser'
import {
  useHiveProfile,
  useLoadHiveAccountsReputation,
  useHiveAvatar,
} from 'src/use/useHive'
import HiveProfileTestCard from 'src/components/Display/HiveProfileTestCard.vue'
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
  // Show Testing information
  testing: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['hiveProfile'])

watch(
  () => input.value,
  async (username) => {
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

if (props.useLoggedInUser && storeUser.isLoggedIn) {
  input.value = storeUser.hiveAccname
}

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
