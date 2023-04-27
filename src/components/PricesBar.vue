<template>
  <q-footer>
    <div class="text-center">
      <span class="price-bar-item btc-price q-pa-xs">
        <i class="fa-brands fa-btc" />&thinsp;
        <strong>${{ storeAPIStatus.bitcoin }}</strong>
      </span>
      <span class="price-bar-item hive-price q-pa-xs">
        <i class="fa-brands fa-hive" />&thinsp;
        <strong>
          ${{ storeAPIStatus.hive }}
          &thinsp;/&thinsp;
          {{ storeAPIStatus.hiveSats }}{{ $t('sats') }}
        </strong>
      </span>
      <span class="price-bar-item hbd-price q-pa-xs">
        HBD
        <strong>${{ storeAPIStatus.hbd }}</strong>
      </span>
      <span class="price-bar-item api-status-indicator q-pa-xs">
        <q-btn
          @click="alert = true"
          flat
          dense
          :title="storeAPIStatus.apiError ? $t('failure') : $t('working')"
        >
          {{ storeAPIStatus.statusDisp }}
        </q-btn>
      </span>
      <span class="price-bar-item keychain-status-indicator q-pa-xs">
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
      <span class="price-bar-item reload-status q-pa-xs">
        <q-btn
          icon="refresh"
          :title="$t('reload_prices')"
          flat
          dense
          @click="storeAPIStatus.update()"
        />
      </span>
      <span class="price-bar-item dark-toggle q-pa-xs">
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
      </span>
    </div>
  </q-footer>
  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">System Status</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <SystemStatus />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useStoreAPIStatus } from 'src/stores/storeAPIStatus'
import { useStoreUser } from 'src/stores/storeUser'
import SystemStatus from 'src/components/SystemStatus.vue'
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

const alert = ref(false)
</script>

<style lang="scss">
/* This is where your SCSS goes */
.body--dark {
  .q-footer {
    background-color: #03002c;
    color: #1876d2;
  }
}
</style>
