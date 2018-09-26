<template>
  <div class="sw-page sw-home">
    <h1 class="sw-header">
      <div class="sw-page-title">StepWatch</div>
    </h1>
    <div class="sw-content">
      <ol class="sw-card-list">
        <sw-run-category title="Programs" type="program" :filter="isProgram" />
        <sw-run-category title="Current Runs" type="running" :filter="isActive" />
        <sw-run-category title="History" type="history" :filter="isHistory" />
      </ol>
    </div>
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
