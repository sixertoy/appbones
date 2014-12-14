
# Appbones [![Built with Grunt][grunt-img]](http://gruntjs.com/)

[![MIT License][license-img]][license-url] [![NPM version][npm-version-img]][npm-url] [![NPM downloads][npm-downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coverall-img]][coverall-url]

> Build path/directory and templates/files with an yaml config file

## Install

```bash
npm install appbones --save
```

## Usage

* app.js

```js
appbones = require('appbones');

appbones.sourcePath('../templates');
appbones.destinationPath('/abs/path/to/project/dir');
appbones('../relative/path/to/bones/file.yml', {
    anobject: {
        content: 'for',
        replacing: 'lodash.template()'
    }
});
```

* bones.yml

```yaml
---
# files
root:
    - [toto.txt, .toto.yml]
    - html:
        - css:
        - js:
            - [_toto.txt, _.toto.yml]
```

### Notes

**appbones** source and destination path are resolved with node **path.resolve** relative to current used module

## Dependencies

* [**fs-extra**](https://github.com/jprichardson/node-fs-extra) - ^0.12.0
* [**js-yaml**](https://github.com/nodeca/js-yaml) - ^3.2.3
* [**lodash**](https://lodash.com) - ^2.4.1


[grunt-img]: https://cdn.gruntjs.com/builtwith.png

[license-img]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE-MIT

[coverall-url]: https://coveralls.io/r/sixertoy/appbones
[coverall-img]: https://img.shields.io/coveralls/sixertoy/appbones.svg?style=flat-square

[npm-url]: https://npmjs.org/package/appbones
[npm-version-img]: http://img.shields.io/npm/v/appbones.svg?style=flat-square
[npm-downloads-img]: http://img.shields.io/npm/dm/appbones.svg?style=flat-square

[travis-url]: https://travis-ci.org/sixertoy/appbones
[travis-img]: http://img.shields.io/travis/sixertoy/appbones.svg?style=flat-square
