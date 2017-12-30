<template>
  <div class="sw-page sw-run-list">
    <h1 class="sw-header">
      <div class="sw-page-title">{{ title }}</div>
      <button v-if="type === 'program'" class="sw-action-button" v-on:click="newProgram">
        <i title="New" class="material-icons">add_circle_outline</i>
      </button>
    </h1>
    <ol class="sw-card-list" v-if="runs.length">
      <sw-run-item v-for="run in runs" :run="run" :key="run.id" />
    </ol>
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
  methods: {
    newProgram () {
      console.log('swRunList#newProgram')
    }
  },
  components: {
    swRunItem
  }
}
</script>

<style scoped>
</style>
