<template>
  <div v-if="run" class="sw-page sw-run">
    <h1 class="sw-header">
      <button class="sw-action-button" @click="$router.go(-1)">
        <i class="material-icons">arrow_back</i>
      </button>
      <div class="sw-page-title marquee-wrap">
        <vue-marquee :content="run.name" speed="slow" :showtwo="false"></vue-marquee>
      </div>
      <div class="sw-header-right"></div>
    </h1>
    <div class="sw-content">
      <ol class="sw-card-list" v-if="run.steps.length">
        <sw-step v-for="(step, index) in run.steps" :step="step" :key="step.id" :isCurrentStep="index === run.currentStep" @cancel="run.cancel()" @pause="run.pause()" @start="run.start()" @notifyRunning="notifyRunning" @notifyPaused="notifyPaused" @notifyClear="notifyClear"/>
      </ol>
      <p v-else>
        No steps defined
      </p>
    </div>
  </div>
  <div v-else class="sw-page sw-run">
    <div class="sw-content">
      <h1 class="sw-header">Run not found</h1>
    </div>
  </div>
</template>

<script>
import swStep from './sw-step.vue'
import VueMarquee from 'vue-marquee-ho'
import Css from 'vue-marquee-ho/dist/vue-marquee.min.css' // eslint-disable-line no-unused-vars
import runCompleteSound from '@/assets/audio/run-complete.mp3'
import stepCompleteSound from '@/assets/audio/step-complete.mp3'
import path from 'path'

const ID_PAUSED = 1
const ID_RUNNING = 2

export default {
  name: 'sw-run',
  props: [ 'id' ],
  watch: {
    '$route' (to, from) {
      this.$services.dataStore.save()
      this.run = this.$services.dataStore.getRun(to.params.id)
    },
    'run.currentStep' (to, from) {
      this.$services.dataStore.save()
      if (to > 0 && this.sounds.stepComplete) {
        this.sounds.stepComplete.play()
      }
    },
    'run.status' (to, from) {
      this.$services.dataStore.save()
      if (to === 'complete') {
        this.notifyComplete()
      }
    }
  },
  data () {
    const ticker = setInterval(() => {
      this.tick()
    }, 1000)

    let stepComplete
    let runComplete
    if (window.Audio) {
      stepComplete = new Audio(stepCompleteSound)
      runComplete = new Audio(runCompleteSound)
    }

    return {
      run: this.$services.dataStore.getRun(this.id),
      ticker,
      sounds: {
        stepComplete,
        runComplete
      }
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.suspend)

    if (window.cordova) {
      cordova.plugins.notification.local.on('toggleclick', this.toggleClickHandler, this)
      cordova.plugins.notification.local.on('cancelclick', this.cancelClickHandler, this)
      console.log('REGISTERED NOTIFICATION HANDLERS')
    }
  },
  beforeDestroy () {
    this.suspend()
  },
  methods: {
    tick () {
      if (this.run) {
        this.run.tick()
      }
    },
    suspend () {
      clearInterval(this.ticker)
      if (this.run) {
        this.run.pause()
      }
      this.$services.dataStore.save()
      window.removeEventListener('beforeunload', this.suspend)
      this.notifyClear()

      if (window.cordova) {
        cordova.plugins.notification.local.un('toggleclick', this.toggleClickHandler)
        cordova.plugins.notification.local.un('cancelclick', this.cancelClickHandler)
        console.log('UNREGISTERED NOTIFICATION HANDLERS')
      }
    },
    notifyComplete () {
      if (window.cordova) {
        cordova.plugins.notification.local.getIds((ids) => {
          let id = ids.reduce((max, id) => id > max ? id : max, ID_RUNNING)

          cordova.plugins.notification.local.schedule({
            id: id + 1,
            title: 'StepWatch',
            text: `Run ${this.run.name} completed`,
            sound: 'file://' + path.normalize(runCompleteSound),
            smallIcon: 'ic_checkmark_holo_light',
            data: { runId: this.run.id }
          })
        })

        cordova.plugins.backgroundMode.disable()
        console.log('BACKGROUND MODE OFF')
      } else if (this.sounds.runComplete) {
        this.sounds.runComplete.play()
      }
    },
    notifyRunning (step) {
      if (window.cordova) {
        // Allow running in background
        cordova.plugins.backgroundMode.enable()
        console.log('BACKGROUND MODE ON')

        cordova.plugins.notification.local.cancel([ID_PAUSED])

        cordova.plugins.notification.local.isPresent(ID_RUNNING, (present) => {
          let secondsLeft = step.totalSeconds - step.runSeconds
          let start = secondsLeft >= 3600 ? 11 : 14
          let remaining = new Date(1000 * secondsLeft).toISOString().slice(start, 19)
          let text = `${remaining} remaining`

          let progressBar = { value: step.runSeconds, maxValue: step.totalSeconds }

          if (present) {
            cordova.plugins.notification.local.update({
              id: ID_RUNNING, text, progressBar
            })
          } else {
            cordova.plugins.notification.local.schedule({
              id: ID_RUNNING,
              text,
              progressBar,
              smallIcon: 'ic_media_play',
              title: step.name,
              sound: null,
              clock: false,
              sticky: true,
              data: {
                runId: this.run.id,
                stepId: step.id
              },
              actions: [
                { id: 'toggleclick', title: 'Pause' },
                { id: 'cancelclick', title: 'Cancel' }
              ]
            })
          }
        })
      }
    },
    notifyPaused (step) {
      if (window.cordova) {
        cordova.plugins.notification.local.cancel([ID_RUNNING])

        cordova.plugins.notification.local.isPresent(ID_PAUSED, (present) => {
          let secondsLeft = step.totalSeconds - step.runSeconds
          let start = secondsLeft >= 3600 ? 11 : 14
          let remaining = new Date(1000 * secondsLeft).toISOString().slice(start, 19)
          let text = `${remaining} remaining`

          let progressBar = { value: step.runSeconds, maxValue: step.totalSeconds }

          if (present) {
            cordova.plugins.notification.local.update({
              id: ID_PAUSED, text, progressBar
            })
          } else {
            cordova.plugins.notification.local.schedule({
              id: ID_PAUSED,
              text,
              progressBar,
              smallIcon: 'ic_media_pause',
              title: step.name,
              sound: null,
              clock: false,
              sticky: true,
              data: {
                runId: this.run.id,
                stepId: step.id
              },
              actions: [
                { id: 'toggleclick', title: 'Resume' },
                { id: 'cancelclick', title: 'Cancel' }
              ]
            })
          }
        })

        // Turn off background mode
        cordova.plugins.backgroundMode.disable()
        console.log('BACKGROUND MODE OFF')
      }
    },
    notifyClear () {
      if (window.cordova) {
        cordova.plugins.notification.local.cancel([ID_PAUSED, ID_RUNNING])
        // Turn off background mode
        cordova.plugins.backgroundMode.disable()
        console.log('BACKGROUND MODE OFF')
      }
    },
    toggleClickHandler (notification, eopts) {
      console.log('TOGGLECLICK ' + JSON.stringify(notification) + ' opts: ' + eopts)
      if (this.run.status === 'running') {
        this.run.pause()
      } else if (this.run.status === 'paused') {
        this.run.start()
      }
      this.notifyUpdate(this.run.steps[this.run.currentStep])
    },
    cancelClickHandler (notification, eopts) {
      console.log('CANCELCLICK ' + JSON.stringify(notification) + ' opts: ' + eopts)
      this.run.cancel()
    }
  },
  components: {
    swStep,
    'vue-marquee': VueMarquee
  }
}
</script>

<style>
/* Override default styling from vue-marquee */
.sw-page-title .marquee-content .text1 {
  padding-right: 0px;
  font-size: inherit; 
}

.sw-page-title .marquee-content .text2 {
  padding-left: 40px;
  padding-right: 40px;
  font-size: inherit; 
}

.sw-page-title.marquee-wrap .marquee-box {
  color: inherit;
  font-size: inherit;
  background-size: initial;
  height: initial;
  line-height: initial;
}

.sw-page-title .marquee-content p {
  font-size: inherit;
}
</style>
