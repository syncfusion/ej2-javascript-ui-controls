import { Component, addClass, createElement, EventHandler, isNullOrUndefined, Ajax, ModuleDeclaration, extend} from '@syncfusion/ej2-base';import { removeClass, EmitType, Complex, Collection, KeyboardEventArgs, isBlazor, getElement, getValue } from '@syncfusion/ej2-base';import {Event, Property, NotifyPropertyChanges, INotifyPropertyChanged, setValue, KeyboardEvents, L10n } from '@syncfusion/ej2-base';import { Column, ColumnModel } from '../models/column';import { GridModel, ColumnQueryModeType, HeaderCellInfoEventArgs, EditSettingsModel as GridEditModel } from '@syncfusion/ej2-grids';import {RowDragEventArgs, RowDropEventArgs, RowDropSettingsModel, RowDropSettings, ReturnType, getUid } from '@syncfusion/ej2-grids';import { ActionEventArgs } from'@syncfusion/ej2-grids';import { DetailDataBoundEventArgs, Row}  from '@syncfusion/ej2-grids';import { SearchEventArgs, AddEventArgs, EditEventArgs, DeleteEventArgs}  from '@syncfusion/ej2-grids';import { SaveEventArgs, CellSaveArgs, BatchAddArgs, BatchCancelArgs,  BeginEditArgs, CellEditArgs}  from '@syncfusion/ej2-grids';import { FilterSettings } from '../models/filter-settings';import { TextWrapSettings } from '../models/textwrap-settings';import { TextWrapSettingsModel } from '../models/textwrap-settings-model';import {Filter} from '../actions/filter';import {Aggregate} from '../actions/summary';import { Reorder } from '../actions/reorder';import { Resize } from '../actions/resize';import { Selection as TreeGridSelection } from '../actions/selection';import { ColumnMenu } from '../actions/column-menu';import { DetailRow } from '../actions/detail-row';import { Freeze } from '../actions/freeze-column';import { Print } from '../actions/print';import * as events from '../base/constant';import { FilterSettingsModel } from '../models/filter-settings-model';import { SearchSettings} from '../models/search-settings';import { SearchSettingsModel } from '../models/search-settings-model';import {RowInfo, RowDataBoundEventArgs, PageEventArgs, FilterEventArgs, FailureEventArgs, SortEventArgs } from '@syncfusion/ej2-grids';import { RowSelectingEventArgs, RowSelectEventArgs, RowDeselectEventArgs, IIndex, ISelectedCell } from '@syncfusion/ej2-grids';import {ColumnModel as GridColumnModel, Column as GridColumn, CellSelectEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';import { SelectionSettings } from '../models/selection-settings';import { SelectionSettingsModel } from '../models/selection-settings-model';import {getActualProperties, SortDirection, getObject, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { PrintMode, Data, IGrid, ContextMenuItemModel } from '@syncfusion/ej2-grids';import { ColumnMenuItem, ColumnMenuItemModel, CheckBoxChangeEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { PdfExportCompleteArgs, PdfHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExportProperties, PdfExportProperties, CellSelectingEventArgs, PrintEventArgs } from '@syncfusion/ej2-grids';import { ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';import {BeforeDataBoundArgs} from '@syncfusion/ej2-grids';import { DataManager, ReturnOption, RemoteSaveAdaptor, Query, JsonAdaptor, Deferred } from '@syncfusion/ej2-data';import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';import { isRemoteData, isOffline, extendArray, isCountRequired } from '../utils';import { Grid, QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { Render } from '../renderer/render';import { DataManipulation } from './data';import { RowDD } from '../actions/rowdragdrop';import { Sort } from '../actions/sort';import { ITreeData, RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs } from './interface';import { CellSaveEventArgs, DataStateChangeEventArgs, RowExpandingEventArgs } from './interface';import { iterateArrayOrObject, GridLine } from '@syncfusion/ej2-grids';import { DataSourceChangedEventArgs, RecordDoubleClickEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';import { ToolbarItems, ToolbarItem, ContextMenuItem, ContextMenuItems, RowPosition } from '../enum';import { ItemModel, ClickEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { PageSettings } from '../models/page-settings';import { PageSettingsModel } from '../models/page-settings-model';import { AggregateRow } from '../models/summary';import { AggregateRowModel } from '../models/summary-model';import { ExcelExport } from '../actions/excel-export';import { PdfExport } from '../actions/pdf-export';import { Toolbar } from '../actions/toolbar';import { Page } from '../actions/page';import { ContextMenu } from '../actions/context-menu';import { EditSettings } from '../models/edit-settings';import { EditSettingsModel } from '../models/edit-settings-model';import { Edit} from '../actions/edit';import { SortSettings } from '../models/sort-settings';import { SortSettingsModel } from '../models/sort-settings-model';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TreeGrid
 */
export interface TreeGridModel extends ComponentModel{

    /**
   * Gets or sets the number of frozen rows.

   */
    frozenRows?: number;

    /**
   * Gets or sets the number of frozen columns.

   */
    frozenColumns?: number;

    /**
   * Defines the schema of dataSource. 
   * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.     

   */
    columns?: ColumnModel[] | string[] | Column[];

    /**
   * Specifies the mapping property path for sub tasks in data source

   */
    childMapping?: string;

    /**
   * Specifies whether record is parent or not for the remote data binding

   */
    hasChildMapping?: string;

    /**
   * Specifies the index of the column that needs to have the expander button.

   */
    treeColumnIndex?: number;

    /**
   * Specifies the name of the field in the dataSource, which contains the id of that row.

   */
    idMapping?: string;

    /**
   * Specifies the name of the field in the dataSource, which contains the parent’s id

   */
    parentIdMapping?: string;

    /**
   * Specifies whether to load all the rows in collapsed state when the TreeGrid is rendered for the first time.

   */
    enableCollapseAll?: boolean;

    /**
   * Specifies the mapping property path for the expand status of a record in data source.

   */
    expandStateMapping?: string;

    /**
   * Specifies the mapping property path for the expand status of a record in data source

   */
    allowRowDragAndDrop?: boolean;

    /**
   * It is used to render TreeGrid table rows.



   */
    dataSource?: Object | DataManager;

    /**
   * Defines the external [`Query`](../../data/query/) 
   * that will be executed along with data processing.    

   */
    query?: Query;

    /**

  */
    cloneQuery?: Query;

    /**
  * Defines the print modes. The available print modes are   
  * * `AllPages`: Prints all pages of the TreeGrid. 
  * * `CurrentPage`: Prints the current page of the TreeGrid.




  */
    printMode?: PrintMode;

    /**
   * If `allowPaging` is set to true, pager renders.

   */
    allowPaging?: boolean;

    /**
   * If `loadChildOnDemand` is enabled, parent records are render in expanded state.

   */
    loadChildOnDemand?: boolean;

    /**
 * If `allowTextWrap` set to true,  
 * then text content will wrap to the next line when its text content exceeds the width of the Column Cells. 

 */
    allowTextWrap?: boolean;

    /**
  * Configures the text wrap in the TreeGrid.  

  */
    textWrapSettings?: TextWrapSettingsModel;

    /**
  * If `allowReordering` is set to true, TreeGrid columns can be reordered. 
  * Reordering can be done by drag and drop of a particular column from one index to another index.  
  * > If TreeGrid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.

  */
    allowReordering?: boolean;

    /**
 * If `allowResizing` is set to true, TreeGrid columns can be resized.      

 */
    allowResizing?: boolean;

    /**
 * If `autoCheckHierarchy` is set to true, hierarchy checkbox selection has been enabled in TreeGrid.      

 */
    autoCheckHierarchy?: boolean;

    /**
   * Configures the pager in the TreeGrid.  

   */
    pageSettings?: PageSettingsModel;

    /**
 * Configures the row drop settings of the TreeGrid.
 */
    rowDropSettings?: RowDropSettingsModel;

    /**

 * It used to render pager template

 */
    pagerTemplate?: string;

    /**
   * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
   * 
   * > Check the [`Column menu`](./columns.html#column-menu) for its configuration.

   */
    showColumnMenu?: boolean;

    /**
   * If `allowSorting` is set to true, it allows sorting of treegrid records when column header is clicked.

   */
    allowSorting?: boolean;

    /**
   * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the treegrid.
   * > `allowSorting` should be true.

   */
    allowMultiSorting?: boolean;

    /**
   * Configures the sort settings of the TreeGrid.

   */
    sortSettings?: SortSettingsModel;

    /**
   * Configures the TreeGrid aggregate rows.
   * > Check the [`Aggregates`](./aggregates.html) for its configuration.

   */
    aggregates?: AggregateRowModel[];

    /**
     * Configures the edit settings. 

     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }    
     */
    editSettings?: EditSettingsModel;

    /**
   * If `allowFiltering` is set to true, pager renders.

   */
    allowFiltering?: boolean;

    /**
   * The detail template allows you to show or hide additional information about a particular row.
   *
   * > It accepts either the [template string](../../common/template-engine/) or the HTML element ID.
   *
   */
    detailTemplate?: string;

    /**
   * Configures the filter settings of the TreeGrid.

   */
    filterSettings?: FilterSettingsModel;

    /**
   * Configures the search settings of the TreeGrid.

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

     */
    toolbar?: (ToolbarItems | string| ItemModel | ToolbarItem)[];

    /**

     * It used to render toolbar template

     */
    toolbarTemplate?: string;

    /**
   * Defines the mode of TreeGrid lines. The available modes are, 
   * * `Both`: Displays both horizontal and vertical TreeGrid lines. 
   * * `None`: No TreeGrid lines are displayed.
   * * `Horizontal`: Displays the horizontal TreeGrid lines only. 
   * * `Vertical`: Displays the vertical TreeGrid lines only.
   * * `Default`: Displays TreeGrid lines based on the theme.




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

     */
    columnMenuItems?: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * The row template that renders customized rows from the given template. 
     * By default, TreeGrid renders a table row for every data source item.
     * > * It accepts either [template string](../../common/template-engine.html) or HTML element ID.   
     * > * The row template must be a table row.  
     * 
     * > Check the [`Row Template`](../../treegrid/row) customization.
     */
    rowTemplate?: string;

    /**
   * Defines the height of TreeGrid rows.

   */
    rowHeight?: number;

    /**
   * If `enableAltRow` is set to true, the TreeGrid will render with `e-altrow` CSS class to the alternative tr elements.    
   * > Check the [`AltRow`](./row.html#styling-alternate-rows) to customize the styles of alternative rows.

   */
    enableAltRow?: boolean;

    /**
   * Enables or disables the key board interaction of TreeGrid.          


   */
    allowKeyboard?: boolean;

    /**
   * If `enableHover` is set to true, the row hover is enabled in the TreeGrid.

   */
    enableHover?: boolean;

    /**
   * Defines the scrollable height of the TreeGrid content.    

   */
    height?: string | number;

    /**
   * Defines the TreeGrid width.    

   */
    width?: string | number;

    /**
   * If `enableVirtualization` set to true, then the TreeGrid will render only the rows visible within the view-port
   * and load subsequent rows on vertical scrolling. This helps to load large dataset in TreeGrid.

   */
    enableVirtualization?: boolean;

    /**
     * `columnQueryMode`provides options to retrieves data from the data source.Their types are 
     * * `All`: It retrieves whole data source.
     * * `Schema`: retrieves data for all the defined columns in TreeGrid from the data source. 
     * * `ExcludeHidden`: retrieves data only for visible columns of TreeGrid from the data Source. 

     */
    columnQueryMode?: ColumnQueryModeType;

    /**
   * Triggers when the component is created.
   * @event

   */
    created?: EmitType<Object>;

    /**
   * This event allows customization of TreeGrid properties before rendering.
   * @event

   */
    load?: EmitType<Object>;

    /**
   * Triggers while expanding the TreeGrid record
   * @event

   */
    expanding?: EmitType<RowExpandingEventArgs>;

    /**
   * Triggers after expand the record
   * @event

   */
    expanded?: EmitType<RowExpandedEventArgs>;

    /**
   * Triggers while collapsing the TreeGrid record
   * @event

   */
    collapsing?: EmitType<RowExpandingEventArgs>;

    /**
   * Triggers after collapse the TreeGrid record
   * @event

   */
    collapsed?: EmitType<RowExpandingEventArgs>;

    /**
   * Triggers when cell is saved.
   * @event


   */
    cellSave?: EmitType<CellSaveArgs>;

    /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc., starts.
   * @event


   */
    actionBegin?: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs | SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;

    /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc. are completed.
   * @event


   */

    actionComplete?: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs| SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | CellSaveEventArgs>;

    /**
   * Triggers before the record is to be edit.
   * @event


   */
    beginEdit?: EmitType<BeginEditArgs>;

    /**
   * Triggers when the cell is being edited.
   * @event


   */
    cellEdit?: EmitType<CellEditArgs>;

    /**
   * Triggers when any TreeGrid action failed to achieve the desired results.
   * @event


   */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
   * Triggers when data source is populated in the TreeGrid.
   * @event

   */
    dataBound?: EmitType<Object>;

    /**
   * Triggers when the TreeGrid data is added, deleted and updated.
   * Invoke the done method from the argument to start render after edit operation.
   * @event



   */
    dataSourceChanged?: EmitType<DataSourceChangedEventArgs>;

    /**
   * Triggers when the TreeGrid actions such as Sorting, Paging etc., are done.
   * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
   * @event


   */
    dataStateChange?: EmitType<DataStateChangeEventArgs>;

    /**
   * Triggers when record is double clicked.
   * @event


   */
    recordDoubleClick?: EmitType<RecordDoubleClickEventArgs>;

    /**
   * Triggered every time a request is made to access row information, element, or data.
   * This will be triggered before the row element is appended to the TreeGrid element.
   * @event


   */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
   * Triggers after detail row expands.
   * > This event triggers at initial expand.  
   * @event


   */
    detailDataBound?: EmitType<DetailDataBoundEventArgs>;

    /**
   * Triggered every time a request is made to access cell information, element, or data.
   * This will be triggered before the cell element is appended to the TreeGrid element.
   * @event


   */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
   * If `allowSelection` is set to true, it allows selection of (highlight row) TreeGrid records by clicking it.  

   */
    allowSelection?: boolean;

    /**
     * Triggers before row selection occurs.
     * @event


     */
    rowSelecting?: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     * @event


     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     * @event


     */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     * @event


     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggered for stacked header.
     * @event


     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
       * Triggers before any cell selection occurs.
       * @event


       */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers before column menu opens.
     * @event


     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when click on column menu.
     * @event


     */
    columnMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers after a cell is selected.
     * @event 


     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     * @event 


     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
   * Triggers when a particular selected cell is deselected.
   * @event 


   */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
   * Triggers when column resize starts.
   * @event

   */
    resizeStart?: EmitType<ResizeArgs>;

    /**
   * Triggers on column resizing.
   * @event

   */
    resizing?: EmitType<ResizeArgs>;

    /**
   * Triggers when column resize ends.
   * @event

   */
    resizeStop?: EmitType<ResizeArgs>;

    /**
   * Triggers when column header element drag (move) starts. 
   * @event  


   */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
   * Triggers when column header element is dragged (moved) continuously. 
   * @event  


   */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
  * Triggers when a column header element is dropped on the target column. 
  * @event  


  */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
   * Triggers when the check box state change in checkbox column.
   * @event

   */
    checkboxChange?: EmitType<CheckBoxChangeEventArgs>;

    /**
  * Triggers after print action is completed.  
  * @event 


  */
    printComplete?: EmitType<PrintEventArgs>;

    /**
  * Triggers before the print action starts.  
  * @event 


  */
    beforePrint?: EmitType<PrintEventArgs>;

    /**
   * Triggers when toolbar item is clicked.
   * @event


   */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
   * Triggers when a particular selected cell is deselected.
   * @event 


   */
    beforeDataBound?: EmitType<BeforeDataBoundArgs>;

    /**
   * Triggers before context menu opens.
   * @event


   */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
   * Triggers when click on context menu.
   * @event


   */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
   * Triggers when row elements are dragged (moved) continuously.
   * @event

   */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
   * Triggers when row element’s drag(move) starts.
   * @event

   */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
   * Triggers when row element’s before drag(move).
   * @event

   */
    rowDragStartHelper?: EmitType<RowDragEventArgs>;

    /**
   * Triggers when row elements are dropped on the target row.
   * @event

   */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
   * The `selectedRowIndex` allows you to select a row at initial rendering. 
   * You can also get the currently selected row index.

   */
    selectedRowIndex?: number;

    /**
   * Configures the selection settings.

   */
    selectionSettings?: SelectionSettingsModel;

    /**
   * If `allowExcelExport` set to true, then it will allow the user to export treegrid to Excel file.
   * 
   * > Check the [`ExcelExport`](./excel-exporting.html) to configure exporting document.

   */
    allowExcelExport?: boolean;

    /**
   * If `allowPdfExport` set to true, then it will allow the user to export treegrid to Pdf file.
   * 
   * > Check the [`Pdfexport`](./pdf-exporting.html) to configure the exporting document.

   */
    allowPdfExport?: boolean;

    /**
     * Triggers before exporting each cell to PDF document. 
     * You can also customize the PDF cells.
     * @event 


     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
 * Triggers before exporting each header cell to PDF document. 
 * You can also customize the PDF cells.
 * @event 


 */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
 * Triggers before exporting each cell to Excel file.
 * You can also customize the Excel cells.
 * @event


 */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
 * Triggers before exporting each header cell to Excel file.
 * You can also customize the Excel cells.
 * @event


 */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
 * Triggers before TreeGrid data is exported to Excel file.
 * @event

 */
    beforeExcelExport?: EmitType<Object>;

    /**
 * Triggers after TreeGrid data is exported to Excel file.
 * @event


 */
    excelExportComplete?: EmitType<ExcelExportCompleteArgs>;

    /**
 * Triggers before TreeGrid data is exported to PDF document.
 * @event

 */
    beforePdfExport?: EmitType<Object>;

    /**
 * Triggers after TreeGrid data is exported to PDF document.
 * @event


 */
    pdfExportComplete?: EmitType<PdfExportCompleteArgs>;

}