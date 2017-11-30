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

.sw-button {
  margin: auto;
  font-size: xx-large;
  height: 1.5em;
  width: 6em;
}

.sw-card {
  padding: 10px 5px 10px 5px;
  text-align: center;
  width: 300px;
  margin: 10px auto;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}
</style>
