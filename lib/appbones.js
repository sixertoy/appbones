/*jslint indent: 4, nomen: true */
/*global module, require */
(function () {

    'use strict';

    var AppBones, store, fse,
        path = require('path'),
        mfs = require('mem-fs'),
        Base = require('./base'),
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
        };

    store = mfs.create();
    fse = mfseditor.create(store);

    AppBones = Base.extend({

        options: defaults,

        _super: function () {
            var parent, Parent;
            if (this.__super__ && this.__super__.constructor) {
                Parent = this.__super__.constructor;
                if (this.constructor !== Parent) {
                    parent = new Parent();
                    parent = null; // jshint
                }
            }
        },

        /**
         *
         * Creation d'un dossier dans l'arborescence
         *
         */
        _createBoneFolder: function (parent, name) {
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
                    origin = $this._createBoneFolder(parent, key);
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
                    content = $this._.template(content, $this.options.data, $this.options.lodash);
                }
                // on ecrit le contenu sur le disque
                fse.write(destfile, content);
                fse.commit(function () {
                    console.log('AppBones :: File ' + destfile + ' has been written to disk');
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
                        $this._createBoneFolder(parent, item);
                    }
                    // Si il s'agit d'un array
                    // Alors il est question de fichiers
                    else if ($this._.isArray(item)) {
                        $this._parseBonesFiles(parent, item);
                    }
                    // Si il s'agit d'un objet
                    // Alors on reparse l'objet
                    else if ($this._.isPlainObject(item)) {
                        $this._parseBonesObject(parent, item);
                    }

                });
                return true;
            }
            return false;
        },

        /**
         *
         * Constructeur
         *
         * @param sourcePath [string] Chemin source des fichiers
         * @param destinationPath [string] Chemin de destination des fichiers
         * @param overwrite [boolean]
         *
         */
        constructor: function (sourcePath, destinationPath, overwrite) {
            var base,
                length = arguments.length < 2,
                falsey = (this._.isEmpty(sourcePath) || this._.isEmpty(destinationPath));
            if (falsey || length) {
                throw new Error('AppBones :: Constructor needs two arguments at least');
            }
            this._super();
            base = path.dirname(module.parent.filename);
            this.options.overwrite = overwrite || false;
            this.options.src = path.resolve(base, path.normalize(sourcePath));
            this.options.dest = path.resolve(base, path.normalize(destinationPath));
        }
    });

    /**
     *
     * Retourne le chemin source
     *
     */
    AppBones.prototype.getSourcePath = function () {
        return this.options.src;
    };

    /**
     *
     * Retourne le chemin destination
     *
     */
    AppBones.prototype.getDestinationPath = function () {
        return this.options.dest;
    };

    /**
     *
     * Contruit la structure
     *
     * @param filepath [string] Path vers le fichier yml | throw if not exists
     * @param templateData [object] Object de configuration pour les templates lodash
     * @param lodashOptions [object] Object de configuration le moteur lodash
     *
     */
    AppBones.prototype.build = function (filepath, templateData, lodashOptions) {
        if (arguments.length < 1 || this._.isEmpty(filepath)) {
            throw new Error('AppBones :: Build method needs one arguments at least');
        }
        var content, bones, root,
            caller = path.dirname(module.parent.filename); // relative path to current module caller
        this.options.data = templateData || {};
        this.options.lodash = lodashOptions || {};
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
    };

    module.exports = AppBones;

}());
