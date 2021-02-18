import { Selector } from 'testcafe'
import {
  EXPECTED_NESTED_DATA,
  EXPECTED_NON_NESTED_DATA,
  NESTED_RELAY_STATE,
  NON_NESTED_RELAY_STATE,
  TEST_SERVER_PORT,
} from '../constants'

fixture`MyInfoGovClient`.page`http://localhost:${TEST_SERVER_PORT}`

const nestedLoginLink = Selector(`.${NESTED_RELAY_STATE}`)
const nonNestedLoginLink = Selector(`.${NON_NESTED_RELAY_STATE}`)
const consentButton = Selector('input[type=submit]')
const contentContainer = Selector('.content')

test('fetches MyInfo data correctly for non-nested scopes', async (t) => {
  await t.click(nonNestedLoginLink).click(consentButton)
  const result = JSON.parse(await contentContainer.textContent)
  await t
    .expect(result.uinFin)
    .eql(process.env.MOCKPASS_NRIC)
    .expect(result.data)
    .eql(EXPECTED_NON_NESTED_DATA)
})

test('fetches MyInfo data correctly for nested scopes', async (t) => {
  await t.click(nestedLoginLink).click(consentButton)
  const result = JSON.parse(await contentContainer.textContent)
  await t
    .expect(result.uinFin)
    .eql(process.env.MOCKPASS_NRIC)
    .expect(result.data)
    .eql(EXPECTED_NESTED_DATA)
})
