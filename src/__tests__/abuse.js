import { describe, it } from 'mocha'
import { expect } from 'chai'
import DataFetcher from '..'

describe('DataFetcher', () => {
    it('Fetcher creation requires a function', () => {
        expect(() => {
            new DataFetcher() // eslint-disable-line no-new
        }).to.throw(
            'DataFetcher must be constructed with a function which ' +
            `returns Promise, but got: undefined.`
        )

        expect(() => {
            new DataFetcher({}) // eslint-disable-line no-new
        }).to.throw(
            'DataFetcher must be constructed with a function which ' +
            `returns Promise, but got: [object Object].`
        )
    })

    it('Fetch function must return a Promise, not null', async () => {
        var badFetcher = new DataFetcher(() => null)

        var caughtError
        try {
            await badFetcher.fetch(1)
        } catch (error) {
            caughtError = error
        }
        expect(caughtError).to.be.instanceof(Error)
        expect(caughtError.message).to.equal(
            'DataFetcher must be constructed with a function which ' +
            `returns Promise, but the function return null.`
        )
    })

    it('Fetch function must return a Promise, not a value', async () => {
        // Note: this is returning the keys directly, rather than a promise to
        // keys.
        var badFetcher = new DataFetcher(key => key)

        var caughtError
        try {
            await badFetcher.fetch(1)
        } catch (error) {
            caughtError = error
        }
        expect(caughtError).to.be.instanceof(Error)
        expect(caughtError.message).to.equal(
            'DataFetcher must be constructed with a function which ' +
            `returns Promise, but the function return 1.`
        )
    })
})
