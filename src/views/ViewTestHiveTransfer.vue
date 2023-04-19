<template>
  <q-page>
    <q-card class="q-pa-sm">
      <div class="row-8 q-pa-sm">
        <HiveUserPicker :v-model="sendFrom" label="Sending From child:" />
        {{ sendFrom }}
      </div>
      <div class="row-8 q-pa-sm">
        <q-input filled v-model="sendFrom" label="Sending From:" stack-label />
      </div>
      <div class="row-8 q-pa-sm">
        <q-input filled v-model="sendTo" label="Sending To:" stack-label />
      </div>
      <div class="row q-pa-sm">
        <div class="col-4 q-pr-sm">
          <q-input
            filled
            type="number"
            inputmode="decimal"
            v-model="amount"
            label="Amount to Send:"
            stack-label
            v-autofocus
          />
        </div>
        <div class="col-6 q-pr-sm vertical-middle text-center">
          <q-option-group
            v-model="optionsSelected"
            :options="optionsCurrency"
            color="primary"
            label="Currency:"
            inline
          />
        </div>
        <div class="col-2 q-pr-sm vertical-middle text-center">
          <q-btn rounded @click="sendTransfer">Send</q-btn>
        </div>
      </div>
      <div class="row q-pa-sm">
        <div class="col-3 q-pr-sm output-values">
          <q-input
            outlined
            :editable="false"
            :readonly="true"
            v-model="hiveAmount"
            label="Hive Amount:"
            stack-label
            tabindex="-1"
          />
        </div>
        <div class="col-3 q-pr-sm">
          <q-input
            outlined
            :editable="false"
            :readonly="true"
            color="blue"
            v-model="HBDAmount"
            label="HBD Amount:"
            stack-label
            tabindex="-1"
          />
        </div>
        <div class="col-3 q-pr-sm">
          <q-input
            outlined
            :editable="false"
            :readonly="true"
            v-model="satsAmount"
            label="Sats Amount:"
            stack-label
            tabindex="-1"
          />
        </div>
        <div class="col-3 q-pr-sm">
          <q-input
            outlined
            :editable="false"
            :readonly="true"
            v-model="USDAmount"
            label="USD Amount:"
            stack-label
            tabindex="-1"
          />
        </div>
      </div>
      <div class="row q-pa-sm">
        <div class="col-8 q-pr-sm">
          <q-input filled v-model="memo" label="Memo:" stack-label />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { KeychainSDK } from 'keychain-sdk'
import { useStoreUser } from 'src/stores/storeUser'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
import HiveUserPicker from 'src/components/Inputs/HiveUserPicker.vue'

const $q = useQuasar()
const storeUser = useStoreUser()
const storeAPIStatus = useStoreAPIStatus()

const amount = ref('10')
const memo = ref('')

const optionsCurrency = [
  {
    label: 'Hive',
    value: 'HIVE',
  },
  {
    label: 'HBD',
    value: 'HBD',
  },
  {
    label: 'Sats',
    value: 'sats',
  },
  {
    label: 'BTC',
    value: 'BTC',
  },
  {
    label: 'USD',
    value: 'USD',
  },
]

const optionsSelected = ref('HIVE')

defineComponent({
  name: 'TestingTransfers',
})

const sendFrom = ref('')
const sendTo = ref('brianoflondon')

const hiveAmount = computed(() => {
  console.log(optionsSelected.value)
  if (optionsSelected.value === 'HIVE') {
    return Number(amount.value).toFixed(3)
  }
  if (optionsSelected.value === 'HBD') {
    return Number(amount.value / storeAPIStatus.hiveHBDNumber).toFixed(3)
  }
  if (optionsSelected.value === 'sats') {
    return Number(amount.value / storeAPIStatus.hiveSatsNumber).toFixed(3)
  }
  if (optionsSelected.value === 'BTC') {
    return Number(amount.value / storeAPIStatus.hiveBTCNumber).toFixed(3)
  }
  if (optionsSelected.value === 'USD') {
    console.log(storeAPIStatus.apiStatus.crypto.hive.usd)
    return Number(
      amount.value / storeAPIStatus.apiStatus.crypto.hive.usd
    ).toFixed(3)
  }
  return 99
})

const HBDAmount = computed(() => {
  return Number(hiveAmount.value * storeAPIStatus.hiveHBDNumber).toFixed(3)
})

const satsAmount = computed(() => {
  return tidyNumber(
    (hiveAmount.value * storeAPIStatus.hiveSatsNumber).toFixed(0)
  )
})

const USDAmount = computed(() => {
  return tidyNumber(
    (hiveAmount.value * storeAPIStatus.apiStatus.crypto.hive.usd).toFixed(2)
  )
})

function tidyNumber(x) {
  if (x) {
    const parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  } else {
    return null
  }
}

async function sendTransfer() {
  try {
    const keychain = new KeychainSDK(window)

    let currencyToSend = 'HIVE'
    if (optionsSelected.value === 'HBD') {
      currencyToSend = 'HBD'
    }

    const formParamsAsObject = {
      data: {
        username: sendFrom.value,
        to: sendTo.value,
        amount: hiveAmount.value,
        memo: memo.value,
        enforce: true,
        currency: currencyToSend,
      },
      options: {},
    }
    const transfer = await keychain.transfer(
      formParamsAsObject.data,
      formParamsAsObject.options
    )
    console.log({ transfer })
  } catch (error) {
    console.log('❌ failure')
    console.log({ error })
    $q.notify(`${error.message}`)
  }
}

function formatNumber(value) {
  console.log(value)
  return value.toLocaleString()
}

const vAutofocus = {
  mounted(el) {
    el.focus()
  },
}

onMounted(() => {
  if (storeUser.hiveAccname) {
    sendFrom.value = storeUser.hiveAccname
    if (storeUser.hiveAccname === 'v4vapp.tre') {
      sendTo.value = 'deepcrypto8'
      memo.value = '100082561'
    }
  }
})
</script>
