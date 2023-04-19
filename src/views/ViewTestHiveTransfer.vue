<template>
  <q-page>
    <q-card class="q-pa-sm">
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
        <div class="col-4 q-pr-sm output-values">
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
        <div class="col-4 q-pr-sm">
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
        <div class="col-4 q-pr-sm">
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
    label: 'Sats (BTC)',
    value: 'sats',
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
    console.log(storeAPIStatus.hiveSatsNumber)
    return Number(amount.value / storeAPIStatus.hiveSatsNumber).toFixed(3)
  }
  return 99
})

const HBDAmount = computed(() => {
  return Number(hiveAmount.value * storeAPIStatus.hiveHBDNumber).toFixed(3)
})

const satsAmount = computed(() => {
  return Number(hiveAmount.value * storeAPIStatus.hiveSatsNumber).toFixed(3)
})

async function sendTransfer() {
  try {
    const keychain = new KeychainSDK(window)
    const formParamsAsObject = {
      data: {
        username: sendFrom.value,
        to: sendTo.value,
        amount: hiveAmount.value,
        memo: memo.value,
        enforce: true,
        currency: 'HIVE',
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
    $q.notify(`Error: ${error.message}`)
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
  sendFrom.value = storeUser.hiveAccname
  if (storeUser.hiveAccname === 'v4vapp.tre') {
    sendTo.value = 'deepcrypto8'
    memo.value = '100082561'
  }
})
</script>
