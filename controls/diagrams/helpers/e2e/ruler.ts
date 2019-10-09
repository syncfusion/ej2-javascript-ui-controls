/**
 * Ruler component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable
declare let cy: any;

/**
 * Represents the Ruler helpers.
 */
export class RulerHelper extends TestHelper {
    /**
     * Specifies the ID of the ruler.
     */
    public id: string;
    /**
     * Specifies the current helper function of the ruler.
     */
    public wrapperFn: Function;
    /**
     * Constructor for creating the helper object for ruler component.
     */
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }

    /**
     * Gets the root element of the ruler component.
     */
    public getElement() {
        return this.selector('#' + this.id);
    }

    /**
     * Returns ruler element of the ruler component. It may be either horizontal or vertical.
     * @param ID Defines the ID of the ruler component.
     * @param isVertical Specifies whether ruler required element is vertical ruler element or not.
     */
    public getRulerElement(id: string, isVertical: boolean) {
        return isVertical ? this.selector('#' + id + '_vRuler') : this.selector('#' + id + '_hRuler');
    }

    /**
     * Returns the marker element of the ruler component. It may be either horizontal or vertical.
     * @param ID Defines the ID of the ruler component.
     * @param isVertical Specifies whether ruler required element is vertical ruler element or not.
     */
    public getMarkerElement(id: string, isVertical: boolean) {
        return isVertical ? this.selector('#' + id + '_vRuler_marker') : this.selector('#' + id + '_hRuler_marker');
    }
}