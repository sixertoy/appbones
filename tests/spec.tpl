/*jshint unused: false */
/*jslint indent: 4 */
/*global jasmine, process, require, define, describe, it, xit, expect, beforeEach, afterEach, afterLast, Class */
(function () {

    'use strict';

    var result, helper,
        cwd = process.cwd(),
        Helper = require();

    describe('And helper', function () {

        beforeEach(function(){
            helper = new Helper();
        });

        if('should throw', function(){
            expect(function(){
                result = helper.render();
            }).toThrow();
        });

        afterEach(function(){
            helper = null;
        });

    });

}());
