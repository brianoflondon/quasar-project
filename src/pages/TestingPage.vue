<template>
  <q-page class="flex flex-top">
    <div>
      <div class="flex-top">
        <q-toggle v-model="testing" />
      </div>
      <div class="flex-top">Parent: {{ hiveProfile.name }}</div>
      <HiveUserSelect
        label="Testing Page Sending From"
        :use-logged-in-user="false"
        :testing="testing"
        @hiveProfile="recvHiveProfile"
      />
    </div>

    <div v-if="false">
      <q-card>
        <LogoTest :size="300" />
        <LogoTest :size="100" />
      </q-card>
      <q-card
        class="my-card text-white q-ma-lg"
        style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
      >
        <q-card-section>
          <div class="text-h6">{{ boxTitle }}</div>
          <div class="text-subtitle2">from v4v.app</div>
          Host: {{ host }} <br />
        </q-card-section>
        <q-card-section v-if="appName">
          <div>{{ appName }} v{{ appVersion }}</div>
          <!-- {{ storeAPIStatus.bitcoin }} -->
        </q-card-section>
        <q-card-section v-if="storeAPIStatus.apiStatus">
          {{ storeAPIStatus.apiStatus.crypto.bitcoin }}<br />
          {{ storeAPIStatus.apiStatus.crypto.fmt.bitcoin }}<br />
          {{ storeAPIStatus.apiStatus.crypto.fmt.hive }}<br />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
// import { name, version } from '../../package.json'
import { getAppDetails } from 'src/components/getAppDetails.js'
import HiveUserPicker from 'src/components/Inputs/HiveUserPicker.vue'
import HiveUserSelect from 'src/components/Inputs/HiveUserSelect.vue'
import LogoTest from 'src/components/LogoTest.vue'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
const storeAPIStatus = useStoreAPIStatus()
storeAPIStatus.update()

defineComponent({
  name: 'TestingPage',
})
const { appName, appVersion } = getAppDetails()

const boxTitle = ref('Prices')
const host = ref(window.location.hostname)
const testing = ref(false)
const accName = ref('')
const hiveProfile = ref({})

function recvHiveProfile(object) {
  hiveProfile.value = object
  console.log('hiveProfile', hiveProfile.value)
  console.log(hiveProfile.value.hive_accname)
}

console.log(accName)
</script>
