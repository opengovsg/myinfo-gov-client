import qs from 'qs'
import crypto from 'crypto'
import axios from 'axios'
import { objToSearchParams, sortObjKeys } from './util'

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
  privateKey: string | Buffer
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
  privateKey: string
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
      privateKey,
    } = config

    if (
      !clientId ||
      !clientSecret ||
      !singpassEserviceId ||
      !redirectEndpoint ||
      !privateKey
    ) {
      throw new Error(
        `Missing required parameter(s) in constructor: clientId, clientSecret, singpassEserviceId, redirectEndpoint, privateKey`,
      )
    }

    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectEndpoint = redirectEndpoint
    this.mode = mode || MyInfoMode.Production
    this.singpassEserviceId = singpassEserviceId
    this.privateKey = privateKey.toString().replace(/\n$/, '')
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

  async getPerson(authCode: string): Promise<unknown> {
    let accessToken: string
    try {
      accessToken = await this._getAccessToken(authCode)
    } catch (err) {
      throw new Error(
        `The following error occurred while retrieving the access token: ${err}`,
      )
    }
    return accessToken
  }

  async _getAccessToken(authCode: string): Promise<string> {
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
      Authorization: this._generateAuthHeader(postParams),
    }
    return (
      axios
        // eslint-disable-next-line camelcase
        .post<{ access_token: string }>(
          `${this.baseAPIUrl}${Endpoint.Token}`,
          objToSearchParams(postParams),
          { headers },
        )
        .then((response) => response.data.access_token)
    )
  }

  _generateAuthHeader(postParams: Record<string, string>): string {
    const timestamp = String(Date.now())
    const nonce = crypto.randomBytes(32).toString('base64')
    const authParams = sortObjKeys({
      ...postParams,
      signature_method: 'RS256',
      nonce,
      timestamp,
      app_id: this.clientId,
    })
    const paramString = qs.stringify(authParams, { encode: false })
    const apiUrl = `${this.baseAPIUrl}${Endpoint.Token}`
    const baseString = `POST&${apiUrl}&${paramString}`
    const signature = crypto
      .createSign('RSA-SHA256')
      .update(baseString)
      .sign(this.privateKey, 'base64')
    return `PKI_SIGN timestamp="${timestamp}",nonce="${nonce}",app_id="${this.clientId}",signature_method="RS256",signature="${signature}"`
  }
}
