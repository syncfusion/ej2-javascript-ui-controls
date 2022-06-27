import { Component, addClass, createElement, EventHandler, isNullOrUndefined, Ajax, ModuleDeclaration, extend} from '@syncfusion/ej2-base';import { removeClass, EmitType, Complex, Collection, KeyboardEventArgs, getValue } from '@syncfusion/ej2-base';import {Event, Property, NotifyPropertyChanges, INotifyPropertyChanged, setValue, KeyboardEvents, L10n } from '@syncfusion/ej2-base';import { Column, ColumnModel } from '../models/column';import { BeforeBatchSaveArgs, BeforeBatchAddArgs, BatchDeleteArgs, BeforeBatchDeleteArgs } from '@syncfusion/ej2-grids';import { GridModel, ColumnQueryModeType, HeaderCellInfoEventArgs, EditSettingsModel as GridEditModel } from '@syncfusion/ej2-grids';import {RowDragEventArgs, RowDropEventArgs, RowDropSettingsModel, RowDropSettings, getUid } from '@syncfusion/ej2-grids';import { ActionEventArgs, TextAlign } from'@syncfusion/ej2-grids';import { DetailDataBoundEventArgs, ClipMode, ColumnChooser}  from '@syncfusion/ej2-grids';import { SearchEventArgs, AddEventArgs, EditEventArgs, DeleteEventArgs}  from '@syncfusion/ej2-grids';import { SaveEventArgs, CellSaveArgs, BatchAddArgs, BatchCancelArgs,  BeginEditArgs, CellEditArgs}  from '@syncfusion/ej2-grids';import { FilterSettings } from '../models/filter-settings';import { TextWrapSettings } from '../models/textwrap-settings';import { TextWrapSettingsModel } from '../models/textwrap-settings-model';import {Filter} from '../actions/filter';import { Logger as TreeLogger } from '../actions/logger';import { BeforeCopyEventArgs, BeforePasteEventArgs } from '@syncfusion/ej2-grids';import { TreeClipboard } from '../actions/clipboard';import {Aggregate} from '../actions/summary';import { Reorder } from '../actions/reorder';import { Resize } from '../actions/resize';import { Selection as TreeGridSelection } from '../actions/selection';import { ColumnMenu } from '../actions/column-menu';import { DetailRow } from '../actions/detail-row';import { Freeze } from '../actions/freeze-column';import { Print } from '../actions/print';import * as events from '../base/constant';import { FilterSettingsModel } from '../models/filter-settings-model';import { SearchSettings} from '../models/search-settings';import { SearchSettingsModel } from '../models/search-settings-model';import {RowInfo, RowDataBoundEventArgs, PageEventArgs, FilterEventArgs, FailureEventArgs, SortEventArgs } from '@syncfusion/ej2-grids';import { RowSelectingEventArgs, RowSelectEventArgs, RowDeselectEventArgs, IIndex, ISelectedCell } from '@syncfusion/ej2-grids';import {ColumnModel as GridColumnModel, Column as GridColumn, CellSelectEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';import { SelectionSettings } from '../models/selection-settings';import { SelectionSettingsModel } from '../models/selection-settings-model';import {getActualProperties, SortDirection, getObject, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { PrintMode, Data, IGrid, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { ColumnMenuItem, ColumnMenuItemModel, CheckBoxChangeEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { PdfExportCompleteArgs, PdfHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportProperties, PdfExportProperties, CellSelectingEventArgs, PrintEventArgs } from '@syncfusion/ej2-grids';import { ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';import {BeforeDataBoundArgs} from '@syncfusion/ej2-grids';import { DataManager, ReturnOption, RemoteSaveAdaptor, Query, JsonAdaptor, Deferred } from '@syncfusion/ej2-data';import { createSpinner, hideSpinner, showSpinner, Dialog } from '@syncfusion/ej2-popups';import { isRemoteData, isOffline, extendArray, isCountRequired, findChildrenRecords } from '../utils';import { Grid, QueryCellInfoEventArgs, Logger } from '@syncfusion/ej2-grids';import { Render } from '../renderer/render';import { VirtualTreeContentRenderer } from '../renderer/virtual-tree-content-render';import { DataManipulation } from './data';import { RowDD } from '../actions/rowdragdrop';import { Sort } from '../actions/sort';import { ITreeData, RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs, TreeGridExcelExportProperties } from './interface';import { CellSaveEventArgs, DataStateChangeEventArgs, RowExpandingEventArgs, TreeGridPdfExportProperties } from './interface';import { iterateArrayOrObject, GridLine } from '@syncfusion/ej2-grids';import { DataSourceChangedEventArgs, RecordDoubleClickEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';import { ToolbarItems, ToolbarItem, ContextMenuItem, ContextMenuItems, RowPosition, CopyHierarchyType } from '../enum';import { ItemModel, ClickEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { PageSettings } from '../models/page-settings';import { PageSettingsModel } from '../models/page-settings-model';import { AggregateRow } from '../models/summary';import { AggregateRowModel } from '../models/summary-model';import { ExcelExport } from '../actions/excel-export';import { PdfExport } from '../actions/pdf-export';import { Toolbar } from '../actions/toolbar';import { Page } from '../actions/page';import { ContextMenu } from '../actions/context-menu';import { EditSettings } from '../models/edit-settings';import { EditSettingsModel } from '../models/edit-settings-model';import { Edit} from '../actions/edit';import { SortSettings } from '../models/sort-settings';import { SortSettingsModel } from '../models/sort-settings-model';import { isHidden, getExpandStatus } from '../utils';import { editAction } from '../actions/crud-actions';import { InfiniteScrollSettings } from '../models/infinite-scroll-settings';import { InfiniteScrollSettingsModel } from '../models/infinite-scroll-settings-model';import { TreeActionEventArgs } from '..';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TreeGrid
 */
export interface TreeGridModel extends ComponentModel{

    /**
     * Gets or sets the number of frozen rows.
     *
     * @default 0
     */
    frozenRows?: number;

    /**
     * Gets or sets the number of frozen columns.
     *
     * @default 0
     */
    frozenColumns?: number;

    /**
     *  Defines the mode of clip. The available modes are,
     * `Clip`: Truncates the cell content when it overflows its area.
     * `Ellipsis`: Displays ellipsis when the cell content overflows its area.
     * `EllipsisWithTooltip`:  Displays ellipsis when the cell content overflows its area,
     *  also it will display the tooltip while hover on ellipsis is applied..
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
     * Specifies whether to load all the rows in collapsed state when the TreeGrid is rendered for the first time.
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
     * If `allowRowDragAndDrop` is set to true, you can drag and drop treegrid rows at another treegrid.
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
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
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
     * Defines the print modes. The available print modes are
     * * `AllPages`: Prints all pages of the TreeGrid.
     * * `CurrentPage`: Prints the current page of the TreeGrid.
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
     * If `loadChildOnDemand` is enabled, parent records are render in expanded state.
     *
     * @default false
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
     * @hidden
     * It used to render pager template
     * @default null
     */
    pagerTemplate?: string;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     *
     * > Check the [`Column menu`](../../treegrid/columns/#column-menu/) for its configuration.
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
     * > Check the [`Aggregates`](../../treegrid/aggregate/) for its configuration.
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
     */
    detailTemplate?: string;

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
     */
    toolbarTemplate?: string;

    /**
     * Defines the mode of TreeGrid lines. The available modes are,
     * * `Both`: Displays both horizontal and vertical TreeGrid lines.
     * * `None`: No TreeGrid lines are displayed.
     * * `Horizontal`: Displays the horizontal TreeGrid lines only.
     * * `Vertical`: Displays the vertical TreeGrid lines only.
     * * `Default`: Displays TreeGrid lines based on the theme.
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
     * > Check the [`Row Template`](../../treegrid/row) customization.
     */
    rowTemplate?: string;

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
     * > Check the [`AltRow`](../../treegrid/row/#styling-alternate-rows/) to customize the styles of alternative rows.
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
     * If `enableVirtualization` set to true, then the TreeGrid will render only the rows visible within the view-port
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in TreeGrid.
     *
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * If `enableColumnVirtualization` set to true, then the Tree Grid will render only the columns visible within the view-port
     * and load subsequent columns on horizontal scrolling. This helps to load large dataset of columns in Tree Grid.
     *
     * @default false
     */
    enableColumnVirtualization?: boolean;

    /**
     * If `enableInfiniteScrolling` set to true, then the data will be loaded in TreeGrid when the scrollbar reaches the end.
     * This helps to load large dataset in TreeGrid.
     *
     * @default false
     * @deprecated
     */
    enableInfiniteScrolling?: boolean;

    /**
     * Configures the infinite scroll settings.
     *
     * @default { enableCache: false, maxBlocks: 5, initialBlocks: 5 }
     * @deprecated
     */
    infiniteScrollSettings?: InfiniteScrollSettingsModel;

    /**
     * `columnQueryMode`provides options to retrieves data from the data source.Their types are
     * * `All`: It retrieves whole data source.
     * * `Schema`: retrieves data for all the defined columns in TreeGrid from the data source.
     * * `ExcludeHidden`: retrieves data only for visible columns of TreeGrid from the data Source.
     *
     * @default All
     */
    columnQueryMode?: ColumnQueryModeType;

    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * This event allows customization of TreeGrid properties before rendering.
     *
     * @event load
     */
    load?: EmitType<Object>;

    /**
     * Triggers while expanding the TreeGrid record
     *
     * @event expanding
     */
    expanding?: EmitType<RowExpandingEventArgs>;

    /**
     * Triggers after the record is expanded
     *
     * @event expanded
     */
    expanded?: EmitType<RowExpandedEventArgs>;

    /**
     * Triggers while collapsing the TreeGrid record
     *
     * @event collapsing
     */
    collapsing?: EmitType<RowExpandingEventArgs>;

    /**
     * Triggers after the record is collapsed.
     *
     * @event collapsed
     */
    collapsed?: EmitType<RowExpandingEventArgs>;

    /**
     * Triggers when cell is saved.
     *
     * @event cellSave
     */
    cellSave?: EmitType<CellSaveArgs>;

    /**
     * Triggers when cell is saved.
     *
     * @event cellSaved
     */
    cellSaved?: EmitType<CellSaveArgs>;

    /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc., starts.
   * @event actionBegin
   */
    actionBegin?: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs | SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;

    /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc. are completed.
   * @event actionComplete
   */

    actionComplete?: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs| SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | CellSaveEventArgs>;

    /**
   * Triggers before the record is to be edit.
   * @event beginEdit
   */
    beginEdit?: EmitType<BeginEditArgs>;

    /**
   * Triggers when records are added in batch mode.
   * @event batchAdd
   */
    batchAdd?: EmitType<BatchAddArgs>;

    /**
   * Triggers when records are deleted in batch mode.
   * @event batchDelete
   */
    batchDelete?: EmitType<BatchDeleteArgs>;

    /**
   * Triggers before records are added in batch mode.
   * @event batchCancel
   */
    batchCancel?: EmitType<BatchCancelArgs>;

    /**
   * Triggers before records are added in batch mode.
   * @event beforeBatchAdd
   */
    beforeBatchAdd?: EmitType<BeforeBatchAddArgs>;

    /**
   * Triggers before records are deleted in batch mode.
   * @event beforeBatchDelete
   */
    beforeBatchDelete?: EmitType<BeforeBatchDeleteArgs>;

    /**
   * Triggers before records are saved in batch mode.
   * @event beforeBatchSave
   */
    beforeBatchSave?: EmitType<BeforeBatchSaveArgs>;

    /**
   * Triggers when the cell is being edited.
   * @event cellEdit
   */
    cellEdit?: EmitType<CellEditArgs>;

    /**
     * Triggers when any TreeGrid action failed to achieve the desired results.
     *
     * @event actionFailure
     */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
     * Triggers when data source is populated in the TreeGrid.
     *
     * @event dataBound
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when the TreeGrid data is added, deleted and updated.
     * Invoke the done method from the argument to start render after edit operation.
     *
     * @event dataSourceChanged
     * @deprecated
     */
    dataSourceChanged?: EmitType<DataSourceChangedEventArgs>;

    /**
     * Triggers when the TreeGrid actions such as Sorting, Paging etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     *
     * @event dataStateChange
     * @deprecated
     */
    dataStateChange?: EmitType<DataStateChangeEventArgs>;

    /**
     * Triggers when record is double clicked.
     *
     * @event recordDoubleClick
     */
    recordDoubleClick?: EmitType<RecordDoubleClickEventArgs>;

    /**
     * Triggered every time a request is made to access row information, element, or data.
     * This will be triggered before the row element is appended to the TreeGrid element.
     *
     * @event rowDataBound
     */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggers after detail row expands.
     * > This event triggers at initial expand.
     *
     * @event detailDataBound
     */
    detailDataBound?: EmitType<DetailDataBoundEventArgs>;

    /**
     * Triggered every time a request is made to access cell information, element, or data.
     * This will be triggered before the cell element is appended to the TreeGrid element.
     *
     * @event queryCellInfo
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) TreeGrid records by clicking it.
     *
     * @default true
     */
    allowSelection?: boolean;

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
     * Triggers before deselecting the selected row.
     *
     * @event rowSelected
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
     * Triggered for stacked header.
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
     * Triggers before column menu opens.
     *
     * @event columnMenuOpen
     * @deprecated
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when click on column menu.
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
     * Triggers before the selected cell is deselecting.
     *
     * @event cellDeselecting
     * @deprecated
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     *
     * @event cellDeselected
     * @deprecated
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when column resize starts.
     *
     * @event resizeStart
     * @deprecated
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     *
     * @event resizing
     * @deprecated
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     *
     * @event resizeStop
     * @deprecated
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers when column header element drag (move) starts.
     *
     * @event columnDragStart
     * @deprecated
     */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously.
     *
     * @event columnDrag
     * @deprecated
     */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column.
     *
     * @event columnDrop
     * @deprecated
     */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when the check box state change in checkbox column.
     *
     * @event checkboxChange
     * @deprecated
     */
    checkboxChange?: EmitType<CheckBoxChangeEventArgs>;

    /**
     * Triggers after print action is completed.
     *
     * @event printComplete
     * @deprecated
     */
    printComplete?: EmitType<PrintEventArgs>;

    /**
     * Triggers before the print action starts.
     *
     * @event beforePrint
     * @deprecated
     */
    beforePrint?: EmitType<PrintEventArgs>;

    /**
     * Triggers when toolbar item is clicked.
     *
     * @event toolbarClick
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Triggers before data is bound to Tree Grid.
     *
     * @event beforeDataBound
     */
    beforeDataBound?: EmitType<BeforeDataBoundArgs>;

    /**
     * Triggers before context menu opens.
     *
     * @event contextMenuOpen
     * @deprecated
     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when click on context menu.
     *
     * @event contextMenuClick
     */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers before TreeGrid copy action.
     *
     * @event beforeCopy
     * @deprecated
     */
    beforeCopy?: EmitType<BeforeCopyEventArgs>;

    /**
     * Triggers before TreeGrid paste action.
     *
     * @event beforePaste
     * @deprecated
     */
    beforePaste?: EmitType<BeforePasteEventArgs>;

    /**
     * Triggers when row elements are dragged (moved) continuously.
     *
     * @event rowDrag
     * @deprecated
     */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row element’s drag(move) starts.
     *
     * @event rowDragStart
     * @deprecated
     */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row element’s before drag(move).
     *
     * @event rowDragStartHelper
     * @deprecated
     */
    rowDragStartHelper?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements are dropped on the target row.
     *
     * @event rowDrop
     * @deprecated
     */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering.
     * You can also get the currently selected row index.
     *
     * @default -1
     */
    selectedRowIndex?: number;

    /**
     * Configures the selection settings.
     *
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * If `allowExcelExport` set to true, then it will allow the user to export treegrid to Excel file.
     *
     * > Check the [`ExcelExport`](../../treegrid/excel-export/) to configure exporting document.
     *
     * @default false
     */
    allowExcelExport?: boolean;

    /**
     * If `allowPdfExport` set to true, then it will allow the user to export treegrid to Pdf file.
     *
     * > Check the [`Pdfexport`](../../treegrid/pdf-export/) to configure the exporting document.
     *
     * @default false
     */
    allowPdfExport?: boolean;

    /**
     * Triggers before exporting each cell to PDF document.
     * You can also customize the PDF cells.
     *
     * @event pdfQueryCellInfo
     * @deprecated
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to PDF document.
     * You can also customize the PDF cells.
     *
     * @event pdfHeaderQueryCellInfo
     * @deprecated
     */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelQueryCellInfo
     * @deprecated
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelHeaderQueryCellInfo
     * @deprecated
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before TreeGrid data is exported to Excel file.
     *
     * @event beforeExcelExport
     */
    beforeExcelExport?: EmitType<Object>;

    /**
     * Triggers after TreeGrid data is exported to Excel file.
     *
     * @event excelExportComplete
     * @deprecated
     */
    excelExportComplete?: EmitType<ExcelExportCompleteArgs>;

    /**
     * Triggers before TreeGrid data is exported to PDF document.
     *
     * @event beforePdfExport
     */
    beforePdfExport?: EmitType<Object>;

    /**
     * Triggers after TreeGrid data is exported to PDF document.
     *
     * @event pdfExportComplete
     * @deprecated
     */
    pdfExportComplete?: EmitType<PdfExportCompleteArgs>;

}