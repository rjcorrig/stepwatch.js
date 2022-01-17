<template>
  <div v-if="run" class="sw-page sw-run-editor">
    <form @submit.prevent="save">
      <h1 class="sw-header">
        <button type="button" class="sw-action-button" @click="$router.go(-1)" title="Cancel">
          <i class="material-icons">cancel</i>
        </button>
        <div class="sw-page-title">Edit</div>
        <button class="sw-action-button" title="Save" v-if="canSave">
          <i class="material-icons">done</i>
        </button>
        <div v-else class="sw-header-right"></div>
      </h1>
      <div class="sw-content">
        <div class="sw-name-editor">
          <input type="text" name="name" v-model="run.name" placeholder="Run Name" required="required" autofocus="autofocus" />
          <label for="name">Run Name:</label>
        </div>
        <div class="sw-counters">
          <div class="sw-run-steps-counter">{{ run.steps.length }} step{{ run.steps.length !== 1 ? 's' : '' }}</div>
          <div class="sw-timer">
            <sw-digital-clock class="sw-timer-total" :seconds="totalSeconds" />
          </div>
        </div>
        <transition-group name="list" class="sw-card-list" tag="ol" v-if="run.steps.length">
          <sw-step-editor class="list-item" v-for="(step, index) in run.steps" :step="step" :key="step.id" @remove="remove" @copy="copy" :canMoveUp="index !== 0" @moveUp="moveUp" :canMoveDown="index !== run.steps.length - 1" @moveDown="moveDown" />
        </transition-group>
        <button type="button" class="sw-action-button" @click="newStep">
          <i title="New Step" class="material-icons">add_circle_outline</i>
        </button>
      </div>
    </form>
  </div>
  <div v-else class="sw-page sw-run-editor">
    <div class="sw-content">
      <h1 class="sw-header">Run not found</h1>
    </div>
  </div>
</template>

<script>
import SwStepEditor from './sw-step-editor.vue'
import SwDigitalClock from './sw-digital-clock.vue'
import Step from '@/stepwatch/models/step'
import Run from '@/stepwatch/models/run'

export default {
  name: 'sw-run',
  props: ['id'],
  watch: {
    '$route' (to, from) {
      this.original = this.$store.getters.getRun(to.params.id)
      this.run = new Run(this.original)
    }
  },
  data () {
    const original = this.$store.getters.getRun(this.id)
    return {
      original,
      run: new Run(original)
    }
  },
  computed: {
    canSave () {
      return this.run.name.length > 0 && this.run.steps.every(function (s) {
        return s.name.length > 0 && s.totalSeconds > 0
      })
    },
    totalSeconds () {
      return this.run.steps.reduce((sum, step) => sum + Number(step.totalSeconds), 0)
    }
  },
  methods: {
    async save (e) {
      if (e.target.checkValidity()) {
        await this.$store.dispatch('deleteRun', this.original)
        this.run.totalSeconds = this.totalSeconds
        await this.$store.dispatch('saveRun', this.run)
        await this.$store.dispatch('save')
        this.$router.go(-1)
      }
    },
    newStep () {
      const step = new Step()
      this.run.steps.push(step)
      return step
    },
    copy (step) {
      const idx = this.run.steps.indexOf(step)
      const newStep = new Step(step)
      newStep.initialize()
      this.run.steps.splice(idx + 1, 0, newStep)
      return newStep
    },
    remove (step) {
      const idx = this.run.steps.indexOf(step)

      if (idx >= 0) {
        this.run.steps.splice(idx, 1)
      }
    },
    moveUp (step) {
      const idx = this.run.steps.indexOf(step)
      if (idx > 0) {
        this.run.steps.splice(idx, 1)
        this.run.steps.splice(idx - 1, 0, step)
      }
    },
    moveDown (step) {
      const idx = this.run.steps.indexOf(step)
      if (idx > -1 && idx < this.run.steps.length - 1) {
        this.run.steps.splice(idx, 1)
        this.run.steps.splice(idx + 1, 0, step)
      }
    }
  },
  components: {
    SwStepEditor,
    SwDigitalClock
  }
}
</script>

<style scoped>
button {
  padding: 0;
}

.sw-run-steps-counter {
  float: left;
  padding-bottom: 5px;
}

.sw-card-list {
  clear: both;
}

.sw-name-editor {
  text-align: left;
  display: flex;
  flex-direction: column-reverse;
}

.sw-name-editor input[type="text"] {
  font-size: 2em;
  width: 100%;
  margin: 0;
  padding: 0;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
}

.sw-name-editor input:invalid {
  border-color: red;
  color: red;
}

.sw-name-editor input:invalid + label {
  color: red;
}

.sw-step-list-label {
  margin-top: 15px;
  text-align: left;
}

.sw-card-list {
  margin-top: -5px;
}
</style>
