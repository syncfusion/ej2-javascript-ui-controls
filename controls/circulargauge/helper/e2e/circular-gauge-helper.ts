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
    // Get the gauge container element id.
    getGaugeContainer() {
        return this.selector('#' + this.id);
    }
    // Get the gauge title group.
    getTitlegroupElement() {
        return this.selector('#' + this.id + '_CircularGaugeTitle');
    }
    // Get the gauge axes collecton group.
    getAxesCollectionElement() {
        return this.selector('#' + this.id + '_AxesCollection');
    }
    // Get the gauge axes group element.
    gethAxisGroupElement() {
        return this.selector('#' + this.id + '_Axis_Group_0');
    }
    // Get the gauge axes label element.
    getAxisLabelElement() {
        return this.selector('#' + this.id + '_Axis_Labels_0');
    }
    // Get the gauge axes pointer element.
    getAxisPointerElement() {
        return this.selector('#' + this.id + '_Axis_Pointers_0');
    }
    // Get the gauge axes range element.
    getAxisRangesElement() {
        return this.selector('#' + this.id + '_Axis_Ranges_0');
    }
    // Get the gauge axes major tick line element.
    getMajorLineElement() {
        return this.selector('#' + this.id + '_Axis_MajorTickLines_0');
    }
    // Get the gauge axes annotation element.
    getAnnotationElement() {
        return this.selector('#' + this.id + '_Annotations_0');
    }
    // Get the gauge axes minor tick line element.
    getMinorTickElement() {
        return this.selector('#' + this.id + '_Axis_MinorTickLines_0');
    }
    // Get the gauge secondary element.
    getSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    // Get the gauge axes pointer ranges element.
    getRangeBarElement() {
        return this.selector('#' + this.id + '_Axis_0_Pointer_RangeBar_0');
    }
    // Get the gauge axes pointer needle element.
    getNeedleElement() {
        return this.selector('#' + this.id + '_Axis_0_Pointer_NeedleRect_0');
    }
    
}
