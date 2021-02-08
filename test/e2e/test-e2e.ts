import { Selector } from 'testcafe'
import {
  EXPECTED_PERSON_DATA,
  MOCK_RELAY_STATE,
  TEST_SERVER_PORT,
} from '../constants'

fixture`MyInfoGovClient`.page`http://localhost:${TEST_SERVER_PORT}`

const loginLink = Selector('.login')
const consentButton = Selector('input[type=submit]')
const contentContainer = Selector('.content')

test('fetches MyInfo data correctly', async (t) => {
  await t.click(loginLink).click(consentButton)
  const result = JSON.parse(await contentContainer.textContent)
  await t
    .expect(result.state)
    .eql(MOCK_RELAY_STATE)
    .expect(result.uinFin)
    .eql(process.env.MOCKPASS_NRIC)
    .expect(result.data)
    .eql(EXPECTED_PERSON_DATA)
})
