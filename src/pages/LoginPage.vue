<template>
  <q-page>
    <div>
      <HiveKeyChainLogin />
    </div>
  </q-page>
  <q-footer>
    <PricesBar />
  </q-footer>
</template>

<script setup>
import HiveKeyChainLogin from 'src/components/HiveKeychainLogin.vue'
import PricesBar from 'src/components/PricesBar.vue'

</script>
