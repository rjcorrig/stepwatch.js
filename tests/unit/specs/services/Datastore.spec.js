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
import DataStore from '@/stepwatch/services/datastore'
import Run from '@/stepwatch/models/run'
import Step from '@/stepwatch/models/step'
import uuid4 from 'uuid/v4'

describe('DataStore', function () {
  describe('constructor', function () {
    it('returns a new blank Datastore', function () {
      var dataStore = new DataStore(window.sessionStorage)

      expect(dataStore.runs).to.be.an.instanceof(Array)
      expect(dataStore.storage).to.equal(window.sessionStorage)
      expect(dataStore.runs.length).to.equal(0)
    })
  })

  describe('createProgram', function () {
    it('returns a newly initialized Run program with an id', function () {
      var dataStore = new DataStore(window.sessionStorage)
      var run = dataStore.createProgram()

      expect(run).to.be.an.instanceof(Run)
      expect(run.status).to.equal('program')
      expect(run.id).to.not.equal(null)
    })

    it('adds the newly initialized program to runs', function () {
      var dataStore = new DataStore(window.sessionStorage)
      var run = dataStore.createProgram()

      expect(dataStore.runs.length).to.equal(1)
      expect(dataStore.runs[0]).to.equal(run)
    })
  })

  describe('createRun', function () {
    it('returns a newly initialized Run with an id', function () {
      var dataStore = new DataStore(window.sessionStorage)
      var program = dataStore.createProgram()
      var run = dataStore.createRun(program)

      expect(run).to.be.an.instanceof(Run)
      expect(run.status).to.equal('created')
      expect(run.id).to.not.equal(null)
    })

    it('adds the newly initialized Run to runs', function () {
      var dataStore = new DataStore(window.sessionStorage)
      var program = dataStore.createProgram()
      var run = dataStore.createRun(program)

      expect(dataStore.runs.length).to.equal(2)
      expect(dataStore.runs[1]).to.equal(run)
    })
  })

  describe('getRuns', function () {
    var dataStore
    before(function () {
      dataStore = new DataStore(window.sessionStorage)
      var program = dataStore.createProgram()
      dataStore.createRun(program)
    })

    it('should return all runs if no filter passed', function () {
      var runs = dataStore.getRuns()
      expect(runs).to.be.instanceof(Array)
      expect(runs.length).to.equal(2)
    })

    it('should return matching runs if a filter function was passed', function () {
      var runs = dataStore.getRuns(function (run) {
        return run.status === 'program'
      })
      expect(runs).to.be.instanceof(Array)
      expect(runs.length).to.equal(1)
    })

    it('should return an empty array if no runs were matched', function () {
      var runs = dataStore.getRuns(function (run) {
        return run.status === 'nonesuch'
      })
      expect(runs).to.be.instanceof(Array)
      expect(runs.length).to.equal(0)
    })
  })

  describe('getRun', function () {
    var dataStore, program
    before(function () {
      dataStore = new DataStore(window.sessionStorage)
      program = dataStore.createProgram()
      program.id = uuid4()
      dataStore.createRun(program)
    })

    it('should retrieve a run if an id is matched', function () {
      var run = dataStore.getRun(program.id)
      expect(run).to.be.instanceof(Run)
      expect(run.id).to.equal(program.id)
    })

    it('should return null if no id is matched', function () {
      var run = dataStore.getRun('nosuchid')
      expect(run).to.equal(undefined)
    })
  })

  describe('deleteRun', function () {
    it('deletes the supplied run', function () {
      var dataStore = new DataStore(window.sessionStorage)
      var program = dataStore.createProgram()
      var run = dataStore.createRun(program)
      var testName = 'Run 1'
      run.name = testName
      dataStore.createRun(program)

      dataStore.deleteRun(run)

      expect(dataStore.runs.length).to.equal(2)
      expect(dataStore.runs.indexOf(run)).to.equal(-1)
      expect(dataStore.runs.some(run => run.name === testName)).to.equal(false)
    })
  })

  describe('load', function () {
    var compareDb = []

    beforeEach(function () {
      var program = new Run()
      program.steps = [new Step({ name: 'Step 1' }), new Step({ name: 'Step 2' })]
      program.id = uuid4()
      var run = program.setup()
      run.name = 'New Run'
      run.status = 'canceled'
      run.id = uuid4()

      window.sessionStorage.clear()
      compareDb = [program, run]
      window.sessionStorage.setItem('runDb', JSON.stringify(compareDb))
    })

    it('does nothing if no storage defined', function () {
      var dataStore = new DataStore()

      dataStore.load()

      expect(dataStore.runs).to.be.an.instanceof(Array)
      expect(dataStore.runs.length).to.equal(0)
    })

    it('returns empty array if storage key not found', function () {
      var dataStore = new DataStore(window.sessionStorage)

      window.sessionStorage.clear()

      dataStore.load()

      expect(dataStore.runs).to.be.an.instanceof(Array)
      expect(dataStore.runs.length).to.equal(0)
    })

    it('retrieves the stored runs', function () {
      var dataStore = new DataStore(window.sessionStorage)

      dataStore.load()

      expect(dataStore.runs).to.be.an.instanceof(Array)
      expect(dataStore.runs.length).to.equal(compareDb.length)

      for (var i = 0; i < compareDb.length; i++) {
        expect(dataStore.runs[i]).to.be.an.instanceof(Run)
        expect(dataStore.runs[i].id).to.equal(compareDb[i].id)
      }
    })

    afterEach(function () {
      window.sessionStorage.clear()
    })
  })

  describe('save', function () {
    beforeEach(function () {
      window.sessionStorage.clear()
    })

    it('does nothing if no storage defined', function () {
      var dataStore = new DataStore()
      var program = dataStore.createProgram()
      var run = dataStore.createRun(program)

      program.id = null
      run.id = null

      dataStore.save()

      expect(dataStore.runs.every(run => run.id === null)).to.equal(true)
    })

    it('assigns an id to all unsaved runs', function () {
      var dataStore = new DataStore(window.sessionStorage)
      var program = dataStore.createProgram()
      program.steps.push(new Step({
        name: 'foo'
      }))
      dataStore.createRun(program)

      dataStore.save()

      expect(dataStore.runs.some(run => run.id === null)).to.equal(false)
      expect(window.sessionStorage.length).to.equal(1)
    })

    afterEach(function () {
      window.sessionStorage.clear()
    })
  })

  describe('seed', function () {
    beforeEach(function () {
      window.sessionStorage.clear()
    })

    it('initializes the data from a Run array', function () {
      var dataStore = new DataStore(window.sessionStorage)
      var runs = [
        new Run({
          id: 'foo',
          name: 'a name',
          steps: [
            new Step({
              name: 'step name'
            })
          ]
        }),
        new Run({
          id: 'bar',
          name: 'another name',
          steps: [
            new Step({
              name: 'another step name'
            })
          ]
        })
      ]

      dataStore.seed(runs)

      expect(dataStore.runs).to.be.instanceof(Array)
      expect(dataStore.runs.length).to.equal(runs.length)
      expect(dataStore.runs[0]).to.be.instanceof(Run)
    })

    it('throws an error if a Run array is not passed', function () {
      var dataStore = new DataStore(window.sessionStorage)
      var runs = [
        {
          id: 'foo',
          name: 'a name',
          steps: [
            {
              name: 'step name'
            }
          ]
        },
        {
          id: 'bar',
          name: 'another name',
          steps: [
            {
              name: 'another step name'
            }
          ]
        }
      ]

      expect(DataStore.prototype.seed.bind(dataStore, runs)).to.throw(/Invalid data/)
    })
  })
})
