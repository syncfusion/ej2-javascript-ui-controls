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
    getGaugeContainer() {
        return this.selector('#' + this.id);
    }
    getTitlegroupElement() {
        return this.selector('#' + this.id + '_LinearGaugeTitle');
    }
    getRangesGroupElement() {
        return this.selector('#' + this.id + '_RangesGroup');
    }
    getAxisCollectionsElement() {
        return this.selector('#' + this.id + '_Axis_Collections');
    }
    getAnnotationElement() {
        return this.selector('#' + this.id + '_AnnotationsGroup');
    }
    getAxisGroupElement() {
        return this.selector('#' + this.id + '_Axis_Group_0');
    }
    getMinorTicksLineElement() {
        return this.selector('#' + this.id + '_MinorTicksLine_0');
    }
    getMajorTicksLineElement() {
        return this.selector('#' + this.id + '_MajorTicksLine_0');
    }
    getSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    getRangeBarElement() {
        return this.selector('#' + this.id + '_LinearGauge_Tooltip');
    }
    
}
