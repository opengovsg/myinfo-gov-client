import qs from 'qs'

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
  mode?: MyInfoMode
}

export interface IPersonRequest {
  purpose: string
  requestedAttributes: string[]
  relayState: string
  targetUrl: string
  singpassEserviceId?: string
}

enum Endpoint {
  Authorise = '/authorise',
  Token = '/token',
  Person = '/person',
}

export class MyInfoGovClient {
  clientId: string
  clientSecret: string
  mode: MyInfoMode
  singpassEserviceId: string
  baseUrl: string

  constructor(config: IMyInfoConfig) {
    const { clientId, clientSecret, mode, singpassEserviceId } = config

    if (!clientId || !clientSecret || !singpassEserviceId) {
      throw new Error(
        'Missing required parameter(s) in constructor:' +
          ' clientId, clientSecret',
      )
    }

    this.clientId = clientId
    this.clientSecret = clientSecret
    this.mode = mode || MyInfoMode.Production
    this.singpassEserviceId = singpassEserviceId
    this.baseUrl = BASE_URL[this.mode] || BASE_URL.prod
  }

  createRedirectURL({
    purpose,
    targetUrl,
    relayState,
    requestedAttributes,
    singpassEserviceId,
  }: IPersonRequest): string {
    const eSrvcIdDefined = singpassEserviceId ?? this.singpassEserviceId
    const queryParams = {
      purpose,
      attributes: requestedAttributes.join(),
      state: relayState,
      redirect_uri: targetUrl,
      client_id: this.clientId,
      sp_esvcId: eSrvcIdDefined,
    }
    return `${this.baseUrl}${Endpoint.Authorise}?${qs.stringify(queryParams)}`
  }
}
