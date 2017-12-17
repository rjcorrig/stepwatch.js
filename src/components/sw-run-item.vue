<template>
  <li class="sw-run-item">
    <div class="sw-card">
      <div class="sw-run-text">{{ run.name }}</div>
      <div class="sw-run-timer">{{ runSecondsClock }}</div>
      <button v-on:click="viewDetails()" class="sw-button">Details</button>
    </div>
  </li>
</template>

<script>
import models from '@/stepwatch/models'

export default {
  name: 'sw-run-item',
  props: {
    run: {
      type: models.Run,
      required: true
    }
  },
  computed: {
    runSecondsClock () {
      var total = 0
      for (var step of this.run.steps) {
        total += step.runSeconds
      }
      var start = (total >= 3600 ? 11 : 14)
      return new Date(1000 * total).toISOString().slice(start, 19)
    }
  },
  methods: {
    viewDetails () {
      this.$router.push({
        name: 'sw-run',
        params: {
          id: this.run.id
        }
      })
    }
  }
}
</script>

<style scoped>
.sw-run-timer {
  margin: 30px auto;
  font-size: xx-large;
}
</style>
