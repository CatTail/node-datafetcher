import createRare from 'rare'

export default class DataFetcher {
    constructor(fetchFn) {
        if (typeof fetchFn !== 'function') {
            throw new TypeError(
                'DataFetcher must be constructed with a function which ' +
                `returns Promise, but got: ${fetchFn}.`
            )
        }
        this._rare = createRare({deep: true})
        this._fetchFn = fetchFn
        this._promiseCache = {}
    }

    fetch(...args) {
        var cacheKey = this._rare.apply(null, args)
        var cachedPromise = this._promiseCache[cacheKey]

        if (cachedPromise) {
            return cachedPromise
        }

        var promise = new Promise((resolve, reject) => {
            var fetchPromise = this._fetchFn.apply(null, args)
            if (!fetchPromise || typeof fetchPromise.then !== 'function') {
                this.clear(cacheKey)
                reject(new TypeError(
                    'DataFetcher must be constructed with a function which ' +
                    `returns Promise, but the function return ${fetchPromise}.`
                ))
            }
            fetchPromise.then(value => {
                if (value instanceof Error) {
                    reject(value)
                } else {
                    resolve(value)
                }
            }).catch(error => {
                this.clear(cacheKey)
                reject(error)
            })
        })

        this._promiseCache[cacheKey] = promise

        return promise
    }

    clear(key) {
        delete this._promiseCache[key]
    }
}
