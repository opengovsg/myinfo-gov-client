import { MyInfoGovClient } from '../../src/MyInfoGovClientV3.class'

describe('MyInfoGovClient', () => {
  describe('constructor', () => {
    it('should instantiate without errors', () => {
      const client = new MyInfoGovClient()
      expect(client).toBeTruthy()
    })
  })
})
