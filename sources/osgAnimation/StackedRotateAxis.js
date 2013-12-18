/*global define */

define( [
    'osg/Utils',
    'osg/Object',
    'osg/Matrix',
    'osgAnimation/Vec3Target',
    'osgAnimation/FloatTarget',
    'osg/Vec3',
    'osg/Quat'
], function ( MACROUTILS, Object, Matrix, Vec3Target, FloatTarget, Vec3, Quat ) {

    /** -*- compile-command: "jslint-cli StackedTransformElement.js" -*-
     *
     *  Copyright (C) 2010-2011 Cedric Pinson
     *
     *                  GNU LESSER GENERAL PUBLIC LICENSE
     *                      Version 3, 29 June 2007
     *
     * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
     * Everyone is permitted to copy and distribute verbatim copies
     * of this license document, but changing it is not allowed.
     *
     * This version of the GNU Lesser General Public License incorporates
     * the terms and conditions of version 3 of the GNU General Public
     * License
     *
     * Authors:
     *  Cedric Pinson <cedric.pinson@plopbyte.com>
     *
     */

    /** 
     *  StackedRotateAxis
     *  @class StackedRotateAxis
     */
    var StackedRotateAxis = function ( name, axis, angle ) {
        Object.call( this );
        if ( !axis ) {
            axis = [ 1, 0, 0 ];
        }
        if ( !angle ) {
            angle = 0;
        }
        this._axis = axis;
        this._angle = angle;
        this._target = undefined;
        this.setName( name );

        this._matrixTmp = [];
        Matrix.makeIdentity( this._matrixTmp );
        this._quatTmp = [];
        Quat.makeIdentity( this._quatTmp );
    };

    /** @lends StackedRotateAxis.prototype */
    StackedRotateAxis.prototype = MACROUTILS.objectInehrit( Object.prototype, {
        setAxis: function ( axis ) {
            Vec3.copy( axis, this._axis );
        },
        setAngle: function ( angle ) {
            this._angle = angle;
        },
        setTarget: function ( target ) {
            this._target = target;
        },
        getTarget: function () {
            return this._target;
        },
        update: function () {
            if ( this._target !== undefined ) {
                this._angle = this._target.getValue();
            }
        },
        getOrCreateTarget: function () {
            if ( !this._target ) {
                this._target = new FloatTarget( this._angle );
            }
            return this._target;
        },
        applyToMatrix: function ( m ) {
            var axis = this._axis;
            var qtmp = this._quatTmp;
            var mtmp = this._matrixTmp;

            Quat.makeRotate( this._angle, axis[ 0 ], axis[ 1 ], axis[ 2 ], qtmp );
            Matrix.setRotateFromQuat( mtmp, qtmp );
            Matrix.preMult( m, mtmp );
        }

    } );

    return StackedRotateAxis;
} );