import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class AccumulationChartHelper extends TestHelper {
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
    getAccumulationContainer() {
        return this.selector('#' + this.id);
    }
    getAccumulationSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    getAccumulationTooltip() {
        return this.selector('#' + this.id + '_tooltip');
    }
    getAccumulationSvgElement() {
        return this.selector('#' + this.id + '_svg');
    }
    getAccumulationSeriesCollection() {
        return this.selector('#' + this.id + '_SeriesCollection');
    }
    getAccumulationSeries() {
        return this.selector('#' + this.id + '_Series_0_Point_0');
    }
    getAccumulationDatalabel() {
        return this.selector('#' + this.id + '_datalabel_Series_0');
    }
    getAccumulationTitle() {
        return this.selector('#' + this.id + '_title');
    }
    getAccumulationSubtitle() {
        return this.selector('#' + this.id + '_subTitle');
    }
    getAccumulatioLegendCollection() {
        return this.selector('#' + this.id + '_chart_legend_collections');
    }
    getAccumulationLegendBoundary() {
        return this.selector('#' + this.id + '_chart_legend_element');
    }
    getAccumulationBorder() {
        return this.selector('#' + this.id + '_border');
    }
    getAccumulationAnnotationCollection() {
        return this.selector('#' + this.id + '_Annotation_Collections');
    }
}
