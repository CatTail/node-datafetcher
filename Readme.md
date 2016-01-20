# node-datafetcher [![NPM version][npm-image]][npm-url] [![build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url]

> Inspired by https://github.com/facebook/dataloader

## Installation

	npm install --save datafetcher

## Usage

    var DataFetcher = require('datafetcher')
    var fetcher = new DataFetcher(key => Promise.resolve(key))
    fetcher.fetch('something').then(value => {
        value === 'something'
    })

## License

MIT

[npm-image]: https://img.shields.io/npm/v/node-datafetcher.svg?style=flat
[npm-url]: https://npmjs.org/package/node-datafetcher
[travis-image]: https://img.shields.io/travis/CatTail/node-datafetcher.svg?style=flat
[travis-url]: https://travis-ci.org/CatTail/node-datafetcher
[coveralls-image]: https://img.shields.io/coveralls/CatTail/node-datafetcher.svg?style=flat
[coveralls-url]: https://coveralls.io/r/CatTail/node-datafetcher?branch=master
