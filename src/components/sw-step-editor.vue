<template>
  <li class="sw-step-editor">
    <div class="sw-card">
      <h2 class="sw-card-header">
        <div class="sw-header-left"></div>
        <div class="sw-card-title">{{ step.name }}</div>
        <div class="sw-header-right"></div>
      </h2>
      <sw-digital-clock class="sw-timer-total" :seconds="step.totalSeconds" />
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
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
