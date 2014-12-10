/*jslint indent: 4 */
/*global module, require, console */
(function () {

    'use strict';

    var AppBones,
        path = require('path'),
        chalk = require('chalk'),
        fs = require('fs-extra'),
        yaml = require('js-yaml'),
        lodash = require('lodash');

    function createBones(parent, values, data) {
        var src, dest, content,
            opts = {encoding: 'utf8'};
        if (!lodash.isNull(values)) {
            values.filter(function (item) {
                if (lodash.isString(item)) {
                    return true;

                } else if (lodash.isArray(item)) {
                    item.map(function (filepath) {
                        src = path.join(AppBones.srcPath, parent, filepath);

                        console.log(src);

                        if (filepath.indexOf('_') === 0) {
                            filepath = filepath.slice(1);
                            dest = path.join(AppBones.destPath, parent, filepath);
                            fs.copySync(src, dest);
                            content = fs.readFileSync(dest, opts);
                            content = lodash.template(content, data);
                            fs.writeFileSync(dest, content);

                        } else {
                            dest = path.join(AppBones.destPath, parent, filepath);
                            fs.copySync(src, dest);

                        }

                    });
                    return false;

                } else if (lodash.isObject(item)) {
                    Object.keys(item).map(function (key) {
                        dest = path.join(parent, key)
                        fs.mkdirsSync(path.resolve(AppBones.destPath, dest));
                        createBones(dest, item[key], data);
                    });
                    return false;

                }
            }).map(function (item) {
                dest = path.resolve(AppBones.destPath, path.join(parent, item));
                fs.mkdirsSync(dest);
            });
        }
        return true;
        /*


                    // si il s'agit d'un string
                    // alors il s'agit d'un nom de dossier a creer
                    return true;
                } else if () {
                    // si il s'agit d'un array
                    // alors il s'agit de fichier
                    // copyFiles(item, data);
                    item.map(function (filepath) {
                        if (filepath.indexOf('_') === 0) {
                            //
                        } else {
                        }
                    });

                } else if (lodash.isObject(item)) {
                    // si il s'agit d'un object
                    // alors on relance la creation

                        fs.mkdirsSync(src);
                    });
                    return false;
                } else {
                    return false;
                }
            }).map(function (item) {
                console.log(item);
                src = path.resolve(parent, item);
                fs.mkdirsSync(src);
            });
        }
        */
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
