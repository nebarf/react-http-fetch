"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestErroredEvent = void 0;
var http_event_1 = require("./http-event");
var RequestErroredEvent = /** @class */ (function (_super) {
    __extends(RequestErroredEvent, _super);
    function RequestErroredEvent(payload) {
        var _this = _super.call(this) || this;
        _this.payload = payload;
        return _this;
    }
    return RequestErroredEvent;
}(http_event_1.HttpEvent));
exports.RequestErroredEvent = RequestErroredEvent;
