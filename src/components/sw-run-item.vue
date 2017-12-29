<template>
  <li class="sw-run-item">
    <div class="sw-card" v-on:click="viewDetails()" >
      <div class="sw-run-text">{{ run.name }}</div>
      <div class="sw-run-counters">
        <div class="sw-run-progress">
          <progress max="100" :value="percentComplete">{{ percentComplete }}%</progress>
        </div>
        <div class="sw-run-steps-counter">{{ stepsCompleted }} / {{ run.steps.length }}</div>
        <div class="sw-run-timer">{{ runSecondsClock }} / {{ totalSecondsClock }}</div>
      </div>
      <div class="sw-run-actions">
        <button class="sw-action-button" title="Copy">A</button>
        <button class="sw-action-button" title="Edit">A</button>
        <button class="sw-action-button" title="Delete">A</button>
        <button class="sw-action-button" title="Cancel">A</button>
        <button class="sw-action-button" title="Pause">A</button>
        <button class="sw-action-button" title="Start">A</button>
        <button class="sw-action-button" title="Create">A</button>
      </div>
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
    stepsCompleted () {
      return this.run.currentStep || 0
    },
    percentComplete () {
      return 100 * (this.run.runSeconds / this.run.totalSeconds)
    },
    runSecondsClock () {
      var start = this.run.runSeconds >= 3600 ? 11 : 14
      return new Date(1000 * this.run.runSeconds).toISOString().slice(start, 19)
    },
    totalSecondsClock () {
      var start = this.run.totalSeconds >= 3600 ? 11 : 14
      return new Date(1000 * this.run.totalSeconds).toISOString().slice(start, 19)
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
.sw-run-counters {
  margin: 10px auto;
}
.sw-run-steps-counter {
  float: left;
}
.sw-run-timer {
  float: right;
}
.sw-run-actions {
  clear: both;
  text-align: right;
  margin-bottom: -10px;
}
progress {
  width: 100%;
}
.sw-action-button {
  margin: 0;
  border: 0;
  background-color: white;
  font-size: xx-large;
}
</style>
