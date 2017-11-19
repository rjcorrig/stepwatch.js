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

import _ from 'lodash'

export default function Step (options = {}) {
  _.defaults(options, {
    name: 'New Step',
    status: 'created',
    totalSeconds: 0,
    runSeconds: 0,
    startTime: null,
    endTime: null
  })

  this.name = options.name
  this.status = options.status
  this.totalSeconds = options.totalSeconds
  this.runSeconds = options.runSeconds
  this.startTime = options.startTime
  this.endTime = options.endTime
}

Step.prototype.initialize = function () {
  this.status = 'created'
  this.runSeconds = 0
  this.startTime = null
  this.endTime = null
}

Step.prototype.start = function () {
  if (this.status === 'created' || this.status === 'paused') {
    if (this.startTime === null) {
      this.startTime = Date.now()
    }
    this.status = 'running'
  }
}

Step.prototype.pause = function () {
  if (this.status === 'running') {
    this.status = 'paused'
  }
}

Step.prototype.cancel = function () {
  if (['created', 'running', 'paused'].indexOf(this.status) >= 0) {
    if (this.startTime != null) {
      this.endTime = Date.now()
    }
    this.status = 'canceled'
  }
}

Step.prototype.complete = function () {
  if (this.status === 'running') {
    this.endTime = Date.now()
    this.status = 'complete'
  }
}

Step.prototype.tick = function () {
  if (this.status === 'running') {
    if (++(this.runSeconds) >= this.totalSeconds) {
      this.complete()
    }
  }
}
