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
    let myInfoClient
    let params

    beforeEach(function () {
      // Your application configuration
      realm = 'MYAPP'
      appId = 'STG2-MYORG-MYAPP-SP'
      clientId = appId
      singpassEserviceId = 'MYORG-MYAPP-SP'
      privateKey = PRIVATE_KEY

      // request parameters
      uinFin = 'S3000024B'
      params = {
        uinFin,
        requestedAttributes: ALL_ATTRIBUTES,
      }
    })

    it('should make API call with correct parameters', function () {
      this.timeout(5000)

      let requestStub = function (requestDetails, callback) {
        expect(requestDetails.method).to.equal('GET')
        expect(requestDetails.headers['Content-Type']).to.equal('application/json')
        expect(requestDetails.headers['Content-Encoding']).to.equal('gzip')
        expect(requestDetails.headers['Accept']).to.equal('application/json')
        expect(requestDetails.uri).to.equal(`https://myinfosgstg.api.gov.sg/gov/dev/v1/person-basic/${uinFin}/`)
        expect(requestDetails.qs.attributes).to.equal('name,marriedname,hanyupinyinname,aliasname,hanyupinyinaliasname,sex,race,dialect,nationality,dob,birthcountry,secondaryrace,residentialstatus,passportnumber,passportexpirydate,email,mobileno,regadd,housingtype,hdbtype,mailadd,billadd,marital,edulevel,marriagecertno,countryofmarriage,marriagedate,divorcedate,childrenbirthrecords,relationships,edulevel,gradyear,schoolname,occupation,employment,workpassstatus,workpassexpirydate,householdincome,vehno')
        expect(requestDetails.qs.client_id).to.equal('STG2-MYORG-MYAPP-SP')
        expect(requestDetails.qs.singpassEserviceId).to.equal('MYORG-MYAPP-SP')
        expect(requestDetails.qs.txnNo).to.be.undefined

        // Testing Authorization header
        let authHeaderObj = {}
        requestDetails.headers['Authorization']
          .split(',')
          .map((keyValueString) => {
            let [key, value] = keyValueString.split('=')
            authHeaderObj[key] = value.replace(/"/g, '')
          })

        expect(authHeaderObj['Apex_l2_Eg realm']).to.equal('MYAPP')
        expect(authHeaderObj['apex_l2_eg_app_id']).to.equal('STG2-MYORG-MYAPP-SP')
        expect(authHeaderObj['apex_l2_eg_signature_method']).to.equal('SHA256withRSA')
        expect(authHeaderObj['apex_l2_eg_version']).to.equal('1.0')
        expect(authHeaderObj['apex_l2_eg_signature']).to.exist
      }

      let MyInfoGovClient = proxyquire(
        '../../src/MyInfoGovClient.class.js',
        { request: requestStub }
      )

      myInfoClient = new MyInfoGovClient({
        realm,
        appId,
        clientId,
        singpassEserviceId,
        privateKey,
        mode: 'dev',
      })

      myInfoClient.getPersonBasic(params)
        .catch(error => {
          console.error(error)
          throw new Error(error)
        })
    })

    it('should parse the response correctly', function (done) {
      let requestStub = function (requestDetails, callback) {
        let response = { statusCode: 200 }
        callback(undefined, response, SAMPLE_RESPONSE)
      }

      let MyInfoGovClient = proxyquire(
        '../../src/MyInfoGovClient.class.js',
        { request: requestStub }
      )

      myInfoClient = new MyInfoGovClient({
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
        done()
      })
    })
  })
})
