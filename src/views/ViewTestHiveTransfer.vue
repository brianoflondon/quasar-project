<template>
  <q-page>
    <h4>Send a Transfer</h4>
    <q-input filled v-model="sendFrom" label="Sending From:" stack-label />
    <q-input filled v-model="sendTo" label="Sending To:" stack-label />
    <div class="row">
      <div class="col-4">
        <q-input
          filled
          v-model="amount"
          label="Amount to Send:"
          stack-label
          v-autofocus
        />
      </div>
      <div class="col-4">
        <q-select
          filled
          v-model="optionsSelected"
          :options="optionsCurrency"
          label="Currency:"
        />
      </div>
      <div class="col"><q-btn @click="sendTransfer">Send</q-btn></div>
    </div>
    <q-input
      filled
      :editable="false"
      :readonly="true"
      v-model="hiveAmount"
      label="Hive Amount:"
      stack-label
    />
    <q-input filled v-model="memo" label="Memo:" stack-label />
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

const amount = ref('')
const memo = ref('')

const optionsCurrency = ['HIVE', 'HBD', 'sats']
const optionsSelected = ref('HIVE')

defineComponent({
  name: 'TestingTransfers',
})

const sendFrom = ref('')
const sendTo = ref('brianoflondon')

const hiveAmount = computed(() => {
  if (optionsSelected.value === 'HIVE') {
    return Number(amount.value).toFixed(3)
  }
  if (optionsSelected.value === 'HBD') {
    return Number(amount.value * storeAPIStatus.hiveHBDNumber).toFixed(3)
  }
  if (optionsSelected.value === 'sats') {
    console.log(storeAPIStatus.hiveSatsNumber)
    return Number(amount.value / storeAPIStatus.hiveSatsNumber).toFixed(3)
  }
  return 99
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
        enforce: false,
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
