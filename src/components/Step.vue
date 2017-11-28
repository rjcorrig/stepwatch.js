<template>
  <li class="sw-runstep sw-card">
    <div class="sw-runstep-text">
        {{ step.name }}
    </div>
    <div class="sw-runstep-timer">
        {{ step.runSeconds }}
    </div>
    <button class="sw-runstep-toggle sw-button">Start</button>
  </li>
</template>

<script>
import models from '@/stepwatch/models'

export default {
  name: 'Step',
  props: {
    step: {
      type: models.Step,
      required: true
    }
  }
}
</script>

<style>
.sw-runstep-timer {
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
  padding: 5px 5px 10px 5px;
  text-align: center;
  width: 300px;
  margin: 10px auto;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}
</style>
