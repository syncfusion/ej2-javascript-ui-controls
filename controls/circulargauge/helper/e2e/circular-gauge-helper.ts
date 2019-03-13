import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class CircularGaugeHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }
    getGaugeContainer() {
        return this.selector('#' + this.id);
    }
    getTitlegroupElement() {
        return this.selector('#' + this.id + '_CircularGaugeTitle');
    }
    getAxesCollectionElement() {
        return this.selector('#' + this.id + '_AxesCollection');
    }
    gethAxisGroupElement() {
        return this.selector('#' + this.id + '_Axis_Group_0');
    }
    getAxisLabelElement() {
        return this.selector('#' + this.id + '_Axis_Labels_0');
    }
    getAxisPointerElement() {
        return this.selector('#' + this.id + '_Axis_Pointers_0');
    }
    getAxisRangesElement() {
        return this.selector('#' + this.id + '_Axis_Ranges_0');
    }
    getMajorLineElement() {
        return this.selector('#' + this.id + '_Axis_MajorTickLines_0');
    }
    getAnnotationElement() {
        return this.selector('#' + this.id + '_Annotations_0');
    }
    getMinorTickElement() {
        return this.selector('#' + this.id + '_Axis_MinorTickLines_0');
    }
    getSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    getRangeBarElement() {
        return this.selector('#' + this.id + '_Axis_0_Pointer_RangeBar_0');
    }
    getNeedleElement() {
        return this.selector('#' + this.id + '_Axis_0_Pointer_NeedleRect_0');
    }
    
}
