import { Property, Event, Component, EmitType, Internationalization, extend, isBlazor } from '@syncfusion/ej2-base';
import { L10n, remove, addClass, Browser, Complex, ModuleDeclaration, getInstance } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';
import { PivotEngine, IFieldListOptions, IPageSettings, IDataOptions, ICustomProperties, IDrilledItem } from '../../base/engine';
import { ISort, IFilter, IFieldOptions, ICalculatedFields, IDataSet } from '../../base/engine';
import { PivotFieldListModel } from './field-list-model';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { LoadEventArgs, EnginePopulatingEventArgs, EnginePopulatedEventArgs } from '../../common/base/interface';
import { AggregateEventArgs, CalculatedFieldCreateEventArgs, AggregateMenuOpenEventArgs } from '../../common/base/interface';
import { FieldDroppedEventArgs, FieldListRefreshedEventArgs, FieldDropEventArgs } from '../../common/base/interface';
import { FieldDragStartEventArgs, FieldRemoveEventArgs } from '../../common/base/interface';
import { CommonArgs, MemberFilteringEventArgs, MemberEditorOpenEventArgs } from '../../common/base/interface';
import { Mode, AggregateTypes } from '../../common/base/enum';
import { PivotCommon } from '../../common/base/pivot-common';
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
    public localDataSourceSetting: any;
    /** @hidden */
    public isDragging: boolean;
    /** @hidden */
    public fieldListSpinnerElement: Element;
    /** @hidden */
    public clonedDataSource: DataSourceSettingsModel;
    /** @hidden */
    public clonedFieldList: IFieldListOptions | IOlapFieldListOptions;
    /** @hidden */
    public pivotChange: boolean = false;

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
    /** @hidden */
    public isPopupView: boolean = false;
    /** @hidden */
    public filterTargetID: HTMLElement;
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
    /** @hidden */
    public currentAction: string;
    /** @hidden */
    private staticPivotGridModule: PivotView;
    /** @hidden */
    public enableValueSorting: boolean = false;
    private request: XMLHttpRequest = new XMLHttpRequest();
    private remoteData: string[][] | IDataSet[] = [];
    /** @hidden */
    public guid: string;
    //Property Declarations

    /* tslint:disable */
    /** 
     * Allows the following pivot report information such as rows, columns, values, filters, etc., that are used to render the pivot table and field list.
     * * `catalog`: Allows to set the database name of SSAS cube as string type that used to retrieve the data from the specified connection string. **Note: It is applicable only for OLAP data source.**
     * * `cube`: Allows you to set the SSAS cube name as string type that used to retrieve data for pivot table rendering. **Note: It is applicable only for OLAP data source.**
     * * `providerType`: Allows to set the provider type to identify the given connection is either Relational or SSAS to render the pivot table and field list. **Note: It is applicable only for OLAP data source.**
     * * `url`: Allows to set the URL as string type, which helps to identify the service endpoint where the data are processed and retrieved to render the pivot table and field list. **Note: It is applicable only for OLAP data source.**
     * * `localeIdentifier`: Allows you to set the specific culture code as number type to render pivot table with desired localization. 
     * By default, the pivot table displays with culture code **1033**, which indicates "en-US" locale. **Note: It is applicale only for OLAP data source.**
     * * `dataSource`: Allows you to set the data source to the pivot report either as JSON data collection or from remote data server using DataManager to the render the pivot that and field list. **Note: It is applicable only for relational data source.**
     * * `rows`: Allows specific fields associated with field information that needs to be displayed in row axis of pivot table.
     * * `columns`: Allows specific fields associated with field information that needs to be displayed in column axis of pivot table.
     * * `values`: Allows specific fields associated with field information that needs to be displayed as aggregated numeric values in pivot table.
     * * `filters`: Allows to filter the values in other axis based on the collection of filter fields in pivot table.
     * * `excludeFields`: Allows you to restrict the specific field(s) from displaying it in the field list UI. 
     * You may also be unable to render the pivot table with this field(s) by doing so. **Note: It is applicable only for relational data source.**
     * * `expandAll`: Allows you to either expand or collapse all the headers that are displayed in the pivot table. 
     * By default, all the headers are collapsed in the pivot table. **Note: It is applicable only for Relational data.**
     * * `valueAxis`: Allows you to set the value fields that to be plotted either in row or column axis in the pivot table.
     * * `filterSettings`: Allows specific fields associated with either selective or conditional-based filter members that used to be displayed in the pivot table.
     * * `sortSettings`: Allows specific fields associated with sort settings to order their members either in ascending or descending that used to be displayed in the pivot table. 
     * By default, the data source containing fields are display with Ascending order alone. To use this option, it requires the `enableSorting` property to be **true**.
     * * `enableSorting`: Allows to perform sort operation to order members of a specific fields either in ascending or descending that used to be displayed in the pivot table.
     * * `formatSettings`: Allows specific fields used to display the values with specific format that used to be displayed in the pivot table. 
     * For example, to display a specific field with currency formatted values in the pivot table, the set the `format` property to be **C**.
     * * `drilledMembers`: Allows specific fields to with specify the headers that used to be either expanded or collapsed in the pivot table.
     * * `valueSortSettings`: Allows to sort individual value field and its aggregated values either in row or column axis to ascending or descending order.
     * * `calculatedFieldSettings`: Allows to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
     * * `allowMemberFilter`: Allows to perform filter operation based on the selective filter members of the specific fields used to be displayed in the pivot table.
     * * `allowLabelFilter`: Allows to perform filter operation based on the selective headers used to be displayed in the pivot table.
     * * `allowValueFilter`: Allows to perform filter operation based only on value fields and its resultant aggregated values over other fields defined in row and column axes that used to be displayed in the pivot table.
     * * `showSubTotals`: Allows to show or hide sub-totals in both rows and columns axis of the pivot table.
     * * `showRowSubTotals`: Allows to show or hide sub-totals in row axis of the pivot table.
     * * `showColumnSubTotals`: Allows to show or hide sub-totals in column axis of the pivot table.
     * * `showGrandTotals`: Allows to show or hide grand totals in both rows and columns axis of the pivot table.
     * * `showRowGrandTotals`: Allows to show or hide grand totals in row axis of the pivot table.
     * * `showColumnGrandTotals`: Allows to show or hide grand totals in column axis of the pivot table.
     * * `showHeaderWhenEmpty`: Allows the undefined headers to be displayed in the pivot table, when the specific field(s) are not defined in the raw data. 
     * For example, if the raw data for the field ‘Country’ is defined as “United Kingdom” and “State” is not defined means, it will be shown as “United Kingdom >> Undefined” in the header section.
     * * `alwaysShowValueHeader`: Allows to show the value field header always in pivot table, even if it holds a single field in the value field axis.
     * * `conditionalFormatSettings`: Allows a collection of values fields to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions.
     * * `emptyCellsTextContent`: Allows to show custom string to the empty value cells that used to display in the pivot table. You can fill empty value cells with any value like “0”, ”-”, ”*”, “(blank)”, etc.
     * * `groupSettings`: Allows specific fields to group their data on the basis of their type. 
     * For example, the date type fields can be formatted and displayed based on year, quarter, month, and more. Likewise, the number type fields can be grouped range-wise, such as 1-5, 6-10, etc. 
     * You can perform custom group to the string type fields that used to displayed in the pivot table.
     * * `authentication`: Allows you to set the credential information to access the specified SSAS cube. Note: It is applicable only for OLAP data source.
     */
    @Complex<DataSourceSettingsModel>({}, DataSourceSettings)
    public dataSourceSettings: DataSourceSettingsModel;

    /**
     * Allows to show field list either in static or popup mode. The available modes are:
     * * `Popup`: To display the field list icon in pivot table UI to invoke the built-in dialog. 
     * It hepls to display over the pivot table UI without affecting any form of UI shrink within a web page.
     * * `Fixed`: To display the field list in a static position within a web page.
     * @default 'Popup'
     */
    @Property('Popup')
    public renderMode: Mode;

    /**
     * Allows you to set the specific target element to the fieldlist dialog. 
     * This helps the field list dialog to display the appropriate position on its target element.  
     * > To use thsi option, set the property `renderMode` to be **Popup**.
     * @default null
     */
    @Property()
    public target: HTMLElement | string;

    /**
     * Allows you to add the CSS class name to the field list element. 
     * Use this class name, you can customize the field list easily at your end.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Allows the built-in calculated field dialog to be displayed in the component. 
     * You can view the calculated field dialog by clicking the "Calculated Field" button in the field list UI. 
     * This dialog will helps you to create a new calculated field in the pivot table, based on available fields from the bound data source or using simple formula with basic arithmetic operators at runtime.
     * @default false
     */
    @Property(false)
    public allowCalculatedField: boolean;

    /**
     * Allows you to create a pivot button with "Values" as a caption used to display in the field list UI. 
     * It helps you to plot the value fields to either column or row axis during runtime.
     * > The showValuesButton property is enabled by default for the OLAP data source. 
     * And the pivot button can be displayed with "Measures" as a caption used to display in the field list UI.
     * @default false
     */
    @Property(false)
    public showValuesButton: boolean;

    /**
     * Allows the pivot table component to be updated only on demand, meaning, 
     * you can perform a variety of operations such as drag-and-drop fields between row, column, value and filter axes, 
     * apply sorting and filtering inside the Field List, resulting the field list UI would be updated on its own, but not the pivot table.
     * On clicking the “Apply” button in the Field List, the pivot table will updates the last modified report. 
     * This helps to improve the performance of the pivot table component rendering.
     * @default false
     */
    @Property(false)
    public allowDeferLayoutUpdate: boolean;

    /**
     * Allows you to set the limit for displaying members while loading large data in the member filter dialog. 
     * Based on this limit, initial loading will be completed quickly without any performance constraint.
     * A message with remaining member count, that are not currently shown in the member filter dialog UI, will be displayed in the member editor.
     * > This property is not applicable to user-defined hierarchies in the OLAP data source.
     * @default 1000    
     */
    @Property(1000)
    public maxNodeLimitInMemberEditor: number;

    /**
     * Allows to load members inside the member filter dialog on-demand. 
     * The first level members will be loaded from the OLAP cube to display the member editor by default. 
     * As a result, the member editor will be opened quickly, without any performance constraints.
     * You can use either of the following actions to load  your next level members. The actions are: 
     * * By clicking on the respective member's expander button. By doing so, only the child members of the respective member will be loaded. 
     * * Choose the level from the drop-down button. By doing so, all the members up to the level chosen will be loaded from the cube.
     * 
     * Also, searching members will only be considered for the level members that are loaded.
     * > This property is applicable only for OLAP data source.
     * @default true    
     */
    @Property(true)
    public loadOnDemandInMemberEditor: boolean;

    /**
     * Allows the appearance of the loading indicator to be customized with either an HTML string or the element’s ID, 
     * that can be used to displayed with custom formats in the field list UI.
     * @default null
     */
    @Property()
    public spinnerTemplate: string;

    /**
     * Allows you to show a menu with built-in aggregate options displayed in the pivot button's dropdown icon of fieldList UI. 
     * These aggregate options help to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… easily at runtime. 
     * The available aggregate options are:
     * * `Sum`: Allows to display the pivot table values with sum.
     * * `Product`: Allows to display the pivot table values with product.
     * * `Count`: Allows to display the pivot table values with count.
     * * `DistinctCount`: Allows to display the pivot table values with distinct count.
     * * `Min`: Allows to display the pivot table with minimum value.
     * * `Max`: Allows to display the pivot table with maximum value.
     * * `Avg`: Allows to display the pivot table values with average.
     * * `Index`: Allows to display the pivot table values with index.
     * * `PopulationStDev`: Allows to display the pivot table values with population standard deviation.
     * * `SampleStDev`: Allows to display the pivot table values with sample standard deviation.
     * * `PopulationVar`: Allows to display the pivot table values with population variance.
     * * `SampleVar`: Allows to display the pivot table values with sample variance.
     * * `RunningTotals`: Allows to display the pivot table values with running totals.
     * * `DifferenceFrom`: Allows to display the pivot table values with difference from the value of the base item in the base field.
     * * `PercentageOfDifferenceFrom`: Allows to display the pivot table values with percentage difference from the value of the base item in the base field.
     * * `PercentageOfGrandTotal`: Allows to display the pivot table values with percentage of grand total of all values.
     * * `PercentageOfColumnTotal`: Allows to display the pivot table values in each column with percentage of total values for the column.
     * * `PercentageOfRowTotal`: Allows to display the pivot table values in each row with percentage of total values for the row.
     * * `PercentageOfParentTotal`: Allows to display the pivot table values with percentage of total of all values based on selected field.
     * * `PercentageOfParentColumnTotal`: Allows to display the pivot table values with percentage of its parent total in each column.
     * * `PercentageOfParentRowTotal`: Allows to display the pivot table values with percentage of its parent total in each row.
     * 
     * > It is applicable ony for Relational data.
     * @default ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index', 'PopulationVar', 'SampleVar',
     * 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal',
     * 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal', 'DifferenceFrom', 'PercentageOfDifferenceFrom',
     * 'PercentageOfParentTotal']
     */
    /* tslint:disable-next-line:max-line-length */
    @Property(['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index', 'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal', 'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'])
    public aggregateTypes: AggregateTypes[];

    //Event Declarations
    /**
     * It allows any customization of Pivot Field List properties on initial rendering.
     * Based on the changes, the pivot field list will be redered.
     * @event
     * @blazorproperty 'OnLoad'
     */
    @Event()
    public load: EmitType<LoadEventArgs>;

    /**
     * It triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings. 
     * @event
     * @blazorproperty 'EnginePopulating'
     */
    @Event()
    public enginePopulating: EmitType<EnginePopulatingEventArgs>;

    /**
     * It triggers before the filtering applied.
     * @event
     */
    @Event()
    public memberFiltering: EmitType<MemberFilteringEventArgs>;

    /**
     * It triggers after the pivot engine populated and allows to customize the pivot datasource settings.
     * @event
     * @blazorproperty 'EnginePopulated'
     */
    @Event()
    public enginePopulated: EmitType<EnginePopulatedEventArgs>;

    /**
     * It trigger when a field getting dropped into any axis.
     * @event
     * @blazorproperty 'FieldDropped'
     */
    @Event()
    public onFieldDropped: EmitType<FieldDroppedEventArgs>;

    /**
     * It triggers before a field drops into any axis.
     * @event
     * @blazorproperty 'fieldDrop'
     */
    @Event()
    public fieldDrop: EmitType<FieldDropEventArgs>;

    /**
     * It trigger when a field drag (move) starts.
     * @event
     * @blazorproperty 'FieldDragStart'
     */
    @Event()
    public fieldDragStart: EmitType<FieldDragStartEventArgs>;

    /**
     * It allows to change the each cell value during engine populating.
     * @event
     * @deprecated
     */
    @Event()
    public aggregateCellInfo: EmitType<AggregateEventArgs>;

    /**
     * It triggers before member editor dialog opens.
     * @event
     * @blazorproperty 'MemberEditorOpen'
     */
    @Event()
    public memberEditorOpen: EmitType<MemberEditorOpenEventArgs>;

    /**
     * It triggers before a calculated field created/edited during runtime.
     * @event
     * @blazorproperty 'CalculatedFieldCreate'
     */
    @Event()
    public calculatedFieldCreate: EmitType<CalculatedFieldCreateEventArgs>;

    /**
     * It triggers before aggregate type context menu opens.
     * @event
     * @blazorproperty 'AggregateMenuOpen'
     */
    @Event()
    public aggregateMenuOpen: EmitType<AggregateMenuOpenEventArgs>;

    /**
     * It triggers before removing the field from any axis during runtime.
     * @event
     * @blazorproperty 'FieldRemove'
     */
    @Event()
    public fieldRemove: EmitType<FieldRemoveEventArgs>;

    /** 
     * It trigger when the Pivot Field List rendered.
     * @event
     */
    @Event()
    public dataBound: EmitType<Object>;

    /** 
     * It trigger when the Pivot Field List component is created..
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /** 
     * It trigger when the Pivot Field List component getting destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;
    /* tslint:enable */

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
     * @hidden
     */
    public getAllSummaryType(): AggregateTypes[] {
        return ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index',
            'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal',
            'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal',
            'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
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
            clearCalculatedField: 'Clear edited field info',
            editCalculatedField: 'Edit calculated field',
            sortAscending: 'Sort ascending order',
            sortDescending: 'Sort descending order',
            sortNone: 'Sort data order',
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
            apply: 'Apply',
            valueFieldSettings: 'Value field settings',
            sourceName: 'Field name :',
            sourceCaption: 'Field caption',
            summarizeValuesBy: 'Summarize values by',
            baseField: 'Base field',
            baseItem: 'Base item',
            example: 'e.g:',
            editorDataLimitMsg: ' more items. Search to refine further.',
            deferLayoutUpdate: 'Defer Layout Update',
            null: 'null',
            undefined: 'undefined',
            groupOutOfRange: 'Out of Range',
            fieldDropErrorAction: 'The field you are moving cannot be placed in that area of the report',
            memberType: 'Field Type',
            selectedHierarchy: 'Parent Hierarchy',
            formatString: 'Format',
            expressionField: 'Expression',
            olapDropText: 'Example: [Measures].[Order Quantity] + ([Measures].[Order Quantity] * 0.10)',
            customFormat: 'Enter custom format string',
            numberFormatString: 'Example: C, P, 0000 %, ###0.##0#, etc.',
            Measure: 'Measure',
            Dimension: 'Dimension',
            Standard: 'Standard',
            Currency: 'Currency',
            Percent: 'Percent',
            Custom: 'Custom',
            blank: '(Blank)',
            fieldTooltip: 'Drag and drop fields to create an expression. ' +
                'And, if you want to edit the existing calculated fields! ' +
                'You can achieve it by simply selecting the field under "Calculated Members".',
            fieldTitle: 'Field Name',
            QuarterYear: 'Quarter Year',
            caption: 'Field Caption',
            copy: 'Copy',
            of: 'of',
            group: 'Group',
            removeCalculatedField: 'Are you sure you want to delete this calculated field?',
            yes: 'Yes',
            no: 'No',
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
        let localeObj: L10n = this.pivotGridModule ? this.pivotGridModule.localeObj :
            (this.staticPivotGridModule ? this.staticPivotGridModule.localeObj : this.localeObj);
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
                localeObj: localeObj
            };
        } else {
            customProperties = {
                mode: '',
                savedFieldList: undefined,
                pageSettings: pageSettings,
                enableValueSorting: enableValueSorting,
                isDrillThrough: isDrillThrough,
                localeObj: localeObj
            };
        }
        return customProperties;
    }

    /* tslint:disable */
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    public render(): void {
        if (this.dataType === 'pivot' && this.dataSourceSettings.url && this.dataSourceSettings.url !== '') {
            if (this.dataSourceSettings.mode === 'Server') {
                this.guid = PivotUtil.generateUUID();
                this.getEngine('initialRender', null, null, null, null, null, null);
            } else {
                this.request.open("GET", this.dataSourceSettings.url, true);
                this.request.withCredentials = false;
                this.request.onreadystatechange = this.onReadyStateChange.bind(this);
                this.request.setRequestHeader("Content-type", "text/plain");
                this.request.send(null);
            }
        } else {
            this.initialLoad();
        }
    }

    /**
     * @hidden
     */
    public getEngine(action: string, drillItem?: IDrilledItem, sortItem?: ISort, aggField?: IFieldOptions, cField?: ICalculatedFields, filterItem?: IFilter, memberName?: string, rawDataArgs?: any, editArgs?: any): void {
        this.currentAction = action;
        if (this.pivotGridModule) {
            this.pivotGridModule.updatePageSettings(false);
        }
        let customProperties: any = {
            pageSettings: this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined,
            enableValueSorting: this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined,
            enableDrillThrough: this.pivotGridModule ?
            (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true,
            locale: JSON.stringify(PivotUtil.getLocalizedObject(this))
        };
        let params: any = {
            dataSourceSettings: JSON.parse(this.getPersistData()).dataSourceSettings,
            action: action,
            customProperties: customProperties,
            drillItem: drillItem,
            sortItem: sortItem,
            aggregatedItem: aggField,
            calculatedItem: cField,
            filterItem: filterItem,
            memberName: memberName,
            fetchRawDataArgs: rawDataArgs,
            editArgs: editArgs,
            hash: this.guid
        };
        this.request.open("POST", this.dataSourceSettings.url, true);
        this.request.withCredentials = false;
        this.request.onreadystatechange = this.onSuccess.bind(this);
        this.request.setRequestHeader("Content-type", "application/json");
        this.request.send(JSON.stringify(params));
    }

    private onSuccess(): void {
        if (this.request.readyState === XMLHttpRequest.DONE) {
            try {
                let engine: any = JSON.parse(this.request.responseText);
                if (this.currentAction === 'fetchFieldMembers') {
                    let currentMembers: any = JSON.parse(engine.members);
                    let dateMembers: any = [];
                    let formattedMembers: any = {};
                    let members: any = {};
                    for (let i: number = 0; i < currentMembers.length; i++) {
                        dateMembers.push({ formattedText: currentMembers[i].FormattedText, actualText: currentMembers[i].ActualText });
                        formattedMembers[currentMembers[i].FormattedText] = {};
                        members[currentMembers[i].ActualText] = {};
                    }
                    this.engineModule.fieldList[engine.memberName].dateMember = dateMembers;
                    this.engineModule.fieldList[engine.memberName].formattedMembers = formattedMembers;
                    this.engineModule.fieldList[engine.memberName].members = members;
                    this.pivotButtonModule.updateFilterEvents();
                } else {
                    this.engineModule.fieldList = PivotUtil.formatFieldList(JSON.parse(engine.fieldList));
                    this.engineModule.fields = JSON.parse(engine.fields);
                    this.engineModule.rowCount = JSON.parse(engine.pivotCount).RowCount;
                    this.engineModule.columnCount = JSON.parse(engine.pivotCount).ColumnCount;
                    this.engineModule.rowStartPos = JSON.parse(engine.pivotCount).RowStartPosition;
                    this.engineModule.colStartPos = JSON.parse(engine.pivotCount).ColumnStartPosition;
                    this.engineModule.rowFirstLvl = JSON.parse(engine.pivotCount).RowFirstLevel;
                    this.engineModule.colFirstLvl = JSON.parse(engine.pivotCount).ColumnFirstLevel;
                    let rowPos: number;
                    let pivotValues: any = PivotUtil.formatPivotValues(JSON.parse(engine.pivotValue));
                    for (let rCnt: number = 0; rCnt < pivotValues.length; rCnt++) {
                        if (pivotValues[rCnt] && pivotValues[rCnt][0] && pivotValues[rCnt][0].axis === 'row') {
                            rowPos = rCnt;
                            break;
                        }
                    }
                    this.engineModule.headerContent = PivotUtil.frameContent(pivotValues, 'header', rowPos, this);
                    this.engineModule.pageSettings = this.pivotGridModule ?  this.pivotGridModule.pageSettings : undefined;
                    let valueSort: any = JSON.parse(engine.valueSortSettings);
                    this.engineModule.valueSortSettings = { 
                        headerText: valueSort.HeaderText,
                        headerDelimiter: valueSort.HeaderDelimiter,
                        sortOrder: valueSort.SortOrder,
                        columnIndex: valueSort.ColumnIndex
                    };
                    this.engineModule.pivotValues = pivotValues;
                }
            } catch (error) {
                this.engineModule.pivotValues = [];
            }
            if (this.currentAction !== 'fetchFieldMembers') {
                this.initEngine();
                if (this.calculatedFieldModule && this.calculatedFieldModule.isRequireUpdate) {
                    this.calculatedFieldModule.endDialog();
                    this.calculatedFieldModule.isRequireUpdate = false;
                }
                if (this.pivotGridModule && this.pivotGridModule.calculatedFieldModule && this.pivotGridModule.calculatedFieldModule.isRequireUpdate) {
                    this.pivotGridModule.calculatedFieldModule.endDialog();
                    this.pivotGridModule.calculatedFieldModule.isRequireUpdate = false;
                }
            }
        }
    }

    private onReadyStateChange(): void {
        if (this.request.readyState === XMLHttpRequest.DONE) {
            let dataSource: string[][] | IDataSet[] = [];
            if (this.dataSourceSettings.type === 'CSV') {
                let jsonObject: string[] = this.request.responseText.split(/\r?\n|\r/);
                for (let i: number = 0; i < jsonObject.length; i++) {
                    if (!isNullOrUndefined(jsonObject[i]) && jsonObject[i] !== '') {
                        (dataSource as string[][]).push(jsonObject[i].split(','));
                    }
                }
            } else {
                try {
                    dataSource = JSON.parse(this.request.responseText);
                } catch (error) {
                    dataSource = [];
                }
            }
            if (isBlazor() && dataSource.length > 0) {
                this.remoteData = dataSource;
            } else if (dataSource.length > 0) {
                this.setProperties({ dataSourceSettings: { dataSource: dataSource } }, true);
            }
            this.initialLoad();
        }
    }

    private initialLoad(): void {
        /* tslint:disable-next-line:max-line-length */
        this.trigger(events.load, { dataSourceSettings: isBlazor() ? PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings) : this.dataSourceSettings }, (observedArgs: LoadEventArgs) => {
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
        if (!isNullOrUndefined(newProp.dataSourceSettings.dataSource)) {
            this.localDataSourceSetting = PivotUtil.getClonedDataSourceSettings(this.staticPivotGridModule.dataSourceSettings);
            this.initEngine();
        }
        let requireRefresh: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'locale':
                    if (isBlazor()) {
                        break;
                    } else {
                        super.refresh();
                    }
                    break;
                case 'dataSourceSettings':
                    if (PivotUtil.isButtonIconRefesh(prop, oldProp, newProp)) {
                        if (this.isPopupView && this.pivotGridModule &&
                            this.pivotGridModule.showGroupingBar && this.pivotGridModule.groupingBarModule) {
                            let filters: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.filters);
                            let values: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.values);
                            let rows: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.rows);
                            let columns: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.columns);
                            /* tslint:disable-next-line:max-line-length */
                            this.pivotGridModule.setProperties({ dataSourceSettings: { rows: rows, columns: columns, values: values, filters: filters } }, true);
                            this.pivotGridModule.axisFieldModule.render();
                        } else if (!this.isPopupView && this.staticPivotGridModule && !this.staticPivotGridModule.isDestroyed) {
                            let pivot: PivotView = this.staticPivotGridModule;
                            if (pivot.showGroupingBar && pivot.groupingBarModule) {
                                pivot.axisFieldModule.render();
                            }
                            if (pivot.showFieldList && pivot.pivotFieldListModule) {
                                let rows: IFieldOptions[] = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.rows);
                                let columns: IFieldOptions[] = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.columns);
                                let values: IFieldOptions[] = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.values);
                                let filters: IFieldOptions[] = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.filters);
                                /* tslint:disable-next-line:max-line-length */
                                pivot.pivotFieldListModule.setProperties({ dataSourceSettings: { rows: rows, columns: columns, values: values, filters: filters } }, true);
                                pivot.pivotFieldListModule.axisFieldModule.render();
                                if (pivot.pivotFieldListModule.treeViewModule.fieldTable && !pivot.isAdaptive) {
                                    pivot.pivotFieldListModule.notify(events.treeViewUpdate, {});
                                }
                            }
                        }
                        this.axisFieldModule.render();
                        if (this.treeViewModule.fieldTable && !this.isAdaptive) {
                            this.notify(events.treeViewUpdate, {});
                        }
                    }
                    break;
                case 'aggregateTypes':
                    if (this.axisFieldModule) {
                        this.axisFieldModule.render();
                    }
                    if (this.pivotGridModule && this.pivotGridModule.axisFieldModule) {
                        this.pivotGridModule.setProperties({ aggregateTypes: newProp.aggregateTypes }, true);
                        this.pivotGridModule.axisFieldModule.render();
                    }
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
        if(!isNullOrUndefined(this.localDataSourceSetting)) {
            PivotUtil.updateDataSourceSettings(this.staticPivotGridModule, this.localDataSourceSetting);
        }
    }
    /* tslint:disable */
    private initEngine(): void {
        if (this.dataType === 'pivot') {
            let data: any = !isNullOrUndefined(this.dataSourceSettings.dataSource) ? (this.dataSourceSettings.dataSource as IDataSet[])[0] :
                !isNullOrUndefined(this.engineModule.data) ? (this.engineModule.data as IDataSet[])[0] : undefined;
            if (data && this.pivotCommon) {
                let isArray: boolean = Object.prototype.toString.call(data) == '[object Array]';
                if (isArray && this.dataSourceSettings.type === 'JSON') {
                    this.pivotCommon.errorDialog.createErrorDialog(
                        this.localeObj.getConstant('error'), this.localeObj.getConstant('invalidJSON'));
                    return;
                } else if (!isArray && this.dataSourceSettings.type === 'CSV') {
                    this.pivotCommon.errorDialog.createErrorDialog(
                        this.localeObj.getConstant('error'), this.localeObj.getConstant('invalidCSV'));
                    return;
                }
            }
        }
        let args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings)
        };
        let control: PivotView | PivotFieldList = this.isPopupView ? this.pivotGridModule : this;
        control.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
            PivotUtil.updateDataSourceSettings(this, observedArgs.dataSourceSettings);
            if (this.dataType === 'pivot') {
                if (this.dataSourceSettings.groupSettings && this.dataSourceSettings.groupSettings.length > 0) {
                    let pivotDataSet: IDataSet[];
                    if (isBlazor()) {
                        pivotDataSet = this.engineModule.data as IDataSet[];
                    } else {
                        pivotDataSet = this.dataSourceSettings.dataSource as IDataSet[];
                    }
                    this.clonedDataSet = (this.clonedDataSet ? this.clonedDataSet : PivotUtil.getClonedData(pivotDataSet)) as IDataSet[];
                    if (isBlazor()) {
                        this.clonedReport = this.clonedReport ? this.clonedReport : extend({}, this.dataSourceSettings, null, true) as IDataOptions;
                    } else {
                        this.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
                        this.clonedReport = this.clonedReport ? this.clonedReport : extend({}, this.dataSourceSettings, null, true) as IDataOptions;
                        this.setProperties({ dataSourceSettings: { dataSource: pivotDataSet } }, true);
                    }
                }
                let customProperties: ICustomProperties = this.frameCustomProperties();
                customProperties.enableValueSorting = this.staticPivotGridModule ?
                    this.staticPivotGridModule.enableValueSorting : this.enableValueSorting;
                if (this.dataSourceSettings.mode !== 'Server') {
                    this.engineModule.renderEngine(this.dataSourceSettings as IDataOptions, customProperties, this.getValueCellInfo.bind(this));
                }
                this.pivotFieldList = this.engineModule.fieldList;
                let eventArgs: EnginePopulatedEventArgs = {
                    pivotFieldList: this.pivotFieldList,
                    pivotValues: this.engineModule.pivotValues
                };
                const this$: PivotFieldList = this;
                control.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
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
                control.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
                    this$.pivotFieldList = observedArgs.pivotFieldList;
                    this$.olapEngineModule.pivotValues = isBlazor() ? this.olapEngineModule.pivotValues : observedArgs.pivotValues;
                    this$.notify(events.dataReady, {});
                    this$.trigger(events.dataBound);
                });
            }
        });
    }
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
                if (this.dataType === 'pivot' && this.remoteData.length > 0) {
                    this.engineModule.data = this.remoteData;
                    this.initEngine();
                } else {
                    setTimeout(this.getData.bind(this), 100);
                }
            }
        } else if (isBlazor() && this.dataType === 'pivot' &&
            this.engineModule.data && this.engineModule.data.length > 0) {
            this.initEngine();
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

    /* tslint:disable */
    /**
     * Updates the PivotEngine using dataSource from Pivot Field List component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    public updateDataSource(isTreeViewRefresh?: boolean, isEngineRefresh?: boolean): void {
        if (this.pivotGridModule) {
            this.pivotGridModule.showWaitingPopup();
        }
        showSpinner(this.fieldListSpinnerElement as HTMLElement);
        let pivot: PivotFieldList = this;
        let control: PivotView | PivotFieldList = pivot.isPopupView ? pivot.pivotGridModule : pivot;
        //setTimeout(() => {
        let isOlapDataRefreshed: boolean = false;
        let pageSettings: IPageSettings = pivot.pivotGridModule && pivot.pivotGridModule.enableVirtualization ?
            pivot.pivotGridModule.pageSettings : undefined;
        let isCalcChange: boolean = Object.keys(pivot.lastCalcFieldInfo).length > 0 ? true : false;
        let isSorted: boolean = Object.keys(pivot.lastSortInfo).length > 0 ? true : false;
        let isAggChange: boolean = Object.keys(pivot.lastAggregationInfo).length > 0 ? true : false;
        let isFiltered: boolean = Object.keys(pivot.lastFilterInfo).length > 0 ? true : false;
        let args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(pivot.dataSourceSettings)
        };
        control.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
            if (!(pageSettings && (isSorted || isFiltered || isAggChange || isCalcChange))) {
                PivotUtil.updateDataSourceSettings(pivot, observedArgs.dataSourceSettings);
                PivotUtil.updateDataSourceSettings(pivot.pivotGridModule, observedArgs.dataSourceSettings);
            }
            if (isNullOrUndefined(isEngineRefresh)) {
                if (pivot.dataType === 'pivot') {
                    let customProperties: ICustomProperties = pivot.frameCustomProperties();
                    if (!isSorted) {
                        customProperties.enableValueSorting = pivot.staticPivotGridModule ?
                            pivot.staticPivotGridModule.enableValueSorting : pivot.enableValueSorting;
                    }
                    else {
                        pivot.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                        customProperties.enableValueSorting = false;
                    }
                    customProperties.savedFieldList = pivot.pivotFieldList;
                    if (pageSettings && (isSorted || isFiltered || isAggChange || isCalcChange)) {
                        let interopArguments: any = {};
                        if (isSorted) {
                            pivot.pivotGridModule.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                            if ((isBlazor())) {
                                interopArguments = { 'key': 'onSort', 'arg': pivot.lastSortInfo };
                            } else if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onSort', null, pivot.lastSortInfo, null, null, null, null);
                            } else {
                                pivot.engineModule.onSort(pivot.lastSortInfo);
                            }
                            pivot.lastSortInfo = {};
                        }
                        if (isFiltered) {
                            if (isBlazor()) {
                                let dataArgs: any =
                                    (window as any)['sfBlazor'].copyWithoutCircularReferences(
                                        [pivot.dataSourceSettings.filterSettings], pivot.dataSourceSettings.filterSettings);
                                interopArguments = {
                                    'key': 'onFilter',
                                    'arg': { 'lastFilterInfo': pivot.lastFilterInfo, 'filterSettings': dataArgs }
                                };
                            } else if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onFilter', null, null, null, null, pivot.lastFilterInfo, null);
                            } else {
                                pivot.engineModule.onFilter(pivot.lastFilterInfo, pivot.dataSourceSettings as IDataOptions);
                            }
                            pivot.lastFilterInfo = {};
                        }
                        if (isAggChange) {
                            if (isBlazor()) {
                                interopArguments = { 'key': 'onAggregation', 'arg': pivot.lastAggregationInfo };
                            } else if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onAggregation', null, null, pivot.lastAggregationInfo, null, null, null);
                            } else {
                                pivot.engineModule.onAggregation(pivot.lastAggregationInfo);
                            }
                            pivot.lastAggregationInfo = {};
                        }
                        if (isCalcChange) {
                            if (isBlazor()) {
                                interopArguments = {
                                    'key': 'onCalcOperation',
                                    'arg': {
                                        lastCalcFieldInfo: pivot.lastCalcFieldInfo,
                                        values: pivot.dataSourceSettings.values,
                                        calculatedFieldSettings: pivot.dataSourceSettings.calculatedFieldSettings
                                    }
                                };
                            } else if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onCalcOperation', null, null, null, pivot.lastCalcFieldInfo, null, null);
                            } else {
                                pivot.engineModule.onCalcOperation(pivot.lastCalcFieldInfo);
                            }
                            pivot.lastCalcFieldInfo = {};
                        }
                        if (isBlazor()) {
                            let args: any = (window as any)['sfBlazor'].copyWithoutCircularReferences([interopArguments['arg']],
                                interopArguments['arg']);
                            (pivot.pivotGridModule as any).interopAdaptor.invokeMethodAsync("PivotInteropMethod",
                                interopArguments['key'], args
                            ).then(
                                (data: any) => {
                                    if (data === 0) {
                                        this.pivotCommon.errorDialog.createErrorDialog(
                                            this.localeObj.getConstant('error'), (pivot.dataSourceSettings.type === 'CSV' ?
                                                this.localeObj.getConstant('invalidCSV') : this.localeObj.getConstant('invalidJSON')));
                                        return;
                                    } else {
                                        pivot.pivotGridModule.updateBlazorData(data, pivot.pivotGridModule);
                                        pivot.getFieldCaption(pivot.dataSourceSettings);
                                        pivot.enginePopulatedEventMethod(pivot, isTreeViewRefresh, isOlapDataRefreshed);
                                        if (pivot.calculatedFieldModule && pivot.calculatedFieldModule.isRequireUpdate) {
                                            pivot.calculatedFieldModule.endDialog();
                                            pivot.calculatedFieldModule.isRequireUpdate = false;
                                        }
                                    }
                                });
                        }
                    } else {
                        if (isBlazor() && pageSettings) {
                            let dataArgs: any = (window as any)['sfBlazor'].copyWithoutCircularReferences(
                                [(pivot.dataSourceSettings as any).properties], (pivot.dataSourceSettings as any).properties);
                            (pivot.pivotGridModule as any).interopAdaptor.invokeMethodAsync("PivotInteropMethod", 'renderEngine',
                                { 'dataSourceSettings': dataArgs, 'customProperties': customProperties }).then(
                                    (data: any) => {
                                        if (data === 0) {
                                            this.pivotCommon.errorDialog.createErrorDialog(
                                                this.localeObj.getConstant('error'), (pivot.dataSourceSettings.type === 'CSV' ?
                                                    this.localeObj.getConstant('invalidCSV') : this.localeObj.getConstant('invalidJSON')));
                                            return;
                                        } else {
                                            pivot.pivotGridModule.updateBlazorData(data, pivot.pivotGridModule);
                                            pivot.getFieldCaption(pivot.dataSourceSettings);
                                            pivot.enginePopulatedEventMethod(pivot, isTreeViewRefresh, isOlapDataRefreshed);
                                        }
                                    });
                        } else if (pivot.dataSourceSettings.mode === 'Server') {
                            if (isSorted)
                                control.getEngine('onSort', null, pivot.lastSortInfo, null, null, null, null);
                            else if (isAggChange)
                                control.getEngine('onAggregation', null, null, pivot.lastAggregationInfo, null, null, null);
                            else if (isCalcChange)
                                control.getEngine('onCalcOperation', null, null, null, pivot.lastCalcFieldInfo, null, null);
                            else if (isFiltered)
                                control.getEngine('onFilter', null, null, null, null, pivot.lastFilterInfo, null);
                            else
                                control.getEngine('onDrop', null, null, null, null, null, null);
                            pivot.lastSortInfo = {};
                            pivot.lastAggregationInfo = {};
                            pivot.lastCalcFieldInfo = {};
                            pivot.lastFilterInfo = {};
                        } else {
                            pivot.engineModule.renderEngine(pivot.dataSourceSettings as IDataOptions, customProperties, pivot.getValueCellInfo.bind(pivot));
                        }
                    }
                } else {
                    isOlapDataRefreshed = pivot.updateOlapDataSource(pivot, isSorted, isCalcChange, isOlapDataRefreshed);
                }
                if (!(isBlazor() && pageSettings)) {
                    pivot.getFieldCaption(pivot.dataSourceSettings);
                }
            } else {
                pivot.axisFieldModule.render();
                pivot.isRequiredUpdate = false;
            }
            if (!(isBlazor() && pageSettings)) {
                pivot.enginePopulatedEventMethod(pivot, isTreeViewRefresh, isOlapDataRefreshed);
            }
        });
        //});
    }
    /* tslint:enable */
    private enginePopulatedEventMethod(pivot: PivotFieldList, isTreeViewRefresh: boolean, isOlapDataRefreshed: boolean): void {
        let control: PivotView | PivotFieldList = pivot.isPopupView ? pivot.pivotGridModule : pivot;
        let eventArgs: EnginePopulatedEventArgs = {
            dataSourceSettings: pivot.dataSourceSettings as IDataOptions,
            pivotFieldList: pivot.dataType === 'pivot' ? pivot.engineModule.fieldList : pivot.olapEngineModule.fieldList,
            pivotValues: pivot.dataType === 'pivot' ? pivot.engineModule.pivotValues : pivot.olapEngineModule.pivotValues
        };
        control.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
            let dataSource: IDataSet[] | DataManager | string[][] = pivot.dataSourceSettings.dataSource;
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
                /* tslint:enable:align */
            }
            if (pivot.renderMode === 'Popup' && pivot.pivotGridModule &&
                pivot.pivotGridModule.allowDeferLayoutUpdate && !pivot.isRequiredUpdate) {
                hideSpinner(pivot.fieldListSpinnerElement as HTMLElement);
                pivot.pivotGridModule.hideWaitingPopup();
            }
            pivot.isRequiredUpdate = true;
            if (!pivot.pivotGridModule || isOlapDataRefreshed) {
                hideSpinner(pivot.fieldListSpinnerElement as HTMLElement);
            } else {
                pivot.pivotGridModule.fieldListSpinnerElement = pivot.fieldListSpinnerElement as HTMLElement;
            }
        });
    }

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
                    pivot.pivotGridModule.hideWaitingPopup();
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
            if (isBlazor() && !this.isPopupView) {
                PivotUtil.updateDataSourceSettings(this, PivotUtil.getClonedDataSourceSettings(control.dataSourceSettings));
            } else {
                this.setProperties({ dataSourceSettings: control.dataSourceSettings }, true);
            }
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
            if (!this.isPopupView) {
                this.staticPivotGridModule = control;
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
            if (isBlazor()) {
                PivotUtil.updateDataSourceSettings(control, PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings));
            } else {
                control.setProperties({ dataSourceSettings: this.dataSourceSettings }, true);
            }
            control.engineModule = this.engineModule;
            control.olapEngineModule = this.olapEngineModule;
            control.dataType = this.dataType;
            if (!this.pivotChange) {
                control.pivotValues = this.dataType === 'olap' ? this.olapEngineModule.pivotValues : this.engineModule.pivotValues;
            }
            let eventArgs: FieldListRefreshedEventArgs = {
                dataSourceSettings: PivotUtil.getClonedDataSourceSettings(control.dataSourceSettings),
                pivotValues: control.pivotValues
            };
            control.trigger(events.fieldListRefreshed, eventArgs);
            if (!this.isPopupView) {
                this.staticPivotGridModule = control;
            }
            if (control.enableVirtualization && isBlazor()) {
                control.renderPivotGrid();
            } else {
                control.dataBind();
            }
        }
    }

    /**
     * Called internally to trigger populate event.
     * @hidden
     */
    public triggerPopulateEvent(): void {
        let control: PivotView | PivotFieldList = this.isPopupView ? this.pivotGridModule : this;
        let eventArgs: EnginePopulatedEventArgs = {
            dataSourceSettings: this.dataSourceSettings as IDataOptions,
            pivotFieldList: this.dataType === 'olap' ? this.olapEngineModule.fieldList : this.engineModule.fieldList,
            pivotValues: this.dataType === 'olap' ? this.olapEngineModule.pivotValues : this.engineModule.pivotValues
        };
        control.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
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


