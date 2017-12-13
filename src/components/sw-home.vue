<template>
  <div class="sw-page sw-home">
    <h1 class="sw-header">Welcome to StepWatch</h1>
    <ol class="sw-card-list">
      <li>
        <div class="sw-card">
          <div class="sw-category-text">
            Programs defined
          </div>
          <div class="sw-category-count">
            {{ programCount }}
          </div>
          <button v-if="programCount === 0" v-on:click="createProgram()" class="sw-button">Create New</button>          
          <button v-else v-on:click="listPrograms()" class="sw-button">Go to List</button>          
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'sw-home',
  data () {
    return {
      runs: this.$services.dataStore.getRuns(
        r => r.status === 'program'
      )
    }
  },
  computed: {
    programCount () {
      return this.runs.length
    },
    whereNext () {
      if (this.programCount === 0) {
        return 'Create New'
      } else {
        return 'Go to List'
      }
    }
  },
  methods: {
    createProgram () {
    },
    listPrograms () {
      this.$router.push('/runs/program')
    }
  }
}
</script>

<style scoped>
.sw-category-count {
  margin: 30px auto;
  font-size: xx-large;
}
</style>
