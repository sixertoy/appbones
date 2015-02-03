/*jslint indent: 4 */
/*global module, require */
(function () {

    'use strict';

    var AppBones,
        _lodashOptions,
        _templatesData,
        fs = require('fs'),
        path = require('path'),
        fse = require('fs-extra'),
        yaml = require('js-yaml'),
        lodash = require('lodash');

    function createTemplate(parent, filepath, src) {
        var content,
            opts = {
                encoding: 'utf8'
            },
            dest = path.join(AppBones.destPath, parent, filepath.substr(1));
        if (fs.existsSync(dest)) {
            fse.remove(dest);
        }
        fse.copySync(src, dest);
        content = fse.readFileSync(dest, opts);
        content = lodash.template(content, _templatesData, _lodashOptions);
        fse.writeFileSync(dest, content);
    }

    function copyFile(parent, filepath, src) {
        var dest = path.join(AppBones.destPath, parent, filepath);
        if (fs.existsSync(dest)) {
            fse.remove(dest);
        }
        fse.copySync(src, dest);
    }

    function createBones(parent, values) {
        var src, dest;
        if (!lodash.isNull(values)) {
            values.filter(function (item) {
                if (lodash.isString(item)) {
                    return true;

                } else if (lodash.isArray(item)) {
                    item.map(function (filepath) {
                        src = path.join(AppBones.srcPath, parent, filepath);
                        if (filepath.indexOf('_') === 0) {
                            try {
                                createTemplate(parent, filepath, src);
                            } catch (err) {
                                throw new Error(err.message);
                            }

                        } else {
                            try {
                                copyFile(parent, filepath, src);
                            } catch (e) {
                                throw new Error(e.message);
                            }

                        }

                    });
                    return false;

                } else if (lodash.isObject(item)) {
                    Object.keys(item).map(function (key) {
                        try {
                            dest = path.join(parent, key);
                            fse.mkdirsSync(path.resolve(AppBones.destPath, dest));
                            createBones(dest, item[key]);
                        } catch (e) {
                            throw new Error(e.message);
                        }
                    });
                    return false;

                }
            }).map(function (item) {
                try {
                    dest = path.resolve(AppBones.destPath, path.join(parent, item));
                    fse.mkdirsSync(dest);
                } catch (e) {
                    throw new Error(e.message);
                }
            });
        }
        return true;
    }

    /**
     *
     * Exposed methods
     *
     */
    AppBones = function (filepath, config, options) {
        var bones, caller, root;
        _templatesData = config || {};
        _lodashOptions = options || {};
        try {
            caller = path.dirname(module.parent.filename); // relative path to current module caller
            filepath = path.resolve(caller, path.normalize(filepath));
            bones = yaml.safeLoad(fse.readFileSync(filepath, {
                encoding: 'utf8'
            }));
            root = bones.hasOwnProperty('root') ? bones.root : Object.keys(bones)[0];
            createBones('', root);
            return true;

        } catch (e) {
            throw new Error(e.message);
        }
    };

    AppBones.sourcePath = function (value) {
        var base = path.dirname(module.parent.filename);
        if (value) {
            AppBones.srcPath = path.resolve(base, path.normalize(value));
            return AppBones.srcPath;
        } else {
            return AppBones.srcPath;
        }
    };

    AppBones.destinationPath = function (value) {
        var base = path.dirname(module.parent.filename);
        if (value) {
            AppBones.destPath = path.resolve(base, path.normalize(value));
            return AppBones.destPath;
        } else {
            return AppBones.destPath;
        }
    };

    module.exports = AppBones;

}());
