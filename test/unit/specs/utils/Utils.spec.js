import utils from '@/stepwatch/utils'

describe('Utils', () => {
  describe('formatSeconds', () => {
    it('displays mm:ss time for times less than an hour', () => {
      expect(utils.formatSeconds(3599)).to.match(/[0-9][0-9]:[0-9][0-9]/)
    })

    it('displays hh:mm:ss time for times equal to over an hour', () => {
      expect(utils.formatSeconds(3600)).to.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/)
    })
  })
})
