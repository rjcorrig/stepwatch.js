<template>
  <div class="sw-page sw-run-list">
    <h1 class="sw-header">{{ title }}</h1>
    <ol class="sw-card-list" v-if="runs.length">
      <sw-run-item v-for="run in runs" :run="run" :key="run.id" />
    </ol>
    <p v-else>
      No runs of type {{ type }} found
    </p>
    <button class="sw-button">Create New</button>
  </div>
</template>

<script>
import swRunItem from './sw-run-item.vue'

export default {
  name: 'sw-run-list',
  props: [ 'type' ],
  data () {
    var runs, title
    if (this.type === 'program') {
      title = 'Programs Defined'
      runs = this.$services.dataStore.getRuns(
        r => r.status === 'program'
      )
    } else {
      title = 'Run History'
      runs = this.$services.dataStore.getRuns(
        r => r.status !== 'program'
      )
    }
    return {
      runs: runs,
      title: title
    }
  },
  components: {
    swRunItem
  }
}
</script>

<style scoped>
</style>
