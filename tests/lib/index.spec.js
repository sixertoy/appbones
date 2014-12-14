/*jshint unused: false */
/*jslint indent: 4 */
/*global jasmine, process, require, define, describe, it, xit, expect, beforeEach, afterEach, afterLast, Class, __dirname */
(function () {

    'use strict';

    var file, res,
        cwd = process.cwd(),
        path = require('path'),
        fs = require('fs-extra'),
        appbones = require(path.join(cwd, 'lib/index'));

    describe('appbones :: ', function () {

        beforeEach(function () {});

        it('should return false', function () {
            file = path.join(cwd, 'tests/fixtures/toto.yml');
            expect(appbones(file)).toBe(false);
        });

        it('should return true', function () {
            file = path.join(cwd, 'tests/fixtures/root.yml');
            expect(appbones(file)).toBe(true);
        });

        it('should be equal to a relative path', function () {
            res = path.resolve(__dirname, '../templates');
            expect(appbones.sourcePath('../templates')).toEqual(res);
        });

        it('should be equal from an absolute path', function () {
            res = path.resolve(__dirname, '../expected');
            var abs = path.join(process.cwd(), 'tests/expected');
            expect(appbones.destinationPath(abs)).toEqual(res);
        });

        it('should have created files described in files.yml', function (done) {
            appbones.sourcePath('../templates');
            appbones.destinationPath('../expected');
            appbones('../fixtures/files.yml');
            setTimeout(function () {
                var f1 = path.resolve(__dirname, '../expected/toto.txt'),
                    f2 = path.resolve(__dirname, '../expected/.toto.yml');
                expect(fs.existsSync(f1)).toBe(true);
                expect(fs.existsSync(f2)).toBe(true);
                // remove
                fs.removeSync(f1);
                fs.removeSync(f2);
                done();
            }, 2000);
        });

        it('should have created files described in templates.yml', function (done) {
            appbones.sourcePath('../templates');
            appbones.destinationPath('../expected');
            appbones('../fixtures/templates.yml', {
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
                // remove
                fs.removeSync(f1);
                fs.removeSync(f2);
                done();
            }, 2000);
        });

        it('should have created folders described in folders.yml', function (done) {
            appbones.sourcePath('../templates');
            appbones.destinationPath('../expected');
            appbones('../fixtures/folders.yml');
            setTimeout(function () {
                var f1 = path.resolve(__dirname, '../expected/html'),
                    f2 = path.resolve(__dirname, '../expected/html/js'),
                    f3 = path.resolve(__dirname, '../expected/html/css');
                expect(fs.existsSync(f1)).toBe(true);
                expect(fs.existsSync(f2)).toBe(true);
                expect(fs.existsSync(f3)).toBe(true);
                fs.removeSync(f1);
                fs.removeSync(f2);
                fs.removeSync(f3);
                done();
            }, 2000);
        });

        it('should have created folders described in bones.yml', function (done) {
            appbones.sourcePath('../templates');
            appbones.destinationPath('../expected');
            appbones('../fixtures/bones.yml', {
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
                    f7 = path.resolve(__dirname, '../expected/html/js/.toto.yml');

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
