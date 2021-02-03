import { Selector } from 'testcafe'
import { TEST_SERVER_PORT } from '../constants'

fixture`MyInfoGovClient`.page`http://localhost:${TEST_SERVER_PORT}`

const loginLink = Selector('.login')
const consentButton = Selector('input[type=submit]')
const contentContainer = Selector('.content')

test('fetches MyInfo data correctly', async (t) => {
  await t.click(loginLink).click(consentButton)
  await t.expect(contentContainer.textContent).eql('OK')
})
