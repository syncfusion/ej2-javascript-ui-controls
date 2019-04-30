import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class RangeNavigatorHelper extends TestHelper {
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
    getRangeNavigatorContainer() {
        return this.selector('#' + this.id);
    }
    getRangeSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    getRangeLeftTooltip() {
        return this.selector('#' + this.id + '_leftTooltip');
    }
    getRangeRightTooltip() {
        return this.selector('#' + this.id + '_rightTooltip');
    }
    getRangeSvgElement() {
        return this.selector('#' + this.id + '_svg');
    }
    getRangeChartBorder() {
        return this.selector('#' + this.id + '_ChartBorder');
    }
    getRangeGridLines() {
        return this.selector('#' + this.id + '_GridLines');
    }
    getRangeAxisLabels() {
        return this.selector('#' + this.id + '_AxisLabels');
    }
    getRangeChart() {
        return this.selector('#' + this.id + '_chart');
    }
    getRangeChartSeriesBorder() {
        return this.selector('#' + this.id + '_SeriesBorder');
    }
    getRangeSliders() {
        return this.selector('#' + this.id + '_sliders');
    }
    getRangeLeftUnselectedArea() {
        return this.selector('#' + this.id + '_leftUnSelectedArea');
    }
    getRangeRightUnselectedArea() {
        return this.selector('#' + this.id + '_rightUnSelectedArea');
    }
    getRangeSelectedArea() {
        return this.selector('#' + this.id + '_SelectedArea');
    }
    getRangeLeftSlider() {
        return this.selector('#' + this.id + '_LeftSlider');
    }
    getRangeRightSlider() {
        return this.selector('#' + this.id + '_RightSlider');
    }
}
