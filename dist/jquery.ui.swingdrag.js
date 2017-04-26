/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var swingDragPlugIn_1 = __webpack_require__(1);
	// Create and register the PlugIn
	var swingDragPlugIn = new swingDragPlugIn_1.SwingDragPlugIn();
	swingDragPlugIn.register();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/// <reference path="../node_modules/@types/jqueryui/index.d.ts" />
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var swingDragOptions_1 = __webpack_require__(2);
	var cssConstants_1 = __webpack_require__(3);
	var draggableOptionsWrapper_1 = __webpack_require__(4);
	/**
	 * The main jQuery PlugIn implementation of swingdrag.
	 *
	 * @export
	 * @class SwingDragPlugIn
	 */
	var SwingDragPlugIn = (function () {
	    /**
	     * Creates an instance of SwingDragPlugIn.
	     * @param {SwingDragOptions} [swingDragOptions]
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    function SwingDragPlugIn(swingDragOptions) {
	        this.plugInName = 'ui.swingdrag';
	        this.swingDragOptions = swingDragOptions;
	        if (!this.swingDragOptions) {
	            this.swingDragOptions = new swingDragOptions_1.SwingDragOptions();
	        }
	    }
	    /**
	     * Destroys the plugin instance.
	     *
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.destroy = function () {
	        if (!$ || !$.Widget) {
	            return;
	        }
	        $.Widget.prototype.destroy.call(this);
	        if (!this.element) {
	            return;
	        }
	        var elementRef = $(this.element);
	        elementRef.draggable('destroy');
	        this.disableSwing(elementRef);
	        this.disableSwingDragShadow(elementRef);
	        $(this.element).css({
	            "transform": "",
	        });
	    };
	    /**
	     * Registers this instance as a jQuery UI plugin.
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.register = function () {
	        $.widget(this.plugInName, this);
	    };
	    /**
	     * Adds CSS styles, so that the swingdrag effect is visible.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.enableSwing = function (elementRef) {
	        elementRef.css(cssConstants_1.CSSConstants.css_swingdrag_transition, cssConstants_1.CSSConstants.css_swingdrag_transition_value);
	        elementRef.css(cssConstants_1.CSSConstants.css_swingdrag_boxShadow, cssConstants_1.CSSConstants.css_swingdrag_boxShadow_value);
	    };
	    /**
	     * Removes CSS styles, so that the swingdrag effect is not visible.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.disableSwing = function (elementRef) {
	        elementRef.css(cssConstants_1.CSSConstants.css_swingdrag_transition, cssConstants_1.CSSConstants.css_swingdrag_transition_value_clear);
	    };
	    /**
	     * Adds CSS styles, so that the swingdrag shadow is visible.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.enableSwingDragShadow = function (elementRef) {
	        elementRef.css(cssConstants_1.CSSConstants.css_swingdragShadow, cssConstants_1.CSSConstants.css_swingdragShadow_value);
	    };
	    /**
	     * Removes CSS styles, so that the swingdrag shadow is not visible.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.disableSwingDragShadow = function (elementRef) {
	        elementRef.css(cssConstants_1.CSSConstants.css_swingdragShadow, cssConstants_1.CSSConstants.css_swingdragShadow_value_clear);
	    };
	    /**
	     * Updates CSS styles.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     * @param {number} rotationAngleDeg
	     * @param {number} scaleFactor
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.updateElementTransform = function (elementRef, rotationAngleDeg, scaleFactor) {
	        elementRef.css({
	            "transform": 'rotate(' + (rotationAngleDeg) + 'deg) scale(' + scaleFactor + ')'
	        });
	    };
	    /**
	     * Creates the plugin.
	     *
	     * @private
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype._create = function () {
	        var _this = this;
	        var elementRef = $(this.element);
	        this.initOptions();
	        // enable swing effect
	        this.enableSwing(elementRef);
	        // the main implementation logic
	        var direction = 0 /* undefined */;
	        var oldDirection = 0 /* undefined */;
	        var dragging = false;
	        var calculatedAngle;
	        var oldXPos;
	        var oldYPos;
	        // Drag start handler
	        var onDragStartHandler = function (e, ui) {
	            console.log("onDragStartHandler");
	            dragging = true;
	            if (_this.swingDragOptions.showShadow) {
	                _this.enableSwingDragShadow(elementRef);
	            }
	            calculatedAngle = Math.abs(_this.swingDragOptions.rotationAngleDeg);
	        };
	        // Drag handler
	        var onDragHandler = function (e, ui) {
	            direction = _this.getDirection(ui.position.left, oldXPos);
	            if (direction === 1 /* left */ && calculatedAngle > 0) {
	                calculatedAngle = calculatedAngle * -1;
	            }
	            else if (direction === 2 /* right */ && calculatedAngle < 0) {
	                calculatedAngle = calculatedAngle * -1;
	            }
	            _this.updateElementTransform(elementRef, calculatedAngle, _this.swingDragOptions.pickUpScaleFactor);
	            oldDirection = direction;
	            oldXPos = ui.position.left;
	            oldYPos = ui.position.top;
	            // Check if the element is not being dragged anymore 
	            // and could therefore being set to back to zero rotation.
	            setTimeout(function () {
	                if (oldXPos === ui.position.left && oldYPos === ui.position.top) {
	                    var tempScaleFactor = 1;
	                    if (dragging) {
	                        tempScaleFactor = _this.swingDragOptions.pickUpScaleFactor;
	                    }
	                    _this.updateElementTransform(elementRef, 0, tempScaleFactor);
	                }
	            }, 100);
	        };
	        // Drag stop handler
	        var onDragStopHandler = function (e, ui) {
	            _this.disableSwingDragShadow(elementRef);
	            _this.updateElementTransform(elementRef, 0, 1);
	            oldDirection = 0 /* undefined */;
	            dragging = false;
	        };
	        var draggableOptions;
	        // Check whether the target element already have a draggable instance defined.
	        var draggableInstance = elementRef.draggable('instance');
	        if (draggableInstance && draggableInstance.options) {
	            // An instance was found, therefore use this instance.
	            draggableOptions = new draggableOptionsWrapper_1.DraggableOptionsWrapper(draggableInstance.options);
	        }
	        else {
	            // No instance was found, therefore create a new draggable instance.
	            draggableOptions = {
	                start: onDragStartHandler,
	                drag: onDragHandler,
	                stop: onDragStopHandler
	            };
	        }
	        elementRef.draggable(draggableOptions);
	    };
	    /**
	     * Calculates the dragging direction.
	     *
	     * @param {number} actualX
	     * @param {number} oldX
	     * @returns {Directions}
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.getDirection = function (actualX, oldX) {
	        var diffX = actualX - oldX;
	        if (actualX < oldX) {
	            return 1 /* left */;
	        }
	        else if (actualX > oldX) {
	            return 2 /* right */;
	        }
	        else {
	            return 0 /* undefined */;
	        }
	    };
	    /**
	     * Creates the swingdrag options instance
	     * and synchronizes the jQuery UI options with the swingdrag options values.
	     *
	     * @private
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.initOptions = function () {
	        this.swingDragOptions = new swingDragOptions_1.SwingDragOptions();
	        if (this.options.rotationAngleDeg || this.options.rotationAngleDeg === 0) {
	            this.swingDragOptions.rotationAngleDeg = this.options.rotationAngleDeg;
	        }
	        if (this.options.showShadow !== undefined) {
	            this.swingDragOptions.showShadow = this.options.showShadow;
	        }
	        if (this.options.pickUpScaleFactor || this.options.pickUpScaleFactor === 0) {
	            this.swingDragOptions.pickUpScaleFactor = this.options.pickUpScaleFactor;
	        }
	    };
	    /**
	     * Sets an option.
	     *
	     * @private
	     * @param {*} option
	     * @param {*} value
	     *
	     * @memberOf SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype._setOption = function (option, value) {
	        $.Widget.prototype._setOption.apply(this, arguments);
	        switch (option) {
	            case "rotationAngleDeg":
	                this.swingDragOptions.rotationAngleDeg = value;
	                break;
	            case "showShadow":
	                this.swingDragOptions.showShadow = value;
	                break;
	            case "pickUpScaleFactor":
	                this.swingDragOptions.pickUpScaleFactor = value;
	                break;
	        }
	    };
	    return SwingDragPlugIn;
	}());
	exports.SwingDragPlugIn = SwingDragPlugIn;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * The options for the jQuery UI swingdrag plugin.
	 *
	 * @export
	 * @class SwingDragOptions
	 */
	var SwingDragOptions = (function () {
	    /**
	     * Creates an instance of SwingDragOptions.
	     *
	     * @memberOf SwingDragOptions
	     */
	    function SwingDragOptions() {
	        this.rotationAngleDeg = 8;
	        this.showShadow = true;
	        this.pickUpScaleFactor = 1.1;
	    }
	    return SwingDragOptions;
	}());
	exports.SwingDragOptions = SwingDragOptions;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * CSS constants.
	 *
	 * @export
	 * @class CSSConstants
	 */
	var CSSConstants = (function () {
	    function CSSConstants() {
	    }
	    return CSSConstants;
	}());
	CSSConstants.css_swingdrag_transition = 'transition';
	CSSConstants.css_swingdrag_transition_value = 'transform 1.0s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
	CSSConstants.css_swingdrag_transition_value_clear = 'none';
	CSSConstants.css_swingdrag_boxShadow = 'box-shadow';
	CSSConstants.css_swingdrag_boxShadow_value = 'none';
	CSSConstants.css_swingdragShadow = 'box-shadow';
	CSSConstants.css_swingdragShadow_value = '0 12px 11px #383838';
	CSSConstants.css_swingdragShadow_value_clear = 'none';
	exports.CSSConstants = CSSConstants;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var DraggableOptionsWrapper = (function () {
	    /**
	     * Creates an instance of DraggableOptionsWrapper.
	     * @param {IDraggableOptions} options
	     *
	     * @memberOf DraggableOptionsWrapper
	     */
	    function DraggableOptionsWrapper(wrappedOptions) {
	        this.wrappedOptions = wrappedOptions;
	    }
	    DraggableOptionsWrapper.prototype.start = function (e, ui) {
	        this.wrappedOptions.start(e, ui);
	    };
	    DraggableOptionsWrapper.prototype.drag = function (e, ui) {
	        this.wrappedOptions.drag(e, ui);
	    };
	    DraggableOptionsWrapper.prototype.stop = function (e, ui) {
	        this.wrappedOptions.stop(e, ui);
	    };
	    return DraggableOptionsWrapper;
	}());
	exports.DraggableOptionsWrapper = DraggableOptionsWrapper;


/***/ })
/******/ ]);