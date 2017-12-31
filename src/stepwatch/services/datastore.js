/*
 * stepwatch.js - A simple multistep timer browser app
 * Copyright (C) 2017 Robert Corrigan
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import Run from '@/stepwatch/models/run'
import Step from '@/stepwatch/models/step'
import uuid4 from 'uuid/v4'
import assert from 'assert'

export default function DataStore (storage) {
  this.runs = []
  this.storage = storage
}

DataStore.prototype.createProgram = function () {
  var run = new Run()
  this.runs.push(run)
  return run
}

DataStore.prototype.createRun = function (run) {
  var newRun = run.setup()
  this.runs.push(newRun)
  return newRun
}

DataStore.prototype.getRuns = function (filter) {
  var filterFunc = filter || function (run) {
    return true
  }

  return this.runs.filter(filterFunc)
}

DataStore.prototype.getRun = function (id) {
  var runs = this.getRuns(function (run) {
    return run.id === id
  })

  return runs[0]
}

DataStore.prototype.deleteRun = function (run) {
  var idx = this.runs.indexOf(run)

  if (idx >= 0) {
    this.runs.splice(idx, 1)
  }
}

DataStore.prototype.load = function () {
  if (this.storage) {
    this.runs = []
    var runDb = JSON.parse(this.storage.getItem('runDb'))
    for (var runDbEntry of runDb) {
      var run = new Run(runDbEntry)
      this.runs.push(run)
    }
  }
}

DataStore.prototype.save = function () {
  if (this.storage) {
    for (var run of this.runs) {
      if (run.id === null) {
        run.id = uuid4()
      }
    }

    this.storage.setItem('runDb', JSON.stringify(this.runs))
  }
}

DataStore.prototype.seed = function (runs) {
  try {
    assert(runs instanceof Array)
    for (var run of runs) {
      assert(run instanceof Run)
      for (var step of run.steps) {
        assert(step instanceof Step)
      }
    }
  } catch (e) {
    if (e.name === 'AssertionError') {
      throw new Error('Invalid data passed to DataStore.seed')
    } else {
      throw e
    }
  }

  this.runs = runs
}
