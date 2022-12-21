import { Internationalization, L10n } from '@syncfusion/ej2-base';
import { IDataOptions, PivotEngine } from '../../base/engine';
import { CommonArgs, TreeDataInfo } from './interface';
import { Mode } from '../base/enum';
import { CommonKeyboardInteraction } from '../actions/keyboard';
import { EventBase } from '../actions/event-base';
import { NodeStateModified } from '../actions/node-state-modified';
import { DataSourceUpdate } from '../actions/dataSource-update';
import { ErrorDialog } from '../popups/error-dialog';
import { FilterDialog } from '../popups/filter-dialog';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { OlapEngine } from '../../base/olap/engine';

/**
 * PivotCommon is used to manipulate the relational or Multi-Dimensional public methods by using their dataSource
 *
 * @hidden
 */
/** @hidden */
export class PivotCommon {
    /** @hidden */
    public globalize: Internationalization;
    /** @hidden */
    public localeObj: L10n;
    /** @hidden */
    public engineModule: PivotEngine | OlapEngine;
    /** @hidden */
    public dataSourceSettings: IDataOptions;
    /** @hidden */
    public element: HTMLElement;
    /** @hidden */
    public moduleName: string;
    /** @hidden */
    public enableRtl: boolean;
    /** @hidden */
    public isAdaptive: boolean;
    /** @hidden */
    public renderMode: Mode;
    /** @hidden */
    public parentID: string;
    /** @hidden */
    public control: PivotView | PivotFieldList;
    /** @hidden */
    public currentTreeItems: { [key: string]: Object }[] = [];
    /** @hidden */
    public savedTreeFilterPos: { [key: number]: string } = {};
    /** @hidden */
    public currentTreeItemsPos: { [key: string]: TreeDataInfo } = {};
    /** @hidden */
    public searchTreeItems: { [key: string]: Object }[] = [];
    /** @hidden */
    public editorLabelElement: HTMLLabelElement;
    /** @hidden */
    public isDataOverflow: boolean = false;
    /** @hidden */
    public isDateField: boolean = false;
    /** @hidden */
    public dataType: string;
    /** @hidden */
    public cssClass: string;


    //Module Declarations
    /** @hidden */
    public nodeStateModified: NodeStateModified;
    /** @hidden */
    public dataSourceUpdate: DataSourceUpdate;
    /** @hidden */
    public eventBase: EventBase;
    /** @hidden */
    public errorDialog: ErrorDialog;
    /** @hidden */
    public filterDialog: FilterDialog;
    /** @hidden */
    public keyboardModule: CommonKeyboardInteraction;

    /**
     * Constructor for Pivot Common class.
     *
     * @param  {CommonArgs} control - It contains the value of control.
     * @hidden
     */
    constructor(control: CommonArgs) {
        this.element = control.element;
        this.moduleName = control.moduleName;
        this.dataSourceSettings = control.dataSourceSettings;
        this.engineModule = control.pivotEngine;
        this.enableRtl = control.enableRtl;
        this.isAdaptive = control.isAdaptive;
        this.renderMode = control.renderMode;
        this.parentID = control.id;
        this.localeObj = control.localeObj;
        this.dataType = control.dataType;
        this.cssClass = control.cssClass;
        this.nodeStateModified = new NodeStateModified(this);
        this.dataSourceUpdate = new DataSourceUpdate(this);
        this.eventBase = new EventBase(this);
        this.filterDialog = new FilterDialog(this);
        this.errorDialog = new ErrorDialog(this);
        this.keyboardModule = new CommonKeyboardInteraction(this);
        return this;
    }

    /**
     * To destroy the groupingbar.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
            this.keyboardModule = null;
        }
    }
}
