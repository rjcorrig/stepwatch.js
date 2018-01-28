<template>
  <div v-if="run" class="sw-page sw-run">
    <h1 class="sw-header">
      <button class="sw-action-button" @click="$router.go(-1)">
        <i class="material-icons">keyboard_arrow_left</i>
      </button>
      <div class="sw-page-title marquee-wrap">
        <vue-marquee :content="run.name" speed="slow" :showtwo="false"></vue-marquee>
      </div>
      <div class="sw-header-right"></div>
    </h1>
    <ol class="sw-card-list" v-if="run.steps.length">
      <sw-step v-for="step in run.steps" :step="step" :key="step.id" :isCurrentStep="run.steps.indexOf(step) === run.currentStep" v-on:cancel="run.cancel()" v-on:pause="run.pause()" v-on:start="run.start()" />
    </ol>
    <p v-else>
      No steps defined
    </p>
  </div>
  <div v-else class="sw-page sw-run">
    <h1 class="sw-header">Run not found</h1>
  </div>
</template>

<script>
import swStep from './sw-step.vue'
import VueMarquee from 'vue-marquee-ho'
import Css from 'vue-marquee-ho/dist/vue-marquee.min.css' // eslint-disable-line no-unused-vars

export default {
  name: 'sw-run',
  props: [ 'id' ],
  watch: {
    '$route' (to, from) {
      this.run = this.$services.dataStore.getRun(to.params.id)
    }
  },
  data () {
    const ticker = setInterval(() => {
      this.tick()
    }, 1000)

    return {
      run: this.$services.dataStore.getRun(this.id),
      ticker
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.suspend)
  },
  beforeDestroy () {
    this.suspend()
  },
  methods: {
    tick () {
      if (this.run) {
        this.run.tick()
      }
    },
    suspend () {
      clearInterval(this.ticker)
      if (this.run) {
        this.run.pause()
      }
      this.$services.dataStore.save()
      window.removeEventListener('beforeunload', this.suspend)
    }
  },
  components: {
    swStep,
    'vue-marquee': VueMarquee
  }
}
</script>

<style>
/* Override default styling from vue-marquee */
.sw-page-title .marquee-content .text1 {
  padding-right: 0px;
  font-size: inherit; 
}

.sw-page-title .marquee-content .text2 {
  padding-left: 40px;
  padding-right: 40px;
  font-size: inherit; 
}

.sw-page-title.marquee-wrap .marquee-box {
  color: inherit;
  font-size: inherit;
  background-size: initial;
  height: initial;
  line-height: initial;
}

.sw-page-title .marquee-content p {
  font-size: inherit;
}
</style>
