import crypto from 'crypto'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import {
  IMyInfoConfig,
  MyInfoGovClient,
  MyInfoMode,
} from '../../src/MyInfoGovClient.class'
import {
  EXPECTED_PERSON_DATA,
  MOCK_ACCESS_TOKEN,
  MOCK_AUTH_CODE,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_SECRET,
  MOCK_ESRVC_ID,
  MOCK_JWT,
  MOCK_PURPOSE,
  MOCK_RELAY_STATE,
  MOCK_REQUESTED_ATTRIBUTES,
  MOCK_TARGET_URL,
  MOCK_UIN_FIN,
  TEST_PRIVATE_KEY,
  TEST_PUBLIC_KEY,
} from '../constants'
import { mocked } from 'ts-jest/utils'
import qs from 'qs'
import {
  InvalidJWTError,
  MissingAccessTokenError,
  MyInfoResponseError,
  WrongAccessTokenShapeError,
} from '../../src/errors'

jest.mock('axios')
const MockAxios = mocked(axios, true)

jest.mock('jsonwebtoken')
const MockJwtModule = mocked(jwt, true)

describe('MyInfoGovClient', () => {
  const clientParams: IMyInfoConfig = {
    clientId: MOCK_CLIENT_ID,
    clientSecret: MOCK_CLIENT_SECRET,
    mode: MyInfoMode.Dev,
    singpassEserviceId: MOCK_ESRVC_ID,
    clientPrivateKey: TEST_PRIVATE_KEY,
    redirectEndpoint: MOCK_TARGET_URL,
    myInfoPublicKey: TEST_PUBLIC_KEY,
  }
  const missingParamsErrorMsg = `Missing required parameter(s) in constructor: clientId, clientSecret, singpassEserviceId, redirectEndpoint, clientPrivateKey, myInfoPublicKey`

  afterEach(() => jest.restoreAllMocks().resetAllMocks())

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

    it('should convert client secret to string if provided as Buffer', () => {
      const params = {
        ...clientParams,
        clientSecret: Buffer.from(MOCK_CLIENT_SECRET),
      }
      const client = new MyInfoGovClient(params)
      expect(client.clientSecret).toBe(MOCK_CLIENT_SECRET)
    })

    it('should strip the final newline from the private key', () => {
      const mockPrivateKey = 'mockPrivateKey'
      const params = {
        ...clientParams,
        clientPrivateKey: Buffer.from(`${mockPrivateKey}\n`),
      }
      const client = new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(client.clientPrivateKey).toBe(mockPrivateKey)
    })

    it('should strip the final newline from the public key', () => {
      const mockPublicKey = 'mockPublicKey'
      const params = {
        ...clientParams,
        myInfoPublicKey: Buffer.from(`${mockPublicKey}\n`),
      }
      const client = new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(client.myInfoPublicKey).toBe(mockPublicKey)
    })

    it('should throw an error when client ID is not specified', () => {
      const params = {
        ...clientParams,
        clientId: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrowError(missingParamsErrorMsg)
    })

    it('should throw an error when client secret is not specified', () => {
      const params = {
        ...clientParams,
        clientSecret: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrowError(missingParamsErrorMsg)
    })

    it('should throw an error when e-service ID is not specified', () => {
      const params = {
        ...clientParams,
        singpassEserviceId: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrowError(missingParamsErrorMsg)
    })

    it('should throw an error when redirect URL is not specified', () => {
      const params = {
        ...clientParams,
        redirectEndpoint: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrowError(missingParamsErrorMsg)
    })

    it('should throw an error when private key is not specified', () => {
      const params = {
        ...clientParams,
        clientPrivateKey: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrowError(missingParamsErrorMsg)
    })

    it('should throw an error when public key is not specified', () => {
      const params = {
        ...clientParams,
        myInfoPublicKey: undefined,
      }
      const construct = () =>
        new MyInfoGovClient((params as unknown) as IMyInfoConfig)
      expect(construct).toThrowError(missingParamsErrorMsg)
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

  describe('_generateAuthHeader', () => {
    const MOCK_TIMESTAMP = Date.now()
    const MOCK_RANDOM_BYTES = Buffer.from('randomBytes')
    const MOCK_SIGNATURE = 'signature'
    const MOCK_QUERY_PARAMS = {
      a: 'a',
      m: 'm',
      z: 'z',
    }
    const MOCK_URL = 'mockUrl'

    it('should generate the correct signed header for POST requests', () => {
      jest.spyOn(Date, 'now').mockReturnValue(MOCK_TIMESTAMP)

      const mockCryptoSign = jest.fn().mockReturnValue(MOCK_SIGNATURE)
      const mockCryptoUpdate = jest.fn().mockReturnValue({
        sign: mockCryptoSign,
      })
      const randomBytesSpy = jest
        .spyOn(crypto, 'randomBytes')
        .mockImplementation(() => MOCK_RANDOM_BYTES)
      const createSignSpy = jest.spyOn(crypto, 'createSign').mockImplementation(
        () =>
          (({
            update: mockCryptoUpdate,
          } as unknown) as crypto.Signer),
      )

      const client = new MyInfoGovClient(clientParams)
      const method = 'post' as 'POST'
      const expectedNonce = MOCK_RANDOM_BYTES.toString('base64')
      const expectedParamString = qs.stringify(
        {
          // Auth params + MOCK_QUERY_PARAMS in alphabetical order
          a: 'a',
          app_id: client.clientId,
          m: 'm',
          nonce: expectedNonce,
          signature_method: 'RS256',
          timestamp: String(MOCK_TIMESTAMP),
          z: 'z',
        },
        { encode: false },
      )
      const expectedBasestring = `${method.toUpperCase()}&${MOCK_URL}&${expectedParamString}`

      const result = client._generateAuthHeader(
        method,
        MOCK_URL,
        MOCK_QUERY_PARAMS,
      )

      expect(randomBytesSpy).toHaveBeenCalledWith(32)
      expect(createSignSpy).toHaveBeenCalledWith('RSA-SHA256')
      expect(mockCryptoUpdate).toHaveBeenCalledWith(expectedBasestring)
      expect(mockCryptoSign).toHaveBeenCalledWith(
        client.clientPrivateKey,
        'base64',
      )
      expect(result).toBe(
        `PKI_SIGN timestamp="${MOCK_TIMESTAMP}",nonce="${expectedNonce}",app_id="${client.clientId}",signature_method="RS256",signature="${MOCK_SIGNATURE}"`,
      )
    })
  })

  describe('getAccessToken', () => {
    it('should call the Token endpoint with the correct parameters', async () => {
      const client = new MyInfoGovClient(clientParams)
      const expectedUrl = `${client.baseAPIUrl}/token`
      const expectedQueryParamsObj = {
        grant_type: 'authorization_code',
        code: MOCK_AUTH_CODE,
        redirect_uri: client.redirectEndpoint,
        client_id: client.clientId,
        client_secret: client.clientSecret,
      }
      const expectedQueryParams = new URLSearchParams(expectedQueryParamsObj)
      MockAxios.post.mockResolvedValueOnce({
        data: {
          access_token: MOCK_ACCESS_TOKEN,
        },
      })

      const result = await client.getAccessToken(MOCK_AUTH_CODE)
      expect(MockAxios.post).toHaveBeenCalledWith(
        expectedUrl,
        expectedQueryParams,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            Authorization: expect.any(String),
          },
        },
      )
      expect(result).toBe(MOCK_ACCESS_TOKEN)
    })

    it('should reject if MyInfo returns error', async () => {
      const client = new MyInfoGovClient(clientParams)
      const mockError = new Error('rejected')
      MockAxios.post.mockRejectedValueOnce(mockError)

      await expect(client.getAccessToken(MOCK_AUTH_CODE)).rejects.toThrowError(
        new MyInfoResponseError(mockError),
      )
    })

    it('should reject if access token is missing from response', async () => {
      const client = new MyInfoGovClient(clientParams)
      MockAxios.post.mockResolvedValueOnce({
        data: {
          invalidKey: 'invalidValue',
        },
      })

      await expect(client.getAccessToken(MOCK_AUTH_CODE)).rejects.toThrowError(
        new MissingAccessTokenError(),
      )
    })

    it('should reject if access token has the wrong type', async () => {
      const client = new MyInfoGovClient(clientParams)
      MockAxios.post.mockResolvedValueOnce({
        data: {
          access_token: 123,
        },
      })

      await expect(client.getAccessToken(MOCK_AUTH_CODE)).rejects.toThrowError(
        new MissingAccessTokenError(),
      )
    })
  })

  describe('_sendPersonRequest', () => {
    it('should call the Person endpoint with the correct parameters when uinFin is given', async () => {
      const client = new MyInfoGovClient(clientParams)
      const expectedUrl = `${client.baseAPIUrl}/person/${MOCK_UIN_FIN}/`
      const expectedQueryParamsObj = {
        client_id: client.clientId,
        attributes: MOCK_REQUESTED_ATTRIBUTES.join(),
        sp_esvcId: client.singpassEserviceId,
      }
      const mockData = { sub: MOCK_UIN_FIN }
      MockAxios.get.mockResolvedValueOnce({
        data: mockData,
      })

      const result = await client._sendPersonRequest(
        MOCK_ACCESS_TOKEN,
        MOCK_REQUESTED_ATTRIBUTES,
        clientParams.singpassEserviceId,
        MOCK_UIN_FIN,
      )

      expect(MockAxios.get).toHaveBeenCalledWith(expectedUrl, {
        params: expectedQueryParamsObj,
        paramsSerializer: expect.any(Function),
        headers: {
          'Cache-Control': 'no-cache',
          Authorization: expect.any(String),
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should call the Person endpoint with the correct parameters when uinFin is not given', async () => {
      const client = new MyInfoGovClient(clientParams)
      const expectedUrl = `${client.baseAPIUrl}/person/${MOCK_UIN_FIN}/`
      const expectedQueryParamsObj = {
        client_id: client.clientId,
        attributes: MOCK_REQUESTED_ATTRIBUTES.join(),
        sp_esvcId: client.singpassEserviceId,
      }
      const mockData = { sub: MOCK_UIN_FIN }
      MockAxios.get.mockResolvedValueOnce({
        data: mockData,
      })
      MockJwtModule.verify.mockImplementationOnce(() => mockData)

      const result = await client._sendPersonRequest(
        MOCK_ACCESS_TOKEN,
        MOCK_REQUESTED_ATTRIBUTES,
        clientParams.singpassEserviceId,
      )

      expect(MockAxios.get).toHaveBeenCalledWith(expectedUrl, {
        params: expectedQueryParamsObj,
        paramsSerializer: expect.any(Function),
        headers: {
          'Cache-Control': 'no-cache',
          Authorization: expect.any(String),
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should reject if MyInfo returns error', async () => {
      const client = new MyInfoGovClient(clientParams)
      const mockError = new Error('mockError')
      MockAxios.get.mockRejectedValueOnce(mockError)

      const functionCall = () =>
        client._sendPersonRequest(
          MOCK_ACCESS_TOKEN,
          MOCK_REQUESTED_ATTRIBUTES,
          clientParams.singpassEserviceId,
        )

      expect(functionCall()).rejects.toThrowError(
        new MyInfoResponseError(mockError),
      )
    })
  })

  describe('extractUinFin', () => {
    it('should return the decoded NRIC when JWT has correct payload', () => {
      const client = new MyInfoGovClient(clientParams)
      const mockData = { sub: MOCK_UIN_FIN }
      MockJwtModule.verify.mockImplementationOnce(() => mockData)

      const result = client.extractUinFin(MOCK_JWT)

      expect(MockJwtModule.verify).toHaveBeenCalledWith(
        MOCK_JWT,
        client.myInfoPublicKey,
        {
          algorithms: ['RS256'],
        },
      )
      expect(result).toBe(MOCK_UIN_FIN)
    })

    it('should throw error when JWT cannot be verified', () => {
      const client = new MyInfoGovClient(clientParams)
      const mockError = new Error('verifyError')
      MockJwtModule.verify.mockImplementationOnce(() => {
        throw mockError
      })

      const functionCall = () => client.extractUinFin(MOCK_JWT)

      expect(functionCall).toThrowError(new InvalidJWTError(mockError))
    })

    it('should throw error when decoded JWT has invalid type', () => {
      const client = new MyInfoGovClient(clientParams)
      const mockData = 'someString'
      MockJwtModule.verify.mockImplementationOnce(() => mockData)

      const functionCall = () => client.extractUinFin(MOCK_JWT)

      expect(functionCall).toThrowError(new WrongAccessTokenShapeError())
    })

    it('should throw error when decoded JWT is object with invalid shape', () => {
      const client = new MyInfoGovClient(clientParams)
      const mockData = { invalidKey: 'value' }
      MockJwtModule.verify.mockImplementationOnce(() => mockData)

      const functionCall = () => client.extractUinFin(MOCK_JWT)

      expect(functionCall).toThrowError(new WrongAccessTokenShapeError())
    })

    it('should throw error when NRIC has invalid type', () => {
      const client = new MyInfoGovClient(clientParams)
      const mockData = { sub: 123 }
      MockJwtModule.verify.mockImplementationOnce(() => mockData)

      const functionCall = () => client.extractUinFin(MOCK_JWT)

      expect(functionCall).toThrowError(new WrongAccessTokenShapeError())
    })
  })

  describe('getPerson', () => {
    it('should return the Person data when retrieval succeeds and e-service ID is not given', async () => {
      const client = new MyInfoGovClient(clientParams)
      MockJwtModule.verify.mockImplementationOnce(() => ({ sub: MOCK_UIN_FIN }))
      MockAxios.get.mockResolvedValueOnce({
        data: EXPECTED_PERSON_DATA,
      })

      const result = await client.getPerson(
        MOCK_ACCESS_TOKEN,
        MOCK_REQUESTED_ATTRIBUTES,
      )

      expect(result).toEqual({
        uinFin: MOCK_UIN_FIN,
        data: EXPECTED_PERSON_DATA,
      })
    })

    it('should return the Person data when retrieval succeeds and e-service ID is given', async () => {
      const client = new MyInfoGovClient(clientParams)
      MockJwtModule.verify.mockImplementationOnce(() => ({ sub: MOCK_UIN_FIN }))
      MockAxios.get.mockResolvedValueOnce({
        data: EXPECTED_PERSON_DATA,
      })

      const result = await client.getPerson(
        MOCK_ACCESS_TOKEN,
        MOCK_REQUESTED_ATTRIBUTES,
        client.singpassEserviceId,
      )

      expect(result).toEqual({
        uinFin: MOCK_UIN_FIN,
        data: EXPECTED_PERSON_DATA,
      })
    })

    it('should reject when access token cannot be verified', async () => {
      const client = new MyInfoGovClient(clientParams)
      const mockError = new Error('someErrorMessage')
      MockJwtModule.verify.mockImplementationOnce(() => {
        throw mockError
      })

      const functionCall = () =>
        client.getPerson(MOCK_ACCESS_TOKEN, MOCK_REQUESTED_ATTRIBUTES)

      await expect(functionCall()).rejects.toThrowError(
        new InvalidJWTError(mockError),
      )
    })

    it('should reject when access token has wrong type', async () => {
      const client = new MyInfoGovClient(clientParams)
      MockJwtModule.verify.mockImplementationOnce(() => 'invalid')

      const functionCall = () =>
        client.getPerson(MOCK_ACCESS_TOKEN, MOCK_REQUESTED_ATTRIBUTES)

      await expect(functionCall()).rejects.toThrowError(
        new WrongAccessTokenShapeError(),
      )
    })

    it('should reject when Person API call fails', async () => {
      const client = new MyInfoGovClient(clientParams)
      const mockError = new Error('someErrorMessage')
      MockJwtModule.verify.mockImplementationOnce(() => ({ sub: MOCK_UIN_FIN }))
      MockAxios.get.mockRejectedValueOnce(mockError)

      const functionCall = () =>
        client.getPerson(MOCK_ACCESS_TOKEN, MOCK_REQUESTED_ATTRIBUTES)

      await expect(functionCall()).rejects.toThrowError(
        new MyInfoResponseError(mockError),
      )
    })
  })
})
