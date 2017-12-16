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
  props: [ 'type' ],
  data () {
    var runs, title

    switch (this.type) {
      case 'program': {
        title = 'Programs Defined'
        runs = this.$services.dataStore.getRuns(
          r => r.status === 'program'
        )
        break
      }
      case 'running': {
        title = 'Runs in progress'
        runs = this.$services.dataStore.getRuns(
          r => ['paused', 'running', 'created'].indexOf(r.status) >= 0
        )
        break
      }
      case 'history': {
        title = 'Run history'
        runs = this.$services.dataStore.getRuns(
          r => ['canceled', 'complete'].indexOf(r.status) >= 0
        )
        break
      }
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
