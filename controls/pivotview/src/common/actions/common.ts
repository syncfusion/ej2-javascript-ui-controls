import { PivotView } from '../../pivotview/base/pivotview';
import { IAction, CommonArgs } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import { PivotCommon } from '../../common/base/pivot-common';
import { Browser } from '@syncfusion/ej2-base';

/**
 * Module for PivotCommon rendering
 */
/** @hidden */
export class Common implements IAction {
    /**
     * Module declarations
     */
    private parent: PivotView;
    private handlers: {
        load: Function
    };

    /** Constructor for Common module */
    constructor(parent: PivotView) {
        this.parent = parent;
        this.parent.commonModule = this;
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'common';
    }

    private initiateCommonModule(): void {
        if (!this.parent.pivotCommon) {
            let args: CommonArgs = {
                pivotEngine: this.parent.engineModule,
                dataSource: (<{ [key: string]: Object }>this.parent.dataSource).properties ?
                    (<{ [key: string]: Object }>this.parent.dataSource).properties : this.parent.dataSource,
                id: this.parent.element.id,
                element: this.parent.element,
                moduleName: this.parent.getModuleName(),
                enableRtl: this.parent.enableRtl,
                isAdaptive: Browser.isDevice as boolean,
                renderMode: 'Popup',
                localeObj: this.parent.localeObj
            };
            this.parent.pivotCommon = new PivotCommon(args);
        } else {
            this.parent.pivotCommon.element = this.parent.element;
            this.parent.pivotCommon.engineModule = this.parent.engineModule;
            this.parent.pivotCommon.parentID = this.parent.element.id;
            this.parent.pivotCommon.dataSource = (<{ [key: string]: Object }>this.parent.dataSource).properties ?
                (<{ [key: string]: Object }>this.parent.dataSource).properties : this.parent.dataSource;
            this.parent.pivotCommon.moduleName = this.parent.getModuleName();
            this.parent.pivotCommon.enableRtl = this.parent.enableRtl;
            this.parent.pivotCommon.isAdaptive = Browser.isDevice as boolean;
            this.parent.pivotCommon.renderMode = 'Popup';
            this.parent.pivotCommon.localeObj = this.parent.localeObj;
        }
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        this.handlers = {
            load: this.initiateCommonModule
        };
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.uiUpdate, this.handlers.load, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.uiUpdate, this.handlers.load);
    }

    /**
     * To destroy the groupingbar 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.parent.pivotCommon) { this.parent.pivotCommon.destroy(); }
    }
}