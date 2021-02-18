"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyInfoGovClient = exports.MyInfoMode = void 0;
var qs_1 = __importDefault(require("qs"));
var crypto_1 = __importDefault(require("crypto"));
var axios_1 = __importDefault(require("axios"));
var node_jose_1 = __importDefault(require("node-jose"));
var jsonwebtoken_1 = require("jsonwebtoken");
var util_1 = require("./util");
var errors_1 = require("./errors");
/**
 * Mode in which to initialise the client, which determines the
 * MyInfo endpoint to call.
 */
var MyInfoMode;
(function (MyInfoMode) {
    MyInfoMode["Dev"] = "dev";
    MyInfoMode["Staging"] = "stg";
    MyInfoMode["Production"] = "prod";
})(MyInfoMode = exports.MyInfoMode || (exports.MyInfoMode = {}));
var BASE_URL = (_a = {},
    _a[MyInfoMode.Dev] = 'https://sandbox.api.myinfo.gov.sg/gov/v3',
    _a[MyInfoMode.Staging] = 'https://test.api.myinfo.gov.sg/gov/v3',
    _a[MyInfoMode.Production] = 'https://api.myinfo.gov.sg/gov/v3',
    _a);
var Endpoint;
(function (Endpoint) {
    Endpoint["Authorise"] = "/authorise";
    Endpoint["Token"] = "/token";
    Endpoint["Person"] = "/person";
})(Endpoint || (Endpoint = {}));
/**
 * Convenience wrapper around the MyInfo API for Government
 * digital services.
 */
var MyInfoGovClient = /** @class */ (function () {
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
    function MyInfoGovClient(config) {
        var clientId = config.clientId, clientSecret = config.clientSecret, mode = config.mode, singpassEserviceId = config.singpassEserviceId, redirectEndpoint = config.redirectEndpoint, clientPrivateKey = config.clientPrivateKey, myInfoPublicKey = config.myInfoPublicKey;
        if (!clientId ||
            !clientSecret ||
            !singpassEserviceId ||
            !redirectEndpoint ||
            !clientPrivateKey ||
            !myInfoPublicKey) {
            throw new errors_1.MissingParamsError();
        }
        this.clientId = clientId;
        this.clientSecret = clientSecret.toString();
        this.redirectEndpoint = redirectEndpoint;
        this.mode = mode || MyInfoMode.Production;
        this.singpassEserviceId = singpassEserviceId;
        this.clientPrivateKey = clientPrivateKey.toString().replace(/\n$/, '');
        this.myInfoPublicKey = myInfoPublicKey.toString().replace(/\n$/, '');
        this.baseAPIUrl = BASE_URL[this.mode] || BASE_URL.prod;
    }
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
    MyInfoGovClient.prototype.createRedirectURL = function (_a) {
        var purpose = _a.purpose, requestedAttributes = _a.requestedAttributes, relayState = _a.relayState, singpassEserviceId = _a.singpassEserviceId, redirectEndpoint = _a.redirectEndpoint;
        var queryParams = qs_1.default.stringify({
            purpose: purpose,
            attributes: requestedAttributes.join(),
            state: relayState,
            client_id: this.clientId,
            redirect_uri: redirectEndpoint !== null && redirectEndpoint !== void 0 ? redirectEndpoint : this.redirectEndpoint,
            sp_esvcId: singpassEserviceId !== null && singpassEserviceId !== void 0 ? singpassEserviceId : this.singpassEserviceId,
        });
        return "" + this.baseAPIUrl + Endpoint.Authorise + "?" + queryParams;
    };
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
    MyInfoGovClient.prototype.getPerson = function (accessToken, requestedAttributes, singpassEserviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var uinFin, url, params, paramsAuthHeader, headers, response, err_1, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uinFin = this.extractUinFin(accessToken);
                        url = "" + this.baseAPIUrl + Endpoint.Person + "/" + uinFin + "/";
                        params = {
                            client_id: this.clientId,
                            attributes: requestedAttributes.join(),
                            sp_esvcId: singpassEserviceId !== null && singpassEserviceId !== void 0 ? singpassEserviceId : this.singpassEserviceId,
                        };
                        paramsAuthHeader = this._generateAuthHeader('GET', url, params);
                        headers = {
                            'Cache-Control': 'no-cache',
                            Authorization: paramsAuthHeader + ",Bearer " + accessToken,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(url, {
                                headers: headers,
                                params: params,
                                paramsSerializer: qs_1.default.stringify,
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        throw new errors_1.MyInfoResponseError(err_1);
                    case 4:
                        // In dev mode, the response is automatically parsed to an object by Axios.
                        if (this.mode === MyInfoMode.Dev) {
                            if (typeof response.data !== 'object') {
                                throw new errors_1.WrongDataShapeError();
                            }
                            return [2 /*return*/, { uinFin: uinFin, data: response.data }];
                        }
                        // In non-dev mode, the response is a JWE and must be decrypted
                        if (typeof response.data !== 'string') {
                            throw new errors_1.WrongDataShapeError();
                        }
                        return [4 /*yield*/, this._decryptJWE(response.data)];
                    case 5:
                        data = _a.sent();
                        return [2 /*return*/, { uinFin: uinFin, data: data }];
                }
            });
        });
    };
    /**
     * Extracts the UIN or FIN from the access token.
     * @param accessToken JSON web token, which is the access token provided
     * by the Token endpoint
     * @returns The UIN or FIN decoded from the JWT
     * @throws {InvalidTokenSignatureError} Throws if the JWT signature is invalid
     * @throws {WrongAccessTokenShapeError} Throws if decoded JWT has an unexpected
     * type or shape
     */
    MyInfoGovClient.prototype.extractUinFin = function (accessToken) {
        var decoded;
        try {
            decoded = jsonwebtoken_1.verify(accessToken, this.myInfoPublicKey, {
                algorithms: ['RS256'],
            });
        }
        catch (err) {
            throw new errors_1.InvalidTokenSignatureError(err);
        }
        if (typeof decoded === 'object' &&
            util_1.hasProp(decoded, 'sub') &&
            typeof decoded.sub === 'string') {
            return decoded.sub;
        }
        throw new errors_1.WrongAccessTokenShapeError();
    };
    /**
     * Retrieves the access token from the Token endpoint.
     * @param authCode Authorisation code provided to the redirect endpoint
     * @returns The access token as a JWT
     * @throws {MyInfoResponseError} Throws if MyInfo returns a non-200 response
     * @throws {MissingAccessTokenError} Throws if MyInfo response does not
     * contain the access token
     */
    MyInfoGovClient.prototype.getAccessToken = function (authCode) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var postUrl, postParams, headers, response, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        postUrl = "" + this.baseAPIUrl + Endpoint.Token;
                        postParams = {
                            grant_type: 'authorization_code',
                            code: authCode,
                            redirect_uri: this.redirectEndpoint,
                            client_id: this.clientId,
                            client_secret: this.clientSecret,
                        };
                        headers = {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Cache-Control': 'no-cache',
                            Authorization: this._generateAuthHeader('POST', postUrl, postParams),
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default
                                // eslint-disable-next-line camelcase
                                .post(postUrl, util_1.objToSearchParams(postParams), { headers: headers })];
                    case 2:
                        response = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        throw new errors_1.MyInfoResponseError(err_2);
                    case 4:
                        if (!((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.access_token) ||
                            typeof response.data.access_token !== 'string') {
                            throw new errors_1.MissingAccessTokenError();
                        }
                        return [2 /*return*/, response.data.access_token];
                }
            });
        });
    };
    /**
     * Generates the content of the 'Authorization' header to be sent
     * with a request to MyInfo.
     * @param method HTTP method to be used for the request
     * @param url Endpoint to which the request is being sent
     * @param urlParams Query parameters being sent with the request
     * @returns The content which should be provided as the Authorization
     * header
     */
    MyInfoGovClient.prototype._generateAuthHeader = function (method, url, urlParams) {
        var timestamp = String(Date.now());
        var nonce = crypto_1.default.randomBytes(32).toString('base64');
        var authParams = util_1.sortObjKeys(__assign(__assign({}, urlParams), { signature_method: 'RS256', nonce: nonce,
            timestamp: timestamp, app_id: this.clientId }));
        var paramString = qs_1.default.stringify(authParams, { encode: false });
        var baseString = method.toUpperCase() + "&" + url + "&" + paramString;
        var signature = crypto_1.default
            .createSign('RSA-SHA256')
            .update(baseString)
            .sign(this.clientPrivateKey, 'base64');
        return "PKI_SIGN timestamp=\"" + timestamp + "\",nonce=\"" + nonce + "\",app_id=\"" + this.clientId + "\",signature_method=\"RS256\",signature=\"" + signature + "\"";
    };
    /**
     * Decrypts a JWE response string.
     * @param jwe Fullstop-delimited JWE
     * @returns The decrypted data, with signature already verified
     * @throws {DecryptDataError} Throws if an error occurs while decrypting data
     * @throws {InvalidDataSignatureError} Throws if signature on data is invalid
     * @throws {WrongDataShapeError} Throws if decrypted data from MyInfo is
     * of the wrong type
     */
    MyInfoGovClient.prototype._decryptJWE = function (jwe) {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, decoded, keystore, payload, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, node_jose_1.default.JWK.createKeyStore().add(this.clientPrivateKey, 'pem')];
                    case 1:
                        keystore = _a.sent();
                        return [4 /*yield*/, node_jose_1.default.JWE.createDecrypt(keystore).decrypt(jwe)
                            // The JSON.parse here is important, as the payload is wrapped in quotes
                        ];
                    case 2:
                        payload = (_a.sent()).payload;
                        // The JSON.parse here is important, as the payload is wrapped in quotes
                        jwt = JSON.parse(payload.toString());
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        throw new errors_1.DecryptDataError(err_3);
                    case 4:
                        try {
                            decoded = jsonwebtoken_1.verify(jwt, this.myInfoPublicKey, {
                                algorithms: ['RS256'],
                            });
                        }
                        catch (err) {
                            throw new errors_1.InvalidDataSignatureError(err);
                        }
                        if (typeof decoded !== 'object') {
                            throw new errors_1.WrongDataShapeError();
                        }
                        return [2 /*return*/, decoded];
                }
            });
        });
    };
    return MyInfoGovClient;
}());
exports.MyInfoGovClient = MyInfoGovClient;
