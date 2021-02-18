declare class MyInfoGovClientError extends Error {
    /**
     * Constructor for custom error.
     * @param message Error message
     * @param err Optional error caught in a try-catch block
     */
    constructor(message: string, err?: unknown);
}
/**
 * Missing parameters in MyInfoGovClient constructor.
 */
export declare class MissingParamsError extends MyInfoGovClientError {
    constructor(message?: string);
}
/**
 * JWT signature could not be verified
 */
export declare class InvalidTokenSignatureError extends MyInfoGovClientError {
    constructor(verifyError: unknown, message?: string);
}
/**
 * JWT had wrong shape
 */
export declare class WrongAccessTokenShapeError extends MyInfoGovClientError {
    constructor(message?: string);
}
/**
 * Response from Token endpoint did not contain access token
 */
export declare class MissingAccessTokenError extends MyInfoGovClientError {
    constructor(message?: string);
}
/**
 * MyInfo returned non-200 response
 */
export declare class MyInfoResponseError extends MyInfoGovClientError {
    constructor(error: unknown, message?: string);
}
/**
 * Error while decrypting Person data from MyInfo
 */
export declare class DecryptDataError extends MyInfoGovClientError {
    constructor(error: unknown, message?: string);
}
/**
 * Invalid signature on data from Person API
 */
export declare class InvalidDataSignatureError extends MyInfoGovClientError {
    constructor(error: unknown, message?: string);
}
/**
 * Person data from MyInfo had unexpected shape
 */
export declare class WrongDataShapeError extends MyInfoGovClientError {
    constructor(message?: string);
}
export {};
