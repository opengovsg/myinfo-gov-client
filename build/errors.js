"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrongDataShapeError = exports.InvalidDataSignatureError = exports.DecryptDataError = exports.MyInfoResponseError = exports.MissingAccessTokenError = exports.WrongAccessTokenShapeError = exports.InvalidTokenSignatureError = exports.MissingParamsError = void 0;
var MyInfoGovClientError = /** @class */ (function (_super) {
    __extends(MyInfoGovClientError, _super);
    /**
     * Constructor for custom error.
     * @param message Error message
     * @param err Optional error caught in a try-catch block
     */
    function MyInfoGovClientError(message, err) {
        var _this = _super.call(this, message) || this;
        if (err instanceof Error) {
            _this.message = message + ": " + err.message;
        }
        else if (err) {
            _this.message = message + ": " + JSON.stringify(err);
        }
        Error.captureStackTrace(_this, _this.constructor);
        _this.name = _this.constructor.name;
        return _this;
    }
    return MyInfoGovClientError;
}(Error));
/**
 * Missing parameters in MyInfoGovClient constructor.
 */
var MissingParamsError = /** @class */ (function (_super) {
    __extends(MissingParamsError, _super);
    function MissingParamsError(message) {
        if (message === void 0) { message = "Missing required parameter(s) in constructor: clientId, clientSecret, singpassEserviceId, redirectEndpoint, clientPrivateKey, myInfoPublicKey"; }
        return _super.call(this, message) || this;
    }
    return MissingParamsError;
}(MyInfoGovClientError));
exports.MissingParamsError = MissingParamsError;
/**
 * JWT signature could not be verified
 */
var InvalidTokenSignatureError = /** @class */ (function (_super) {
    __extends(InvalidTokenSignatureError, _super);
    function InvalidTokenSignatureError(verifyError, message) {
        if (message === void 0) { message = 'Signature on access token from MyInfo could not be verified'; }
        return _super.call(this, message, verifyError) || this;
    }
    return InvalidTokenSignatureError;
}(MyInfoGovClientError));
exports.InvalidTokenSignatureError = InvalidTokenSignatureError;
/**
 * JWT had wrong shape
 */
var WrongAccessTokenShapeError = /** @class */ (function (_super) {
    __extends(WrongAccessTokenShapeError, _super);
    function WrongAccessTokenShapeError(message) {
        if (message === void 0) { message = 'Decoded access token from MyInfo had unexpected shape, so NRIC could not be extracted'; }
        return _super.call(this, message) || this;
    }
    return WrongAccessTokenShapeError;
}(MyInfoGovClientError));
exports.WrongAccessTokenShapeError = WrongAccessTokenShapeError;
/**
 * Response from Token endpoint did not contain access token
 */
var MissingAccessTokenError = /** @class */ (function (_super) {
    __extends(MissingAccessTokenError, _super);
    function MissingAccessTokenError(message) {
        if (message === void 0) { message = 'MyInfo response did not contain valid access token'; }
        return _super.call(this, message) || this;
    }
    return MissingAccessTokenError;
}(MyInfoGovClientError));
exports.MissingAccessTokenError = MissingAccessTokenError;
/**
 * MyInfo returned non-200 response
 */
var MyInfoResponseError = /** @class */ (function (_super) {
    __extends(MyInfoResponseError, _super);
    function MyInfoResponseError(error, message) {
        if (message === void 0) { message = 'Error while connecting to MyInfo'; }
        return _super.call(this, message, error) || this;
    }
    return MyInfoResponseError;
}(MyInfoGovClientError));
exports.MyInfoResponseError = MyInfoResponseError;
/**
 * Error while decrypting Person data from MyInfo
 */
var DecryptDataError = /** @class */ (function (_super) {
    __extends(DecryptDataError, _super);
    function DecryptDataError(error, message) {
        if (message === void 0) { message = 'Error while decrypting data from MyInfo Person API'; }
        return _super.call(this, message, error) || this;
    }
    return DecryptDataError;
}(MyInfoGovClientError));
exports.DecryptDataError = DecryptDataError;
/**
 * Invalid signature on data from Person API
 */
var InvalidDataSignatureError = /** @class */ (function (_super) {
    __extends(InvalidDataSignatureError, _super);
    function InvalidDataSignatureError(error, message) {
        if (message === void 0) { message = 'Signature on Person API data from MyInfo could not be verified'; }
        return _super.call(this, message, error) || this;
    }
    return InvalidDataSignatureError;
}(MyInfoGovClientError));
exports.InvalidDataSignatureError = InvalidDataSignatureError;
/**
 * Person data from MyInfo had unexpected shape
 */
var WrongDataShapeError = /** @class */ (function (_super) {
    __extends(WrongDataShapeError, _super);
    function WrongDataShapeError(message) {
        if (message === void 0) { message = 'Data from MyInfo Person API had unexpected shape'; }
        return _super.call(this, message) || this;
    }
    return WrongDataShapeError;
}(MyInfoGovClientError));
exports.WrongDataShapeError = WrongDataShapeError;
