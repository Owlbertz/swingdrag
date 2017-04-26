/**
 * The options for the jQuery UI swingdrag plugin.
 * 
 * @export
 * @class SwingDragOptions
 */
export class SwingDragOptions {

    /**
     * The angle of rotation in degree.
     * Default: 3
     * @type {number}
     * @memberOf SwingDragOptions
     */
    public rotationAngleDeg: number;


    /**
     * Indicates whether a pickup-/drop shadow should be shown.
     * Default: true
     * @type {boolean}
     * @memberOf SwingDragOptions
     */
    public showShadow: boolean;


    /**
     * The pick up scale factor indicates the size change during dragging.
     * Default: 1.1
     * @type {number}
     * @memberOf SwingDragOptions
     */
    public pickUpScaleFactor: number;


    /**
     * Distance in pixels after mousedown the mouse must move before dragging should start.
     * 
     * @type {number}
     * @memberOf SwingDragOptions
     */
    public dragThreshold: number;


    /**
     * Creates an instance of SwingDragOptions.
     * 
     * @memberOf SwingDragOptions
     */
    public constructor() {
        this.rotationAngleDeg = 8;
        this.showShadow = true;
        this.pickUpScaleFactor = 1.1;
        this.dragThreshold = 5;
    }

}