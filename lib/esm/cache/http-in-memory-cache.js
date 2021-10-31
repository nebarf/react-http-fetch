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
     * Tells if a cached entry is expired.
     */
    HttpInMemoryCacheService.prototype.isEntryExpired = function (entry) {
        var nowTime = new Date().getTime();
        var cachedTime = entry.cachedAt.getTime();
        return cachedTime + entry.maxAge < nowTime;
    };
    /**
     * Gets the cached entry associated with the request.
     */
    HttpInMemoryCacheService.prototype.getEntry = function (request) {
        var reqIdentifier = this.getRequestIdentifier(request);
        return this.store.get(reqIdentifier);
    };
    /**
     * Removes a cached entry.
     */
    HttpInMemoryCacheService.prototype.removeEntry = function (entry) {
        this.store.delete(entry.identifier);
    };
    /**
     * Determines if for the given request is available a cached response.
     */
    HttpInMemoryCacheService.prototype.has = function (request) {
        var key = this.getRequestIdentifier(request);
        return this.store.has(key);
    };
    /**
     * Tells if the cached request is expired or not.
     */
    HttpInMemoryCacheService.prototype.isExpired = function (request) {
        var cachedEntry = this.getEntry(request);
        if (!cachedEntry) {
            return true;
        }
        return this.isEntryExpired(cachedEntry);
    };
    /**
     * Gets the cached entry in the map for the given request.
     */
    HttpInMemoryCacheService.prototype.get = function (request) {
        var cachedEntry = this.getEntry(request);
        if (!cachedEntry) {
            return undefined;
        }
        var isExpired = this.isEntryExpired(cachedEntry);
        return isExpired ? undefined : cachedEntry.response;
    };
    /**
     * Puts a new cached response for the given request.
     */
    HttpInMemoryCacheService.prototype.put = function (request, response) {
        var _this = this;
        if (!request.maxAge) {
            return;
        }
        var reqKey = this.getRequestIdentifier(request);
        var entry = {
            response: response,
            identifier: reqKey,
            cachedAt: new Date(),
            maxAge: request.maxAge,
        };
        // Update and flush the cache.
        this.store.set(reqKey, entry);
        // Remove the entry from the cache once expired.
        var timerRef = setTimeout(function () {
            _this.removeEntry(entry);
            clearTimeout(timerRef);
        }, request.maxAge);
    };
    /**
     * Founds all expired entry and deletes them from the cache.
     */
    HttpInMemoryCacheService.prototype.flush = function () {
        var _this = this;
        this.store.forEach(function (entry) {
            var isEntryExpired = _this.isEntryExpired(entry);
            if (isEntryExpired) {
                _this.removeEntry(entry);
            }
        });
    };
    return HttpInMemoryCacheService;
}(HttpCache));
export { HttpInMemoryCacheService };
