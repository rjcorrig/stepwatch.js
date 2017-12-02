<template>
  <div class="sw-page sw-run">
    <h1 class="sw-header">{{ run.name }}</h1>
    <ol class="sw-card-list" v-if="run.steps.length">
      <sw-step v-for="step in run.steps" :step="step" :key="step.id" />
    </ol>
    <p v-else>
      No steps defined
    </p>
  </div>
</template>

<script>
import models from '@/stepwatch/models'
import swStep from './sw-step.vue'

export default {
  name: 'sw-run',
  props: {
    run: {
      type: models.Run,
      required: true
    }
  },
  components: {
    swStep
  }
}
</script>

<style scoped>
</style>
