import { Property, Event, Component, EmitType, Internationalization, extend, isBlazor } from '@syncfusion/ej2-base';
import { L10n, remove, addClass, Browser, Complex, ModuleDeclaration, getInstance } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';
import { PivotEngine, IFieldListOptions, IPageSettings, IDataOptions, ICustomProperties } from '../../base/engine';
import { ISort, IFilter, IFieldOptions, ICalculatedFields, IDataSet } from '../../base/engine';
import { PivotFieldListModel } from './field-list-model';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { LoadEventArgs, EnginePopulatingEventArgs, EnginePopulatedEventArgs, AggregateEventArgs } from '../../common/base/interface';
import { FieldDroppedEventArgs, FieldListRefreshedEventArgs } from '../../common/base/interface';
import { Mode } from '../../common/base/enum';
import { PivotCommon } from '../../common/base/pivot-common';
import { CommonArgs, MemberFilteringEventArgs } from '../../common/base/interface';
import { Render } from '../renderer/renderer';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { TreeViewRenderer } from '../renderer/tree-renderer';
import { AxisTableRenderer } from '../renderer/axis-table-renderer';
import { AxisFieldRenderer } from '../renderer/axis-field-renderer';
import { PivotButton } from '../../common/actions/pivot-button';
import { PivotView } from '../../pivotview/base/pivotview';
import { DataSourceSettingsModel, FieldOptionsModel } from '../../pivotview/model/datasourcesettings-model';
import { DataSourceSettings } from '../../pivotview/model/datasourcesettings';
import { CalculatedField } from '../../common/calculatedfield/calculated-field';
import { PivotContextMenu } from '../../common/popups/context-menu';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { PivotUtil } from '../../base/util';
import { OlapEngine, IOlapFieldListOptions, IOlapCustomProperties, IOlapField } from '../../base/olap/engine';

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
    public pivotFieldList: IFieldListOptions | IOlapFieldListOptions;
    /** @hidden */
    public dataType: string;
    /** @hidden */
    public engineModule: PivotEngine;
    /** @hidden */
    public olapEngineModule: OlapEngine;
    /** @hidden */
    public isDragging: boolean;
    /** @hidden */
    public fieldListSpinnerElement: Element;
    /** @hidden */
    public clonedDataSource: DataSourceSettingsModel;
    /** @hidden */
    public clonedFieldList: IFieldListOptions | IOlapFieldListOptions;

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
    @Complex<DataSourceSettingsModel>({}, DataSourceSettings)
    public dataSourceSettings: DataSourceSettingsModel;

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

    /**
     * If `loadOnDemandInMemberEditor` is set to false, 
     * then it will load all the level members from cube when doing member filtering initially.
     * Note: This may cause performance lag based on members count that fetch from cube 
     * while the member editor pop-up opens for the first time alone.
     * @default true    
     */
    @Property(true)
    public loadOnDemandInMemberEditor: boolean;

    /**
     * It allows to customize the spinner.
     * @default null
     */
    @Property()
    public spinnerTemplate: string;

    //Event Declarations
    /**
     * This allows any customization of Pivot Field List properties before rendering.
     * @event
     * @blazorproperty 'OnLoad'
     */
    @Event()
    public load: EmitType<LoadEventArgs>;

    /**
     * This allows any customization of Pivot Field List properties before pivotengine populate.
     * @event
     * @blazorproperty 'EnginePopulating'
     */
    @Event()
    public enginePopulating: EmitType<EnginePopulatingEventArgs>;

    /**
     * This event triggers before apply filtering.
     * @event
     */
    @Event()
    public memberFiltering: EmitType<MemberFilteringEventArgs>;

    /**
     * This allows any customization of Pivot Field List properties before pivotengine populate.
     * @event
     * @blazorproperty 'EnginePopulated'
     */
    @Event()
    public enginePopulated: EmitType<EnginePopulatedEventArgs>;

    /**
     * Triggers when a field getting dropped into any axis.
     * @event
     * @blazorproperty 'FieldDropped'
     */
    @Event()
    public onFieldDropped: EmitType<FieldDroppedEventArgs>;

    /**
     * This allows to change the cell value.
     * @event
     * @deprecated
     */
    @Event()
    public aggregateCellInfo: EmitType<AggregateEventArgs>;

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
        if (this.dataSourceSettings && this.dataSourceSettings.providerType === 'SSAS') {
            this.olapEngineModule = new OlapEngine();
            this.dataType = 'olap';
        } else {
            this.engineModule = new PivotEngine();
            this.dataType = 'pivot';
        }
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
            CalculatedField: 'Calculated Field',
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
            MoreOption: 'More...',
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
            deferLayoutUpdate: 'Defer Layout Update',
            null: 'null',
            undefined: 'undefined',
            groupOutOfRange: 'Out of Range',
            fieldDropErrorAction: 'The field you are moving cannot be placed in that area of the report',
            memberType: 'Field Type',
            selectedHierarchy: 'Parent Hierarchy',
            formatString: 'Format String',
            expressionField: 'Expression',
            olapDropText: 'Example: [Measures].[Order Quantity] + ([Measures].[Order Quantity] * 0.10)',
            customFormat: 'Enter custom format string',
            Measure: 'Measure',
            Dimension: 'Dimension',
            Standard: 'Standard',
            Currency: 'Currency',
            Percent: 'Percent',
            Custom: 'Custom',
            blank: '(Blank)',
            fieldTooltip: 'Drag and drop fields to create an expression. ' +
                'And, if you want to edit the existing the calculated fields! ' +
                'You can achieve it by simply selecting the field under "Calculated Members".',
            fieldTitle: 'Field Name',
            QuarterYear: 'Quarter Year',
            caption: 'Field Caption',
            copy: 'Copy'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.isDragging = false;
        this.captionData = [];
        this.wireEvent();
    }

    /* tslint:disable-next-line:max-line-length */
    private frameCustomProperties(fieldListData?: IOlapField[], fieldList?: IOlapFieldListOptions): ICustomProperties | IOlapCustomProperties {
        if (this.pivotGridModule) {
            this.pivotGridModule.updatePageSettings(false);
        }
        let pageSettings: IPageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined;
        let isDrillThrough: boolean = this.pivotGridModule ?
            (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true;
        let enableValueSorting: boolean = this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined;
        let customProperties: ICustomProperties | IOlapCustomProperties;
        if (this.dataType === 'olap') {
            customProperties = {
                mode: '',
                savedFieldList: fieldList ? fieldList : undefined,
                savedFieldListData: fieldListData ? fieldListData : undefined,
                pageSettings: pageSettings,
                enableValueSorting: enableValueSorting,
                isDrillThrough: isDrillThrough,
                localeObj: this.localeObj
            };
        } else {
            customProperties = {
                mode: '',
                savedFieldList: undefined,
                pageSettings: pageSettings,
                enableValueSorting: enableValueSorting,
                isDrillThrough: isDrillThrough,
                localeObj: this.localeObj
            };
        }
        return customProperties;
    }

    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    public render(): void {
        this.trigger(events.load, { dataSourceSettings: this.dataSourceSettings }, (observedArgs: LoadEventArgs) => {
            if (isBlazor()) {
                observedArgs.dataSourceSettings.dataSource = this.dataSourceSettings.dataSource;
            }
            this.dataSourceSettings = observedArgs.dataSourceSettings;
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
        });
        if (isBlazor()) {
            this.renderComplete();
        }
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
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['dataSourceSettings'];
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
    private initEngine(): void {
        let args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings)
        };
        this.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
            PivotUtil.updateDataSourceSettings(this, observedArgs.dataSourceSettings);
            if (isBlazor()) {
                this.dataSourceSettings.dataSource = this.engineModule.data as IDataSet[];
            }
            if (this.dataType === 'pivot') {
                if (this.dataSourceSettings.groupSettings && this.dataSourceSettings.groupSettings.length > 0) {
                    let pivotDataSet: IDataSet[];
                    if (isBlazor()) {
                        pivotDataSet = this.engineModule.data as IDataSet[];
                    } else {
                        pivotDataSet = this.dataSourceSettings.dataSource as IDataSet[];
                    }
                    this.clonedDataSet = (this.clonedDataSet ? this.clonedDataSet : PivotUtil.getClonedData(pivotDataSet)) as IDataSet[];
                    this.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
                    this.clonedReport = this.clonedReport ? this.clonedReport : extend({}, this.dataSourceSettings, null, true) as IDataOptions;
                    this.setProperties({ dataSourceSettings: { dataSource: pivotDataSet } }, true);
                }
                this.engineModule.renderEngine(this.dataSourceSettings as IDataOptions, this.frameCustomProperties(), this.getValueCellInfo.bind(this));
                this.pivotFieldList = this.engineModule.fieldList;
                let eventArgs: EnginePopulatedEventArgs = {
                    pivotFieldList: this.pivotFieldList,
                    pivotValues: this.engineModule.pivotValues
                };
                const this$: PivotFieldList = this;
                this.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
                    this$.pivotFieldList = observedArgs.pivotFieldList;
                    this$.engineModule.pivotValues = isBlazor() ? this.engineModule.pivotValues : observedArgs.pivotValues;
                    this$.notify(events.dataReady, {});
                    this$.trigger(events.dataBound);
                });
            } else if (this.dataType === 'olap') {
                this.olapEngineModule.renderEngine(this.dataSourceSettings as IDataOptions,
                    this.frameCustomProperties(this.olapEngineModule.fieldListData, this.olapEngineModule.fieldList));
                this.pivotFieldList = this.olapEngineModule.fieldList;
                let eventArgs: EnginePopulatedEventArgs = {
                    pivotFieldList: this.pivotFieldList,
                    pivotValues: this.olapEngineModule.pivotValues
                };
                const this$: PivotFieldList = this;
                this.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
                    this$.pivotFieldList = observedArgs.pivotFieldList;
                    this$.olapEngineModule.pivotValues = isBlazor() ? this.engineModule.pivotValues : observedArgs.pivotValues;
                    this$.notify(events.dataReady, {});
                    this$.trigger(events.dataBound);
                });
            }
        });
    }
    /* tslint:enable */

    /* tslint:enable */
    private generateData(): void {
        this.pivotFieldList = {};
        if (this.dataSourceSettings && (this.dataSourceSettings.dataSource || this.dataSourceSettings.url)) {
            if ((this.dataSourceSettings.url !== '' && this.dataType === 'olap') ||
                (this.dataSourceSettings.dataSource as IDataSet[]).length > 0) {
                if (this.dataType === 'pivot') {
                    this.engineModule.data = this.dataSourceSettings.dataSource as IDataSet[];
                }
                this.initEngine();
            } else if (this.dataSourceSettings.dataSource instanceof DataManager) {
                setTimeout(this.getData.bind(this), 100);
            }
        } else {
            this.notify(events.dataReady, {});
            this.trigger(events.dataBound);
        }
    }

    private getValueCellInfo(aggregateObj: AggregateEventArgs): AggregateEventArgs {
        let args: AggregateEventArgs = aggregateObj;
        this.trigger(events.aggregateCellInfo, args);
        return args;
    }

    private getData(): void {
        (this.dataSourceSettings.dataSource as DataManager).executeQuery(new Query()).then(this.executeQuery.bind(this));
    }

    private executeQuery(e: ReturnOption): void {
        this.engineModule.data = (e.result as IDataSet[]);
        this.initEngine();
    }

    private fieldListRender(): void {
        this.element.innerHTML = '';
        if (this.renderMode === 'Popup' && this.dialogRenderer.fieldListDialog && !this.dialogRenderer.fieldListDialog.isDestroyed) {
            this.dialogRenderer.fieldListDialog.destroy();
            remove(document.getElementById(this.element.id + '_Wrapper'));
        }
        this.renderModule.render();
        this.fieldListSpinnerElement = this.renderMode === 'Popup' ?
            this.dialogRenderer.fieldListDialog.element : this.element.querySelector('.e-pivotfieldlist-wrapper');
        if (this.spinnerTemplate) {
            createSpinner({ target: this.fieldListSpinnerElement as HTMLElement, template: this.spinnerTemplate }, this.createElement);
        } else {
            createSpinner({ target: this.fieldListSpinnerElement as HTMLElement }, this.createElement);
        }
        let args: CommonArgs;
        args = {
            pivotEngine: this.dataType === 'olap' ? this.olapEngineModule : this.engineModule,
            dataSourceSettings: this.dataSourceSettings as IDataOptions,
            id: this.element.id,
            element: document.getElementById(this.element.id + '_Wrapper'),
            moduleName: this.getModuleName(),
            enableRtl: this.enableRtl,
            isAdaptive: this.isAdaptive as boolean,
            renderMode: this.renderMode,
            localeObj: this.localeObj,
            dataType: this.dataType
        };
        this.pivotCommon = new PivotCommon(args);
        this.pivotCommon.control = this;
        if (this.allowDeferLayoutUpdate) {
            this.clonedDataSource = extend({}, this.dataSourceSettings, null, true) as IDataOptions;
            this.clonedFieldList = extend({}, this.pivotFieldList, null, true) as IFieldListOptions;
        }
    }
    private getFieldCaption(dataSourceSettings: DataSourceSettingsModel): void {
        this.getFields(dataSourceSettings);
        if (this.captionData.length > 0) {
            let lnt: number = this.captionData.length;
            let engineModule: OlapEngine | PivotEngine = this.dataType === 'olap' ? this.olapEngineModule : this.engineModule;
            while (lnt--) {
                if (this.captionData[lnt]) {
                    for (let obj of this.captionData[lnt]) {
                        if (obj) {
                            if (engineModule.fieldList[obj.name]) {
                                if (obj.caption) {
                                    engineModule.fieldList[obj.name].caption = obj.caption;
                                } else {
                                    engineModule.fieldList[obj.name].caption = obj.name;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return;
        }
    }
    private getFields(dataSourceSettings: DataSourceSettingsModel): void {
        /* tslint:disable-next-line:max-line-length */
        this.captionData = [dataSourceSettings.rows, dataSourceSettings.columns, dataSourceSettings.values, dataSourceSettings.filters] as FieldOptionsModel[][];
    }

    /* tslint:disable:max-func-body-length */
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
        let pivot: PivotFieldList = this;
        //setTimeout(() => {
        let isOlapDataRefreshed: boolean = false;
        let pageSettings: IPageSettings = pivot.pivotGridModule && pivot.pivotGridModule.enableVirtualization ?
            pivot.pivotGridModule.pageSettings : undefined;
        let isCalcChange: boolean = Object.keys(pivot.lastCalcFieldInfo).length > 0 ? true : false;
        let isSorted: boolean = Object.keys(pivot.lastSortInfo).length > 0 ? true : false;
        let lastSortInfo: ISort = pivot.lastSortInfo;
        if (pivot.pivotGridModule && pivot.dataType === 'pivot') {
            pivot.pivotGridModule.lastSortInfo = {};
        }
        pivot.lastSortInfo = {};
        let isAggChange: boolean = Object.keys(pivot.lastAggregationInfo).length > 0 ? true : false;
        let isFiltered: boolean = Object.keys(pivot.lastFilterInfo).length > 0 ? true : false;
        let args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(pivot.dataSourceSettings)
        };
        pivot.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
            if (!(pageSettings && (isSorted || isFiltered || isAggChange || isCalcChange))) {
                PivotUtil.updateDataSourceSettings(pivot, observedArgs.dataSourceSettings);
                PivotUtil.updateDataSourceSettings(pivot.pivotGridModule, observedArgs.dataSourceSettings);
            }
            if (isNullOrUndefined(isEngineRefresh)) {
                if (pivot.dataType === 'pivot') {
                    let customProperties: ICustomProperties = pivot.frameCustomProperties();
                    customProperties.savedFieldList = pivot.pivotFieldList;
                    if (pageSettings && (isSorted || isFiltered || isAggChange || isCalcChange)) {
                        if (isSorted) {
                            pivot.pivotGridModule.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                            pivot.engineModule.onSort(lastSortInfo);
                        }
                        if (isFiltered) {
                            pivot.engineModule.onFilter(pivot.lastFilterInfo, pivot.dataSourceSettings as IDataOptions);
                            pivot.lastFilterInfo = {};
                        }
                        if (isAggChange) {
                            pivot.engineModule.onAggregation(pivot.lastAggregationInfo);
                            pivot.lastAggregationInfo = {};
                        }
                        if (isCalcChange) {
                            pivot.engineModule.onCalcOperation(pivot.lastCalcFieldInfo);
                            pivot.lastCalcFieldInfo = {};
                        }
                    } else {
                        /* tslint:disable-next-line:max-line-length */
                        pivot.engineModule.renderEngine(pivot.dataSourceSettings as IDataOptions, customProperties, pivot.getValueCellInfo.bind(pivot));
                    }
                } else {
                    isOlapDataRefreshed = pivot.updateOlapDataSource(pivot, isSorted, isCalcChange, isOlapDataRefreshed);
                }
                pivot.getFieldCaption(pivot.dataSourceSettings);
            } else {
                pivot.axisFieldModule.render();
                pivot.isRequiredUpdate = false;
            }
            let eventArgs: EnginePopulatedEventArgs = {
                dataSourceSettings: pivot.dataSourceSettings as IDataOptions,
                pivotFieldList: pivot.dataType === 'pivot' ? pivot.engineModule.fieldList : pivot.olapEngineModule.fieldList,
                pivotValues: pivot.dataType === 'pivot' ? pivot.engineModule.pivotValues : pivot.olapEngineModule.pivotValues
            };
            pivot.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
                let dataSource: IDataSet[] | DataManager = pivot.dataSourceSettings.dataSource;
                if (isBlazor() && observedArgs.dataSourceSettings.dataSource instanceof Object) {
                    observedArgs.dataSourceSettings.dataSource = dataSource;
                }
                pivot.dataSourceSettings = observedArgs.dataSourceSettings;
                pivot.pivotCommon.dataSourceSettings = pivot.dataSourceSettings as IDataOptions;
                pivot.pivotFieldList = observedArgs.pivotFieldList;
                if (pivot.dataType === 'olap') {
                    pivot.olapEngineModule.pivotValues = isBlazor() ? pivot.olapEngineModule.pivotValues : observedArgs.pivotValues;
                    pivot.pivotCommon.engineModule = pivot.olapEngineModule;
                } else {
                    pivot.engineModule.pivotValues = isBlazor() ? pivot.engineModule.pivotValues : observedArgs.pivotValues;
                    pivot.pivotCommon.engineModule = pivot.engineModule;
                }
                if (!isTreeViewRefresh && pivot.treeViewModule.fieldTable && !pivot.isAdaptive) {
                    pivot.notify(events.treeViewUpdate, {});
                }
                if (pivot.isRequiredUpdate) {
                    if (pivot.allowDeferLayoutUpdate) {
                        pivot.clonedDataSource = extend({}, pivot.dataSourceSettings, null, true) as IDataOptions;
                        pivot.clonedFieldList = extend({}, pivot.pivotFieldList, null, true) as IFieldListOptions;
                    }
                    pivot.updateView(pivot.pivotGridModule);
                } else if (pivot.renderMode === 'Popup' && pivot.allowDeferLayoutUpdate) {
                    pivot.pivotGridModule.engineModule = pivot.engineModule;
                    /* tslint:disable:align */
                    pivot.pivotGridModule.setProperties({
                        dataSourceSettings: (<{ [key: string]: Object }>pivot.dataSourceSettings).properties as IDataOptions
                    }, true);
                    pivot.pivotGridModule.notify(events.uiUpdate, pivot);
                    hideSpinner(pivot.fieldListSpinnerElement as HTMLElement);
                }
                if (pivot.renderMode === 'Popup' && pivot.pivotGridModule &&
                    pivot.pivotGridModule.allowDeferLayoutUpdate && !pivot.isRequiredUpdate) {
                    hideSpinner(pivot.fieldListSpinnerElement as HTMLElement);
                    hideSpinner(pivot.pivotGridModule.element);
                }
                pivot.isRequiredUpdate = true;
                if (!pivot.pivotGridModule || isOlapDataRefreshed) {
                    hideSpinner(pivot.fieldListSpinnerElement as HTMLElement);
                } else {
                    pivot.pivotGridModule.fieldListSpinnerElement = pivot.fieldListSpinnerElement as HTMLElement;
                }
            });
        });
        //});
    }
    /* tslint:enable */

    private updateOlapDataSource(pivot: PivotFieldList, isSorted: boolean, isCalcChange: boolean, isOlapDataRefreshed: boolean): boolean {
        let customProperties: IOlapCustomProperties =
            pivot.frameCustomProperties(pivot.olapEngineModule.fieldListData, pivot.olapEngineModule.fieldList);
        customProperties.savedFieldList = pivot.pivotFieldList;
        if (isCalcChange || isSorted) {
            pivot.olapEngineModule.savedFieldList = pivot.pivotFieldList;
            pivot.olapEngineModule.savedFieldListData = pivot.olapEngineModule.fieldListData;
            if (isCalcChange) {
                pivot.olapEngineModule.updateCalcFields(pivot.dataSourceSettings as IDataOptions, pivot.lastCalcFieldInfo);
                pivot.lastCalcFieldInfo = {};
                isOlapDataRefreshed = pivot.olapEngineModule.dataFields[pivot.lastCalcFieldInfo.name] ? false : true;
                if (pivot.pivotGridModule) {
                    hideSpinner(pivot.pivotGridModule.element);
                }
            } else {
                pivot.olapEngineModule.onSort(pivot.dataSourceSettings as IDataOptions);
            }
        } else {
            pivot.olapEngineModule.renderEngine(pivot.dataSourceSettings as IDataOptions, customProperties);
        }
        return isOlapDataRefreshed;
    }
    /**
     * Updates the Pivot Field List component using dataSource from PivotView component.
     * @method updateControl
     * @return {void}
     */
    public update(control: PivotView): void {
        if (isBlazor() && control !== undefined) {
            /* tslint:disable */
            let pivotId: string = (<any>control).ID as string
            let pivotInstance: PivotView = getInstance('#' + pivotId, PivotView) as PivotView;
            control = pivotInstance;
            /* tslint:enable */
        }
        if (control) {
            this.clonedDataSet = control.clonedDataSet;
            this.setProperties({ dataSourceSettings: control.dataSourceSettings }, true);
            this.engineModule = control.engineModule;
            this.olapEngineModule = control.olapEngineModule;
            this.dataType = control.dataType;
            this.pivotFieldList = this.dataType === 'olap' ? control.olapEngineModule.fieldList : control.engineModule.fieldList;
            if (this.renderMode === 'Popup') {
                this.pivotGridModule = control;
            }
            this.getFieldCaption(control.dataSourceSettings);
            this.pivotCommon.engineModule = this.dataType === 'olap' ? this.olapEngineModule : this.engineModule;
            this.pivotCommon.dataSourceSettings = this.dataSourceSettings as IDataOptions;
            this.pivotCommon.control = this;
            if (this.treeViewModule.fieldTable && !this.isAdaptive) {
                this.notify(events.treeViewUpdate, {});
            }
            this.axisFieldModule.render();
            if (this.renderMode === 'Fixed' && this.allowDeferLayoutUpdate) {
                this.clonedDataSource = extend({}, this.dataSourceSettings, null, true) as IDataOptions;
                this.clonedFieldList = extend({}, this.pivotFieldList, null, true) as IFieldListOptions;
            }
        }
    }

    /**
     * Updates the PivotView component using dataSource from Pivot Field List component.
     * @method refreshTargetControl
     * @return {void}
     */
    public updateView(control: PivotView): void {
        if (isBlazor() && control !== undefined) {
            /* tslint:disable */
            let pivotId: string = (<any>control).ID as string
            let pivotInstance: PivotView = getInstance('#' + pivotId, PivotView) as PivotView;
            control = pivotInstance;
            /* tslint:enable */
        }
        if (control) {
            control.clonedDataSet = this.clonedDataSet;
            control.setProperties({ dataSourceSettings: this.dataSourceSettings }, true);
            control.engineModule = this.engineModule;
            control.olapEngineModule = this.olapEngineModule;
            control.dataType = this.dataType;
            control.pivotValues = this.dataType === 'olap' ? this.olapEngineModule.pivotValues : this.engineModule.pivotValues;
            let eventArgs: FieldListRefreshedEventArgs = {
                dataSourceSettings: control.dataSourceSettings,
                pivotValues: control.pivotValues
            };
            control.trigger(events.fieldListRefreshed, eventArgs);
            control.dataBind();
        }
    }

    /**
     * Called internally to trigger populate event.
     * @hidden
     */
    public triggerPopulateEvent(): void {
        let eventArgs: EnginePopulatedEventArgs = {
            dataSourceSettings: this.dataSourceSettings as IDataOptions,
            pivotFieldList: this.dataType === 'olap' ? this.olapEngineModule.fieldList : this.engineModule.fieldList,
            pivotValues: this.dataType === 'olap' ? this.olapEngineModule.pivotValues : this.engineModule.pivotValues
        };
        this.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
            this.dataSourceSettings = observedArgs.dataSourceSettings;
            this.pivotFieldList = observedArgs.pivotFieldList;
            if (this.dataType === 'olap') {
                this.olapEngineModule.pivotValues = isBlazor() ? this.olapEngineModule.pivotValues : observedArgs.pivotValues;
            } else {
                this.engineModule.pivotValues = isBlazor() ? this.engineModule.pivotValues : observedArgs.pivotValues;
            }
        });
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


