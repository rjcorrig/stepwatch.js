<template>
  <li class="sw-step">
    <div class="sw-card">
      <div class="sw-step-text">
          {{ step.name }}
      </div>
      <div class="sw-step-timer">
          {{ runSecondsClock }}
      </div>
      <button class="sw-step-toggle sw-button">Start</button>
    </div>
  </li>
</template>

<script>
import models from '@/stepwatch/models'

export default {
  name: 'sw-step',
  props: {
    step: {
      type: models.Step,
      required: true
    }
  },
  computed: {
    runSecondsClock () {
      var start = (this.step.runSeconds >= 3600 ? 11 : 14)
      return new Date(1000 * this.step.runSeconds).toISOString().slice(start, 19)
    }
  }
}
</script>

<style scoped>
.sw-step-timer {
  margin: 30px auto;
  font-size: xx-large;
}
</style>
