<template>
  <li class="sw-run-item">
    <div class="sw-card" @click="viewDetails" >
      <h2 class="sw-card-header">
        <div class="sw-header-left"></div>
        <div class="sw-card-title">{{ run.name }}</div>
        <div class="sw-header-right">
          <i class="material-icons" v-if="statusIcon" :title="run.status">{{ statusIcon }}</i>
        </div>
      </h2>
      <div class="sw-counters">
        <div class="sw-progress">
          <progress max="100" :value="percentComplete">{{ percentComplete }}%</progress>
        </div>
        <div class="sw-run-steps-counter">{{ stepsCompleted }} / {{ run.steps.length }}</div>
        <div class="sw-timer">
          <sw-digital-clock class="sw-timer-run" :seconds="run.runSeconds" /> / <sw-digital-clock class="sw-timer-total" :seconds="run.totalSeconds" />
        </div>
      </div>
      <div class="sw-actions">
        <button v-if="canCopy" @click.stop="copy" class="sw-action-button" title="Copy">
          <i class="material-icons">content_copy</i>
        </button>
        <button v-if="canEdit" @click.stop="edit" class="sw-action-button" title="Edit">
          <i class="material-icons">create</i>
        </button>
        <button v-if="canRemove" @click.stop="remove" class="sw-action-button" title="Delete">
          <i class="material-icons">delete</i>
        </button>
        <button v-if="canCancel" @click.stop="cancel" class="sw-action-button" title="Cancel">
          <i class="material-icons">cancel</i>
        </button>
        <button v-if="canPause" @click.stop="pause" class="sw-action-button" title="Pause">
          <i class="material-icons">pause</i>
        </button>
        <button v-if="canStart" @click.stop="start" class="sw-action-button" title="Start">
          <i class="material-icons">play_arrow</i>
        </button>
        <button v-if="canCreate" @click.stop="create" class="sw-action-button">
          <i v-if="run.status === 'program'" title="New Run" class="material-icons">open_in_new</i>
          <i v-else title="Relaunch" class="material-icons">redo</i>
        </button>
      </div>
    </div>
  </li>
</template>

<script>
import models from '@/stepwatch/models'
import swDigitalClock from './sw-digital-clock.vue'

export default {
  name: 'sw-run-item',
  components: { swDigitalClock },
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
      if (this.run.totalSeconds) {
        return 100 * (this.run.runSeconds / this.run.totalSeconds)
      } else {
        return 0
      }
    },
    statusIcon () {
      var icons = {
        'program': 'create',
        'running': 'play_arrow',
        'paused': 'pause',
        'canceled': 'cancel',
        'complete': 'done'
      }
      return icons[this.run.status]
    },
    canCopy () {
      return ['program', 'created', 'complete', 'canceled'].indexOf(this.run.status) >= 0
    },
    canEdit () {
      return ['program', 'created'].indexOf(this.run.status) >= 0
    },
    canRemove () {
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
    },
    copy () {
      this.$emit('copy', this.run)
    },
    edit () {
      console.log('swRunItem#edit')
    },
    remove () {
      this.$emit('remove', this.run)
    },
    cancel () {
      this.run.cancel()
    },
    pause () {
      this.run.pause()
    },
    start () {
      this.run.start()
      this.viewDetails()
    },
    create () {
      this.$emit('create', this.run)
    }
  }
}
</script>

<style scoped>
.sw-run-steps-counter {
  float: left;
}
</style>
