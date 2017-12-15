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
  new Run({
    id: 'foo',
    name: 'Sprint',
    status: 'program',
    totalSeconds: 0,
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
  })
]
