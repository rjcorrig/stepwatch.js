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

import Run from './run'
import Step from './step'

export default [
  // The sprint program
  new Run({
    id: 'foo',
    name: 'Sprint',
    status: 'program',
    totalSeconds: 5 + 15 + 5,
    runSeconds: 0,
    currentStep: null,
    startTime: null,
    endTime: null,
    steps: [
      new Step({
        name: 'Walk for 5 seconds',
        status: 'created',
        totalSeconds: 5,
        runSeconds: 0,
        startTime: null,
        endTime: null
      }),
      new Step({
        name: 'Run for 15 seconds',
        status: 'created',
        totalSeconds: 15,
        runSeconds: 0,
        startTime: null,
        endTime: null
      }),
      new Step({
        name: 'Walk for 5 seconds',
        status: 'created',
        totalSeconds: 5,
        runSeconds: 0,
        startTime: null,
        endTime: null
      })
    ]
  }),
  // The pie program
  new Run({
    id: 'baz',
    name: 'Make a pie',
    status: 'program',
    totalSeconds: 60 * 60,
    runSeconds: 0,
    currentStep: null,
    startTime: null,
    endTime: null,
    steps: [
      new Step({
        name: 'Bake at 350 for 40 minutes',
        status: 'created',
        totalSeconds: 60 * 40,
        runSeconds: 0,
        startTime: null,
        endTime: null
      }),
      new Step({
        name: 'Cool for 20 minutes',
        status: 'created',
        totalSeconds: 20 * 60,
        runSeconds: 0,
        startTime: null,
        endTime: null
      })
    ]
  }),
  // A created but not started run of the pie program
  new Run({
    id: 'qux',
    name: 'Make a pie',
    status: 'created',
    totalSeconds: 60 * 60,
    runSeconds: 0,
    currentStep: null,
    startTime: null,
    endTime: null,
    steps: [
      new Step({
        name: 'Bake at 350 for 40 minutes',
        status: 'created',
        totalSeconds: 60 * 40,
        runSeconds: 0,
        startTime: null,
        endTime: null
      }),
      new Step({
        name: 'Cool for 20 minutes',
        status: 'created',
        totalSeconds: 20 * 60,
        runSeconds: 0,
        startTime: null,
        endTime: null
      })
    ]
  }),
  // A paused run of the Sprint program, paused just now
  new Run({
    id: 'quux',
    name: 'Sprint',
    status: 'paused',
    totalSeconds: 5 + 15 + 5,
    runSeconds: 5 + 7,
    currentStep: 1,
    startTime: Date.now() - 12000,
    endTime: null,
    steps: [
      new Step({
        name: 'Walk for 5 seconds',
        status: 'complete',
        totalSeconds: 5,
        runSeconds: 5,
        startTime: Date.now() - 12000,
        endTime: Date.now() - 7000
      }),
      new Step({
        name: 'Run for 15 seconds',
        status: 'paused',
        totalSeconds: 15,
        runSeconds: 7,
        startTime: Date.now() - 7000,
        endTime: null
      }),
      new Step({
        name: 'Walk for 5 seconds',
        status: 'created',
        totalSeconds: 5,
        runSeconds: 0,
        startTime: null,
        endTime: null
      })
    ]
  }),
  // A running pie program, 10m in
  new Run({
    id: 'garply',
    name: 'Make a pie',
    status: 'created',
    totalSeconds: 60 * 60,
    runSeconds: 10 * 60,
    currentStep: 0,
    startTime: Date.now() - 10 * 1000 * 60,
    endTime: null,
    steps: [
      new Step({
        name: 'Bake at 350 for 40 minutes',
        status: 'created',
        totalSeconds: 60 * 40,
        runSeconds: 10 * 60,
        startTime: Date.now() - 10 * 1000 * 60,
        endTime: null
      }),
      new Step({
        name: 'Cool for 20 minutes',
        status: 'created',
        totalSeconds: 20 * 60,
        runSeconds: 0,
        startTime: null,
        endTime: null
      })
    ]
  }),
  // A canceled run of the pie program
  new Run({
    id: 'corge',
    name: 'Make a pie',
    status: 'canceled',
    totalSeconds: 60 * 60,
    runSeconds: 20 * 60,
    currentStep: 0,
    startTime: Date.now() - 3600 * 1000,
    endTime: Date.now() - 2400 * 1000,
    steps: [
      new Step({
        name: 'Bake at 350 for 40 minutes',
        status: 'canceled',
        totalSeconds: 60 * 40,
        runSeconds: 60 * 20,
        startTime: Date.now() - 3600 * 1000,
        endTime: Date.now() - 2400 * 1000
      }),
      new Step({
        name: 'Cool for 20 minutes',
        status: 'canceled',
        totalSeconds: 20 * 60,
        runSeconds: 0,
        startTime: null,
        endTime: null
      })
    ]
  }),
  // A completed sprint
  new Run({
    id: 'grault',
    name: 'Sprint',
    status: 'complete',
    totalSeconds: 5 + 15 + 5,
    runSeconds: 5 + 15 + 5,
    currentStep: 2,
    startTime: Date.now() - 30 * 60 * 1000,
    endTime: Date.now() - (30 * 60 - 25) * 1000,
    steps: [
      new Step({
        name: 'Walk for 5 seconds',
        status: 'complete',
        totalSeconds: 5,
        runSeconds: 5,
        startTime: Date.now() - 30 * 60 * 1000,
        endTime: Date.now() - (30 * 60 - 5) * 1000
      }),
      new Step({
        name: 'Run for 15 seconds',
        status: 'complete',
        totalSeconds: 15,
        runSeconds: 15,
        startTime: Date.now() - (30 * 60 - 5) * 1000,
        endTime: Date.now() - (30 * 60 - 20) * 1000
      }),
      new Step({
        name: 'Walk for 5 seconds',
        status: 'complete',
        totalSeconds: 5,
        runSeconds: 5,
        startTime: Date.now() - (30 * 60 - 20) * 1000,
        endTime: Date.now() - (30 * 60 - 25) * 1000
      })
    ]
  }),
  // A completed run of the pie program
  new Run({
    id: 'fred',
    name: 'Make a pie',
    status: 'canceled',
    totalSeconds: 60 * 60,
    runSeconds: 60 * 60,
    currentStep: 1,
    startTime: Date.now() - 3600 * 1000,
    endTime: Date.now(),
    steps: [
      new Step({
        name: 'Bake at 350 for 40 minutes',
        status: 'complete',
        totalSeconds: 60 * 40,
        runSeconds: 60 * 40,
        startTime: Date.now() - 3600 * 1000,
        endTime: Date.now() - 20 * 60 * 1000
      }),
      new Step({
        name: 'Cool for 20 minutes',
        status: 'complete',
        totalSeconds: 20 * 60,
        runSeconds: 20 * 60,
        startTime: Date.now() - 20 * 60 * 1000,
        endTime: Date.now()
      })
    ]
  }),
  // A canceled sprint
  new Run({
    id: 'waldo',
    name: 'Sprint',
    status: 'canceled',
    totalSeconds: 5 + 15 + 5,
    runSeconds: 1,
    currentStep: 0,
    startTime: Date.now() - 1000,
    endTime: Date.now(),
    steps: [
      new Step({
        name: 'Walk for 5 seconds',
        status: 'canceled',
        totalSeconds: 5,
        runSeconds: 1,
        startTime: Date.now() - 1000,
        endTime: Date.now()
      }),
      new Step({
        name: 'Run for 15 seconds',
        status: 'canceled',
        totalSeconds: 15,
        runSeconds: 0,
        startTime: null,
        endTime: null
      }),
      new Step({
        name: 'Walk for 5 seconds',
        status: 'complete',
        totalSeconds: 5,
        runSeconds: 0,
        startTime: null,
        endTime: null
      })
    ]
  })
]
