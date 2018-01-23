<template>
  <div v-if="run" class="sw-page sw-run">
    <h1 class="sw-header">
      <button class="sw-action-button" @click="$router.go(-1)">
        <i class="material-icons">keyboard_arrow_left</i>
      </button>
      <div class="sw-page-title">{{ run.name }}</div>
    </h1>
    <ol class="sw-card-list" v-if="run.steps.length">
      <sw-step v-for="step in run.steps" :step="step" :key="step.id" :isCurrentStep="run.steps.indexOf(step) === run.currentStep" v-on:cancel="run.cancel()" v-on:pause="run.pause()" v-on:start="run.start()" />
    </ol>
    <p v-else>
      No steps defined
    </p>
  </div>
  <div v-else class="sw-page sw-run">
    <h1 class="sw-header">Run not found</h1>
  </div>
</template>

<script>
import swStep from './sw-step.vue'

export default {
  name: 'sw-run',
  props: [ 'id' ],
  watch: {
    '$route' (to, from) {
      this.run = this.$services.dataStore.getRun(to.params.id)
    }
  },
  data () {
    const ticker = setInterval(() => {
      this.tick()
    }, 1000)

    return {
      run: this.$services.dataStore.getRun(this.id),
      ticker
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.suspend)
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
    }
  },
  components: {
    swStep
  }
}
</script>

<style scoped>
</style>
