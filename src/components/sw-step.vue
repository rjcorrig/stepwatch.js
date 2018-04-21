<template>
  <li class="sw-step">
    <div class="sw-card">
      <h2 class="sw-card-header">
        <div class="sw-header-left"></div>
        <div class="sw-card-title">{{ step.name }}</div>
        <div class="sw-header-right">
          <i class="material-icons" v-if="statusIcon" :title="step.status">{{ statusIcon }}</i>
        </div>
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
import log from 'loglevel'

export default {
  name: 'sw-step',
  components: { swDigitalClock },
  watch: {
    'step.status' (to, from) {
      if (to === 'running') {
        this.notifyRunning()
      } else if (to === 'paused') {
        this.notifyPaused()
      } else {
        this.notifyClear()
      }
    },
    'step.runSeconds' (to, from) {
      if (this.step.status === 'running') {
        this.notifyRunning()
      } else if (this.step.status === 'paused') {
        this.notifyPaused()
      }
    }
  },
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
      if (this.step.totalSeconds) {
        return 100 * (this.step.runSeconds / this.step.totalSeconds)
      } else {
        return 0
      }
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
      this.$emit('cancel')
    },
    pause () {
      this.$emit('pause')
    },
    start () {
      this.$emit('start')
    },
    notifyRunning () {
      log.info('notifyRunning: ' + this.step.name)
      this.$emit('notifyRunning', this.step)
    },
    notifyPaused () {
      log.info('notifyPaused: ' + this.step.name)
      this.$emit('notifyPaused', this.step)
    },
    notifyClear () {
      log.info('notifyClear: ' + this.step.name)
      this.$emit('notifyClear')
    }
  }
}
</script>

<style scoped>
</style>
