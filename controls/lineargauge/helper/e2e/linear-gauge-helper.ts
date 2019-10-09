import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class LinearGaugeHelper extends TestHelper {
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
    // Get the gauge container element.
    getGaugeContainer() {
        return this.selector('#' + this.id);
    }
    // Get the gauge title element.
    getTitlegroupElement() {
        return this.selector('#' + this.id + '_LinearGaugeTitle');
    }
    // Get the gauge range group element.
    getRangesGroupElement() {
        return this.selector('#' + this.id + '_RangesGroup');
    }
    // Get the gauge axes collection element.
    getAxisCollectionsElement() {
        return this.selector('#' + this.id + '_Axis_Collections');
    }
    // Get the gauge annotation element.
    getAnnotationElement() {
        return this.selector('#' + this.id + '_AnnotationsGroup');
    }
    // Get the gauge axes group element.
    getAxisGroupElement() {
        return this.selector('#' + this.id + '_Axis_Group_0');
    }
    // Get the gauge minor tick line element.
    getMinorTicksLineElement() {
        return this.selector('#' + this.id + '_MinorTicksLine_0');
    }
    // Get the gauge major tick line element.
    getMajorTicksLineElement() {
        return this.selector('#' + this.id + '_MajorTicksLine_0');
    }
    // Get the gauge secondary element.
    getSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    // Get the gauge tooltip element.
    getTooltipElement() {
        return this.selector('#' + this.id + '_LinearGauge_Tooltip');
    }
    
}
