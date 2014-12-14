/*jslint indent: 4 */
/*global module, require */
(function () {

    'use strict';

    var AppBones,
        path = require('path'),
        fs = require('fs-extra'),
        yaml = require('js-yaml'),
        lodash = require('lodash');

    function createBones(parent, values, data) {
        var src, dest, content,
            opts = {
                encoding: 'utf8'
            };
        if (!lodash.isNull(values)) {
            values.filter(function (item) {
                if (lodash.isString(item)) {
                    return true;

                } else if (lodash.isArray(item)) {
                    item.map(function (filepath) {
                        src = path.join(AppBones.srcPath, parent, filepath);
                        if (filepath.indexOf('_') === 0) {
                            try {
                                dest = path.join(AppBones.destPath, parent, filepath.substr(1));
                                fs.copySync(src, dest);
                                content = fs.readFileSync(dest, opts);
                                content = lodash.template(content, data);
                                fs.writeFileSync(dest, content);
                            } catch (e) {
                                throw new Error(e.message);
                            }

                        } else {
                            try {
                                dest = path.join(AppBones.destPath, parent, filepath);
                                fs.copySync(src, dest);
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
                            fs.mkdirsSync(path.resolve(AppBones.destPath, dest));
                            createBones(dest, item[key], data);
                        } catch (e) {
                            throw new Error(e.message);
                        }
                    });
                    return false;

                }
            }).map(function (item) {
                try {
                    dest = path.resolve(AppBones.destPath, path.join(parent, item));
                    fs.mkdirsSync(dest);
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
    AppBones = function (filepath, config) {
        var bones, caller, root,
            data = config || {},
            opts = {
                encoding: 'utf8'
            };

        try {
            caller = path.dirname(module.parent.filename); // relative path to current module caller
            filepath = path.resolve(caller, path.normalize(filepath));
            bones = yaml.safeLoad(fs.readFileSync(filepath, opts));
            root = bones.hasOwnProperty('root') ? bones.root : Object.keys(bones)[0];
            createBones('', root, data);
            return true;

        } catch (e) {
            return false;
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
