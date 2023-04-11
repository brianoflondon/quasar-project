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
        return 'src/assets/logo/v4vapp-v002-no-logos.svg'
      } else if (size <= 100) {
        return 'src/assets/logo/v4vapp-v002-no-logos.svg'
      } else {
        return 'src/assets/logo/v4vapp-v002.svg'
      }
    },
  },
}
</script>
