import { MyInfoGovClient, MyInfoMode } from '../../src/MyInfoGovClientV3.class'
import {
  MOCK_CLIENT_ID,
  MOCK_CLIENT_SECRET,
  MOCK_ESRVC_ID,
  MOCK_PURPOSE,
  MOCK_RELAY_STATE,
  MOCK_REQUESTED_ATTRIBUTES,
  MOCK_TARGET_URL,
} from '../constants'

describe('MyInfoGovClient', () => {
  const client = new MyInfoGovClient({
    clientId: MOCK_CLIENT_ID,
    clientSecret: MOCK_CLIENT_SECRET,
    mode: MyInfoMode.Dev,
    singpassEserviceId: MOCK_ESRVC_ID,
  })
  describe('constructor', () => {
    it('should instantiate without errors', () => {
      expect(client).toBeTruthy()
    })
  })

  describe('createRedirectURL', () => {
    it('should create the correct redirect URL when e-service ID is not specified', () => {
      const redirectUrl = client.createRedirectURL({
        purpose: MOCK_PURPOSE,
        relayState: MOCK_RELAY_STATE,
        requestedAttributes: MOCK_REQUESTED_ATTRIBUTES,
        targetUrl: MOCK_TARGET_URL,
      })
      const parsedUrl = new URL(redirectUrl)
      const queryParams = parsedUrl.searchParams

      expect(parsedUrl.origin + parsedUrl.pathname).toBe(
        client.baseUrl + '/authorise',
      )
      expect(queryParams.getAll('purpose')).toEqual([MOCK_PURPOSE])
      expect(queryParams.getAll('attributes')).toEqual([
        MOCK_REQUESTED_ATTRIBUTES.join(','),
      ])
      expect(queryParams.getAll('state')).toEqual([MOCK_RELAY_STATE])
      expect(queryParams.getAll('redirect_uri')).toEqual([MOCK_TARGET_URL])
      expect(queryParams.getAll('client_id')).toEqual([MOCK_CLIENT_ID])
      expect(queryParams.getAll('sp_esvcId')).toEqual([MOCK_ESRVC_ID])
    })

    it('should create the correct redirect URL when e-service ID is specified', () => {
      const mockEsrvcId = 'someOtherEsrvcId'
      const redirectUrl = client.createRedirectURL({
        purpose: MOCK_PURPOSE,
        relayState: MOCK_RELAY_STATE,
        requestedAttributes: MOCK_REQUESTED_ATTRIBUTES,
        targetUrl: MOCK_TARGET_URL,
        singpassEserviceId: mockEsrvcId,
      })
      const parsedUrl = new URL(redirectUrl)
      const queryParams = parsedUrl.searchParams

      expect(parsedUrl.origin + parsedUrl.pathname).toBe(
        client.baseUrl + '/authorise',
      )
      expect(queryParams.getAll('purpose')).toEqual([MOCK_PURPOSE])
      expect(queryParams.getAll('attributes')).toEqual([
        MOCK_REQUESTED_ATTRIBUTES.join(','),
      ])
      expect(queryParams.getAll('state')).toEqual([MOCK_RELAY_STATE])
      expect(queryParams.getAll('redirect_uri')).toEqual([MOCK_TARGET_URL])
      expect(queryParams.getAll('client_id')).toEqual([MOCK_CLIENT_ID])
      expect(queryParams.getAll('sp_esvcId')).toEqual([mockEsrvcId])
    })
  })
})
