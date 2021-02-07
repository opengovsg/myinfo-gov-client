# myinfo-gov-client

A lightweight client to easily call the MyInfo Person endpoint for the Singapore government. Compatible with NodeJS version >=10.

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
  })
  return res.send(`
    <a href=${redirectUrl}>Log in</a>
  `)
})

app.get(REDIRECT_ENDPOINT_PATH, (req, res) => {
  // Authorisation code passed via query parameters
  const { code } = req.query
  // Result contains access token, NRIC and MyInfo data
  const result = await client.getPerson(code, REQUESTED_ATTRIBUTES)
  return res.json(result.data)
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
```

# Available Test accounts

See a list of available MyInfo test accounts [here](docs/TESTACCOUNTS.md).

# Contributing

We welcome contributions to code open-sourced by the Government Technology
Agency of Singapore. All contributors will be asked to sign a Contributor
License Agreement (CLA) in order to ensure that everybody is free to use their
contributions.
