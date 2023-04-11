<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Lazy filter"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
        hint="With hide-selected and fill-input"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

  </div>
</template>

<script setup>
import { ref , watch} from 'vue'

const stringOptions = []
const options = ref(stringOptions)
const model = ref(null) // Hive Account Name


// async function filterFn(val, update, abort) {
//   // call abort() at any time if you can't retrieve data somehow

//   const accounts = await searchHiveUsernames(val)
//   console.log(accounts)
//   options.value = accounts

//   // update(() => {
//   //   if (val === '') {
//   //     options.value = stringOptions
//   //   } else {
//   //     const needle = val.toLowerCase()
//   //     options.value = searchHiveUsernames(needle)
//   //     // options.value = stringOptions.filter(
//   //     //   (v) => v.toLowerCase().indexOf(needle) > -1
//   //     // )
//   //   }
//   // })
// }

const hiveCall = ref('')

function abortFilterFn() {
  console.log('delayed filter aborted')
}


async function searchHiveUsernames(val) {
  console.log(val)
  if (val.length < 2) {
    return
  }
  try {
    const res = await hiveTx.call('condenser_api.get_account_reputations', [val, 3])
    console.log(res.result)
    const accounts = res.result.map(el => el.account)
    console.log(accounts)
    return accounts
  } catch (err) {
    console.log(err)
  }
  // hiveTx
  //   .call('condenser_api.get_accounts', [['mahdiyari']])
  //   .then((res) => (hiveCall.value = res.result))
}

// searchHiveUsernames (val) {
//   if (val.length < 2) {
//     return
//   }
//   const partialusername = val.toLowerCase()

//   this.$hive.api.getAccountReputationsAsync(partialusername, 5, (err, data) => {
//     if (err) {
//       console.error(err)
//     } else {
//       const accounts = data.map(el => {
//         return el.account
//       }).filter(el => {
//         return this.badActors.indexOf(el) === -1
//       })
//       this.usernameSuggestions = accounts
//     }
//   })
</script>
