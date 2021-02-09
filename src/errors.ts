class MyInfoGovClientError extends Error {
  /**
   * Constructor for custom error.
   * @param message Error message
   * @param err Optional error caught in a try-catch block
   */
  constructor(message: string, err?: unknown) {
    super(message)
    if (err instanceof Error) {
      this.message = `${message}: ${err.message}`
    } else if (err) {
      this.message = `${message}: ${JSON.stringify(err)}`
    }
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
  }
}

/**
 * Missing parameters in MyInfoGovClient constructor.
 */
export class MissingParamsError extends MyInfoGovClientError {
  constructor(
    message = `Missing required parameter(s) in constructor: clientId, clientSecret, singpassEserviceId, redirectEndpoint, clientPrivateKey, myInfoPublicKey`,
  ) {
    super(message)
  }
}

/**
 * JWT signature could not be verified
 */
export class InvalidJWTError extends MyInfoGovClientError {
  constructor(
    verifyError: unknown,
    message = 'Signature on JWT from MyInfo could not be verified',
  ) {
    super(message, verifyError)
  }
}

/**
 * JWT had wrong shape
 */
export class WrongJWTShapeError extends MyInfoGovClientError {
  constructor(
    message = 'Decoded JWT from MyInfo had unexpected shape, so NRIC could not be extracted',
  ) {
    super(message)
  }
}

/**
 * Response from Token endpoint did not contain access token
 */
export class MissingAccessTokenError extends MyInfoGovClientError {
  constructor(message = 'MyInfo response did not contain valid access token') {
    super(message)
  }
}

/**
 * MyInfo returned non-200 response
 */
export class MyInfoResponseError extends MyInfoGovClientError {
  constructor(error: unknown, message = 'Error while connecting to MyInfo') {
    super(message, error)
  }
}
