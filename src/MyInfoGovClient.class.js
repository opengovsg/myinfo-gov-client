'use strict'

const crypto = require('crypto')
const jose = require('node-jose')
const path = require('path')
const request = require('request')

const BASE_URL = {
  dev: 'https://myinfosgstg.api.gov.sg/gov/dev/v1/',
  stg: 'https://myinfosgstg.api.gov.sg/gov/test/v2/',
  prod: 'https://myinfosg.api.gov.sg/gov/v2/',
}

const ENDPOINT = {
  // Person-Basic API
  personBasic: 'person-basic',
  // TODO: Create functions to help with Person API
  authorise: 'authorise',
  token: 'token',
  person: 'person',
}

const ALL_ATTRIBUTES = {
  personBasic: [
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
  ],
}

class MyInfoGovClient {
  /**
   *  Constructor for MyInfoGovClient, which helps call the internal,
   *  non-public-facing MyInfo TUO.
   *  @param {Object} config Config object to create an MyInfoGovClient.
   *  @param {string} config.realm - Name of MyInfo application e.g. 'FormSG'
   *  @param {string} config.appId - ID of MyInfo application
   *  e.g. 'STG2-GOVTECH-FORMSG-SP' or 'PROD2-GOVTECH-FORMSG-SP'
   *  @param {string} config.singpassEserviceId - ID registered with SingPass
   *  e.g. 'GOVTECH-FORMSG-SP'
   *  @param {(Buffer|String)} config.privateKey` - RSA-SHA256 private key, which must
   *  correspond with public key provided to MyInfo during onboarding process.
   *  @param {string} [config.clientId] - ID of MyInfo client. Defaults to `appId`
   *  if not provided.
   *  @param {string} [config.mode] - dev/stg/prod, which sets up the correct
   *  endpoint to call. Defaults to prod if not provided.
   */
  constructor (config) {
    let {
      realm,
      appId,
      clientId,
      singpassEserviceId,
      mode,
      privateKey,
    } = config

    if (!realm || !appId || !singpassEserviceId || !privateKey) {
      throw new Error(
        'Missing required parameter(s) in constructor:' +
          ' realm, appId, singpassEserviceId, privateKey'
      )
    }

    this.realm = realm
    this.appId = appId
    this.clientId = clientId || appId
    this.singpassEserviceId = singpassEserviceId
    this.mode = mode
    this.privateKey = privateKey.toString().replace(/\n$/, '')

    this.baseUrl = BASE_URL[mode] || BASE_URL.prod
  }

  /**
   *    Make a GET request to Person-Basic endpoint.
   *    @param  {Object} personRequest - A request for attributes of a person to
   *    MyInfo
   *    @param  {string} personRequest.uinFin - NRIC number
   *    @param  {Array<string>} [personRequest.requestedAttributes] - Array of
   *    attributes of person to request from MyInfo. Will query all fields if
   *    not provided, or if it is an empty list.
   *    @param  {int} [personRequest.txnNo] - Optional transaction number
   *    @return {Promise<Object>} - Promise resolving to a person object
   *    containing requested fields
   *    @example
   *    myInfo.getPersonBasic({uinFin, requestedAttributes, txnNo})
   *    .then(function(personObject) {
   *      console.log(personObject)
   *    })
   *
   *    {
   *          "name": {
   *            "lastupdated": "2015-06-01",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "TAN XIAO HUI"
   *          },
   *          "hanyupinyinname": {
   *            "lastupdated": "2015-06-01",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "CHEN XIAO HUI"
   *          },
   *          "aliasname": {
   *            "lastupdated": "2015-06-01",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "TRICIA TAN XIAO HUI"
   *          },
   *          "hanyupinyinaliasname": {
   *            "lastupdated": "2015-06-01",
   *            "source": "1",
   *            "classification": "C",
   *            "value": ""
   *          },
   *          "marriedname": {
   *            "lastupdated": "2015-06-01",
   *            "source": "1",
   *            "classification": "C",
   *            "value": ""
   *          },
   *          "sex": {
   *            "lastupdated": "2016-03-11",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "F"
   *          },
   *          "race": {
   *            "lastupdated": "2016-03-11",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "CN"
   *          },
   *          "secondaryrace": {
   *            "lastupdated": "2017-08-25",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "EU"
   *          },
   *          "dialect": {
   *            "lastupdated": "2016-03-11",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "SG"
   *          },
   *          "nationality": {
   *            "lastupdated": "2016-03-11",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "SG"
   *          },
   *          "dob": {
   *            "lastupdated": "2016-03-11",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "1958-05-17"
   *          },
   *          "birthcountry": {
   *            "lastupdated": "2016-03-11",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "SG"
   *          },
   *          "residentialstatus": {
   *            "lastupdated": "2017-08-25",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "C"
   *          },
   *          "passportnumber": {
   *            "lastupdated": "2017-08-25",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "E35463874W"
   *          },
   *          "passportexpirydate": {
   *            "lastupdated": "2017-08-25",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "2020-01-01"
   *          },
   *          "regadd": {
   *            "country": "SG",
   *            "unit": "128",
   *            "street": "BEDOK NORTH AVENUE 1",
   *            "lastupdated": "2016-03-11",
   *            "block": "548",
   *            "source": "1",
   *            "postal": "460548",
   *            "classification": "C",
   *            "floor": "09",
   *            "building": ""
   *          },
   *          "mailadd": {
   *            "country": "SG",
   *            "unit": "128",
   *            "street": "BEDOK NORTH AVENUE 1",
   *            "lastupdated": "2016-03-11",
   *            "block": "548",
   *            "source": "2",
   *            "postal": "460548",
   *            "classification": "C",
   *            "floor": "09",
   *            "building": ""
   *          },
   *          "billadd": {
   *            "country": "SG",
   *            "unit": "",
   *            "street": "",
   *            "lastupdated": "",
   *            "block": "",
   *            "source": "",
   *            "postal": "",
   *            "classification": "",
   *            "floor": "",
   *            "building": ""
   *          },
   *          "housingtype": {
   *            "lastupdated": null,
   *            "source": "1",
   *            "classification": "C",
   *            "value": ""
   *          },
   *          "hdbtype": {
   *            "lastupdated": "2015-12-23",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "111"
   *          },
   *          "email": {
   *            "lastupdated": "2017-12-13",
   *            "source": "4",
   *            "classification": "C",
   *            "value": "test@gmail.com"
   *          },
   *          "homeno": {
   *            "code": "65",
   *            "prefix": "+",
   *            "lastupdated": "2017-11-20",
   *            "source": "2",
   *            "classification": "C",
   *            "nbr": "66132665"
   *          },
   *          "mobileno": {
   *            "code": "65",
   *            "prefix": "+",
   *            "lastupdated": "2017-12-13",
   *            "source": "4",
   *            "classification": "C",
   *            "nbr": "97324992"
   *          },
   *          "marital": {
   *            "lastupdated": "2017-03-29",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "1"
   *          },
   *          "marriagecertno": {
   *            "lastupdated": "2018-03-02",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "123456789012345"
   *          },
   *          "countryofmarriage": {
   *            "lastupdated": "2018-03-02",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "SG"
   *          },
   *          "marriagedate": {
   *            "lastupdated": "",
   *            "source": "1",
   *            "classification": "C",
   *            "value": ""
   *          },
   *          "divorcedate": {
   *            "lastupdated": "",
   *            "source": "1",
   *            "classification": "C",
   *            "value": ""
   *          },
   *          "childrenbirthrecords": [
   *          {},
   *          {},
   *          {}
   *          ],
   *          "relationships": [
   *          {},
   *          {}
   *          ],
   *          "edulevel": {
   *            "lastupdated": "2017-10-11",
   *            "source": "2",
   *            "classification": "C",
   *            "value": "3"
   *          },
   *          "gradyear": {
   *            "lastupdated": "2017-10-11",
   *            "source": "2",
   *            "classification": "C",
   *            "value": "1978"
   *          },
   *          "schoolname": {
   *            "lastupdated": "2017-10-11",
   *            "source": "2",
   *            "classification": "C",
   *            "value": "T07GS3011J",
   *            "desc": "SIGLAP SECONDARY SCHOOL"
   *          },
   *          "occupation": {
   *            "lastupdated": "2017-10-11",
   *            "source": "2",
   *            "classification": "C",
   *            "value": "53201",
   *            "desc": "HEALTHCARE ASSISTANT"
   *          },
   *          "employment": {
   *            "lastupdated": "2017-10-11",
   *            "source": "2",
   *            "classification": "C",
   *            "value": "ALPHA"
   *          },
   *          "workpassstatus": {
   *            "lastupdated": "2018-03-02",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "Live"
   *          },
   *          "workpassexpirydate": {
   *            "lastupdated": "2018-03-02",
   *            "source": "1",
   *            "classification": "C",
   *            "value": "2018-12-31"
   *          },
   *          "householdincome": {
   *            "high": "5999",
   *            "low": "5000",
   *            "lastupdated": "2017-10-24",
   *            "source": "2",
   *            "classification": "C"
   *          },
   *          "vehno": {
   *            "lastupdated": "",
   *            "source": "2",
   *            "classification": "C",
   *            "value": ""
   *          }
   *        }
   */
  getPersonBasic ({ uinFin, requestedAttributes, txnNo, singpassEserviceId: seId }) {
    if (!requestedAttributes || !requestedAttributes.length > 0) {
      requestedAttributes = ALL_ATTRIBUTES.personBasic
    }

    const url = this.baseUrl + path.join(ENDPOINT.personBasic, uinFin) + '/'
    const nonce = crypto.randomBytes(32).toString('base64')
    const timestamp = Date.now()

    const singpassEserviceId = seId || this.singpassEserviceId

    // Construct the request basestring
    const basestring = this._formulateBaseString({
      httpMethod: 'GET',
      url,
      appId: this.appId,
      clientId: this.clientId,
      singpassEserviceId,
      nonce,
      requestedAttributes,
      timestamp,
      txnNo,
    })

    // Generate the request signature by signing the constructed basestring
    // with private key
    const signature = this._signBaseString(
      basestring,
      this.privateKey,
      'base64'
    )

    // Construct the authentication header using the signature, nonce and
    // timestamp
    const authHeader = this._formulateAuthHeader({
      realm: this.realm,
      appId: this.appId,
      nonce,
      signature,
      timestamp,
    })

    // Construct the request headers
    const headers = {
      'Content-Type': 'application/json',
      Authorization: authHeader,
      'Content-Encoding': 'gzip',
      Accept: 'application/json',
    }

    // Construct the querystring params
    const querystring = {
      attributes: requestedAttributes.join(),
      client_id: this.clientId,
      singpassEserviceId,
      txnNo: txnNo,
    }

    // Put the request parameters together
    const requestDetails = {
      headers: headers,
      uri: url,
      qs: querystring,
      method: 'GET',
    }

    // Send request, decrypt JWE response and return Promise<Object>
    return new Promise((resolve, reject) => {
      request(requestDetails, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          const message = error && error.message
            ? error.message : response.statusMessage
          const returnedError = new Error(message)
          returnedError.reason = error
          returnedError.statusCode = response.statusCode
          returnedError.statusMessage = response.statusMessage
          returnedError.body = body
          reject(returnedError)
        } else {
          resolve(body)
        }
      })
    })
      .then(
        body =>
          this.mode === 'dev' ? Promise.resolve(body) : this._decryptJwe(body)
      )
      .then(JSON.parse)
      .then(personObject => {
        personObject.uinFin = uinFin
        return personObject
      })
  }

  /**
   *    Decrypts a JWE response string
   *    @param  {string} jweResponse Fullstop-delimited jweResponse string
   *    @return {Promise<string>}    Promise which resolves to a JSON string
   */
  _decryptJwe (jweResponse) {
    const jweParts = jweResponse.split('.')

    // JSON Web Encryption (JWE)
    const [header, encryptedKey, iv, cipherText, tag] = jweParts

    let keystore = jose.JWK.createKeyStore()

    return keystore
      .add(this.privateKey, 'pem')
      .then(jweKey => {
        return jose.JWE.createDecrypt(jweKey).decrypt({
          type: 'compact',
          ciphertext: cipherText,
          protected: header,
          encrypted_key: encryptedKey,
          tag: tag,
          iv: iv,
          header: header,
        })
      })
      .then(result => result.payload.toString())
  }

  /**
   *  Internal function to generate the APEX signature basestring. The
   *  resultant basestring must be signed with the private key and attached
   *  to the request header when calling MyInfo.
   *  @param {Object} basestrConfig Object containing all the fields
   *  necessary for generating basestring
   *  @param {string} basestrConfig.httpMethod One of GET/POST/PUT/DELETE
   *  @param {string} basestrConfig.url Full url endpoint, such as
   *  https://myinfosgstg.api.gov.sg/gov/test/v2/person-basic/
   *  @param {string} basestrConfig.appId MyInfo App ID
   *  @param {string} basestrConfig.clientId MyInfo Client ID
   *  @param {string} basestrConfig.singpassEserviceId Client SingPass
   *  e-Service ID
   *  @param {string} basestrConfig.nonce A randomly generated base64
   *  number
   *  @param {string[]} basestrConfig.requestedAttributes List of person
   *  attributes being requested.
   *  @param {string} basestrConfig.timestamp Timestamp of request using
   *  Date.now().
   *  @param {string} [basestrConfig.txnNo] Optional transaction number.
   *
   *  @return {string} [basestring] The basestring to be signed by
   *  _signBaseString().
   */
  _formulateBaseString ({
    httpMethod,
    url,
    appId,
    clientId,
    singpassEserviceId,
    nonce,
    requestedAttributes,
    timestamp,
    txnNo,
  }) {
    return (
      httpMethod.toUpperCase() +
      // url string replacement was dictated by MyInfo docs - no explanation
      // was provided for why this is necessary
      '&' +
      url.replace('.api.gov.sg', '.e.api.gov.sg') +
      '&' +
      'apex_l2_eg_app_id=' +
      appId +
      '&' +
      'apex_l2_eg_nonce=' +
      nonce +
      '&' +
      'apex_l2_eg_signature_method=SHA256withRSA' +
      '&' +
      'apex_l2_eg_timestamp=' +
      timestamp +
      '&' +
      'apex_l2_eg_version=1.0' +
      '&' +
      'attributes=' +
      requestedAttributes.join() +
      '&' +
      'client_id=' +
      clientId +
      '&' +
      'singpassEserviceId=' +
      singpassEserviceId +
      (txnNo ? '&' + 'txnNo=' + txnNo : '')
    )
  }

  /**
   *    Returns signature of basestring signed with private key
   *    @param  {string} basestring - Basestring
   *    @param  {string} privateKey - Private key
   *    @param  {string} outputFormat - One of latin1/hex/base64, passed to
   *    crypto.sign.sign()
   *    @return {string|Buffer} - Signature of basestring signed with privateKey.
   */
  _signBaseString (basestring, privateKey, outputFormat) {
    const signer = crypto.createSign('RSA-SHA256')
    signer.update(basestring)
    signer.end()
    return signer.sign(privateKey, outputFormat)
  }

  /**
   *    Create the APEX authentication header from constituent parts.
   *    @param  {[string]} realm     Realm
   *    @param  {[string]} appId     Client appId
   *    @param  {[string]} nonce     A randomly generated base64 number
   *    @param  {[string]} signature Signature generated with _signBaseString
   *    @param  {[string]} timestamp Current timestamp generated with Date.now()
   *    @return {[string]}           Authentication header to be included in API
   *    call
   */
  _formulateAuthHeader ({ realm, appId, nonce, signature, timestamp }) {
    return (
      'Apex_l2_Eg ' +
      'realm="' +
      realm +
      '",' +
      'apex_l2_eg_app_id="' +
      appId +
      '",' +
      'apex_l2_eg_nonce="' +
      nonce +
      '",' +
      'apex_l2_eg_signature_method="SHA256withRSA",' +
      'apex_l2_eg_signature="' +
      signature +
      '",' +
      'apex_l2_eg_timestamp="' +
      timestamp +
      '",' +
      'apex_l2_eg_version="1.0"'
    )
  }
}

module.exports = MyInfoGovClient
