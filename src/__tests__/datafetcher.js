import { describe, it } from 'mocha'
import { expect } from 'chai'
import DataFetcher from '..'

describe('DataFetcher', () => {
    it('Simple data fetch', async () => {
        var fetcher = new DataFetcher((a, b) => Promise.resolve([ a, b ]))
        var res = await fetcher.fetch('a', 'b')
        expect(res).to.deep.equal([ 'a', 'b' ])
    })

    it('Cache response', async () => {
        var callCount = 0
        var fetcher = new DataFetcher(a => {
            callCount += 1
            return Promise.resolve(a)
        })
        await fetcher.fetch('a')
        await fetcher.fetch('a') // hit cache
        await fetcher.fetch('c')
        expect(callCount).to.equal(2)
    })

    it('Complex arguments cache', async () => {
        var callCount = 0
        var fetcher = new DataFetcher((o, a, s, n) => {
            callCount += 1
            return Promise.resolve([ o, a, s + n ])
        })

        var foo = 'foo'
        var qux = 'qux'
        await fetcher.fetch({foo}, [ 'bar' ], 'baz', 42)
        await fetcher.fetch({qux}, [ 'bar' ], 'baz', 42)
        var res = await fetcher.fetch({foo}, [ 'bar' ], 'baz', 42)

        expect(res).to.deep.equal([ {foo}, [ 'bar' ], 'baz42' ])
        expect(callCount).to.equal(2)
    })

    it('Resolves error to indicate failure', async () => {
        var fetcher = new DataFetcher(() => Promise.resolve(new Error('foo')))
        var caughtError
        try {
            await fetcher.fetch()
        } catch (error) {
            caughtError = error
        }
        expect(caughtError).to.be.instanceof(Error)
        expect((caughtError).message).to.equal('foo')
    })

    it('Cache resolved error', async () => {
        var callCount = 0
        var fetcher = new DataFetcher(() => {
            callCount += 1
            return Promise.resolve(new Error('foo'))
        })

        var caughtError1
        try {
            await fetcher.fetch()
        } catch (error) {
            caughtError1 = error
        }
        expect(caughtError1).to.be.instanceof(Error)

        var caughtError2
        try {
            await fetcher.fetch()
        } catch (error) {
            caughtError2 = error
        }
        expect(caughtError2).to.be.instanceof(Error)

        expect(caughtError1).to.equal(caughtError2)
        expect(callCount).to.equal(1)
    })

    it('Rejects error to indicate failure', async () => {
        var fetcher = new DataFetcher(() => Promise.reject(new Error('foo')))

        var caughtError
        try {
            await fetcher.fetch()
        } catch (error) {
            caughtError = error
        }

        expect(caughtError).to.be.instanceof(Error)
        expect((caughtError).message).to.equal('foo')
    })

    it('No cache for rejected error', async () => {
        var callCount = 0
        var fetcher = new DataFetcher(() => {
            callCount += 1
            return Promise.reject(new Error('foo'))
        })

        var caughtError1
        try {
            await fetcher.fetch()
        } catch (error) {
            caughtError1 = error
        }

        var caughtError2
        try {
            await fetcher.fetch()
        } catch (error) {
            caughtError2 = error
        }

        expect(caughtError1).to.not.equal(caughtError2)
    })
})
