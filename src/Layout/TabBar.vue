<template>
  <div class="tab-bar-top">
    <q-tabs no-caps class="shadow-2">
      <q-route-tab to="/login" exact replace :label="$t('login')" />
      <q-route-tab to="/transfer" exact replace :label="$t('transfer')" />
      <q-route-tab to="/testing" exact replace :label="$t('testing')" />
      <q-route-tab to="/images" exact replace :label="$t('images')" />
      <q-route-tab to="/status" exact replace :label="$t('status')" />
    </q-tabs>
  </div>
</template>

<script setup></script>

<style lang="scss">
.tab-bar-top {
  background-color: orange;
  color: #03002c;
}

.body--dark .tab-bar-top {
  background-color: #03002c;
  color: #1876d2;
}
</style>
