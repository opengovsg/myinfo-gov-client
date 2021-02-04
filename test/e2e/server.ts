import Express, { RequestHandler } from 'express'
import { MyInfoGovClient, MyInfoMode } from '../../src/MyInfoGovClientV3.class'
import {
  MOCK_CLIENT_ID,
  MOCK_CLIENT_SECRET,
  MOCK_ESRVC_ID,
  MOCK_PURPOSE,
  MOCK_REDIRECT_PATH,
  MOCK_RELAY_STATE,
  MOCK_REQUESTED_ATTRIBUTES,
  TEST_PRIVATE_KEY,
  TEST_PUBLIC_KEY,
  TEST_SERVER_PORT,
} from '../constants'

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

const handleGetHome: RequestHandler = (_req, res) => {
  const redirectUrl = client.createRedirectURL({
    purpose: MOCK_PURPOSE,
    relayState: MOCK_RELAY_STATE,
    requestedAttributes: MOCK_REQUESTED_ATTRIBUTES,
  })
  return res.send(`
    <a class="login" href=${redirectUrl}>Log in</a>
  `)
}

const handleReceiveRedirect: RequestHandler<
  unknown,
  unknown,
  unknown,
  { code: string; state: string }
> = async (req, res) => {
  const { code, state } = req.query
  const { accessToken, data } = await client.getPerson(
    code,
    MOCK_REQUESTED_ATTRIBUTES,
  )
  return res.send(`
    <div class="content">
      ${JSON.stringify(data)}
    </div>
  `)
}

app.get('/', handleGetHome).get(MOCK_REDIRECT_PATH, handleReceiveRedirect)

app.listen(TEST_SERVER_PORT, () =>
  console.log(`Test server listening on port ${TEST_SERVER_PORT}`),
)
