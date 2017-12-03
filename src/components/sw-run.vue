<template>
  <div v-if="run" class="sw-page sw-run">
    <h1 class="sw-header">{{ run.name }}</h1>
    <ol class="sw-card-list" v-if="run.steps.length">
      <sw-step v-for="step in run.steps" :step="step" :key="step.id" />
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
  data () {
    return {
      run: this.$services.dataStore.getRun(this.id)
    }
  },
  components: {
    swStep
  }
}
</script>

<style scoped>
</style>
