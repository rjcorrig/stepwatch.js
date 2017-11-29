<template>
  <div class="sw-page sw-runner">
    <h1 class="sw-header">{{ run.name }}</h1>
    <ol class="sw-runstep-list" v-if="run.steps.length">
      <sw-step v-for="step in run.steps" :step="step" :key="step.id" />
    </ol>
    <p v-else>
      No steps defined
    </p>
  </div>
</template>

<script>
import models from '@/stepwatch/models'
import swStep from './sw-step.vue'

export default {
  name: 'sw-run',
  data () {
    var run = new models.Run()
    var step1 = new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 })
    var step2 = new models.Step({ name: 'Run for 15 seconds', totalSeconds: 15 })
    var step3 = new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 })

    run.steps = [ step1, step2, step3 ]
    run.steps.forEach(function (step, i) {
      step.id = i
    })
    return {
      run: run
    }
  },
  components: {
    swStep
  }
}
</script>

<style>
.sw-page {
  /*opacity: 0;*/
  min-width: 300px;
  padding: 5px;
  margin: auto;
/*
  transition-property: opacity;
  transition-duration: 400ms;
*/
}

.sw-page.sw-active {
  opacity: 1;
}

.sw-page > h1 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
}

.sw-page div {
  text-align: center;
  margin: 5px;
}

ol.sw-runstep-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
