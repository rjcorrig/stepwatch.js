<template>
  <div class="sw-page sw-run-list">
    <h1 class="sw-header">
      <div class="sw-page-title">{{ title }}</div>
      <button v-if="type === 'program'" class="sw-action-button" v-on:click="newProgram">
        <i title="New" class="material-icons">add_circle_outline</i>
      </button>
    </h1>
    <transition-group name="list" class="sw-card-list" tag="ol" v-if="runs.length">
      <sw-run-item v-for="run in runs" :run="run" :key="run.id" v-on:remove="remove" />
    </transition-group>
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
    },
    remove (run) {
      console.log('swRunList#remove ' + run.id)
      var idx = this.runs.indexOf(run)

      if (idx >= 0) {
        this.runs.splice(idx, 1)
      }
      this.$services.dataStore.deleteRun(run)
      this.$services.dataStore.save()
    }
  },
  components: {
    swRunItem
  }
}
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: opacity .4s;
}

.list-enter, .list-leave-to {
  opacity: 0;
}
</style>
