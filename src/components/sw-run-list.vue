<template>
  <div class="sw-page sw-run-list">
    <h1 class="sw-header">{{ title }}</h1>
    <ol class="sw-card-list" v-if="runs.length">
      <sw-run-item v-for="run in runs" :run="run" :key="run.id" />
    </ol>
    <button v-if="type === 'program'" class="sw-button">Create New</button>
  </div>
</template>

<script>
import swRunItem from './sw-run-item.vue'

export default {
  name: 'sw-run-list',
  props: {
    type: {
      type: String
    },
    title: {
      type: String,
      default: 'All runs and programs'
    },
    filter: {
      type: Function,
      default: r => true
    }
  },
  data () {
    return {
      runs: this.$services.dataStore.getRuns(this.filter)
    }
  },
  components: {
    swRunItem
  }
}
</script>

<style scoped>
</style>
