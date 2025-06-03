import { Component, addClass, createElement, EventHandler, isNullOrUndefined, ModuleDeclaration, extend, merge, SanitizeHtmlHelper} from '@syncfusion/ej2-base';import { removeClass, EmitType, Complex, Collection, KeyboardEventArgs, getValue, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';import {Event, Property, NotifyPropertyChanges, INotifyPropertyChanged, setValue, KeyboardEvents, L10n } from '@syncfusion/ej2-base';import { Column, ColumnModel } from '../models/column';import { BeforeBatchSaveArgs, BeforeBatchAddArgs, BatchDeleteArgs, BeforeBatchDeleteArgs, Row, getNumberFormat } from '@syncfusion/ej2-grids';import { GridModel, ColumnQueryModeType, HeaderCellInfoEventArgs, EditSettingsModel as GridEditModel, Freeze as FreezeColumn } from '@syncfusion/ej2-grids';import { RowDragEventArgs, RowDropEventArgs, RowDropSettingsModel, RowDropSettings, getUid, parentsUntil } from '@syncfusion/ej2-grids';import { LoadingIndicator } from '../models/loading-indicator';import { LoadingIndicatorModel } from '../models/loading-indicator-model';import { TextAlign } from'@syncfusion/ej2-grids';import { DetailDataBoundEventArgs, ClipMode, ColumnChooser}  from '@syncfusion/ej2-grids';import { SearchEventArgs, AddEventArgs, EditEventArgs, DeleteEventArgs}  from '@syncfusion/ej2-grids';import { SaveEventArgs, CellSaveArgs, BatchAddArgs, BatchCancelArgs,  BeginEditArgs, CellEditArgs}  from '@syncfusion/ej2-grids';import { FilterSettings } from '../models/filter-settings';import { TextWrapSettings } from '../models/textwrap-settings';import { TextWrapSettingsModel } from '../models/textwrap-settings-model';import {Filter} from '../actions/filter';import { Logger as TreeLogger } from '../actions/logger';import { BeforeCopyEventArgs, BeforePasteEventArgs } from '@syncfusion/ej2-grids';import { TreeClipboard } from '../actions/clipboard';import {Aggregate} from '../actions/summary';import { Reorder } from '../actions/reorder';import { Resize } from '../actions/resize';import { Selection as TreeGridSelection } from '../actions/selection';import { ColumnMenu } from '../actions/column-menu';import { DetailRow } from '../actions/detail-row';import { Freeze } from '../actions/freeze-column';import { Print } from '../actions/print';import * as events from '../base/constant';import { FilterSettingsModel } from '../models/filter-settings-model';import { SearchSettings} from '../models/search-settings';import { SearchSettingsModel } from '../models/search-settings-model';import {RowInfo, RowDataBoundEventArgs, PageEventArgs, FilterEventArgs, FailureEventArgs, SortEventArgs } from '@syncfusion/ej2-grids';import { RowSelectingEventArgs, RowSelectEventArgs, RowDeselectingEventArgs, RowDeselectEventArgs, IIndex, ISelectedCell } from '@syncfusion/ej2-grids';import {ColumnModel as GridColumnModel, Column as GridColumn, CellSelectEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';import { SelectionSettings } from '../models/selection-settings';import { SelectionSettingsModel } from '../models/selection-settings-model';import {getActualProperties, SortDirection, getObject, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { PrintMode, Data, IGrid, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { ColumnMenuItem, ColumnMenuItemModel, CheckBoxChangeEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { PdfExportCompleteArgs, PdfHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportProperties, PdfExportProperties, CellSelectingEventArgs, PrintEventArgs } from '@syncfusion/ej2-grids';import { ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';import {BeforeDataBoundArgs} from '@syncfusion/ej2-grids';import { DataManager, ReturnOption, RemoteSaveAdaptor, Query, JsonAdaptor, Deferred, UrlAdaptor } from '@syncfusion/ej2-data';import { createSpinner, hideSpinner, showSpinner, Dialog } from '@syncfusion/ej2-popups';import { isRemoteData, isOffline, extendArray, isCountRequired, findChildrenRecords } from '../utils';import { Grid, QueryCellInfoEventArgs, Logger } from '@syncfusion/ej2-grids';import { Render } from '../renderer/render';import { VirtualTreeContentRenderer } from '../renderer/virtual-tree-content-render';import { DataManipulation } from './data';import { RowDD } from '../actions/rowdragdrop';import { Sort } from '../actions/sort';import { ITreeData, RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs, TreeGridExcelExportProperties, ActionEventArgs } from './interface';import { DataStateChangeEventArgs, RowExpandingEventArgs, TreeGridPdfExportProperties } from './interface';import { iterateArrayOrObject, GridLine } from '@syncfusion/ej2-grids';import { DataSourceChangedEventArgs, RecordDoubleClickEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';import { ToolbarItems, ToolbarItem, ContextMenuItem, ContextMenuItems, RowPosition, CopyHierarchyType } from '../enum';import { ItemModel, ClickEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { PageSettings } from '../models/page-settings';import { PageSettingsModel } from '../models/page-settings-model';import { AggregateRow } from '../models/summary';import { AggregateRowModel } from '../models/summary-model';import { ExcelExport } from '../actions/excel-export';import { PdfExport } from '../actions/pdf-export';import { Toolbar } from '../actions/toolbar';import { Page } from '../actions/page';import { ContextMenu } from '../actions/context-menu';import { EditSettings } from '../models/edit-settings';import { EditSettingsModel } from '../models/edit-settings-model';import { Edit} from '../actions/edit';import { SortSettings } from '../models/sort-settings';import { SortSettingsModel } from '../models/sort-settings-model';import { isHidden, getExpandStatus } from '../utils';import { editAction } from '../actions/crud-actions';import { InfiniteScrollSettings } from '../models/infinite-scroll-settings';import { InfiniteScrollSettingsModel } from '../models/infinite-scroll-settings-model';import { TreeActionEventArgs } from '..';import * as literals from '../base/constant';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TreeGrid
 */
export interface TreeGridModel extends ComponentModel{

    /**
     * Specifies the number of rows that should remain visible and fixed at the top of the TreeGrid during scrolling.
     *
     * This feature helps improve readability in data-heavy grids by keeping the header rows or key rows visible.
     *
     * @default 0
     */
    frozenRows?: number;

    /**
     * Specifies the number of columns that should remain visible and fixed on the left side of the TreeGrid during horizontal scrolling.
     *
     * This feature ensures key columns, such as identifiers, stay visible while users scroll through data.
     *
     * @default 0
     */
    frozenColumns?: number;

    /**
     * Defines the options for printing the TreeGrid.
     * The available print modes are:
     * * `AllPages`: Prints all pages of the TreeGrid.
     * * `CurrentPage`: Prints only the current page of the TreeGrid.
     *
     * @default Syncfusion.EJ2.Grids.ClipMode.Ellipsis
     * @aspType Syncfusion.EJ2.Grids.ClipMode
     * @isEnumeration true
     */
    clipMode?: ClipMode;

    /**
     * Defines the schema of dataSource.
     * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.
     * {% codeBlock src='treegrid/columns/index.md' %}{% endcodeBlock %}   
     *
     * @default []
     */
    columns?: ColumnModel[] | string[] | Column[];

    /**
     * Specifies the mapping property path for child records in data source
     * {% codeBlock src='treegrid/childMapping/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    childMapping?: string;

    /**
     * Specifies whether record is parent or not for the remote data binding
     *
     * @default null
     */
    hasChildMapping?: string;

    /**
     * Specifies the index of the column that needs to have the expander button.
     *
     * @default 0
     */
    treeColumnIndex?: number;

    /**
     * Specifies the name of the field in the dataSource, which contains the id of that row.
     * {% codeBlock src='treegrid/idMapping/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    idMapping?: string;

    /**
     * Specifies the name of the field in the dataSource, which contains the parent’s id
     * {% codeBlock src='treegrid/parentIdMapping/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    parentIdMapping?: string;

    /**
     * Specifies whether to load all rows in a collapsed state when the TreeGrid is initially rendered.
     *
     * This setting is particularly useful when dealing with large datasets, as it helps enhance loading performance by
     * reducing initial data rendering.
     *
     * @default false
     */
    enableCollapseAll?: boolean;

    /**
     * Specifies the mapping property path for the expand status of a record in data source.
     *
     * @default null
     */
    expandStateMapping?: string;

    /**
     * If `allowRowDragAndDrop` is set to true, row reordering functionality is enabled, allowing rows to be dragged
     * and dropped within the TreeGrid or across TreeGrids.
     *
     * This feature enables users to reorganize data dynamically via drag-and-drop operations.
     *
     * @default false
     */
    allowRowDragAndDrop?: boolean;

    /**
     * It is used to render TreeGrid table rows.
     * {% codeBlock src='treegrid/dataSource/index.md' %}{% endcodeBlock %}
     *
     * @default []
     * @isGenericType true
     * @isDataSource true
     */
    dataSource?: Object | DataManager;

    /**
     * Defines the external [Query](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with data processing.
     *
     * @default null
     */
    query?: Query;

    /**
     * @hidden
     */
    cloneQuery?: Query;

    /**
     * Defines the options for printing the TreeGrid.
     * The available print modes are:
     * * `AllPages`: Prints all pages of the TreeGrid.
     * * `CurrentPage`: Prints only the current page of the TreeGrid.
     *
     * @default Syncfusion.EJ2.Grids.PrintMode.AllPages
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.PrintMode
     */
    printMode?: PrintMode;

    /**
     * If `allowPaging` is set to true, pager renders.
     *
     * @default false
     */
    allowPaging?: boolean;

    /**
     * When enabled, only parent records would be rendered during the initial render and child records will be loaded only when expanding a parent record.
     * This property is only applicable for remote data binding.
     * Loading child records on demand can improve the performance of data-bound controls with a large number of records.
     * Child records are only loaded when they are requested, rather than loading all child records at once.
     *
     * @default true
     */
    loadChildOnDemand?: boolean;

    /**
     * If `allowTextWrap` set to true,
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells.
     *
     * @default false
     */
    allowTextWrap?: boolean;

    /**
     * Configures the text wrap in the TreeGrid.
     *
     * @default {wrapMode:"Both"}
     */
    textWrapSettings?: TextWrapSettingsModel;

    /**
     * If `allowReordering` is set to true, TreeGrid columns can be reordered.
     * Reordering can be done by drag and drop of a particular column from one index to another index.
     * > If TreeGrid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
     *
     * @default false
     */
    allowReordering?: boolean;

    /**
     * If `allowResizing` is set to true, TreeGrid columns can be resized.
     *
     * @default false
     */
    allowResizing?: boolean;

    /**
     * If `autoCheckHierarchy` is set to true, hierarchy checkbox selection is enabled in TreeGrid.
     *
     * @default false
     */
    autoCheckHierarchy?: boolean;

    /**
     * Configures the pager in the TreeGrid.
     *
     * @default {currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false, pageSizes: false, template: null}
     */
    pageSettings?: PageSettingsModel;

    /**
     * Configures the row drop settings of the TreeGrid.
     */
    rowDropSettings?: RowDropSettingsModel;

    /**
     * Defines the currencyCode format of the Tree Grid columns
     *
     * @private
     */
    currencyCode?: string;

    /**
     * @hidden
     * It used to render pager template
     * @default null
     * @aspType string
     */
    pagerTemplate?: string | Function;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     *
     * > Check the [Column menu](../../treegrid/columns/#column-menu/) for its configuration.
     *
     * @default false
     */
    showColumnMenu?: boolean;

    /**
     * If `showColumnChooser` is set to true, it allows you to dynamically show or hide columns.
     *
     * @default false
     */
    showColumnChooser?: boolean;

    /**
     * If `allowSorting` is set to true, it allows sorting of treegrid records when column header is clicked.
     *
     * @default false
     */
    allowSorting?: boolean;

    /**
     * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the treegrid.
     * > `allowSorting` should be true.
     *
     * @default true
     */
    allowMultiSorting?: boolean;

    /**
     * Configures the sort settings of the TreeGrid.
     *
     * @default {columns:[]}
     */
    sortSettings?: SortSettingsModel;

    /**
     * Configures the TreeGrid aggregate rows.
     * > Check the [Aggregates](../../treegrid/aggregates/aggregates) for its configuration.
     *
     * @default []
     */
    aggregates?: AggregateRowModel[];

    /**
     * Configures the edit settings.
     *
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Normal',
     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }
     */
    editSettings?: EditSettingsModel;

    /**
     * If `allowFiltering` is set to true the filter bar will be displayed.
     * If set to false the filter bar will not be displayed.
     * Filter bar allows the user to filter tree grid records with required criteria.
     *
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * The detail template allows you to show or hide additional information about a particular row.
     *
     * > It accepts either the [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
     * or the HTML element ID.
     *
     * @aspType string
     */
    detailTemplate?: string | Function;

    /**
     * Configures the filter settings of the TreeGrid.
     *
     * @default {columns: [], type: 'FilterBar', mode: 'Immediate', showFilterBarStatus: true, immediateModeDelay: 1500 , operators: {}}
     */
    filterSettings?: FilterSettingsModel;

    /**
     * Configures the search settings of the TreeGrid.
     *
     * @default {search: [] , operators: {}}
     */
    searchSettings?: SearchSettingsModel;

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
    toolbar?: (ToolbarItems | string| ItemModel | ToolbarItem)[];

    /**
     * @hidden
     * It used to render toolbar template
     * @default null
     * @aspType string
     */
    toolbarTemplate?: string | Function;

    /**
     * Defines how TreeGrid content lines are displayed, determining the visibility of vertical and horizontal lines.
     *
     * * `Both`: Displays both horizontal and vertical grid lines.
     * * `None`: Hides both horizontal and vertical grid lines.
     * * `Horizontal`: Displays only horizontal grid lines.
     * * `Vertical`: Displays only vertical grid lines.
     * * `Default`: Adjusts line visibility based on the theme.
     *
     * @default Syncfusion.EJ2.Grids.GridLine.Default
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.GridLine
     */
    gridLines?: GridLine;

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
    contextMenuItems?: ContextMenuItem[] | ContextMenuItemModel[];

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
    columnMenuItems?: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * The row template that renders customized rows from the given template.
     * By default, TreeGrid renders a table row for every data source item.
     * > * It accepts either [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
     * or HTML element ID.
     * > * The row template must be a table row.
     *
     * > Check the [Row Template](../../treegrid/row) customization.
     *
     * @aspType string
     */
    rowTemplate?: string | Function;

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
    copyHierarchyMode?: CopyHierarchyType;

    /**
     * Defines the height of TreeGrid rows.
     *
     * @default null
     */
    rowHeight?: number;

    /**
     * If `enableAltRow` is set to true, the TreeGrid will render with `e-altrow` CSS class to the alternative tr elements.   
     * > Check the [AltRow](../../treegrid/row/#styling-alternate-rows/) to customize the styles of alternative rows.
     *
     * @default true 
     */
    enableAltRow?: boolean;

    /**
     * Enables or disables the key board interaction of TreeGrid.    
     *
     * @hidden
     * @default true
     */
    allowKeyboard?: boolean;

    /**
     * If `enableHover` is set to true, the row hover is enabled in the TreeGrid.
     *
     * @default false
     */
    enableHover?: boolean;

    /**
     * If `enableAutoFill` is set to true, then the auto fill icon will displayed on cell selection for copy cells.
     * It requires the selection `mode` to be Cell and `cellSelectionMode` to be `Box`.
     *
     * @default false
     */
    enableAutoFill?: boolean;

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
    enableAdaptiveUI?: boolean;

    /**
     * If `enableImmutableMode`  is set to true, the TreeGrid will reuse old rows if it exists in the new result instead of
     * full refresh while performing the TreeGrid actions.
     *
     * @default false
     */
    enableImmutableMode?: boolean;

    /**
     * Defines the scrollable height of the TreeGrid content.
     *
     * @default 'auto'
     */
    height?: string | number;

    /**
     * Defines the TreeGrid width.
     *
     * @default 'auto'
     */
    width?: string | number;

    /**
     *  Configures the loading indicator of the Tree Grid. Specifies whether to display spinner or shimmer effect
     *  during the waiting time on any actions (paging, sorting, filtering, CRUD operations) performed in Tree Grid.
     *
     * @default {indicatorType: 'Spinner'}
     */
    loadingIndicator?: LoadingIndicatorModel;

    /**
     * Specifies whether to display shimmer effect during scrolling action in virtual scrolling feature.
     * If disabled, spinner is shown instead of shimmer effect.
     *
     * @default true
     */
    enableVirtualMaskRow?: boolean;

    /**
     * If `enableVirtualization` set to true, then the TreeGrid will render only the rows visible within the view-port
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in TreeGrid.
     *
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * Enables column virtualization in the TreeGrid. When set to `true`, only columns visible within the viewport are rendered.
     * Additional columns are loaded as you horizontally scroll. This is beneficial for rendering large datasets efficiently.
     *
     * @default false
     */
    enableColumnVirtualization?: boolean;

    /**
     * Determines whether to sanitize untrusted HTML content in the TreeGrid. If `true`, potentially harmful HTML strings
     * and scripts are sanitized before rendering to protect against XSS attacks.
     *
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Enables infinite scrolling in the TreeGrid. When set to `true`, additional data is loaded as the scrollbar
     * reaches the end. Useful for handling large datasets.
     *
     * @default false
     */
    enableInfiniteScrolling?: boolean;

    /**
     * Configures settings for infinite scrolling.
     *
     * @default { enableCache: false, maxBlocks: 5, initialBlocks: 5 }
     */
    infiniteScrollSettings?: InfiniteScrollSettingsModel;

    /**
     * Specifies how data is retrieved from the data source for the TreeGrid.
     * The available modes are:
     * * `All`: Retrieve the entire data source.
     * * `Schema`: Retrieve data only for defined columns.
     * * `ExcludeHidden`: Retrieve data only for visible columns in the TreeGrid.
     *
     * @default All
     */
    columnQueryMode?: ColumnQueryModeType;

    /**
     * If `allowSelection` is set to true, selection of (highlight row) TreeGrid records by clicking is allowed.
     *
     * @default true
     */
    allowSelection?: boolean;

    /**
     * Specifies the index of the row to be selected upon initial rendering.
     * Also retrieves the index of the currently selected row.
     *
     * @default -1
     */
    selectedRowIndex?: number;

    /**
     * Configures the selection behavior.
     *
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Enables exporting the TreeGrid to an Excel file if set to true.
     *
     * > Check the [ExcelExport](../../treegrid/excel-export/) documentation for more details.
     *
     * @default false
     */
    allowExcelExport?: boolean;

    /**
     * Enables exporting the TreeGrid to a PDF file if set to true.
     *
     * > Check the [PdfExport](../../treegrid/pdf-export/) documentation for more details.
     *
     * @default false
     */
    allowPdfExport?: boolean;

    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Allows customization of TreeGrid properties before rendering.
     *
     * @event load
     */
    load?: EmitType<Object>;

    /**
     * Triggers while a TreeGrid record is expanding.
     *
     * @event expanding
     */
    expanding?: EmitType<RowExpandingEventArgs>;

    /**
     * Triggers after a TreeGrid record is expanded.
     *
     * @event expanded
     */
    expanded?: EmitType<RowExpandedEventArgs>;

    /**
     * Triggers while a TreeGrid record is collapsing.
     *
     * @event collapsing
     */
    collapsing?: EmitType<RowCollapsingEventArgs>;

    /**
     * Triggers after a TreeGrid record is collapsed.
     *
     * @event collapsed
     */
    collapsed?: EmitType<RowCollapsedEventArgs>;

    /**
     * Triggers when a cell is being saved.
     *
     * @event cellSave
     */
    cellSave?: EmitType<CellSaveArgs>;

    /**
     * Triggers after a cell is saved.
     *
     * @event cellSaved
     */
    cellSaved?: EmitType<CellSaveArgs>;

    /**
     * Triggers when TreeGrid actions like sorting, filtering, paging, etc., start.
     *
     * @event actionBegin
     */
    actionBegin?: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs | SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;

    /**
     * Triggers when TreeGrid actions like sorting, filtering, paging, etc., are completed.
     *
     * @event actionComplete
     */
    actionComplete?: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs | SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;

    /**
     * Triggers before a record is edited.
     *
     * @event beginEdit
     */
    beginEdit?: EmitType<BeginEditArgs>;

    /**
     * Triggers when records are added in batch mode.
     *
     * @event batchAdd
     */
    batchAdd?: EmitType<BatchAddArgs>;

    /**
     * Triggers when records are deleted in batch mode.
     *
     * @event batchDelete
     */
    batchDelete?: EmitType<BatchDeleteArgs>;

    /**
     * Triggers before records are cancelled in batch mode.
     *
     * @event batchCancel
     */
    batchCancel?: EmitType<BatchCancelArgs>;

    /**
     * Triggers before records are added in batch mode.
     *
     * @event beforeBatchAdd
     */
    beforeBatchAdd?: EmitType<BeforeBatchAddArgs>;

    /**
     * Triggers before records are deleted in batch mode.
     *
     * @event beforeBatchDelete
     */
    beforeBatchDelete?: EmitType<BeforeBatchDeleteArgs>;

    /**
     * Triggers before records are saved in batch mode.
     *
     * @event beforeBatchSave
     */
    beforeBatchSave?: EmitType<BeforeBatchSaveArgs>;

    /**
     * Triggers when a cell is being edited.
     *
     * @event cellEdit
     */
    cellEdit?: EmitType<CellEditArgs>;

    /**
     * Triggers when any TreeGrid action fails to achieve the desired results.
     *
     * @event actionFailure
     */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
     * Triggers when the data source is populated in the TreeGrid.
     *
     * @event dataBound
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when data in the TreeGrid is added, deleted, or updated.
     * Invoke the done method from the argument to start rendering after an edit operation.
     *
     * @event dataSourceChanged
     * @deprecated
     */
    dataSourceChanged?: EmitType<DataSourceChangedEventArgs>;

    /**
     * Triggers when TreeGrid actions such as sorting, paging, etc., are completed.
     * The current view data and total record count should be assigned to the dataSource based on the action performed.
     *
     * @event dataStateChange
     * @deprecated
     */
    dataStateChange?: EmitType<DataStateChangeEventArgs>;

    /**
     * Triggers when a record is double-clicked.
     *
     * @event recordDoubleClick
     */
    recordDoubleClick?: EmitType<RecordDoubleClickEventArgs>;

    /**
     * Triggered every time a request is made to access row information, element, or data.
     * This event is triggered before the row element is appended to the TreeGrid element.
     *
     * @event rowDataBound
     */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggers after a detail row expands. This event triggers initially during the first expand.
     *
     * @event detailDataBound
     */
    detailDataBound?: EmitType<DetailDataBoundEventArgs>;

    /**
     * Triggered every time a request is made to access cell information, element, or data.
     * This event is triggered before the cell element is appended to the TreeGrid element.
     *
     * @event queryCellInfo
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * Triggers before row selection occurs.
     *
     * @event rowSelecting
     */
    rowSelecting?: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     *
     * @event rowSelected
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before the selected row is deselected.
     *
     * @event rowDeselecting
     * @deprecated
     */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     *
     * @event rowDeselected
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggered for accessing header information.
     *
     * @event headerCellInfo
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * Triggers before any cell selection occurs.
     *
     * @event cellSelecting
     */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers before the column menu opens.
     *
     * @event columnMenuOpen
     * @deprecated
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when there is a click on the column menu.
     *
     * @event columnMenuClick
     */
    columnMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers after a cell is selected.
     *
     * @event cellSelected
     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before a selected cell is deselected.
     *
     * @event cellDeselecting
     * @deprecated
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a selected cell is deselected.
     *
     * @event cellDeselected
     * @deprecated
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when column resizing starts.
     *
     * @event resizeStart
     * @deprecated
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers during column resizing.
     *
     * @event resizing
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Triggers when column resizing ends.
     *
     * @event resizeStop
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers when column header dragging begins.
     *
     * @event columnDragStart
     */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers continuously while the column header is being dragged.
     *
     * @event columnDrag
     */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header is dropped onto the target column.
     *
     * @event columnDrop
     */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when the state of a checkbox changes in a checkbox column.
     *
     * @event checkboxChange
     */
    checkboxChange?: EmitType<CheckBoxChangeEventArgs>;

    /**
     * Triggers after the print action has been completed.
     *
     * @event printComplete
     */
    printComplete?: EmitType<PrintEventArgs>;

    /**
     * Triggers before the print action begins.
     *
     * @event beforePrint
     */
    beforePrint?: EmitType<PrintEventArgs>;

    /**
     * Triggers when a toolbar item is clicked.
     *
     * @event toolbarClick
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Triggers before data is bound to the TreeGrid.
     *
     * @event beforeDataBound
     */
    beforeDataBound?: EmitType<BeforeDataBoundArgs>;

    /**
     * Triggers before the context menu opens.
     *
     * @event contextMenuOpen
     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when an item in the context menu is clicked.
     *
     * @event contextMenuClick
     */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers before the TreeGrid copy action is initiated.
     *
     * @event beforeCopy
     */
    beforeCopy?: EmitType<BeforeCopyEventArgs>;

    /**
     * Triggers before the TreeGrid paste action is initiated.
     *
     * @event beforePaste
     */
    beforePaste?: EmitType<BeforePasteEventArgs>;

    /**
     * Triggers continuously while row elements are being dragged.
     *
     * @event rowDrag
     */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row element dragging starts.
     *
     * @event rowDragStart
     */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
     * Triggers just before the row element dragging begins.
     *
     * @event rowDragStartHelper
     */
    rowDragStartHelper?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when a row element is dropped onto the target row.
     *
     * @event rowDrop
     */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
     * Triggers before each cell is exported to a PDF document, allowing customization of cells.
     *
     * @event pdfQueryCellInfo
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before each header cell is exported to a PDF document, allowing customization of cells.
     *
     * @event pdfHeaderQueryCellInfo
     */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before each cell is exported to an Excel file, allowing customization of cells.
     *
     * @event excelQueryCellInfo
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers before each header cell is exported to an Excel file, allowing customization of cells.
     *
     * @event excelHeaderQueryCellInfo
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before TreeGrid data is exported to an Excel file.
     *
     * @event beforeExcelExport
     */
    beforeExcelExport?: EmitType<Object>;

    /**
     * Triggers after TreeGrid data is exported to an Excel file.
     *
     * @event excelExportComplete
     */
    excelExportComplete?: EmitType<ExcelExportCompleteArgs>;

    /**
     * Triggers before TreeGrid data is exported to a PDF document.
     *
     * @event beforePdfExport
     */
    beforePdfExport?: EmitType<Object>;

    /**
     * Triggers after TreeGrid data is exported to a PDF document.
     *
     * @event pdfExportComplete
     */
    pdfExportComplete?: EmitType<PdfExportCompleteArgs>;

}