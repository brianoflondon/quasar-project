<template>
  <div>
    <img :src="imageUrl" :width="size" :height="size" />
  </div>
</template>

<script setup>
// Logos should be in public folder not assets
// https://www.youtube.com/watch?v=PkgUm_rlJgI&t=2s

import { ref, computed } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    required: true,
  },
  shadow: {
    type: Boolean,
    default: false,
  },
})

const imageUrl = computed(() => {
  return '/logo/v4vapp-v002-no-shadow-scales.svg'
  if (props.size <= 50) {
    return '/logo/v4vapp-v002-no-logos.svg'
  } else if (props.size <= 100) {
    return '/logo/v4vapp-v002-no-logos.svg'
  } else {
    return '/logo/v4vapp-v002.svg'
  }
})
</script>

<!--
<template>
  <div class="v4vapp-logo">
    <img :src="getImageUrl(size)" :width="size" :height="size" />
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      required: true,
    },
  },


  methods: {
    getImageUrl(size) {
      if (size <= 50) {
        return '/logo/v4vapp-v002-no-logos.svg'
      } else if (size <= 100) {
        return '/logo/v4vapp-v002-no-logos.svg'
      } else {
        return '/logo/v4vapp-v002.svg'
      }
    },
  },
}
</script> -->
