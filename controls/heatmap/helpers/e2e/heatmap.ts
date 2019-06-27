import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

/**
 * E2E test helpers for Heatmap to easily interact and the test the component
 */

export class HeatMapHelper extends TestHelper {
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

     /**
     * Used to get container of the Heatmap component
     */

    getHeatMapContainer() {
        return this.selector('#' + this.id);
    }
     /**
     * Used to get tootip element of the Heatmap component
     */

    getTooltipElement() {
        return this.selector('#' + this.id+'Celltooltipcontainer');
    }
     
    /**
     * Used to get Axis tooltip,Legend tooltip,Title tooltip of Heatmap component.
     */
    getSecondaryElement() {
        return this.selector('#' + this.id+'_Secondary_Element');
    }
    /**
     * Used to get Legend element of Heatmap component
     */
    getLegendElement() {
        return this.selector('#' + this.id+'_Heatmap_Legend');
    }
    /**
     * Used to get Axis element of Heatmap component
     */
    getAxisElement() {
        return this.selector('#' + this.id+'AxisCollection');
    }

    /**
     * Used to get Series element of Heatmap component
     */
    getSeriesElement() {
        return this.selector('#' + this.id+'Celltooltipcontainer');
    }
}