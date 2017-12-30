<template>
  <span>{{ clock }}</span>
</template>

<script>
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
      var start = this.seconds >= 3600 ? 11 : 14
      return new Date(1000 * this.seconds).toISOString().slice(start, 19)
    }
  }
}
</script>

<style scoped>
</style>
