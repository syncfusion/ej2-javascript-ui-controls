import { Property, Event, Component, EmitType, Internationalization, extend, Fetch } from '@syncfusion/ej2-base';
import { L10n, remove, addClass, Browser, Complex, ModuleDeclaration } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';
import { PivotEngine, IFieldListOptions, IPageSettings, IDataOptions, ICustomProperties, IDrilledItem } from '../../base/engine';
import { ISort, IFilter, IFieldOptions, ICalculatedFields, IDataSet } from '../../base/engine';
import { PivotFieldListModel } from './field-list-model';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { LoadEventArgs, EnginePopulatingEventArgs, EnginePopulatedEventArgs, BeforeServiceInvokeEventArgs, FetchRawDataArgs, UpdateRawDataArgs, PivotActionBeginEventArgs, PivotActionCompleteEventArgs, PivotActionFailureEventArgs, HeadersSortEventArgs, AfterServiceInvokeEventArgs } from '../../common/base/interface';
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
import { DataSourceSettingsModel, FieldOptionsModel } from '../../model/datasourcesettings-model';
import { DataSourceSettings } from '../../model/datasourcesettings';
import { CalculatedField } from '../../common/calculatedfield/calculated-field';
import { PivotContextMenu } from '../../common/popups/context-menu';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { PivotUtil } from '../../base/util';
import { OlapEngine, IOlapFieldListOptions, IOlapCustomProperties, IOlapField } from '../../base/olap/engine';
import { Sorting } from '../../base';

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
    public isAdaptive: boolean;
    /** @hidden */
    public pivotFieldList: IFieldListOptions | IOlapFieldListOptions;
    /** @hidden */
    public dataType: string;
    /** @hidden */
    public engineModule: PivotEngine;
    /** @hidden */
    public olapEngineModule: OlapEngine;
    /** @hidden */
    public pageSettings: IPageSettings;
    /** @hidden */
    public isDragging: boolean;
    /** @hidden */
    public fieldListSpinnerElement: Element;
    /** @hidden */
    public clonedDataSource: DataSourceSettingsModel;
    /** @hidden */
    public clonedFieldList: IFieldListOptions | IOlapFieldListOptions;
    /** @hidden */
    public clonedFieldListData: IOlapField[];
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
    public staticPivotGridModule: PivotView;
    /** @hidden */
    public enableValueSorting: boolean = false;
    /** @hidden */
    public guid: string;
    private request: XMLHttpRequest = new XMLHttpRequest();
    private savedDataSourceSettings: DataSourceSettingsModel;
    private remoteData: string[][] | IDataSet[] = [];
    /** @hidden */
    public actionObj: PivotActionCompleteEventArgs = {};
    /** @hidden */
    public destroyEngine: boolean = false;
    /** @hidden */
    public defaultFieldListOrder: Sorting = 'None';
    /** @hidden */
    public isDeferUpdateApplied: boolean = false;

    //Property Declarations
    /**
     * Allows the following pivot report information such as rows, columns, values, filters, etc., that are used to render the pivot table and field list.
     * * `catalog`: Allows to set the database name of SSAS cube as string type that used to retrieve the data from the specified connection string. **Note: It is applicable only for OLAP data source.**
     * * `cube`: Allows you to set the SSAS cube name as string type that used to retrieve data for pivot table rendering. **Note: It is applicable only for OLAP data source.**
     * * `providerType`: Allows to set the provider type to identify the given connection is either Relational or SSAS to render the pivot table and field list. **Note: It is applicable only for OLAP data source.**
     * * `url`: Allows to set the URL as string type, which helps to identify the service endpoint where the data are processed and retrieved to render the pivot table and field list. **Note: It is applicable only for OLAP data source.**
     * * `localeIdentifier`: Allows you to set the specific culture code as number type to render pivot table with desired localization.
     * By default, the pivot table displays with culture code **1033**, which indicates "en-US" locale. **Note: It is applicable only for OLAP data source.**
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
     * It helps to display over the pivot table UI without affecting any form of UI shrink within a web page.
     * * `Fixed`: To display the field list in a static position within a web page.
     *
     * @default 'Popup'
     */
    @Property('Popup')
    public renderMode: Mode;

    /**
     * Allows you to set the specific target element to the fieldlist dialog.
     * This helps the field list dialog to display the appropriate position on its target element.
     * > To use this option, set the property `renderMode` to be **Popup**.
     *
     * @default null
     */
    @Property()
    public target: HTMLElement | string;

    /**
     * Allows you to add the CSS class name to the field list element.
     * Use this class name, you can customize the field list easily at your end.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Allows to restrict the cross-site scripting while using cell template, meaning it will remove the unwanted scripts,styles or HTML in your cell template.
     * > In general, the cross-site scripting known as XSS is a type of computer security vulnerability typically found in web applications.
     * It attacks enable attackers to inject client-side scripts into web pages viewed by other users.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * Allows the built-in calculated field dialog to be displayed in the component.
     * You can view the calculated field dialog by clicking the "Calculated Field" button in the field list UI.
     * This dialog will helps you to create a new calculated field in the pivot table, based on available fields from the bound data source or using simple formula with basic arithmetic operators at runtime.
     *
     * @default false
     */
    @Property(false)
    public allowCalculatedField: boolean;

    /**
     * It enables the search option in the field list UI, which can be used to search specific fields at runtime.
     *
     * @default false
     */
    @Property(false)
    public enableFieldSearching: boolean;

    /**
     * Allows you to create a pivot button with "Values" as a caption used to display in the field list UI.
     * It helps you to plot the value fields to either column or row axis during runtime.
     * > The showValuesButton property is enabled by default for the OLAP data source.
     * And the pivot button can be displayed with "Measures" as a caption used to display in the field list UI.
     *
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
     *
     * @default false
     */
    @Property(false)
    public allowDeferLayoutUpdate: boolean;

    /**
     * Allows you to set the limit for displaying members while loading large data in the member filter dialog.
     * Based on this limit, initial loading will be completed quickly without any performance constraint.
     * A message with remaining member count, that are not currently shown in the member filter dialog UI, will be displayed in the member editor.
     * > This property is not applicable to user-defined hierarchies in the OLAP data source.
     *
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
     * Also, searching members will only be considered for the level members that are loaded.
     * > This property is applicable only for OLAP data source.
     *
     * @default true
     */
    @Property(true)
    public loadOnDemandInMemberEditor: boolean;

    /**
     * Allows the appearance of the loading indicator to be customized with either an HTML string or the element’s ID,
     * that can be used to displayed with custom formats in the field list UI.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public spinnerTemplate: string | Function;

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
     * * `Median`: Allows to display the pivot table values with median.
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
     * > It is applicable only for Relational data.
     *
     * @default ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Median', 'Index', 'PopulationVar', 'SampleVar',
     * 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal',
     * 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal', 'DifferenceFrom', 'PercentageOfDifferenceFrom',
     * 'PercentageOfParentTotal']
     */
    @Property(['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Median', 'Index', 'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal', 'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'])
    public aggregateTypes: AggregateTypes[];

    /**
     * Allows values with a specific country currency format to be displayed in the pivot table.
     * Standard currency codes referred to as ISO 4217 can be used for the formatting of currency values.
     * For example, to display "US Dollar($)" currency values, set the `currencyCode` to **USD**.
     * > It is applicable ony for Relational data.
     *
     * @default 'USD'
     * @private
     */
    @Property('USD')
    private currencyCode: string;

    //Event Declarations
    /**
     * It allows any customization of Pivot Field List properties on initial rendering.
     * Based on the changes, the pivot field list will be rendered.
     *
     * @event load
     */
    @Event()
    public load: EmitType<LoadEventArgs>;

    /**
     * It triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings.
     *
     * @event enginePopulating
     */
    @Event()
    public enginePopulating: EmitType<EnginePopulatingEventArgs>;

    /**
     * It triggers before the filtering applied.
     *
     * @event memberFiltering
     */
    @Event()
    public memberFiltering: EmitType<MemberFilteringEventArgs>;

    /**
     * It triggers after the pivot engine populated and allows to customize the pivot datasource settings.
     *
     * @event enginePopulated
     */
    @Event()
    public enginePopulated: EmitType<EnginePopulatedEventArgs>;

    /**
     * It trigger when a field getting dropped into any axis.
     *
     * @event onFieldDropped
     */
    @Event()
    public onFieldDropped: EmitType<FieldDroppedEventArgs>;

    /**
     * It triggers before a field drops into any axis.
     *
     * @event fieldDrop
     */
    @Event()
    public fieldDrop: EmitType<FieldDropEventArgs>;

    /**
     * It trigger when a field drag (move) starts.
     *
     * @event fieldDragStart
     */
    @Event()
    public fieldDragStart: EmitType<FieldDragStartEventArgs>;

    /**
     * It allows to change the each cell value during engine populating.
     *
     * @event aggregateCellInfo
     * @deprecated
     */
    @Event()
    public aggregateCellInfo: EmitType<AggregateEventArgs>;

    /**
     * It triggers before member editor dialog opens.
     *
     * @event memberEditorOpen
     */
    @Event()
    public memberEditorOpen: EmitType<MemberEditorOpenEventArgs>;

    /**
     * It triggers before a calculated field created/edited during runtime.
     *
     * @event calculatedFieldCreate
     */
    @Event()
    public calculatedFieldCreate: EmitType<CalculatedFieldCreateEventArgs>;

    /**
     * It triggers before aggregate type context menu opens.
     *
     * @event aggregateMenuOpen
     */
    @Event()
    public aggregateMenuOpen: EmitType<AggregateMenuOpenEventArgs>;

    /**
     * It triggers before removing the field from any axis during runtime.
     *
     * @event fieldRemove
     */
    @Event()
    public fieldRemove: EmitType<FieldRemoveEventArgs>;

    /**
     * It trigger when the Pivot Field List rendered.
     *
     * @event dataBound
     */
    @Event()
    public dataBound: EmitType<Object>;

    /**
     * It trigger when the Pivot Field List component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * It trigger when the Pivot Field List component getting destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * It triggers before service get invoked from client.
     *
     * @event beforeServiceInvoke
     */
    @Event()
    public beforeServiceInvoke: EmitType<BeforeServiceInvokeEventArgs>;

    /**
     * It triggers after the response is returned from the service.
     *
     * @event afterServiceInvoke
     */
    @Event()
    public afterServiceInvoke: EmitType<AfterServiceInvokeEventArgs>;

    /**
     * It triggers when UI action begins in the Pivot FieldList. The UI actions used to trigger this event such as
     * sorting fields through icon click in the field list tree,
     * [`Calculated field`](../../pivotview/field-list/#calculated-fields) UI,
     * Button actions such as
     * [`editing`](../../pivotview/calculated-field/#editing-through-the-field-list-and-the-groupingbar),
     * [`sorting`](../../pivotview/field-list/#sorting-members),
     * [`filtering`](../../pivotview/field-list/#filtering-members) and
     * [`aggregation`](pivotview/field-list/#changing-aggregation-type-of-value-fields-at-runtime).
     *
     * @event actionBegin
     */
    @Event()
    public actionBegin: EmitType<PivotActionBeginEventArgs>;

    /**
     * It triggers when UI action in the Pivot FieldList completed. The UI actions used to trigger this event such as
     * sorting fields through icon click in the field list tree,
     * [`Calculated field`](../../pivotview/field-list/#calculated-fields) UI,
     * Button actions such as
     * [`editing`](../../pivotview/calculated-field/#editing-through-the-field-list-and-the-groupingbar),
     * [`sorting`](../../pivotview/field-list/#sorting-members),
     * [`filtering`](../../pivotview/field-list/#filtering-members) and
     * [`aggregation`](pivotview/field-list/#changing-aggregation-type-of-value-fields-at-runtime).
     *
     * @event actionComplete
     */
    @Event()
    public actionComplete: EmitType<PivotActionCompleteEventArgs>;

    /**
     * It triggers when UI action failed to achieve the desired results in the Pivot FieldList. The UI actions used to trigger this event such as
     * sorting fields through icon click in the field list tree,
     * [`Calculated field`](../../pivotview/field-list/#calculated-fields) UI,
     * Button actions such as
     * [`editing`](../../pivotview/calculated-field/#editing-through-the-field-list-and-the-groupingbar),
     * [`sorting`](../../pivotview/field-list/#sorting-members),
     * [`filtering`](../../pivotview/field-list/#filtering-members) and
     * [`aggregation`](pivotview/field-list/#changing-aggregation-type-of-value-fields-at-runtime).
     *
     * @event actionFailure
     */
    @Event()
    public actionFailure: EmitType<PivotActionFailureEventArgs>;

    /**
     * It triggers before the sorting performed.
     *
     * @event onHeadersSort
     */
    @Event()
    public onHeadersSort: EmitType<HeadersSortEventArgs>;

    /**
     * Constructor for creating the widget
     *
     * @param  {PivotFieldListModel} options - options
     * @param  {string|HTMLElement} element - element
     */
    constructor(options?: PivotFieldListModel, element?: string | HTMLElement) {
        super(options, <string | HTMLElement>element);
    }

    /**
     * To provide the array of modules needed for control rendering
     *
     * @returns {ModuleDeclaration[]} - ModuleDeclaration[]
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.allowCalculatedField) {
            modules.push({ args: [this], member: 'calculatedField' });
        }
        return modules;
    }

    /**
     * @returns {AggregateTypes[]}- AggregateTypes[]
     * @hidden
     */
    public getAllSummaryType(): AggregateTypes[] {
        return ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Median', 'Index',
            'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal',
            'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal',
            'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
    }

    /**
     * For internal use only - Initialize the event handler;
     *
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
            Median: 'Median',
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
            None: 'None'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.isDragging = false;
        this.wireEvent();
    }

    private frameCustomProperties(fieldListData?: IOlapField[], fieldList?: IOlapFieldListOptions)
        : ICustomProperties | IOlapCustomProperties {
        if (this.pivotGridModule) {
            this.pivotGridModule.updatePageSettings(false);
        }
        const pageSettings: IPageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : this.pageSettings;
        const isPaging: boolean = this.pivotGridModule ? this.pivotGridModule.enablePaging : false;
        const isVirtualization: boolean = this.pivotGridModule ? this.pivotGridModule.enableVirtualization : false;
        const enableHtmlSanitizer: boolean = this.pivotGridModule ? this.pivotGridModule.enableHtmlSanitizer : this.enableHtmlSanitizer;
        const localeObj: L10n = this.pivotGridModule ? this.pivotGridModule.localeObj :
            (this.staticPivotGridModule ? this.staticPivotGridModule.localeObj : this.localeObj);
        const isDrillThrough: boolean = this.pivotGridModule ?
            (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true;
        const enableValueSorting: boolean = this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined;
        const allowDataCompression: boolean = this.pivotGridModule && this.pivotGridModule.allowDataCompression ?
            this.pivotGridModule.allowDataCompression : false;
        let customProperties: ICustomProperties | IOlapCustomProperties;
        if (this.dataType === 'olap') {
            customProperties = {
                mode: '',
                savedFieldList: fieldList ? fieldList : undefined,
                savedFieldListData: fieldListData ? fieldListData : undefined,
                pageSettings: pageSettings,
                enableValueSorting: enableValueSorting,
                isDrillThrough: isDrillThrough,
                localeObj: localeObj,
                enableVirtualization: isVirtualization,
                allowDataCompression: allowDataCompression
            };
        } else {
            customProperties = {
                mode: '',
                savedFieldList: undefined,
                pageSettings: pageSettings,
                enableValueSorting: enableValueSorting,
                isDrillThrough: isDrillThrough,
                localeObj: localeObj,
                clonedReport: this.clonedReport,
                globalize: this.globalize,
                currenyCode: this.currencyCode,
                enablePaging: isPaging,
                enableVirtualization: isVirtualization,
                enableHtmlSanitizer: enableHtmlSanitizer,
                allowDataCompression: allowDataCompression
            };
        }
        return customProperties;
    }

    /**
     * Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        if (this.dataType === 'pivot' && this.dataSourceSettings.url && this.dataSourceSettings.url !== '') {
            if (this.dataSourceSettings.mode === 'Server') {
                this.guid = PivotUtil.generateUUID();
                this.getEngine('initialRender', null, null, null, null, null, null);
            } else {
                const request: Fetch = new Fetch(this.dataSourceSettings.url, 'GET');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                request.send().then((response: any) => typeof(response) === 'string' ? response : response.text())
                    .then(this.onReadyStateChange.bind(this));
            }
        } else {
            this.initialLoad();
        }
    }

    /**
     *
     * @hidden
     *
     */

    public getEngine(
        action: string, drillItem?: IDrilledItem, sortItem?: ISort, aggField?: IFieldOptions, cField?: ICalculatedFields,
        filterItem?: IFilter, memberName?: string, rawDataArgs?: FetchRawDataArgs, editArgs?: UpdateRawDataArgs
    ): void {
        this.currentAction = action;
        if (this.pivotGridModule) {
            this.pivotGridModule.updatePageSettings(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customProperties: any = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pageSettings: this.pivotGridModule ? JSON.parse((this.pivotGridModule as any).getPageSettings()).pageSettings : undefined,
            enableValueSorting: this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined,
            enableDrillThrough: this.pivotGridModule ?
                (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true,
            locale: JSON.stringify(PivotUtil.getLocalizedObject(this))
        };
        this.request.open('POST', this.dataSourceSettings.url, true);
        const params: BeforeServiceInvokeEventArgs = {
            request: this.request,
            dataSourceSettings: JSON.parse(this.getPersistData()).dataSourceSettings,
            action: action,
            customProperties: {},
            internalProperties: customProperties,
            drillItem: drillItem,
            sortItem: sortItem,
            aggregatedItem: aggField,
            calculatedItem: cField,
            filterItem: filterItem,
            memberName: memberName,
            fetchRawDataArgs: rawDataArgs,
            editArgs: editArgs,
            hash: this.guid,
            isGroupingUpdated: (this.currentAction === 'onRefresh' && this.dataSourceSettings.groupSettings.length > 0) ? true :
                ((this.pivotGridModule && this.pivotGridModule.groupingModule) ? this.pivotGridModule.groupingModule.isUpdate : false)
        };
        this.trigger(events.beforeServiceInvoke, params, (observedArgs: BeforeServiceInvokeEventArgs) => {
            this.request = observedArgs.request;
            params.internalProperties = observedArgs.internalProperties;
            params.customProperties = observedArgs.customProperties;
            params.dataSourceSettings = observedArgs.dataSourceSettings;
            params.calculatedItem = observedArgs.calculatedItem;
            params.drillItem = observedArgs.drillItem;
            params.editArgs = observedArgs.editArgs;
            params.fetchRawDataArgs = observedArgs.fetchRawDataArgs;
            params.filterItem = observedArgs.filterItem;
            params.hash = observedArgs.hash;
            params.memberName = observedArgs.memberName;
            params.sortItem = observedArgs.sortItem;
        });
        this.request.withCredentials = false;
        this.request.onreadystatechange = this.onSuccess.bind(this);
        this.request.setRequestHeader('Content-type', 'application/json');
        this.request.send(JSON.stringify(params));
    }

    private onSuccess(): void {
        if (this.request.readyState === XMLHttpRequest.DONE) {
            try {
                const params: AfterServiceInvokeEventArgs = {
                    action: this.currentAction,
                    response: this.request.responseText
                };
                this.trigger(events.afterServiceInvoke, params);
                /* eslint-disable @typescript-eslint/no-explicit-any */
                const engine: any = JSON.parse(this.request.responseText);
                if (this.currentAction === 'fetchFieldMembers') {
                    const currentMembers: any = JSON.parse(engine.members);
                    const dateMembers: any = [];
                    const formattedMembers: any = {};
                    const members: any = {};
                    /* eslint-enable @typescript-eslint/no-explicit-any */
                    for (let i: number = 0; i < currentMembers.length; i++) {
                        dateMembers.push({
                            formattedText: currentMembers[i as number].FormattedText,
                            actualText: currentMembers[i as number].ActualText
                        });
                        formattedMembers[currentMembers[i as number].FormattedText] = {};
                        members[currentMembers[i as number].ActualText] = {};
                    }
                    this.engineModule.fieldList[engine.memberName].dateMember = dateMembers;
                    this.engineModule.fieldList[engine.memberName].formattedMembers = formattedMembers;
                    this.engineModule.fieldList[engine.memberName].members = members;
                    this.pivotButtonModule.updateFilterEvents();
                } else {
                    const fList: IFieldListOptions = PivotUtil.formatFieldList(JSON.parse(engine.fieldList));
                    if (this.engineModule.fieldList) {
                        const keys: string[] = Object.keys(this.engineModule.fieldList);
                        for (let i: number = 0; i < keys.length; i++) {
                            if (this.engineModule.fieldList[keys[i as number]] && fList[keys[i as number]]) {
                                fList[keys[i as number]].dateMember = this.engineModule.fieldList[keys[i as number]].dateMember;
                                fList[keys[i as number]].formattedMembers = this.engineModule.fieldList[keys[i as number]].formattedMembers;
                                fList[keys[i as number]].members = this.engineModule.fieldList[keys[i as number]].members;
                            }
                        }
                    }
                    this.engineModule.fieldList = fList;
                    this.engineModule.fields = JSON.parse(engine.fields);
                    this.engineModule.rowCount = JSON.parse(engine.pivotCount).RowCount;
                    this.engineModule.columnCount = JSON.parse(engine.pivotCount).ColumnCount;
                    this.engineModule.rowStartPos = JSON.parse(engine.pivotCount).RowStartPosition;
                    this.engineModule.colStartPos = JSON.parse(engine.pivotCount).ColumnStartPosition;
                    this.engineModule.rowFirstLvl = JSON.parse(engine.pivotCount).RowFirstLevel;
                    this.engineModule.colFirstLvl = JSON.parse(engine.pivotCount).ColumnFirstLevel;
                    let rowPos: number;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const pivotValues: any = PivotUtil.formatPivotValues(JSON.parse(engine.pivotValue));
                    for (let rCnt: number = 0; rCnt < pivotValues.length; rCnt++) {
                        if (pivotValues[rCnt as number] && pivotValues[rCnt as number][0] && pivotValues[rCnt as number][0].axis === 'row') {
                            rowPos = rCnt;
                            break;
                        }
                    }
                    this.engineModule.headerContent = PivotUtil.frameContent(pivotValues, 'header', rowPos, this);
                    this.engineModule.pageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const valueSort: any = JSON.parse(engine.dataSourceSettings).ValueSortSettings;
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
                if (this.pivotGridModule && this.pivotGridModule.calculatedFieldModule &&
                    this.pivotGridModule.calculatedFieldModule.isRequireUpdate) {
                    this.pivotGridModule.calculatedFieldModule.endDialog();
                    this.pivotGridModule.calculatedFieldModule.isRequireUpdate = false;
                }
            }
        }
    }

    private onReadyStateChange(result: string): void {
        let dataSource: string[][] | IDataSet[] = [];
        if (this.dataSourceSettings.type === 'CSV') {
            const jsonObject: string[] = result.split(/\r?\n|\r/);
            for (let i: number = 0; i < jsonObject.length; i++) {
                if (!isNullOrUndefined(jsonObject[i as number]) && jsonObject[i as number] !== '') {
                    (dataSource as string[][]).push(jsonObject[i as number].split(','));
                }
            }
        } else {
            try {
                dataSource = JSON.parse(result);
            } catch (error) {
                dataSource = [];
            }
        }
        if (dataSource && dataSource.length > 0) {
            this.setProperties({ dataSourceSettings: { dataSource: dataSource } }, true);
        }
        this.initialLoad();
    }

    private initialLoad(): void {
        const loadArgs: LoadEventArgs = {
            dataSourceSettings: this.dataSourceSettings,
            defaultFieldListOrder: this.defaultFieldListOrder
        };
        this.trigger(events.load, loadArgs, (observedArgs: LoadEventArgs) => {
            this.dataSourceSettings = observedArgs.dataSourceSettings;
            this.defaultFieldListOrder = loadArgs.defaultFieldListOrder;
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
                addClass([this.element], this.cssClass.split(' '));
            }
            this.notify(events.initialLoad, {});
        });
    }

    /**
     *
     * Binding events to the Pivot Field List element.
     *
     * @hidden
     */

    private wireEvent(): void {
        this.on(events.initialLoad, this.generateData, this);
        this.on(events.dataReady, this.fieldListRender, this);
    }

    /**
     *
     * Unbinding events from the element on widget destroy.
     *
     * @hidden
     */

    private unWireEvent(): void {
        if (this.pivotGridModule && this.pivotGridModule.isDestroyed) { return; }
        this.off(events.initialLoad, this.generateData);
        this.off(events.dataReady, this.fieldListRender);
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string}
     */

    public getPersistData(): string {
        const keyEntity: string[] = ['dataSourceSettings'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Get component name.
     *
     * @returns string
     * @private
     */

    public getModuleName(): string {
        return 'pivotfieldlist';
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @hidden
     */

    public onPropertyChanged(newProp: PivotFieldListModel, oldProp: PivotFieldListModel): void {
        let requireRefresh: boolean = false;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'locale':
                super.refresh();
                break;
            case 'dataSourceSettings':
                if ((!isNullOrUndefined(newProp.dataSourceSettings.dataSource) && !(newProp.dataSourceSettings.groupSettings
                && newProp.dataSourceSettings.groupSettings.length > 0)) || (this.dataType === 'olap' && !isNullOrUndefined(newProp.dataSourceSettings.url))) {
                    if (this.dataType !== 'olap') {
                        if (!isNullOrUndefined(this.savedDataSourceSettings)) {
                            PivotUtil.updateDataSourceSettings(this.staticPivotGridModule, this.savedDataSourceSettings);
                            this.savedDataSourceSettings = undefined;
                        }
                        if (newProp.dataSourceSettings.dataSource && ((newProp.dataSourceSettings.dataSource as IDataSet[]).length === 0)
                        && !isNullOrUndefined(this.staticPivotGridModule)) {
                            this.savedDataSourceSettings =
                            PivotUtil.getClonedDataSourceSettings(this.staticPivotGridModule.dataSourceSettings);
                            this.staticPivotGridModule.setProperties({ dataSourceSettings: {
                                rows: [],
                                columns: [],
                                values: [],
                                filters: []
                            }}, true);
                        }
                    }
                    if (this.dataType === 'pivot') {
                        this.engineModule.fieldList = null;
                        this.engineModule.isEmptyData = true;
                        this.engineModule.data = [];
                    } else if (this.dataType === 'olap') {
                        this.olapEngineModule.fieldList = {};
                        this.olapEngineModule.fieldListData = undefined;
                        this.olapEngineModule.isEmptyData = true;
                    }
                    if (!isNullOrUndefined(this.staticPivotGridModule)) {
                        this.staticPivotGridModule.pivotValues = [];
                    }
                    this.initialLoad();
                }
                if (PivotUtil.isButtonIconRefesh(prop, oldProp, newProp)) {
                    if (this.isPopupView && this.pivotGridModule &&
                        this.pivotGridModule.showGroupingBar && this.pivotGridModule.groupingBarModule) {
                        const filters: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.filters);
                        const values: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.values);
                        const rows: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.rows);
                        const columns: IFieldOptions[] = PivotUtil.cloneFieldSettings(this.dataSourceSettings.columns);
                        this.pivotGridModule.setProperties({ dataSourceSettings: {
                            rows: rows, columns: columns, values: values, filters: filters }}, true);
                        this.pivotGridModule.axisFieldModule.render();
                    } else if (!this.isPopupView && this.staticPivotGridModule && !this.staticPivotGridModule.isDestroyed) {
                        const pivot: PivotView = this.staticPivotGridModule;
                        if (pivot.showGroupingBar && pivot.groupingBarModule) {
                            pivot.axisFieldModule.render();
                        }
                        if (pivot.showFieldList && pivot.pivotFieldListModule) {
                            const rows: IFieldOptions[] = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.rows);
                            const columns: IFieldOptions[] = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.columns);
                            const values: IFieldOptions[] = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.values);
                            const filters: IFieldOptions[] = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.filters);
                            pivot.pivotFieldListModule.setProperties({ dataSourceSettings: {
                                rows: rows, columns: columns, values: values, filters: filters } }, true);
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
            case 'showValuesButton':
                if (this.axisFieldModule) {
                    this.axisFieldModule.render();
                }
                if (this.pivotGridModule && this.pivotGridModule.showGroupingBar &&
                    this.pivotGridModule.groupingBarModule && this.pivotGridModule.axisFieldModule) {
                    this.pivotGridModule.setProperties({ showValuesButton: newProp.showValuesButton }, true);
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
            case 'enableFieldSearching':
                this.refresh();
            }
            if (requireRefresh) {
                this.fieldListRender();
            }
        }
    }
    private initEngine(): void {
        if (this.dataType === 'pivot') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = !isNullOrUndefined(this.dataSourceSettings.dataSource) ? (this.dataSourceSettings.dataSource as IDataSet[])[0]
                : !isNullOrUndefined(this.engineModule.data) ? (this.engineModule.data as IDataSet[])[0] : undefined;
            if (data && this.pivotCommon) {
                const isArray: boolean = Object.prototype.toString.call(data) === '[object Array]';
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
        const args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings)
        };
        const control: PivotView | PivotFieldList = this.isPopupView ? this.pivotGridModule : this;
        control.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
            PivotUtil.updateDataSourceSettings(this, observedArgs.dataSourceSettings);
            if (this.dataType === 'pivot') {
                if (this.dataSourceSettings.groupSettings && this.dataSourceSettings.groupSettings.length > 0) {
                    const pivotDataSet: IDataSet[] = this.dataSourceSettings.dataSource as IDataSet[];
                    this.clonedDataSet = (this.clonedDataSet ? this.clonedDataSet : PivotUtil.getClonedData(pivotDataSet)) as IDataSet[];
                    const dataSourceSettings: IDataOptions = JSON.parse(this.getPersistData()).dataSourceSettings as IDataOptions;
                    dataSourceSettings.dataSource = [];
                    this.clonedReport = this.clonedReport ? this.clonedReport : dataSourceSettings;
                }
                const customProperties: ICustomProperties = this.frameCustomProperties();
                customProperties.enableValueSorting = this.staticPivotGridModule ?
                    this.staticPivotGridModule.enableValueSorting : this.enableValueSorting;
                if (this.dataSourceSettings.mode !== 'Server') {
                    this.engineModule.renderEngine(this.dataSourceSettings as IDataOptions, customProperties, this.aggregateCellInfo
                        ? this.getValueCellInfo.bind(this) : undefined, this.onHeadersSort ? this.getHeaderSortInfo.bind(this) : undefined);
                }
                this.pivotFieldList = this.engineModule.fieldList;
                const eventArgs: EnginePopulatedEventArgs = {
                    pivotFieldList: this.pivotFieldList,
                    pivotValues: this.engineModule.pivotValues
                };
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const this$: PivotFieldList = this;
                control.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
                    this$.pivotFieldList = observedArgs.pivotFieldList;
                    this$.engineModule.pivotValues = observedArgs.pivotValues;
                    this$.notify(events.dataReady, {});
                    this$.trigger(events.dataBound);
                });
            } else if (this.dataType === 'olap') {
                this.olapEngineModule.renderEngine(
                    this.dataSourceSettings as IDataOptions, this.frameCustomProperties(
                        this.olapEngineModule.fieldListData, this.olapEngineModule.fieldList), this.onHeadersSort ?
                        this.getHeaderSortInfo.bind(this) : undefined);
                this.pivotFieldList = this.olapEngineModule.fieldList;
                const eventArgs: EnginePopulatedEventArgs = {
                    pivotFieldList: this.pivotFieldList,
                    pivotValues: this.olapEngineModule.pivotValues
                };
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const this$: PivotFieldList = this;
                control.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
                    this$.pivotFieldList = observedArgs.pivotFieldList;
                    this$.olapEngineModule.pivotValues = observedArgs.pivotValues;
                    this$.notify(events.dataReady, {});
                    this$.trigger(events.dataBound);
                });
            }
        });
        if (this.defaultFieldListOrder !== 'None') {
            if (this.treeViewModule.fieldTable && !this.isAdaptive) {
                this.notify(events.treeViewUpdate, {});
            }
        }
    }

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
            } else {
                this.notify(events.dataReady, {});
            }
        } else {
            this.notify(events.dataReady, {});
            this.trigger(events.dataBound);
        }
    }

    private getValueCellInfo(aggregateObj: AggregateEventArgs): AggregateEventArgs {
        const args: AggregateEventArgs = aggregateObj;
        this.trigger(events.aggregateCellInfo, args);
        return args;
    }

    private getHeaderSortInfo(sortingObj: HeadersSortEventArgs): HeadersSortEventArgs {
        const args: HeadersSortEventArgs = sortingObj;
        this.trigger(events.onHeadersSort, args);
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
        let showDialog: boolean;
        if (this.renderMode === 'Popup' && this.dialogRenderer.fieldListDialog && !this.dialogRenderer.fieldListDialog.isDestroyed) {
            showDialog = this.dialogRenderer.fieldListDialog.visible;
            this.dialogRenderer.fieldListDialog.destroy();
            remove(document.getElementById(this.element.id + '_Container'));
        }
        this.renderModule.render();
        if (this.renderMode === 'Popup') {
            this.fieldListSpinnerElement = this.dialogRenderer.fieldListDialog.element;
            if (showDialog) {
                this.dialogRenderer.fieldListDialog.show();
            }
        } else {
            this.fieldListSpinnerElement = this.element.querySelector('.e-pivotfieldlist-container');
        }
        if (this.spinnerTemplate) {
            createSpinner({ // eslint-disable-next-line @typescript-eslint/no-explicit-any
                target: this.fieldListSpinnerElement as HTMLElement, template: this.spinnerTemplate as any,
                cssClass: this.cssClass ? this.cssClass : undefined
            }, this.createElement);
        } else {
            createSpinner({ target: this.fieldListSpinnerElement as HTMLElement, cssClass: this.cssClass ? this.cssClass : undefined },
                          this.createElement);
        }
        const args: CommonArgs = {
            pivotEngine: this.dataType === 'olap' ? this.olapEngineModule : this.engineModule,
            dataSourceSettings: this.dataSourceSettings as IDataOptions,
            id: this.element.id,
            element: document.getElementById(this.element.id + '_Container'),
            moduleName: this.getModuleName(),
            enableRtl: this.enableRtl,
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            isAdaptive: this.isAdaptive as boolean,
            renderMode: this.renderMode,
            localeObj: this.localeObj,
            dataType: this.dataType,
            cssClass: this.cssClass
        };
        this.pivotCommon = new PivotCommon(args);
        this.pivotCommon.control = this;
        if (this.allowDeferLayoutUpdate) {
            this.clonedDataSource = extend({}, this.dataSourceSettings, null, true) as IDataOptions;
            if (this.dataType === 'olap') {
                this.clonedFieldListData = PivotUtil.cloneOlapFieldSettings(this.olapEngineModule.fieldListData);
            }
            this.clonedFieldList = PivotUtil.getClonedFieldList(this.pivotFieldList);
        }
    }
    private getFieldCaption(dataSourceSettings: DataSourceSettingsModel): void {
        const captionData: FieldOptionsModel[][] = this.getFields(dataSourceSettings);
        const engineModule: OlapEngine | PivotEngine = this.dataType === 'olap' ? this.olapEngineModule : this.engineModule;
        if (captionData.length > 0 && engineModule && engineModule.fieldList) {
            let lnt: number = captionData.length;
            while (lnt--) {
                if (captionData[lnt as number]) {
                    for (const obj of captionData[lnt as number]) {
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
    private getFields(dataSourceSettings: DataSourceSettingsModel): FieldOptionsModel[][] {
        return [dataSourceSettings.rows, dataSourceSettings.columns, dataSourceSettings.values,
            dataSourceSettings.filters] as FieldOptionsModel[][];
    }

    /**
     * Updates the PivotEngine using dataSource from Pivot Field List component.
     *
     * @function updateDataSource
     * @returns {void}
     * @hidden
     */

    public updateDataSource(isTreeViewRefresh?: boolean, isEngineRefresh?: boolean): void {
        if (this.pivotGridModule) {
            this.pivotGridModule.showWaitingPopup();
        }
        showSpinner(this.fieldListSpinnerElement as HTMLElement);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const pivot: PivotFieldList = this;
        const control: PivotView | PivotFieldList = pivot.isPopupView ? pivot.pivotGridModule : pivot;
        //setTimeout(() => {
        let isOlapDataRefreshed: boolean = false;
        const pageSettings: IPageSettings = pivot.pivotGridModule && (pivot.pivotGridModule.enableVirtualization
            || pivot.pivotGridModule.enablePaging) ? pivot.pivotGridModule.pageSettings : undefined;
        const isCalcChange: boolean = Object.keys(pivot.lastCalcFieldInfo).length > 0 ? true : false;
        const isSorted: boolean = Object.keys(pivot.lastSortInfo).length > 0 ? true : false;
        const isAggChange: boolean = Object.keys(pivot.lastAggregationInfo).length > 0 ? true : false;
        const isFiltered: boolean = Object.keys(pivot.lastFilterInfo).length > 0 ? true : false;
        const args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(pivot.dataSourceSettings)
        };
        control.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
            if (!(pageSettings && (isSorted || isFiltered || isAggChange || isCalcChange))) {
                PivotUtil.updateDataSourceSettings(pivot, observedArgs.dataSourceSettings);
                PivotUtil.updateDataSourceSettings(pivot.pivotGridModule, observedArgs.dataSourceSettings);
            }
            if (isNullOrUndefined(isEngineRefresh)) {
                if (pivot.dataType === 'pivot') {
                    const customProperties: ICustomProperties = pivot.frameCustomProperties();
                    if (!isSorted) {
                        customProperties.enableValueSorting = pivot.staticPivotGridModule ?
                            pivot.staticPivotGridModule.enableValueSorting : pivot.enableValueSorting;
                    }
                    else {
                        if (pivot.pivotGridModule) {
                            pivot.pivotGridModule.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                        }
                        pivot.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                        customProperties.enableValueSorting = false;
                    }
                    customProperties.savedFieldList = pivot.pivotFieldList;
                    if (pageSettings && (isSorted || isFiltered || isAggChange || isCalcChange) && !pivot.allowDeferLayoutUpdate) {
                        if (isSorted) {
                            pivot.pivotGridModule.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                            if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onSort', null, pivot.lastSortInfo, null, null, null, null);
                            } else {
                                pivot.engineModule.onSort(pivot.lastSortInfo);
                            }
                            pivot.lastSortInfo = {};
                        }
                        if (isFiltered) {
                            if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onFilter', null, null, null, null, pivot.lastFilterInfo, null);
                            } else {
                                pivot.engineModule.onFilter(pivot.lastFilterInfo, pivot.dataSourceSettings as IDataOptions);
                            }
                            pivot.lastFilterInfo = {};
                        }
                        if (isAggChange) {
                            if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onAggregation', null, null, pivot.lastAggregationInfo, null, null, null);
                            } else {
                                pivot.engineModule.onAggregation(pivot.lastAggregationInfo);
                            }
                            pivot.lastAggregationInfo = {};
                        }
                        if (isCalcChange) {
                            if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onCalcOperation', null, null, null, pivot.lastCalcFieldInfo, null, null);
                            } else {
                                pivot.engineModule.onCalcOperation(pivot.lastCalcFieldInfo, pivot.dataSourceSettings);
                            }
                            pivot.lastCalcFieldInfo = {};
                        }
                    } else {
                        if (pivot.dataSourceSettings.mode === 'Server') {
                            if (isSorted) {
                                control.getEngine('onSort', null, pivot.lastSortInfo, null, null, null, null);
                            } else if (isAggChange) {
                                control.getEngine('onAggregation', null, null, pivot.lastAggregationInfo, null, null, null);
                            } else if (isCalcChange) {
                                control.getEngine('onCalcOperation', null, null, null, pivot.lastCalcFieldInfo, null, null);
                            } else if (isFiltered) {
                                control.getEngine('onFilter', null, null, null, null, pivot.lastFilterInfo, null);
                            } else {
                                control.getEngine('onDrop', null, null, null, null, null, null);
                            }
                        } else {
                            pivot.engineModule.renderEngine(
                                pivot.dataSourceSettings as IDataOptions, customProperties, pivot.aggregateCellInfo ?
                                    pivot.getValueCellInfo.bind(pivot) : undefined, pivot.onHeadersSort ?
                                    pivot.getHeaderSortInfo.bind(pivot) : undefined
                            );
                        }
                        pivot.lastSortInfo = {};
                        pivot.lastAggregationInfo = {};
                        pivot.lastCalcFieldInfo = {};
                        pivot.lastFilterInfo = {};
                    }
                } else {
                    isOlapDataRefreshed = pivot.updateOlapDataSource(pivot, isSorted, isCalcChange, isOlapDataRefreshed);
                }
                pivot.getFieldCaption(pivot.dataSourceSettings);
            } else {
                pivot.axisFieldModule.render();
                pivot.isRequiredUpdate = false;
            }
            pivot.enginePopulatedEventMethod(pivot, isTreeViewRefresh, isOlapDataRefreshed);
        });
        //});
    }
    private enginePopulatedEventMethod(pivot: PivotFieldList, isTreeViewRefresh: boolean, isOlapDataRefreshed: boolean): void {
        const control: PivotView | PivotFieldList = pivot.isPopupView ? pivot.pivotGridModule : pivot;
        const eventArgs: EnginePopulatedEventArgs = {
            dataSourceSettings: pivot.dataSourceSettings as IDataOptions,
            pivotFieldList: pivot.dataType === 'pivot' ? pivot.engineModule.fieldList : pivot.olapEngineModule.fieldList,
            pivotValues: pivot.dataType === 'pivot' ? pivot.engineModule.pivotValues : pivot.olapEngineModule.pivotValues
        };
        control.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
            pivot.dataSourceSettings = observedArgs.dataSourceSettings;
            pivot.pivotCommon.dataSourceSettings = pivot.dataSourceSettings as IDataOptions;
            pivot.pivotFieldList = observedArgs.pivotFieldList;
            if (pivot.dataType === 'olap') {
                pivot.olapEngineModule.pivotValues = observedArgs.pivotValues;
                pivot.pivotCommon.engineModule = pivot.olapEngineModule;
            } else {
                pivot.engineModule.pivotValues = observedArgs.pivotValues;
                pivot.pivotCommon.engineModule = pivot.engineModule;
            }
            if (!isTreeViewRefresh && pivot.treeViewModule.fieldTable && !pivot.isAdaptive) {
                pivot.notify(events.treeViewUpdate, {});
            }
            if (pivot.isRequiredUpdate) {
                if (pivot.allowDeferLayoutUpdate) {
                    pivot.clonedDataSource = extend({}, pivot.dataSourceSettings, null, true) as IDataOptions;
                    if (this.dataType === 'olap') {
                        this.clonedFieldListData = PivotUtil.cloneOlapFieldSettings(this.olapEngineModule.fieldListData);
                    }
                    pivot.clonedFieldList = PivotUtil.getClonedFieldList(pivot.pivotFieldList);
                }
                pivot.updateView(pivot.pivotGridModule);
            } else if (this.isPopupView && pivot.allowDeferLayoutUpdate) {
                pivot.pivotGridModule.engineModule = pivot.engineModule;
                pivot.pivotGridModule.setProperties({
                    dataSourceSettings: (<{ [key: string]: Object }>pivot.dataSourceSettings).properties as IDataOptions
                }, true);
                pivot.pivotGridModule.notify(events.uiUpdate, pivot);
                hideSpinner(pivot.fieldListSpinnerElement as HTMLElement);
            }
            if (this.isPopupView && pivot.pivotGridModule &&
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
        const actionName: string = this.getActionCompleteName();
        this.actionObj.actionName = actionName;
        if (this.actionObj.actionName) {
            this.actionCompleteMethod();
        }
    }

    private updateOlapDataSource(pivot: PivotFieldList, isSorted: boolean, isCalcChange: boolean, isOlapDataRefreshed: boolean): boolean {
        const customProperties: IOlapCustomProperties =
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
            pivot.olapEngineModule.renderEngine(pivot.dataSourceSettings as IDataOptions, customProperties, pivot.onHeadersSort
                ? pivot.getHeaderSortInfo.bind(pivot) : undefined);
        }
        pivot.lastSortInfo = {};
        pivot.lastAggregationInfo = {};
        pivot.lastCalcFieldInfo = {};
        pivot.lastFilterInfo = {};
        return isOlapDataRefreshed;
    }
    /**
     * Updates the Pivot Field List component using dataSource from PivotView component.
     *
     * @function update
     * @param {PivotView} control - Pass the instance of pivot table component.
     * @returns {void}
     */
    public update(control: PivotView): void {
        if (control) {
            this.clonedDataSet = control.clonedDataSet;
            this.clonedReport = control.clonedReport;
            this.setProperties({ dataSourceSettings: control.dataSourceSettings, showValuesButton: control.showValuesButton }, true);
            this.engineModule = control.engineModule;
            this.olapEngineModule = control.olapEngineModule;
            this.dataType = control.dataType;
            this.pivotFieldList = this.dataType === 'olap' ? control.olapEngineModule.fieldList : control.engineModule.fieldList;
            if (this.isPopupView) {
                this.pivotGridModule = control;
            } else {
                this.staticPivotGridModule = control;
            }
            this.getFieldCaption(control.dataSourceSettings);
            this.pivotCommon.engineModule = this.dataType === 'olap' ? this.olapEngineModule : this.engineModule;
            this.pivotCommon.dataSourceSettings = this.dataSourceSettings as IDataOptions;
            this.pivotCommon.control = this;
            if (this.treeViewModule.fieldTable && !this.isAdaptive) {
                this.notify(events.treeViewUpdate, {});
            }
            this.axisFieldModule.render();
            if (!this.isPopupView && this.allowDeferLayoutUpdate) {
                this.clonedDataSource = extend({}, this.dataSourceSettings, null, true) as IDataOptions;
                if (this.dataType === 'olap') {
                    this.clonedFieldListData = PivotUtil.cloneOlapFieldSettings(this.olapEngineModule.fieldListData);
                }
                this.clonedFieldList = PivotUtil.getClonedFieldList(this.pivotFieldList);
            }
        }
    }

    /**
     * Updates the PivotView component using dataSource from Pivot Field List component.
     *
     * @function updateView
     * @param {PivotView} control - Pass the instance of pivot table component.
     * @returns {void}
     */
    public updateView(control: PivotView): void {
        if (control) {
            const isOlapCalcFieldAdded: boolean = this.actionObj.actionName === 'Calculated field applied' && control.dataType === 'olap';
            if (control.element.querySelector('.e-spin-hide') && !isOlapCalcFieldAdded &&
                (!(this.allowDeferLayoutUpdate && !this.isDeferUpdateApplied) || control.isInitial)) {
                control.showWaitingPopup();
            }
            control.clonedDataSet = this.clonedDataSet;
            control.clonedReport = this.clonedReport;
            control.setProperties({ dataSourceSettings: this.dataSourceSettings, showValuesButton: this.showValuesButton }, true);
            control.engineModule = this.engineModule;
            control.olapEngineModule = this.olapEngineModule;
            control.dataType = this.dataType;
            if (!this.pivotChange) {
                control.pivotValues = this.dataType === 'olap' ? this.olapEngineModule.pivotValues : this.engineModule.pivotValues;
            }
            const eventArgs: FieldListRefreshedEventArgs = {
                dataSourceSettings: PivotUtil.getClonedDataSourceSettings(control.dataSourceSettings),
                pivotValues: control.pivotValues
            };
            control.trigger(events.fieldListRefreshed, eventArgs);
            if (!this.isPopupView) {
                this.staticPivotGridModule = control;
                control.isStaticRefresh = true;
            }
            this.isDeferUpdateApplied = false;
            if (this.staticPivotGridModule) {
                this.staticPivotGridModule.isServerWaitingPopup = true;
            }
            control.dataBind();
        }
    }

    /**
     * Called internally to trigger populate event.
     *
     * @hidden
     */

    public triggerPopulateEvent(): void {
        const control: PivotView | PivotFieldList = this.isPopupView ? this.pivotGridModule : this;
        const eventArgs: EnginePopulatedEventArgs = {
            dataSourceSettings: this.dataSourceSettings as IDataOptions,
            pivotFieldList: this.dataType === 'olap' ? this.olapEngineModule.fieldList : this.engineModule.fieldList,
            pivotValues: this.dataType === 'olap' ? this.olapEngineModule.pivotValues : this.engineModule.pivotValues
        };
        control.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
            this.dataSourceSettings = observedArgs.dataSourceSettings;
            this.pivotFieldList = observedArgs.pivotFieldList;
            if (this.dataType === 'olap') {
                this.olapEngineModule.pivotValues = observedArgs.pivotValues;
            } else {
                this.engineModule.pivotValues = observedArgs.pivotValues;
            }
        });
    }

    /** @hidden */

    public actionBeginMethod(): boolean {
        const eventArgs: PivotActionBeginEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings),
            actionName: this.actionObj.actionName,
            fieldInfo: this.actionObj.fieldInfo,
            cancel: false
        };
        const control: PivotView | PivotFieldList = this.isPopupView ? this.pivotGridModule : this;
        control.trigger(events.actionBegin, eventArgs);
        return eventArgs.cancel;
    }

    /** @hidden */

    public actionCompleteMethod(): void {
        const eventArgs: PivotActionCompleteEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings),
            actionName: this.actionObj.actionName,
            fieldInfo: this.actionObj.fieldInfo,
            actionInfo: this.actionObj.actionInfo
        };
        const control: PivotView | PivotFieldList = this.isPopupView ? this.pivotGridModule : this;
        control.trigger(events.actionComplete, eventArgs);
        this.actionObj.actionName = '';
        this.actionObj.actionInfo = undefined;
        this.actionObj.fieldInfo = undefined;
    }

    /** @hidden */

    public actionFailureMethod(error: Error): void {
        const eventArgs: PivotActionFailureEventArgs = {
            actionName: this.actionObj.actionName,
            errorInfo: error
        };
        const control: PivotView | PivotFieldList = this.isPopupView ? this.pivotGridModule : this;
        control.trigger(events.actionFailure, eventArgs);
    }

    /** @hidden */

    public getActionCompleteName(): string {
        const actionName: string = (this.actionObj.actionName === events.openCalculatedField) ? events.calculatedFieldApplied :
            (this.actionObj.actionName === events.editCalculatedField) ? events.calculatedFieldEdited :
                (this.actionObj.actionName === events.sortField) ? events.fieldSorted : (this.actionObj.actionName === events.filterField)
                    ? events.fieldFiltered : (this.actionObj.actionName === events.removeField) ? events.fieldRemoved
                        : (this.actionObj.actionName === events.aggregateField) ? events.fieldAggregated :
                            this.actionObj.actionName === events.sortFieldTree ? events.fieldTreeSorted : this.actionObj.actionName;
        return actionName;
    }

    /**
     * Destroys the Field Table component.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        this.unWireEvent();
        if (this.engineModule && !this.destroyEngine) {
            this.engineModule.fieldList = {};
            this.engineModule.rMembers = null;
            this.engineModule.cMembers = null;
            (this.engineModule as PivotEngine).valueMatrix = null;
            (this.engineModule as PivotEngine).indexMatrix = null;
            this.engineModule = {} as PivotEngine;
        }
        if (this.olapEngineModule && !this.destroyEngine) {
            this.olapEngineModule.fieldList = {};
            this.olapEngineModule = {} as OlapEngine;
        }
        if (this.pivotFieldList) {
            this.pivotFieldList = {};
        }
        if (this.contextMenuModule) {
            this.contextMenuModule.destroy();
        }
        if (this.treeViewModule) {
            this.treeViewModule.destroy();
        }
        if (this.pivotButtonModule) {
            this.pivotButtonModule.destroy();
        }
        if (this.pivotCommon) {
            this.pivotCommon.destroy();
        }
        if (this.dialogRenderer) {
            this.dialogRenderer.destroy();
        }
        if (this.calculatedFieldModule) {
            this.calculatedFieldModule.destroy();
        }
        super.destroy();
        if (this.contextMenuModule) {
            this.contextMenuModule = null;
        }
        if (this.treeViewModule) {
            this.treeViewModule = null;
        }
        if (this.pivotButtonModule) {
            this.pivotButtonModule = null;
        }
        if (this.pivotCommon) {
            this.pivotCommon = null;
        }
        if (this.dialogRenderer) {
            this.dialogRenderer = null;
        }
        if (this.calculatedFieldModule) {
            this.calculatedFieldModule = null;
        }
        if (this.axisFieldModule) {
            this.axisFieldModule = null;
        }
        if (this.axisTableModule) {
            this.axisTableModule = null;
        }
        if (this.renderModule) {
            this.renderModule = null;
        }
        if (this.clonedDataSet) {
            this.clonedDataSet = null;
        }
        if (this.clonedReport) {
            this.clonedReport = null;
        }
        if (this.clonedFieldList) {
            this.clonedFieldList = null;
        }
        if (this.clonedFieldListData) {
            this.clonedFieldListData = null;
        }
        if (this.localeObj) {
            this.localeObj = null;
        }
        if (this.defaultLocale) {
            this.defaultLocale = null;
        }
        this.element.innerHTML = '';
        removeClass([this.element], cls.ROOT);
        removeClass([this.element], cls.RTL);
        removeClass([this.element], cls.DEVICE);
    }
}
