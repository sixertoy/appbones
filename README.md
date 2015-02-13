
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
AppBones = require('appbones');

// @param [source, destination]
var builder = new AppBones('../templates', '/abs/path/to/project/dir');
// @param [yml_file, (template_data)]
builder.build('../relative/path/to/bones/file.yml', {
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

### History

v0.2.8 - Fix undescore inside files name

v0.2.7 - Grammatically english updated

v0.2.6 - Fix sub files creation

v0.2.3 - Update package.json

v0.2.2 - Update documentation

v0.2.1 - Change fs-extra for mem-fs-editor

---

v0.1.7 - ...

## Dependencies

* [**mem-fs-editor**](https://github.com/SBoudrias/mem-fs-editor) - ^1.2.1
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
