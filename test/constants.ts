import * as fs from 'fs'
import {
  AddressType,
  IPerson,
  MyInfoAttribute,
  MyInfoScope,
  MyInfoSource,
} from '../src/myinfo-types'

export const MOCK_BASE_URL = 'https://myinfo.gov.client'
export const MOCK_REDIRECT_PATH = '/target'
export const MOCK_TARGET_URL = `${MOCK_BASE_URL}${MOCK_REDIRECT_PATH}`
export const MOCK_CLIENT_ID = 'mockClientId'
export const MOCK_CLIENT_SECRET = 'mockClientSecret'
export const MOCK_ESRVC_ID = 'mockEsrvcId'
export const MOCK_PURPOSE = 'purpose'
export const MOCK_RELAY_STATE = 'relayState1,relayState2'
export const MOCK_REQUESTED_ATTRIBUTES = [
  'name' as const,
  'sex' as const,
  'mobileno' as const,
  'occupation' as const,
  'marital' as const,
]
export const MOCK_AUTH_CODE = 'mockAuthCode'
export const MOCK_ACCESS_TOKEN = 'mockAccessToken'
export const MOCK_UIN_FIN = 'mockUinFin'
export const MOCK_JWT = 'mockJwt'
export const TEST_SERVER_PORT = 5000
export const TEST_PRIVATE_KEY = fs.readFileSync(
  './node_modules/@opengovsg/mockpass/static/certs/key.pem',
)
export const TEST_PUBLIC_KEY = fs.readFileSync(
  './node_modules/@opengovsg/mockpass/static/certs/spcp.crt',
)

const hdbOwnershipScopes = [
  'noofowners',
  'address',
  'hdbtype',
  'leasecommencementdate',
  'termoflease',
  'dateofpurchase',
  'dateofownershiptransfer',
  'loangranted',
  'originalloanrepayment',
  'balanceloanrepayment',
  'outstandingloanbalance',
  'monthlyloaninstalment',
]

const childScopes = [
  'birthcertno',
  'name',
  'hanyupinyinname',
  'aliasname',
  'hanyupinyinaliasname',
  'marriedname',
  'sex',
  'race',
  'secondaryrace',
  'dialect',
  'lifestatus',
  'dob',
  'tob',
]

const sponsoredChildScopes = [
  'nric',
  'name',
  'hanyupinyinname',
  'aliasname',
  'hanyupinyinaliasname',
  'marriedname',
  'sex',
  'race',
  'secondaryrace',
  'dialect',
  'dob',
  'birthcountry',
  'lifestatus',
  'residentialstatus',
  'nationality',
  'scprgrantdate',
]

const vehicleScopes = [
  'vehicleno',
  'type',
  'iulabelno',
  'make',
  'model',
  'chassisno',
  'engineno',
  'motorno',
  'yearofmanufacture',
  'firstregistrationdate',
  'originalregistrationdate',
  'coecategory',
  'coeexpirydate',
  'roadtaxexpirydate',
  'quotapremium',
  'openmarketvalue',
  'co2emission',
  'status',
  'primarycolour',
  'secondarycolour',
  'attachment1',
  'attachment2',
  'attachment3',
  'scheme',
  'thcemission',
  'coemission',
  'noxemission',
  'pmemission',
  'enginecapacity',
  'powerrate',
  'effectiveownership',
  'propellant',
  'maximumunladenweight',
  'maximumladenweight',
  'minimumparfbenefit',
  'nooftransfers',
  'vpc',
]

const drivingLicenceScopes = [
  ['comstatus'],
  ['totaldemeritpoints'],
  ['suspension', 'startdate'],
  ['suspension', 'enddate'],
  ['disqualification', 'startdate'],
  ['disqualification', 'enddate'],
  ['revocation', 'startdate'],
  ['revocation', 'enddate'],
  ['pdl', 'validity'],
  ['pdl', 'expirydate'],
  ['pdl', 'classes'],
  ['qdl', 'validity'],
  ['qdl', 'expirydate'],
  ['qdl', 'classes'],
]

export const NON_NESTED_RELAY_STATE = 'nonnested'
export const NESTED_RELAY_STATE = 'nested'
export const NON_NESTED_SCOPES = [
  ...Object.values(MyInfoAttribute).filter(
    (v) =>
      ![
        'hdbownership',
        'childrenbirthrecords',
        'sponsoredchildrenrecords',
        'vehicles',
        'drivinglicence',
      ].includes(v),
  ),
] as MyInfoScope[]

export const NESTED_SCOPES = [
  ...hdbOwnershipScopes.map((scope) => `hdbownership.${scope}`),
  ...childScopes.map((scope) => `childrenbirthrecords.${scope}`),
  ...sponsoredChildScopes.map((scope) => `sponsoredchildrenrecords.${scope}`),
  ...vehicleScopes.map((scope) => `vehicles.${scope}`),
  ...drivingLicenceScopes.map((scope) => `drivinglicence.${scope.join('.')}`),
] as MyInfoScope[]

// Note that the MockPass data doesn't exactly conform to the IPerson
// interface followed by MyInfo, hence we do not assign the IPerson
// interface to the expected data. In particular, the MockPass data
// returns empty strings for attributes which are meant to be numbers or booleans.
export const EXPECTED_NON_NESTED_DATA = {
  uinfin: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: 'S9812390C',
  },
  name: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: 'GALVIN NG JIA SHENG',
  },
  hanyupinyinname: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: 'NG JIA SHENG',
  },
  aliasname: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: 'TIMOTHY GALVIN NG JIA SHENG',
  },
  hanyupinyinaliasname: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: '',
  },
  marriedname: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: '',
  },
  sex: {
    lastupdated: '2020-04-16',
    code: 'M',
    source: '1',
    classification: 'C',
    desc: 'MALE',
  },
  race: {
    lastupdated: '2020-04-16',
    code: 'CN',
    source: '1',
    classification: 'C',
    desc: 'CHINESE',
  },
  secondaryrace: {
    lastupdated: '2020-04-16',
    code: '',
    source: '1',
    classification: 'C',
    desc: '',
  },
  dialect: {
    lastupdated: '2020-04-16',
    code: '',
    source: '1',
    classification: 'C',
    desc: '',
  },
  nationality: {
    lastupdated: '2020-04-16',
    code: 'SG',
    source: '1',
    classification: 'C',
    desc: 'SINGAPORE CITIZEN',
  },
  dob: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: '1992-05-25',
  },
  birthcountry: {
    lastupdated: '2020-04-16',
    code: 'SG',
    source: '1',
    classification: 'C',
    desc: 'SINGAPORE',
  },
  residentialstatus: {
    lastupdated: '2020-04-16',
    code: 'C',
    source: '1',
    classification: 'C',
    desc: 'Citizen',
  },
  passportnumber: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: 'E43335677F',
  },
  passportexpirydate: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: '2025-06-04',
  },
  regadd: {
    country: { code: 'SG', desc: 'SINGAPORE' },
    unit: { value: '192' },
    street: { value: 'TELOK BLANGAH STREET 31' },
    lastupdated: '2020-04-16',
    block: { value: '92A' },
    source: '1',
    postal: { value: '101092' },
    classification: 'C',
    floor: { value: '20' },
    type: 'SG',
    building: { value: 'TELOK BLANGAH PARCVIEW' },
  },
  housingtype: {
    lastupdated: '2020-04-16',
    code: '',
    source: '1',
    classification: 'C',
    desc: '',
  },
  hdbtype: {
    lastupdated: '2020-04-16',
    code: '',
    source: '1',
    classification: 'C',
    desc: '',
  },
  ownerprivate: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: true,
  },
  email: {
    lastupdated: '2020-04-16',
    source: '2',
    classification: 'C',
    value: 'galvintesting@yahoo.com',
  },
  mobileno: {
    lastupdated: '2020-04-16',
    source: '2',
    classification: 'C',
    areacode: { value: '65' },
    prefix: { value: '+' },
    nbr: { value: '97399245' },
  },
  marital: {
    lastupdated: '2020-04-16',
    code: '3',
    source: '1',
    classification: 'C',
    desc: 'WIDOWED',
  },
  marriagecertno: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: '901889',
  },
  countryofmarriage: {
    lastupdated: '2020-04-16',
    code: 'SG',
    source: '1',
    classification: 'C',
    desc: 'SINGAPORE',
  },
  marriagedate: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: '2012-02-15',
  },
  divorcedate: {
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
    value: '',
  },
  occupation: {
    lastupdated: '2020-04-16',
    source: '2',
    classification: 'C',
    value: 'TRAINING MANAGER',
  },
  employment: {
    lastupdated: '2020-04-16',
    source: '2',
    classification: 'C',
    value: 'BALIK KAMPUNG PTE LTD',
  },
  passtype: {
    lastupdated: '2020-04-16',
    code: '',
    source: '3',
    classification: 'C',
    desc: '',
  },
  passstatus: {
    lastupdated: '2020-04-16',
    source: '3',
    classification: 'C',
    value: '',
  },
  passexpirydate: {
    lastupdated: '2020-04-16',
    source: '3',
    classification: 'C',
    value: '',
  },
  employmentsector: {
    lastupdated: '2020-04-16',
    source: '3',
    classification: 'C',
    value: '',
  },
  householdincome: {
    lastupdated: '2020-04-16',
    high: { value: 3999 },
    source: '2',
    classification: 'C',
    low: { value: 3000 },
  },
  merdekagen: {
    lastupdated: '2020-04-16',
    eligibility: { value: '' },
    quantum: { value: '' },
    source: '1',
    classification: 'C',
    message: { code: '', desc: '' },
  },
  silversupport: {
    lastupdated: '2020-04-16',
    eligibility: { value: '' },
    amount: { value: '' },
    source: '1',
    classification: 'C',
    year: { value: '' },
  },
  gstvoucher: {
    gstregular: { value: 0 },
    year: { value: '' },
    lastupdated: '2020-04-16',
    exclusion: { value: '' },
    gstmedisave: { value: 0 },
    gstspecial: { value: 0 },
    source: '1',
    classification: 'C',
    signup: { value: '' },
  },
  'noa-basic': {
    yearofassessment: { value: '2019' },
    lastupdated: '2020-04-16',
    amount: { value: 54000 },
    source: '1',
    classification: 'C',
  },
  noa: {
    amount: { value: 54000 },
    trade: { value: 0 },
    interest: { value: 0 },
    yearofassessment: { value: '2019' },
    taxclearance: { value: 'N' },
    lastupdated: '2020-04-16',
    source: '1',
    employment: { value: 54000 },
    classification: 'C',
    rent: { value: 0 },
    category: { value: 'ORIGINAL' },
  },
  'noahistory-basic': {
    noas: [
      { yearofassessment: { value: '2019' }, amount: { value: 54000 } },
      { yearofassessment: { value: '2018' }, amount: { value: 49200 } },
    ],
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
  },
  noahistory: {
    noas: [
      {
        amount: { value: 54000 },
        trade: { value: 0 },
        interest: { value: 0 },
        yearofassessment: { value: '2019' },
        taxclearance: { value: 'N' },
        employment: { value: 54000 },
        rent: { value: 0 },
        category: { value: 'ORIGINAL' },
      },
      {
        amount: { value: 49200 },
        trade: { value: 0 },
        interest: { value: 0 },
        yearofassessment: { value: '2018' },
        taxclearance: { value: 'N' },
        employment: { value: 49200 },
        rent: { value: 0 },
        category: { value: 'ORIGINAL' },
      },
    ],
    lastupdated: '2020-04-16',
    source: '1',
    classification: 'C',
  },
  cpfcontributions: {
    lastupdated: '2020-04-16',
    source: '1',
    history: [
      {
        date: { value: '2019-04-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 2475 },
        month: { value: '2019-04' },
      },
      {
        date: { value: '2019-05-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1237.5 },
        month: { value: '2019-05' },
      },
      {
        date: { value: '2019-06-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1237.5 },
        month: { value: '2019-06' },
      },
      {
        date: { value: '2019-07-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1237.5 },
        month: { value: '2019-07' },
      },
      {
        date: { value: '2019-08-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 3712.5 },
        month: { value: '2019-08' },
      },
      {
        date: { value: '2019-09-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1425 },
        month: { value: '2019-09' },
      },
      {
        date: { value: '2019-10-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1425 },
        month: { value: '2019-10' },
      },
      {
        date: { value: '2019-11-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1425 },
        month: { value: '2019-11' },
      },
      {
        date: { value: '2019-12-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1425 },
        month: { value: '2019-12' },
      },
      {
        date: { value: '2020-01-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1425 },
        month: { value: '2020-01' },
      },
      {
        date: { value: '2020-02-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1425 },
        month: { value: '2020-02' },
      },
      {
        date: { value: '2020-03-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 1425 },
        month: { value: '2020-03' },
      },
      {
        date: { value: '2020-04-15' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
        amount: { value: 2850 },
        month: { value: '2020-04' },
      },
    ],
    classification: 'C',
  },
  cpfemployers: {
    lastupdated: '2020-04-16',
    source: '1',
    history: [
      {
        month: { value: '2019-04' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2019-05' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2019-06' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2019-07' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2019-08' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2019-09' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2019-10' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2019-11' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2019-12' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2020-01' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2020-02' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2020-03' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
      {
        month: { value: '2020-04' },
        employer: { value: 'BALIK KAMPUNG PTE LTD' },
      },
    ],
    classification: 'C',
  },
  cpfbalances: {
    lastupdated: '2020-04-16',
    oa: { value: 49602.38 },
    source: '1',
    classification: 'C',
    ma: { value: 17253 },
    sa: { value: 12939.75 },
  },
}

export const EXPECTED_NESTED_DATA = {
  drivinglicence: {
    comstatus: { code: 'Y', desc: 'Eligible' },
    totaldemeritpoints: { value: 0 },
    suspension: { startdate: { value: '' }, enddate: { value: '' } },
    disqualification: { startdate: { value: '' }, enddate: { value: '' } },
    revocation: { startdate: { value: '' }, enddate: { value: '' } },
    pdl: {
      validity: { code: '', desc: '' },
      expirydate: { value: '' },
      classes: [],
    },
    qdl: {
      validity: { code: 'V', desc: 'VALID' },
      expirydate: { value: '' },
      classes: [{ class: { value: '3' }, issuedate: { value: '2010-07-07' } }],
    },
  },
}
