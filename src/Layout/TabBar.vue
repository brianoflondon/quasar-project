<template>
  <q-tabs no-caps class="bg-orange text-white shadow-2">
    <q-route-tab to="/login" exact replace :label="$t('login')" />
    <q-route-tab to="/transfer" exact replace :label="$t('transfer')" />
    <q-route-tab to="/testing" exact replace :label="$t('testing')" />
    <q-route-tab to="/images" exact replace :label="$t('images')" />
  </q-tabs>
</template>

<script setup></script>
