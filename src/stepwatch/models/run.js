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
import Step from './step'

export default function Run (options = {}) {
  _.defaults(options, {
    name: 'New Program',
    steps: [],
    status: 'program',
    totalSeconds: 0
  })

  this.initialize()

  this.name = options.name

  this.status = options.status
  this.totalSeconds = options.totalSeconds

  if (options.id) this.id = options.id
  if (options.currentStep >= 0) this.currentStep = options.currentStep
  if (options.runSeconds) this.runSeconds = options.runSeconds
  if (options.startTime) this.startTime = options.startTime
  if (options.endTime) this.endTime = options.endTime

  this.steps = []
  if (options.steps) {
    for (var i = 0; i < options.steps.length; i++) {
      this.steps.push(new Step(options.steps[i]))
    }
  }
}

Run.prototype.initialize = function () {
  this.id = null
  this.status = 'created'
  this.currentStep = null
  this.runSeconds = 0
  this.startTime = null
  this.endTime = null
}

Run.prototype.setup = function () {
  var newRun = new Run()

  newRun.initialize()
  newRun.name = this.name
  newRun.steps = this.steps.map((step) => new Step({
    name: step.name,
    totalSeconds: step.totalSeconds
  }))
  newRun.totalSeconds = this.totalSeconds

  return newRun
}

Run.prototype.start = function () {
  if (this.steps.length > 0) {
    if (this.status === 'created' || this.status === 'paused') {
      if (this.currentStep === null) {
        this.currentStep = 0
      }
      if (this.startTime === null) {
        this.startTime = Date.now()
      }
      this.status = 'running'
      this.steps[this.currentStep].start()
    }
  }
}

Run.prototype.pause = function () {
  if (this.status === 'running') {
    this.status = 'paused'
    if (this.currentStep !== null) {
      this.steps[this.currentStep].pause()
    }
  }
}

Run.prototype.cancel = function () {
  if (this.status === 'running' || this.status === 'paused') {
    this.endTime = Date.now()
    this.status = 'canceled'
    for (var i = this.currentStep; i < this.steps.length; i++) {
      this.steps[i].cancel()
    }
  }
}

Run.prototype.complete = function () {
  if (this.status === 'running') {
    this.endTime = Date.now()
    this.status = 'complete'
  }
}

Run.prototype.tick = function () {
  if (this.status === 'running') {
    this.runSeconds++

    if (this.currentStep !== null) {
      var step = this.steps[this.currentStep]
      step.tick()
      if (step.status === 'complete') {
        if (this.currentStep === this.steps.length - 1) {
          this.complete()
        } else {
          this.steps[++(this.currentStep)].start()
        }
      }
    }
  }
}
