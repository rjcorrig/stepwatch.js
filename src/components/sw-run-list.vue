<template>
  <div class="sw-page sw-run-list">
    <h1 class="sw-header">
      <div class="sw-page-title">{{ title }}</div>
      <button v-if="type === 'program'" class="sw-action-button" @click="newProgram">
        <i title="New" class="material-icons">add_circle_outline</i>
      </button>
    </h1>
    <transition-group name="list" class="sw-card-list" tag="ol" v-if="runs.length">
      <sw-run-item class="list-item" v-for="run in runs" :run="run" :key="run.id" @remove="remove" @copy="copy" />
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
      let program = this.$services.dataStore.createProgram()
      this.$services.dataStore.save()
      this.runs.unshift(program)
    },
    copy (run) {
      let idx = this.runs.indexOf(run)
      let newRun = this.$services.dataStore.createRun(run)
      this.$services.dataStore.save()
      this.runs.splice(idx + 1, 0, newRun)
    },
    remove (run) {
      let idx = this.runs.indexOf(run)

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
.list-item {
  transition-property: transform;
  transition-duration: 1s;
}

.list-leave-active {
  position: absolute;
  visibility: hidden;
}

.list-enter, .list-leave-to {
  opacity: 0;
}
</style>
