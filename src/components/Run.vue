<template>
  <div class="sw-page sw-runner">
    <h1 class="sw-header">
        {{ run.name }}
    </h1>
    <ol class="sw-runstep-list">
    </ol>
  </div>
</template>

<script>
import models from '@/stepwatch/models'

export default {
  name: 'Run',
  data () {
    return {
      run: new models.Run()
    }
  }
}
</script>

<style>
.sw-page {
  /*opacity: 0;*/
  min-width: 300px;
  padding: 5px;
  margin: auto;
/*
  transition-property: opacity;
  transition-duration: 400ms;
*/
}

.sw-page.sw-active {
  opacity: 1;
}

.sw-page > h1 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
}

.sw-page div {
  text-align: center;
  margin: 5px;
}

ol.sw-runstep-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
