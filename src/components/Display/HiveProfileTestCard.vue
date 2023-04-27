<template>
  <div v-if="hiveProfile">
    <q-card class="test-card" style="max-width: 250">
      <q-card-section>
        <q-img :src="hiveAvatar">
          <div class="absolute-bottom text-subtitle2 text-center">
            {{ hiveProfile.name }}<br />
            @{{ hiveProfile.hive_accname }}
          </div>
        </q-img>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useHiveAvatarRef } from 'src/use/useHive'
const props = defineProps({
  hiveProfile: {
    type: Object,
    required: true,
  },
})

const hiveAvatar = useHiveAvatarRef({
  hiveAccname: props.hiveProfile.hive_accname,
})
</script>

<style lang="sass" scoped>
.test-card
  width: 100%
  max-width: 400px
  height: 100%

  .img
    width: 100%
    height: 100%
    object-fit: cover
</style>
