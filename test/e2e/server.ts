import Express from 'express'
import { MyInfoGovClient, MyInfoMode } from '../../src/MyInfoGovClientV3.class'
import {
  MOCK_CLIENT_ID,
  MOCK_CLIENT_SECRET,
  MOCK_ESRVC_ID,
  MOCK_PURPOSE,
  MOCK_REDIRECT_PATH,
  MOCK_RELAY_STATE,
  MOCK_REQUESTED_ATTRIBUTES,
  MOCK_TARGET_URL,
  TEST_SERVER_PORT,
} from '../constants'

const app = Express()

const client = new MyInfoGovClient({
  clientId: MOCK_CLIENT_ID,
  clientSecret: MOCK_CLIENT_SECRET,
  mode: MyInfoMode.Dev,
  singpassEserviceId: MOCK_ESRVC_ID,
})

app
  .get('/', (_req, res) => {
    const redirectUrl = client.createRedirectURL({
      purpose: MOCK_PURPOSE,
      relayState: MOCK_RELAY_STATE,
      requestedAttributes: MOCK_REQUESTED_ATTRIBUTES,
      targetUrl: `http://localhost:${TEST_SERVER_PORT}${MOCK_REDIRECT_PATH}`,
    })
    return res.send(`
      <a class="login" href=${redirectUrl}>Log in</a>
    `)
  })
  .get(MOCK_REDIRECT_PATH, (req, res) => {
    return res.send(`
      <div class="content">OK</div>
    `)
  })

app.listen(TEST_SERVER_PORT, () =>
  console.log(`Test server listening on port ${TEST_SERVER_PORT}`),
)
