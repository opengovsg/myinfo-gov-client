import qs from 'qs'
import crypto from 'crypto'
import axios, { AxiosResponse } from 'axios'
import jose from 'node-jose'
import { verify as verifyJwt } from 'jsonwebtoken'
import { hasProp, objToSearchParams, sortObjKeys } from './util'
import { IPerson, MyInfoAttributeString } from './myinfo-types'
import {
  DecryptDataError,
  InvalidJWTError,
  MissingAccessTokenError,
  MissingParamsError,
  MyInfoResponseError,
  WrongDataShapeError,
  WrongAccessTokenShapeError,
} from './errors'

/**
 * Mode in which to initialise the client, which determines the
 * MyInfo endpoint to call.
 */
export enum MyInfoMode {
  Dev = 'dev',
  Staging = 'stg',
  Production = 'prod',
}

const BASE_URL: { [M in MyInfoMode]: string } = {
  [MyInfoMode.Dev]: 'https://sandbox.api.myinfo.gov.sg/gov/v3',
  [MyInfoMode.Staging]: 'https://test.api.myinfo.gov.sg/gov/v3',
  [MyInfoMode.Production]: 'https://api.myinfo.gov.sg/gov/v3',
}

/**
 * Parameters for MyInfoGovClient constructor.
 */
export interface IMyInfoConfig {
  clientId: string
  clientSecret: string | Buffer
  singpassEserviceId: string
  redirectEndpoint: string
  clientPrivateKey: string | Buffer
  myInfoPublicKey: string | Buffer
  mode?: MyInfoMode
}

/**
 * Parameters to create a redirect URL to initialise MyInfo login.
 */
export interface IAuthRequest {
  purpose: string
  requestedAttributes: MyInfoAttributeString[]
  relayState: string
  singpassEserviceId?: string
  redirectEndpoint?: string
}

enum Endpoint {
  Authorise = '/authorise',
  Token = '/token',
  Person = '/person',
}

/**
 * Response shape of getPerson.
 */
export interface IPersonResponse {
  uinFin: string
  data: IPerson
}

/**
 * Convenience wrapper around the MyInfo API for Government
 * digital services.
 */
export class MyInfoGovClient {
  clientId: string
  clientSecret: string
  redirectEndpoint: string
  clientPrivateKey: string
  myInfoPublicKey: string
  singpassEserviceId: string
  mode: MyInfoMode
  baseAPIUrl: string

  /**
   * Class constructor. Each instance of MyInfoGovClient uses one set
   * of credentials registered with MyInfo.
   * @param config Configuration object
   * @param config.clientId Client ID (also known as App ID)
   * @param config.clientSecret Client secret provided by MyInfo
   * @param config.singpassEserviceId ID registered with SingPass
   * @param config.redirectEndpoint Endpoint to which user should be redirected
   *  after login
   * @param config.clientPrivateKey RSA-SHA256 private key,
   * which must correspond with public key provided to MyInfo during the
   * onboarding process
   * @param config.myInfoPublicKey MyInfo server's public key for verifying
   * their signature
   * @param config.mode Optional mode, which determines the MyInfo endpoint
   * to call. Defaults to production mode.
   * @throws {MissingParamsError} Throws if any required parameter is missing
   *
   */
  constructor(config: IMyInfoConfig) {
    const {
      clientId,
      clientSecret,
      mode,
      singpassEserviceId,
      redirectEndpoint,
      clientPrivateKey,
      myInfoPublicKey,
    } = config

    if (
      !clientId ||
      !clientSecret ||
      !singpassEserviceId ||
      !redirectEndpoint ||
      !clientPrivateKey ||
      !myInfoPublicKey
    ) {
      throw new MissingParamsError()
    }

    this.clientId = clientId
    this.clientSecret = clientSecret.toString()
    this.redirectEndpoint = redirectEndpoint
    this.mode = mode || MyInfoMode.Production
    this.singpassEserviceId = singpassEserviceId
    this.clientPrivateKey = clientPrivateKey.toString().replace(/\n$/, '')
    this.myInfoPublicKey = myInfoPublicKey.toString().replace(/\n$/, '')
    this.baseAPIUrl = BASE_URL[this.mode] || BASE_URL.prod
  }

  /**
   * Constructs a redirect URL which the user can visit to initialise
   * SingPass login and consent to providing the given MyInfo attributes.
   * @param config Configuration object
   * @param config.purpose Purpose of requesting the data, which will be
   * shown to user
   * @param config.requestedAttributes MyInfo attributes which the user must
   * consent to provide
   * @param config.relayState State to be forwarded to the redirect endpoint
   * via query parameters
   * @param config.singpassEserviceId Optional alternative e-service ID.
   * Defaults to the e-serviceId provided in the constructor.
   * @param config.redirectEndpoint Optional alternative redirect endpoint.
   * Defaults to the endpoint provided in the constructor.
   * @returns The URL which the user should visit to log in to SingPass
   * and consent to providing the given attributes.
   */
  createRedirectURL({
    purpose,
    requestedAttributes,
    relayState,
    singpassEserviceId,
    redirectEndpoint,
  }: IAuthRequest): string {
    const queryParams = qs.stringify({
      purpose,
      attributes: requestedAttributes.join(),
      state: relayState,
      client_id: this.clientId,
      redirect_uri: redirectEndpoint ?? this.redirectEndpoint,
      sp_esvcId: singpassEserviceId ?? this.singpassEserviceId,
    })
    return `${this.baseAPIUrl}${Endpoint.Authorise}?${queryParams}`
  }

  /**
   * Retrieves the given MyInfo attributes from the Person endpoint after
   * the client has logged in to SingPass and consented to providing the given
   * attributes.
   * @param accessToken Access token given by MyInfo
   * @param requestedAttributes Attributes to request from Myinfo. Should correspond
   * to the attributes provided when initiating SingPass login.
   * @param singpassEserviceId Optional alternative e-service ID.
   * Defaults to the e-serviceId provided in the constructor.
   * @returns Object containing the user's NRIC/FIN and the data
   * @throws {InvalidJWTError} Throws if the JWT signature is invalid
   * @throws {WrongAccessTokenShapeError} Throws if decoded JWT has an unexpected
   * type or shape
   * @throws {MyInfoResponseError} Throws if MyInfo returns a non-200 response
   */
  async getPerson(
    accessToken: string,
    requestedAttributes: MyInfoAttributeString[],
    singpassEserviceId?: string,
  ): Promise<IPersonResponse> {
    // Extract NRIC
    const uinFin = this.extractUinFin(accessToken)
    // Get Person data
    const data = await this._sendPersonRequest(
      accessToken,
      requestedAttributes,
      singpassEserviceId ?? this.singpassEserviceId,
      uinFin,
    )
    return { uinFin, data }
  }

  /**
   * Requests MyInfo attribute data from the Person endpoint.
   * @param accessToken Access token provided by Token endpoint
   * @param requestedAttributes Attributes to request from MyInfo, which
   * user has consented to provide
   * @param singpassEserviceId ID registered with SingPass
   * @param uinFin Optional uinFin if it has already been decoded. If not
   * given, it is extracted from the access token.
   * @returns Data retrieved from the Person endpoint
   * @throws {MyInfoResponseError} Throws if MyInfo returns a non-200 response
   */
  async _sendPersonRequest(
    accessToken: string,
    requestedAttributes: MyInfoAttributeString[],
    singpassEserviceId: string,
    uinFin?: string,
  ): Promise<IPerson> {
    const definedUinFin = uinFin ?? this.extractUinFin(accessToken)
    const url = `${this.baseAPIUrl}${Endpoint.Person}/${definedUinFin}/`
    const params = {
      client_id: this.clientId,
      attributes: requestedAttributes.join(),
      sp_esvcId: singpassEserviceId,
    }
    const paramsAuthHeader = this._generateAuthHeader('GET', url, params)
    const headers = {
      'Cache-Control': 'no-cache',
      Authorization: `${paramsAuthHeader},Bearer ${accessToken}`,
    }
    let response: AxiosResponse<IPerson | string>
    try {
      response = await axios.get(url, {
        headers,
        params,
        paramsSerializer: qs.stringify,
      })
    } catch (err: unknown) {
      throw new MyInfoResponseError(err)
    }
    // In dev mode, the response is automatically parsed to an object by Axios.
    // Otherwise, the response is a JWE and must be decrypted.
    if (typeof response.data === 'string') {
      return this._decryptJWE(response.data)
    }
    return response.data
  }

  /**
   * Extracts the UIN or FIN from the access token.
   * @param accessToken JSON web token, which is the access token provided
   * by the Token endpoint
   * @returns The UIN or FIN decoded from the JWT
   * @throws {InvalidJWTError} Throws if the JWT signature is invalid
   * @throws {WrongAccessTokenShapeError} Throws if decoded JWT has an unexpected
   * type or shape
   */
  extractUinFin(accessToken: string): string {
    let decoded: string | object
    try {
      decoded = verifyJwt(accessToken, this.myInfoPublicKey, {
        algorithms: ['RS256'],
      })
    } catch (err: unknown) {
      throw new InvalidJWTError(err)
    }
    if (
      typeof decoded === 'object' &&
      hasProp(decoded, 'sub') &&
      typeof decoded.sub === 'string'
    ) {
      return decoded.sub
    }
    throw new WrongAccessTokenShapeError()
  }

  /**
   * Retrieves the access token from the Token endpoint.
   * @param authCode Authorisation code provided to the redirect endpoint
   * @returns The access token as a JWT
   * @throws {MyInfoResponseError} Throws if MyInfo returns a non-200 response
   * @throws {MissingAccessTokenError} Throws if MyInfo response does not
   * contain the access token
   */
  async getAccessToken(authCode: string): Promise<string> {
    const postUrl = `${this.baseAPIUrl}${Endpoint.Token}`
    const postParams = {
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: this.redirectEndpoint,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
      Authorization: this._generateAuthHeader('POST', postUrl, postParams),
    }
    let response: AxiosResponse<{ access_token: string }>
    try {
      response = await axios
        // eslint-disable-next-line camelcase
        .post(postUrl, objToSearchParams(postParams), { headers })
    } catch (err: unknown) {
      throw new MyInfoResponseError(err)
    }
    if (
      !response?.data?.access_token ||
      typeof response.data.access_token !== 'string'
    ) {
      throw new MissingAccessTokenError()
    }
    return response.data.access_token
  }

  /**
   * Generates the content of the 'Authorization' header to be sent
   * with a request to MyInfo.
   * @param method HTTP method to be used for the request
   * @param url Endpoint to which the request is being sent
   * @param urlParams Query parameters being sent with the request
   * @returns The content which should be provided as the Authorization
   * header
   */
  _generateAuthHeader(
    method: 'POST' | 'GET',
    url: string,
    urlParams: Record<string, string>,
  ): string {
    const timestamp = String(Date.now())
    const nonce = crypto.randomBytes(32).toString('base64')
    const authParams = sortObjKeys({
      ...urlParams,
      signature_method: 'RS256',
      nonce,
      timestamp,
      app_id: this.clientId,
    })
    const paramString = qs.stringify(authParams, { encode: false })
    const baseString = `${method.toUpperCase()}&${url}&${paramString}`
    const signature = crypto
      .createSign('RSA-SHA256')
      .update(baseString)
      .sign(this.clientPrivateKey, 'base64')
    return `PKI_SIGN timestamp="${timestamp}",nonce="${nonce}",app_id="${this.clientId}",signature_method="RS256",signature="${signature}"`
  }

  /**
   * Decrypts a JWE response string
   * @param jweResponse Fullstop-delimited jweResponse string
   * @return Promise which resolves to a parsed response
   * @throws {DecryptDataError} Throws if an error occurs while decrypting
   * @throws {WrongDataShapeError} Throws if decrypted data from MyInfo is
   * of the wrong type
   */
  async _decryptJWE(jwe: string): Promise<IPerson> {
    let decoded: string | IPerson
    try {
      const keystore = await jose.JWK.createKeyStore().add(
        this.clientPrivateKey,
        'pem',
      )
      const { payload } = await jose.JWE.createDecrypt(keystore).decrypt(jwe)
      const jwt = JSON.parse(payload.toString())
      decoded = verifyJwt(jwt, this.myInfoPublicKey, {
        algorithms: ['RS256'],
      })
    } catch (err: unknown) {
      throw new DecryptDataError(err)
    }
    if (typeof decoded !== 'object') {
      throw new WrongDataShapeError()
    }
    return decoded
  }
}
