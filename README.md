# myinfo-gov-client

A lightweight client to easily call the MyInfo TUO endpoint for the Singapore government. Compatible with NodeJS version >=10.

# Quick Start

```javascript
'use strict'

const fs = require('fs')

const {
  MyInfoGovClient,
  CATEGORICAL_DATA_DICT, // Use this to look up code values
} = require('@opengovsg/myinfo-gov-client')

function main() {
  // Your application configuration
  const realm = '<Your Realm>'
  const appId = '<Your App ID>'
  const clientId = appId // Usually the same value
  const singpassEserviceId = '<Your SingPass e-Service ID>'

  // Used for signing your request basestring with private key
  const privateKey = fs.readFileSync('./secrets/privateKey.pem')

  // MyInfo client
  const myInfo = new MyInfoGovClient({
    realm,
    appId,
    clientId,
    singpassEserviceId,
    privateKey,
    mode: 'stg', // Set to 'dev' to call dev endpoint, leave empty for prod
  })

  // API params
  const uinFin = 'S3000024B' // See list of dev/staging NRICs below
  const requestedAttributes = [
    'name',
    'marriedname',
    'hanyupinyinname',
    'aliasname',
    'hanyupinyinaliasname',
    'sex',
    'race',
    'dialect',
    'nationality',
    'dob',
    'birthcountry',
    'secondaryrace',
    'residentialstatus',
    'passportnumber',
    'passportexpirydate',
    'email',
    'mobileno',
    'regadd',
    'housingtype',
    'hdbtype',
    'mailadd',
    'billadd',
    'marital',
    'edulevel',
    'marriagecertno',
    'countryofmarriage',
    'marriagedate',
    'divorcedate',
    'childrenbirthrecords',
    'relationships',
    'edulevel',
    'gradyear',
    'schoolname',
    'occupation',
    'employment',
    'workpassstatus',
    'workpassexpirydate',
    'householdincome',
    'vehno',
  ]
  const txnNo = 1234 // an optional transaction number

  // API parameters
  var params = { uinFin, requestedAttributes, txnNo }

  // Make API call
  myInfo
    .getPersonBasic(params)
    .then(function (personObject) {
      console.log('Results of Person-Basic endpoint:\n', personObject)
    })
    .catch(function (error) {
      console.log('Error:\n', error)
    })
}

main()
```

# Available Test accounts

See a list of available MyInfo test accounts [here](docs/TESTACCOUNTS.md).

# Contributing

We welcome contributions to code open-sourced by the Government Technology
Agency of Singapore. All contributors will be asked to sign a Contributor
License Agreement (CLA) in order to ensure that everybody is free to use their
contributions.
