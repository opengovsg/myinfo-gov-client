/// <reference types="node" />
import { IPerson, MyInfoScope } from './myinfo-types';
/**
 * Mode in which to initialise the client, which determines the
 * MyInfo endpoint to call.
 */
export declare enum MyInfoMode {
    Dev = "dev",
    Staging = "stg",
    Production = "prod"
}
/**
 * Parameters for MyInfoGovClient constructor.
 */
export interface IMyInfoConfig {
    clientId: string;
    clientSecret: string | Buffer;
    singpassEserviceId: string;
    redirectEndpoint: string;
    clientPrivateKey: string | Buffer;
    myInfoPublicKey: string | Buffer;
    mode?: MyInfoMode;
}
/**
 * Parameters to create a redirect URL to initialise MyInfo login.
 */
export interface IAuthRequest {
    purpose: string;
    requestedAttributes: MyInfoScope[];
    relayState: string;
    singpassEserviceId?: string;
    redirectEndpoint?: string;
}
/**
 * Response shape of getPerson.
 */
export interface IPersonResponse {
    uinFin: string;
    data: IPerson;
}
/**
 * Convenience wrapper around the MyInfo API for Government
 * digital services.
 */
export declare class MyInfoGovClient {
    clientId: string;
    clientSecret: string;
    redirectEndpoint: string;
    clientPrivateKey: string;
    myInfoPublicKey: string;
    singpassEserviceId: string;
    mode: MyInfoMode;
    baseAPIUrl: string;
    /**
     * Class constructor. Each instance of MyInfoGovClient uses one set
     * of credentials registered with MyInfo.
     * @param config Configuration object
     * @param config.clientId Client ID (also known as App ID)
     * @param config.clientSecret Client secret provided by MyInfo
     * @param config.singpassEserviceId The default e-service ID registered
     * with SingPass to use. Can be overridden if necessary in
     * `createRedirectURL` and `getPerson` functions.
     * @param config.redirectEndpoint Endpoint to which user should be redirected
     *  after login
     * @param config.clientPrivateKey RSA-SHA256 private key,
     * which must correspond with public key provided to MyInfo during the
     * onboarding process
     * @param config.myInfoPublicKey MyInfo server's public key for verifying
     * their signature
     * @param config.mode Optional mode, which determines the MyInfo endpoint
     * to call. Defaults to production mode.
     * @throws {MissingParamsError} Throws if any required parameter is missing
     *
     */
    constructor(config: IMyInfoConfig);
    /**
     * Constructs a redirect URL which the user can visit to initialise
     * SingPass login and consent to providing the given MyInfo attributes.
     * @param config Configuration object
     * @param config.purpose Purpose of requesting the data, which will be
     * shown to user
     * @param config.requestedAttributes MyInfo attributes which the user must
     * consent to provide
     * @param config.relayState State to be forwarded to the redirect endpoint
     * via query parameters
     * @param config.singpassEserviceId Optional alternative e-service ID.
     * Defaults to the e-serviceId provided in the constructor.
     * @param config.redirectEndpoint Optional alternative redirect endpoint.
     * Defaults to the endpoint provided in the constructor.
     * @returns The URL which the user should visit to log in to SingPass
     * and consent to providing the given attributes.
     */
    createRedirectURL({ purpose, requestedAttributes, relayState, singpassEserviceId, redirectEndpoint, }: IAuthRequest): string;
    /**
     * Retrieves the given MyInfo attributes from the Person endpoint after
     * the client has logged in to SingPass and consented to providing the given
     * attributes.
     * @param accessToken Access token given by MyInfo
     * @param requestedAttributes Attributes to request from Myinfo. Should correspond
     * to the attributes provided when initiating SingPass login.
     * @param singpassEserviceId Optional alternative e-service ID.
     * Defaults to the e-serviceId provided in the constructor.
     * @returns Object containing the user's NRIC/FIN and the data
     * @throws {InvalidTokenSignatureError} Throws if the JWT signature is invalid
     * @throws {WrongAccessTokenShapeError} Throws if decoded JWT has an unexpected
     * type or shape
     * @throws {MyInfoResponseError} Throws if MyInfo returns a non-200 response
     * @throws {DecryptDataError} Throws if an error occurs while decrypting data
     * @throws {InvalidDataSignatureError} Throws if signature on data is invalid
     * @throws {WrongDataShapeError} Throws if decrypted data from MyInfo is
     * of the wrong type
     */
    getPerson(accessToken: string, requestedAttributes: MyInfoScope[], singpassEserviceId?: string): Promise<IPersonResponse>;
    /**
     * Extracts the UIN or FIN from the access token.
     * @param accessToken JSON web token, which is the access token provided
     * by the Token endpoint
     * @returns The UIN or FIN decoded from the JWT
     * @throws {InvalidTokenSignatureError} Throws if the JWT signature is invalid
     * @throws {WrongAccessTokenShapeError} Throws if decoded JWT has an unexpected
     * type or shape
     */
    extractUinFin(accessToken: string): string;
    /**
     * Retrieves the access token from the Token endpoint.
     * @param authCode Authorisation code provided to the redirect endpoint
     * @returns The access token as a JWT
     * @throws {MyInfoResponseError} Throws if MyInfo returns a non-200 response
     * @throws {MissingAccessTokenError} Throws if MyInfo response does not
     * contain the access token
     */
    getAccessToken(authCode: string): Promise<string>;
    /**
     * Generates the content of the 'Authorization' header to be sent
     * with a request to MyInfo.
     * @param method HTTP method to be used for the request
     * @param url Endpoint to which the request is being sent
     * @param urlParams Query parameters being sent with the request
     * @returns The content which should be provided as the Authorization
     * header
     */
    _generateAuthHeader(method: 'POST' | 'GET', url: string, urlParams: Record<string, string>): string;
    /**
     * Decrypts a JWE response string.
     * @param jwe Fullstop-delimited JWE
     * @returns The decrypted data, with signature already verified
     * @throws {DecryptDataError} Throws if an error occurs while decrypting data
     * @throws {InvalidDataSignatureError} Throws if signature on data is invalid
     * @throws {WrongDataShapeError} Throws if decrypted data from MyInfo is
     * of the wrong type
     */
    _decryptJWE(jwe: string): Promise<IPerson>;
}
