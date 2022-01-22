import Vuex from 'vuex'
import Run from '@/stepwatch/models/run'
import Step from '@/stepwatch/models/step'
import uuid4 from 'uuid/v4'
import assert from 'assert'

import {
  SET_STORAGE,
  PUSH_RUN,
  DELETE_RUN,
  SET_RUNS
} from './mutationTypes'

export default function (options) {
  return new Vuex.Store({
    state: {
      runs: [],
      storage: options.storage || null
    },
    getters: {
      getRuns: (state) => (filter) => {
        var filterFunc = filter || ((run) => true)
        return state.runs.filter(filterFunc)
      },
      getRun: (state, getters) => (id) => {
        var runs = getters.getRuns((run) => run.id === id)
        return runs[0]
      }
    },
    actions: {
      createProgram ({ commit }) {
        var run = new Run()
        commit(PUSH_RUN, run)
        return Promise.resolve(run)
      },
      createRun ({ commit }, run) {
        var newRun = run.setup()
        commit(PUSH_RUN, newRun)
        return Promise.resolve(newRun)
      },
      saveRun ({ commit, state }, run) {
        if (state.runs.indexOf(run) === -1) {
          commit(PUSH_RUN, run)
        }
        return Promise.resolve()
      },
      deleteRun ({ commit }, run) {
        commit(DELETE_RUN, run)
        return Promise.resolve()
      },
      load ({ commit, state }) {
        if (state.storage) {
          commit(SET_RUNS, [])
          var runDb = JSON.parse(state.storage.getItem('runDb'))
          if (runDb) {
            for (var runDbEntry of runDb) {
              var run = new Run(runDbEntry)
              commit(PUSH_RUN, run)
            }
          }
        }
        return Promise.resolve()
      },
      save ({ state }) {
        if (state.storage) {
          for (var run of state.runs) {
            if (run.id === null) {
              run.id = uuid4()
            }
          }
          state.storage.setItem('runDb', JSON.stringify(state.runs))
        }
        return Promise.resolve()
      },
      seed ({ commit }, runs) {
        try {
          assert(runs instanceof Array)
          for (var run of runs) {
            assert(run instanceof Run)
            for (var step of run.steps) {
              assert(step instanceof Step)
            }
          }
        } catch (e) {
          if (/AssertionError/.test(e.name)) {
            return Promise.reject(new Error('Invalid data passed to DataStore.seed'))
          } else {
            return Promise.reject(e)
          }
        }
        commit(SET_RUNS, runs)
        return Promise.resolve()
      }
    },
    mutations: {
      [SET_STORAGE] (state, storage) {
        state.storage = storage
      },
      [PUSH_RUN] (state, run) {
        state.runs.push(run)
      },
      [DELETE_RUN] (state, run) {
        var idx = state.runs.indexOf(run)
        if (idx >= 0) {
          state.runs.splice(idx, 1)
        }
      },
      [SET_RUNS] (state, runs) {
        state.runs = runs
      }
    }
  })
}
