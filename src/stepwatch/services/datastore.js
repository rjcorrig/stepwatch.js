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
import uuid4 from 'uuid/v4'

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

DataStore.prototype.deleteRun = function (run) {
  var idx = this.runs.indexOf(run)

  if (idx >= 0) {
    this.runs.splice(idx, 1)
  }
}

DataStore.prototype.load = function () {
  if (this.storage) {
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
