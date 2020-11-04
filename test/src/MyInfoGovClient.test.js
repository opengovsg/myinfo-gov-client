const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const proxyquire = require('proxyquire')

const PRIVATE_KEY = fs.readFileSync(
  path.resolve(__dirname, '../resources/private.pem'),
)

const SAMPLE_RESPONSE = fs.readFileSync(
  path.resolve(__dirname, '../resources/response.txt'),
)

const MOCK_RESPONSE = {
  statusCode: 200,
  data: JSON.stringify({ mockKey: 'mockValue' }),
}

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

    it('should make API call with correct parameters', async function () {
      this.timeout(5000)

      const axiosStub = {
        get: function (url, options) {
          expect(options.headers['Content-Type']).to.equal('application/json')
          expect(options.headers['Accept']).to.equal('application/json')
          expect(url).to.equal(`https://myinfosgstg.api.gov.sg/gov/dev/v1/person-basic/${uinFin}/`)
          expect(options.params.attributes).to.equal('name,marriedname,hanyupinyinname,aliasname,hanyupinyinaliasname,sex,race,dialect,nationality,dob,birthcountry,secondaryrace,residentialstatus,passportnumber,passportexpirydate,email,mobileno,regadd,housingtype,hdbtype,mailadd,billadd,marital,edulevel,marriagecertno,countryofmarriage,marriagedate,divorcedate,childrenbirthrecords,relationships,edulevel,gradyear,schoolname,occupation,employment,workpassstatus,workpassexpirydate,householdincome,vehno')
          expect(options.params.client_id).to.equal('STG2-MYORG-MYAPP-SP')
          expect(options.params.singpassEserviceId).to.equal('MYORG-MYAPP-SP')
          expect(options.params.txnNo).to.be.undefined

          // Testing Authorization header
          let authHeaderObj = {}
          options.headers['Authorization']
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
          expect(authHeaderObj['apex_l2_eg_timestamp']).to.exist
          return Promise.resolve(MOCK_RESPONSE)
        },
      }

      const { MyInfoGovClient } = proxyquire(
        '../../build/MyInfoGovClient.class.js',
        { axios: axiosStub },
      )

      myInfoClient = new MyInfoGovClient({
        realm,
        appId,
        clientId,
        singpassEserviceId,
        privateKey,
        mode: 'dev',
      })

      await myInfoClient.getPersonBasic(params)
    })

    it('should parse the response correctly', function (done) {
      const axiosStub = {
        get: function () {
          return Promise.resolve({ data: SAMPLE_RESPONSE.toString() })
        },
      }

      const { MyInfoGovClient } = proxyquire(
        '../../build/MyInfoGovClient.class.js',
        { axios: axiosStub },
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
          { uinFin },
        )
        expect(personObject).to.deep.equal(expectedPersonObject)
        done()
      })
    })
  })
})
