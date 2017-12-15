import models from '.'

export default [
  new models.Run({
    name: 'Sprint',
    id: 'foo',
    steps: [
      new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 }),
      new models.Step({ name: 'Run for 15 seconds', totalSeconds: 15 }),
      new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 })
    ]
  })
]
