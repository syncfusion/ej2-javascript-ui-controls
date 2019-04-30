/**
 * Overview component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable
declare let cy: any;

/**
 * Represents the Overview helpers.
 */
export class OverviewHelper extends TestHelper {
    /**
     * Specifies the ID of the overview.
     */    
    public id: string;

    /**
     * Specifies the current helper function of the overview.
     */
    public wrapperFn: Function;

    /**
     * Constructor for creating the helper object for overview component.
     */    
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }

    /**
     * Gets the overview element, which will have the overview objects like nodes, connectors, and more.
     */    
    public getDiagramLayer() {
        return this.selector('#' + this.id + '_diagramLayer_div');
    }

    /**
     * Gets the HTML layer element of the overview component, which will have the HTML node content.
     */    
    public getHtmlLayer() {
        return this.selector('#' + this.id + '_htmlLayer');
    }

    /**
     * Gets the overview handle elements.
     */
    public getHandle() {
        return this.selector('#' + this.id + '_canvasoverviewhandle');
    }

    //tslint:enable
}