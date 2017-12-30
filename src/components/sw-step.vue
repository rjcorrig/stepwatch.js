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
        <div class="sw-timer">
          <sw-digital-clock class="sw-timer-run" :seconds="step.runSeconds" /> / <sw-digital-clock class="sw-timer-total" :seconds="step.totalSeconds" />
        </div>
      </div>
      <div class="sw-actions">
        <button v-if="canCancel" v-on:click.stop="cancel" class="sw-action-button" title="Cancel">
          <i class="material-icons">cancel</i>
        </button>
        <button v-if="canPause" v-on:click.stop="pause" class="sw-action-button" title="Pause">
          <i class="material-icons">pause</i>
        </button>
        <button v-if="canStart" v-on:click.stop="start" class="sw-action-button" title="Start">
          <i class="material-icons">play_arrow</i>
        </button>
      </div>
    </div>
  </li>
</template>

<script>
import models from '@/stepwatch/models'
import swDigitalClock from './sw-digital-clock.vue'

export default {
  name: 'sw-step',
  components: { swDigitalClock },
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
  },
  methods: {
    cancel () {
      console.log('swStep#cancel')
    },
    pause () {
      console.log('swStep#pause')
    },
    start () {
      console.log('swStep#start')
    }
  }
}
</script>

<style scoped>
</style>
