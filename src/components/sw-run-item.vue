<template>
  <li class="sw-run-item">
    <div class="sw-card">
      <div class="sw-run-text">
          {{ run.name }}
      </div>
      <div class="sw-run-timer">
          {{ runSecondsClock }}
      </div>
      <button class="sw-button">Start</button>
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
  }
}
</script>

<style scoped>
.sw-run-timer {
  margin: 30px auto;
  font-size: xx-large;
}
</style>
