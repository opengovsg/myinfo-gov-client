import qs from 'qs'
import crypto from 'crypto'
import axios from 'axios'
import { hasProp, objToSearchParams, sortObjKeys } from './util'
import { verify as verifyJwt } from 'jsonwebtoken'

export enum MyInfoMode {
  Dev = 'dev',
  Staging = 'stg',
  Production = 'prod',
}

const BASE_URL: { [M in MyInfoMode]: string } = {
  [MyInfoMode.Dev]: 'http://localhost:5156/myinfo/v3',
  [MyInfoMode.Staging]: 'https://myinfosgstg.api.gov.sg/gov/test/v3',
  [MyInfoMode.Production]: 'https://myinfosg.api.gov.sg/gov/v3',
}

export interface IMyInfoConfig {
  clientId: string
  clientSecret: string
  singpassEserviceId: string
  redirectEndpoint: string
  clientPrivateKey: string | Buffer
  myInfoPublicKey: string | Buffer
  mode?: MyInfoMode
}

export interface IPersonRequest {
  purpose: string
  requestedAttributes: string[]
  relayState: string
  singpassEserviceId?: string
  redirectEndpoint?: string
}

enum Endpoint {
  Authorise = '/authorise',
  Token = '/token',
  Person = '/person',
}

export class MyInfoGovClient {
  clientId: string
  clientSecret: string
  redirectEndpoint: string
  clientPrivateKey: string
  myInfoPublicKey: string
  singpassEserviceId: string
  mode: MyInfoMode
  baseAPIUrl: string

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
      throw new Error(
        `Missing required parameter(s) in constructor: clientId, clientSecret, singpassEserviceId, redirectEndpoint, clientPrivateKey, myInfoPublicKey`,
      )
    }

    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectEndpoint = redirectEndpoint
    this.mode = mode || MyInfoMode.Production
    this.singpassEserviceId = singpassEserviceId
    this.clientPrivateKey = clientPrivateKey.toString().replace(/\n$/, '')
    this.myInfoPublicKey = myInfoPublicKey.toString().replace(/\n$/, '')
    this.baseAPIUrl = BASE_URL[this.mode] || BASE_URL.prod
  }

  createRedirectURL({
    purpose,
    relayState,
    requestedAttributes,
    singpassEserviceId,
    redirectEndpoint,
  }: IPersonRequest): string {
    const queryParams = {
      purpose,
      attributes: requestedAttributes.join(),
      state: relayState,
      client_id: this.clientId,
      redirect_uri: redirectEndpoint ?? this.redirectEndpoint,
      sp_esvcId: singpassEserviceId ?? this.singpassEserviceId,
    }
    return `${this.baseAPIUrl}${Endpoint.Authorise}?${qs.stringify(
      queryParams,
    )}`
  }

  async getPerson(
    authCode: string,
    requestedAttributes: string[],
  ): Promise<{ accessToken: string; data: unknown }> {
    // Obtain access token
    let accessToken: string
    try {
      accessToken = await this._getAccessToken(authCode)
    } catch (err) {
      throw new Error(
        `The following error occurred while retrieving the access token: ${err}`,
      )
    }

    // Extract NRIC
    let uinFin
    try {
      uinFin = this._extractUinFin(accessToken)
    } catch (err) {
      throw new Error(
        `The following error occurred while decoding the token from MyInfo: ${err}`,
      )
    }

    // Get Person data
    let data
    try {
      data = await this._sendPersonRequest(
        accessToken,
        requestedAttributes,
        uinFin,
      )
    } catch (err) {
      throw new Error(
        `The following error occurred while calling the Person API: ${err}`,
      )
    }
    return { accessToken, data }
  }

  async _sendPersonRequest(
    accessToken: string,
    requestedAttributes: string[],
    uinFin?: string,
  ): Promise<unknown> {
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
    return axios
      .get(url, {
        headers,
        params,
        paramsSerializer: (params) => qs.stringify(params),
      })
      .then((response) => response.data)
  }

  _extractUinFin(jwt: string): string {
    const decoded = verifyJwt(jwt, this.myInfoPublicKey, {
      algorithms: ['RS256'],
    })
    if (typeof decoded !== 'object') {
      throw new Error('JWT returned from MyInfo had unexpected shape')
    }
    if (hasProp(decoded, 'sub') && typeof decoded.sub === 'string') {
      return decoded.sub
    }
    throw new Error('JWT returned from MyInfo did not contain UIN/FIN')
  }

  async _getAccessToken(authCode: string): Promise<string> {
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
    return (
      axios
        // eslint-disable-next-line camelcase
        .post<{ access_token: string }>(
          postUrl,
          objToSearchParams(postParams),
          { headers },
        )
        .then((response) => response.data.access_token)
    )
  }

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
