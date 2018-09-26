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
import Run from '@/stepwatch/models/run'
import Step from '@/stepwatch/models/step'
import MockDate from 'mockdate'

describe('Run', function () {
  describe('constuctor', function () {
    it('initializes all properties', function () {
      var run = new Run()

      expect(run.id).to.not.equal(null)
      expect(run.name).to.equal('New Program')
      expect(run.steps).to.be.an.instanceof(Array)
      expect(run.steps.length).to.equal(0)
      expect(run.currentStep).to.equal(null)
      expect(run.status).to.equal('program')
      expect(run.totalSeconds).to.equal(0)
      expect(run.runSeconds).to.equal(0)
      expect(run.startTime).to.equal(null)
      expect(run.endTime).to.equal(null)
    })

    it('defines all properties', function () {
      var run = new Run()

      expect(run).to.have.property('id')
      expect(run).to.have.property('name')
      expect(run).to.have.property('steps')
      expect(run).to.have.property('currentStep')
      expect(run).to.have.property('status')
      expect(run).to.have.property('totalSeconds')
      expect(run).to.have.property('runSeconds')
      expect(run).to.have.property('startTime')
      expect(run).to.have.property('endTime')
    })

    it('accepts properties from options object', function () {
      var options = {
        id: 'an id',
        name: 'a name',
        steps: [
          {
            name: 'Step 1'
          },
          {
            name: 'Step 2'
          }
        ],
        currentStep: 0,
        status: 'complete',
        totalSeconds: 5,
        runSeconds: 5,
        startTime: Date.now(),
        endTime: Date.now()
      }

      var run = new Run(options)

      expect(run).to.be.an.instanceof(Run)
      expect(run.id).to.equal(options.id)
      expect(run.name).to.equal(options.name)
      expect(run.currentStep).to.equal(options.currentStep)
      expect(run.status).to.equal(options.status)
      expect(run.totalSeconds).to.equal(options.totalSeconds)
      expect(run.startTime).to.equal(options.startTime)
      expect(run.endTime).to.equal(options.endTime)

      expect(run.steps).to.be.instanceof(Array)
      expect(run.steps.length).to.equal(options.steps.length)
      for (var i = 0; i < options.steps.length; i++) {
        expect(run.steps[i]).to.be.instanceof(Step)
        expect(run.steps[i].name).to.equal(options.steps[i].name)
      }
    })
  })

  describe('initialize', function () {
    it('resets status fields', function () {
      var run = new Run()

      run.id = 'abcd'
      run.status = 'complete'
      run.currentStep = 5
      run.runSeconds = 15
      run.startTime = Date.now()
      run.endTime = Date.now()

      run.initialize()

      expect(run.id).to.not.equal(null)
      expect(run.status).to.equal('created')
      expect(run.currentStep).to.equal(null)
      expect(run.runSeconds).to.equal(0)
      expect(run.startTime).to.equal(null)
      expect(run.endTime).to.equal(null)
    })
  })

  describe('setup', function () {
    it('initializes new run from program template', function () {
      var run = new Run()

      run.id = 'abcd'
      run.name = 'a name'
      run.steps = [
        new Step({
          name: 'Step 1',
          status: 'complete',
          totalSeconds: 5,
          runSeconds: 5,
          startTime: Date.now(),
          endTime: Date.now()
        }),
        new Step({
          name: 'Step 2',
          status: 'running',
          totalSeconds: 5,
          runSeconds: 1,
          startTime: Date.now(),
          endTime: null
        })
      ]
      run.currentStep = 2
      run.status = 'canceled'
      run.totalSeconds = 60
      run.runSeconds = 15
      run.startTime = Date.now()
      run.endTime = Date.now()

      var newRun = run.setup()

      expect(newRun.id).to.not.equal(null)
      expect(newRun.id).to.not.equal(run.id)
      expect(newRun.name).to.equal(run.name)

      expect(newRun.steps).to.be.an.instanceof(Array)
      expect(newRun.steps.length).to.equal(run.steps.length)

      expect(newRun.currentStep).to.equal(null)

      expect(newRun.status).to.equal('created')

      expect(newRun.totalSeconds).to.equal(run.totalSeconds)
      expect(newRun.runSeconds).to.equal(0)

      expect(newRun.startTime).to.equal(null)
      expect(newRun.endTime).to.equal(null)

      for (var i = 0; i < run.steps.length; i++) {
        expect(newRun.steps[i]).to.be.an.instanceof(Step)
        expect(newRun.steps[i].name).to.equal(run.steps[i].name)
        expect(newRun.steps[i].status).to.equal('created')
        expect(newRun.steps[i].totalSeconds).to.equal(run.steps[i].totalSeconds)
        expect(newRun.steps[i].runSeconds).to.equal(0)
        expect(newRun.steps[i].startTime).to.equal(null)
        expect(newRun.steps[i].endTime).to.equal(null)
      }
    })
  })

  describe('start', function () {
    before(function () {
      MockDate.set('1/1/2017')
    })

    it('starts from states in (created,paused)', function () {
      var statuses = ['created', 'paused']

      for (var status of statuses) {
        var run = new Run()
        run.status = status
        run.steps = [ new Step() ]
        run.start()
        expect(run.status).to.equal('running')
      }
    })

    it('does nothing if no steps defined', function () {
      var run = new Run()
      run.status = 'created'
      var priorState = JSON.stringify(run)

      run.start()
      expect(JSON.stringify(run)).to.equal(priorState)
    })

    it('does nothing if state not in (created,paused)', function () {
      var statuses = ['program', 'running', 'canceled', 'complete']

      for (var status of statuses) {
        var run = new Run()
        run.status = status
        run.steps = [ new Step() ]

        var priorState = JSON.stringify(run)
        run.start()
        expect(JSON.stringify(run)).to.equal(priorState)
      }
    })

    it('sets startTime to current timestamp if not already set', function () {
      var run = new Run()
      run.status = 'created'
      run.steps = [ new Step() ]
      run.start()

      expect(run.startTime).to.equal(new Date('1/1/2017').getTime())
    })

    it('does not set startTime if not already set', function () {
      var run = new Run()
      var startTime = new Date('12/31/2016').getTime()
      run.status = 'created'
      run.steps = [ new Step() ]

      run.startTime = startTime
      run.start()

      expect(run.startTime).to.equal(startTime)
    })

    it('sets currentStep to 0 if not already set', function () {
      var run = new Run()
      run.status = 'created'
      run.steps = [ new Step() ]
      run.start()

      expect(run.currentStep).to.equal(0)
    })

    it('does not set currentStep if already set', function () {
      var run = new Run()
      var currentStep = 3
      run.status = 'created'
      run.currentStep = currentStep
      run.start()

      expect(run.currentStep).to.equal(3)
    })

    it('(re)starts the current step when created or paused', function () {
      var statuses = ['created', 'paused']

      for (var status of statuses) {
        var run = new Run()
        run.status = status
        run.steps = [
          new Step({
            name: 'Test',
            status: status,
            totalSeconds: 1
          })
        ]
        run.currentStep = 0

        run.start()
        expect(run.steps[run.currentStep].status).to.equal('running')
      }
    })

    after(function () {
      MockDate.reset()
    })
  })

  describe('pause', function () {
    it('pauses when running', function () {
      var statuses = ['running']

      for (var status of statuses) {
        var run = new Run()
        run.status = status
        run.pause()
        expect(run.status).to.equal('paused')
      }
    })

    it('pauses the current step when running', function () {
      var statuses = ['running']

      for (var status of statuses) {
        var run = new Run()
        run.status = status
        run.steps = [
          new Step({
            name: 'Test',
            status: status,
            totalSeconds: 1
          })
        ]
        run.currentStep = 0

        run.pause()
        expect(run.steps[run.currentStep].status).to.equal('paused')
      }
    })

    it('does nothing if not running', function () {
      var statuses = ['program', 'created', 'paused', 'canceled', 'complete']

      for (var status of statuses) {
        var run = new Run()
        run.status = status

        var priorState = JSON.stringify(run)
        run.pause()
        expect(JSON.stringify(run)).to.equal(priorState)
      }
    })
  })

  describe('cancel', function () {
    before(function () {
      MockDate.set('1/1/2017')
    })

    it('cancels when running or paused', function () {
      var statuses = ['running', 'paused']

      for (var status of statuses) {
        var run = new Run()
        run.status = status
        run.cancel()
        expect(run.status).to.equal('canceled')
      }
    })

    it('does nothing if not running or paused', function () {
      var statuses = ['program', 'created', 'canceled', 'complete']

      for (var status of statuses) {
        var run = new Run()
        run.status = status

        var priorState = JSON.stringify(run)
        run.cancel()
        expect(JSON.stringify(run)).to.equal(priorState)
      }
    })

    it('sets endTime to current timestamp if not already set', function () {
      var run = new Run()
      run.status = 'running'
      run.cancel()

      expect(run.endTime).to.equal(new Date('1/1/2017').getTime())
    })

    it('cancels current and all future steps', function () {
      var run = new Run()
      run.steps = [
        new Step({
          name: 'Step 0',
          totalSeconds: 1,
          runSeconds: 1,
          status: 'complete'
        }),
        new Step({
          name: 'Step 1',
          totalSeconds: 1,
          status: 'running'
        }),
        new Step({
          name: 'Step 2',
          totalSeconds: 1,
          status: 'created'
        })
      ]

      run.status = 'running'
      run.currentStep = 1

      run.cancel()
      expect(run.steps[0].status).to.equal('complete')
      expect(run.steps[1].status).to.equal('canceled')
      expect(run.steps[2].status).to.equal('canceled')
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
        var run = new Run()
        run.status = status
        run.complete()
        expect(run.status).to.equal('complete')
      }
    })

    it('does nothing if not running', function () {
      var statuses = ['program', 'created', 'paused', 'canceled', 'complete']

      for (var status of statuses) {
        var run = new Run()
        run.status = status

        var priorState = JSON.stringify(run)
        run.complete()
        expect(JSON.stringify(run)).to.equal(priorState)
      }
    })

    it('sets endTime to current timestamp if not already set', function () {
      var run = new Run()
      run.status = 'running'
      run.cancel()

      expect(run.endTime).to.equal(new Date('1/1/2017').getTime())
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
      var statuses = ['program', 'created', 'paused', 'canceled', 'complete']

      for (var status of statuses) {
        var run = new Run()
        run.status = status

        var priorState = JSON.stringify(run)
        run.tick()
        expect(JSON.stringify(run)).to.equal(priorState)
      }
    })

    it('advances clock if running', function () {
      var statuses = ['running']

      for (var status of statuses) {
        var run = new Run()
        var secs = run.runSeconds
        run.status = status

        run.tick()
        expect(run.runSeconds).to.equal(secs + 1)
      }
    })

    it('maintains current step if not complete', function () {
      var run = new Run()
      run.steps = [
        new Step({
          name: 'Step 1',
          totalSeconds: 2,
          status: 'running'
        }),
        new Step({
          name: 'Step 2',
          totalSeconds: 1
        })
      ]
      run.status = 'running'
      run.currentStep = 0

      run.tick()
      expect(run.status).to.equal('running')
      expect(run.currentStep).to.equal(0)
    })

    it('moves to next step when current completes', function () {
      var run = new Run()
      run.steps = [
        new Step({
          name: 'Step 1',
          totalSeconds: 1,
          status: 'running'
        }),
        new Step({
          name: 'Step 2',
          totalSeconds: 1
        })
      ]
      run.status = 'running'
      run.currentStep = 0

      run.tick()
      expect(run.status).to.equal('running')
      expect(run.currentStep).to.equal(1)
    })

    it('completes run when last step completes', function () {
      var run = new Run()
      run.steps = [
        new Step({
          name: 'Step 1',
          totalSeconds: 1,
          runSeconds: 1,
          status: 'complete'
        }),
        new Step({
          name: 'Step 2',
          totalSeconds: 1,
          status: 'running'
        })
      ]
      run.status = 'running'
      run.currentStep = 1

      run.tick()
      expect(run.status).to.equal('complete')
      expect(run.endTime).to.equal(new Date('1/1/2017').getTime())
    })

    after(function () {
      MockDate.reset()
    })
  })
})
