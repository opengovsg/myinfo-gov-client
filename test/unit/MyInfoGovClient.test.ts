import {
  IMyInfoConfig,
  MyInfoGovClient,
  MyInfoMode,
} from '../../src/MyInfoGovClientV3.class'
import {
  MOCK_CLIENT_ID,
  MOCK_CLIENT_SECRET,
  MOCK_ESRVC_ID,
  MOCK_PURPOSE,
  MOCK_RELAY_STATE,
  MOCK_REQUESTED_ATTRIBUTES,
  MOCK_TARGET_URL,
  TEST_PRIVATE_KEY,
} from '../constants'

describe('MyInfoGovClient', () => {
  const clientParams: IMyInfoConfig = {
    clientId: MOCK_CLIENT_ID,
    clientSecret: MOCK_CLIENT_SECRET,
    mode: MyInfoMode.Dev,
    singpassEserviceId: MOCK_ESRVC_ID,
    privateKey: TEST_PRIVATE_KEY,
    redirectEndpoint: MOCK_TARGET_URL,
  }
  describe('constructor', () => {
    it('should instantiate without errors', () => {
      expect(new MyInfoGovClient(clientParams)).toBeTruthy()
    })

    it('should default to production mode when mode is not specified', () => {
      const params = {
        ...clientParams,
        mode: undefined,
      }
      const client = new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(client.mode).toBe(MyInfoMode.Production)
    })

    it('should strip the final newline from the private key', () => {
      const mockPrivateKey = 'mockPrivateKey'
      const params = {
        ...clientParams,
        privateKey: Buffer.from(`${mockPrivateKey}\n`),
      }
      const client = new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(client.privateKey).toBe(mockPrivateKey)
    })

    it('should throw an error when client ID is not specified', () => {
      const params = {
        ...clientParams,
        clientId: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrow()
    })

    it('should throw an error when client secret is not specified', () => {
      const params = {
        ...clientParams,
        clientSecret: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrow()
    })

    it('should throw an error when e-service ID is not specified', () => {
      const params = {
        ...clientParams,
        singpassEserviceId: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrow()
    })
    it('should throw an error when redirect URL is not specified', () => {
      const params = {
        ...clientParams,
        redirectEndpoint: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrow()
    })

    it('should throw an error when private key is not specified', () => {
      const params = {
        ...clientParams,
        privateKey: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrow()
    })
  })

  describe('createRedirectURL', () => {
    it('should create the correct redirect URL with defaults', () => {
      const client = new MyInfoGovClient(clientParams)
      const redirectUrl = client.createRedirectURL({
        purpose: MOCK_PURPOSE,
        relayState: MOCK_RELAY_STATE,
        requestedAttributes: MOCK_REQUESTED_ATTRIBUTES,
      })
      const parsedUrl = new URL(redirectUrl)
      const queryParams = parsedUrl.searchParams

      expect(parsedUrl.origin + parsedUrl.pathname).toBe(
        client.baseAPIUrl + '/authorise',
      )
      expect(queryParams.getAll('purpose')).toEqual([MOCK_PURPOSE])
      expect(queryParams.getAll('attributes')).toEqual([
        MOCK_REQUESTED_ATTRIBUTES.join(','),
      ])
      expect(queryParams.getAll('state')).toEqual([MOCK_RELAY_STATE])
      expect(queryParams.getAll('redirect_uri')).toEqual([
        clientParams.redirectEndpoint,
      ])
      expect(queryParams.getAll('client_id')).toEqual([clientParams.clientId])
      expect(queryParams.getAll('sp_esvcId')).toEqual([
        clientParams.singpassEserviceId,
      ])
    })

    it('should create the correct redirect URL when e-service ID is specified', () => {
      const client = new MyInfoGovClient(clientParams)
      const mockEsrvcId = 'someOtherEsrvcId'
      const redirectUrl = client.createRedirectURL({
        purpose: MOCK_PURPOSE,
        relayState: MOCK_RELAY_STATE,
        requestedAttributes: MOCK_REQUESTED_ATTRIBUTES,
        singpassEserviceId: mockEsrvcId,
      })
      const parsedUrl = new URL(redirectUrl)
      const queryParams = parsedUrl.searchParams

      expect(parsedUrl.origin + parsedUrl.pathname).toBe(
        client.baseAPIUrl + '/authorise',
      )
      expect(queryParams.getAll('purpose')).toEqual([MOCK_PURPOSE])
      expect(queryParams.getAll('attributes')).toEqual([
        MOCK_REQUESTED_ATTRIBUTES.join(','),
      ])
      expect(queryParams.getAll('state')).toEqual([MOCK_RELAY_STATE])
      expect(queryParams.getAll('redirect_uri')).toEqual([
        clientParams.redirectEndpoint,
      ])
      expect(queryParams.getAll('client_id')).toEqual([clientParams.clientId])
      expect(queryParams.getAll('sp_esvcId')).toEqual([mockEsrvcId])
    })

    it('should create the correct redirect URL when endpoint is specified', () => {
      const client = new MyInfoGovClient(clientParams)
      const mockEndpoint = 'someOtherEndpoint'
      const redirectUrl = client.createRedirectURL({
        purpose: MOCK_PURPOSE,
        relayState: MOCK_RELAY_STATE,
        requestedAttributes: MOCK_REQUESTED_ATTRIBUTES,
        redirectEndpoint: mockEndpoint,
      })
      const parsedUrl = new URL(redirectUrl)
      const queryParams = parsedUrl.searchParams

      expect(parsedUrl.origin + parsedUrl.pathname).toBe(
        client.baseAPIUrl + '/authorise',
      )
      expect(queryParams.getAll('purpose')).toEqual([MOCK_PURPOSE])
      expect(queryParams.getAll('attributes')).toEqual([
        MOCK_REQUESTED_ATTRIBUTES.join(','),
      ])
      expect(queryParams.getAll('state')).toEqual([MOCK_RELAY_STATE])
      expect(queryParams.getAll('redirect_uri')).toEqual([mockEndpoint])
      expect(queryParams.getAll('client_id')).toEqual([clientParams.clientId])
      expect(queryParams.getAll('sp_esvcId')).toEqual([
        clientParams.singpassEserviceId,
      ])
    })
  })
})
