'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _rare = require('rare');

var _rare2 = _interopRequireDefault(_rare);

var rare = (0, _rare2['default'])({ deep: true });

var DataFetcher = (function () {
    function DataFetcher(fetchFn) {
        _classCallCheck(this, DataFetcher);

        if (typeof fetchFn !== 'function') {
            throw new TypeError('DataFetcher must be constructed with a function which ' + ('returns Promise, but got: ' + fetchFn + '.'));
        }
        this._fetchFn = fetchFn;
        this._promiseCache = {};
    }

    _createClass(DataFetcher, [{
        key: 'fetch',
        value: function fetch() {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var cacheKey = rare.apply(null, args);
            var cachedPromise = this._promiseCache[cacheKey];

            if (cachedPromise) {
                return cachedPromise;
            }

            var promise = new Promise(function (resolve, reject) {
                var fetchPromise = _this._fetchFn.apply(null, args);
                if (!fetchPromise || typeof fetchPromise.then !== 'function') {
                    _this.clear(cacheKey);
                    reject(new TypeError('DataFetcher must be constructed with a function which ' + ('returns Promise, but the function return ' + fetchPromise + '.')));
                }
                fetchPromise.then(function (value) {
                    if (value instanceof Error) {
                        reject(value);
                    } else {
                        resolve(value);
                    }
                })['catch'](function (error) {
                    _this.clear(cacheKey);
                    reject(error);
                });
            });

            this._promiseCache[cacheKey] = promise;

            return promise;
        }
    }, {
        key: 'clear',
        value: function clear(key) {
            delete this._promiseCache[key];
        }
    }]);

    return DataFetcher;
})();

exports['default'] = DataFetcher;
module.exports = exports['default'];