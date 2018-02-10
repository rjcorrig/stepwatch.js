<template>
  <div class="sw-page sw-run-list">
    <h1 class="sw-header">
      <button class="sw-action-button" @click="$router.go(-1)">
        <i class="material-icons">arrow_back</i>
      </button>
      <div class="sw-page-title">{{ title }}</div>
      <button v-if="type === 'program'" class="sw-action-button" @click="newProgram">
        <i title="New" class="material-icons">add_circle_outline</i>
      </button>
      <div v-else class="sw-header-right"></div>
    </h1>
    <div class="sw-content">
      <transition-group name="list" class="sw-card-list" tag="ol" v-if="runs.length">
        <sw-run-item class="list-item" v-for="run in runs" :run="run" :key="run.id" @remove="remove" @copy="copy" @create="create"/>
      </transition-group>
      <p v-else>
        No {{ title }}
      </p>
    </div>
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
      return program
    },
    copy (run) {
      let idx = this.runs.indexOf(run)
      let newRun = this.$services.dataStore.createRun(run)
      if (run.status === 'program') {
        newRun.status = 'program'
      }
      this.$services.dataStore.save()
      this.runs.splice(idx + 1, 0, newRun)
      return newRun
    },
    remove (run) {
      let idx = this.runs.indexOf(run)

      if (idx >= 0) {
        this.runs.splice(idx, 1)
      }
      this.$services.dataStore.deleteRun(run)
      this.$services.dataStore.save()
    },
    create (run) {
      let newRun = this.$services.dataStore.createRun(run)
      this.$services.dataStore.save()
      newRun.start()
      this.viewDetails(newRun)
      return newRun
    },
    viewDetails (run) {
      this.$router.push({
        name: 'sw-run',
        params: {
          id: run.id
        }
      })
    }
  },
  components: {
    swRunItem
  }
}
</script>

<style scoped>
</style>
