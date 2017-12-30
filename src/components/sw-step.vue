<template>
  <li class="sw-step">
    <div class="sw-card">
      <h2>
        <div class="sw-card-title">{{ step.name }}</div>
        <i v-if="statusIcon" class="material-icons" :title="step.status">{{ statusIcon }}</i>
      </h2>
      <div class="sw-counters">
        <div class="sw-progress">
          <progress max="100" :value="percentComplete">{{ percentComplete }}%</progress>
        </div>
        <div class="sw-timer">{{ runSecondsClock }} / {{ totalSecondsClock }}</div>
      </div>
      <div class="sw-actions">
        <button v-if="canCancel" class="sw-action-button" title="Cancel"><i class="material-icons">cancel</i></button>
        <button v-if="canPause" class="sw-action-button" title="Pause"><i class="material-icons">pause</i></button>
        <button v-if="canStart" class="sw-action-button" title="Start"><i class="material-icons">play_arrow</i></button>
      </div>
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
    },
    isCurrentStep: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    percentComplete () {
      return 100 * (this.step.runSeconds / this.step.totalSeconds)
    },
    runSecondsClock () {
      var start = (this.step.runSeconds >= 3600 ? 11 : 14)
      return new Date(1000 * this.step.runSeconds).toISOString().slice(start, 19)
    },
    totalSecondsClock () {
      var start = (this.step.totalSeconds >= 3600 ? 11 : 14)
      return new Date(1000 * this.step.totalSeconds).toISOString().slice(start, 19)
    },
    statusIcon () {
      var icons = {
        'running': 'play_arrow',
        'paused': 'pause',
        'canceled': 'cancel',
        'complete': 'done'
      }
      return icons[this.step.status]
    },
    canCancel () {
      return this.isCurrentStep && ['paused', 'running'].indexOf(this.step.status) >= 0
    },
    canPause () {
      return this.isCurrentStep && this.step.status === 'running'
    },
    canStart () {
      return this.isCurrentStep && ['paused', 'created'].indexOf(this.step.status) >= 0
    }
  }
}
</script>

<style scoped>
</style>
