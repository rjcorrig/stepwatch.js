<template>
  <li class="sw-run-item">
    <div class="sw-card" v-on:click="viewDetails()" >
      <div>
        <div class="sw-card-title">{{ run.name }}</div>
        <i class="material-icons" :title="run.status">{{ statusIcon }}</i>
      </div>
      <div class="sw-counters">
        <div class="sw-progress">
          <progress max="100" :value="percentComplete">{{ percentComplete }}%</progress>
        </div>
        <div class="sw-run-steps-counter">{{ stepsCompleted }} / {{ run.steps.length }}</div>
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
    },
    statusIcon () {
      var icons = {
        'program': 'create',
        'created': 'star',
        'running': 'play_arrow',
        'paused': 'pause',
        'canceled': 'cancel',
        'complete': 'stop'
      }
      return icons[this.run.status]
    },
    canCopy () {
      return ['program', 'created', 'complete', 'canceled'].indexOf(this.run.status) >= 0
    },
    canEdit () {
      return ['program', 'created'].indexOf(this.run.status) >= 0
    },
    canDelete () {
      return ['program', 'created', 'complete', 'canceled'].indexOf(this.run.status) >= 0
    },
    canCancel () {
      return ['paused', 'running'].indexOf(this.run.status) >= 0
    },
    canPause () {
      return this.run.status === 'running'
    },
    canStart () {
      return ['paused', 'created'].indexOf(this.run.status) >= 0
    },
    canCreate () {
      return ['program', 'complete', 'canceled'].indexOf(this.run.status) >= 0
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
.sw-run-steps-counter {
  float: left;
}
</style>
