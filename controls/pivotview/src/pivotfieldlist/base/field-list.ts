import { Property, Event, Component, EmitType, Internationalization, extend } from '@syncfusion/ej2-base';
import { L10n, remove, addClass, Browser, Complex, ModuleDeclaration } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotEngine, IFieldListOptions, IPageSettings, IDataOptions, ICustomProperties } from '../../base/engine';
import { ISort, IFilter, IFieldOptions, ICalculatedFields, IDataSet } from '../../base/engine';
import { PivotFieldListModel } from './field-list-model';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { LoadEventArgs, EnginePopulatingEventArgs, EnginePopulatedEventArgs } from '../../common/base/interface';
import { FieldDroppedEventArgs } from '../../common/base/interface';
import { Mode } from '../../common/base/enum';
import { PivotCommon } from '../../common/base/pivot-common';
import { CommonArgs } from '../../common/base/interface';
import { Render } from '../renderer/renderer';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { TreeViewRenderer } from '../renderer/tree-renderer';
import { AxisTableRenderer } from '../renderer/axis-table-renderer';
import { AxisFieldRenderer } from '../renderer/axis-field-renderer';
import { PivotButton } from '../../common/actions/pivot-button';
import { PivotView } from '../../pivotview/base/pivotview';
import { DataSourceModel, FieldOptionsModel } from '../../pivotview/model/dataSource-model';
import { DataSource } from '../../pivotview/model/dataSource';
import { CalculatedField } from '../../common/calculatedfield/calculated-field';
import { PivotContextMenu } from '../../common/popups/context-menu';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { PivotUtil } from '../../base/util';

/**
 * Represents the PivotFieldList component.
 * ```html
 * <div id="pivotfieldlist"></div>
 * <script>
 *  var pivotfieldlistObj = new PivotFieldList({ });
 *  pivotfieldlistObj.appendTo("#pivotfieldlist");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class PivotFieldList extends Component<HTMLElement> implements INotifyPropertyChanged {
    /** @hidden */
    public globalize: Internationalization;
    /** @hidden */
    public localeObj: L10n;
    /** @hidden */
    public isAdaptive: Boolean;
    /** @hidden */
    public pivotFieldList: IFieldListOptions;
    /** @hidden */
    public engineModule: PivotEngine;
    /** @hidden */
    public isDragging: boolean;
    /** @hidden */
    public fieldListSpinnerElement: Element;
    /** @hidden */
    public clonedDataSource: DataSourceModel;
    /** @hidden */
    public clonedFieldList: IFieldListOptions;
    /** @hidden */
    public isRequiredUpdate: boolean = true;
    /** @hidden */
    public clonedDataSet: IDataSet[];
    /** @hidden */
    public clonedReport: IDataOptions;
    /** @hidden */
    public lastSortInfo: ISort = {};
    /** @hidden */
    public lastFilterInfo: IFilter = {};
    /** @hidden */
    public lastAggregationInfo: IFieldOptions = {};
    /** @hidden */
    public lastCalcFieldInfo: ICalculatedFields = {};
    private defaultLocale: Object;
    private captionData: FieldOptionsModel[][];

    //Module Declarations
    /** @hidden */
    public pivotGridModule: PivotView;
    /** @hidden */
    public renderModule: Render;
    /** @hidden */
    public dialogRenderer: DialogRenderer;
    /** @hidden */
    public treeViewModule: TreeViewRenderer;
    /** @hidden */
    public axisTableModule: AxisTableRenderer;
    /** @hidden */
    public pivotCommon: PivotCommon;
    /** @hidden */
    public axisFieldModule: AxisFieldRenderer;
    /** @hidden */
    public pivotButtonModule: PivotButton;
    /** @hidden */
    public calculatedFieldModule: CalculatedField;
    /** @hidden */
    public contextMenuModule: PivotContextMenu;

    //Property Declarations

    /** 
     * It allows to feed raw data, dataSource and properties to customize the data source
     */
    @Complex<DataSourceModel>({}, DataSource)
    public dataSource: DataSourceModel;

    /**
     * It allows to render Pivot Field List at fixed or popup mode.
     * The possible values are:
     * @default 'Popup'
     */
    @Property('Popup')
    public renderMode: Mode;

    /**
     * Specifies the `target` element where the Pivot Field List dialog should be displayed.
     * If the user set the specific `target` element for Pivot Field List, it will be positioned based on the `target`.
     * The targetID should works only when the Pivot Field List is in 'Dynamic' mode.
     * @default null
     */
    @Property()
    public target: HTMLElement | string;

    /**
     * Specifies the CSS class name to be added for Pivot Field List element.
     * User can add single or multiple CSS classes.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * It allows to enable calculated field in Pivot Field List.
     * @default false
     */
    @Property(false)
    public allowCalculatedField: boolean;

    /**
     * It shows a common button for value fields to move together in column or row axis
     * @default false
     */
    @Property(false)
    public showValuesButton: boolean;

    /**
     * If `allowDeferLayoutUpdate` is set to true, then it will enable defer layout update to pivotfieldlist.
     * @default false
     */
    @Property(false)
    public allowDeferLayoutUpdate: boolean;

    /**
     * It allows to set the maximum number of nodes to be displayed in the member editor.
     * @default 1000    
     */
    @Property(1000)
    public maxNodeLimitInMemberEditor: number;

    //Event Declarations
    /**
     * This allows any customization of Pivot Field List properties before rendering.
     * @event
     */
    @Event()
    public load: EmitType<LoadEventArgs>;

    /**
     * This allows any customization of Pivot Field List properties before pivotengine populate.
     * @event
     */
    @Event()
    public enginePopulating: EmitType<EnginePopulatingEventArgs>;

    /**
     * This allows any customization of Pivot Field List properties before pivotengine populate.
     * @event
     */
    @Event()
    public enginePopulated: EmitType<EnginePopulatedEventArgs>;

    /**
     * Triggers when a field getting dropped into any axis.
     * @event
     */
    @Event()
    public onFieldDropped: EmitType<FieldDroppedEventArgs>;

    /** 
     * Triggers when data source is populated in the Pivot Field List.
     * @event 
     */
    @Event()
    public dataBound: EmitType<Object>;

    /** 
     * Triggers when data source is created in the Pivot Field List.
     * @event 
     */
    @Event()
    public created: EmitType<Object>;

    /** 
     * Triggers when data source is destroyed in the Pivot Field List.
     * @event 
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Constructor for creating the widget
     * @param  {PivotFieldListModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    constructor(options?: PivotFieldListModel, element?: string | HTMLElement) {
        super(options, <string | HTMLElement>element);
        this.engineModule = new PivotEngine();
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.allowCalculatedField) {
            modules.push({ args: [this], member: 'calculatedfield' });
        }
        return modules;
    }

    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    protected preRender(): void {
        this.isAdaptive = Browser.isDevice;
        this.globalize = new Internationalization(this.locale);
        this.renderModule = new Render(this);
        this.defaultLocale = {
            staticFieldList: 'Pivot Field List',
            fieldList: 'Field List',
            dropFilterPrompt: 'Drop filter here',
            dropColPrompt: 'Drop column here',
            dropRowPrompt: 'Drop row here',
            dropValPrompt: 'Drop value here',
            addPrompt: 'Add field here',
            adaptiveFieldHeader: 'Choose field',
            centerHeader: 'Drag fields between axes below:',
            add: 'add',
            drag: 'Drag',
            filter: 'Filter',
            filtered: 'Filtered',
            sort: 'Sort',
            remove: 'Remove',
            filters: 'Filters',
            rows: 'Rows',
            columns: 'Columns',
            values: 'Values',
            calculatedField: 'Calculated Field',
            createCalculatedField: 'Create Calculated Field',
            fieldName: 'Enter the field name',
            error: 'Error',
            invalidFormula: 'Invalid formula.',
            dropText: 'Example: ("Sum(Order_Count)" + "Sum(In_Stock)") * 250',
            dropTextMobile: 'Add fields and edit formula here.',
            dropAction: 'Calculated field cannot be place in any other region except value axis.',
            search: 'Search',
            close: 'Close',
            cancel: 'Cancel',
            delete: 'Delete',
            alert: 'Alert',
            warning: 'Warning',
            ok: 'OK',
            sum: 'Sum',
            average: 'Average',
            count: 'Count',
            min: 'Min',
            max: 'Max',
            allFields: 'All Fields',
            formula: 'Formula',
            fieldExist: 'A field already exists in this name. Please enter a different name.',
            confirmText: 'A calculation field already exists in this name. Do you want to replace it?',
            noMatches: 'No matches',
            format: 'Summaries values by',
            edit: 'Edit',
            clear: 'Clear',
            formulaField: 'Drag and drop fields to formula',
            dragField: 'Drag field to formula',
            clearFilter: 'Clear',
            by: 'by',
            enterValue: 'Enter value',
            chooseDate: 'Enter date',
            all: 'All',
            multipleItems: 'Multiple items',
            /* tslint:disable */
            Equals: 'Equals',
            DoesNotEquals: 'Does Not Equal',
            BeginWith: 'Begins With',
            DoesNotBeginWith: 'Does Not Begin With',
            EndsWith: 'Ends With',
            DoesNotEndsWith: 'Does Not End With',
            Contains: 'Contains',
            DoesNotContains: 'Does Not Contain',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqualTo: 'Greater Than Or Equal To',
            LessThan: 'Less Than',
            LessThanOrEqualTo: 'Less Than Or Equal To',
            Between: 'Between',
            NotBetween: 'Not Between',
            Before: 'Before',
            BeforeOrEqualTo: 'Before Or Equal To',
            After: 'After',
            AfterOrEqualTo: 'After Or Equal To',
            member: 'Member',
            label: 'Label',
            date: 'Date',
            value: 'Value',
            labelTextContent: 'Show the items for which the label',
            dateTextContent: 'Show the items for which the date',
            valueTextContent: 'Show the items for which',
            And: 'and',
            Sum: 'Sum',
            Count: 'Count',
            DistinctCount: 'Distinct Count',
            Product: 'Product',
            Avg: 'Avg',
            Min: 'Min',
            Max: 'Max',
            Index: 'Index',
            SampleStDev: 'Sample StDev',
            PopulationStDev: 'Population StDev',
            SampleVar: 'Sample Var',
            PopulationVar: 'Population Var',
            RunningTotals: 'Running Totals',
            DifferenceFrom: 'Difference From',
            PercentageOfDifferenceFrom: '% of Difference From',
            PercentageOfGrandTotal: '% of Grand Total',
            PercentageOfColumnTotal: '% of Column Total',
            PercentageOfRowTotal: '% of Row Total',
            PercentageOfParentTotal: '% of Parent Total',
            PercentageOfParentColumnTotal: '% of Parent Column Total',
            PercentageOfParentRowTotal: '% of Parent Row Total',
            Years: 'Years',
            Quarters: 'Quarters',
            Months: 'Months',
            Days: 'Days',
            Hours: 'Hours',
            Minutes: 'Minutes',
            Seconds: 'Seconds',
            /* tslint:enable */
            apply: 'APPLY',
            valueFieldSettings: 'Value field settings',
            sourceName: 'Field name :',
            sourceCaption: 'Field caption :',
            summarizeValuesBy: 'Summarize values by :',
            baseField: 'Base field :',
            baseItem: 'Base item :',
            example: 'e.g:',
            editorDataLimitMsg: ' more items. Search to refine further.',
            deferLayoutUpdate: 'Defer Layout Update'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.isDragging = false;
        this.captionData = [];
        this.wireEvent();
    }

    private frameCustomProperties(): ICustomProperties {
        let pageSettings: IPageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined;
        let isDrillThrough: boolean = this.pivotGridModule ?
            (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true;
        let enableValueSorting: boolean = this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined;
        let customProperties: ICustomProperties = {
            mode: '',
            savedFieldList: undefined,
            pageSettings: pageSettings,
            enableValueSorting: enableValueSorting,
            isDrillThrough: isDrillThrough,
            localeObj: this.localeObj
        };
        return customProperties;
    }

    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    public render(): void {
        this.trigger(events.load, { 'dataSource': this.dataSource });
        addClass([this.element], cls.ROOT);
        if (this.enableRtl) {
            addClass([this.element], cls.RTL);
        } else {
            removeClass([this.element], cls.RTL);
        }
        if (this.isAdaptive) {
            addClass([this.element], cls.DEVICE);
        } else {
            removeClass([this.element], cls.DEVICE);
        }
        if (this.cssClass) {
            addClass([this.element], this.cssClass);
        }
        this.notify(events.initialLoad, {});
    }

    /**
     * Binding events to the Pivot Field List element.
     * @hidden
     */
    private wireEvent(): void {
        this.on(events.initialLoad, this.generateData, this);
        this.on(events.dataReady, this.fieldListRender, this);
    }

    /**
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    private unWireEvent(): void {
        if (this.pivotGridModule && this.pivotGridModule.isDestroyed) { return; }
        this.off(events.initialLoad, this.generateData);
        this.off(events.dataReady, this.fieldListRender);
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['dataSource'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Get component name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'pivotfieldlist';
    }

    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    public onPropertyChanged(newProp: PivotFieldListModel, oldProp: PivotFieldListModel): void {
        let requireRefresh: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'locale':
                    this.refresh();
                    break;
                case 'enableRtl':
                    if (this.enableRtl) {
                        addClass([this.element], cls.RTL);
                    } else {
                        removeClass([this.element], cls.RTL);
                    }
                    requireRefresh = true;
                    break;
            }
            if (requireRefresh) {
                this.fieldListRender();
            }
        }
    }
    /* tslint:disable */
    private generateData(): void {
        this.pivotFieldList = {};
        if (this.dataSource && this.dataSource.data) {
            this.trigger(events.enginePopulating, { 'dataSource': this.dataSource });
            if (this.dataSource.groupSettings) {
                let pivotDataSet: IDataSet[] = this.dataSource.data as IDataSet[];
                this.clonedDataSet = this.clonedDataSet ? this.clonedDataSet : PivotUtil.getClonedData(pivotDataSet);
                this.setProperties({ dataSource: { data: [] } }, true);
                this.clonedReport = this.clonedReport ? this.clonedReport : extend({}, this.dataSource, null, true) as IDataOptions;
                this.setProperties({ dataSource: { data: pivotDataSet } }, true);
            }
            this.engineModule.renderEngine(this.dataSource, this.frameCustomProperties());
            this.pivotFieldList = this.engineModule.fieldList;
            let eventArgs: EnginePopulatedEventArgs = {
                pivotFieldList: this.pivotFieldList,
                pivotValues: this.engineModule.pivotValues
            };
            this.trigger(events.enginePopulated, eventArgs);
        }
        this.notify(events.dataReady, {});
        this.trigger(events.dataBound);
    }
    /* tslint:enable */
    private fieldListRender(): void {
        this.element.innerHTML = '';
        if (this.renderMode === 'Popup' && this.dialogRenderer.fieldListDialog && !this.dialogRenderer.fieldListDialog.isDestroyed) {
            this.dialogRenderer.fieldListDialog.destroy();
            remove(document.getElementById(this.element.id + '_Wrapper'));
        }
        this.renderModule.render();
        this.fieldListSpinnerElement = this.renderMode === 'Popup' ?
            this.dialogRenderer.fieldListDialog.element : this.element.querySelector('.e-pivotfieldlist-wrapper');
        createSpinner({ target: this.fieldListSpinnerElement as HTMLElement }, this.createElement);
        let args: CommonArgs = {
            pivotEngine: this.engineModule,
            dataSource: this.dataSource,
            id: this.element.id,
            element: document.getElementById(this.element.id + '_Wrapper'),
            moduleName: this.getModuleName(),
            enableRtl: this.enableRtl,
            isAdaptive: this.isAdaptive as boolean,
            renderMode: this.renderMode,
            localeObj: this.localeObj
        };
        this.pivotCommon = new PivotCommon(args);
        this.pivotCommon.control = this;
        if (this.allowDeferLayoutUpdate) {
            this.clonedDataSource = extend({}, this.dataSource, null, true) as IDataOptions;
            this.clonedFieldList = extend({}, this.pivotFieldList, null, true) as IFieldListOptions;
        }
    }
    private getFieldCaption(dataSource: DataSourceModel): void {
        this.getFields(dataSource);
        if (this.captionData.length > 0) {
            let lnt: number = this.captionData.length;
            while (lnt--) {
                if (this.captionData[lnt]) {
                    for (let obj of this.captionData[lnt]) {
                        if (obj) {
                            if (this.engineModule.fieldList[obj.name] && obj.caption) {
                                this.engineModule.fieldList[obj.name].caption = obj.caption;
                            } else {
                                this.engineModule.fieldList[obj.name].caption = obj.name;
                            }
                        }
                    }
                }
            }
        } else {
            return;
        }
    }
    private getFields(dataSource: DataSourceModel): void {
        this.captionData = [dataSource.rows, dataSource.columns, dataSource.values, dataSource.filters] as FieldOptionsModel[][];
    }

    /**
     * Updates the PivotEngine using dataSource from Pivot Field List component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    public updateDataSource(isTreeViewRefresh?: boolean, isEngineRefresh?: boolean): void {
        if (this.pivotGridModule) {
            showSpinner(this.pivotGridModule.element);
        }
        showSpinner(this.fieldListSpinnerElement as HTMLElement);
        if (isNullOrUndefined(isEngineRefresh)) {
            let pageSettings: IPageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined;
            let customProperties: ICustomProperties = this.frameCustomProperties();
            customProperties.savedFieldList = this.pivotFieldList;
            let lastSortInfo: ISort = this.pivotGridModule ? this.pivotGridModule.lastSortInfo : this.lastSortInfo;
            if (this.pivotGridModule) {
                this.pivotGridModule.lastSortInfo = {};
            }
            this.lastSortInfo = {};
            let isAggChange: boolean = Object.keys(this.lastAggregationInfo).length > 0 ? true : false;
            let isCalcChange: boolean = Object.keys(this.lastCalcFieldInfo).length > 0 ? true : false;
            let isSorted: boolean = Object.keys(lastSortInfo).length > 0 ? true : false;
            let isFiltered: boolean = Object.keys(this.lastFilterInfo).length > 0 ? true : false;
            if (pageSettings && (isSorted || isFiltered || isAggChange || isCalcChange)) {
                if (isSorted) {
                    this.pivotGridModule.setProperties({ dataSource: { valueSortSettings: { headerText: '' } } }, true);
                    this.engineModule.onSort(lastSortInfo);
                }
                if (isFiltered) {
                    this.engineModule.onFilter(this.lastFilterInfo, this.dataSource);
                    this.lastFilterInfo = {};
                }
                if (isAggChange) {
                    this.engineModule.onAggregation(this.lastAggregationInfo);
                    this.lastAggregationInfo = {};
                }
                if (isCalcChange) {
                    this.engineModule.onCalcOperation(this.lastCalcFieldInfo);
                    this.lastCalcFieldInfo = {};
                }
            } else {
                this.engineModule.renderEngine(this.dataSource, customProperties);
            }
            this.getFieldCaption(this.dataSource);
        } else {
            this.axisFieldModule.render();
            this.isRequiredUpdate = false;
        }
        let eventArgs: EnginePopulatedEventArgs = {
            dataSource: this.dataSource,
            pivotFieldList: this.pivotFieldList,
            pivotValues: this.engineModule.pivotValues
        };
        this.trigger(events.enginePopulated, eventArgs);
        this.pivotCommon.engineModule = this.engineModule;
        this.pivotCommon.dataSource = this.dataSource;
        this.pivotFieldList = this.engineModule.fieldList;
        if (!isTreeViewRefresh && this.treeViewModule.fieldTable && !this.isAdaptive) {
            this.notify(events.treeViewUpdate, {});
        }
        if (this.isRequiredUpdate) {
            if (this.allowDeferLayoutUpdate) {
                this.clonedDataSource = extend({}, this.dataSource, null, true) as IDataOptions;
                this.clonedFieldList = extend({}, this.pivotFieldList, null, true) as IFieldListOptions;
            }
            this.updateView(this.pivotGridModule);
        } else if (this.renderMode === 'Popup' && this.allowDeferLayoutUpdate) {
            this.pivotGridModule.engineModule = this.engineModule;
            this.pivotGridModule.
                setProperties({ dataSource: (<{ [key: string]: Object }>this.dataSource).properties as IDataOptions }, true);
            this.pivotGridModule.notify(events.uiUpdate, this);
            hideSpinner(this.fieldListSpinnerElement as HTMLElement);
        }
        this.isRequiredUpdate = true;
        if (!this.pivotGridModule) {
            hideSpinner(this.fieldListSpinnerElement as HTMLElement);
        } else {
            this.pivotGridModule.fieldListSpinnerElement = this.fieldListSpinnerElement as HTMLElement;
        }
    }

    /**
     * Updates the Pivot Field List component using dataSource from PivotView component.
     * @method updateControl
     * @return {void}
     * @hidden
     */
    public update(control: PivotView): void {
        if (control) {
            this.clonedDataSet = control.clonedDataSet;
            this.setProperties({ dataSource: control.dataSource }, true);
            this.engineModule = control.engineModule;
            this.pivotFieldList = control.engineModule.fieldList;
            if (this.renderMode === 'Popup') {
                this.pivotGridModule = control;
            }
            this.getFieldCaption(control.dataSource);
            this.pivotCommon.engineModule = this.engineModule;
            this.pivotCommon.dataSource = this.dataSource;
            this.pivotCommon.control = control;
            if (this.treeViewModule.fieldTable && !this.isAdaptive) {
                this.notify(events.treeViewUpdate, {});
            }
            this.axisFieldModule.render();
            if (this.renderMode === 'Fixed' && this.allowDeferLayoutUpdate) {
                this.clonedDataSource = extend({}, this.dataSource, null, true) as IDataOptions;
                this.clonedFieldList = extend({}, this.pivotFieldList, null, true) as IFieldListOptions;
            }
        }
    }

    /**
     * Updates the PivotView component using dataSource from Pivot Field List component.
     * @method refreshTargetControl
     * @return {void}
     * @hidden
     */
    public updateView(control: PivotView): void {
        if (control) {
            control.clonedDataSet = this.clonedDataSet;
            control.setProperties({ dataSource: this.dataSource }, true);
            control.engineModule = this.engineModule;
            control.pivotValues = this.engineModule.pivotValues;
            control.dataBind();
        }
    }

    /**
     * Called internally to trigger populate event.
     * @hidden
     */
    public triggerPopulateEvent(): void {
        let eventArgs: EnginePopulatedEventArgs = {
            dataSource: this.dataSource,
            pivotFieldList: this.pivotFieldList,
            pivotValues: this.engineModule.pivotValues
        };
        this.trigger(events.enginePopulated, eventArgs);
    }

    /**
     * Destroys the Field Table component.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.unWireEvent();
        if (this.treeViewModule) {
            this.treeViewModule.destroy();
        }
        if (this.pivotButtonModule) {
            this.pivotButtonModule.destroy();
        }
        if (this.allowDeferLayoutUpdate && this.dialogRenderer &&
            this.dialogRenderer.deferUpdateCheckBox && !this.dialogRenderer.deferUpdateCheckBox.isDestroyed) {
            this.dialogRenderer.deferUpdateCheckBox.destroy();
        }
        super.destroy();
        this.element.innerHTML = '';
        removeClass([this.element], cls.ROOT);
        removeClass([this.element], cls.RTL);
        removeClass([this.element], cls.DEVICE);
        if (this.renderMode === 'Popup') {
            if (this.dialogRenderer.fieldListDialog && !this.dialogRenderer.fieldListDialog.isDestroyed) {
                this.dialogRenderer.fieldListDialog.destroy();
            }
            if (document.getElementById(this.element.id + '_Wrapper')) {
                remove(document.getElementById(this.element.id + '_Wrapper'));
            }
        }
    }
}


