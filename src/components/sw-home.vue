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
          <button class="sw-button">{{ whereNext }}</button>
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
  }
}
</script>

<style scoped>
.sw-category-count {
  margin: 30px auto;
  font-size: xx-large;
}
</style>
