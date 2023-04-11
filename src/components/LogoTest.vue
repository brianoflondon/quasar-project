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

  // Logos should be in public folder not assets
  // https://www.youtube.com/watch?v=PkgUm_rlJgI&t=2s

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
</script>
