<template>
  <q-footer>
    <div class="text-center">
      <span class="btc-price q-pa-sm">
        <i class="fa-brands fa-btc" />&thinsp;
        <strong>${{ storeAPIStatus.bitcoin }}</strong>
      </span>
      <span class="hive-price q-pa-sm">
        <i class="fa-brands fa-hive" />&thinsp;
        <strong>
          ${{ storeAPIStatus.hive }}
          &thinsp;/&thinsp;
          {{ storeAPIStatus.hiveSats }}{{ $t('sats') }}
        </strong>
      </span>
      <span class="hbd-price q-pa-sm">
        HBD
        <strong>${{ storeAPIStatus.hbd }}</strong>
      </span>
      <span class="api-status-indicator q-pa-sm">
        <q-btn
          @click="showDialog"
          flat
          dense
          :title="storeAPIStatus.apiError ? $t('failure') : $t('working')"
        >
          {{ storeAPIStatus.statusDisp }}
        </q-btn>
      </span>
      <span class="keychain-status-indicator">
        <q-btn
          flat
          dense
          :title="
            storeAPIStatus.isKeychainIn
              ? $t('keychain_installed')
              : $t('keychain_missing')
          "
        >
          <img
            :src="
              storeAPIStatus.isKeychainIn
                ? '/keychain/hive-keychain-keys.svg'
                : '/keychain/hive-keychain-keys-missing.svg'
            "
            style="height: 15px; max-width: 15px"
          />
        </q-btn>
      </span>
      <q-btn
        icon="refresh"
        :title="$t('reload_prices')"
        flat
        dense
        @click="storeAPIStatus.update()"
      />
      <q-btn
        flat
        dense
        @click="$q.dark.toggle()"
        :title="
          $q.dark.isActive ? 'Change to light mode' : 'Change to dark mode'
        "
        :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
        size="sm"
      />
    </div>
  </q-footer>
</template>

<script setup>
import { defineComponent, onBeforeMount, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
import { useStoreUser } from 'src/stores/storeUser'
// import SystemStatus from 'src/components/SystemStatus.vue'
// import { systemStatus } from 'src/use/useSystemStatus'
import { useI18n } from 'vue-i18n'
const t = useI18n().t

const storeAPIStatus = useStoreAPIStatus()
storeAPIStatus.update()

const storeUser = useStoreUser()

const $q = useQuasar()
$q.dark.set('auto')

defineComponent({
  name: 'PricesBar',
})

const title = `${t('system_status_title')} ${storeAPIStatus.statusDisp}`

const message = `
  <em>I can</em>
  <span class="text-red">use</span>
  <strong>HTML</strong>
  ${t('system_status_intro')}
  `

function showDialog() {
  $q.dialog({
    title: title,
    message: message,
    html: true,
  })
    .onOk(() => {
      // console.log('OK')
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}
</script>

<!-- notice lang="sass" -->
<style lang="scss">
/* This is where your SCSS goes */
.body--dark {
  .q-footer {
    background-color: #03002c;
    color: #1876d2;
  }
}
</style>
