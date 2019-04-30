import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class StockChartHelper extends TestHelper {
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
    getStockContainer() {
        return this.selector('#' + this.id);
    }
    getStockBorder() {
        return this.selector('#' + this.id + '_stock_border');
    }
    getStockSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    getStockTitle() {
        return this.selector('#' + this.id + '_stockChart_Title');
    }
    getStockRangeLeftTooltip() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_leftTooltip');
    }
    getStockRangeRightTooltip() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_rightTooltip');
    }
    getStockToolbar() {
        return this.selector('#' + this.id + '_Secondary_Element_Secondary_Element');
    }
    getStockTooltip() {
        return this.selector('#' + this.id + '_stockChart_chart_tooltip');
    }
    getStockSvgElement() {
        return this.selector('#' + this.id + '_stockChart_svg');
    }
    getStockChartElement() {
        return this.selector('#' + this.id + '_stockChart_chart');
    }
    getStockChartBorder() {
        return this.selector('#' + this.id + '_stockChart_chart_ChartBorder');
    }
    getStockChartAxisInsideCollection() {
        return this.selector('#' + this.id + '_stockChart_chartAxisInsideCollection');
    }
    getStockChartAxisOutsideCollection() {
        return this.selector('#' + this.id + '_stockChart_chartAxisOutsideCollection');
    }
    getStockChartSeriesCollection() {
        return this.selector('#' + this.id + '_stockChart_chart');
    }
    getStockChartUserInteraction() {
        return this.selector('#' + this.id + '_stockChart_chart_UserInteraction');
    }
    getStockRangeElement() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector');
    }
    getStockRangeBorder() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_ChartBorder');
    }
    getStockRangeGridLines() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_GridLines');
    }
    getStockRangeAxisLabels() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_AxisLabels');
    }
    getStockRangeChart() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_chart');
    }
    getStockRangeSliders() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_sliders');
    }
    getStockRangeLeftUnselectedArea() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_leftUnSelectedArea');
    }
    getStockRangeRightUnselectedArea() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_rightUnSelectedArea');
    }
    getStockRangeSelectedArea() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_SelectedArea');
    }
    getStockRangeLeftSlider() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_LeftSlider');
    }
    getStockRangeRightSlider() {
        return this.selector('#' + this.id + '_stockChart_rangeSelector_RightSlider');
    }
}
