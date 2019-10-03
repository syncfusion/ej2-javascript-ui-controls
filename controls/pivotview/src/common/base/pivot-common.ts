import { Internationalization, L10n } from '@syncfusion/ej2-base';
import { IDataOptions, PivotEngine } from '../../base/engine';
import { CommonArgs } from './interface';
import { Mode } from '../base/enum';
import { CommonKeyboardInteraction } from '../actions/keyboard';
import { EventBase } from '../actions/event-base';
import { NodeStateModified } from '../actions/node-state-modified';
import { DataSourceUpdate } from '../actions/dataSource-update';
import { ErrorDialog } from '../popups/error-dialog';
import { FilterDialog } from '../popups/filter-dialog';
import { PivotView } from '../../pivotview';
import { PivotFieldList } from '../../pivotfieldlist';
import { OlapEngine } from '../../base/olap/engine';

/**
 * PivotCommon is used to manipulate the relational or Multi-Dimensional public methods by using their dataSource

 */

export class PivotCommon {

    public globalize: Internationalization;

    public localeObj: L10n;

    public engineModule: PivotEngine | OlapEngine;

    public dataSourceSettings: IDataOptions;

    public element: HTMLElement;

    public moduleName: string;

    public enableRtl: boolean;

    public isAdaptive: boolean;

    public renderMode: Mode;

    public parentID: string;

    public control: PivotView | PivotFieldList;

    public currentTreeItems: { [key: string]: Object }[] = [];

    public savedTreeFilterPos: { [key: number]: string } = {};

    public currentTreeItemsPos: { [key: string]: number } = {};

    public searchTreeItems: { [key: string]: Object }[] = [];

    public editorLabelElement: HTMLLabelElement;

    public isDataOverflow: boolean = false;

    public isDateField: boolean = false;

    public dataType: string;


    //Module Declarations

    public nodeStateModified: NodeStateModified;

    public dataSourceUpdate: DataSourceUpdate;

    public eventBase: EventBase;

    public errorDialog: ErrorDialog;

    public filterDialog: FilterDialog;

    public keyboardModule: CommonKeyboardInteraction;

    /**
     * Constructor for Pivot Common class
     * @param  {CommonArgs} control?

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
        this.nodeStateModified = new NodeStateModified(this);
        this.dataSourceUpdate = new DataSourceUpdate(this);
        this.eventBase = new EventBase(this);
        this.filterDialog = new FilterDialog(this);
        this.errorDialog = new ErrorDialog(this);
        this.keyboardModule = new CommonKeyboardInteraction(this);
        return this;
    }

    /**
     * To destroy the groupingbar 
     * @return {void}

     */
    public destroy(): void {
        if (this.keyboardModule) { this.keyboardModule.destroy(); }
    }
}
