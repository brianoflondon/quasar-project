<template>
  <q-page>
    <q-card class="q-pa-sm">
      <div class="row q-pa-sm destinations">
        <div class="col-6 q-pr-sm">
          <HiveUserPicker
            :label="$t('sending') + ' ' + $t('from')"
            :use-logged-in-user="true"
            @hiveAccname="(msg) => (sendFrom = msg)"
          />
        </div>
        <div class="col-6 q-pr-sm">
          <HiveUserPicker
            :label="$t('sending') + ' ' + $t('to')"
            :use-logged-in-user="false"
            @hiveAccname="(msg) => (sendTo = msg)"
          />
        </div>
      </div>
      <div class="row q-pa-sm amount-buttons">
        <div v-for="button in btnAmounts" :key="button.id" class="col q-pr-sm">
          <q-btn
            rounded
            color="primary"
            :label="tidyNumber(button)"
            @click="amount = button"
          />
        </div>
      </div>
      <div class="row q-pa-sm">
        <div class="col-4 q-pr-sm">
          <q-input
            filled
            type="number"
            inputmode="decimal"
            v-model="amount"
            :label="$t('amount_to_send')"
            stack-label
            v-autofocus
          />
        </div>
        <div class="col-6 q-pr-sm vertical-middle text-center currency-options">
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
        <div class="col q-pr-sm" v-for="(value, key) in optionsCur" :key="key">
          <q-input
            v-model="allAmounts[key]"
            outlined
            :editable="false"
            :readonly="true"
            :label="value.label + ' ' + $t('amount')"
            stack-label
            tabindex="-1"
            @click="copyToClipboard(allAmounts[key])"
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
import { defineComponent, ref, watch, onMounted, computed } from 'vue'
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

const btnAmountsNormal = [1, 10, 50, 100, 500, 1000, 5000]
const btnAmountsSats = [5000, 10000, 25000, 50000, 100000, 250000]

const btnAmounts = ref(btnAmountsNormal)

const optionsCur = {
  HIVE: {
    symbol: 'HIVE',
    label: 'Hive',
    amount: 0,
  },
  HBD: {
    symbol: 'HBD',
    label: 'HBD',
    amount: 0,
  },
  sats: {
    symbol: 'sats',
    label: 'Sats',
    amount: 0,
  },
  USD: {
    symbol: 'USD',
    label: 'USD',
    amount: 0,
  },
  LOCAL: {
    symbol: 'LOCAL',
    label: 'Local',
    amount: 0,
  },
}
const optionsCurrency = Object.entries(optionsCur).map(([key, value]) => ({
  label: value.label,
  value: key,
}))
console.log(optionsCurrency)

const optionsSelected = ref('HIVE')

defineComponent({
  name: 'TestingTransfers',
})

const sendFrom = ref('')
const sendTo = ref('brianoflondon')

const hiveAmount = computed(() => {
  console.log(optionsSelected.value)
  let answer = 0
  if (optionsSelected.value === 'HIVE') {
    answer = Number(amount.value).toFixed(3)
  }
  if (optionsSelected.value === 'HBD') {
    answer = Number(amount.value / storeAPIStatus.hiveHBDNumber).toFixed(3)
  }
  if (optionsSelected.value === 'sats') {
    answer = Number(amount.value / storeAPIStatus.hiveSatsNumber).toFixed(3)
  }
  if (optionsSelected.value === 'BTC') {
    answer = Number(amount.value / storeAPIStatus.hiveBTCNumber).toFixed(3)
  }
  if (optionsSelected.value === 'USD') {
    console.log(storeAPIStatus.apiStatus.crypto.hive.usd)
    answer = Number(
      amount.value / storeAPIStatus.apiStatus.crypto.hive.usd
    ).toFixed(3)
  }
  return answer
})

const allAmounts = computed(() => {
  return {
    HIVE: Number(hiveAmount.value).toFixed(3),
    HBD: Number(hiveAmount.value * storeAPIStatus.hiveHBDNumber).toFixed(3),
    sats: tidyNumber(
      (hiveAmount.value * storeAPIStatus.hiveSatsNumber).toFixed(0)
    ),
    USD: tidyNumber(
      (hiveAmount.value * storeAPIStatus.apiStatus.crypto.hive.usd).toFixed(2)
    ),
    LOCAL: tidyNumber(
      (hiveAmount.value * storeAPIStatus.apiStatus.crypto.hive.usd).toFixed(2)
    ),
  }
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

async function copyToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value)
    console.log('Value copied to clipboard:', value)
  } catch (error) {
    console.error('Failed to copy value to clipboard:', error)
  }
}

watch(optionsSelected, () => {
  console.log('optionSelected', optionsSelected.value)
  if (optionsSelected.value === 'sats') {
    btnAmounts.value = btnAmountsSats
  } else {
    btnAmounts.value = btnAmountsNormal
  }
})

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

const vAutofocus = {
  mounted(el) {
    el.focus()
  },
}

onMounted(() => {
  console.log(storeUser.hiveAccname)
  if (storeUser.hiveAccname) {
    sendFrom.value = storeUser.hiveAccname
    if (storeUser.hiveAccname === 'v4vapp.tre') {
      sendTo.value = 'deepcrypto8'
      memo.value = '100082561'
    }
  }
})
</script>
