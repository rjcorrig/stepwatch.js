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

import { expect } from 'chai'
import Step from '@/stepwatch/models/step'
import MockDate from 'mockdate'

describe('Step', function () {
  describe('constructor', function () {
    it('defaults all properties', function () {
      var step = new Step()

      expect(step.id).to.not.equal(null)
      expect(step.name).to.equal('New Step')
      expect(step.status).to.equal('created')
      expect(step.totalSeconds).to.equal(0)
      expect(step.runSeconds).to.equal(0)
      expect(step.startTime).to.equal(null)
      expect(step.endTime).to.equal(null)
    })

    it('defines all properties', function () {
      var step = new Step()

      expect(step).to.have.property('id')
      expect(step).to.have.property('name')
      expect(step).to.have.property('status')
      expect(step).to.have.property('totalSeconds')
      expect(step).to.have.property('runSeconds')
      expect(step).to.have.property('startTime')
      expect(step).to.have.property('endTime')
    })

    it('accepts properties from options object', function () {
      var options = {
        name: 'Test',
        status: 'test',
        totalSeconds: 5,
        runSeconds: 2,
        startTime: new Date(2017, 11, 17, 10, 5, 0),
        endTime: new Date(2017, 11, 17, 10, 5, 30)
      }

      var step = new Step(options)

      expect(step.id).to.not.equal(null)
      expect(step.name).to.equal(options.name)
      expect(step.status).to.equal(options.status)
      expect(step.totalSeconds).to.equal(options.totalSeconds)
      expect(step.runSeconds).to.equal(options.runSeconds)
      expect(step.startTime).to.equal(options.startTime)
      expect(step.endTime).to.equal(options.endTime)
    })
  })

  describe('initialize', function () {
    it('resets status fields', function () {
      var step = new Step()

      step.status = 'complete'
      step.runSeconds = 15
      step.startTime = Date.now()
      step.endTime = Date.now()

      step.initialize()

      expect(step.status).to.equal('created')
      expect(step.runSeconds).to.equal(0)
      expect(step.startTime).to.equal(null)
      expect(step.endTime).to.equal(null)
    })
  })

  describe('start', function () {
    before(function () {
      MockDate.set('1/1/2017')
    })

    it('starts from states in (created,paused)', function () {
      var statuses = ['created', 'paused']

      for (var status of statuses) {
        var step = new Step()
        step.status = status
        step.start()
        expect(step.status).to.equal('running')
      }
    })

    it('does nothing if state not in (created,paused)', function () {
      var statuses = ['running', 'canceled', 'complete']

      for (var status of statuses) {
        var step = new Step()
        step.status = status

        var priorState = JSON.stringify(step)
        step.start()
        expect(JSON.stringify(step)).to.equal(priorState)
      }
    })

    it('sets startTime to current timestamp if not already set', function () {
      var step = new Step()
      step.status = 'created'
      step.start()

      expect(step.startTime).to.equal(new Date('1/1/2017').getTime())
    })

    it('does not set startTime if not already set', function () {
      var step = new Step()
      var startTime = new Date('12/31/2016').getTime()
      step.status = 'created'

      step.startTime = startTime
      step.start()

      expect(step.startTime).to.equal(startTime)
    })

    after(function () {
      MockDate.reset()
    })
  })

  describe('pause', function () {
    it('pauses when running', function () {
      var statuses = ['running']

      for (var status of statuses) {
        var step = new Step()
        step.status = status
        step.pause()
        expect(step.status).to.equal('paused')
      }
    })

    it('does nothing if not running', function () {
      var statuses = ['created', 'paused', 'canceled', 'complete']

      for (var status of statuses) {
        var step = new Step()
        step.status = status

        var priorState = JSON.stringify(step)
        step.pause()
        expect(JSON.stringify(step)).to.equal(priorState)
      }
    })
  })

  describe('cancel', function () {
    before(function () {
      MockDate.set('1/1/2017')
    })

    it('cancels if not already ended', function () {
      var statuses = ['created', 'running', 'paused']

      for (var status of statuses) {
        var step = new Step()
        step.status = status
        step.cancel()
        expect(step.status).to.equal('canceled')
      }
    })

    it('does nothing if already ended', function () {
      var statuses = ['canceled', 'complete']

      for (var status of statuses) {
        var step = new Step()
        step.status = status

        var priorState = JSON.stringify(step)
        step.cancel()
        expect(JSON.stringify(step)).to.equal(priorState)
      }
    })

    it('sets endTime to current timestamp if was running or paused', function () {
      var statuses = ['running', 'paused']

      for (var status of statuses) {
        var step = new Step()
        step.status = status
        step.startTime = Date.now()
        step.cancel()
        expect(step.endTime).to.equal(new Date('1/1/2017').getTime())
      }
    })

    it('does not set endTime if was never started', function () {
      var statuses = ['created', 'canceled']

      for (var status of statuses) {
        var step = new Step()
        step.status = status
        step.cancel()

        expect(step.endTime).to.equal(null)
      }
    })

    after(function () {
      MockDate.reset()
    })
  })

  describe('complete', function () {
    before(function () {
      MockDate.set('1/1/2017')
    })

    it('completes when running', function () {
      var statuses = ['running']

      for (var status of statuses) {
        var step = new Step()
        step.status = status

        step.complete()
        expect(step.status).to.equal('complete')
      }
    })

    it('does not complete if not running', function () {
      var statuses = ['created', 'paused', 'canceled', 'complete']

      for (var status of statuses) {
        var step = new Step()
        step.status = status

        var priorState = JSON.stringify(step)
        step.complete()
        expect(JSON.stringify(step)).to.equal(priorState)
      }
    })

    it('sets endTime to current timestamp if not already set', function () {
      var step = new Step()
      step.status = 'running'
      step.complete()

      expect(step.endTime).to.equal(new Date('1/1/2017').getTime())
    })

    after(function () {
      MockDate.reset()
    })
  })

  describe('tick', function () {
    before(function () {
      MockDate.set('1/1/2017')
    })

    it('does nothing if not running', function () {
      var statuses = ['created', 'paused', 'canceled', 'complete']

      for (var status of statuses) {
        var step = new Step()
        step.status = status

        var priorState = JSON.stringify(step)
        step.tick()
        expect(JSON.stringify(step)).to.equal(priorState)
      }
    })

    it('advances clock if running', function () {
      var statuses = ['running']

      for (var status of statuses) {
        var step = new Step()
        var secs = step.runSeconds
        step.status = status

        step.tick()
        expect(step.runSeconds).to.equal(secs + 1)
      }
    })

    it('completes if runSeconds reaches totalSeconds', function () {
      var step = new Step(
        {
          name: 'Test',
          status: 'running',
          totalSeconds: 3,
          runSeconds: 2,
          startTime: new Date(2017, 11, 17, 10, 5, 0),
          endTime: null
        }
      )

      step.tick()
      expect(step.status).to.equal('complete')
      expect(step.runSeconds).to.equal(3)
      expect(step.endTime).to.equal(new Date('1/1/2017').getTime())
    })

    it('does not complete if runSeconds < totalSeconds', function () {
      var step = new Step(
        {
          name: 'Test',
          status: 'running',
          totalSeconds: 4,
          runSeconds: 2,
          startTime: new Date(2017, 11, 17, 10, 5, 0),
          endTime: null
        }
      )

      step.tick()
      expect(step.status).to.equal('running')
      expect(step.runSeconds).to.equal(3)
      expect(step.endTime).to.equal(null)
    })

    after(function () {
      MockDate.reset()
    })
  })
})
