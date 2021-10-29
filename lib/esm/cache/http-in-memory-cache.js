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
import { HttpCache } from './http-cache';
var HttpInMemoryCacheService = /** @class */ (function (_super) {
    __extends(HttpInMemoryCacheService, _super);
    function HttpInMemoryCacheService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * The local cache providing for a request identifier
         * the corresponding parsed response.
         */
        _this.store = new Map();
        return _this;
    }
    /**
     * Gets the unique key used as idenitifier to store
     * a cached response for the given http request.
     */
    HttpInMemoryCacheService.prototype.getRequestIdentifier = function (request) {
        var fullUrl = request.urlWithParams;
        return fullUrl;
    };
    /**
     * Determines if for the given request is available a cached response.
     */
    HttpInMemoryCacheService.prototype.has = function (request) {
        var key = this.getRequestIdentifier(request);
        return this.store.has(key);
    };
    /**
     * Gets the cached entry in the map for the given request.
     */
    HttpInMemoryCacheService.prototype.get = function (request) {
        var reqKey = this.getRequestIdentifier(request);
        var cachedEntry = this.store.get(reqKey);
        if (!cachedEntry) {
            return undefined;
        }
        var isExpired = cachedEntry.lastRead + cachedEntry.maxAge < Date.now();
        return isExpired ? undefined : cachedEntry.response;
    };
    /**
     * Puts a new cached response for the given request.
     */
    HttpInMemoryCacheService.prototype.put = function (request, response) {
        if (!request.maxAge) {
            this.flush();
            return;
        }
        var reqKey = this.getRequestIdentifier(request);
        var entry = {
            response: response,
            identifier: reqKey,
            lastRead: Date.now(),
            maxAge: request.maxAge,
        };
        // Update and flush the cache.
        this.store.set(reqKey, entry);
        this.flush();
    };
    /**
     * Founds all expired entry and deletes them from the cache.
     */
    HttpInMemoryCacheService.prototype.flush = function () {
        var _this = this;
        this.store.forEach(function (entry) {
            var isEntryExpired = entry.lastRead + entry.maxAge < Date.now();
            if (isEntryExpired) {
                _this.store.delete(entry.identifier);
            }
        });
    };
    return HttpInMemoryCacheService;
}(HttpCache));
export { HttpInMemoryCacheService };
