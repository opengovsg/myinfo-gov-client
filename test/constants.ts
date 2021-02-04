import fs from 'fs'

export const MOCK_BASE_URL = 'https://myinfo.gov.client'
export const MOCK_REDIRECT_PATH = '/target'
export const MOCK_TARGET_URL = `${MOCK_BASE_URL}${MOCK_REDIRECT_PATH}`
export const MOCK_CLIENT_ID = 'mockClientId'
export const MOCK_CLIENT_SECRET = 'mockClientSecret'
export const MOCK_ESRVC_ID = 'mockEsrvcId'
export const MOCK_PURPOSE = 'purpose'
export const MOCK_RELAY_STATE = 'relayState1,relayState2'
export const MOCK_REQUESTED_ATTRIBUTES = [
  'name',
  'sex',
  'mobileno',
  'occupation',
  'marital',
]
export const TEST_SERVER_PORT = 5000
export const TEST_PRIVATE_KEY = fs.readFileSync(
  './node_modules/@opengovsg/mockpass/static/certs/key.pem',
)
