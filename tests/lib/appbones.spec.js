/*jshint unused: false */
/*jslint indent: 4, nomen: true */
/*global jasmine, process, require, describe, it, xit, expect, beforeEach, afterEach, afterLast, Class, __dirname */
(function () {

    'use strict';

    var file, res, helper,
        cwd = process.cwd(),
        path = require('path'),
        fs = require('fs-extra'),
        AppBones = require(path.join(cwd, 'lib/appbones'));

    describe('appbones :: ', function () {

        beforeEach(function () {});

        describe('constructor :: ', function () {
            it('should throw if args.length < 2', function () {
                expect(function () {
                    helper = new AppBones();
                }).toThrow();
                expect(function () {
                    helper = new AppBones('');
                }).toThrow();
                expect(function () {
                    helper = new AppBones(false);
                }).toThrow();
                expect(function () {
                    helper = new AppBones(null);
                }).toThrow();
                expect(function () {
                    helper = new AppBones(null, '');
                }).toThrow();
            });
            it('should not throw', function () {
                expect(function () {
                    helper = new AppBones('../expected', '../../lib');
                }).not.toThrow();
            });
        });

        describe('getDestinationPath :: ', function () {
            it('should be equal to a relative path', function () {
                res = path.resolve(__dirname, '../templates');
                helper = new AppBones('srcPath', '../templates');
                expect(helper.getDestinationPath()).toEqual(res);
            });
            it('should be equal from an absolute path', function () {
                res = path.resolve(__dirname, '../expected');
                var abs = path.join(process.cwd(), 'tests/expected');
                helper = new AppBones('srcPath', abs);
                expect(helper.getDestinationPath()).toEqual(res);
            });
        });

        describe('build :: ', function () {
            helper = new AppBones('../fixtures', '../templates');
            it('should throw', function () {
                expect(function () {
                    helper.build();
                }).toThrow();
                expect(function () {
                    helper.build('');
                }).toThrow();
                expect(function () {
                    helper.build(false);
                }).toThrow();
                expect(function () {
                    helper.build(null);
                }).toThrow();
                expect(function () {
                    helper.build('toto.yml'); // file not exists
                }).toThrow();
                expect(function () {
                    file = path.join(cwd, 'tests/fixtures/empty.yml');
                    helper.build(file); // file not exists
                }).toThrow();
            });

            it('should not throw', function () {
                file = './../fixtures/folders.yml'; // file exists
                expect(function () {
                    helper.build(file);
                }).not.toThrow();
                file = path.join(cwd, 'tests/fixtures/folders.yml'); // file exists absolute path
                expect(function () {
                    helper.build(file);
                }).not.toThrow();
                file = path.join(cwd, 'tests/fixtures/root.yml'); // empty folder root bone
                expect(function () {
                    helper.build(file);
                }).not.toThrow();
            });

            it('should return true', function () {
                file = path.join(cwd, 'tests/fixtures/folders.yml');
                expect(helper.build(file)).toBe(true);
            });

            it('should have created folders described in folders.yml', function (done) {
                file = path.join(cwd, 'tests/fixtures/folders.yml');
                helper = new AppBones('../templates', '../expected');
                helper.build(file);
                setTimeout(function () {
                    var f1 = path.resolve(__dirname, '../expected/html'),
                        f2 = path.resolve(__dirname, '../expected/html/js'),
                        f3 = path.resolve(__dirname, '../expected/html/css');

                    expect(fs.existsSync(f1)).toBe(true);
                    expect(fs.existsSync(f2)).toBe(true);
                    expect(fs.existsSync(f3)).toBe(true);

                    done();
                }, 2000);
            });

            it('should have created files described in files.yml', function (done) {
                file = path.join(cwd, 'tests/fixtures/files.yml');
                helper = new AppBones('../templates', '../expected');
                helper.build(file);
                setTimeout(function () {
                    var f1 = path.resolve(__dirname, '../expected/toto.txt'),
                        f2 = path.resolve(__dirname, '../expected/.toto.yml');
                    expect(fs.existsSync(f1)).toBe(true);
                    expect(fs.existsSync(f2)).toBe(true);

                    done();
                }, 2000);
            });

            it('should have created files described in templates.yml', function (done) {
                file = path.join(cwd, 'tests/fixtures/templates.yml');
                helper.build(file, {
                    content: {
                        txt: 'txt',
                        yml: 'yml'
                    }
                });
                setTimeout(function () {
                    var f1 = path.resolve(__dirname, '../expected/toto.txt'),
                        f2 = path.resolve(__dirname, '../expected/.toto.yml');
                    expect(fs.existsSync(f1)).toBe(true);
                    expect(fs.existsSync(f2)).toBe(true);
                    // content txt
                    res = fs.readFileSync(path.resolve(__dirname, '../templates/toto.txt'), {
                        encoding: 'utf8'
                    });
                    expect(fs.readFileSync(f1, {
                        encoding: 'utf8'
                    })).toEqual(res);
                    res = fs.readFileSync(path.resolve(__dirname, '../templates/.toto.yml'), {
                        encoding: 'utf8'
                    });
                    expect(fs.readFileSync(f2, {
                        encoding: 'utf8'
                    })).toEqual(res);
                    done();
                }, 2000);
            });

        });

        it('should have created folders described in bones.yml', function (done) {
            helper = new AppBones('../templates', '../expected');
            file = path.join(cwd, 'tests/fixtures/bones.yml');
            helper.build(file, {
                content: {
                    txt: 'txt',
                    yml: 'yml'
                }
            });
            setTimeout(function () {
                var f1 = path.resolve(__dirname, '../expected/toto.txt'),
                    f2 = path.resolve(__dirname, '../expected/.toto.yml'),
                    f3 = path.resolve(__dirname, '../expected/html'),
                    f5 = path.resolve(__dirname, '../expected/html/css'),
                    f4 = path.resolve(__dirname, '../expected/html/js'),
                    f6 = path.resolve(__dirname, '../expected/html/js/toto.txt'),
                    f7 = path.resolve(__dirname, '../expected/html/js/.toto.yml'),
                    f8 = path.resolve(__dirname, '../expected/html/css/toto_underscored.txt'),
                    f9 = path.resolve(__dirname, '../expected/html/css/toto_underscored.yml'),
                    f10 = path.resolve(__dirname, '../expected/html/css/empty_file.txt');

                expect(fs.existsSync(f10)).toBe(true);
                expect(fs.existsSync(f9)).toBe(true);
                expect(fs.existsSync(f8)).toBe(true);
                expect(fs.existsSync(f7)).toBe(true);
                expect(fs.existsSync(f6)).toBe(true);
                expect(fs.existsSync(f5)).toBe(true);
                expect(fs.existsSync(f4)).toBe(true);
                expect(fs.existsSync(f3)).toBe(true);
                expect(fs.existsSync(f2)).toBe(true);
                expect(fs.existsSync(f1)).toBe(true);

                done();
            }, 2000);

        });

        afterEach(function () {
            res = null;
            file = null;
        });

    });

}());
