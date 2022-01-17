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
      runs: this.$store.getters.getRuns(this.filter)
    }
  },
  methods: {
    async newProgram () {
      const program = await this.$store.dispatch('createProgram')
      await this.$store.dispatch('save')
      this.runs.unshift(program)
      return program
    },
    async copy (run) {
      const idx = this.runs.indexOf(run)
      const newRun = await this.$store.dispatch('createRun', run)
      if (run.status === 'program') {
        newRun.status = 'program'
      }
      await this.$store.dispatch('save')
      this.runs.splice(idx + 1, 0, newRun)
      return newRun
    },
    async remove (run) {
      const idx = this.runs.indexOf(run)

      if (idx >= 0) {
        this.runs.splice(idx, 1)
      }
      await this.$store.dispatch('deleteRun', run)
      await this.$store.dispatch('save')
    },
    async create (run) {
      const newRun = await this.$store.dispatch('createRun', run)
      await this.$store.dispatch('save')
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
