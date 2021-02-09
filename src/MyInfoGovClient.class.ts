import qs from 'qs'
import crypto from 'crypto'
import axios, { AxiosResponse } from 'axios'
import { hasProp, objToSearchParams, sortObjKeys } from './util'
import { verify as verifyJwt } from 'jsonwebtoken'
import { IPerson, MyInfoAttributeString } from './myinfo-types'
import {
  InvalidJWTError,
  MissingAccessTokenError,
  MissingParamsError,
  MyInfoResponseError,
  WrongJWTShapeError,
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
  relayState?: string
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
   * @param config.relayState Optional state to be forwarded to the redirect endpoint
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
      state: relayState ?? '',
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
   * @returns Object containing access token used to retrieve the data,
   * the NRIC/FIN and the data
   */
  async getPerson(
    accessToken: string,
    requestedAttributes: MyInfoAttributeString[],
  ): Promise<IPersonResponse> {
    // Extract NRIC
    const uinFin = this._extractUinFin(accessToken)
    // Get Person data
    const data = await this._sendPersonRequest(
      accessToken,
      requestedAttributes,
      uinFin,
    )
    return { uinFin, data }
  }

  /**
   * Requests MyInfo attribute data from the Person endpoint.
   * @param accessToken Access token provided by Token endpoint
   * @param requestedAttributes Attributes to request from MyInfo, which
   * user has consented to provide
   * @param uinFin Optional uinFin if it has already been decoded. If not
   * given, it is extracted from the access token.
   * @returns Response object from the API call to the Person endpoint
   */
  async _sendPersonRequest(
    accessToken: string,
    requestedAttributes: MyInfoAttributeString[],
    uinFin?: string,
  ): Promise<IPerson> {
    const definedUinFin = uinFin ?? this._extractUinFin(accessToken)
    const url = `${this.baseAPIUrl}${Endpoint.Person}/${definedUinFin}/`
    const params = {
      client_id: this.clientId,
      attributes: requestedAttributes.join(),
    }
    const paramsAuthHeader = this._generateAuthHeader('GET', url, params)
    const headers = {
      'Cache-Control': 'no-cache',
      Authorization: `${paramsAuthHeader},Bearer ${accessToken}`,
    }
    let response: AxiosResponse<IPerson>
    try {
      response = await axios.get<IPerson>(url, {
        headers,
        params,
        paramsSerializer: qs.stringify,
      })
    } catch (err: unknown) {
      throw new MyInfoResponseError(err)
    }
    return response.data
  }

  /**
   * Extracts the UIN or FIN from the access token.
   * @param jwt JSON web token, which is the access token provided
   * by the Token endpoint
   * @returns The UIN or FIN decoded from the JWT
   */
  _extractUinFin(jwt: string): string {
    let decoded: string | object
    try {
      decoded = verifyJwt(jwt, this.myInfoPublicKey, {
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
    throw new WrongJWTShapeError()
  }

  /**
   * Retrieves the access token from the Token endpoint.
   * @param authCode Authorisation code provided to the redirect endpoint
   * @returns The access token as a JWT
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
}
