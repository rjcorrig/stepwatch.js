<template>
  <li class="sw-step">
    <div class="sw-card">
      <div>
        <div class="sw-step-text">{{ step.name }}</div>
        <i class="material-icons" :title="step.status">{{ statusIcon }}</i>
      </div>
      <div class="sw-step-counters">
        <div class="sw-step-progress">
          <progress max="100" :value="percentComplete">{{ percentComplete }}%</progress>
        </div>
        <div class="sw-step-timer">{{ runSecondsClock }} / {{ totalSecondsClock }}</div>
      </div>
      <div class="sw-step-actions">
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
.sw-step-text {
  display: inline-block;
  vertical-align: middle;
}
.sw-step-text+i.material-icons {
  margin-left: 5px;
  vertical-align: middle;
}
.sw-step-counters {
  margin: 10px auto;
}
.sw-step-timer {
  float: right;
}
progress {
  width: 100%;
}
.sw-step-actions {
  clear: both;
  text-align: right;
  margin-bottom: -10px;
}
.sw-action-button {
  margin: 0;
  border: 0;
  background-color: white;
  font-size: xx-large;
}
</style>
