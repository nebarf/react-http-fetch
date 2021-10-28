"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHttpRequest = void 0;
var react_1 = require("react");
var __1 = require("../..");
var action_creators_1 = require("./action-creators");
var state_reducer_1 = require("./state-reducer");
var react_fast_compare_1 = __importDefault(require("react-fast-compare"));
var use_custom_compare_1 = require("use-custom-compare");
var useHttpRequest = function (params) {
    /**
     * Grabs the "request" function from the http client.
     */
    var httpClientRequest = (0, __1.useHttpClient)().request;
    // The state of the request.
    var _a = (0, react_1.useReducer)(state_reducer_1.httpRequestReducer, (0, state_reducer_1.initialState)(params.initialData)), state = _a[0], dispatch = _a[1];
    /**
     * A ref telling whether the component is currently mounted or not.
     */
    var isMounted = (0, react_1.useRef)(false);
    /**
     * Safely dispatches an action by first checking the mounting state of the component.
     */
    var safelyDispatch = (0, react_1.useCallback)(function (action) {
        if (isMounted.current) {
            dispatch(action);
        }
    }, [dispatch]);
    /**
     * Performs the http request.
     */
    var request = (0, use_custom_compare_1.useCustomCompareCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var reqParams, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    safelyDispatch((0, action_creators_1.requestInit)());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    reqParams = {
                        baseUrlOverride: params.baseUrlOverride,
                        parser: params.parser,
                        relativeUrl: params.relativeUrl,
                        requestOptions: params.requestOptions,
                    };
                    return [4 /*yield*/, httpClientRequest(reqParams)];
                case 2:
                    response = _a.sent();
                    safelyDispatch((0, action_creators_1.requestSuccess)(response));
                    return [2 /*return*/, response];
                case 3:
                    error_1 = _a.sent();
                    // Dispatch the action handling the errored request.
                    safelyDispatch((0, action_creators_1.requestError)(error_1));
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [httpClientRequest, params, safelyDispatch], function (prev, actual) { return (0, react_fast_compare_1.default)(prev, actual); });
    /**
     * Keeps track of the mounting state of the component.
     */
    (0, react_1.useEffect)(function () {
        isMounted.current = true;
        var fetchOnBootstrap = params.fetchOnBootstrap;
        if (fetchOnBootstrap) {
            request();
        }
        return function () {
            isMounted.current = false;
        };
    }, [params, request]);
    return [state, request];
};
exports.useHttpRequest = useHttpRequest;
