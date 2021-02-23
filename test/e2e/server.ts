import Express, { RequestHandler } from 'express'
import { MyInfoGovClient, MyInfoMode } from '../../src/MyInfoGovClient.class'
import {
  MOCK_CLIENT_ID,
  MOCK_CLIENT_SECRET,
  MOCK_ESRVC_ID,
  MOCK_PURPOSE,
  MOCK_REDIRECT_PATH,
  NESTED_SCOPES,
  NESTED_RELAY_STATE,
  NON_NESTED_RELAY_STATE,
  NON_NESTED_SCOPES,
  TEST_PRIVATE_KEY,
  TEST_PUBLIC_KEY,
  TEST_SERVER_PORT,
} from '../constants'

/**
 * This is a toy app which has two login links, one for
 * non-nested scopes (e.g. 'name') and one for nested scopes
 * (e.g. 'vehicles.vehicleno'). The scopes were separated into
 * two sets to prevent 431 errors (request header fields too large).
 */

const app = Express()

const client = new MyInfoGovClient({
  clientId: MOCK_CLIENT_ID,
  clientSecret: MOCK_CLIENT_SECRET,
  singpassEserviceId: MOCK_ESRVC_ID,
  clientPrivateKey: TEST_PRIVATE_KEY,
  redirectEndpoint: `http://localhost:${TEST_SERVER_PORT}${MOCK_REDIRECT_PATH}`,
  myInfoPublicKey: TEST_PUBLIC_KEY,
  mode: MyInfoMode.Dev,
})
client.baseAPIUrl = 'http://localhost:5156/myinfo/v3'

const handleGetHome: RequestHandler = (_req, res) => {
  const nonNestedRedirectUrl = client.createRedirectURL({
    purpose: MOCK_PURPOSE,
    relayState: NON_NESTED_RELAY_STATE,
    requestedAttributes: NON_NESTED_SCOPES,
  })
  const nestedRedirectUrl = client.createRedirectURL({
    purpose: MOCK_PURPOSE,
    relayState: NESTED_RELAY_STATE,
    requestedAttributes: NESTED_SCOPES,
  })
  return res.send(`
    <a class="${NON_NESTED_RELAY_STATE}" href=${nonNestedRedirectUrl}>Log in 1</a>
    <a class="${NESTED_RELAY_STATE}" href=${nestedRedirectUrl}>Log in 2</a>
  `)
}

const handleReceiveRedirect: RequestHandler<
  unknown,
  unknown,
  unknown,
  { code: string state: string }
> = async (req, res) => {
  const { code, state } = req.query
  const scopes =
    state === NESTED_RELAY_STATE ? NESTED_SCOPES : NON_NESTED_SCOPES
  const accessToken = await client.getAccessToken(code)
  const result = await client.getPerson(accessToken, scopes)
  return res.send(`
    <div class="content">
      ${JSON.stringify(result)}
    </div>
  `)
}

app.get('/', handleGetHome).get(MOCK_REDIRECT_PATH, handleReceiveRedirect)

app.listen(TEST_SERVER_PORT)
