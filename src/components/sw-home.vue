<template>
  <div class="sw-page sw-home">
    <h1 class="sw-header">Welcome to StepWatch</h1>
    <ol class="sw-card-list">
      <sw-run-category title="Programs defined" type="program" filter="isProgram" />
      <sw-run-category title="Runs in progress" type="running" filter="isActive" />
      <sw-run-category title="Run history" type="history" filter="isHistory" />
    </ol>
  </div>
</template>

<script>
import swRunCategory from './sw-run-category.vue'

export default {
  name: 'sw-home',
  data () {
    return {
      isProgram: r => r.status === 'program',
      isActive: r => ['paused', 'running', 'created'].indexOf(r.status) >= 0,
      isHistory: r => ['canceled', 'complete'].indexOf(r.status) >= 0
    }
  },
  components: {
    swRunCategory
  }
}
</script>

