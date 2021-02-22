# myinfo-gov-client

A lightweight client to easily call the MyInfo Person v3.2 endpoint for the Singapore government. Tested with NodeJS version >=12.

# Quick Start

```javascript
'use strict'

const fs = require('fs')
const app = require('express')()

const { MyInfoGovClient } = require('@opengovsg/myinfo-gov-client')

// Application configuration
const APP_DOMAIN = '<Your application domain URL>'
const PORT = 5000
const REQUESTED_ATTRIBUTES = ['name', 'sex', 'race']
// Endpoint to which user should be redirected after login
const REDIRECT_ENDPOINT_PATH = '/login'

// MyInfo credentials
const clientId = '<Your Client ID>'
const clientSecret = fs.readFileSync('./secrets/clientSecret.txt')
const singpassEserviceId = '<Your SingPass e-Service ID>'
const myInfoPublicKey = fs.readFileSync('./static/myInfoPublicKey.pem')
const clientPrivateKey = fs.readFileSync('./secrets/privateKey.pem')

// Initialise client
const myInfoGovClient = new MyInfoGovClient({
  clientId,
  clientSecret,
  singpassEserviceId,
  redirectEndpoint: `${APP_DOMAIN}${REDIRECT_ENDPOINT_PATH}`,
  clientPrivateKey,
  myInfoPublicKey,
  mode: 'stg', // Set to 'dev' to call dev endpoint, leave empty for prod
})

app.get('/', (_req, res) => {
  const redirectUrl = client.createRedirectURL({
    purpose: 'Information for my application',
    requestedAttributes: REQUESTED_ATTRIBUTES,
    relayState: 'State to be returned in redirect query parameters',
  })
  return res.send(`
    <a href=${redirectUrl}>Log in</a>
  `)
})

app.get(REDIRECT_ENDPOINT_PATH, async (req, res) => {
  // Authorisation code passed via query parameters
  const { code } = req.query
  const accessToken = await client.getAccessToken(code)
  // Result contains NRIC and MyInfo data
  const result = await client.getPerson(accessToken, REQUESTED_ATTRIBUTES)
  return res.json(result.data)
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
```

# API

## Constructor

```
MyInfoGovClient(config: IMyInfoConfig)
```

### Configuration parameters

Type: `IMyInfoConfig`

**clientId**

Type: `string`

Client ID (also known as App ID).

**clientSecret**

Type: `string | Buffer`

Client secret provided by MyInfo.

**singpassEserviceId**

Type: `string`

The default e-service ID registered with SingPass to use. Can be overridden if necessary in `createRedirectURL` and `getPerson` functions.

**redirectEndpoint**

Type: `string`

Endpoint to which user should be redirected after login.

**clientPrivateKey**

Type: `string | Buffer`

RSA-SHA256 private key, which must correspond with public key provided to MyInfo during the onboarding process.

**myInfoPublicKey**

Type: `string | Buffer`

MyInfo server's public key for verifying their signature

**mode**

Type: `MyInfoMode`

Optional mode, which determines the MyInfo endpoint to call. One of `'dev'`, `'stg'` or `'prod'`. Defaults to `'prod'`.

### Returns

Type: `MyInfoGovClient`

Instance of `MyInfoGovClient`.

## createRedirectUrl

```
.createRedirectUrl(authRequest)
```

### Parameters

Type: `IAuthRequest`

**purpose**

Type: `string`

Purpose of requesting the data, which will be shown to user.

**requestedAttributes**

Type: `MyInfoScope[]`

MyInfo scopes which the user must consent to provide.

**relayState**

Type: `string`

Optional state to be forwarded to the redirect endpoint via query parameters.

**singpassEserviceId**

Type: `string`

Optional alternative e-service ID. Defaults to the e-serviceId provided in the constructor.

**redirectEndpoint**

Type: `string`

Optional alternative redirect endpoint. Defaults to the endpoint provided in the constructor.

### Returns

Type: `string`

The URL to which the user should be redirected to log in to SingPass and consent to providing the given attributes.

## getAccessToken

```
.getAccessToken(authCode)
```

**authCode**

Type: `string`

Authorisation code given by MyInfo in query parameters.

### Returns

Type: `string`

The access token which can be used to call the Person endpoint. This is a JSON web token containing the user's NRIC.

## getPerson

```
.getPerson(accessToken, requestedAttributes, singpassEserviceId)
```

**accessToken**

Type: `string`

The access token retrieved from the Token endpoint using `.getAccessToken`.

**requestedAttributes**

Type: `MyInfoScope[]`

Scopes to request from Myinfo. Should correspond to the scopes provided when initiating SingPass login.

**singpassEserviceId**

Type: `string`

Optional alternative e-service ID. Defaults to the e-serviceId provided in the constructor.

### Returns

Type: `Promise<IPersonResponse>`

An object containing the NRIC/FIN of the user and the attributes retrieved from MyInfo.

## extractUinFin

```
.extractUinFin(accessToken)
```

**accessToken**

Type: `string`

The access token retrieved from the Token endpoint using `.getAccessToken`.

### Returns

Type: `string`

The decoded UIN/FIN contained in the access token JWT. The access token signature is verified before the JWT is decoded.

# Available Test accounts

See a list of available MyInfo test accounts [here](docs/TESTACCOUNTS.md).

# Contributing

We welcome contributions to code open-sourced by the Government Technology
Agency of Singapore. All contributors will be asked to sign a Contributor
License Agreement (CLA) in order to ensure that everybody is free to use their
contributions.
