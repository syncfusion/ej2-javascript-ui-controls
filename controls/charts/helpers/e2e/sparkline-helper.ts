import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class SparklineHelper extends TestHelper {
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
    // Get the sparkline container id.
    getSparklineContainer() {
        return this.selector('#' + this.id);
    }
    // Get the sparkline line element.
    getLinePathElement() {
        return this.selector('#' + this.id + '_sparkline_line');
    }
    // Get the sparkline area element.
    getAreaElement() {
        return this.selector('#' + this.id + '_sparkline_area_str');
    }
    // Get the sparkline column element.
    getColumnElement() {
        return this.selector('#' + this.id + '_sparkline_column_0');
    }
    // Get the sparkline winloss element.
    getWinlossElement() {
        return this.selector('#' + this.id + '_sparkline_winloss_0');
    }
    // Get the sparkline pie element.
    getPieElement() {
        return this.selector('#' + this.id + '_sparkline_pie_0');
    }
    // Get the sparkline marker group element.
    getMarkerGroupElement() {
        return this.selector('#' + this.id + '_sparkline_marker_g');
    }
    // Get the sparkline label element.
    getLabelGroupElement() {
        return this.selector('#' + this.id + '_sparkline_label_g');
    }
    // Get the sparkline secondary element.
    getTooltipElement() {
        return this.selector('#' + this.id + '_Secondary_Element');
    }
}
