/*jslint indent: 4, nomen: true */
/*global module, require, console */
(function () {

    'use strict';

    var appbones,
        _ = require('lodash'),
        path = require('path'),
        mfs = require('mem-fs'),
        yaml = require('js-yaml'),
        mkdirp = require('mkdirp'),
        mfseditor = require('mem-fs-editor'),
        defaults = {
            src: '',
            dest: '',
            data: {},
            lodash: {},
            filepath: '',
            overwrite: false
        },
        store = mfs.create(),
        fse = mfseditor.create(store),
        wrapper = {

            /* --------------------------------------------------------------
             *
             * Privates Methods
             *
            --------------------------------------------------------------- */

            src: null,
            dest: null,
            overwrite: false,
            _options: defaults,

            /**
             *
             * Creation d'un dossier dans l'arborescence
             *
             */
            _createBonesFolder: function (parent, name) {
                try {
                    var origin = path.join(parent, name),
                        dest = path.resolve(this.options.dest, origin);
                    if (!fse.exists(dest)) {
                        mkdirp.sync(dest);
                    }
                    return origin;
                } catch (e) {
                    throw new Error(e.message);
                }
            },

            _parseBonesObject: function (parent, object) {
                var origin,
                    $this = this;
                Object.keys(object)
                    .map(function (key) {
                        origin = $this._createBonesFolder(parent, key);
                        return $this._createBones(origin, object[key]);
                    });
                return true;
            },

            _parseBonesFiles: function (parent, files) {
                var src,
                    index,
                    newname,
                    content,
                    $this = this;

                files.map(function (filepath) {
                    src = path.join($this.options.src, parent, filepath);
                    if (!fse.exists(src)) {
                        console.error('AppBones :: ERROR :: File ' + src + ' doesn\'t exists');
                        return false;
                    }
                    content = fse.read(src, {
                        defaults: ''
                    });
                    // Si le fichier existe
                    index = (filepath.indexOf('_') === 0);
                    newname = filepath.substr(index);
                    var destfile = path.join($this.options.dest, parent, newname);
                    // si il s'agit d'un template
                    if (index) {
                        content = $this._.template(content, $this.options.data, $this.options._);
                    }
                    // on ecrit le contenu sur le disque
                    fse.write(destfile, content);
                    fse.commit(function () {
                        if ($this.debug) {
                            console.log('AppBones :: File ' + destfile + ' has been written to disk');
                        }
                    });
                });
                return true;
            },

            /**
             *
             * @param parent [string] Cle d'objet
             *
             */
            _createBones: function (parent, bones) {
                var msg,
                    $this = this;
                if (!this._.isNull(bones)) {
                    bones.filter(function (item) {

                        if ($this._.isEmpty(item)) {
                            msg = 'AppBones :: _createBones :: Bone object is empty';
                            throw new Error(msg);
                        }

                        // Si il s'agit d'un dossier
                        if ($this._.isString(item)) {
                            $this._createBonesFolder(parent, item);
                        } else if ($this._.isArray(item)) {
                            // Si il s'agit d'un array
                            // Alors il est question de fichiers
                            $this._parseBonesFiles(parent, item);
                        } else if ($this._.isPlainObject(item)) {
                            // Si il s'agit d'un objet
                            // Alors on reparse l'objet
                            $this._parseBonesObject(parent, item);
                        }

                    });
                    return true;
                }
                return false;
            },

            /* --------------------------------------------------------------
             *
             * Public Methods
             *
            --------------------------------------------------------------- */

            /**
             *
             * Retourne le chemin source
             *
             */
            getSourcePath: function () {
                return this.options.src;
            },

            /**
             *
             * Retourne le chemin destination
             *
             */
            getDestinationPath: function () {
                return this.options.dest;
            },

            setDebug: function (debug) {
                this.debug = debug;
                return this;
            },

            /**
             *
             * Contruit la structure
             *
             * @param filepath [string] Path vers le fichier yml | throw if not exists
             * @param templateData [object] Object de configuration pour les templates lodash
             * @param lodashOptions [object] Object de configuration le moteur lodash
             *
             */
            build: function (filepath, templateData, lodashOptions) {

                // base = path.dirname(module.parent.filename);
                // this.options.overwrite = overwrite || false;
                // this.options.src = path.resolve(base, path.normalize(sourcePath));
                // this.options.dest = path.resolve(base, path.normalize(destinationPath));

                if (arguments.length < 1 || this._.isEmpty(filepath)) {
                    throw new Error('AppBones :: Build method needs one arguments at least');
                }
                var content, bones, root,
                    caller = path.dirname(module.parent.filename); // relative path to current module caller
                this.options.data = templateData || {};
                this.options._ = lodashOptions || {};
                //
                filepath = path.normalize(filepath);
                this.options.filepath = path.resolve(caller, filepath);
                content = fse.read(this.options.filepath, {
                    defaults: ''
                }).trim();
                if (this._.isEmpty(content)) {
                    throw new Error('AppBones :: Build :: ' + filepath + ' not exists or is empty');
                }
                try {

                    bones = yaml.safeLoad(content);
                    root = bones.hasOwnProperty('root') ? bones.root : Object.keys(bones)[0];
                    return this._createBones('', root);

                } catch (e) {
                    throw new Error(e.message);
                }
            }


        };

    appbones = function () {};

    _.assign(appbones, wrapper);
    module.exports = appbones;

}());
