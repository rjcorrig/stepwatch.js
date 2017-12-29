<template>
  <li class="sw-step">
    <div class="sw-card">
      <div>
        <div class="sw-card-title">{{ step.name }}</div>
        <i class="material-icons" :title="step.status">{{ statusIcon }}</i>
      </div>
      <div class="sw-counters">
        <div class="sw-progress">
          <progress max="100" :value="percentComplete">{{ percentComplete }}%</progress>
        </div>
        <div class="sw-timer">{{ runSecondsClock }} / {{ totalSecondsClock }}</div>
      </div>
      <div class="sw-actions">
        <button v-if="canCopy" class="sw-action-button" title="Copy"><i class="material-icons">content_copy</i></button>
        <button v-if="canEdit" class="sw-action-button" title="Edit"><i class="material-icons">create</i></button>
        <button v-if="canDelete" class="sw-action-button" title="Delete"><i class="material-icons">delete</i></button>
        <button v-if="canCancel" class="sw-action-button" title="Cancel"><i class="material-icons">cancel</i></button>
        <button v-if="canPause" class="sw-action-button" title="Pause"><i class="material-icons">pause</i></button>
        <button v-if="canStart" class="sw-action-button" title="Start"><i class="material-icons">play_arrow</i></button>
        <button v-if="canCreate" class="sw-action-button" title="New Run"><i class="material-icons">star</i></button>
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
        'created': 'star',
        'running': 'play_arrow',
        'paused': 'pause',
        'canceled': 'cancel',
        'complete': 'stop'
      }
      return icons[this.step.status]
    },
    canCopy () {
      return false
    },
    canEdit () {
      return false
    },
    canDelete () {
      return false
    },
    canCancel () {
      return ['paused', 'running'].indexOf(this.step.status) >= 0
    },
    canPause () {
      return this.step.status === 'running'
    },
    canStart () {
      return ['paused', 'created'].indexOf(this.step.status) >= 0
    },
    canCreate () {
      return false
    }
  }
}
</script>

<style scoped>
</style>
