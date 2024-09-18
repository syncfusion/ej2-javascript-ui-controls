import { Component, addClass, createElement, EventHandler, isNullOrUndefined, ModuleDeclaration, extend, merge, SanitizeHtmlHelper} from '@syncfusion/ej2-base';
import { removeClass, EmitType, Complex, Collection, KeyboardEventArgs, getValue, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import {Event, Property, NotifyPropertyChanges, INotifyPropertyChanged, setValue, KeyboardEvents, L10n } from '@syncfusion/ej2-base';
import { Column, ColumnModel } from '../models/column';
import { BeforeBatchSaveArgs, BeforeBatchAddArgs, BatchDeleteArgs, BeforeBatchDeleteArgs, Row, getNumberFormat } from '@syncfusion/ej2-grids';
import { GridModel, ColumnQueryModeType, HeaderCellInfoEventArgs, EditSettingsModel as GridEditModel, Freeze as FreezeColumn } from '@syncfusion/ej2-grids';
import { RowDragEventArgs, RowDropEventArgs, RowDropSettingsModel, RowDropSettings, getUid, parentsUntil } from '@syncfusion/ej2-grids';
import { LoadingIndicator } from '../models/loading-indicator';
import { LoadingIndicatorModel } from '../models/loading-indicator-model';
import { ActionEventArgs, TextAlign } from'@syncfusion/ej2-grids';
import { DetailDataBoundEventArgs, ClipMode, ColumnChooser}  from '@syncfusion/ej2-grids';
import { SearchEventArgs, AddEventArgs, EditEventArgs, DeleteEventArgs}  from '@syncfusion/ej2-grids';
import { SaveEventArgs, CellSaveArgs, BatchAddArgs, BatchCancelArgs,  BeginEditArgs, CellEditArgs}  from '@syncfusion/ej2-grids';
import { FilterSettings } from '../models/filter-settings';
import { TextWrapSettings } from '../models/textwrap-settings';
import { TextWrapSettingsModel } from '../models/textwrap-settings-model';
import {Filter} from '../actions/filter';
import { Logger as TreeLogger } from '../actions/logger';
import { BeforeCopyEventArgs, BeforePasteEventArgs } from '@syncfusion/ej2-grids';
import { TreeClipboard } from '../actions/clipboard';
import {Aggregate} from '../actions/summary';
import { Reorder } from '../actions/reorder';
import { Resize } from '../actions/resize';
import { Selection as TreeGridSelection } from '../actions/selection';
import { ColumnMenu } from '../actions/column-menu';
import { DetailRow } from '../actions/detail-row';
import { Freeze } from '../actions/freeze-column';
import { Print } from '../actions/print';
import * as events from '../base/constant';
import {TreeGridModel} from './treegrid-model';
import { FilterSettingsModel } from '../models/filter-settings-model';
import { SearchSettings} from '../models/search-settings';
import { SearchSettingsModel } from '../models/search-settings-model';
import {RowInfo, RowDataBoundEventArgs, PageEventArgs, FilterEventArgs, FailureEventArgs, SortEventArgs } from '@syncfusion/ej2-grids';
import { RowSelectingEventArgs, RowSelectEventArgs, RowDeselectingEventArgs, RowDeselectEventArgs, IIndex, ISelectedCell } from '@syncfusion/ej2-grids';
import {ColumnModel as GridColumnModel, Column as GridColumn, CellSelectEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';
import { SelectionSettings } from '../models/selection-settings';
import { SelectionSettingsModel } from '../models/selection-settings-model';
import {getActualProperties, SortDirection, getObject, ColumnDragEventArgs } from '@syncfusion/ej2-grids';
import { PrintMode, Data, IGrid, ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { ColumnMenuItem, ColumnMenuItemModel, CheckBoxChangeEventArgs } from '@syncfusion/ej2-grids';
import { ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { PdfExportCompleteArgs, PdfHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelExportProperties, PdfExportProperties, CellSelectingEventArgs, PrintEventArgs } from '@syncfusion/ej2-grids';
import { ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import {BeforeDataBoundArgs} from '@syncfusion/ej2-grids';
import { DataManager, ReturnOption, RemoteSaveAdaptor, Query, JsonAdaptor, Deferred, UrlAdaptor } from '@syncfusion/ej2-data';
import { createSpinner, hideSpinner, showSpinner, Dialog } from '@syncfusion/ej2-popups';
import { isRemoteData, isOffline, extendArray, isCountRequired, findChildrenRecords } from '../utils';
import { Grid, QueryCellInfoEventArgs, Logger } from '@syncfusion/ej2-grids';
import { Render } from '../renderer/render';
import { VirtualTreeContentRenderer } from '../renderer/virtual-tree-content-render';
import { DataManipulation } from './data';
import { RowDD } from '../actions/rowdragdrop';
import { Sort } from '../actions/sort';
import { ITreeData, RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs, TreeGridExcelExportProperties } from './interface';
import { DataStateChangeEventArgs, RowExpandingEventArgs, TreeGridPdfExportProperties } from './interface';
import { iterateArrayOrObject, GridLine } from '@syncfusion/ej2-grids';
import { DataSourceChangedEventArgs, RecordDoubleClickEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';
import { ToolbarItems, ToolbarItem, ContextMenuItem, ContextMenuItems, RowPosition, CopyHierarchyType } from '../enum';
import { ItemModel, ClickEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { PageSettings } from '../models/page-settings';
import { PageSettingsModel } from '../models/page-settings-model';
import { AggregateRow } from '../models/summary';
import { AggregateRowModel } from '../models/summary-model';
import { ExcelExport } from '../actions/excel-export';
import { PdfExport } from '../actions/pdf-export';
import { Toolbar } from '../actions/toolbar';
import { Page } from '../actions/page';
import { ContextMenu } from '../actions/context-menu';
import { EditSettings } from '../models/edit-settings';
import { EditSettingsModel } from '../models/edit-settings-model';
import { Edit} from '../actions/edit';
import { SortSettings } from '../models/sort-settings';
import { SortSettingsModel } from '../models/sort-settings-model';
import { isHidden, getExpandStatus } from '../utils';
import { editAction } from '../actions/crud-actions';
import { InfiniteScrollSettings } from '../models/infinite-scroll-settings';
import { InfiniteScrollSettingsModel } from '../models/infinite-scroll-settings-model';
import { TreeActionEventArgs } from '..';
import * as literals from '../base/constant';



/**
 * Represents the TreeGrid component.
 * ```html
 * <div id='treegrid'></div>
 * <script>
 *  var treegridObj = new TreeGrid({ allowPaging: true });
 *  treegridObj.appendTo('#treegrid');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class TreeGrid extends Component<HTMLElement> implements INotifyPropertyChanged {
    constructor(options?: TreeGridModel, element?: Element) {
        super(options, <HTMLButtonElement | string>element);
        TreeGrid.Inject(TreeGridSelection, TreeLogger);
        setValue('mergePersistData', this.mergePersistTreeGridData, this);
        const logger: string = 'Logger';
        if (!isNullOrUndefined(this.injectedModules[`${logger}`])) {
            Grid.Inject(Logger);
        }
        const freezeModulePresent: Function[] = this.injectedModules.filter((e: Function) => {
            if (e.prototype.getModuleName() === 'freeze') {
                Grid.Inject(FreezeColumn);
            }
        });
        this.grid = new Grid();
    }
    // internal variables
    private defaultLocale: Object;
    private dataResults: ReturnOption = {};
    private l10n: L10n;
    public dataModule: DataManipulation;
    private registeredTemplate: Object;
    private uniqueIDCollection: Object = {};
    private uniqueIDFilterCollection: Object = {};
    private changedRecords: string = 'changedRecords';
    private deletedRecords: string = 'deletedRecords';
    private addedRecords: string = 'addedRecords';
    private targetElement: HTMLElement;
    private isGantt: boolean;
    private isAddedFromGantt: boolean;
    private isIndentEnabled: boolean;
    private indentOutdentAction: string = 'indentOutdentAction';
    private isFromChartSide: boolean = false;
    private parentQuery: any;
    // A boolean flag indicating whether the collapsed event has been triggered.
    private isCollapsedEventTriggered: boolean;
    // A boolean flag indicating whether the collapsing event has been triggered.
    private isCollapsingEventTriggered: boolean;
    // A boolean flag indicating whether the expanded event has been triggered.
    private isExpandedEventTriggered: boolean;
    // A boolean flag indicating whether the expanding event has been triggered.
    private isExpandingEventTriggered: boolean;
    // Sets to true when collapsing is to be prevented.
    private collapseAllPrevent: boolean;
    // Sets to true when expanding is to be prevented.
    private expandAllPrevent: boolean;
    /**
     * The `sortModule` is used to manipulate sorting in TreeGrid.
     */
    public sortModule: Sort;
    private action: string;
    private dropIndex: number;
    private dropPosition: string;
    private modifiedRecords: ITreeData[] = [];
    private selectedRecords: Object[];
    private selectedRows: Object[];
    private loggerModule: TreeLogger;
    private isSelfReference: boolean;
    private columnModel: Column[];
    private isExpandAll: boolean;
    private isCollapseAll: boolean;
    private isExpandRefresh: boolean;
    private gridSettings: GridModel;
    private isEditCollapse: boolean;
    private treeColumnTextAlign: TextAlign;
    private treeColumnField: string;
    private stackedHeader: boolean = false;
    private isExcel: boolean;
    /** @hidden */
    public initialRender: boolean;
    /** @hidden */
    public flatData: Object[];
    /** @hidden */
    private infiniteScrollData: Object[];
    /** @hidden */
    private remoteCollapsedData: Object[];
    /** @hidden */
    private remoteExpandedData: Object[];
    /** @hidden */
    public isLocalData: boolean;
    /** @hidden */
    public parentData: Object[];
    // module Declarations
    /**
     * @hidden
     */
    public renderModule: Render;
    /** @hidden */
    public summaryModule: Aggregate;
    /**
     * The `reorderModule` is used to manipulate reordering in TreeGrid.
     */
    public reorderModule: Reorder;
    /**
     * The `columnMenuModule` is used to manipulate column menu items and its action in TreeGrid.
     */
    public columnMenuModule: ColumnMenu;
    /**
     * The `rowDragandDrop` is used to manipulate Row Reordering in TreeGrid.
     */
    public rowDragAndDropModule: RowDD;
    /**
     * The `contextMenuModule` is used to handle context menu items and its action in the TreeGrid.
     */
    public contextMenuModule: ContextMenu;
    /**
     * `detailRowModule` is used to handle detail rows rendering in the TreeGrid.
     *
     * @hidden
     */
    public detailRowModule: DetailRow;
    /**
     * `freezeModule` is used to freeze the rows and columns in the TreeGrid.
     *
     * @hidden
     */
    public freezeModule: Freeze;
    /**
     * Gets or sets the number of frozen rows.
     *
     * @default 0
     */
    @Property(0)
    public frozenRows: number;

    /**
     * Gets or sets the number of frozen columns.
     *
     * @default 0
     */
    @Property(0)
    public frozenColumns: number;
    /**
     *  Defines the mode of clip. The available modes are,
     * ```props
     * * Clip :- Truncates the cell content when it overflows its area.
     * * Ellipsis :- Displays ellipsis when the cell content overflows its area.
     * * EllipsisWithTooltip :- Displays ellipsis when the cell content overflows its area,
     * ```
     * also it will display the tooltip while hover on ellipsis is applied.
     *
     * @default Syncfusion.EJ2.Grids.ClipMode.Ellipsis
     * @aspType Syncfusion.EJ2.Grids.ClipMode
     * @isEnumeration true
     */
    @Property('Ellipsis')
    public clipMode: ClipMode;
    /**
     * `resizeModule` is used to manipulate resizing in the TreeGrid.
     *
     * @hidden
     */
    public resizeModule: Resize;
    /**
     * The `keyboardModule` is used to manipulate keyboard interactions in TreeGrid.
     */
    public keyboardModule: KeyboardEvents;
    /**
     * The `printModule` is used to handle the printing feature of the TreeGrid.
     */
    public printModule: Print;
    /**
     * `clipboardModule` is used to handle TreeGrid copy action.
     */
    public clipboardModule: TreeClipboard;

    private keyConfigs: { [key: string]: string };
    /** @hidden */
    public filterModule: Filter;
    public excelExportModule: ExcelExport;
    public pdfExportModule: PdfExport;
    public selectionModule: TreeGridSelection;
    /** @hidden */

    /** @hidden */
    public grid: Grid;
    /**    
     * Defines the schema of dataSource.
     * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.
     * {% codeBlock src='treegrid/columns/index.md' %}{% endcodeBlock %}   
     *
     * @default []
     */
    @Property([])
    public columns: ColumnModel[] | string[] | Column[];
    /**
     * Specifies the mapping property path for child records in data source
     * {% codeBlock src='treegrid/childMapping/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public childMapping: string;
    /**
     * Specifies whether record is parent or not for the remote data binding
     *
     * @default null
     */
    @Property(null)
    public hasChildMapping: string;
    /**
     * Specifies the index of the column that needs to have the expander button.
     *
     * @default 0
     */
    @Property(0)
    public treeColumnIndex: number;
    /**
     * Specifies the name of the field in the dataSource, which contains the id of that row.
     * {% codeBlock src='treegrid/idMapping/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public idMapping: string;
    /**
     * Specifies the name of the field in the dataSource, which contains the parent’s id
     * {% codeBlock src='treegrid/parentIdMapping/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public parentIdMapping: string;

    /**
     * Specifies whether to load all the rows in collapsed state when the TreeGrid is rendered for the first time.
     *
     * @default false
     */
    @Property(false)
    public enableCollapseAll: boolean;

    /**
     * Specifies the mapping property path for the expand status of a record in data source.
     *
     * @default null
     */
    @Property(null)
    public expandStateMapping: string;

    /**
     * If `allowRowDragAndDrop` is set to true, you can drag and drop treegrid rows at another treegrid.
     *
     * @default false
     */
    @Property(false)
    public allowRowDragAndDrop: boolean;

    /**
     * It is used to render TreeGrid table rows.
     * {% codeBlock src='treegrid/dataSource/index.md' %}{% endcodeBlock %}
     *
     * @default []
     * @isGenericType true
     * @isDataSource true
     */
    @Property([])
    public dataSource: Object | DataManager;
    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with data processing.
     *
     * @default null
     */
    @Property()
    public query: Query;
    /**
     * @hidden
     */
    @Property()
    public cloneQuery: Query;
    /**
     * Defines the print modes. The available print modes are
     * ```props
     * * AllPages :- Prints all pages of the TreeGrid.
     * * CurrentPage :- Prints the current page of the TreeGrid.
     * ```
     *
     * @default Syncfusion.EJ2.Grids.PrintMode.AllPages
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.PrintMode
     */
    @Property('AllPages')
    public printMode: PrintMode;
    /**
     * If `allowPaging` is set to true, pager renders.
     *
     * @default false
     */
    @Property(false)
    public allowPaging: boolean;
    /**
     * When enabled, only parent records would be rendered during the initial render and child records will be loaded only when expanding a parent record.
     * This property is only applicable for remote data binding.
     * Loading child records on demand can improve the performance of data-bound controls with a large number of records.
     * Child records are only loaded when they are requested, rather than loading all child records at once.
     *
     * @default true
     */
    @Property(true)
    public loadChildOnDemand: boolean;

    /**
     * If `allowTextWrap` set to true,
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells.
     *
     * @default false
     */
    @Property(false)
    public allowTextWrap: boolean;
    /**    
     * Configures the text wrap in the TreeGrid.
     *
     * @default {wrapMode:"Both"}
     */
    @Complex<TextWrapSettingsModel>({}, TextWrapSettings)
    public textWrapSettings: TextWrapSettingsModel;
    /**
     * If `allowReordering` is set to true, TreeGrid columns can be reordered.
     * Reordering can be done by drag and drop of a particular column from one index to another index.
     * > If TreeGrid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
     *
     * @default false
     */
    @Property(false)
    public allowReordering: boolean;
    /**
     * If `allowResizing` is set to true, TreeGrid columns can be resized.
     *
     * @default false
     */
    @Property(false)
    public allowResizing: boolean;
    /**
     * If `autoCheckHierarchy` is set to true, hierarchy checkbox selection is enabled in TreeGrid.
     *
     * @default false
     */
    @Property(false)
    public autoCheckHierarchy: boolean;
    /**    
     * Configures the pager in the TreeGrid.
     *
     * @default {currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false, pageSizes: false, template: null}
     */
    @Complex<PageSettingsModel>({}, PageSettings)
    public pageSettings: PageSettingsModel;

    /**
     * Configures the row drop settings of the TreeGrid.
     */
    @Complex<RowDropSettingsModel>({}, RowDropSettings)
    public rowDropSettings: RowDropSettingsModel;
    /**
     * Defines the currencyCode format of the Tree Grid columns
     *
     * @private
     */
    @Property('USD')
    private currencyCode: string;
    /**
     * @hidden
     * It used to render pager template
     * @default null
     * @aspType string
     */
    @Property()
    public pagerTemplate: string | Function;
    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     *
     * > Check the [`Column menu`](../../treegrid/columns/#column-menu/) for its configuration.
     *
     * @default false
     */
    @Property(false)
    public showColumnMenu: boolean;
    /**
     * If `showColumnChooser` is set to true, it allows you to dynamically show or hide columns.
     *
     * @default false
     */
    @Property(false)
    public showColumnChooser: boolean;

    /**
     * If `allowSorting` is set to true, it allows sorting of treegrid records when column header is clicked.
     *
     * @default false
     */
    @Property(false)
    public allowSorting: boolean;
    /**
     * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the treegrid.
     * > `allowSorting` should be true.
     *
     * @default true
     */
    @Property(true)
    public allowMultiSorting: boolean;
    /**
     * Configures the sort settings of the TreeGrid.
     *
     * @default {columns:[]}
     */
    @Complex<SortSettingsModel>({}, SortSettings)
    public sortSettings: SortSettingsModel;
    /**
     * Configures the TreeGrid aggregate rows.
     * > Check the [`Aggregates`](../../treegrid/aggregates/aggregates) for its configuration.
     *
     * @default []
     */
    @Collection<AggregateRowModel>([], AggregateRow)
    public aggregates: AggregateRowModel[];
    /**
     * Configures the edit settings.
     *
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Normal',
     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }
     */
    @Complex<EditSettingsModel>({}, EditSettings)
    public editSettings: EditSettingsModel;
    /**
     * If `allowFiltering` is set to true the filter bar will be displayed.
     * If set to false the filter bar will not be displayed.
     * Filter bar allows the user to filter tree grid records with required criteria.
     *
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * The detail template allows you to show or hide additional information about a particular row.
     *
     * > It accepts either the [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
     * or the HTML element ID.
     *
     * @aspType string
     */
    @Property()
    public detailTemplate: string | Function;
    /**
     * Configures the filter settings of the TreeGrid.
     *
     * @default {columns: [], type: 'FilterBar', mode: 'Immediate', showFilterBarStatus: true, immediateModeDelay: 1500 , operators: {}}
     */
    @Complex<FilterSettingsModel>({}, FilterSettings)
    public filterSettings: FilterSettingsModel;
    /**
     * Configures the search settings of the TreeGrid.
     *
     * @default {search: [] , operators: {}}
     */
    @Complex<SearchSettingsModel>({}, SearchSettings)
    public searchSettings: SearchSettingsModel;

    /**
     * `toolbar` defines the ToolBar items of the TreeGrid.
     * It contains built-in and custom toolbar items.
     * If a string value is assigned to the `toolbar` option, it is considered as the template for the whole TreeGrid ToolBar.
     * If an array value is assigned, it is considered as the list of built-in and custom toolbar items in the TreeGrid's Toolbar.
     * <br><br>
     * The available built-in ToolBar items are:
     * * Search: Searches records by the given key.
     * * ExpandAll: Expands all the rows in TreeGrid
     * * CollapseAll: Collapses all the rows in TreeGrid
     * * ExcelExport - Export the TreeGrid to Excel(excelExport() method manually to make export.)
     * * PdfExport - Export the TreeGrid to PDF(pdfExport() method manually to make export.)
     * * CsvExport - Export the TreeGrid to CSV(csvExport() method manually to make export.)<br><br>
     * The following code example implements the custom toolbar items.
     *
     * @default null
     */
    @Property()
    public toolbar: (ToolbarItems | string| ItemModel | ToolbarItem)[];
    /**
     * @hidden
     * It used to render toolbar template
     * @default null
     * @aspType string
     */
    @Property()
    public toolbarTemplate: string | Function;
    /**
     * Defines the mode of TreeGrid lines. The available modes are,
     * ```props
     * * Both :- Displays both horizontal and vertical TreeGrid lines.
     * * None :- No TreeGrid lines are displayed.
     * * Horizontal :- Displays the horizontal TreeGrid lines only.
     * * Vertical :- Displays the vertical TreeGrid lines only.
     * * Default :- Displays TreeGrid lines based on the theme.
     * ```
     *
     * @default Syncfusion.EJ2.Grids.GridLine.Default
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.GridLine
     */
    @Property('Default')
    public gridLines: GridLine;
    /**
     * `contextMenuItems` defines both built-in and custom context menu items.
     * <br><br>
     * The available built-in items are,
     * * `AutoFitAll` - Auto fit the size of all columns.
     * * `AutoFit` - Auto fit the current column.
     * * `Edit` - Edit the current record.
     * * `Delete` - Delete the current record.
     * * `Save` - Save the edited record.
     * * `Cancel` - Cancel the edited state.
     * * `PdfExport` - Export the grid as Pdf format.
     * * `ExcelExport` - Export the grid as Excel format.
     * * `CsvExport` - Export the grid as CSV format.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `FirstPage` - Go to the first page.
     * * `PrevPage` - Go to the previous page.
     * * `LastPage` - Go to the last page.
     * * `NextPage` - Go to the next page.
     *
     * @default null
     */
    @Property()
    public contextMenuItems: ContextMenuItem[] | ContextMenuItemModel[];
    /**
     * `columnMenuItems` defines both built-in and custom column menu items.
     * <br><br>
     * The available built-in items are,
     * * `AutoFitAll` - Auto fit the size of all columns.
     * * `AutoFit` - Auto fit the current column.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `Filter` - Filter options will show based on filterSettings property like filterbar, menu filter.
     *
     * @default null
     */
    @Property()
    public columnMenuItems: ColumnMenuItem[] | ColumnMenuItemModel[];
    /**
     * The row template that renders customized rows from the given template.
     * By default, TreeGrid renders a table row for every data source item.
     * > * It accepts either [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
     * or HTML element ID.
     * > * The row template must be a table row.
     *
     * > Check the [`Row Template`](../../treegrid/row) customization.
     *
     * @aspType string
     */
    @Property()
    public rowTemplate: string | Function;
    /**
     * `copyHierarchyMode` Defines the copy clipboard types.
     * <br><br>
     * The available built-in items are,
     * * `Parent` - Copy the selected data with parent record.
     * * `Child` - Copy the selected data with child record.
     * * `Both` - Copy the selected data with both parent and child record.
     * * `None` - Copy only the selected record.
     *
     * @default Parent
     */
    @Property('Parent')
    public copyHierarchyMode: CopyHierarchyType;

    /**
     * Defines the height of TreeGrid rows.
     *
     * @default null
     */
    @Property(null)
    public rowHeight: number;
    /**    
     * If `enableAltRow` is set to true, the TreeGrid will render with `e-altrow` CSS class to the alternative tr elements.   
     * > Check the [`AltRow`](../../treegrid/row/#styling-alternate-rows/) to customize the styles of alternative rows.
     *
     * @default true 
     */
    @Property(true)
    public enableAltRow: boolean;
    /**
     * Enables or disables the key board interaction of TreeGrid.    
     *
     * @hidden
     * @default true
     */
    @Property(true)
    public allowKeyboard: boolean;
    /**    
     * If `enableHover` is set to true, the row hover is enabled in the TreeGrid.
     *
     * @default false
     */
    @Property(false)
    public enableHover: boolean;
    /**    
     * If `enableAutoFill` is set to true, then the auto fill icon will displayed on cell selection for copy cells.
     * It requires the selection `mode` to be Cell and `cellSelectionMode` to be `Box`.
     *
     * @default false
     */
    @Property(false)
    public enableAutoFill: boolean;
    /**
     * If `enableAdaptiveUI` is set to true, the pop-up UI will become adaptive to small screens,
     * and be used for filtering and other features.
     * ```html
     * <div id='treegrid'></div>
     * <script>
     *  var treegridObj = new TreeGrid({ enableAdaptiveUI: true });
     *  treegridObj.appendTo('#treegrid');
     * </script>
     * ```
     *
     * @default false
     */
    @Property(false)
    public enableAdaptiveUI: boolean;
    /**
     * If `enableImmutableMode`  is set to true, the TreeGrid will reuse old rows if it exists in the new result instead of
     * full refresh while performing the TreeGrid actions.
     *
     * @default false
     */
    @Property(false)
    public enableImmutableMode: boolean;
    /**
     * Defines the scrollable height of the TreeGrid content.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * Defines the TreeGrid width.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;
    /**
     *  Configures the loading indicator of the Tree Grid. Specifies whether to display spinner or shimmer effect
     *  during the waiting time on any actions (paging, sorting, filtering, CRUD operations) performed in Tree Grid.
     *
     * @default {indicatorType: 'Spinner'}
     */
    @Complex<LoadingIndicatorModel>({}, LoadingIndicator)
    public loadingIndicator: LoadingIndicatorModel;
    /**
     * Specifies whether to display shimmer effect during scrolling action in virtual scrolling feature.
     * If disabled, spinner is shown instead of shimmer effect.
     *
     * @default true
     */
    @Property(true)
    public enableVirtualMaskRow: boolean;
    /**
     * If `enableVirtualization` set to true, then the TreeGrid will render only the rows visible within the view-port
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in TreeGrid.
     *
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;
    /**
     * If `enableColumnVirtualization` set to true, then the Tree Grid will render only the columns visible within the view-port
     * and load subsequent columns on horizontal scrolling. This helps to load large dataset of columns in Tree Grid.
     *
     * @default false
     */
    @Property(false)
    public enableColumnVirtualization: boolean;
    /**
     * Specifies whether to display or remove the untrusted HTML values in the TreeGrid component.
     * If `enableHtmlSanitizer` is set to true, then it will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;
    /**
     * If `enableInfiniteScrolling` set to true, then the data will be loaded in TreeGrid when the scrollbar reaches the end.
     * This helps to load large dataset in TreeGrid.
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public enableInfiniteScrolling: boolean;
    /**
     * Configures the infinite scroll settings.
     *
     * @default { enableCache: false, maxBlocks: 5, initialBlocks: 5 }
     * @deprecated
     */
    @Complex<InfiniteScrollSettingsModel>({}, InfiniteScrollSettings)
    public infiniteScrollSettings: InfiniteScrollSettingsModel;
    /**
     * `columnQueryMode`provides options to retrieves data from the data source.Their types are
     * * `All`: It retrieves whole data source.
     * * `Schema`: retrieves data for all the defined columns in TreeGrid from the data source.
     * * `ExcludeHidden`: retrieves data only for visible columns of TreeGrid from the data Source.
     *
     * @default All
     */
    @Property('All')
    public columnQueryMode: ColumnQueryModeType;
    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * This event allows customization of TreeGrid properties before rendering.
     *
     * @event load
     */
    @Event()
    public load: EmitType<Object>;
    /**
     * Triggers while expanding the TreeGrid record
     *
     * @event expanding
     */
    @Event()
    public expanding: EmitType<RowExpandingEventArgs>;
    /**
     * Triggers after the record is expanded
     *
     * @event expanded
     */
    @Event()
    public expanded: EmitType<RowExpandedEventArgs>;
    /**
     * Triggers while collapsing the TreeGrid record
     *
     * @event collapsing
     */
    @Event()
    public collapsing: EmitType<RowCollapsingEventArgs>;
    /**
     * Triggers after the record is collapsed.
     *
     * @event collapsed
     */
    @Event()
    public collapsed: EmitType<RowCollapsedEventArgs>;
    /**
     * Triggers when cell is saved.
     *
     * @event cellSave
     */
    @Event()
    public cellSave: EmitType<CellSaveArgs>;
    /**
     * Triggers when cell is saved.
     *
     * @event cellSaved
     */
    @Event()
    public cellSaved: EmitType<CellSaveArgs>;

    /* eslint-disable */
  /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc., starts.
   * @event actionBegin
   */
  @Event()
  public actionBegin: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs | SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;
  
  /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc. are completed.
   * @event actionComplete
   */

  @Event()
  public actionComplete: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs| SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;

  /** 
   * Triggers before the record is to be edit.
   * @event beginEdit
   */
  @Event()
  public beginEdit: EmitType<BeginEditArgs>;
  /** 
   * Triggers when records are added in batch mode.
   * @event batchAdd
   */
  @Event()
  public batchAdd: EmitType<BatchAddArgs>;
  /** 
   * Triggers when records are deleted in batch mode.
   * @event batchDelete
   */
  @Event()
  public batchDelete: EmitType<BatchDeleteArgs>;
  /** 
   * Triggers before records are added in batch mode.
   * @event batchCancel
   */
  @Event()
  public batchCancel: EmitType<BatchCancelArgs>;
  /** 
   * Triggers before records are added in batch mode.
   * @event beforeBatchAdd
   */
  @Event()
  public beforeBatchAdd: EmitType<BeforeBatchAddArgs>;
  /** 
   * Triggers before records are deleted in batch mode.
   * @event beforeBatchDelete
   */
  @Event()
  public beforeBatchDelete: EmitType<BeforeBatchDeleteArgs>;
  /** 
   * Triggers before records are saved in batch mode.
   * @event beforeBatchSave
   */
  @Event()
  public beforeBatchSave: EmitType<BeforeBatchSaveArgs>;
  /** 
   * Triggers when the cell is being edited.
   * @event cellEdit
   */
    @Event()
    public cellEdit: EmitType<CellEditArgs>;
  /* eslint-enable */
    /**
     * Triggers when any TreeGrid action failed to achieve the desired results.
     *
     * @event actionFailure
     */
    @Event()
    public actionFailure: EmitType<FailureEventArgs>;
    /**
     * Triggers when data source is populated in the TreeGrid.
     *
     * @event dataBound
     */
    @Event()
    public dataBound: EmitType<Object>;

    /**
     * Triggers when the TreeGrid data is added, deleted and updated.
     * Invoke the done method from the argument to start render after edit operation.
     *
     * @event dataSourceChanged
     * @deprecated
     */
    @Event()
    public dataSourceChanged: EmitType<DataSourceChangedEventArgs>;

    /**
     * Triggers when the TreeGrid actions such as Sorting, Paging etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     *
     * @event dataStateChange
     * @deprecated
     */
    @Event()
    public dataStateChange: EmitType<DataStateChangeEventArgs>;

    /**
     * Triggers when record is double clicked.
     *
     * @event recordDoubleClick
     */
    @Event()
    public recordDoubleClick: EmitType<RecordDoubleClickEventArgs>;

    /**
     * Triggered every time a request is made to access row information, element, or data.
     * This will be triggered before the row element is appended to the TreeGrid element.
     *
     * @event rowDataBound
     */
    @Event()
    public rowDataBound: EmitType<RowDataBoundEventArgs>;
    /**
     * Triggers after detail row expands.
     * > This event triggers at initial expand.
     *
     * @event detailDataBound
     */
    @Event()
    public detailDataBound: EmitType<DetailDataBoundEventArgs>;
    /**
     * Triggered every time a request is made to access cell information, element, or data.
     * This will be triggered before the cell element is appended to the TreeGrid element.
     *
     * @event queryCellInfo
     */
    @Event()
    public queryCellInfo: EmitType<QueryCellInfoEventArgs>;
    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) TreeGrid records by clicking it.
     *
     * @default true
     */
    @Property(true)
    public allowSelection: boolean;
    /**
     * Triggers before row selection occurs.
     *
     * @event rowSelecting
     */
    @Event()
    public rowSelecting: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     *
     * @event rowSelected
     */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     *
     * @event rowSelected
     * @deprecated
     */
    @Event()
    public rowDeselecting: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     *
     * @event rowDeselected
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;
    /**
     * Triggered for stacked header.
     *
     * @event headerCellInfo
     */
    @Event()
    public headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

    /**
     * Triggers before any cell selection occurs.
     *
     * @event cellSelecting
     */
    @Event()
    public cellSelecting: EmitType<CellSelectingEventArgs>;
    /**
     * Triggers before column menu opens.
     *
     * @event columnMenuOpen
     * @deprecated
     */
    @Event()
    public columnMenuOpen: EmitType<ColumnMenuOpenEventArgs>;
    /**
     * Triggers when click on column menu.
     *
     * @event columnMenuClick
     */
    @Event()
    public columnMenuClick: EmitType<MenuEventArgs>;


    /**
     * Triggers after a cell is selected.
     *
     * @event cellSelected
     */
    @Event()
    public cellSelected: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     *
     * @event cellDeselecting
     * @deprecated
     */
    @Event()
    public cellDeselecting: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     *
     * @event cellDeselected
     * @deprecated
     */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when column resize starts.
     *
     * @event resizeStart
     * @deprecated
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     *
     * @event resizing
     * @deprecated
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     *
     * @event resizeStop
     * @deprecated
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;

    /**
     * Triggers when column header element drag (move) starts.
     *
     * @event columnDragStart
     * @deprecated
     */
    @Event()
    public columnDragStart: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously.
     *
     * @event columnDrag
     * @deprecated
     */
    @Event()
    public columnDrag: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column.
     *
     * @event columnDrop
     * @deprecated
     */
    @Event()
    public columnDrop: EmitType<ColumnDragEventArgs>;
    /**
     * Triggers when the check box state change in checkbox column.
     *
     * @event checkboxChange
     * @deprecated
     */
    @Event()
    public checkboxChange: EmitType<CheckBoxChangeEventArgs>;

    /**
     * Triggers after print action is completed.
     *
     * @event printComplete
     * @deprecated
     */
    @Event()
    public printComplete: EmitType<PrintEventArgs>;
    /**
     * Triggers before the print action starts.
     *
     * @event beforePrint
     * @deprecated
     */
    @Event()
    public beforePrint: EmitType<PrintEventArgs>;
    /**
     * Triggers when toolbar item is clicked.
     *
     * @event toolbarClick
     */
    @Event()
    public toolbarClick: EmitType<ClickEventArgs>;
    /**
     * Triggers before data is bound to Tree Grid.
     *
     * @event beforeDataBound
     */
    @Event()
    public beforeDataBound: EmitType<BeforeDataBoundArgs>;
    /**
     * Triggers before context menu opens.
     *
     * @event contextMenuOpen
     * @deprecated
     */
    @Event()
    public contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when click on context menu.
     *
     * @event contextMenuClick
     */
    @Event()
    public contextMenuClick: EmitType<MenuEventArgs>;
    /**
     * Triggers before TreeGrid copy action.
     *
     * @event beforeCopy
     * @deprecated
     */
    @Event()
    public beforeCopy: EmitType<BeforeCopyEventArgs>;
    /**
     * Triggers before TreeGrid paste action.
     *
     * @event beforePaste
     * @deprecated
     */
    @Event()
    public beforePaste: EmitType<BeforePasteEventArgs>;
    /**
     * Triggers when row elements are dragged (moved) continuously.
     *
     * @event rowDrag
     * @deprecated
     */
    @Event()
    public rowDrag: EmitType<RowDragEventArgs>;
    /**
     * Triggers when row element’s drag(move) starts.
     *
     * @event rowDragStart
     * @deprecated
     */
    @Event()
    public rowDragStart: EmitType<RowDragEventArgs>;
    /**
     * Triggers when row element’s before drag(move).
     *
     * @event rowDragStartHelper
     * @deprecated
     */
    @Event()
    public rowDragStartHelper: EmitType<RowDragEventArgs>;
    /**
     * Triggers when row elements are dropped on the target row.
     *
     * @event rowDrop
     * @deprecated
     */
    @Event()
    public rowDrop: EmitType<RowDragEventArgs>;

    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering.
     * You can also get the currently selected row index.
     *
     * @default -1
     */
    @Property(-1)
    public selectedRowIndex: number;

    /**
     * Configures the selection settings.
     *
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;

    /**
     * If `allowExcelExport` set to true, then it will allow the user to export treegrid to Excel file.
     *
     * > Check the [`ExcelExport`](../../treegrid/excel-export/) to configure exporting document.
     *
     * @default false
     */
    @Property(false)
    public allowExcelExport: boolean;
    /**
     * If `allowPdfExport` set to true, then it will allow the user to export treegrid to Pdf file.
     *
     * > Check the [`Pdfexport`](../../treegrid/pdf-export/) to configure the exporting document.
     *
     * @default false
     */
    @Property(false)
    public allowPdfExport: boolean;
    /**
     * Triggers before exporting each cell to PDF document.
     * You can also customize the PDF cells.
     *
     * @event pdfQueryCellInfo
     * @deprecated
     */
    @Event()
    public pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to PDF document.
     * You can also customize the PDF cells.
     *
     * @event pdfHeaderQueryCellInfo
     * @deprecated
     */
    @Event()
    public pdfHeaderQueryCellInfo: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelQueryCellInfo
     * @deprecated
     */
    @Event()
    public excelQueryCellInfo: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelHeaderQueryCellInfo
     * @deprecated
     */
    @Event()
    public excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before TreeGrid data is exported to Excel file.
     *
     * @event beforeExcelExport
     */
    @Event()
    public beforeExcelExport: EmitType<Object>;

    /**
     * Triggers after TreeGrid data is exported to Excel file.
     *
     * @event excelExportComplete
     * @deprecated
     */
    @Event()
    public excelExportComplete: EmitType<ExcelExportCompleteArgs>;

    /**
     * Triggers before TreeGrid data is exported to PDF document.
     *
     * @event beforePdfExport
     */
    @Event()
    public beforePdfExport: EmitType<Object>;

    /**
     * Triggers after TreeGrid data is exported to PDF document.
     *
     * @event pdfExportComplete
     * @deprecated
     */
    @Event()
    public pdfExportComplete: EmitType<PdfExportCompleteArgs>;
    /**
     * Export TreeGrid data to Excel file(.xlsx).
     *
     * @param  {ExcelExportProperties | TreeGridExcelExportProperties} excelExportProperties - Defines the export properties of the Tree Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns {Promise<any>} - Returns promise object of export action
     */
    /* eslint-disable */
    public excelExport(
        excelExportProperties?: ExcelExportProperties | TreeGridExcelExportProperties, isMultipleExport?: boolean,
        workbook?: any, isBlob?: boolean): Promise<any> {
          /* eslint-enable */
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, false);
    }
    /**
     * Export TreeGrid data to CSV file.
     *
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns {Promise<any>} - Returns promise object of export action
     */
    /* eslint-disable */
    public csvExport(
        excelExportProperties?: ExcelExportProperties,
        isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Promise<any> {
          /* eslint-enable */
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, true);
    }
    /**
     * Export TreeGrid data to PDF document.
     *
     * @param {PdfExportProperties | TreeGridPdfExportProperties} pdfExportProperties - Defines the export properties of the Tree Grid.
     * @param {boolean} isMultipleExport - Define to enable multiple export.
     * @param {Object} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns {Promise<any>} - Returns promise object of export action
     */
    public pdfExport(
        pdfExportProperties?: PdfExportProperties | TreeGridPdfExportProperties,
        isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Promise<Object> {
        return this.pdfExportModule.Map(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
    }

    /**
     * Sends a post request to export tree grid to excel file in server side.
     *
     * @param  {string} url - Pass URL for server side excel export action.
     * @returns {void}
     */
    public serverExcelExport(url: string): void {
        this.isExcel = true;
        this.exportTreeGrid(url);
    }
    /**
     * Sends a post request to export tree grid to pdf file in server side.
     *
     * @param  {string} url - Pass URL for server-side pdf export action.
     * @returns {void}
     */
    public serverPdfExport(url: string): void {
        this.isExcel = false;
        this.exportTreeGrid(url);
    }

    /**
     * Sends a Post request to export Tree Grid to CSV file in server side.
     *
     * @param  {string} url - Pass URL for server-side csv export action.
     * @returns {void}
     */
    public serverCsvExport(url: string): void {
        this.isExcel = true;
        this.exportTreeGrid(url);
    }
    /**
     * Exports the TreeGrid data to the specified URL using a POST request.
     *
     * @param {string} url - Defines exporting url
     * @returns {void}
     */
    private exportTreeGrid(url: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const treegrid: TreeGrid = this;
        const query: Query = treegrid.grid.getDataModule().generateQuery(true);
        const state: { data?: string, pvtData?: Object[] } = new UrlAdaptor().processQuery(new DataManager({ url: '' }), query);
        const queries: {where: object, search: Object[], sorted: object} = JSON.parse(state.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const treeGridModel: any = JSON.parse(this.addOnPersist(['allowPaging', 'pageSettings', 'sortSettings', 'allowPdfExport', 'allowExcelExport', 'aggregates',
            'filterSettings',  'columns', 'locale', 'searchSettings', 'idMapping', 'parentIdMapping', 'childMapping', 'treeColumnIndex']));
        const include: string[] = ['field', 'headerText', 'type', 'format', 'visible',
            'template', 'index', 'width', 'textAlign', 'headerTextAlign', 'columns'];
        treeGridModel.filterSettings.columns = queries.where;
        treeGridModel.searchSettings.fields = queries.search && queries.search[0]['fields'] || [];
        treeGridModel.sortSettings.columns = queries.sorted;
        treeGridModel.columns = this.setHeaderText(treeGridModel.columns as Column[], include);
        const form: HTMLFormElement = this.createElement('form', { id: 'ExportForm', styles: 'display:none;' });
        const treeGridInput: HTMLInputElement = this.createElement('input', { id: 'treeGridInput', attrs: { name: 'treeGridModel' } });
        treeGridInput.value = JSON.stringify(treeGridModel);
        form.method = 'POST';
        form.action = url;
        form.appendChild(treeGridInput);
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }

    /**
     * Sets the header text and other properties for an array of columns based on specified criteria.
     *
     * @param {Column[]} columns - Defines array of columns
     * @param {string[]} include - Defines array of sting
     * @returns {Column[]} returns array of columns
     */
    private setHeaderText(columns: Column[], include: string[]): Column[] {
        for (let i: number = 0; i < columns.length; i++) {
            let column: Column = this.getColumnByUid(columns[parseInt(i.toString(), 10)].uid);
            if (this.stackedHeader && isNullOrUndefined(column)) {
                column = !isNullOrUndefined(columns[parseInt(i.toString(), 10)].field) ?
                    this.getColumnByField(columns[parseInt(i.toString(), 10)].field) : columns[parseInt(i.toString(), 10)];
            }
            columns[parseInt(i.toString(), 10)].headerText = column.headerText;
            if (!isNullOrUndefined(column.template)) {
                columns[parseInt(i.toString(), 10)].template = 'true';
            }
            if (columns[parseInt(i.toString(), 10)].format) {
                columns[parseInt(i.toString(), 10)].format = getNumberFormat(
                    this.getFormat(column.format),
                    column.type, false, this.currencyCode);
                if (!this.isExcel && (column.type === 'datetime' || column.type === 'date')) {
                    columns[parseInt(i.toString(), 10)].format = columns[parseInt(i.toString(), 10)].format.toString().replace('AM/PM', 'tt');
                }
                columns[parseInt(i.toString(), 10)].type = column.type;
            }
            if (columns[parseInt(i.toString(), 10)].columns) {
                this.setHeaderText(columns[parseInt(i.toString(), 10)].columns as Column[], include);
            }
            const keys: string[] = Object.keys(columns[parseInt(i.toString(), 10)]);
            for (let j: number = 0; j < keys.length; j++) {
                if (include.indexOf(keys[parseInt(j.toString(), 10)]) < 0) {
                    delete columns[parseInt(i.toString(), 10)][keys[parseInt(j.toString(), 10)]];
                }
            }
        }
        return columns;
    }

    /**
     * Retrieves the appropriate format string from the given format options.
     *
     * @param {string | NumberFormatOptions | DateFormatOptions} format - The format options to retrieve the format string from.
     * @returns {string} The format string extracted from the provided format options.
     */
    private getFormat(format: string | NumberFormatOptions | DateFormatOptions): string {
        return typeof (format) === 'object' ? !isNullOrUndefined(format.format) ?
            format.format : format.skeleton : format;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns TreeGrid module name
     */
    protected getModuleName(): string {
        return 'treegrid';
    }

    /**
     * For internal use only - Initialize the event handler;
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        this.TreeGridLocale();
        this.initProperties();
        this.defaultLocale = {
            Above: 'Above',
            Below: 'Below',
            Child: 'Child',
            AddRow: 'Add Row',
            ExpandAll: 'Expand All',
            CollapseAll: 'Collapse All',
            RowIndent: 'Indent',
            RowOutdent: 'Outdent'
        };
        this.l10n = new L10n('treegrid', this.defaultLocale, this.locale);
        if (this.isSelfReference && isNullOrUndefined(this.childMapping)) {
            this.childMapping = 'Children';
        }
    }

    /**
     * Sorts a column with the given options.
     *
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @returns {void}
     */
    public sortByColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        if (this.sortModule) {
            this.sortModule.sortColumn(columnName, direction, isMultiSort);
        }
    }

    /**
     * Clears all the sorted columns of the TreeGrid.
     *
     * @returns {void}
     */
    public clearSorting() : void {
        if (this.sortModule) {
            this.sortModule.clearSorting();
        }
    }

    /**
     * Remove sorted column by field name.
     *
     * @param {string} field - Defines the column field name to remove sort.
     * @returns {void}
     * @hidden
     */
    public removeSortColumn(field: string): void {
        if (this.sortModule) {
            this.sortModule.removeSortColumn(field);
        }
    }



    /**
     * Searches TreeGrid records using the given key.
     * You can customize the default search option by using the
     * [`searchSettings`](./#searchsettings/).
     *
     * @param  {string} searchString - Defines the key.
     * @returns {void}
     */
    public search(searchString: string): void {
        this.grid.search(searchString);
    }

    /**
     * Changes the column width to automatically fit its content to ensure that the width shows the content without wrapping/hiding.
     * > * This method ignores the hidden columns.
     * > * Uses the `autoFitColumns` method in the `dataBound` event to resize at initial rendering.
     *
     * @param  {string |string[]} fieldNames - Defines the column names.
     * @returns {void}
     *
     *
     *
     */
    public autoFitColumns(fieldNames?: string | string[]): void {
        this.resizeModule.autoFitColumns(fieldNames);
        this.updateColumnModel();
    }

    /**
     * Changes the TreeGrid column positions by field names.
     *
     * @param  {string} fromFName - Defines the origin field name.
     * @param  {string} toFName - Defines the destination field name.
     * @returns {void}
     */
    public reorderColumns(fromFName: string | string[], toFName: string): void {
        this.grid.reorderColumns(fromFName, toFName);
    }

    private TreeGridLocale(): void {
        if (!isNullOrUndefined(this.locale)) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const locale: any = (L10n as any).locale;
            const localeObject: Object = {}; setValue(this.locale, {}, localeObject);
            let gridLocale: Object; gridLocale = {}; gridLocale = getObject(this.locale, locale);
            let treeGridLocale: Object; treeGridLocale = {};
            treeGridLocale = getObject(this.getModuleName(), gridLocale);
            setValue('grid', treeGridLocale, getObject(this.locale, localeObject));
            L10n.load(localeObject);
        }
    }

    /**
     * By default, prints all the pages of the TreeGrid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./#printmode).
     *
     * @returns {void}
     */
    public print(): void {
        this.printModule.print();
    }

    private treeGridkeyActionHandler(e: KeyboardEventArgs): void {
        if (this.allowKeyboard) {
            let target: HTMLElement; let parentTarget: HTMLElement; let column: HTMLElement;
            let row: HTMLElement;
            let summaryElement: Element;
            switch (e.action) {
            case 'ctrlDownArrow':
                this.expandAll();
                break;
            case 'ctrlUpArrow':
                this.collapseAll();
                break;
            case 'ctrlShiftUpArrow':
                target = <HTMLElement>e.target;
                column = <HTMLElement>target.closest('.e-rowcell');
                if (!isNullOrUndefined(column)) {
                    row = <HTMLElement>column.closest('tr');
                    if (!isNullOrUndefined(row) && !(isNullOrUndefined(row.getElementsByClassName('e-treegridexpand')[0]))) {
                        this.expandCollapseRequest(<HTMLElement>row.querySelector('.e-treegridexpand'));
                    }
                }
                break;
            case 'ctrlShiftDownArrow':
                target = <HTMLElement>e.target;
                column = <HTMLElement>target.closest('.e-rowcell');
                if (!isNullOrUndefined(column)) {
                    row = <HTMLElement>column.closest('tr');
                    if (!isNullOrUndefined(row) && !(isNullOrUndefined(row.getElementsByClassName('e-treegridcollapse')[0]))) {
                        this.expandCollapseRequest(<HTMLElement>row.querySelector('.e-treegridcollapse'));
                    }
                }
                break;
            case 'downArrow':
                if (!this.enableVirtualization && isNullOrUndefined(this.rowTemplate)) {
                    target = <HTMLTableCellElement>e.target;
                    if (!isNullOrUndefined(target.querySelectorAll('.e-rowcell'))) {
                        target = <HTMLTableCellElement>parentsUntil(target, 'e-rowcell');
                    }
                    if (!isNullOrUndefined(target)) {
                        parentTarget = target.parentElement;
                        if (!isNullOrUndefined(parentTarget)) {
                            const cellIndex: number = (<HTMLTableCellElement>parentTarget).cellIndex;
                            if (this.grid.getColumnByIndex(cellIndex).editType === 'dropdownedit' && isNullOrUndefined(this.grid.getColumnByIndex(cellIndex).edit['obj'])) {
                                parentTarget = target;
                            }
                            summaryElement = this.findnextRowElement(parentTarget);
                            if (summaryElement !== null) {
                                const cellIndex: number = (<HTMLTableCellElement>target).cellIndex;
                                const row: Element = (<HTMLTableRowElement>summaryElement).children[parseInt(cellIndex.toString(), 10)];
                                if (!isNullOrUndefined(row) && !this.grid.isEdit) {
                                    addClass([row], 'e-focused');
                                    addClass([row], 'e-focus');
                                }
                            } else {
                                this.clearSelection();
                            }
                        }
                    }
                }
                break;
            case 'upArrow':
                if (!this.enableVirtualization && isNullOrUndefined(this.rowTemplate)) {
                    target = <HTMLTableCellElement>e.target;
                    if (!isNullOrUndefined(target.querySelectorAll('.e-rowcell'))) {
                        target = <HTMLTableCellElement>parentsUntil(target, 'e-rowcell');
                    }
                    if (!isNullOrUndefined(target)) {
                        parentTarget = target.parentElement;
                        if (!isNullOrUndefined(parentTarget)) {
                            const cellIndex: number = (<HTMLTableCellElement>parentTarget).cellIndex;
                            if (this.grid.getColumnByIndex(cellIndex).editType === 'dropdownedit' && isNullOrUndefined(this.grid.getColumnByIndex(cellIndex).edit['obj'])) {
                                parentTarget = target;
                            }
                            summaryElement = this.findPreviousRowElement(parentTarget);
                            if (summaryElement !== null) {
                                const cellIndex: number = (<HTMLTableCellElement>target).cellIndex;
                                if (!isNullOrUndefined(cellIndex)) {
                                    const row: Element = (<HTMLTableRowElement>summaryElement).children[parseInt(cellIndex.toString(), 10)];
                                    if (!isNullOrUndefined(row) && !this.grid.isEdit) {
                                        addClass([row], 'e-focused');
                                        addClass([row], 'e-focus');
                                    }
                                }
                            } else {
                                this.clearSelection();
                            }
                        }
                    }
                }
            }
        }
    }

    // Get Proper Row Element from the summary

    private findnextRowElement(summaryRowElement: HTMLElement ): Element {
        let rowElement: Element = <Element>summaryRowElement.nextElementSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
        (<HTMLTableRowElement>rowElement).style.display === 'none')) {
            rowElement = this.findnextRowElement(<HTMLElement>rowElement);
        }
        return rowElement;
    }

    // Get Proper Row Element from the summary

    private findPreviousRowElement(summaryRowElement: HTMLElement ): Element {
        let rowElement: Element = <Element>summaryRowElement.previousElementSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
        (<HTMLTableRowElement>rowElement).style.display === 'none')) {
            rowElement = this.findPreviousRowElement(<HTMLElement>rowElement);
        }
        return rowElement;
    }

    private initProperties(): void {
        this.defaultLocale = {};
        this.flatData = [];
        this.infiniteScrollData = [];
        this.remoteCollapsedData = [];
        this.remoteExpandedData = [];
        this.parentData = [];
        this.columnModel = [];
        this.isExpandAll = false;
        this.isCollapseAll = false;
        this.keyConfigs = {
            ctrlDownArrow: 'ctrl+downarrow',
            ctrlUpArrow: 'ctrl+uparrow',
            ctrlShiftUpArrow: 'ctrl+shift+uparrow',
            ctrlShiftDownArrow: 'ctrl+shift+downarrow',
            downArrow: 'downArrow',
            upArrow: 'upArrow'
        };
        this.isLocalData = (!(this.dataSource instanceof DataManager) || this.dataSource.dataSource.offline
                     || (!isNullOrUndefined((<DataManager>this.dataSource).ready)) || this.dataSource.adaptor instanceof RemoteSaveAdaptor);
        this.isSelfReference = !isNullOrUndefined(this.parentIdMapping);
    }

    /**
     * Binding events to the element while component creation.
     *
     * @hidden
     * @returns {void}
     */
    public wireEvents(): void {
        EventHandler.add(this.grid.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.treeGridkeyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        if (this.allowKeyboard) {
            this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
        }
    }
    /**
     * To provide the array of modules needed for component rendering
     *
     * @returns {ModuleDeclaration[]} - Returns TreeGrid modules collection
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        const splitFrozenCount: string = 'splitFrozenCount';
        if (!this.isReact && isNullOrUndefined(this['changedProperties'].columns)) {
            this.grid[`${splitFrozenCount}`](this.getColumns());
        }
        if (this.isDestroyed) { return modules; }
        modules.push({
            member: 'filter', args: [this, this.filterSettings],
            name: 'Filter'
        });
        if (!isNullOrUndefined(this.toolbar)) {
            modules.push({
                member: 'toolbar',
                args: [this],
                name: 'Toolbar'
            });
        }
        if (this.contextMenuItems) {
            modules.push({
                member: 'contextMenu',
                args: [this],
                name: 'ContextMenu'
            });
        }
        if (this.allowPaging) {
            modules.push({
                member: 'pager',
                args: [this, this.pageSettings],
                name: 'Page'
            });
        }
        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this],
                name: 'Reorder'
            });
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this],
                name: 'Sort'
            });
        }
        if (this.aggregates.length > 0) {
            modules.push({
                member: 'summary', args: [this],
                name: 'Aggregate'
            });
        }
        if (this.resizeCheck()) {
            modules.push({
                member: 'resize', args: [this],
                name: 'Resize'
            });
        }
        if (this.allowExcelExport) {
            modules.push({
                member: 'ExcelExport', args: [this],
                name: 'ExcelExport'
            });
        }
        const freezePresent: Function[] = this.injectedModules.filter((e: Function) => {
            return e.prototype.getModuleName() === 'freeze';
        });
        if ((this.frozenColumns || this.frozenRows || this.getFrozenColumns() ||
            this.grid.getFrozenLeftColumnsCount() || this.grid.getFrozenRightColumnsCount()) && freezePresent.length > 0) {
            modules.push({
                member: 'freeze', args: [this],
                name: 'Freeze'
            });
        }
        if (this.detailTemplate) {
            modules.push({
                member: 'detailRow', args: [this],
                name: 'DetailRow'
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport', args: [this],
                name: 'PdfExport'
            });
        }
        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu', args: [this],
                name: 'ColumnMenu'
            });
        }
        if (this.showColumnChooser) {
            modules.push({
                member: 'ColumnChooser', args: [this],
                name: 'ColumnChooser'
            });
        }
        this.extendRequiredModules(modules);
        return modules;
    }

    private resizeCheck(): boolean {
        const columnMenu: boolean = this.showColumnMenu && (!this.columnMenuItems || (this.columnMenuItems as ColumnMenuItem[])
            .filter((c: ColumnMenuItem) => c === 'AutoFit' || c === 'AutoFitAll').length) ? true : false;
        const contextMenu: boolean = this.contextMenuItems && (this.contextMenuItems as ContextMenuItem[])
            .filter((c: ContextMenuItem) => c === 'AutoFit' || c === 'AutoFitAll').length ? true : false;
        return this.allowResizing || columnMenu || contextMenu;
    }

    public extendRequiredModules(modules: ModuleDeclaration[]): void {
        const IsRowDDInjected: Function[] = this.injectedModules.filter((e: Function) => {
            return e.prototype.getModuleName() === 'rowDragAndDrop';
        });
        if (this.allowRowDragAndDrop || IsRowDDInjected.length) {
            if ((!isNullOrUndefined(this.toolbar) && (this.toolbar['includes']('Indent') ||
             this.toolbar['includes']('Outdent')))) {
                this.isIndentEnabled = true;
            }
            modules.push({
                member: 'rowDragAndDrop',
                args: [this],
                name: 'RowDD'
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
            modules.push({
                member: 'edit',
                args: [this],
                name: 'Edit'
            });
        }
        if (!isNullOrUndefined(<Column[]>this.columns) && this.isCommandColumn(<Column[]>this.columns)) {
            modules.push({
                member: 'commandColumn',
                args: [this],
                name: 'CommandColumn'
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this],
                name: 'Selection'
            });
        }
        if (this.enableVirtualization) {
            modules.push({
                member: 'virtualScroll',
                args: [this],
                name: 'VirtualScroll'
            });
        }
        if (this.enableInfiniteScrolling) {
            modules.push({
                member: 'infiniteScroll',
                args: [this],
                name: 'InfiniteScroll'
            });
        }
        modules.push({
            member: 'logger',
            args: [this.grid]
        });
    }
    private isCommandColumn(columns: Column[]): boolean {
        return columns.some((col: Column) => {
            if (col.columns) {
                return this.isCommandColumn(col.columns as Column[]);
            }
            return !!(col.commands || col.commandsTemplate);
        });
    }
    /**
     * Unbinding events from the element while component destroy.
     *
     * @hidden
     * @returns {void}
     */
    public unwireEvents(): void {
        if (this.grid && this.grid.element) {
            EventHandler.remove(this.grid.element, 'click', this.mouseClickHandler);
        }
        if (this.element) {
            EventHandler.remove(this.element, 'touchend', this.mouseClickHandler);
            if (this.keyboardModule) {
                this.keyboardModule.destroy();
                this.keyboardModule = null;
            }
            if (this.allowKeyboard) {
                this.element.removeAttribute('tabIndex');
            }
        }
    }
    /**
     * Logs tree grid error message on console
     *
     * @param {string | string[]} types - Tree Grid error type
     * @param {object} args - Error details
     * @hidden
     * @private
     * @returns {void}
     */
    public log(types: string | string[], args?: Object): void {
        if (this.loggerModule) {
            this.loggerModule.treeLog(types, args, this);
        }
    }

    /**
     * For internal use only - To Initialize the component rendering.
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        if ((<{ isReact?: boolean }>this).isReact) {
            (<{ isReact?: boolean }>this.grid).isReact = true;
            (<{ portals?: object[] }>this.grid).portals = [];
        }
        if ((<{ isVue?: boolean }>this).isVue) {
            (<{ isVue?: boolean }>this.grid).isVue = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (<{ vueInstance?: any }>this.grid).vueInstance = (<{ vueInstance?: any }>this).vueInstance;
        }
        createSpinner({ target: this.element }, this.createElement);
        this.log(['mapping_fields_missing']);
        this.renderModule = new Render(this);
        this.dataModule = new DataManipulation(this);
        this.printModule = new Print(this);
        this.trigger(events.load);
        this.autoGenerateColumns();
        this.initialRender = true;
        if (!isNullOrUndefined(this.dataSource)) {
            this.convertTreeData(this.dataSource);
        }
        this.loadGrid();
        if (this.element.classList.contains('e-treegrid') && this.rowDropSettings.targetID) {
            this.grid.rowDropSettings.targetID += '_gridcontrol';
        }
        this.addListener();
        const gridContainer: Element = createElement('div', { id: this.element.id + '_gridcontrol' });
        addClass([this.element], 'e-treegrid');
        if (!isNullOrUndefined(this.height) && typeof (this.height) === 'string' && this.height.indexOf('%') !== -1) {
            this.element.style.height = this.height;
        }
        if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
            this.element.style.width = this.width;
        }
        this.element.appendChild(gridContainer);
        const gridRequiredModules: Function = this.grid.requiredModules;
        this.grid.requiredModules = function(): ModuleDeclaration[] {
            let modules: ModuleDeclaration[] = [];
            modules = gridRequiredModules.apply(this);
            for (let i: number = 0; i < modules.length; i++) {
                if (modules[parseInt(i.toString(), 10)].member === 'virtualscroll') {
                    modules[parseInt(i.toString(), 10)].member = 'treeVirtualScroll';
                }
            }
            return modules;
        };
        const root: string = 'root';
        this.grid[`${root}`] = this[`${root}`] ? this[`${root}`] : this;
        this.grid.appendTo(gridContainer as HTMLElement);
        this.actionFailureHandler();
        const gridContent: Element = this.element.getElementsByClassName('e-gridcontent')[0].childNodes[0] as HTMLElement;
        gridContent.setAttribute('tabindex', '0');
        const contentTable: Element = this.element.getElementsByClassName('e-content')[0].querySelector('.e-table') as HTMLElement;
        if (!isNullOrUndefined(contentTable)) {
            contentTable.setAttribute('role', 'treegrid');
        }
        if (this.isIndentEnabled) {
            this.refreshToolbarItems();
        }
        this.wireEvents();
        this.renderComplete();
        const destroyTemplate: string = 'destroyTemplate';
        const destroyTemplateFn: Function = this.grid[`${destroyTemplate}`] as Function;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.grid[`${destroyTemplate}`] = (args: string[], index?: any) => {
            destroyTemplateFn.apply(this.grid);
            const portals: string = 'portals';
            if (!((<{ isReact?: boolean }>this).isReact && isNullOrUndefined(this[`${portals}`]))) {
                this.clearTemplate(args, index);
            }
        };
    }

    private actionFailureHandler(): void {
        const failureCases: string[] = [];
        const primaryKeyFieldNames: any = this.getPrimaryKeyFieldNames();
        const RecordsCount: number = this.flatData.length;
        if ((this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing)
            && primaryKeyFieldNames.length === 0 && RecordsCount !== 0) {
            failureCases.push('For the CRUD actions, it is necessary to enable Primary Key field for the unique data column.');
        }
        if (this.allowRowDragAndDrop && primaryKeyFieldNames.length === 0 && RecordsCount !== 0) {
            failureCases.push('For the Row Drag and Drop actions, it is necessary to enable Primary Key field for the unique data column.');
        }
        if (this.allowPaging && this.enableVirtualization) {
            failureCases.push('Paging is not allowed in virtualization case.');
        }
        if (RecordsCount === 0 && this.columns.length === 0) {
            failureCases.push('Either of the Data source or columns should be given.');
        }
        if (this.frozenColumns > 0 && this.columnModel.filter((col: any) => col.isFrozen)) {
            failureCases.push('Use only one attribute for Frozen either IsFrozen or FrozenColumns.');
        }
        if (this.enableVirtualization && !isNullOrUndefined(this.detailTemplate)) {
            failureCases.push('Virtual scrolling is not compatible with the detail template');
        }
        if ((this.frozenColumns > 0 || this.columnModel.filter((col: any) => col.isFrozen) || this.frozenRows > 0)
            && (!isNullOrUndefined(this.detailTemplate) || !isNullOrUndefined(this.rowTemplate))) {
            failureCases.push('Frozen rows and columns are not supported with the Detail template and row template.');
        }
        if ((this.frozenColumns > 0 || this.columnModel.filter((col: any) => col.isFrozen).length > 0 || this.frozenRows > 0) && this.editSettings.mode === 'Cell') {
            failureCases.push('Frozen rows and columns are not supported with cell editing.');
        }
        if (this.allowSelection && !isNullOrUndefined(this.rowTemplate)) {
            failureCases.push('Selection is not supported in RowTemplate');
        }
        if (this.treeColumnIndex < 0) {
            failureCases.push('For showing tree structure it is must to set the TreeColumnIndex value.');
        }
        if (this.treeColumnIndex >= this.columns.length) {
            failureCases.push('TreeColumnIndex value should not exceed the total column count.');
        }
        if (this.enableVirtualization &&
            (this.columnModel.some((col: any) => /%$/.test(col.width)) ||
                /%$/.test(this.height.toString()))) {
            failureCases.push('column width and height should be in pixels');
        }
        if ((this.childMapping !== 'Children') && !isNullOrUndefined(this.idMapping)) {
            failureCases.push('Both IdMapping and ChildMapping should not be used together for tree grid rendering.');
        }
        if ((!isNullOrUndefined(this.idMapping) && (isNullOrUndefined(this.parentIdMapping))) ||
            ((isNullOrUndefined(this.idMapping) && (!isNullOrUndefined(this.parentIdMapping))))) {
            failureCases.push('IdMapping and ParentIdMapping properties should be defined and vice versa.');
        }
        const checkboxColumn: any = this.columnModel.filter((col: any) => col.showCheckbox);
        const treeColumn: any = this.columns[this.treeColumnIndex];
        if (checkboxColumn.length !== 0) {
            if (checkboxColumn !== treeColumn) {
                failureCases.push('ShowCheckbox column should not be defined other than the tree column.');
            }
            if (checkboxColumn.length > 1) {
                failureCases.push('Only one column can have the ShowCheckbox option enabled.');
            }
        }
        const alignColumn: any = this.columnModel.filter((col: any) => col.textAlign === 'Right' && col.field === this.columnModel[this.treeColumnIndex].field);
        if (alignColumn.length !== 0) {
            failureCases.push('TextAlign right for the tree column is not applicable.');
        }
        if (failureCases.length > 0) {
            const failureEventArgs: any = {
                error: {}
            };
            failureCases.forEach((failureCase: string, index: number) => {
                failureEventArgs.error[parseInt(index.toString(), 10)] = failureCase;
            });
            this.trigger(events.actionFailure, failureEventArgs);
        }
    }

    private refreshToolbarItems(): void {
        const toolbarElement: Element = this.toolbarModule.getToolbar();
        const indentID: string = this.element.id + '_gridcontrol_indent';
        const outdentID: string = this.element.id + '_gridcontrol_outdent';
        const indentElement: HTMLElement = toolbarElement.querySelector('#' + indentID).parentElement;
        const outdentElement: HTMLElement = toolbarElement.querySelector('#' + outdentID).parentElement;
        indentElement.classList.add('e-hidden');
        outdentElement.classList.add('e-hidden');
    }

    private afterGridRender(): void {
        if (!isNullOrUndefined(this.grid.clipboardModule)) {
            this.grid.clipboardModule.destroy();
        }
        this.clipboardModule = this.grid.clipboardModule = new TreeClipboard(this, this.grid.serviceLocator);
    }
    private convertTreeData(data: Object): void {
        if (isCountRequired(this)) {
            data = getValue('result', data);
        }
        if (data instanceof Array && data.length > 0 && Object.prototype.hasOwnProperty.call(data[0], 'level')) {
            this.flatData = data;
            this.flatData.filter((e: ITreeData) => {
                setValue('uniqueIDCollection.' + e.uniqueID, e, this);
                if (e.level === 0) {
                    this.parentData.push(e);
                }
            });
        } else {
            if (isCountRequired(this)) {
                const griddata: Object[] = getValue('result', this.dataSource);
                this.dataModule.convertToFlatData(griddata);
            } else {
                this.dataModule.convertToFlatData(data);
            }
        }
    }
    // private getGridData(): Object {
    //   if (isRemoteData(this)) {
    //     return this.dataSource;
    //   } else if (this.isLocalData && this.dataSource instanceof DataManager) {
    //     this.dataSource.dataSource.json = this.flatData;
    //     return this.dataSource;
    //   }
    //   return this.flatData;
    // }
    private bindGridProperties(): void {
        this.bindedDataSource();
        this.grid.enableRtl = this.enableRtl;
        this.grid.allowKeyboard = this.allowKeyboard;
        this.grid.columns = this.getGridColumns(this.columns as Column[]);
        this.grid.allowExcelExport = this.allowExcelExport;
        this.grid.allowPdfExport = this.allowPdfExport;
        this.grid.query = this.query;
        this.grid.columnQueryMode = this.columnQueryMode;
        this.grid.allowPaging = this.allowPaging;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.grid.pageSettings = getActualProperties(this.pageSettings) as any;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.grid.pagerTemplate = this.pagerTemplate as any;
        this.grid.showColumnMenu = this.showColumnMenu;
        this.grid.allowSorting = this.allowSorting;
        this.grid.allowFiltering = this.allowFiltering;
        this.grid.enableVirtualization = this.enableVirtualization;
        this.grid.enableColumnVirtualization = this.enableColumnVirtualization;
        this.grid.enableInfiniteScrolling = this.enableInfiniteScrolling;
        this.grid.infiniteScrollSettings = this.infiniteScrollSettings;
        this.grid.enableVirtualMaskRow = this.enableVirtualMaskRow;
        this.grid.loadingIndicator = this.loadingIndicator;
        this.grid.width = this.width;
        this.grid.height = this.height;
        this.grid.enableAltRow = this.enableAltRow;
        this.grid.allowReordering = this.allowReordering;
        this.grid.allowTextWrap = this.allowTextWrap;
        this.grid.allowResizing = this.allowResizing;
        this.grid.enableHover = this.enableHover;
        this.grid.enableAutoFill = this.enableAutoFill;
        this.grid.enableAdaptiveUI = this.enableAdaptiveUI;
        this.grid.enableImmutableMode = this.enableImmutableMode;
        this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop;
        this.grid.rowDropSettings = getActualProperties(this.rowDropSettings);
        this.grid.rowHeight = this.rowHeight;
        this.grid.gridLines = this.gridLines;
        this.grid.allowSelection = this.allowSelection;
        this.grid.toolbar = getActualProperties(this.getGridToolbar());
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.grid.toolbarTemplate = this.toolbarTemplate as any;
        this.grid.showColumnChooser = this.showColumnChooser;
        this.grid.filterSettings = getActualProperties(this.filterSettings);
        this.grid.selectionSettings = getActualProperties(this.selectionSettings);
        this.grid.sortSettings = getActualProperties(this.sortSettings);
        this.grid.searchSettings = getActualProperties(this.searchSettings);
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.grid.aggregates = getActualProperties(this.aggregates) as any;
        this.grid.textWrapSettings = getActualProperties(this.textWrapSettings);
        this.grid.printMode = getActualProperties(this.printMode);
        this.grid.locale = getActualProperties(this.locale);
        this.grid.selectedRowIndex = this.selectedRowIndex;
        this.grid.contextMenuItems = getActualProperties(this.getContextMenu());
        this.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
        this.grid.editSettings = this.getGridEditSettings();
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.grid.rowTemplate = getActualProperties(this.rowTemplate) as any;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.grid.detailTemplate = getActualProperties(this.detailTemplate) as any;
        this.grid.frozenRows = this.frozenRows;
        this.grid.frozenColumns = this.frozenColumns;
        this.grid.clipMode = getActualProperties(this.clipMode);
        const templateInstance: string = 'templateDotnetInstance';
        this.grid[`${templateInstance}`] = this[`${templateInstance}`];
        const isJsComponent: string = 'isJsComponent';
        this.grid[`${isJsComponent}`] = true;
        const enableHtmlSanitizer: string = 'enableHtmlSanitizer';
        this.grid[`${enableHtmlSanitizer}`] = this.enableHtmlSanitizer;
    }
    private triggerEvents(args?: Object): void {
        this.trigger(getObject('name', args), args);
    }
    private IsExpandCollapseClicked(args: RowDeselectingEventArgs): void {
        if (!this.isFromChartSide && !isNullOrUndefined(args.target) && (args.target.classList.contains('e-treegridexpand')
            || args.target.classList.contains('e-treegridcollapse') || args.target.classList.contains('e-summarycell'))
            && !this.selectionSettings.checkboxOnly) {
            if ((!isNullOrUndefined(args.data) && args.data['hasChildRecords']) || (args.rowIndex !== -1 && isNullOrUndefined(args.data))) {
                args.cancel = true;
                return;
            }
        }
    }
    private bindGridEvents(): void {
        this.grid.rowSelecting = (args: RowDeselectingEventArgs): void => {
            this.IsExpandCollapseClicked(args);
            if (!isNullOrUndefined((args.data as any)) && this.selectionSettings.persistSelection
                && this.columnModel.filter((col: any) => col.type === 'checkbox').length > 0 && isRemoteData(this)) {
                if (!isNullOrUndefined((args.data as any).parentItem) || args.isHeaderCheckboxClicked) {
                    this.parentQuery = this.query.queries.filter((q: any) => q.e.field === this.parentIdMapping);
                    this.query.queries = this.query.queries.slice(0, 0);
                }
            }
            if (this.pageSettings.pageSizeMode === 'Root') {
                this.grid.selectionModule['totalRecordsCount'] = this.grid.currentViewData.length;
            }
            if (this.enableVirtualization && args.rowIndex === this.selectedRowIndex && !this.enablePersistence) {
                args.cancel = true;
            }
            if (!isNullOrUndefined(this.selectionSettings) && !this.selectionSettings.persistSelection &&
                this.enableVirtualization && args.rowIndex === this.selectedRowIndex && this.isGantt) {
                args.cancel = false;
            }
            this.trigger(events.rowSelecting, args);
        };
        this.grid.rowDeselecting = (args: RowDeselectingEventArgs): void => {
            this.IsExpandCollapseClicked(args);
            if (!isNullOrUndefined((args.data as any)) && this.selectionSettings.persistSelection
                && this.columnModel.filter((col: any) => col.type === 'checkbox').length > 0 && isRemoteData(this)) {
                this.parentQuery = this.query.queries.filter((q: any) => q.e.field === this.parentIdMapping);
                this.query.queries = this.query.queries.slice(0, 0);
            }
            this.trigger(events.rowDeselecting, args);
        };
        this.grid.rowSelected = (args: RowDeselectEventArgs): void => {
            if (this.enableVirtualization && args.isHeaderCheckboxClicked &&
            this.grid.currentViewData.length !== this.grid.selectionModule.selectedRowIndexes.length) {
                const updateRowSelection : string = 'updateRowSelection';
                for (let i: number = 0; i < this.getRows().length; i++) {
                    if (this.getRows()[parseInt(i.toString(), 10)].getElementsByClassName('e-frame e-icons e-uncheck').length) {
                        this.grid.selectionModule[`${updateRowSelection}`](this.getRows()[parseInt(i.toString(), 10)],
                                                                           (this.getCurrentViewRecords()[parseInt(i.toString(), 10)] as
                                                                            ITreeData).index);
                    }
                }
            }
            this.selectedRowIndex = this.grid.selectedRowIndex;
            this.notify(events.rowSelected, args);
            this.trigger(events.rowSelected, args);
        };
        this.grid.rowDeselected = (args: RowDeselectEventArgs): void => {
            this.selectedRowIndex = this.grid.selectedRowIndex;
            if (!isNullOrUndefined(args.data)) {
                this.notify(events.rowDeselected, args);
            }
            this.trigger(events.rowDeselected, args);
        };
        this.grid.resizeStop = (args: ResizeArgs): void => {
            this.updateColumnModel(); this.trigger(events.resizeStop, args);
        };
        this.grid.excelQueryCellInfo = (args: ExcelQueryCellInfoEventArgs): void => {
            this.notify('excelCellInfo', args);
            args = <ExcelQueryCellInfoEventArgs>this.dataResults;
        };
        this.grid.pdfQueryCellInfo = (args?: PdfQueryCellInfoEventArgs): void => {
            this.notify('pdfCellInfo', args);
            args = <PdfQueryCellInfoEventArgs>this.dataResults;
        };
        this.grid.checkBoxChange = (args?: CheckBoxChangeEventArgs): void => {
            this.trigger(events.checkboxChange, args);
        };
        this.grid.pdfExportComplete = this.triggerEvents.bind(this);
        this.grid.excelExportComplete = this.triggerEvents.bind(this);
        this.grid.excelHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.pdfHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.dataSourceChanged = this.triggerEvents.bind(this);
        this.grid.recordDoubleClick = this.triggerEvents.bind(this);
        this.grid.cellDeselected = this.triggerEvents.bind(this);
        this.grid.cellDeselecting = this.triggerEvents.bind(this);
        this.grid.columnMenuOpen = this.triggerEvents.bind(this);
        this.grid.columnMenuClick = this.triggerEvents.bind(this);
        this.grid.cellSelected = this.triggerEvents.bind(this);
        this.grid.headerCellInfo = this.triggerEvents.bind(this);
        this.grid.resizeStart = this.triggerEvents.bind(this);
        this.grid.resizing = this.triggerEvents.bind(this);
        this.grid.columnDrag = this.triggerEvents.bind(this);
        this.grid.columnDragStart = this.triggerEvents.bind(this);
        this.grid.columnDrop = this.triggerEvents.bind(this);
        this.grid.beforePrint = this.triggerEvents.bind(this);
        this.grid.beforeCopy = this.triggerEvents.bind(this);
        this.grid.beforePaste = (args: BeforePasteEventArgs): void => {
            const rows: Object = this.getRows();
            const rowIndex: string = 'rowIndex';
            while (rows[args[`${rowIndex}`]].classList.contains('e-summaryrow')) {
                args[`${rowIndex}`]++;
            }
            this.trigger(events.beforePaste, args);
        };
        this.grid.load = (): void => {
            this.grid.on('initial-end', this.afterGridRender, this);
            if (!isNullOrUndefined(this.loggerModule)) {
                const loggerModule: string = 'loggerModule';
                this.loggerModule = this.grid[`${loggerModule}`] = new TreeLogger(this.grid);
            }
        };
        this.grid.printComplete = this.triggerEvents.bind(this);
        this.grid.actionFailure = (args?: FailureEventArgs): void => {
            this.trigger(events.actionFailure, args);
        };
        this.extendedGridDataBoundEvent();
        this.extendedGridEvents();
        this.extendedGridActionEvents();
        this.extendedGridEditEvents();
        this.bindGridDragEvents();
        this.bindCallBackEvents();
    }
    private lastRowBorder(visiblerow: HTMLTableRowElement, isAddBorder: boolean): void {
        for (let j: number = 0; j < visiblerow.cells.length; j++) {
            if (isAddBorder) {
                addClass([visiblerow.cells[parseInt(j.toString(), 10)]], 'e-lastrowcell');
            } else {
                removeClass([visiblerow.cells[parseInt(j.toString(), 10)]], 'e-lastrowcell');
            }
        }
    }
    private isPixelHeight(): boolean {
        if (this.height !== 'auto' && this.height.toString().indexOf('%') === -1) {
            return true;
        } else {
            return false;
        }
    }
    private extendedGridDataBoundEvent(): void {
        this.grid.dataBound = (args: Object): void => {
            this.updateRowTemplate(); this.updateColumnModel();
            this.updateAltRow(this.getRows()); this.notify('dataBoundArg', args);
            if (isRemoteData(this) && !isOffline(this) && !this.hasChildMapping) {
                let req: number;
                if (this.dataResults.result) {
                    req = 0;
                } else {
                    req = 1;
                }
                setValue('grid.contentModule.isLoaded', !(req > 0), this);
            }
            if (this.isPixelHeight() && this.initialRender) {
                const rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
                const totalRows: HTMLTableRowElement[] = [].slice.call(rows);
                for (let i: number = totalRows.length - 1; i > 0; i--) {
                    if (!isHidden(totalRows[parseInt(i.toString(), 10)])) {
                        if (totalRows[parseInt(i.toString(), 10)].nextElementSibling) {
                            this.lastRowBorder(totalRows[parseInt(i.toString(), 10)], true);
                        }
                        break;
                    }
                }
            }
            const action: string = 'action';
            if (this.enableVirtualization && this.selectionSettings.persistSelection && (this.dataResults[`${action}`] === 'expand' || this.dataResults[`${action}`] === 'collapse')) {
                const refreshPersistSelection: string = 'refreshPersistSelection';
                this.grid.selectionModule[`${refreshPersistSelection}`]();
                if (this.grid.selectionSettings.type === 'Single') {
                    const updateRowSelection: string = 'updateRowSelection';
                    const index: number = this.getCurrentViewRecords().indexOf(this.grid.selectionModule['data']);
                    this.grid.selectionModule[`${updateRowSelection}`](this.getRows()[parseInt(index.toString(), 10)], index);
                }
            }
            if (this.enableVirtualization && this.selectionSettings.persistSelection
                && !isNullOrUndefined((this as any).virtualScrollModule.prevSelectedRecord)) {
                for (let i: number = 0; i < (this as any).virtualScrollModule.prevSelectedRecord.length; i++) {
                    const updateRowSelection: string = 'updateRowSelection';
                    const index: number =
                        // eslint-disable-next-line max-len
                        this.getCurrentViewRecords().indexOf((this as any).virtualScrollModule.prevSelectedRecord[parseInt(i.toString(), 10)]);
                    this.grid.selectionModule[`${updateRowSelection}`](this.getRows()[parseInt(index.toString(), 10)], index);
                }
            }
            this.trigger(events.dataBound, args);
            this.initialRender = false;
        };
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const treeGrid: TreeGrid = this;
        this.grid.beforeDataBound =  function (args: BeforeDataBoundArgs): void | Deferred  {
            const dataSource: string = 'dataSource'; const requestType: string = getObject('action', args);
            if (((isRemoteData(treeGrid) && !isOffline(treeGrid)) || isCountRequired(this)) && requestType !== 'edit') {
                treeGrid.notify('updateRemoteLevel', args);
                args = <BeforeDataBoundArgs>(treeGrid.dataResults);
            } else if (treeGrid.flatData.length === 0 && isOffline(treeGrid) && treeGrid.dataSource instanceof DataManager) {
                const dm: DataManager = <DataManager>treeGrid.dataSource;
                treeGrid.dataModule.convertToFlatData(dm.dataSource.json);
                args.result = treeGrid.grid.dataSource[`${dataSource}`].json = treeGrid.flatData;
            }
            if (!isRemoteData(treeGrid) && !isCountRequired(this) && !isNullOrUndefined(treeGrid.dataSource)) {
                if ((<IGrid>this).isPrinting) {
                    setValue('isPrinting',  true, args);
                }
                treeGrid.notify('dataProcessor', args);
                //args = treeGrid.dataModule.dataProcessor(args);
            }
            extend(args, treeGrid.dataResults);
            if (treeGrid.enableImmutableMode) {
                args.result = args.result.slice();
            }
            if (treeGrid.initialRender) {
                this.contentModule.objectEqualityChecker = treeGrid.objectEqualityChecker;
            }
            // treeGrid.notify(events.beforeDataBound, args);
            if (!(<IGrid>this).isPrinting) {
                const callBackPromise: Deferred = new Deferred();
                treeGrid.trigger(events.beforeDataBound, args, (beforeDataBoundArgs: BeforeDataBoundArgs) => {
                    callBackPromise.resolve(beforeDataBoundArgs);
                });
                return callBackPromise;
            }
        };
        this.grid.log = (type: string | string[], args?: Object) => {
            if (this.loggerModule) {
                this.loggerModule.log(type, args);
            }
        };
    }

    private objectEqualityChecker = (old: Object, current: Object) => {
        if (old) {
            const keys: string[] = Object.keys(old);
            let isEqual: boolean = true;
            const excludeKeys: string[] = ['Children', 'childRecords', 'taskData', 'uniqueID', 'parentItem', 'parentUniqueID', 'index'];
            for (let i: number = 0; i < keys.length; i++) {
                if (old[keys[parseInt(i.toString(), 10)]] !== current[keys[parseInt(i.toString(), 10)]] &&
                    excludeKeys.indexOf(keys[parseInt(i.toString(), 10)]) === -1) {
                    const isDate: boolean = old[keys[parseInt(i.toString(), 10)]] instanceof Date &&
                    current[keys[parseInt(i.toString(), 10)]] instanceof Date;
                    if (!isDate || ((old[keys[parseInt(i.toString(), 10)]] as Date).getTime() !==
                       (current[keys[parseInt(i.toString(), 10)]] as Date).getTime())) {
                        isEqual = false; break;
                    }
                }
            }
            return isEqual;
        } else {
            return false;
        }
    }
    private bindCallBackEvents(): void {
        this.grid.toolbarClick = (args: ClickEventArgs): Deferred | void => {
            if ((args.item.id === this.grid.element.id + '_excelexport' && this.allowExcelExport === false) ||
            (args.item.id === this.grid.element.id + '_pdfexport' && this.allowPdfExport === false) ||
            (args.item.id === this.grid.element.id + '_csvexport' && this.allowExcelExport === false)){
                return;
            }
            const callBackPromise: Deferred = new Deferred();
            this.trigger(events.toolbarClick, args, (toolbarargs: ClickEventArgs) => {
                if (!toolbarargs.cancel) {
                    this.notify(events.toolbarClick, args);
                }
                callBackPromise.resolve(toolbarargs);
            });
            return callBackPromise;
        };
        this.grid.cellSelecting = (args: CellSelectingEventArgs): Deferred | void => {
            const actualTarget: string = 'actualTarget';
            const target: HTMLElement = this.grid.selectionModule[`${actualTarget}`];
            if (!isNullOrUndefined(target) && (target.classList.contains('e-treegridexpand') || target.classList.contains('e-treegridcollapse'))) {
                args.cancel = true;
            }
            const callBackPromise: Deferred = new Deferred();
            this.trigger(getObject('name', args), args, (cellselectingArgs: CellSelectingEventArgs) => {
                callBackPromise.resolve(cellselectingArgs);
            });
            return callBackPromise;
        };
        this.grid.beginEdit = (args: BeginEditArgs): Deferred | void => {
            if (!isNullOrUndefined(args.row) && args.row.classList.contains('e-summaryrow')) {
                args.cancel = true;
                return;
            }
            const callBackPromise: Deferred = new Deferred();
            this.trigger(events.beginEdit, args, (begineditArgs: BeginEditArgs) => {
                callBackPromise.resolve(begineditArgs);
            });
            return callBackPromise;
        };
    }
    private extendedGridEditEvents(): void {
        this.grid.dataStateChange = (args: DataStateChangeEventArgs): void => {
            if (this.isExpandRefresh) {
                this.isExpandRefresh = false;
                this.grid.dataSource = { result: this.flatData , count: getValue('count', this.grid.dataSource) };
            } else {
                if (args.action.requestType !== 'infiniteScroll') {
                    this.infiniteScrollData = [];
                }
                this.trigger(events.dataStateChange, args);
            }
        };
        this.grid.cellSave = (args: CellSaveArgs): Deferred | void => {
            if (this.grid.isContextMenuOpen()) {
                const contextitems: HTMLElement = <HTMLElement>this.grid.contextMenuModule.contextMenu.element.getElementsByClassName('e-selected')[0];
                if ((isNullOrUndefined(contextitems) || contextitems.id !== this.element.id + '_gridcontrol_cmenu_Save')) {
                    args.cancel = true;
                }
            }
            const callBackPromise: Deferred = new Deferred();
            this.trigger(events.cellSave, args, (cellsaveArgs: CellSaveArgs) => {
                if (!cellsaveArgs.cancel) {
                    this.notify(events.cellSave, cellsaveArgs);
                }
                callBackPromise.resolve(cellsaveArgs);
            });
            return callBackPromise;
        };
        this.grid.cellSaved = (args: CellSaveArgs): void => {
            this.trigger(events.cellSaved, args);
            this.notify(events.cellSaved, args);
        };
        this.grid.cellEdit = (args: BatchAddArgs): Deferred | void => {
            const prom: string = 'promise';
            const promise: Deferred = new Deferred();
            args[`${prom}`] = promise;
            this.notify(events.cellEdit, args);
            return promise;
        };
        this.grid.batchAdd = (args: BatchAddArgs): void => {
            this.trigger(events.batchAdd, args);
            this.notify(events.batchAdd, args);
        };
        this.grid.beforeBatchSave = (args: BeforeBatchSaveArgs): void => {
            this.trigger(events.beforeBatchSave, args);
            this.notify(events.beforeBatchSave, args);
        };
        this.grid.beforeBatchAdd = (args: BeforeBatchAddArgs): void => {
            this.trigger(events.beforeBatchAdd, args);
            this.notify(events.beforeBatchAdd, args);
        };
        this.grid.batchDelete = (args: BatchDeleteArgs): void => {
            this.trigger(events.batchDelete, args);
            this.notify(events.batchDelete, args);
        };
        this.grid.beforeBatchDelete = (args: BeforeBatchDeleteArgs): void => {
            this.trigger(events.beforeBatchDelete, args);
            this.notify(events.beforeBatchDelete, args);
        };
        this.grid.batchCancel = (args: BatchCancelArgs): void => {
            if (this.editSettings.mode !== 'Cell') {
                this.trigger(events.batchCancel, args);
            }
            this.notify(events.batchCancel, args);
        };
    }

    private updateRowTemplate(): void {
        if (this.rowTemplate) {
            if ((<{ isReact?: boolean }>this).isReact && (this.getContentTable() as HTMLTableElement).rows.length === 0) {
                setTimeout(() => {
                    this.treeColumnRowTemplate();
                    if (this.enableCollapseAll) {
                        const currentData: ITreeData[] = this.getCurrentViewRecords();
                        const rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
                        for (let i: number = 0; i < rows.length; i++) {
                            const args: RowDataBoundEventArgs = { data: currentData[parseInt(i.toString(), 10)],
                                row: rows[parseInt(i.toString(), 10)] };
                            this.renderModule.RowModifier(args);
                        }
                    }
                }, 0);
            } else {
                this.treeColumnRowTemplate();
            }
        }
    }

    private bindedDataSource(): void {
        const dataSource: string = 'dataSource';
        const isDataAvailable: string = 'isDataAvailable';
        const adaptor: string = 'adaptor';
        const ready: string = 'ready';
        if (this.dataSource && isCountRequired(this)) {
            const data: Object[] = this.flatData;
            const datacount: number = getValue('count', this.dataSource);
            this.grid.dataSource = { result: data, count: datacount };
        } else {
            this.grid.dataSource = !(this.dataSource instanceof DataManager) ?
                this.flatData : new DataManager(this.dataSource.dataSource, this.dataSource.defaultQuery, this.dataSource.adaptor);
        }
        if (this.dataSource instanceof DataManager && (this.dataSource.dataSource.offline || this.dataSource.ready)) {
            this.grid.dataSource[`${dataSource}`].json = extendArray(this.dataSource[`${dataSource}`].json);
            this.grid.dataSource[`${ready}`] = this.dataSource.ready;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const proxy: TreeGrid = this;
            if ( !isNullOrUndefined(this.grid.dataSource[`${ready}`]) ) {
                this.grid.dataSource[`${ready}`].then((e: ReturnOption): void => {
                    const dm: Object = proxy.grid.dataSource;
                    dm[`${dataSource}`].offline = true;
                    dm[`${isDataAvailable}`] = true;
                    dm[`${dataSource}`].json = e.result;
                    dm[`${adaptor}`] = new JsonAdaptor();
                });
            }
        }
    }

    private extendedGridActionEvents(): void {
        this.grid.actionBegin = (args: ActionEventArgs): Deferred| void => {
            if (args.requestType === 'sorting' && args.target && args.target.parentElement &&
            args.target.parentElement.classList.contains('e-hierarchycheckbox')) {
                args.cancel = true;
            }
            const requestType: string = getObject('requestType', args);
            if (requestType === 'reorder') {
                this.notify('getColumnIndex', {});
            }
            if (isRemoteData(this) && this.enableVirtualization) {
                if (args.requestType === 'virtualscroll') {
                    this.query.expand('VirtualScrollingAction');
                    this.showSpinner();
                }
                else if (args.requestType === 'searching' && args.searchString === '') {
                    this.query.expand('ClearSearchingAction');
                }
                else if (args.action === 'clearFilter') {
                    this.query.expand('ClearFilteringAction');
                }
            }
            this.notify('actionBegin', { editAction: args });
            if (!isRemoteData(this) && !isNullOrUndefined(this.filterModule) && !isCountRequired(this)
        && (this.grid.filterSettings.columns.length === 0 && this.grid.searchSettings.key.length === 0)) {
                this.notify('clearFilters', { flatData: this.grid.dataSource });
                this.grid.setProperties({ dataSource: this.dataResults.result }, true);
                if (isNullOrUndefined(this.grid['changedProperties'].dataSource)) {
                    this.grid.renderModule.data.dataManager = this.grid.dataSource instanceof DataManager ?
                     <DataManager>this.grid.dataSource :
                        (isNullOrUndefined(this.grid.dataSource) ? new DataManager() : new DataManager(this.grid.dataSource as Object));
                    this.grid.renderModule.data.isQueryInvokedFromData = true;
                    this.grid.query = this.grid.query instanceof Query ? this.grid.query : new Query();
                }
            }
            if (this.action !== 'indenting' && this.action !== 'outdenting') {
                const callBackPromise: Deferred = new Deferred();
                this.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
                    if (!actionArgs.cancel) {
                        this.notify(events.beginEdit, actionArgs);
                    }
                    callBackPromise.resolve(actionArgs);
                });
                return callBackPromise;
            }
        };
        this.grid.actionComplete = (args: ActionEventArgs) => {
            this.notify('actioncomplete', args);
            this.updateColumnModel(); this.updateTreeGridModel();
            if (args.requestType === 'reorder') {
                this.notify('setColumnIndex', {});
            }
            this.notify('actionComplete', { editAction: args });
            if (args.requestType === 'add' && (this.editSettings.newRowPosition !== 'Top' && this.editSettings.newRowPosition !== 'Bottom')) {
                this.notify(events.beginAdd, args);
            }
            if (args.requestType === 'batchsave') {
                this.notify(events.batchSave, args);
            }
            this.notify('updateGridActions', args);
            if (args.requestType === 'save' && this.aggregates.map((ag: AggregateRow) => ag.showChildSummary === true).length) {
                this.grid.refresh();
            }
            if (args.action === 'filter') {
                if (this.filterModule['currentFilterObject'] !== '' && this.enableVirtualization && !this.initialRender && !(isRemoteData(this) && this.enableVirtualization)) {
                    this.expandAll();
                }
            }
            if (args.requestType === 'searching') {
                if (this.searchSettings.key !== '' && this.enableVirtualization && !this.initialRender && !(isRemoteData(this) && this.enableVirtualization)) {
                    this.expandAll();
                }
            }
            if (args.action === 'clearFilter' && this.enableCollapseAll) {
                this.collapseAll();
            }
            if (this.action === 'indenting' || this.action === 'outdenting') {
                this.action = this.action === 'indenting' ? 'indented' : 'outdented';
                const selectedItem: Object[] = [this.selectedRecords];
                const actionArgs: TreeActionEventArgs = {
                    data: selectedItem,
                    dropIndex: this.dropIndex,
                    dropPosition: this.dropPosition,
                    modifiedRecords: this.modifiedRecords,
                    requestType: this.action,
                    row: this.selectedRows
                };
                this.trigger(events.actionComplete, actionArgs);
                const currentPageItem: Object[] = this.getCurrentViewRecords().filter((e: ITreeData) => {
                    return e.uniqueID === (selectedItem[0] as ITreeData).uniqueID;
                });
                if (!currentPageItem.length) {
                    this.refreshToolbarItems();
                }
                this.action = ''; this.selectedRecords = this.selectedRows = this.modifiedRecords = [];
            } else {
                if (this.grid.isFrozenGrid() && this.enableVirtualization && args['tableName'] === 'movable') {
                    const movableContent: HTMLElement = this.grid.element.querySelector('.' + literals.movableContent) as HTMLElement;
                    const frozenContent: HTMLElement = this.grid.element.querySelector('.' + literals.frozenContent) as HTMLElement;
                    movableContent.style.height = frozenContent.style.height = 'auto';
                }
                this.trigger(events.actionComplete, args);
            }
        };
    }

    private extendedGridEvents(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const treeGrid: TreeGrid = this;
        this.grid.recordDoubleClick = (args: RecordDoubleClickEventArgs) => {
            this.trigger(events.recordDoubleClick, args);
            this.notify(events.recordDoubleClick, args);
        };
        this.grid.detailDataBound = (args: DetailDataBoundEventArgs): void => {
            this.notify('detaildataBound', args);
            this.trigger(events.detailDataBound, args);
        };
        this.grid.rowDataBound = function (args: RowDataBoundEventArgs): void {
            if (isNullOrUndefined((<IGrid>this).isPrinting)) {
                setValue('isPrinting', false, args);
            } else {
                setValue('isPrinting', (<IGrid>this).isPrinting, args);
            }
            treeGrid.renderModule.RowModifier(args);
        };
        this.grid.queryCellInfo = function (args: QueryCellInfoEventArgs): void {
            if (isNullOrUndefined((<IGrid>this).isPrinting)) {
                setValue('isPrinting', false, args);
            } else {
                setValue('isPrinting', (<IGrid>this).isPrinting, args);
            }
            treeGrid.renderModule.cellRender(args);
        };
        this.grid.contextMenuClick = (args: MenuEventArgs): void => {
            this.notify(events.contextMenuClick, args);
            this.trigger(events.contextMenuClick, args);
        };
        this.grid.contextMenuOpen = (args: BeforeOpenCloseMenuEventArgs) => {
            this.notify(events.contextMenuOpen, args);
            this.trigger(events.contextMenuOpen, args);
        };
        this.grid.queryCellInfo = (args: QueryCellInfoEventArgs): void => {
            this.renderModule.cellRender(args);
        };
    }

    private bindGridDragEvents(): void {
        this.grid.rowDragStartHelper = (args: RowDragEventArgs): void => {
            this.trigger(events.rowDragStartHelper, args);
        };
        this.grid.rowDragStart = (args: RowDragEventArgs): void => {
            this.trigger(events.rowDragStart, args);
        };
        this.grid.rowDrag = (args: RowDragEventArgs): void => {
            if (this.grid.isEdit) {
                args.cancel = true;
                return;
            }
            this.notify(events.rowdraging, args);
            this.trigger(events.rowDrag, args);
        };
        this.grid.rowDrop = (args: RowDropEventArgs): void => {
            if (this.grid.isEdit) {
                args.cancel = true;
                return;
            }
            this.notify(events.rowDropped, args);
            args.cancel = true;
        };
    }

    /**
     * Renders TreeGrid component
     *
     * @private
     * @returns {void}
     */
    protected loadGrid(): void {
        this.bindGridProperties();
        this.bindGridEvents();
        setValue('registeredTemplate', this.registeredTemplate, this.grid);
        const ref: string = 'viewContainerRef';
        setValue('viewContainerRef', this[`${ref}`], this.grid);
    }

    /**
     * AutoGenerate TreeGrid columns from first record
     *
     * @hidden
     * @returns {void}
     */
    private autoGenerateColumns(): void {
        if (!this.columns.length && (!this.dataModule.isRemote() && Object.keys(this.dataSource).length)) {
            this.columns = [];
            // if (this.dataSource instanceof DataManager) {
            //   record = (<DataManager>this.dataSource).dataSource.json[0];
            // } else {
            const record: Object = this.dataSource[0];
            // }
            const keys: string[] = Object.keys(record);
            for (let i: number = 0; i < keys.length; i++) {
                if ([this.childMapping, this.parentIdMapping].indexOf(keys[parseInt(i.toString(), 10)]) === -1) {
                    (<string[]>this.columns).push(keys[parseInt(i.toString(), 10)]);
                }
            }
        }
    }

    private getGridEditSettings(): GridEditModel {
        const edit: GridEditModel = {};
        const guid: string = 'guid';
        edit.allowAdding = this.editSettings.allowAdding;
        edit.allowEditing = this.editSettings.allowEditing;
        edit.allowDeleting = this.editSettings.allowDeleting;
        edit.newRowPosition = this.editSettings.newRowPosition === 'Bottom' ? 'Bottom' : 'Top';
        edit.allowEditOnDblClick = this.editSettings.allowEditOnDblClick;
        edit.showConfirmDialog = this.editSettings.showConfirmDialog; edit.template = this.editSettings.template;
        edit.showDeleteConfirmDialog = this.editSettings.showDeleteConfirmDialog;
        edit.allowNextRowEdit = this.editSettings.allowNextRowEdit;
        edit[`${guid}`] = this.editSettings[`${guid}`];
        edit.dialog = this.editSettings.dialog;
        switch (this.editSettings.mode) {
        case 'Dialog' :
            edit.mode = this.editSettings.mode;
            break;
        case 'Batch':
            edit.mode = this.editSettings.mode;
            break;
        case 'Row' :
            edit.mode = 'Normal'; break;
        case 'Cell':
            edit.mode = 'Normal';
            edit.showConfirmDialog = false;
            break;
        }
        return edit;
    }

    /**
     * Defines grid toolbar from treegrid toolbar model
     *
     * @hidden
     * @returns {Object[]} - returns context menu items
     */
    private getContextMenu(): Object[] {
        if (this.contextMenuItems) {
            const items: Object[] = [];
            for (let i: number = 0; i < this.contextMenuItems.length; i++) {
                switch (this.contextMenuItems[parseInt(i.toString(), 10)]) {
                case 'AddRow':
                case ContextMenuItems.AddRow:
                    items.push(<ContextMenuItemModel>{ text: this.l10n.getConstant('AddRow') ,
                        target: '.e-content' , id: this.element.id + '_gridcontrol_cmenu_AddRow' ,
                        items: [{ text: this.l10n.getConstant('Above') , id: 'Above' }, { text: this.l10n.getConstant('Below') , id: 'Below'}, { text: this.l10n.getConstant('Child') , id: 'Child'}]});
                    break;
                case 'Indent':
                case ContextMenuItems.RowIndent:
                    items.push(<ContextMenuItemModel>{ text: this.l10n.getConstant('RowIndent') ,
                        target: '.e-content' , iconCss: 'e-indent e-icons', id: this.element.id + '_gridcontrol_cmenu_Indent'});
                    break;
                case 'Outdent':
                case ContextMenuItems.RowOutdent:
                    items.push(<ContextMenuItemModel>{ text: this.l10n.getConstant('RowOutdent') ,
                        target: '.e-content' , iconCss: 'e-outdent e-icons', id: this.element.id + '_gridcontrol_cmenu_Outdent'});
                    break;
                default:
                    items.push(this.contextMenuItems[parseInt(i.toString(), 10)]);
                }
            }
            return items;
        } else {
            return null;
        }
    }

    /**
     * Defines grid toolbar from treegrid toolbar model
     *
     * @hidden
     * @returns {Object[]} - Returns toolbar items
     */
    private getGridToolbar(): Object[] {
        if (this.toolbar) {
            this.l10n = new L10n('treegrid', this.defaultLocale, this.locale);
            const items: Object[] = [];
            let tooltipText: string;
            for (let i: number = 0; i < this.toolbar.length; i++) {
                switch (this.toolbar[parseInt(i.toString(), 10)]) {
                case 'Search':
                case ToolbarItem.Search:
                    items.push('Search'); break;
                case 'Print':
                case ToolbarItem.Print:
                    items.push('Print'); break;
                case 'ExpandAll':
                case ToolbarItem.ExpandAll:
                    tooltipText = this.l10n.getConstant('ExpandAll');
                    items.push(<ItemModel>{text: tooltipText, tooltipText: tooltipText,
                        prefixIcon: 'e-expand', id: this.element.id + '_gridcontrol_expandall' });
                    break;
                case 'CollapseAll':
                case ToolbarItem.CollapseAll:
                    tooltipText = this.l10n.getConstant('CollapseAll');
                    items.push(<ItemModel>{text: tooltipText,
                        tooltipText: tooltipText, prefixIcon: 'e-collapse', id: this.element.id + '_gridcontrol_collapseall'
                    });
                    break;
                case 'Indent':
                case ToolbarItem.RowIndent:
                    tooltipText = this.l10n.getConstant('RowIndent');
                    items.push(<ItemModel>{
                        text: tooltipText, tooltipText: tooltipText,
                        prefixIcon: 'e-indent', id: this.element.id + '_gridcontrol_indent'
                    });
                    break;
                case 'Outdent':
                case ToolbarItem.RowOutdent:
                    tooltipText = this.l10n.getConstant('RowOutdent');
                    items.push(<ItemModel>{
                        text: tooltipText, tooltipText: tooltipText,
                        prefixIcon: 'e-outdent', id: this.element.id + '_gridcontrol_outdent'
                    });
                    break;
                default:
                    items.push(this.toolbar[parseInt(i.toString(), 10)]);
                }
            }
            return items;
        } else {
            return null;
        }

    }

    private getGridColumns(columns: Column[], isEmptyColumnModel: boolean = true, index: number = 0): GridColumnModel[] {
        const column: Column[] | ColumnModel[] | string[] = columns;
        const stackedColumn: string = 'columns';
        if (isEmptyColumnModel) {
            this.columnModel = [];
        }
        let treeGridColumn: ColumnModel;
        let gridColumn: GridColumnModel;
        if (this.columnModel.length === 0) {
            index = index === 0 ? -1 : index;
        }
        const gridColumnCollection: GridColumnModel[] = [];
        for (let i: number = 0; i < column.length; i++) {
            index = index + 1;
            const treeColumn: GridColumnModel = this.grid.getColumnByUid(column[parseInt(i.toString(), 10)].uid);
            gridColumn = treeColumn ? treeColumn : {}; treeGridColumn = {};
            if (typeof this.columns[parseInt(i.toString(), 10)] === 'string') {
                gridColumn.field =  treeGridColumn.field = <string>this.columns[parseInt(i.toString(), 10)];
            } else {
                for (const prop of Object.keys(column[parseInt(i.toString(), 10)])) {
                    if (index === this.treeColumnIndex && prop === 'template') {
                        treeGridColumn[`${prop}`] = column[parseInt(i.toString(), 10)][`${prop}`];
                    } else if (prop === 'columns' && !isNullOrUndefined(column[parseInt(i.toString(), 10)][`${prop}`])) {
                        gridColumn[`${prop}`] = this.getGridColumns(column[parseInt(i.toString(), 10)][`${prop}`] as Column[], false, this.columnModel.length - 1);
                        treeGridColumn[`${prop}`] = column[parseInt(i.toString(), 10)][`${prop}`];
                    } else if (this.initialRender && !isNullOrUndefined(treeColumn) && this.enablePersistence && prop === 'edit') {
                        gridColumn[`${prop}`] = treeGridColumn[`${prop}`]  = treeColumn[`${prop}`];
                    } else if (!(treeColumn) || prop !== 'sortComparer') {
                        gridColumn[`${prop}`] = treeGridColumn[`${prop}`] = column[parseInt(i.toString(), 10)][`${prop}`];
                    }
                }
            }
            if (!treeGridColumn[`${stackedColumn}`]) {
                this.columnModel.push(new Column(treeGridColumn));
            }
            gridColumnCollection.push(gridColumn);
            if (!isNullOrUndefined(this.columnModel[this.treeColumnIndex]) && this.enableRtl) {
                if (gridColumn.field === this.columnModel[this.treeColumnIndex].field) {
                    if (isNullOrUndefined(this.treeColumnTextAlign)) {
                        this.treeColumnTextAlign = this.columnModel[this.treeColumnIndex].textAlign;
                        this.treeColumnField = this.columnModel[this.treeColumnIndex].field;
                    }
                    gridColumn.textAlign = 'Right';
                }
            }
        }
        return gridColumnCollection;
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {TreeGridModel} newProp - properties details which has to be modified
     * @hidden
     * @returns {void}
     */
    public onPropertyChanged(newProp: TreeGridModel): void {
        const properties: string[] = Object.keys(newProp);
        let requireRefresh: boolean = false;
        if (properties.indexOf('columns') > -1 && !isNullOrUndefined(newProp.columns) && this.frozenColumns === 0
            && this.frozenRows === 0 && !this.columnModel.some((col: any) => col.isFrozen || col.freeze)) {
            this.grid.columns = this.getGridColumns(newProp.columns as Column[]);
            this.grid['updateColumnObject']();
            requireRefresh = true;
        }
        for (const prop of properties) {
            switch (prop) {
            case 'treeColumnIndex':
                this.grid.refreshColumns(); break;
            case 'allowPaging':
                this.grid.allowPaging = this.allowPaging; break;
            case 'pageSettings':
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                this.grid.pageSettings = getActualProperties(this.pageSettings) as any;
                requireRefresh = true;
                break;
            case 'enableVirtualization':
                this.grid.enableVirtualization = this.enableVirtualization;
                break;
            case 'enableColumnVirtualization':
                this.grid.enableColumnVirtualization = this.enableColumnVirtualization;
                break;
            case 'toolbar':
                this.grid.toolbar = this.getGridToolbar(); break;
            case 'allowSelection':
                this.grid.allowSelection = this.allowSelection; break;
            case 'selectionSettings':
                this.grid.selectionSettings = getActualProperties(this.selectionSettings); break;
            case 'allowSorting':
                this.grid.allowSorting = this.allowSorting; break;
            case 'allowMultiSorting':
                this.grid.allowMultiSorting = this.allowMultiSorting; break;
            case 'sortSettings':
                this.grid.sortSettings = getActualProperties(this.sortSettings); break;
            case 'searchSettings':
                this.grid.searchSettings = getActualProperties(this.searchSettings); break;
            case 'allowFiltering':
                this.grid.allowFiltering = this.allowFiltering; break;
            case 'filterSettings':
                if (!this.initialRender) {
                    this.grid.filterSettings = getActualProperties(this.filterSettings);
                }
                break;
            case 'showColumnMenu':
                this.grid.showColumnMenu = this.showColumnMenu; break;
            case 'allowRowDragAndDrop':
                this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop; break;
            case 'aggregates':
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                this.grid.aggregates = getActualProperties(this.aggregates) as any; break;
            case 'enableInfiniteScrolling':
                this.grid.enableInfiniteScrolling = this.enableInfiniteScrolling; break;
            case 'dataSource':
                this.isLocalData = (!(this.dataSource instanceof DataManager) || (!isNullOrUndefined((<DataManager>this.dataSource).ready))
                           || this.dataSource.adaptor instanceof RemoteSaveAdaptor) ;
                this.convertTreeData(this.dataSource);
                if (this.isLocalData) {
                    if (isCountRequired(this)) {
                        const count: number = getValue('count', this.dataSource);
                        this.grid.dataSource = {result: this.flatData, count: count};
                    } else {
                        const data: Object | DataManager = this.dataSource;
                        this.grid.dataSource = !(data instanceof DataManager) ?
                            this.flatData : new DataManager(data.dataSource, data.defaultQuery, data.adaptor);
                    }
                    if (this.enableVirtualization) {
                        (this.grid.contentModule as VirtualTreeContentRenderer).isDataSourceChanged = true;
                    }
                } else {
                    this.bindedDataSource();
                    if (this.enableVirtualization) {
                        (this.grid.contentModule as VirtualTreeContentRenderer).removeEventListener();
                        (this.grid.contentModule as VirtualTreeContentRenderer).eventListener('on');
                        (this.grid.contentModule as VirtualTreeContentRenderer).renderTable();
                    }
                }
                break;
            case 'query':
                this.grid.query = this.query; break;
            case 'enableCollapseAll':
                if (newProp[`${prop}`]) {
                    this.collapseAll();
                } else {
                    this.expandAll();
                }
                break;
            case 'expandStateMapping':
                this.grid.refresh();
                break;
            case 'gridLines':
                this.grid.gridLines = this.gridLines; break;
            case 'rowTemplate':
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                this.grid.rowTemplate = getActualProperties(this.rowTemplate) as any;
                break;
            case 'frozenRows':
                this.grid.frozenRows = this.frozenRows; break;
            case 'frozenColumns':
                this.grid.frozenColumns = this.frozenColumns; break;
            case 'rowHeight':
                this.grid.rowHeight = this.rowHeight; break;
            case 'height':
                if (!isNullOrUndefined(this.height) && typeof(this.height) === 'string' && this.height.indexOf('%') !== -1) {
                    this.element.style.height = this.height;
                }
                this.grid.height = this.height; break;
            case 'width':
                if (!isNullOrUndefined(this.width) && typeof(this.width) === 'string' && this.width.indexOf('%') !== -1) {
                    this.element.style.width = this.width;
                }
                this.grid.width = this.width; break;
            case 'locale':
                this.grid.locale = this.locale;
                this.TreeGridLocale(); this.grid.toolbar = this.getGridToolbar();
                this.grid.contextMenuItems = this.getContextMenu();
                break;
            case 'selectedRowIndex':
                this.grid.selectedRowIndex = this.selectedRowIndex; break;
            case 'enableAltRow':
                this.grid.enableAltRow = this.enableAltRow; break;
            case 'enableHover':
                this.grid.enableHover = this.enableHover; break;
            case 'enableAutoFill':
                this.grid.enableAutoFill = this.enableAutoFill; break;
            case 'enableAdaptiveUI':
                this.grid.enableAdaptiveUI = this.enableAdaptiveUI; break;
            case 'enableImmutableMode':
                this.grid.enableImmutableMode = this.enableImmutableMode; break;
            case 'allowExcelExport':
                this.grid.allowExcelExport = this.allowExcelExport; break;
            case 'allowPdfExport':
                this.grid.allowPdfExport = this.allowPdfExport; break;
            case 'enableRtl':
                if (!isNullOrUndefined(this.treeColumnField)) {
                    this.updateTreeColumnTextAlign();
                }
                this.grid.enableRtl = this.enableRtl;
                break;
            case 'allowReordering':
                this.grid.allowReordering = this.allowReordering; break;
            case 'allowResizing':
                this.grid.allowResizing = this.allowResizing; break;
            case 'textWrapSettings':
                this.grid.textWrapSettings = getActualProperties(this.textWrapSettings); break;
            case 'allowTextWrap':
                this.grid.allowTextWrap = getActualProperties(this.allowTextWrap);
                this.grid.refresh(); break;
            case 'contextMenuItems':
                this.grid.contextMenuItems = this.getContextMenu(); break;
            case 'showColumnChooser':
                this.grid.showColumnChooser = this.showColumnChooser; break;
            case 'detailTemplate':
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                this.grid.detailTemplate = getActualProperties(this.detailTemplate) as any; break;
            case 'columnMenuItems':
                this.grid.columnMenuItems = getActualProperties(this.columnMenuItems); break;
            case 'editSettings':
                if (this.grid.isEdit && this.grid.editSettings.mode === 'Normal' && newProp[`${prop}`].mode &&
                          (newProp[`${prop}`].mode === 'Cell' || newProp[`${prop}`].mode === 'Row')) {
                    this.grid.closeEdit();
                }
                this.grid.editSettings = this.getGridEditSettings(); break;
            }
            if (requireRefresh) {
                this.grid.refresh();
            }
        }
    }

    private updateTreeColumnTextAlign(): void {
        const gridColumn: GridColumn = this.grid.getColumnByField(this.treeColumnField);
        gridColumn.textAlign = this.enableRtl ? 'Right' : this.treeColumnTextAlign;
        this.grid.refreshColumns();
    }

    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     *
     * @method destroy
     * @returns {void}
     */
    public destroy(): void {
        const treeGridElement: Element = this.element;
        if (!treeGridElement) { return; }
        const hasTreeGridChild: boolean = treeGridElement.querySelector('.' + 'e-gridheader') &&
            treeGridElement.querySelector( '.' + 'e-gridcontent') ? true : false;
        if (hasTreeGridChild) {
            this.unwireEvents();
        }
        this.removeListener();
        if (hasTreeGridChild) {
            super.destroy();
        }
        if (this.grid) {
            this.grid.destroy();
        }
        if (this.dataModule) {
            this.dataModule.destroy();
        }
        const modules: string[] = ['dataModule', 'sortModule', 'renderModule', 'filterModule', 'printModule', 'clipboardModule',
            'excelExportModule', 'pdfExportModule', 'toolbarModule', 'summaryModule', 'reorderModule', 'resizeModule',
            'pagerModule', 'keyboardModule', 'columnMenuModule', 'contextMenuModule', 'editModule', 'virtualScrollModule',
            'selectionModule', 'detailRow', 'rowDragAndDropModule', 'freezeModule'];
        for (let i: number = 0; i < modules.length; i++) {
            if (this[modules[parseInt(i.toString(), 10)]]) {
                this[modules[parseInt(i.toString(), 10)]] = null;
            }
        }
        this.element.innerHTML = '';
        this.grid = null;
    }

    /**
     * Update the TreeGrid model
     *
     * @method dataBind
     * @returns {void}
     * @private
     */
    public dataBind(): void {
        if (isNullOrUndefined(this.grid)) {
            return;
        }
        if (!isNullOrUndefined(this.rowDropSettings.targetID) &&
        isNullOrUndefined(document.getElementById(this.grid.rowDropSettings.targetID))) {
            document.getElementById(this.rowDropSettings.targetID).id = this.grid.rowDropSettings.targetID;
            this.rowDropSettings.targetID = this.grid.rowDropSettings.targetID;
        }
        super.dataBind();
        this.grid.dataBind();
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Returns persist properties details
     * @hidden
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['pageSettings', 'sortSettings',
            'filterSettings', 'columns', 'searchSettings', 'selectedRowIndex', 'treeColumnIndex'];
        const ignoreOnPersist: { [x: string]: string[] } = {
            pageSettings: ['template', 'pageSizes', 'pageSizeMode', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent', 'hierarchyMode'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: []
        };
        const ignoreOnColumn: string[] = ['filter', 'edit', 'filterBarTemplate', 'headerTemplate', 'template',
            'commandTemplate', 'commands', 'dataSource'];
        for (let i: number = 0; i < keyEntity.length; i++) {
            const currentObject: Object = this[keyEntity[parseInt(i.toString(), 10)]];
            for (let k: number = 0, val: string[] = ignoreOnPersist[keyEntity[parseInt(i.toString(), 10)]];
                (!isNullOrUndefined(val) && k < val.length); k++) {
                const objVal: string = val[parseInt(k.toString(), 10)];
                delete currentObject[`${objVal}`];
            }
        }
        this.ignoreInArrays(ignoreOnColumn, <Column[]>this.columns);
        return this.addOnPersist(keyEntity);
    }
    private ignoreInArrays(ignoreOnColumn: string[], columns: Column[]): void {
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].columns) {
                this.ignoreInColumn(ignoreOnColumn, columns[parseInt(i.toString(), 10)]);
                this.ignoreInArrays(ignoreOnColumn, <Column[]>columns[parseInt(i.toString(), 10)].columns);
            } else {
                this.ignoreInColumn(ignoreOnColumn, columns[parseInt(i.toString(), 10)]);
            }
        }
    }

    private ignoreInColumn(ignoreOnColumn: string[], column: Column): void {
        if (isNullOrUndefined(column.template)) {
            for (let i: number = 0; i < ignoreOnColumn.length; i++) {
                delete column[ignoreOnColumn[parseInt(i.toString(), 10)]];
                column.filter = {};
            }
        }
    }
    private mouseClickHandler(e: MouseEvent & TouchEvent): void {
        if (!isNullOrUndefined(e.touches)) {
            return;
        }
        const target: HTMLElement = <HTMLElement>e.target;
        if (
            (target.classList.contains('e-treegridexpand') ||
      target.classList.contains('e-treegridcollapse') ) && (!this.isEditCollapse && !this.grid.isEdit)
        ) {
            this.expandCollapseRequest(target);
        }
        const isEllipsisTooltip: string = 'isEllipsisTooltip';
        if ((target.classList.contains('e-treegridexpand') || target.classList.contains('e-treegridcollapse')) &&
            (this.grid[`${isEllipsisTooltip}`]())) {
            this.grid['toolTipObj'].close();
        }
        this.isEditCollapse = false;
        this.notify('checkboxSelection', {target: target});
        if (this.grid.isCheckBoxSelection && !this.grid.isPersistSelection) {
            if (this.aggregates.map((ag: AggregateRow) => ag.showChildSummary === true).length) {
                const checkedTarget: HTMLInputElement = this.grid.getHeaderContent().querySelector('.e-checkselectall');
                const checkedLen: number = this.grid.getSelectedRowIndexes().length;
                const totalRecords: number = this.getCurrentViewRecords().length;
                if (checkedLen === totalRecords){
                    const spanEle: HTMLElement = checkedTarget.nextElementSibling as HTMLElement;
                    removeClass([spanEle], ['e-stop', 'e-uncheck']);
                    addClass([spanEle], ['e-check']);
                }
            }
        }
        if (((target.classList.contains('e-flmenu-cancelbtn') || target.classList.contains('e-flmenu-okbtn')
            || target.classList.contains('e-content') || target.classList.contains('e-rowcell'))
            && !isNullOrUndefined(this.grid.filterModule) && this.isReact)) {
            if (!isNullOrUndefined(this.grid.filterModule['column'])) {
                if (this.grid.filterModule['column'].filterTemplate) {
                    const elem: Element = document.getElementById((this.grid.filterModule as any).filterModule['dlgObj'].element.id);
                    this.grid.filterModule['fltrDlgDetails'].isOpen = false;
                    if ((this.grid.filterModule as any).filterModule['dlgObj'] && !(this.grid.filterModule as any).filterModule['dlgObj'].isDestroyed && elem) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (this as any).clearTemplate(['filterTemplate'], undefined, () => {
                            (this.grid.filterModule as any).filterModule['dlgObj'].destroy();
                        });
                    }
                }
            }
        }
    }

    /**
     * Returns TreeGrid rows
     *
     * @returns {HTMLTableRowElement[]} - Returns row elements collection
     */
    public getRows(): HTMLTableRowElement[] {
        return this.grid.getRows() as HTMLTableRowElement[];
    }

    /**
     * Gets the pager of the TreeGrid.
     *
     * @returns {Element} - Returns pager element
     */
    public getPager(): Element {
        return this.grid.getPager(); //get element from pager
    }

    /**
     * Adds a new record to the TreeGrid. Without passing parameters, it adds empty rows.
     * > `editSettings.allowEditing` should be true.
     *
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added.
     * @param {RowPosition} position - Defines the new row position to be added.
     * @returns {void}
     */
    public addRecord(data?: Object, index?: number,  position?: RowPosition): void {
        if (this.editModule) {
            const isAddedRowByMethod: string = 'isAddedRowByMethod';
            this.editModule[`${isAddedRowByMethod}`] = true;
            this.editModule.addRecord(data, index, position);
        }
    }
    /**
     * Cancels edited state.
     *
     * @returns {void}
     */
    public closeEdit(): void {
        if (this.grid.editModule) {
            this.grid.editModule.closeEdit();
        }
    }
    /**
     * Saves the cell that is currently edited. It does not save the value to the DataSource.
     *
     * @returns {void}
     */
    public saveCell(): void {
        if (this.grid.editModule) {
            this.grid.editModule.saveCell();
        }
    }
    /**
     * To update the specified cell by given value without changing into edited state.
     *
     * @param {number} rowIndex Defines the row index.
     * @param {string} field Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to be changed.
     * @returns {void}
     */
    public updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void {
        if (this.grid.editModule) {
            this.grid.editModule.updateCell(rowIndex, field, value);
        }
    }
    /**
     * To update the specified row by given values without changing into edited state.
     *
     * @param {number} index Defines the row index.
     * @param {Object} data Defines the data object to be updated.
     * @returns {void}
     */
    public updateRow(index: number, data: Object): void {
        if (this.grid.editModule) {
            if (!isNullOrUndefined(index)) {
                const griddata: Object = this.grid.getCurrentViewRecords()[parseInt(index.toString(), 10)];
                extend(griddata, data);
                this.grid.editModule.updateRow(index, griddata);
            } else {
                this.grid.editModule.updateRow(index, data);
            }
        }
    }

    /**
     * Delete a record with Given options. If fieldName and data is not given then TreeGrid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     *
     * @param {string} fieldName - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     * @returns {void}
     */
    public deleteRecord(fieldName?: string, data?: Object): void {
        if ((isNullOrUndefined(fieldName) && (isNullOrUndefined(data)) || (this.getSelectedRecords().length <= 0))) {
            const error: string = 'The provided value for the fieldName and data is undefined. Please ensure the fieldName and data contains number.';
            this.trigger(events.actionFailure, { error: error });
        }
        if (this.grid.editModule) {
            this.grid.editModule.deleteRecord(fieldName, data);
        }
    }

    /**
     * To edit any particular row by TR element.
     *
     * @param {HTMLTableRowElement} row - Defines the table row to be edited.
     * @returns {void}
     */
    public startEdit(row?: HTMLTableRowElement): void {
        if (this.grid.editModule) {
            this.grid.editModule.startEdit(row);
        }
    }

    /**
     * To edit any particular cell using row index and cell index.
     *
     * @param {number} rowIndex - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform cell edit.
     * @returns {void}
     */
    public editCell(rowIndex?: number, field?: string): void {
        if (this.editModule) {
            this.editModule.editCell(rowIndex, field);
        }
    }

    /**
     * Enables or disables ToolBar items.
     *
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @returns {void}
     */
    public enableToolbarItems(items: string[], isEnable: boolean): void {
        if (this.grid.toolbarModule) {
            this.grid.toolbarModule.enableItems(items, isEnable);
        }
    }


    /**
     * If TreeGrid is in editable state, you can save a record by invoking endEdit.
     *
     * @returns {void}
     */
    public endEdit(): void {
        if (this.grid.editModule) {
            this.grid.editModule.endEdit();
        }
    }

    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     *
     * @param {number} x - Defines the X axis.
     * @param {number} y - Defines the Y axis.
     * @returns {void}
     */
    public openColumnChooser(x?: number, y?: number): void {
        if (this.columnChooserModule) {
            this.columnChooserModule.openColumnChooser(x, y);
        }
    }

    /**
     * Delete any visible row by TR element.
     *
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     * @returns {void}
     */
    public deleteRow(tr: HTMLTableRowElement): void {
        if (this.grid.editModule) {
            this.grid.editModule.deleteRow(tr);
        }
    }

    /**
     * Get the names of the primary key columns of the TreeGrid.
     *
     * @returns {string[]} - Returns primary key collection
     */
    public getPrimaryKeyFieldNames(): string[] {
        return this.grid.getPrimaryKeyFieldNames();
    }

    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     * @returns {void}
     */
    public setCellValue(key: string | number, field: string, value: string | number | boolean | Date): void {
        this.grid.setCellValue(key, field, value);
        const rowIndex: number = this.grid.getRowIndexByPrimaryKey(key);
        const record: ITreeData = this.getCurrentViewRecords()[parseInt(rowIndex.toString(), 10)];
        editAction({ value: record, action: 'edit' }, this,
                   this.isSelfReference, record.index, this.grid.selectedRowIndex, field);
    }

    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     * @returns {void}
     */
    public setRowData(key: string | number, rowData?: ITreeData): void {
        const currentRecords: ITreeData[] = this.getCurrentViewRecords();
        const primaryKey: string = this.grid.getPrimaryKeyFieldNames()[0];
        let level: number = 0;
        let record: ITreeData = {};
        currentRecords.some((value: ITreeData) => {
            if (value[`${primaryKey}`] === key) {
                record = value;
                return true;
            } else {
                return false;
            }
        });
        level = record.level;
        rowData.level = level;
        rowData.index = record.index;
        rowData.childRecords = record.childRecords;
        rowData.taskData = record.taskData;
        rowData.uniqueID = record.uniqueID;
        rowData.parentItem = record.parentItem;
        rowData.checkboxState = record.checkboxState;
        rowData.hasChildRecords = record.hasChildRecords;
        rowData.parentUniqueID = record.parentUniqueID;
        rowData.expanded = record.expanded;
        this.grid.setRowData(key, rowData);
        const visibleRecords: ITreeData[] = this.getVisibleRecords();
        if (visibleRecords.length > 0 && key === (visibleRecords[visibleRecords.length - 1])[`${primaryKey}`]) {
            const table: Element = this.getContentTable();
            const sHeight: number = table.scrollHeight;
            const clientHeight: number = this.getContent().clientHeight;
            this.lastRowBorder(this.getRows()[currentRecords.indexOf(record)], sHeight <= clientHeight);
        }
    }

    /**
     * Navigates to the specified target page.
     *
     * @param  {number} pageNo - Defines the page number to navigate.
     * @returns {void}
     */
    public goToPage(pageNo: number): void {
        if (this.grid.pagerModule) {
            this.grid.pagerModule.goToPage(pageNo);
        }
    }

    /**
     * Defines the text of external message.
     *
     * @param  {string} message - Defines the message to update.
     * @returns {void}
     */
    public updateExternalMessage(message: string): void {
        if (this.pagerModule) {
            this.grid.pagerModule.updateExternalMessage(message);
        }
    }

    /**
     * Gets a cell by row and column index.
     *
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @returns {Element} - Returns cell element in grid content
     */
    public getCellFromIndex(rowIndex: number, columnIndex: number): Element {
        return this.grid.getCellFromIndex(rowIndex, columnIndex);
    }

    /**
     * Gets a Column by column name.
     *
     * @param  {string} field - Specifies the column name.
     * @returns {Column} - Returns tree grid column
     */
    public getColumnByField(field: string): Column {
        return iterateArrayOrObject<Column, Column>(<Column[]>this.columnModel, (item: Column) => {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets a column by UID.
     *
     * @param  {string} uid - Specifies the column UID.
     * @returns {Column} - Returns tree grid column
     */
    public getColumnByUid(uid: string): Column {
        let Columns: Column[] = this.initialRender ? <Column[]>this.grid.columns : <Column[]>this.columns;
        const columnModel: string = 'columnModel';
        if (this.grid.columns.length !== this.columnModel.length) {
            Columns = this.grid[`${columnModel}`];
        }
        return iterateArrayOrObject<Column, Column>(<Column[]>Columns, (item: Column) => {
            if (item.uid === uid) {
                return item;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets the collection of column fields.
     *
     * @returns {string[]} - Returns column field name as collection
     */
    public getColumnFieldNames(): string[] {
        return this.grid.getColumnFieldNames();
    }

    /**
     * Gets the footer div of the TreeGrid.
     *
     * @returns {Element} - Returns footer content div element
     */
    public getFooterContent(): Element {
        return this.grid.getFooterContent();
    }

    /**
     * Gets the footer table element of the TreeGrid.
     *
     * @returns {Element} - Returns footer content table element
     */
    public getFooterContentTable(): Element {
        return this.grid.getFooterContentTable();
    }

    /**
     * Shows a column by its column name.
     *
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @returns {void}
     */
    public showColumns(keys: string | string[], showBy?: string): void {
        this.grid.showColumns(keys, showBy);
        this.updateColumnModel();
    }

    /**
     * Hides a column by column name.
     *
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @returns {void}
     */
    public hideColumns(keys: string | string[], hideBy?: string): void {
        this.grid.hideColumns(keys, hideBy);
        this.updateColumnModel();
    }

    /**
     * Gets a column header by column name.
     *
     * @param  {string} field - Specifies the column name.
     * @returns {Element} - Returns column header element
     */
    public getColumnHeaderByField(field: string): Element {
        return this.grid.getColumnHeaderByField(field);
    }

    /**
     * Gets a column header by column index.
     *
     * @param  {number} index - Specifies the column index.
     * @returns {Element} - Returns column header element
     */
    public getColumnHeaderByIndex(index: number): Element {
        return this.grid.getColumnHeaderByIndex(index);
    }

    /**
     * Gets a column header by UID.
     *
     * @param {string} uid - Specifies the column uid.
     * @returns {Element} - Returns column header element
     */
    public getColumnHeaderByUid(uid: string): Element {
        return this.grid.getColumnHeaderByUid(uid);
    }

    /**
     * Gets a column index by column name.
     *
     * @param  {string} field - Specifies the column name.
     * @returns {number} - Returns column index
     */
    public getColumnIndexByField(field: string): number {
        return this.grid.getColumnIndexByField(field);
    }

    private getVirtualColIndexByUid(uid: string): number {
        const columnModel: string = 'columnModel';
        const index: number = iterateArrayOrObject<number, Column>
        (this.grid[`${columnModel}`], (item: Column, index: number) => {
            if (item.uid === uid) {
                return index;
            }
            return undefined;
        })[0];

        return !isNullOrUndefined(index) ? index : -1;
    }

    /**
     * Gets a column index by UID.
     *
     * @param  {string} uid - Specifies the column UID.
     * @returns {number} - Returns column index
     */
    public getColumnIndexByUid(uid: string): number {
        return this.grid.getColumnIndexByUid(uid);
    }

    /**
     * Gets the columns from the TreeGrid.
     *
     * @param {boolean} isRefresh - Defined whether to update DOM
     * @returns {Column[]} - Returns treegrid columns collection
     */
    public getColumns(isRefresh?: boolean): Column[] {
        this.updateColumnModel(this.grid.getColumns(isRefresh));
        return this.columnModel;
    }

    private updateColumnModel(column?: GridColumn[]): ColumnModel[] {
        let temp: string | Function;
        let field: string;
        const gridColumns: GridColumn[] = isNullOrUndefined(column) ? this.grid.getColumns() : column;
        if (this.treeColumnIndex !== -1 && this.columnModel[this.treeColumnIndex] &&
                    !isNullOrUndefined((this.columnModel[this.treeColumnIndex] as Column).template)) {
            temp = (this.columnModel[this.treeColumnIndex] as Column).template;
            field = (this.columnModel[this.treeColumnIndex] as Column).field;
        }
        let gridColumn: ColumnModel;
        if (!this.enableColumnVirtualization || (this.enableColumnVirtualization && this.columnModel.length === gridColumns.length)) {
            this.columnModel = [];
            for (let i: number = 0; i < gridColumns.length; i++) {
                gridColumn = {};
                for (const prop of Object.keys(gridColumns[parseInt(i.toString(), 10)])) {
                    gridColumn[`${prop}`] = gridColumns[parseInt(i.toString(), 10)][`${prop}`];
                }
                this.columnModel.push(new Column(gridColumn));
                if (field === this.columnModel[parseInt(i.toString(), 10)].field && this.columnModel[parseInt(i.toString(), 10)].type !== 'checkbox' && (!isNullOrUndefined(temp) && temp !== '')) {
                    this.columnModel[parseInt(i.toString(), 10)].template = temp;
                }
            }
        }
        const deepMerge: string = 'deepMerge';
        this[`${deepMerge}`] = ['columns']; // Workaround for blazor updateModel
        if (this.grid.columns.length !== this.columnModel.length) {
            this.stackedHeader = true;
        }
        if (this.stackedHeader && !isNullOrUndefined(this.detailTemplate)) {
            const error: string = 'Stacked header is not compatible with the detail template';
            this.trigger(events.actionFailure, { error: error });
        }
        if (this.stackedHeader && this.allowResizing && !isNullOrUndefined(this.columns)) {
            this.updateColumnsWidth(this.columns);
        }
        if (!this.stackedHeader && !isNullOrUndefined(this.columns)) {
            merge(this.columns, this.columnModel);
        }
        this[`${deepMerge}`] = undefined;  // Workaround for blazor updateModel
        return this.columnModel;
    }

    private updateColumnsWidth(columns: Column[] | string[] | ColumnModel[]): void {
        (columns as ColumnModel[]).forEach((column: ColumnModel) => {
            if (!isNullOrUndefined(column as ColumnModel) && (column as ColumnModel).columns) {
                this.updateColumnsWidth((column as ColumnModel).columns);
            } else if (!isNullOrUndefined(column as ColumnModel) && (column as ColumnModel).field) {
                const currentColumn: GridColumn = this.grid.getColumnByField((column as ColumnModel).field);
                if (!isNullOrUndefined(currentColumn)){
                    (column as ColumnModel).width = currentColumn.width;
                }
            }
        });
    }

    /**
     * Gets the content div of the TreeGrid.
     *
     * @returns {Element} - Return tree grid content element
     */
    public getContent(): Element {
        return this.grid.getContent();
    }
    private mergePersistTreeGridData(): void {
        const persist1: string = 'mergePersistGridData';
        this.grid[`${persist1}`].apply(this);
    }
    private mergeColumns(storedColumn: Column[], columns: Column[]): void {
        const persist2: string = 'mergeColumns';
        this.grid[`${persist2}`].apply(this, [storedColumn, columns]);
    }
    private setFrozenCount(): void {
        const persist3: string = 'setFrozenCount';
        this.grid[`${persist3}`].apply(this.grid);
    }
    private splitFrozenCount(columns: Column[]): void {
        const persist4: string = 'splitFrozenCount';
        this.grid[`${persist4}`].apply(this.grid, [columns]);
    }
    private isFrozenGrid(): boolean {
        return this.grid.isFrozenGrid();
    }

    private updateTreeGridModel() : void {
        this.setProperties({ filterSettings: getObject('properties', this.grid.filterSettings) }, true);
        this.setProperties({ pageSettings: getObject('properties', this.grid.pageSettings) }, true);
        this.setProperties({ searchSettings: getObject('properties', this.grid.searchSettings) }, true);
        this.setProperties({ sortSettings: getObject('properties', this.grid.sortSettings) }, true);
    }

    /**
     * Gets the content table of the TreeGrid.
     *
     * @returns {Element} - Returns content table element
     */
    public getContentTable(): Element {
        return this.grid.getContentTable();
    }

    /**
     * Gets all the TreeGrid's data rows.
     *
     * @returns {Element[]} - Returns row elements
     */
    public getDataRows(): Element[] {
        const dRows: Element[] = []; const rows: Element[] = this.grid.getDataRows();
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if (!rows[parseInt(i.toString(), 10)].classList.contains('e-summaryrow')) {
                dRows.push(rows[parseInt(i.toString(), 10)] as Element);
            }
        }
        return dRows;
    }

    /**
     * Get current visible data of TreeGrid.
     *
     * @returns {Object[]} - Returns current view records
     * @isGenericType true
     */
    public getCurrentViewRecords(): Object[] {
        const isSummaryRow: string = 'isSummaryRow';
        return this.grid.currentViewData.filter((e: Object) => isNullOrUndefined(e[`${isSummaryRow}`]));
    }
    /**
     * Gets the added, edited,and deleted data before bulk save to the DataSource in batch mode.
     *
     * @returns {Object} - Returns batch changes
     */
    public getBatchChanges(): Object {
        return this.grid.editModule.getBatchChanges();
    }


    /**
     * Gets the header div of the TreeGrid.
     *
     * @returns {Element} - Returns Header content element
     */
    public getHeaderContent(): Element {
        return this.grid.getHeaderContent();
    }

    /**
     * Gets the header table element of the TreeGrid.
     *
     * @returns {Element} - Return header table element
     */
    public getHeaderTable(): Element {
        return this.grid.getHeaderTable();
    }

    /**
     * Gets a row by index.
     *
     * @param  {number} index - Specifies the row index.
     * @returns {Element} - Returns row element
     */
    public getRowByIndex(index: number): Element {
        return this.grid.getRowByIndex(index);
    }

    /**
     * Get a row information based on cell
     *
     * @param {Element | EventTarget} target - Target row element
     * @returns {RowInfo} - Returns row information in a JSON object
     */
    public getRowInfo(target: Element | EventTarget): RowInfo {
        return this.grid.getRowInfo(target);
    }

    /**
     * Gets UID by column name.
     *
     * @param  {string} field - Specifies the column name.
     * @returns {string} - Returns unique id based on column field name given
     */
    public getUidByColumnField(field: string): string {
        return this.grid.getUidByColumnField(field);
    }

    /**
     * Gets the visible columns from the TreeGrid.
     *
     * @returns {Column[]} - Returns visible columns collection
     */
    public getVisibleColumns(): Column[] {
        const cols: Column[] = [];
        for (const col of this.columnModel) {
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    }

    /**
     * By default, TreeGrid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     *
     * @returns {void}
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }
    /**
     * Manually shown spinner needs to hide by `hideSpinnner`.
     *
     * @returns {void}
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }
    /**
     * Refreshes the TreeGrid header and content.
     *
     * @returns {void}
     */
    public refresh(): void {
        this.uniqueIDCollection = {};
        this.convertTreeData(this.dataSource);
        if (!isCountRequired(this)) {
            if (!(this.dataSource instanceof DataManager)) {
                this.grid.dataSource = this.flatData;
            } else {
                this.grid.setProperties({
                    dataSource: new DataManager(this.dataSource.dataSource,
                                                this.dataSource.defaultQuery, this.dataSource.adaptor)
                }, true);
            }
        }
        this.grid.refresh();
    }

    /**
     * Get the records of checked rows.
     *
     * @returns {Object[]} - Returns records that has been checked
     * @isGenericType true
     */
    public getCheckedRecords(): Object[] {
        return this.selectionModule.getCheckedrecords();
    }
    /**
     * Get the visible records corresponding to rows visually displayed.
     *
     * @returns {Object[]} - Returns visible records based on collapse state of rows
     * @isGenericType true
     */
    public getVisibleRecords(): Object[] {
        let visibleRecords: ITreeData[] = []; const currentViewRecords: ITreeData[] = this.getCurrentViewRecords();
        if (!this.allowPaging) {
            for (let i: number = 0; i < currentViewRecords.length; i++) {
                visibleRecords.push(currentViewRecords[parseInt(i.toString(), 10)]);
                if (!currentViewRecords[parseInt(i.toString(), 10)].expanded) {
                    i += findChildrenRecords(currentViewRecords[parseInt(i.toString(), 10)]).length;
                }
            }
        } else {
            visibleRecords = currentViewRecords;
        }
        return visibleRecords;
    }
    /**
     * Get the indexes of checked rows.
     *
     * @returns {number[]} - Returns checked row indexes
     */
    public getCheckedRowIndexes(): number[] {
        return this.selectionModule.getCheckedRowIndexes();
    }

    /**
     * Checked the checkboxes using rowIndexes.
     *
     * @param {number[]} indexes - row indexes
     * @returns {void}
     */
    public selectCheckboxes(indexes: number[]): void {
        this.selectionModule.selectCheckboxes(indexes);
    }


    /**
     * Refreshes the TreeGrid column changes.
     *
     * @param {boolean} refreshUI - Defined whether to refresh the DOM
     * @returns {void}
     */
    public refreshColumns(refreshUI?: boolean): void {
        if (isNullOrUndefined(refreshUI) || refreshUI) {
            this.grid.columns = this.getGridColumns(this.columns as Column[]);
            this.grid.refreshColumns();
        } else {
            this.grid.setProperties({columns : this.getGridColumns(this.columns as Column[])}, true);
        }
    }

    /**
     * Refreshes the TreeGrid header.
     *
     * @returns {void}
     */
    public refreshHeader(): void {
        this.grid.refreshHeader();
    }

    /**
     * Expands or collapse child records
     *
     * @param {HTMLElement} target - Expand collapse icon cell as target element
     * @returns {void}
     * @hidden
     */
    private expandCollapseRequest(target: HTMLElement): void {
        if (this.editSettings.mode === 'Batch') {
            const obj: string = 'dialogObj'; const showDialog: string = 'showDialog';
            if ((this.getBatchChanges()[this.changedRecords].length || this.getBatchChanges()[this.deletedRecords].length ||
            this.getBatchChanges()[this.addedRecords].length) && this.editSettings.showConfirmDialog) {
                const dialogObj: Dialog = this.grid.editModule[`${obj}`];
                this.grid.editModule[`${showDialog}`]('CancelEdit', dialogObj);
                this.targetElement = target;
                return;
            }
        }
        if (this.rowTemplate) {
            const rowInfo: HTMLElement = target.closest('.e-treerowcell').parentElement;
            const record: Object = this.getCurrentViewRecords()[(<HTMLTableRowElement>rowInfo).rowIndex];
            if (target.classList.contains('e-treegridexpand')) {
                this.collapseRow(<HTMLTableRowElement>rowInfo, record);
            } else {
                this.expandRow(<HTMLTableRowElement>rowInfo, record);
            }
        }else {
            const rowInfo: RowInfo = this.grid.getRowInfo(target);
            let record: ITreeData = <ITreeData>rowInfo.rowData;
            if (this.grid.isFrozenGrid() && this.enableVirtualization && !Object.keys(record).length) {
                const freezeRows: string = 'freezeRows';
                record = this.grid.contentModule[`${freezeRows}`].filter((e: Row<{}> ) => e.uid === rowInfo.row.getAttribute('data-uid'))[0].data;
            }
            if (this.enableImmutableMode) {
                record = this.getCurrentViewRecords()[(<HTMLTableRowElement>rowInfo).rowIndex];
            }
            if (target.classList.contains('e-treegridexpand')) {
                this.collapseRow(<HTMLTableRowElement>rowInfo.row, record);
            }else {
                this.expandRow(<HTMLTableRowElement>rowInfo.row, record);
            }
        }
    }
    /**
     * Expands child rows
     *
     * @param {HTMLTableRowElement} row - Expands the given row
     * @param {Object} record - Expands the given record
     * @param {Object} key - Primary key value
     * @param {number} level - Specifies the hierarchical level of the record
     * @returns {void}
     */
    public expandRow(row: HTMLTableRowElement, record?: Object, key?: Object, level?: number): void {
        this.isCollapseAll = false;
        let parentRec: object[] = this.parentData;
        if (!this.enableVirtualization) {
            parentRec = this.flatData.filter((e: ITreeData) => {
                return e.hasChildRecords;
            });
        }
        record = this.getCollapseExpandRecords(row, record);
        if (!isNullOrUndefined(row) && row.cells[0].classList.contains('e-lastrowcell')) {
            this.lastRowBorder(row, false);
        }
        if (this.isExpandAll && !isRemoteData(this)) {
            const args: RowExpandingEventArgs = { data: parentRec, row: row, cancel: false };
            let pagerValuePresent: boolean = false;
            if (this.grid.pagerModule && !isNullOrUndefined(this.grid.pagerModule.pagerObj.pagerdropdownModule)) {
                pagerValuePresent = this.grid.pagerModule.pagerObj.pagerdropdownModule['dropDownListObject'].value ? true : false;
            }
            if (!this.isExpandingEventTriggered) {
                this.trigger(events.expanding, args, (expandingArgs: RowExpandingEventArgs) => {
                    this.expandAllPrevent = expandingArgs.cancel;
                    if (!expandingArgs.cancel && !isNullOrUndefined(record)) {
                        if (expandingArgs.expandAll) {
                            this.expandCollapseAllChildren(record, 'expand', key, level);
                        }
                        this.expandRows(row, record, parentRec);
                    }
                });
            }
            else if ((!this.allowPaging || (pagerValuePresent && this.grid.pagerModule.pagerObj.pagerdropdownModule['dropDownListObject'].value === 'All')) &&
                !this.expandAllPrevent && this.isExpandingEventTriggered) {
                this.expandRows(row, record, parentRec);
            }
            this.isExpandingEventTriggered = true;
        }
        else if (!this.isExpandAll || (this.isExpandAll && isRemoteData(this))) {
            const args: RowExpandingEventArgs = { data: record, row: row, cancel: false };
            this.trigger(events.expanding, args, (expandingArgs: RowExpandingEventArgs) => {
                if (!expandingArgs.cancel) {
                    if (expandingArgs.expandAll) {
                        this.expandCollapseAllChildren(record, 'expand', key, level);
                    }
                    this.expandRows(row, record, parentRec);
                }
            });
        }
    }

    // Internal method to handle the rows expand
    private expandRows(row: HTMLTableRowElement, record: Object, parentRec: Object): void {
        this.expandCollapse('expand', row, record);
        const children: string = 'Children';
        if (!(isRemoteData(this) && !isOffline(this)) && (!isCountRequired(this) || !isNullOrUndefined(record[`${children}`]))) {
            let expandArgs: RowExpandedEventArgs = { data: record, row: row };
            if (!isNullOrUndefined(this.expandStateMapping)) {
                this.updateExpandStateMapping(expandArgs.data, true);
            }
            if (this.isExpandAll && !this.isExpandedEventTriggered) {
                this.isExpandedEventTriggered = true;
                expandArgs = { data: parentRec, row: row };
                this.trigger(events.expanded, expandArgs);
            }
            else if (!this.isExpandAll && this.enableVirtualization && this.selectionSettings.persistSelection
                && !isNullOrUndefined((this as any).virtualScrollModule.prevSelectedRecord)) {
                (this as any).virtualScrollModule.prevSelectedRecord = [];
            }
            else if (!this.isExpandAll) {
                this.trigger(events.expanded, expandArgs);
            }
        }
    }

    private expandCollapseAllChildren(record: object, action: string, key: Object, level?: number): void {
        if ((!isNullOrUndefined(key) && record[this.getPrimaryKeyFieldNames()[0]] !== key) ||
            (!isNullOrUndefined(level) && level !== (record as ITreeData).level)){
            return;
        }
        const records: object[] = findChildrenRecords(record).filter((e: ITreeData) => {
            return e.hasChildRecords;
        });
        records.unshift(record);
        for (let i: number = 0; i < records.length; i++) {
            this.expandCollapse(action, null, records[parseInt(i.toString(), 10)]);
        }
    }

    private getCollapseExpandRecords(row?: HTMLTableRowElement, record?: Object): Object {
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All' && this.isExpandAll && isNullOrUndefined(record) &&
      !isRemoteData(this)) {
            record = this.flatData.filter((e: ITreeData) => {
                return e.hasChildRecords;
            });
        } else if (isNullOrUndefined(record)) {
            if (this.detailTemplate) {
                record = <ITreeData>this.grid.getCurrentViewRecords()[row.getAttribute('data-rowindex')];
            } else {
                if (this.enableVirtualization && (this.isCollapseAll || this.isExpandAll) ) {
                    if (row.rowIndex === -1) {
                        record = <ITreeData>this.grid.getCurrentViewRecords()[parseInt(row.getAttribute('data-rowindex'), 10)];
                    }
                    else {
                        record = <ITreeData>this.grid.getCurrentViewRecords()[row.rowIndex];
                    }
                }
                else if (this.rowTemplate) {
                    record = <ITreeData>this.grid.getCurrentViewRecords()[row.rowIndex];
                }
                else {
                    record = <ITreeData>this.grid.getCurrentViewRecords()[parseInt(row.getAttribute('data-rowindex'), 10)];
                }
            }
        }
        return record;
    }
    /**
     * Collapses child rows
     *
     * @param {HTMLTableRowElement} row - Collapse the given row
     * @param {Object} record - Collapse the given record
     * @param {Object} key - Primary key value
     * @returns {void}
     */
    public collapseRow(row: HTMLTableRowElement, record?: Object, key?: Object): void {
        this.isExpandAll = false;
        let parentRec: object[] = this.parentData;
        if (!this.enableVirtualization) {
            parentRec = this.flatData.filter((e: ITreeData) => {
                return e.hasChildRecords;
            });
        }
        record = this.getCollapseExpandRecords(row, record);
        if (this.isCollapseAll && !isRemoteData(this)) {
            const args: RowCollapsingEventArgs = { data: parentRec, row: row, cancel: false };
            if (!this.isCollapsingEventTriggered) {
                this.trigger(events.collapsing, args, (collapsingArgs: RowCollapsingEventArgs) => {
                    this.collapseAllPrevent = collapsingArgs.cancel;
                    if (!collapsingArgs.cancel) {
                        if (collapsingArgs.collapseAll) {
                            this.expandCollapseAllChildren(record, 'collapse', key);
                        }
                        this.collapseRows(row, record, parentRec);
                    }
                });
            }
            else if (!this.allowPaging && !this.collapseAllPrevent && this.isCollapsingEventTriggered) {
                this.collapseRows(row, record, parentRec);
            }
            this.isCollapsingEventTriggered = true;
        }
        else if (!this.isCollapseAll || (this.isCollapseAll && isRemoteData(this))) {
            const args: RowCollapsingEventArgs = { data: record, row: row, cancel: false };
            this.trigger(events.collapsing, args, (collapsingArgs: RowCollapsingEventArgs) => {
                if (!collapsingArgs.cancel && !isNullOrUndefined(record)) {
                    this.collapseRows(row, record, parentRec);
                }
            });
        }
    }

    // Internal method for handling the rows collapse
    private collapseRows(row: HTMLTableRowElement, record: Object, parentRec: Object): void {
        this.expandCollapse('collapse', row, record);
        let collapseArgs: RowCollapsedEventArgs = { data: record, row: row };
        if (!isRemoteData(this)) {
            if (!isNullOrUndefined(this.expandStateMapping)) {
                this.updateExpandStateMapping(collapseArgs.data, false);
            }
            if (this.isCollapseAll && !this.isCollapsedEventTriggered) {
                this.isCollapsedEventTriggered = true;
                collapseArgs = { data: parentRec, row: row };
                this.trigger(events.collapsed, collapseArgs);
            }
            else if (!this.isCollapseAll) {
                this.trigger(events.collapsed, collapseArgs);
            }
            if (this.enableInfiniteScrolling) {
                const scrollHeight: number = this.grid.getContent().firstElementChild.scrollHeight;
                const scrollTop: number = this.grid.getContent().firstElementChild.scrollTop;
                if ((scrollHeight - scrollTop) < this.grid.getRowHeight() + +this.height) {
                    this.grid.getContent().firstElementChild.scrollBy(0, this.grid.getRowHeight());
                }
            }
        }
    }

    private updateExpandStateMapping(record: ITreeData, state: boolean): void {
        const totalRecords: object[] = record as object[];
        if (totalRecords.length) {
            for (let i: number = 0; i < totalRecords.length; i++) {
                totalRecords[parseInt(i.toString(), 10)][this.expandStateMapping] = state;
                editAction({ value: (totalRecords[parseInt(i.toString(), 10)] as ITreeData), action: 'edit' }, this,
                           this.isSelfReference, (totalRecords[parseInt(i.toString(), 10)] as ITreeData).index,
                           this.grid.selectedRowIndex, this.expandStateMapping);
            }
        } else {
            record[`${this.expandStateMapping}`] = state;
            editAction({ value: record, action: 'edit' }, this,
                       this.isSelfReference, record.index, this.grid.selectedRowIndex, this.expandStateMapping);
        }
    }

    /**
     * Expands the records at specific hierarchical level
     *
     * @param {number} level - Expands the parent rows at given level
     * @returns {void}
     */
    public expandAtLevel(level: number): void {
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            const rec: ITreeData[] =  (<ITreeData[]>this.grid.dataSource).filter((e: ITreeData) => {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = true;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.expandAction(rec, null, level, true);
        } else {
            const rec: Object = this.getRecordDetails(level);
            const record: HTMLTableRowElement[] = getObject('records', rec);
            this.expandAction(record, null, level);
        }
    }

    /**
     * Expands the records by given primary key value
     *
     * @param {Object} key - Expands the parent rows with given primary key value
     * @returns {void}
     */
    public expandByKey(key: Object): void {
        this.expandCollapseActionByKey(key, 'Expand');
    }

    private expandAction(record: Object[], key?: Object, level?: number, isPaging: boolean = false): void {
        for (let i: number = 0; i < record.length; i++) {
            if (!isNullOrUndefined((record[parseInt(i.toString(), 10)] as ITreeData).parentItem )) {
                const puniqueID: string = (record[parseInt(i.toString(), 10)] as ITreeData).parentItem.uniqueID;
                let parentItem: Object = this.flatData.filter((e: ITreeData) => {
                    return e.uniqueID === puniqueID;
                });
                if (isRemoteData(this)) {
                    parentItem = this.getCurrentViewRecords().filter((e: ITreeData) => {
                        return e.uniqueID === puniqueID;
                    });
                }
                if ((parentItem[0] as ITreeData).expanded === false) {
                    record.push((parentItem[0] as HTMLTableRowElement));
                    (parentItem[0] as ITreeData).expanded = true;
                } else {
                    if (!getExpandStatus(this, parentItem[0], this.parentData)) {
                        if ((parentItem[0] as ITreeData).expanded && (parentItem[0] as ITreeData).parentItem !== undefined) {
                            record.push((parentItem[0] as HTMLTableRowElement));
                        }
                    }
                }
            }
            if (!isPaging) {
                this.expandRow(null, record[parseInt(i.toString(), 10)], key, level);
            }
        }
        if (isPaging) {
            this.expandRow(null, record, key, level);
        }
    }

    private getRecordDetails(level: number) : Object {
        const rows: HTMLTableRowElement[] = this.getRows().filter((e: HTMLTableRowElement) => {
            return (e.className.indexOf('level' + level) !== -1
        && (e.querySelector('.e-treegridcollapse') || e.querySelector('.e-treegridexpand')));
        } );
        const records: ITreeData[] = this.getCurrentViewRecords().filter((e: ITreeData) => {
            return e.level === level && e.hasChildRecords;
        });
        const obj: Object = { records: records, rows: rows };
        return obj;
    }
    /**
     * Collapses the records at specific hierarchical level
     *
     * @param {number} level - Define the parent row level which needs to be collapsed
     * @returns {void}
     */
    public collapseAtLevel(level: number): void {
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            const record: ITreeData[] = (<ITreeData[]>this.grid.dataSource).filter((e: ITreeData) => {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = false;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.collapseAction(record, null, true);
        } else {
            const rec: Object = this.getRecordDetails(level);
            const records: HTMLTableRowElement[] = getObject('records', rec);
            this.collapseAction(records);
        }
    }

    /**
     * Collapses the records by given primary key value
     *
     * @param {Object} key - Collapses the parent rows with given primary key value
     * @returns {void}
     */
    public collapseByKey(key: Object): void {
        this.expandCollapseActionByKey(key, 'Collapse');
    }

    private expandCollapseActionByKey(key: Object, action: string): void {
        const primaryKeyField: string = this.getPrimaryKeyFieldNames()[0];
        const dataSource: Object = isRemoteData(this) ? this.getCurrentViewRecords() : this.grid.dataSource;
        if (!isNullOrUndefined(primaryKeyField)) {
            const rec: ITreeData[] = (<ITreeData[]>dataSource).filter((e: ITreeData) => {
                return e[`${primaryKeyField}`].toString() === key.toString();
            });
            if (action === 'Expand') {
                this.expandAction(rec, key, null);
            } else {
                this.collapseAction(rec, key);
            }
        }
    }
    private collapseAction(record: Object[], key?: Object, isPaging: boolean = false): void{
        if (isPaging) {
            this.collapseRow(null, record);
        } else {
            for (let i: number = 0  ; i < record.length; i++) {
                this.collapseRow(null, record[parseInt(i.toString(), 10)], key);
            }
        }
        if (!(this.grid.contentModule as VirtualTreeContentRenderer).isDataSourceChanged && this.enableVirtualization && this.getRows()
        && this.parentData.length === this.getRows().length) {
            const endIndex : string | number = 'endIndex';
            (this.grid.contentModule as VirtualTreeContentRenderer).startIndex = -1;
            (this.grid.contentModule as VirtualTreeContentRenderer)[`${endIndex}`] = -1;
        }
    }

    /**
     * Expands All the rows
     *
     * @returns {void}
     */
    public expandAll(): void {
        if (this.getCurrentViewRecords().length === 0) {
            const error: string = 'The provided value for the datasource is undefined. Please ensure to add the dataSource.';
            this.trigger(events.actionFailure, { error: error });
        }
        this.isExpandedEventTriggered = false;
        this.isExpandingEventTriggered = false;
        this.expandCollapseAll('expand');
    }
    /**
     * Collapses All the rows
     *
     * @returns {void}
     */
    public collapseAll(): void {
        if (this.getCurrentViewRecords().length === 0) {
            const error: string = 'The provided value for the datasource is undefined. Please ensure to add the dataSource.';
            this.trigger(events.actionFailure, { error: error });
        }
        this.isCollapsedEventTriggered = false;
        this.isCollapsingEventTriggered = false;
        this.expandCollapseAll('collapse');
    }
    private expandCollapseAll(action: string): void {
        let rows: HTMLTableRowElement[];
        if (this.rowTemplate) {
            rows = [].slice.call(this.grid.getContentTable().querySelectorAll('tr')).filter((e: HTMLTableRowElement) => {
                return e.querySelector('.e-treegrid' + (action === 'expand' ? 'collapse' : 'expand'));
            });
        } else {
            rows = this.getRows().filter((e: HTMLTableRowElement) => {
                return e.querySelector('.e-treegrid' + (action === 'expand' ? 'collapse' : 'expand'));
            });
        }
        if (!rows.length && this.getRows().length) {
            rows.push(this.getRows()[0]);
        }
        this.isExpandAll = true;
        this.isCollapseAll = true;
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization || this.enableInfiniteScrolling) && !isRemoteData(this)) {
            this.flatData.filter((e: ITreeData) => {
                if (e.hasChildRecords) {
                    e.expanded = action === 'collapse' ? false : true;
                }
            });
            if (rows.length) {
                for (let i: number = 0; i < rows.length; i++) {
                    if (action === 'collapse') {
                        if (!isNullOrUndefined(this.getCurrentViewRecords()[rows[parseInt(i.toString(), 10)].rowIndex])) {
                            this.collapseRow(rows[parseInt(i.toString(), 10)]);
                        }
                    }
                    else {
                        if (!this.enableVirtualization) {
                            this.expandRow(rows[parseInt(i.toString(), 10)]);
                        }
                        else if (rows[0].getAttribute('aria-expanded') !== 'true') {
                            this.expandRow(rows[0]);
                        }
                    }
                }
            } else if (this.allowPaging) {
                const isExpandCollapseall : boolean = this.enableCollapseAll;
                this.setProperties({enableCollapseAll: true }, true);
                this.grid.pagerModule.goToPage(1);
                this.setProperties({enableCollapseAll: isExpandCollapseall }, true);
            }
        } else {
            for (let i: number = 0; i < rows.length; i++) {
                if (action === 'collapse') {
                    this.collapseRow(rows[parseInt(i.toString(), 10)]);
                } else {
                    this.expandRow(rows[parseInt(i.toString(), 10)]);
                }
            }
        }
        this.isExpandAll = false;
        this.isCollapseAll = false;
    }
    private expandCollapse(action: string, row: HTMLTableRowElement, record?: ITreeData, isChild?: boolean): void {
        const expandingArgs: DataStateChangeEventArgs = { row: row, data: record, childData: [], requestType: action };
        const childRecords: ITreeData[] = this.grid.currentViewData.filter((e: ITreeData) => {
            return e.parentUniqueID === record.uniqueID ;
        });
        let targetEle: Element;
        if ((!isRemoteData(this) && action === 'expand' && this.isSelfReference && isCountRequired(this) && !childRecords.length) || (action === 'collapse' || (this.isExpandAll && !this.loadChildOnDemand) && !isRemoteData(this) && this.isSelfReference && isCountRequired(this))) {
            this.updateChildOnDemand(expandingArgs);
        }
        let gridRows: HTMLTableRowElement[] = this.getRows();
        if (this.rowTemplate) {
            const rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
            gridRows = [].slice.call(rows);
        }
        let rowIndex: number;
        if (isNullOrUndefined(row)) {
            rowIndex = this.grid.currentViewData.indexOf(record);
            row = gridRows[parseInt(rowIndex.toString(), 10)];
        } else {
            rowIndex = +row.getAttribute('data-rowindex');
        }
        if (!isNullOrUndefined(row)) {
            row.setAttribute('aria-expanded', action === 'expand' ? 'true' : 'false');
        }
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)
            && !isCountRequired(this)) {
            this.notify(events.localPagedExpandCollapse, {action: action, row: row, record: record});
        } else {
            let displayAction: string;
            if (action === 'expand') {
                displayAction = 'table-row';
                if (!isChild) {
                    record.expanded = true;
                    this.uniqueIDCollection[record.uniqueID].expanded = record.expanded;
                }
                if (!isNullOrUndefined(row)) {
                    targetEle = row.getElementsByClassName('e-treegridcollapse')[0];
                }
                if (isChild && !isNullOrUndefined(record[this.expandStateMapping]) &&
            record[this.expandStateMapping] && isNullOrUndefined(targetEle)) {
                    targetEle = row.getElementsByClassName('e-treegridexpand')[0];
                }
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                if (!targetEle.classList.contains('e-treegridexpand')) {
                    addClass([targetEle], 'e-treegridexpand');
                }
                removeClass([targetEle], 'e-treegridcollapse');
            } else {
                displayAction = 'none';
                if (!isChild || isCountRequired(this)) {
                    record.expanded = false;
                    this.uniqueIDCollection[record.uniqueID].expanded = record.expanded;
                }
                if (!isNullOrUndefined(row)) {
                    targetEle = row.getElementsByClassName('e-treegridexpand')[0];
                }
                if (isChild && !isNullOrUndefined(record[this.expandStateMapping]) &&
              !record[this.expandStateMapping] && isNullOrUndefined(targetEle)) {
                    targetEle = row.getElementsByClassName('e-treegridcollapse')[0];
                }
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                if (!targetEle.classList.contains('e-treegridcollapse')) {
                    addClass([targetEle], 'e-treegridcollapse');
                }
                removeClass([targetEle], 'e-treegridexpand');
            }
            row.querySelectorAll('.e-treerowcell')[0].setAttribute('aria-expanded', action === 'expand' ? 'true' : 'false');
            const detailrows: HTMLTableRowElement[] = gridRows.filter(
                (r: HTMLTableRowElement) =>
                    r.classList.contains(
                        'e-griddetailrowindex' + record.index + 'level' + (record.level + 1)
                    )
            );
            if (isRemoteData(this) && !isOffline(this)) {
                this.remoteExpand(action, row, record);
            } else {
                if ((!isCountRequired(this) || childRecords.length) || action === 'collapse') {
                    this.localExpand(action, row, record);
                }
                const lastrowIdx: number = this.getVisibleRecords()[this.getVisibleRecords().length - 1]['index'];
                const lastRow: Element = this.getRowByIndex(lastrowIdx);
                if (this.grid.getContentTable().clientHeight <= this.grid.getContent().clientHeight && !isNullOrUndefined(lastRow as HTMLTableRowElement) && !(lastRow as HTMLTableRowElement).cells[0].classList.contains('e-lastrowcell')) {
                    this.lastRowBorder(lastRow as HTMLTableRowElement, true);
                }
            }
            if (isCountRequired(this) && action === 'expand') {
                const currentData: Object[] = this.getCurrentViewRecords();
                const visibleRecords: Object[] = currentData.filter((e: ITreeData) => {
                    return getExpandStatus(this, e, this.parentData);
                });
                this.dataResults.result = visibleRecords as ReturnOption;
            }
            if (!isNullOrUndefined(targetEle) && targetEle.closest('.e-treerowcell').classList.contains('e-cellselectionbackground')) {
                targetEle.closest('.e-treerowcell').classList.remove('e-cellselectionbackground');
                targetEle.closest('.e-treerowcell').removeAttribute('aria-selected');
            }
            if (this.isPixelHeight() && !row.cells[0].classList.contains('e-lastrowcell') ) {
                let totalRows: HTMLTableRowElement[] = this.getRows();
                const rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
                totalRows = [].slice.call(rows);
                for (let i: number = totalRows.length - 1; i >= 0; i--) {
                    if (!isHidden(totalRows[parseInt(i.toString(), 10)])) {
                        const table: Element = this.getContentTable();
                        const sHeight: number = table.scrollHeight;
                        const clientHeight: number = this.getContent().clientHeight;
                        this.lastRowBorder(totalRows[parseInt(i.toString(), 10)], sHeight <= clientHeight);
                        break;
                    }
                }
            }
            this.notify('rowExpandCollapse', { detailrows: detailrows, action: displayAction, record: record, row: row });
            this.updateAltRow(gridRows);
        }
    }
    private updateChildOnDemand(expandingArgs: DataStateChangeEventArgs) : void {
        if (expandingArgs.requestType === 'collapse' && isCountRequired(this)) {
            const flatDataRecords: Object[] = [...this.flatData];
            for (let i: number = 0; i < flatDataRecords.length; i++) {
                if (flatDataRecords[parseInt(i.toString(), 10)]['parentUniqueID'] === expandingArgs.data['uniqueID']) {
                    flatDataRecords.splice(i, 1);
                    i = i - 1;
                }
            }
            this.dataResults.result = flatDataRecords as ReturnOption;
            return;
        }
        const deff: Deferred = new Deferred();
        const childDataBind: string = 'childDataBind';
        expandingArgs[`${childDataBind}`] = deff.resolve;
        const record: ITreeData = expandingArgs.data;
        this.trigger(events.dataStateChange, expandingArgs);
        deff.promise.then(() => {
            if (expandingArgs.childData.length) {
                if (isCountRequired(this)) {
                    this.flatData = this.dataResults.result as object[];
                }
                if (this.enableInfiniteScrolling && isCountRequired(this)) {
                    this.flatData = this.infiniteScrollData;
                }
                const currentData: ITreeData[] = <ITreeData[]>(this.flatData);
                let index: number = 0;
                for (let i: number = 0; i < currentData.length; i++ ) {
                    if (currentData[parseInt(i.toString(), 10)].taskData === record.taskData) {
                        index = i;
                        break;
                    }
                }
                const data: Object = getValue('result', this.dataSource);
                const childData: ITreeData[] = extendArray(expandingArgs.childData);
                const length: number = record[this.childMapping] ? record[this.childMapping].length > childData.length ?
                    record[this.childMapping].length : childData.length : childData.length;
                for (let i: number = 0; i < length; i++) {
                    if (record[this.childMapping]) {
                        (data as Object[]).filter((e: ITreeData, i: number) => {
                            if (e[this.parentIdMapping] === record[this.idMapping]) {
                                (data as Object[]).splice(i, 1);
                            }
                        });
                    }
                    if (childData[parseInt(i.toString(), 10)]) {
                        childData[parseInt(i.toString(), 10)].level = record.level + 1;
                        childData[parseInt(i.toString(), 10)].index = Math.ceil(Math.random() * 1000);
                        childData[parseInt(i.toString(), 10)].parentItem = extend({}, record);
                        childData[parseInt(i.toString(), 10)].taskData = extend({}, childData[parseInt(i.toString(), 10)]);
                        delete childData[parseInt(i.toString(), 10)].parentItem.childRecords;
                        delete childData[parseInt(i.toString(), 10)].taskData.parentItem;
                        childData[parseInt(i.toString(), 10)].parentUniqueID = record.uniqueID;
                        childData[parseInt(i.toString(), 10)].uniqueID = getUid(this.element.id + '_data_');
                        setValue('uniqueIDCollection.' + childData[parseInt(i.toString(), 10)].uniqueID, childData[parseInt(i.toString(), 10)], this);
                        if (!isNullOrUndefined(childData[parseInt(i.toString(), 10)][this.childMapping]) ||
              (childData[parseInt(i.toString(), 10)][this.hasChildMapping] && isCountRequired(this))) {
                            childData[parseInt(i.toString(), 10)].hasChildRecords = true;
                        }
                        if (isCountRequired(this) && record[this.childMapping] && record[this.childMapping][parseInt(i.toString(), 10)]) {
                            currentData.splice(index + 1 + i, 0, childData[parseInt(i.toString(), 10)]);
                        }
                        else {
                            currentData.splice(index + 1 + i, record[this.childMapping] &&
                                record[this.childMapping][parseInt(i.toString(), 10)] ? 1 : 0, childData[parseInt(i.toString(), 10)]);
                        }
                    } else {
                        currentData.splice(index + 1 + i, 1);
                    }
                }
                currentData[parseInt(index.toString(), 10)][`${this.childMapping}`] = childData;
                currentData[parseInt(index.toString(), 10)].childRecords = childData;
                currentData[parseInt(index.toString(), 10)].expanded = true;
                setValue('uniqueIDCollection.' + currentData[parseInt(index.toString(), 10)].uniqueID, currentData[parseInt(index.toString(), 10)], this);
                for (let j: number = 0; j < expandingArgs.childData.length; j++) {
                    (data as Object[]).push(expandingArgs.childData[parseInt(j.toString(), 10)]);
                }
            }
            if (isCountRequired(this) && !this.loadChildOnDemand && expandingArgs.requestType === 'expand') {
                this.dataResults['expandRecord'] = {};
                this.dataResults['expandRecord'] = expandingArgs.data;
            }
            this.isExpandRefresh = true;
            const scrollHeightBeforeRefresh: number = this.getContentTable().parentElement.scrollTop;
            this.grid.refresh();
            if (this.enableInfiniteScrolling) {
                this.getContentTable().parentElement.scrollTop = scrollHeightBeforeRefresh;
            }
            this.trigger(events.expanded, expandingArgs);
        });
    }

    private remoteExpand(action: string, row: HTMLTableRowElement, record?: ITreeData) : void {
        let gridRows: HTMLTableRowElement[] = this.getRows();
        const fetchRemoteChildData: string = 'fetchRemoteChildData';
        if (this.rowTemplate) {
            const rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
            gridRows = [].slice.call(rows);
        }
        const args: RowCollapsedEventArgs = {data: record, row: row};
        let rows: HTMLTableRowElement[] = [];
        rows = gridRows.filter(
            (r: HTMLTableRowElement) =>
                ((r.querySelector(
                    '.e-gridrowindex' + record.index + 'level' + (record.level + 1)
                )) || (r.querySelector(
                    '.e-gridrowindex' + record.index + 'level0' + '.e-summarycell'
                )))
        );
        if (action === 'expand') {
            this.notify(events.remoteExpand, {record: record, rows: rows, parentRow: row});
            const args: RowExpandedEventArgs = {row: row, data: record};
            if (rows.length > 0) {
                this.trigger(events.expanded, args);
            }
        }
        else if (action === 'collapse' && this.enableVirtualization) {
            this.dataModule[`${fetchRemoteChildData}`]({action: action, record: args.data, rows: null, parentRow: args.row});
        }
        else {
            this.collapseRemoteChild({ record: record, rows: rows });
            this.trigger(events.collapsed, args);
        }
    }
    private localExpand(action: string, row: HTMLTableRowElement, record?: ITreeData) : void {
        let rows: HTMLTableRowElement[];
        const childRecords: ITreeData[] = this.grid.currentViewData.filter((e: ITreeData) => {
            return e.parentUniqueID === record.uniqueID ;
        });
        if (this.isPixelHeight() && row.cells[0].classList.contains('e-lastrowcell')) {
            this.lastRowBorder(row, false);
        }
        let movableRows: HTMLTableRowElement[];
        let freezeRightRows: HTMLTableRowElement[];
        let gridRows: HTMLTableRowElement[] = this.getRows();
        if (this.rowTemplate) {
            const rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
            gridRows = [].slice.call(rows);
        }
        const displayAction: string = (action === 'expand') ? 'table-row' : 'none';
        const primaryKeyField: string = this.getPrimaryKeyFieldNames()[0];
        if (this.enableImmutableMode && !this.allowPaging) {
            rows = [];
            for (let i: number = 0; i < childRecords.length; i++) {
                const rowIndex: number = this.grid.getRowIndexByPrimaryKey(childRecords[parseInt(i.toString(), 10)][`${primaryKeyField}`]);
                rows.push(this.getRows()[parseInt(rowIndex.toString(), 10)]);
            }
        } else {
            rows = gridRows.filter(
                (r: HTMLTableRowElement) =>
                    r.querySelector(
                        '.e-gridrowindex' + record.index + 'level' + (record.level + 1)
                    ));
        }
        const freeze: boolean = (this.grid.getFrozenLeftColumnsCount() > 0 || this.grid.getFrozenRightColumnsCount() > 0 ) ? true : false;
        if (this.frozenRows || this.frozenColumns || this.getFrozenColumns() || freeze) {
            movableRows = <HTMLTableRowElement[]>this.getRows().filter(
                (r: HTMLTableRowElement) =>
                    r.querySelector(
                        '.e-gridrowindex' + record.index + 'level' + (record.level + 1)
                    ));
        }
        if (freeze) {
            freezeRightRows = <HTMLTableRowElement[]>this.getRows().filter(
                (r: HTMLTableRowElement) =>
                    r.querySelector(
                        '.e-gridrowindex' + record.index + 'level' + (record.level + 1)
                    ));
        }
        const gridRowsObject: Row<GridColumn>[] = this.grid.getRowsObject();
        const currentViewData: Object[] = this.grid.currentViewData;
        const currentRecord: ITreeData[] = currentViewData.filter((e: ITreeData) => {
            return e.uniqueID === record.uniqueID;
        });
        const currentIndex: number = currentViewData.indexOf(currentRecord[0]);
        if (!isNullOrUndefined(gridRowsObject[parseInt(currentIndex.toString(), 10)].visible) &&
            gridRowsObject[parseInt(currentIndex.toString(), 10)].visible !== false) {
            gridRowsObject[parseInt(currentIndex.toString(), 10)].visible = true;
        }
        const detailrows: HTMLTableRowElement[] = gridRows.filter(
            (r: HTMLTableRowElement) =>
                r.classList.contains(
                    'e-griddetailrowindex' + record.index + 'level' + (record.level + 1)
                )
        );
        for (let i: number = 0; i < rows.length; i++) {
            if (!isNullOrUndefined(rows[parseInt(i.toString(), 10)])) {
                rows[parseInt(i.toString(), 10)].style.display = displayAction;
            }
            if (!isNullOrUndefined(rows[parseInt(i.toString(), 10)]) && !this.allowPaging && !(this.enableVirtualization
                || this.enableInfiniteScrolling || isRemoteData(this) || isCountRequired(this))) {
                gridRowsObject[rows[parseInt(i.toString(), 10)].rowIndex].visible = displayAction !== 'none' ? true : false;
                const parentRecord: ITreeData[] = currentViewData.filter((e: ITreeData) => {
                    return e.uniqueID === currentRecord[0].parentUniqueID;
                });
                if (!isNullOrUndefined(parentRecord[0]) && gridRows[currentViewData.indexOf(parentRecord[0])].getElementsByClassName('e-treegridcollapse').length) {
                    gridRowsObject[parseInt(currentIndex.toString(), 10)].visible = false;
                }
            }
            if (!isNullOrUndefined(movableRows)) {
                movableRows[parseInt(i.toString(), 10)].style.display = displayAction;
            }
            if (!isNullOrUndefined(freezeRightRows)) {
                freezeRightRows[parseInt(i.toString(), 10)].style.display = displayAction;
            }
            this.notify('childRowExpand', { row: rows[parseInt(i.toString(), 10)] });
            if ((!isNullOrUndefined(childRecords[parseInt(i.toString(), 10)].childRecords) && childRecords[parseInt(i.toString(), 10)].childRecords.length > 0) && (action !== 'expand' ||
        isNullOrUndefined(childRecords[parseInt(i.toString(), 10)].expanded) || childRecords[parseInt(i.toString(), 10)].expanded)) {
                this.expandCollapse(action, rows[parseInt(i.toString(), 10)], childRecords[parseInt(i.toString(), 10)], true);
                if (this.frozenColumns <= this.treeColumnIndex && !isNullOrUndefined(movableRows)) {
                    this.expandCollapse(action, movableRows[parseInt(i.toString(), 10)], childRecords[parseInt(i.toString(), 10)], true );
                }
            }
        }
        for (let i: number = 0; i < detailrows.length; i++) {
            if (!isNullOrUndefined(detailrows[parseInt(i.toString(), 10)]) && !this.allowPaging && !(this.enableVirtualization ||
                this.enableInfiniteScrolling || isRemoteData(this) || isCountRequired(this))) {
                gridRowsObject[detailrows[parseInt(i.toString(), 10)].rowIndex].visible = displayAction !== 'none' ? true : false;
                detailrows[parseInt(i.toString(), 10)].style.display = displayAction;
            }
        }
        if (!this.allowPaging && !(this.enableVirtualization || this.enableInfiniteScrolling || isRemoteData(this)
            || isCountRequired(this))) {
            this.grid.notify('refresh-Expand-and-Collapse', {rows: this.grid.getRowsObject()});
        }
    }
    private updateAltRow(rows: HTMLTableRowElement[]) : void {
        if (this.enableAltRow && !this.rowTemplate) {
            let visibleRowCount: number = 0;
            for (let i: number = 0; rows && i < rows.length; i++) {
                const gridRow: HTMLTableRowElement = rows[parseInt(i.toString(), 10)];
                if (gridRow.style.display !== 'none') {
                    if (gridRow.classList.contains('e-altrow')) {
                        removeClass([gridRow], 'e-altrow');
                    }
                    if (visibleRowCount % 2 !== 0 && !gridRow.classList.contains('e-summaryrow') && !gridRow.classList.contains('e-detailrow')) {
                        addClass([gridRow], 'e-altrow');
                    }
                    if (!gridRow.classList.contains('e-summaryrow') && !gridRow.classList.contains('e-detailrow')) {
                        visibleRowCount++;
                    }
                }
            }
        }
    }
    private treeColumnRowTemplate(): void {
        let rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
        rows = [].slice.call(rows);
        const rowsObject: Row<GridColumn>[] = this.grid.getRowsObject();
        for (let i: number = 0; i < rows.length; i++) {
            const rcell: HTMLElement = (this.grid.getContentTable() as HTMLTableElement).rows[parseInt(i.toString(), 10)]
                .cells[this.treeColumnIndex];
            const row: Object = rows[parseInt(i.toString(), 10)];
            const rowData: Object = rowsObject.length !== 0 ? rowsObject[parseInt(i.toString(), 10)].data : new Object();
            const arg: Object = { data: rowData, row: row, cell: rcell, column: this.getColumns()[this.treeColumnIndex] };
            this.renderModule.cellRender(arg);
        }
    }
    private collapseRemoteChild(rowDetails: { record: ITreeData, rows: HTMLTableRowElement[] }, isChild?: boolean): void {
        if (!isNullOrUndefined(isChild) && !isChild && this.loadChildOnDemand) {
            rowDetails.record.expanded = false;
        }
        const rows: HTMLTableRowElement[] = rowDetails.rows;
        let row: HTMLTableRowElement;
        let childRecord: ITreeData;
        let movablerows: HTMLTableRowElement[] = [];
        let rightrows: HTMLTableRowElement[] = [];
        const freeze: boolean = (this.getFrozenLeftColumnsCount() > 0 || this.getFrozenRightColumnsCount() > 0 ) ? true : false;
        if (freeze) {
            movablerows = <HTMLTableRowElement[]>this.getRows().filter(
                (r: HTMLTableRowElement) =>
                    r.querySelector(
                        '.e-gridrowindex' + rowDetails.record.index + 'level' + (rowDetails.record.level + 1)
                    )
            );
            rightrows = <HTMLTableRowElement[]>this.getRows().filter(
                (r: HTMLTableRowElement) =>
                    r.querySelector(
                        '.e-gridrowindex' + rowDetails.record.index + 'level' + (rowDetails.record.level + 1)
                    )
            );
        }
        for (let i: number = 0; i < rows.length; i++) {
            rows[parseInt(i.toString(), 10)].style.display = 'none';
            row = rows[parseInt(i.toString(), 10)];
            const collapsingTd: Element = rows[parseInt(i.toString(), 10)].querySelector('.e-detailrowexpand');
            if (!isNullOrUndefined(collapsingTd)) {
                this.grid.detailRowModule.collapse(collapsingTd);
            }
            if (freeze) {
                movablerows[parseInt(i.toString(), 10)].style.display = 'none';
                rightrows[parseInt(i.toString(), 10)].style.display = 'none';
                if (!rows[parseInt(i.toString(), 10)].querySelector('.e-treecolumn-container .e-treegridexpand')) {
                    if (movablerows[parseInt(i.toString(), 10)].querySelector('.e-treecolumn-container .e-treegridexpand')) {
                        row = movablerows[parseInt(i.toString(), 10)];
                    } else if (rightrows[parseInt(i.toString(), 10)].querySelector('.e-treecolumn-container .e-treegridexpand')) {
                        row = rightrows[parseInt(i.toString(), 10)];
                    }
                }
            }
            if (row.querySelector('.e-treecolumn-container .e-treegridexpand')) {
                const expandElement: HTMLElement = row.querySelector('.e-treecolumn-container .e-treegridexpand');
                childRecord = this.rowTemplate ? this.grid.getCurrentViewRecords()[rows[parseInt(i.toString(), 10)].rowIndex] :
                    this.grid.getRowObjectFromUID(rows[parseInt(i.toString(), 10)].getAttribute('data-Uid')).data;
                if (!isNullOrUndefined(expandElement) && childRecord.expanded) {
                    removeClass([expandElement], 'e-treegridexpand');
                    addClass([expandElement], 'e-treegridcollapse');
                }

                const cRow: HTMLTableRowElement[] = [];
                const eRows: HTMLTableRowElement[] = this.getRows();
                for (let i: number = 0; i < eRows.length; i++) {
                    if (eRows[parseInt(i.toString(), 10)].querySelector('.e-gridrowindex' + childRecord.index + 'level' + (childRecord.level + 1))) {
                        cRow.push(eRows[parseInt(i.toString(), 10)]);
                    }
                }
                if (cRow.length && childRecord.expanded) {
                    this.collapseRemoteChild({ record: childRecord, rows: cRow }, false);
                }
            }
        }
    }

    /**
     * Method to sanitize html element
     *
     * @param {any} value - Specifies the html value to sanitize
     * @returns {any} Returns the sanitized html value
     * @hidden
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private sanitize(value: any): any {
        if (this.enableHtmlSanitizer && typeof (value) === 'string') {
            return SanitizeHtmlHelper.sanitize(value);
        }
        return value;
    }

    /**
     * Updates the rows and cells
     *
     * @param {Object[]} records - Updates the given records
     * @param {HTMLTableRowElement[]} rows - Updates the given rows
     * @param {number} index -  Updates the given cell index
     * @returns {void}
     */
    private updateRowAndCellElements(records: Object[], rows: HTMLTableRowElement[], index: number): void {
        for (let i: number = 0; i < records.length; i++) {
            this.renderModule.cellRender({
                data: records[parseInt(i.toString(), 10)], cell: rows[parseInt(i.toString(), 10)].cells[parseInt(index.toString(), 10)] ,
                column: this.grid.getColumns()[this.treeColumnIndex],
                requestType: 'rowDragAndDrop'
            });
            if (this['action'] === 'indenting' || this['action'] === 'outdenting') {
                this.renderModule.RowModifier({
                    data: records[parseInt(i.toString(), 10)], row: rows[parseInt(i.toString(), 10)]
                });
            }
        }
    }
    /**
     * @hidden
     * @returns {void}
     */
    public addListener(): void {
        this.on('updateResults', this.updateResultModel, this);
        this.grid.on('initial-end', this.afterGridRender, this);
    }
    private updateResultModel(returnResult: BeforeDataBoundArgs): void {
        this.dataResults = <ReturnOption>returnResult;
    }
    /**
     * @hidden
     * @returns {void}
     */
    private removeListener(): void {
        if (this.isDestroyed) { return; }
        this.off('updateResults', this.updateResultModel);
        this.grid.off('initial-end', this.afterGridRender);
    }
    /**
     * Filters TreeGrid row by column name with the given options.
     *
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, the TreeGrid filters the records with exact match. if false, it filters
     * case insensitive records (uppercase and lowercase letters are treated the same).
     * @param  {boolean} ignoreAccent - If ignoreAccent is set to true,
     * then filter ignores diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for filter column.
     * @returns {void}
     */
    public filterByColumn(
        fieldName: string, filterOperator: string, filterValue: string | number | Date | boolean | number[] | string[] | Date[] | boolean[],
        predicate?: string, matchCase?: boolean, ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): void {
        this.grid.filterByColumn(
            fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent,
            actualFilterValue, actualOperator
        );
    }
    /**
     * Clears all the filtered rows of the TreeGrid.
     *
     * @returns {void}
     */
    public clearFiltering(): void {
        this.grid.clearFiltering();
    }
    /**
     * Removes filtered column by field name.
     *
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @returns {void}
     * @hidden
     */
    public removeFilteredColsByField(field: string, isClearFilterBar?: boolean): void {
        this.grid.removeFilteredColsByField(field, isClearFilterBar);
    }
    /**
     * Selects a row by given index.
     *
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @returns {void}
     */
    public selectRow(index: number, isToggle?: boolean): void {
        this.grid.selectRow(index, isToggle);
    }

    /**
     * Selects a collection of rows by indexes.
     *
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @returns {void}
     */
    public selectRows(rowIndexes: number[]): void {
        this.grid.selectRows(rowIndexes);
    }

    /**
     * Deselects the current selected rows and cells.
     *
     * @returns {void}
     */
    public clearSelection(): void {
        this.grid.clearSelection();
    }

    /**
     * Copy the selected rows or cells data into clipboard.
     *
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     * @returns {void}
     */
    public copy(withHeader?: boolean): void {
        this.clipboardModule.copy(withHeader);
    }
    /**
     * Paste data from clipboard to selected cells.
     *
     * @param {boolean} data - Specifies the date for paste.
     * @param {boolean} rowIndex - Specifies the row index.
     * @param {boolean} colIndex - Specifies the column index.
     * @returns {void}
     */
    public paste(data: string, rowIndex: number, colIndex: number): void {
        this.clipboardModule.paste(data, rowIndex, colIndex);
    }
    /**
     * Selects a cell by the given index.
     *
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @returns {void}
     */
    public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
        this.grid.selectCell(cellIndex, isToggle);
    }
    /**
     * Gets the collection of selected rows.
     *
     * @returns {Element[]} - Returns selected row elements collection
     */
    public getSelectedRows(): Element[] {
        return this.grid.getSelectedRows();
    }

    /**
     * Gets a movable table cell by row and column index.
     *
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @returns {Element} - Returns movable cell element from the indexes passed
     *
     * @deprecated This method is deprecated. Use getCellFromIndex method instead.
     */
    public getMovableCellFromIndex(rowIndex: number, columnIndex: number): Element {
        return this.grid.getCellFromIndex(rowIndex, columnIndex);
    }

    /**
     * Gets all the TreeGrid's movable table data rows.
     *
     * @returns {Element[]} - Returns element collection of movable rows
     *
     * @deprecated This method is deprecated. Use getDataRows method instead.
     */
    public getMovableDataRows(): Element[] {
        return this.grid.getDataRows();
    }

    /**
     * Gets a movable tables row by index.
     *
     * @param  {number} index - Specifies the row index.
     * @returns {Element} - Returns movable row based on index passed
     *
     * @deprecated This method is deprecated. Use getRowByIndex method instead.
     */
    public getMovableRowByIndex(index: number): Element {
        return this.grid.getRowByIndex(index);
    }

    /**
     * Gets the TreeGrid's movable content rows from frozen treegrid.
     *
     * @returns {Element[]}: Returns movable row element
     * @deprecated This method is deprecated. Use getRows method instead.
     */
    public getMovableRows(): Element[] {
        return this.grid.getRows();
    }

    /**
     * Gets a frozen right tables row element by index.
     *
     * @param  {number} index - Specifies the row index.
     * @returns {Element} returns the element
     *
     * @deprecated This method is deprecated. Use getRowByIndex method instead.
     */
    public getFrozenRightRowByIndex(index: number): Element {
        return this.grid.getRowByIndex(index);
    }

    /**
     * Gets the Tree Grid's frozen right content rows from frozen Tree Grid.
     *
     * @returns {Element[]} returns the element
     *
     * @deprecated This method is deprecated. Use getRows method instead.
     */
    public getFrozenRightRows(): Element[] {
        return this.grid.getRows();
    }

    /**
     * Gets all the Tree Grid's frozen right table data rows.
     *
     * @returns {Element[]} Returns the Element
     *
     * @deprecated This method is deprecated. Use getDataRows method instead.
     */
    public getFrozenRightDataRows(): Element[] {
        return this.grid.getDataRows();
    }

    /**
     * Gets a frozen right table cell by row and column index.
     *
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @returns {Element} Returns the Element
     *
     * @deprecated This method is deprecated. Use getCellFromIndex method instead.
     */
    public getFrozenRightCellFromIndex(rowIndex: number, columnIndex: number): Element {
        return this.grid.getCellFromIndex(rowIndex, columnIndex);
    }

    /**
     * Gets a frozen left column header by column index.
     *
     * @param  {number} index - Specifies the column index.
     * @returns {Element} Returns the Element
     *
     * @deprecated This method is deprecated. Use getColumnHeaderByIndex method instead.
     */
    public getFrozenLeftColumnHeaderByIndex(index: number): Element {
        return this.grid.getColumnHeaderByIndex(index);
    }

    /**
     * Gets a frozen right column header by column index.
     *
     * @param  {number} index - Specifies the column index.
     * @returns {Element} Returns the Element
     *
     * @deprecated This method is deprecated. Use getColumnHeaderByIndex method instead.
     */
    public getFrozenRightColumnHeaderByIndex(index: number): Element {
        return this.grid.getColumnHeaderByIndex(index);
    }

    /**
     * Gets a movable column header by column index.
     *
     * @param  {number} index - Specifies the column index.
     * @returns {Element} Returns the Element
     *
     * @deprecated This method is deprecated. Use getColumnHeaderByIndex method instead.
     */
    public getMovableColumnHeaderByIndex(index: number): Element {
        return this.grid.getColumnHeaderByIndex(index);
    }

    /**
     * @hidden
     * @returns {number} Returns the movable column count
     */
    public getMovableColumnsCount(): number {
        return this.grid.getMovableColumnsCount();
    }

    /**
     * @hidden
     * @returns {number} Returns the Frozen Left column
     */
    public getFrozenLeftColumnsCount(): number {
        return this.grid.getFrozenLeftColumnsCount();
    }

    /**
     * @hidden
     * @returns {number} Returns the Frozen Right column count
     */
    public getFrozenRightColumnsCount(): number {
        return this.grid.getFrozenRightColumnsCount();
    }

    /**
     * @hidden
     * @returns {Column[]} Returns the column
     */
    public getFrozenLeftColumns(): Column[] {
        this.updateColumnModel(this.grid.getFrozenLeftColumns());
        return this.columnModel;
    }

    /**
     * @hidden
     * @returns {Column[]} Returns the column
     */
    public getFrozenRightColumns(): Column[] {
        this.updateColumnModel(this.grid.getFrozenRightColumns());
        return this.columnModel;
    }

    /**
     * @hidden
     * @returns {number} Returns the visible movable count
     */
    public getVisibleMovableCount(): number {
        return this.grid.getVisibleMovableCount();
    }

    /**
     * @hidden
     * @returns {number} Returns the visible Frozen Right count
     */
    public getVisibleFrozenRightCount(): number {
        return this.grid.getVisibleFrozenRightCount();
    }

    /**
     * @hidden
     * @returns {number} Returns the visible Frozen left count
     */
    public getVisibleFrozenLeftCount(): number {
        return this.grid.getVisibleFrozenLeftCount();
    }

    /**
     * @hidden
     * @returns {Column[]} Returns the column
     */
    public getMovableColumns(): Column[] {
        this.updateColumnModel(this.grid.getMovableColumns());
        return this.columnModel;
    }

    /**
     * Gets the number of frozen column in tree grid
     *
     * @hidden
     * @returns {number} - Returns frozen column count
     */
    public getFrozenColumns(): number { // TreeGrid method to get frozen columns
        return this.getFrozenCount(!isNullOrUndefined(this.columns) && this.columns as Column[], 0) + this.frozenColumns;
    }

    private getFrozenCount(cols: Column[], cnt: number): number { // TreeGrid method to get frozen columns count
        for (let j: number = 0, len: number = cols.length; j < len; j++) {
            if (cols[parseInt(j.toString(), 10)].columns) {
                cnt = this.getFrozenCount(cols[parseInt(j.toString(), 10)].columns as Column[], cnt);
            } else {
                if (cols[parseInt(j.toString(), 10)].isFrozen) {
                    cnt++;
                }
            }
        }
        return cnt;
    }

    /**
     * Gets the collection of selected row indexes.
     *
     * @returns {number[]} - Returns selected rows index collection
     */
    public getSelectedRowIndexes(): number[] {
        return this.grid.getSelectedRowIndexes();
    }

    /**
     * Gets the collection of selected row and cell indexes.
     *
     * @returns {ISelectedCell[]} - Returns selected cell's index details
     */
    public getSelectedRowCellIndexes(): ISelectedCell[] {
        return this.grid.getSelectedRowCellIndexes();
    }

    /**
     * Gets the collection of selected records.
     *
     * @isGenericType true
     * @returns {Object[]} - Returns selected records collection
     */
    public getSelectedRecords(): Object[] {
        return this.grid.getSelectedRecords();
    }

    /**
     * Gets the data module.
     *
     * @returns {{baseModule: Data, treeModule: DataManipulation}}: Returns grid and treegrid data module
     */
    public getDataModule(): {baseModule: Data, treeModule: DataManipulation} {
        return {baseModule: this.grid.getDataModule(), treeModule: this.dataModule};
    }

    /**
     * Reorder the rows based on given indexes and position
     *
     * @param {number[]} fromIndexes - Source indexes of rows
     * @param {number} toIndex - Destination index of row
     * @param {string} position - Defines drop position as above or below or child
     * @returns {void}
     */
    public reorderRows(fromIndexes: number[], toIndex: number, position: string): void {
        this.rowDragAndDropModule.reorderRows(fromIndexes, toIndex, position);
    }

    /**
     * Indents the record to one level of hierarchy. Moves the selected row as the last child of its previous row.
     *
     * @param {Object} record – specifies the record to do indented
     * @returns {void}
     */
    public indent(record?: Object): void {
        if (!isNullOrUndefined(this.rowDragAndDropModule)) {
            record = record as ITreeData;
            this.rowDragAndDropModule[this.indentOutdentAction](record, 'indent');
        }
    }

    /**
     * Outdent the record to one level of hierarchy. Moves the selected row as sibling to its parent row.
     *
     * @param {Object} record – specifies the record to do outdented
     * @returns {void}
     */
    public outdent(record?: Object): void {
        if (!isNullOrUndefined(this.rowDragAndDropModule)) {
            record = record as ITreeData;
            this.rowDragAndDropModule[this.indentOutdentAction](record, 'outdent');
        }
    }


    /**
     * `columnchooserModule` is used to dynamically show or hide the TreeGrid columns.
     *
     * @hidden
     */
    public columnChooserModule: ColumnChooser;

    /**
     * The `toolbarModule` is used to manipulate ToolBar items and its action in the TreeGrid.
     */
    public toolbarModule: Toolbar;
    /**
     * The `editModule` is used to handle TreeGrid content manipulation.
     */
    public editModule: Edit;
    /**
     * The `pagerModule` is used to manipulate paging in the TreeGrid.
     */
    public pagerModule: Page;
}
