/**
 * Overview component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable
declare let cy: any;

export class OverviewHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }
    public getDiagramLayer() {
        return this.selector('#' + this.id + '_diagramLayer_div');
    }
    public getHtmlLayer() {
        return this.selector('#' + this.id + '_htmlLayer');
    }
    public getHandle() {
        return this.selector('#' + this.id + '_canvasoverviewhandle');
    }

    //tslint:enable
}