/**
 * Ruler component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable
declare let cy: any;
export class RulerHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }
    
    public getElement() {
        return this.selector('#' + this.id);
    }
    public getRulerElement(diagramId: string, isVertical: boolean) {
        return isVertical ? this.selector('#' + diagramId + '_vRuler') : this.selector('#' + diagramId + '_hRuler');
    }
    public getMarkerElement(diagramId: string, isVertical: boolean) {
        return isVertical ? this.selector('#' + diagramId + '_vRuler_marker') : this.selector('#' + diagramId + '_hRuler_marker');
    }
}