/**
 *
 *
 *
 *
 * @see https://raw.githubusercontent.com/SBoudrias/class-extend/master/index.js
 *
 */
/*jslint sloppy: true, vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global module, require*/
(function () {

    var Util = require('util'),
        lodash = require('lodash'),
        EventEmitter = require('events').EventEmitter;

    /**
     * ****************************
     * Exposed
     * ****************************
     * Lodash as _
     * @see https://lodash.com
     *
     * ****************************
     * Inherits
     * ****************************
     * EventEmitter
     * @see http://nodejs.org/api/events.html#events_class_events_eventemitter
     *
     */
    var Base = function () {
        // Heritage de l'EventEmitter
        EventEmitter.call(this);
    };

    /**
     *
     * Extend subclass w/ superclass
     * @params protoProps
     * @params staticProps
     * @return Subclass
     *
     */
    function __extend(protoProps, staticProps) {
        var child,
            parent = this;
        // build constructor
        if (protoProps && lodash.has(protoProps, 'constructor')) {
            // si le constructeur est present dans les params
            child = protoProps.constructor;
        } else {
            // Appelle le constructor parent
            child = function () {
                return parent.apply(this, arguments);
            };
        }
        // parent inheritance
        lodash.extend(child, parent, staticProps);

        child.prototype = Object.create(parent.prototype, {
            constructor: {
                value: child,
                writable: true,
                enumerable: false,
                configurable: true
            }
        });

        if (protoProps) {
            lodash.extend(child.prototype, protoProps);
        }

        child.prototype.__super__ = parent.prototype;
        return child;
    }

    Util.inherits(Base, EventEmitter);
    Base.extend = __extend;
    Base.prototype._ = lodash;

    module.exports = Base;

}());
