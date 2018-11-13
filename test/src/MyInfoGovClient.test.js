const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const proxyquire = require('proxyquire')

const PRIVATE_KEY = fs.readFileSync(
  path.resolve(__dirname, '../resources/private.pem')
)

const SAMPLE_RESPONSE = fs.readFileSync(
  path.resolve(__dirname, '../resources/response.txt')
)

const ALL_ATTRIBUTES = [
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

describe('MyInfoGovClient', function () {
  describe('getPersonBasic', function () {
    let realm
    let appId
    let clientId
    let singpassEserviceId
    let privateKey
    let uinFin

    beforeEach(function () {
      // Your application configuration
      realm = 'MYAPP'
      appId = 'STG2-MYORG-MYAPP-SP'
      clientId = appId
      singpassEserviceId = 'MYORG-MYAPP-SP'
      privateKey = PRIVATE_KEY

      // request parameters
      uinFin = 'S3000024B'
    })

    it('should make API call and parse response correctly', function () {
      let requestStub = function (requestDetails, callback) {
        let response = { statusCode: 200 }
        callback(undefined, response, SAMPLE_RESPONSE)
      }

      let MyInfoGovClient = proxyquire(
        '../../src/MyInfoGovClient.class.js',
        { request: requestStub }
      )

      let myInfoClient = new MyInfoGovClient({
        realm,
        appId,
        clientId,
        singpassEserviceId,
        privateKey,
        mode: 'dev',
      })

      let params = {
        uinFin,
        requestedAttributes: ALL_ATTRIBUTES,
      }

      myInfoClient.getPersonBasic(params).then(personObject => {
        const expectedPersonObject = Object.assign({},
          JSON.parse(SAMPLE_RESPONSE),
          { uinFin }
        )
        expect(personObject).to.deep.equal(expectedPersonObject)
      })
    })
  })
})
