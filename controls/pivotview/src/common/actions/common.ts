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
    private parent: PivotView;

    constructor(parent: PivotView) {
        this.parent = parent;
        this.parent.commonModule = this;
        this.addEventListener();
    }

    /* eslint-disable-next-line */
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'common';
    }

    private initiateCommonModule(): void {
        if (!this.parent.pivotCommon) {
            /* eslint-disable */
            let args: CommonArgs = {
                pivotEngine: this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule,
                dataSourceSettings: (<{ [key: string]: Object }>this.parent.dataSourceSettings).properties ?
                    (<{ [key: string]: Object }>this.parent.dataSourceSettings).properties : this.parent.dataSourceSettings,
                id: this.parent.element.id,
                element: this.parent.element,
                moduleName: this.parent.getModuleName(),
                enableRtl: this.parent.enableRtl,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                isAdaptive: Browser.isDevice as boolean,
                renderMode: 'Popup',
                localeObj: this.parent.localeObj,
                dataType: this.parent.dataType,
                cssClass: this.parent.cssClass
            };
            /* eslint-enable */
            this.parent.pivotCommon = new PivotCommon(args);
        } else {
            this.parent.pivotCommon.element = this.parent.element;
            this.parent.pivotCommon.engineModule = this.parent.dataType === 'olap' ?
                this.parent.olapEngineModule : this.parent.engineModule;
            this.parent.pivotCommon.parentID = this.parent.element.id;
            this.parent.pivotCommon.dataSourceSettings = (<{ [key: string]: object }>this.parent.dataSourceSettings).properties ?
                (<{ [key: string]: object }>this.parent.dataSourceSettings).properties : this.parent.dataSourceSettings;
            this.parent.pivotCommon.moduleName = this.parent.getModuleName();
            this.parent.pivotCommon.enableRtl = this.parent.enableRtl;
            this.parent.pivotCommon.isAdaptive = Browser.isDevice as boolean;
            this.parent.pivotCommon.renderMode = 'Popup';
            this.parent.pivotCommon.localeObj = this.parent.localeObj;
            this.parent.pivotCommon.dataType = this.parent.dataType;
            this.parent.pivotCommon.cssClass = this.parent.cssClass;
        }
        this.parent.pivotCommon.control = this.parent;
    }

    /* eslint-disable-next-line */
    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialLoad, this.initiateCommonModule, this);
        this.parent.on(events.uiUpdate, this.initiateCommonModule, this);
    }

    /* eslint-disable-next-line */
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialLoad, this.initiateCommonModule);
        this.parent.off(events.uiUpdate, this.initiateCommonModule);
    }

    /**
     * To destroy the groupingbar
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.parent.pivotCommon) {
            this.parent.pivotCommon.destroy();
            this.parent.pivotCommon = null;
        }
    }
}
