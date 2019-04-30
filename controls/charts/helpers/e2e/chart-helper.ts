import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class ChartHelper extends TestHelper {
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
    getChartContainer() {
        return this.selector('#' + this.id);
    }
    getAxisInsideElement() {
        return this.selector('#' + this.id + 'AxisInsideCollection');
    }
    getAxisOutsideElement() {
        return this.selector('#' + this.id + 'AxisOutsideCollection');
    }
    getSeriesElement() {
        return this.selector('#' + this.id + 'SeriesCollection');
    }
    getTooltipElement() {
        return this.selector('#' + this.id + '_tooltip');
    }
    getLegendElement() {
        return this.selector('#' + this.id + '_chart_legend_collections');
    }
    getAnnotationElement() {
        return this.selector('#' + this.id + '_Annotation_Collections');
    }
    getUserInteractionElement() {
        return this.selector('#' + this.id + '_UserInteraction');
    }
    getTrendLineElement() {
        return this.selector('#' + this.id + 'TrendLineCollection');
    }
    getIndicatorElement() {
        return this.selector('#' + this.id + 'IndicatorCollection');
    }
    getZoomingKitElement() {
        return this.selector('#' + this.id + '_Zooming_KitCollection');
    }
    getStriplineBehindCollection() {
        return this.selector('#' + this.id + '_stripline_Behind_collections');
    }
    getStriplineOverCollection() {
        return this.selector('#' + this.id + '_stripline_Over_collections');
    }
}
