/// <reference path="../node_modules/@types/jqueryui/index.d.ts" />

import * as jQuery from 'jquery';
import { SwingDragOptions } from './swingDragOptions';
import { Directions } from './directions';
import { CSSConstants } from './cssConstants';


/**
 * The main jQuery PlugIn implementation of swingdrag.
 * 
 * @export
 * @class SwingDragPlugIn
 */
export class SwingDragPlugIn {

    private plugInName: string = 'ui.swingdrag';
    private options: any;
    private swingDragOptions: SwingDragOptions;
    private element: HTMLElement;


    /**
     * Creates an instance of SwingDragPlugIn.
     * @param {SwingDragOptions} [swingDragOptions] 
     * 
     * @memberOf SwingDragPlugIn
     */
    public constructor(swingDragOptions?: SwingDragOptions) {
        this.swingDragOptions = swingDragOptions;

        if (!this.swingDragOptions) {
            this.swingDragOptions = new SwingDragOptions();
        }
    }


    /**
     * Destroys the plugin instance.
     * 
     * 
     * @memberOf SwingDragPlugIn
     */
    public destroy() {
        if (!$ || !$.Widget) {
            return;
        }

        $.Widget.prototype.destroy.call(this);

        if (!this.element) {
            return;
        }

        let elementRef = $(this.element);
        elementRef.draggable('destroy');

        this.disableSwing(elementRef);
        this.disableSwingDragShadow(elementRef);

        $(this.element).css({
            "transform": "",
        });
    }


    /**
     * Registers this instance as a jQuery UI plugin.
     * 
     * @memberOf SwingDragPlugIn
     */
    public register(): void {
        $.widget(this.plugInName, this);
    }


    /**
     * Adds CSS styles, so that the swingdrag effect is visible.
     * 
     * @private
     * @param {JQuery} elementRef 
     * 
     * @memberOf SwingDragPlugIn
     */
    private enableSwing(elementRef: JQuery) {
        elementRef.css(CSSConstants.css_swingdrag_transition, CSSConstants.css_swingdrag_transition_value);
        elementRef.css(CSSConstants.css_swingdrag_boxShadow, CSSConstants.css_swingdrag_boxShadow_value);
    }


    /**
     * Removes CSS styles, so that the swingdrag effect is not visible.
     * 
     * @private
     * @param {JQuery} elementRef 
     * 
     * @memberOf SwingDragPlugIn
     */
    private disableSwing(elementRef: JQuery) {
        elementRef.css(CSSConstants.css_swingdrag_transition, CSSConstants.css_swingdrag_transition_value_clear);
    }


    /**
     * Adds CSS styles, so that the swingdrag shadow is visible.
     * 
     * @private
     * @param {JQuery} elementRef 
     * 
     * @memberOf SwingDragPlugIn
     */
    private enableSwingDragShadow(elementRef: JQuery) {
        elementRef.css(CSSConstants.css_swingdragShadow, CSSConstants.css_swingdragShadow_value);
    }


    /**
     * Removes CSS styles, so that the swingdrag shadow is not visible.
     * 
     * @private
     * @param {JQuery} elementRef 
     * 
     * @memberOf SwingDragPlugIn
     */
    private disableSwingDragShadow(elementRef: JQuery) {
        elementRef.css(CSSConstants.css_swingdragShadow, CSSConstants.css_swingdragShadow_value_clear);
    }


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
    private updateElementTransform(elementRef: JQuery, rotationAngleDeg: number, scaleFactor: number) {
        elementRef.css({
            "transform": 'rotate(' + (rotationAngleDeg) + 'deg) scale(' + scaleFactor + ')'
        });
    }


    /**
     * Creates the plugin.
     * 
     * @private
     * 
     * @memberOf SwingDragPlugIn
     */
    private _create() {

        let elementRef = $(this.element);

        this.initOptions();

        // enable swing effect
        this.enableSwing(elementRef);

        // the main implementation logic
        let direction: Directions = Directions.undefined;
        let oldDirection: Directions = Directions.undefined;
        let dragging = false;
        let calculatedAngle: number;
        let oldXPos: number;
        let oldYPos: number;


        // Drag start handler
        let onDragStartHandler = (e: JQueryEventObject, ui: JQueryUI.DraggableEventUIParams) => {
            console.log("onDragStartHandler");

            dragging = true;

            if (this.swingDragOptions.showShadow) {
                this.enableSwingDragShadow(elementRef);
            }

            calculatedAngle = Math.abs(this.swingDragOptions.rotationAngleDeg);
        };


        // Drag handler
        let onDragHandler = (e: JQueryEventObject, ui: JQueryUI.DraggableEventUIParams) => {

            direction = this.getDirection(ui.position.left, oldXPos);

            if (direction === Directions.left && calculatedAngle > 0) {
                calculatedAngle = calculatedAngle * -1;
            } else if (direction === Directions.right && calculatedAngle < 0) {
                calculatedAngle = calculatedAngle * -1;
            }

            this.updateElementTransform(elementRef, calculatedAngle, this.swingDragOptions.pickUpScaleFactor);

            oldDirection = direction;
            oldXPos = ui.position.left;
            oldYPos = ui.position.top;

            // Check if the element is not being dragged anymore 
            // and could therefore being set to back to zero rotation.
            setTimeout(() => {
                if (oldXPos === ui.position.left && oldYPos === ui.position.top) {
                    let tempScaleFactor = 1;
                    if (dragging) {
                        tempScaleFactor = this.swingDragOptions.pickUpScaleFactor;
                    }
                    this.updateElementTransform(elementRef, 0, tempScaleFactor);
                }
            }, 50);
        };


        // Drag stop handler
        let onDragStopHandler = (e: JQueryEventObject, ui: JQueryUI.DraggableEventUIParams) => {
            this.disableSwingDragShadow(elementRef);
            this.updateElementTransform(elementRef, 0, 1);
            oldDirection = Directions.undefined;
            dragging = false;
        };

        let draggableOptions: JQueryUI.DraggableOptions;

        // Check whether the target element already have a draggable instance defined.
        let draggableInstance: any = elementRef.draggable('instance');
        if (draggableInstance && draggableInstance.options) {
            // An instance was found, therefore also use this instance.

            let startHandler = (e: JQueryEventObject, ui: JQueryUI.DraggableEventUIParams) => {
                onDragStartHandler(e, ui);
                draggableInstance.options.start(e, ui);
            };

            let dragHandler = (e: JQueryEventObject, ui: JQueryUI.DraggableEventUIParams) => {
                onDragHandler(e, ui);
                //draggableInstance.options.drag(e, ui);
            };

            let stopHandler = (e: JQueryEventObject, ui: JQueryUI.DraggableEventUIParams) => {
                onDragStopHandler(e, ui);
                //draggableInstance.options.stop(e, ui);
            };

            draggableOptions = {
                start: startHandler,
                drag: dragHandler,
                stop: stopHandler,
                distance: this.swingDragOptions.dragThreshold
            }

        } else {
            // No instance was found, therefore create a new draggable instance.
            draggableOptions = {
                start: onDragStartHandler,
                drag: onDragHandler,
                stop: onDragStopHandler,
                distance: this.swingDragOptions.dragThreshold
            };
        }

        elementRef.draggable(draggableOptions);
    }


    /**
     * Calculates the dragging direction.
     * 
     * @param {number} actualX 
     * @param {number} oldX 
     * @returns {Directions} 
     * 
     * @memberOf SwingDragPlugIn
     */
    public getDirection(actualX: number, oldX: number): Directions {

        let diffX = actualX - oldX;
        if (actualX < oldX) {
            return Directions.left;
        } else if (actualX > oldX) {
            return Directions.right;
        } else {
            return Directions.undefined;
        }
    }


    /**
     * Creates the swingdrag options instance 
     * and synchronizes the jQuery UI options with the swingdrag options values.
     * 
     * @private
     * 
     * @memberOf SwingDragPlugIn
     */
    private initOptions() {
        this.swingDragOptions = new SwingDragOptions();

        if (this.options.rotationAngleDeg || this.options.rotationAngleDeg === 0) {
            this.swingDragOptions.rotationAngleDeg = this.options.rotationAngleDeg;
        }

        if (this.options.showShadow !== undefined) {
            this.swingDragOptions.showShadow = this.options.showShadow;
        }

        if (this.options.pickUpScaleFactor || this.options.pickUpScaleFactor === 0) {
            this.swingDragOptions.pickUpScaleFactor = this.options.pickUpScaleFactor;
        }
    }


    /**
     * Sets an option.
     * 
     * @private
     * @param {*} option 
     * @param {*} value 
     * 
     * @memberOf SwingDragPlugIn
     */
    private _setOption(option: any, value: any) {
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
    }

}