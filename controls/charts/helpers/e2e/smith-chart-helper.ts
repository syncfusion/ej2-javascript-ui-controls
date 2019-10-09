import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class SmithChartHelper extends TestHelper {
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
    // Get the smithchart container id.
    getSmithchartContainer() {
        return this.selector('#' + this.id);
    }
    // Get the smithchart title group element.
    getTitlegroupElement() {
        return this.selector('#' + this.id + '_Title_Group');
    }
    // Get the smithchart horizontal axis major grid line element.
    getHorizontalAxisMajorGridLinesElement() {
        return this.selector('#' + this.id + '_svg_horizontalAxisMajorGridLines');
    }
    // Get the smithchart  horizontal axis line element.
    gethAxisLineElement() {
        return this.selector('#' + this.id + '_svg_hAxisLine');
    }
    // Get the smithchart radial axis major grid line element.
    getRadialAxisMajorGridLinesElement() {
        return this.selector('#' + this.id + '_svg_radialAxisMajorGridLines');
    }
    // Get the smithchart radial axis line element.
    getRAxisLineElement() {
        return this.selector('#' + this.id + '_svg_rAxisLine');
    }
    // Get the smithchart horizontal axis label element.
    getHAxisLabelsElement() {
        return this.selector('#' + this.id + '_HAxisLabels');
    }
    // Get the smithchart radial axis label element.
    getRAxisLabelsElement() {
        return this.selector('#' + this.id + '_RAxisLabels');
    }
    // Get the smithchart series collection.
    getseriesCollectionsElement() {
        return this.selector('#' + this.id + '_svg_seriesCollections');
    }
    // Get the smithchart marker element.
    getMarkerElement() {
        return this.selector('#' + this.id + '_svg_series1_Marker');
    }
    // Get the smithchart secondary element.
    getSecondaryElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
    // Get the smithchart legend group element.
    getLegendElement() {
        return this.selector('#' + this.id + 'legendItem_Group');
    }
    
}
