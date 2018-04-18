<template>
  <span class="sw-digital-clock">{{ clock }}</span>
</template>

<script>
import utils from '@/stepwatch/utils'

export default {
  name: 'sw-digital-clock',
  props: {
    seconds: {
      type: Number,
      required: true
    }
  },
  computed: {
    clock () {
      return utils.formatSeconds(this.seconds)
    }
  }
}
</script>

<style scoped>
</style>
