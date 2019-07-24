import { Component, ModuleDeclaration, ChildProperty, Browser, closest, extend } from '@syncfusion/ej2-base';import { isNullOrUndefined, setValue, getValue, isBlazor, blazorTemplates } from '@syncfusion/ej2-base';import { addClass, removeClass, append, remove, updateBlazorTemplate, classList, setStyleAttribute } from '@syncfusion/ej2-base';import { Property, Collection, Complex, Event, NotifyPropertyChanges, INotifyPropertyChanged, L10n } from '@syncfusion/ej2-base';import { EventHandler, KeyboardEvents, KeyboardEventArgs, EmitType } from '@syncfusion/ej2-base';import { Query, DataManager, DataUtil } from '@syncfusion/ej2-data';import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';import { createSpinner, hideSpinner, showSpinner, Tooltip } from '@syncfusion/ej2-popups';import { iterateArrayOrObject, prepareColumns, parentsUntil, wrap, templateCompiler, isGroupAdaptive, refreshForeignData } from './util';import { getRowHeight, setColumnIndex } from './util';import * as events from '../base/constant';import { ReturnType } from '../base/type';import { IDialogUI, ScrollPositionType } from './interface';import { IRenderer, IValueFormatter, IFilterOperator, IIndex, RowDataBoundEventArgs, QueryCellInfoEventArgs } from './interface';import { CellDeselectEventArgs, CellSelectEventArgs, CellSelectingEventArgs, ParentDetails, ContextMenuItemModel } from './interface';import { PdfQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, ExcelExportProperties, PdfExportProperties } from './interface';import { PdfHeaderQueryCellInfoEventArgs, ExcelHeaderQueryCellInfoEventArgs, ExportDetailDataBoundEventArgs } from './interface';import { ColumnMenuOpenEventArgs, BatchCancelArgs, RecordDoubleClickEventArgs, DataResult, PendingState } from './interface';import { HeaderCellInfoEventArgs } from './interface';import { FailureEventArgs, FilterEventArgs, ColumnDragEventArgs, GroupEventArgs, PrintEventArgs, ICustomOptr } from './interface';import { RowDeselectEventArgs, RowSelectEventArgs, RowSelectingEventArgs, PageEventArgs, RowDragEventArgs } from './interface';import { BeforeBatchAddArgs, BeforeBatchDeleteArgs, BeforeBatchSaveArgs, ResizeArgs, ColumnMenuItemModel, NotifyArgs } from './interface';import { BatchAddArgs, BatchDeleteArgs, BeginEditArgs, CellEditArgs, CellSaveArgs, BeforeDataBoundArgs, RowInfo } from './interface';import { DetailDataBoundEventArgs, ColumnChooserEventArgs, AddEventArgs, SaveEventArgs, EditEventArgs, DeleteEventArgs } from './interface';import { ExcelExportCompleteArgs, PdfExportCompleteArgs, DataStateChangeEventArgs, DataSourceChangedEventArgs } from './interface';import { SearchEventArgs, SortEventArgs, ISelectedCell, EJ2Intance, BeforeCopyEventArgs} from './interface';import {BeforePasteEventArgs, CheckBoxChangeEventArgs, CommandClickEventArgs } from './interface';import { Render } from '../renderer/render';import { Column, ColumnModel, ActionEventArgs } from '../models/column';import { Action, SelectionType, GridLine, RenderType, SortDirection, SelectionMode, PrintMode, FilterType, FilterBarMode } from './enum';import { CheckboxSelectionType, HierarchyGridPrintMode, NewRowPosition } from './enum';import { WrapMode, ToolbarItems, ContextMenuItem, ColumnMenuItem, ToolbarItem, CellSelectionMode, EditMode } from './enum';import { ColumnQueryModeType } from './enum';import { Data } from '../actions/data';import { Cell } from '../models/cell';import { RowRenderer } from '../renderer/row-renderer';import { CellRenderer } from '../renderer/cell-renderer';import { CellRendererFactory } from '../services/cell-render-factory';import { ServiceLocator } from '../services/service-locator';import { ValueFormatter } from '../services/value-formatter';import { RendererFactory } from '../services/renderer-factory';import { ColumnWidthService } from '../services/width-controller';import { AriaService } from '../services/aria-service';import { FocusStrategy } from '../services/focus-strategy';import { PageSettingsModel, AggregateRowModel } from '../models/models';import { PageSettings } from '../models/page-settings';import { Sort } from '../actions/sort';import { Page } from '../actions/page';import { Selection } from '../actions/selection';import { Filter } from '../actions/filter';import { Search } from '../actions/search';import { Resize } from '../actions/resize';import { Reorder } from '../actions/reorder';import { RowDD } from '../actions/row-reorder';import { ShowHide } from '../actions/show-hide';import { Scroll } from '../actions/scroll';import { Group } from '../actions/group';import { Print } from '../actions/print';import { DetailRow } from '../actions/detail-row';import { Toolbar } from '../actions/toolbar';import { AggregateRow } from '../models/aggregate';import { Edit } from '../actions/edit';import { Row } from '../models/row';import { ColumnChooser } from '../actions/column-chooser';import { ExcelExport } from '../actions/excel-export';import { PdfExport } from '../actions/pdf-export';import { Clipboard } from '../actions/clipboard';import { CommandColumn } from '../actions/command-column';import { ContextMenu } from '../actions/context-menu';import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { ColumnMenu } from '../actions/column-menu';import { CheckState } from './enum';import { Aggregate } from '../actions/aggregate';import { ILogger } from '../actions/logger';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class SortDescriptor
 */
export interface SortDescriptorModel {

    /**
     * Defines the field name of sort column. 
     * @default ''
     */
    field?: string;

    /**
     * Defines the direction of sort column. 
     * @default ''
     * @blazorDefaultValue null
     */
    direction?: SortDirection;

    /**
     * @hidden
     * Defines the sorted column whether or from grouping operation. 
     * @default false
     */
    isFromGroup?: boolean;

}

/**
 * Interface for a class SortSettings
 */
export interface SortSettingsModel {

    /**
     * Specifies the columns to sort at initial rendering of Grid.
     * Also user can get current sorted columns. 
     * @default []
     */
    columns?: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false the user can not get the grid in unsorted state by clicking the sorted column header.
     * @default true
     */
    allowUnsort?: boolean;

}

/**
 * Interface for a class Predicate
 */
export interface PredicateModel {

    /**
     * Defines the field name of the filter column.  
     * @default ''
     */
    field?: string;

    /**
     * Defines the operator to filter records. The available operators and its supported data types are:
     * <table> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * Operator<br/></td><td colspan=1 rowspan=1> 
     * Description<br/></td><td colspan=1 rowspan=1> 
     * Supported Types<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * startswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value begins with the specified value.<br/></td><td colspan=1 rowspan=1> 
     * String<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * endswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value ends with the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * contains<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value contains the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * equal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String | Number | Boolean | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * notequal<br/></td><td colspan=1 rowspan=1> 
     * Checks for values that are not equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>String | Number | Boolean | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * greaterthan<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is greater than the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * Number | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * greaterthanorequal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is greater than or equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>Number | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * lessthan<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is less than the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>Number | Date<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * lessthanorequal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the value is less than or equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
     * <br/>Number | Date<br/></td></tr> 
     * </table> 
     * @default null
     */
    operator?: string;

    /**
     * Defines the value used to filter records. 
     * @default ''
     */
    value?: string | number | Date | boolean;

    /**
     * If match case set to true, then filter records with exact match or else  
     * filter records with case insensitive(uppercase and lowercase letters treated as same).  
     * @default null
     */
    matchCase?: boolean;

    /**
     * If ignoreAccent is set to true, then filter ignores the diacritic characters or accents while filtering.
     * @default false
     */
    ignoreAccent?: boolean;

    /**
     * Defines the relationship between one filter query and another by using AND or OR predicate.   
     * @default null
     */
    predicate?: string;

    /**
     * @hidden 
     * Defines the actual filter value for the filter column.  
     */
    actualFilterValue?: Object;

    /**
     * @hidden 
     * Defines the actual filter operator for the filter column.  
     */
    actualOperator?: Object;

    /**
     * @hidden 
     * Defines the type of the filter column.  
     */
    type?: string;

    /**
     * @hidden 
     * Defines the predicate of filter column.  
     */
    ejpredicate?: Object;

    /**
     * @hidden 
     * Defines the UID of filter column.  
     */
    uid?: string;

}

/**
 * Interface for a class FilterSettings
 */
export interface FilterSettingsModel {

    /**
     * Specifies the columns to be filtered at initial rendering of the Grid. You can also get the columns that were currently filtered.
     * @default []
     */
    columns?: PredicateModel[];

    /**
     * Defines options for filtering type. The available options are 
     * * `Menu` - Specifies the filter type as menu. 
     * * `CheckBox` - Specifies the filter type as checkbox.      
     * * `FilterBar` - Specifies the filter type as filterbar.  
     * * `Excel` - Specifies the filter type as checkbox.      
     * @default FilterBar 
     */
    type?: FilterType;

    /**
     * Defines the filter bar modes. The available options are,
     * * `OnEnter`: Initiates filter operation after Enter key is pressed. 
     * * `Immediate`: Initiates filter operation after a certain time interval. By default, time interval is 1500 ms. 
     * @default OnEnter
     */
    mode?: FilterBarMode;

    /**
     * Shows or hides the filtered status message on the pager.  
     * @default true
     */
    showFilterBarStatus?: boolean;

    /**
     * Defines the time delay (in milliseconds) in filtering records when the `Immediate` mode of filter bar is set. 
     * @default 1500 
     */
    immediateModeDelay?: number;

    /**
     * The `operators` is used to override the default operators in filter menu. This should be defined by type wise
     * (string, number, date and boolean). Based on the column type, this customize operator list will render in filter menu.
     * 
     * > Check the [`Filter Menu Operator`](../../grid/how-to/#customizing-filter-menu-operators-list/) customization.
     * @default null
     */
    operators?: ICustomOptr;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     * 
     * > Check the [`Diacritics`](../../grid/filtering/#diacritics/) filtering.
     * @default false
     */
    ignoreAccent?: boolean;

    /**
     * If `enableCaseSensitivity` is set to true then searches grid records with exact match based on the filter
     * operator. It will have no effect on number, boolean and Date fields. 
     * 
     * @default false
     */
    enableCaseSensitivity?: boolean;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Grid supports row, cell, and both (row and cell) selection mode. 
     * @default Row
     */
    mode?: SelectionMode;

    /**
     * The cell selection modes are flow and box. It requires the selection 
     * [`mode`](grid/#mode-selectionmode/) to be either cell or both.
     * * `Flow`: Selects the range of cells between start index and end index that also includes the other cells of the selected rows.
     * * `Box`: Selects the range of cells within the start and end column indexes that includes in between cells of rows within the range.
     * * `BoxWithBorder`: Selects the range of cells as like Box mode with borders.
     * @default Flow
     */
    cellSelectionMode?: CellSelectionMode;

    /**
     * Defines options for selection type. They are 
     * * `Single`: Allows selection of only a row or a cell. 
     * * `Multiple`: Allows selection of multiple rows or cells. 
     * @default Single 
     */
    type?: SelectionType;

    /**
     * If 'checkboxOnly' set to true, then the Grid selection is allowed only through checkbox.
     * 
     * > To enable checkboxOnly selection, should specify the column type as`checkbox`.
     * @default false 
     */
    checkboxOnly?: boolean;

    /**
     * If 'persistSelection' set to true, then the Grid selection is persisted on all operations.
     * For persisting selection in the Grid, any one of the column should be enabled as a primary key.
     * @default false 
     */
    persistSelection?: boolean;

    /**
     * Defines options for checkbox selection Mode. They are 
     * * `Default`: This is the default value of the checkboxMode. In this mode, user can select multiple rows by clicking rows one by one.
     * * `ResetOnRowClick`: In ResetOnRowClick mode, on clicking a row it will reset previously selected row and also multiple
     *  rows can be selected by using CTRL or SHIFT key.
     * @default Default
     */
    checkboxMode?: CheckboxSelectionType;

    /**
     * If 'enableSimpleMultiRowSelection' set to true, then the user can able to perform multiple row selection with single clicks.
     * @default false
     */
    enableSimpleMultiRowSelection?: boolean;

    /**
     * If 'enableToggle' set to true, then the user can able to perform toggle for the selected row.
     * @default true
     */
    enableToggle?: boolean;

}

/**
 * Interface for a class SearchSettings
 */
export interface SearchSettingsModel {

    /**
     * Specifies the collection of fields included in search operation. By default, bounded columns of the Grid are included.  
     * @default []
     */
    fields?: string[];

    /**
     * Specifies the key value to search Grid records at initial rendering. 
     * You can also get the current search key.
     * @default ''
     */
    key?: string;

    /**
     * Defines the operator to search records. The available operators are:
     * <table> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * Operator<br/></td><td colspan=1 rowspan=1> 
     * Description<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * startswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string begins with the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * endswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string ends with the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * contains<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string contains the specified string. <br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * equal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string is equal to the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * notequal<br/></td><td colspan=1 rowspan=1> 
     * Checks for strings not equal to the specified string. <br/></td></tr> 
     * </table> 
     * @default 'contains'
     */
    operator?: string;

    /**
     * If `ignoreCase` is set to false, searches records that match exactly, else  
     * searches records that are case insensitive(uppercase and lowercase letters treated the same).  
     * @default true 
     */
    ignoreCase?: boolean;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     * 
     * > Check the [`Diacritics`](../../grid/filtering/#diacritics/) filtering.
     * @default false
     */
    ignoreAccent?: boolean;

}

/**
 * Interface for a class RowDropSettings
 */
export interface RowDropSettingsModel {

    /**
     * Defines the ID of droppable component on which row drop should occur.   
     * @default null
     */
    targetID?: string;

}

/**
 * Interface for a class TextWrapSettings
 */
export interface TextWrapSettingsModel {

    /**
     * Defines the `wrapMode` of the Grid. The available modes are: 
     * * `Both`: Wraps both the header and content. 
     * * `Content`: Wraps the header alone.
     * * `Header`: Wraps the content alone. 
     * @default Both
     */
    wrapMode?: WrapMode;

}

/**
 * Interface for a class GroupSettings
 */
export interface GroupSettingsModel {

    /**
     * If `showDropArea` is set to true, the group drop area element will be visible at the top of the Grid.     
     * @default true 
     */
    showDropArea?: boolean;

    /**
     * If `showToggleButton` set to true, then the toggle button will be showed in the column headers which can be used to group
     * or ungroup columns by clicking them.
     * @default false   
     */
    showToggleButton?: boolean;

    /**
     * If `showGroupedColumn` is set to false, it hides the grouped column after grouping.  
     * @default false  
     */
    showGroupedColumn?: boolean;

    /**
     * If `showUngroupButton` set to false, then ungroup button is hidden in dropped element.  
     * It can be used to ungroup the grouped column when click on ungroup button. 
     * @default true 
     */
    showUngroupButton?: boolean;

    /**
     * If `disablePageWiseAggregates` set to true, then the group aggregate value will
     * be calculated from the whole data instead of paged data and two requests will be made for each page
     * when Grid bound with remote service.
     * @default false
     */
    disablePageWiseAggregates?: boolean;

    /**
     * Specifies the column names to group at initial rendering of the Grid.  
     * You can also get the currently grouped columns.   
     * @default []  
     */
    columns?: string[];

    /**
     * The Caption Template allows user to display the string or HTML element in group caption.
     * > It accepts either the
     * [template string](http://ej2.syncfusion.com/documentation/common/template-engine/) or the HTML element ID.
     * @default ''
     */
    captionTemplate?: string;

}

/**
 * Interface for a class EditSettings
 */
export interface EditSettingsModel {

    /**
     * If `allowAdding` is set to true, new records can be added to the Grid.  
     * @default false 
     */
    allowAdding?: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.  
     * @default false 
     */
    allowEditing?: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the Grid.    
     * @default false 
     */
    allowDeleting?: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Normal
     * * Dialog
     * * Batch
     * @default Normal 
     */
    mode?: EditMode;

    /**
     * If `allowEditOnDblClick` is set to false, Grid will not allow editing of a record on double click. 
     * @default true 
     */
    allowEditOnDblClick?: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     * @default true 
     */
    showConfirmDialog?: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     * @default false 
     */
    showDeleteConfirmDialog?: boolean;

    /**
     * Defines the custom edit elements for the dialog template.
     * @default ''
     * @aspType string
     */
    template?: string | Object;

    /**
     * Defines the position of adding a new row. The available position are:
     * * Top
     * * Bottom
     * @default Top 
     */
    newRowPosition?: NewRowPosition;

    /**
     * Defines the dialog params to edit.
     * @default {}
     */
    dialog?: IDialogUI;

    /**
     * If allowNextRowEdit is set to true, editing is done to next row. By default allowNextRowEdit is set to false.
     * @default false
     */
    allowNextRowEdit?: boolean;

}

/**
 * Interface for a class Grid
 */
export interface GridModel extends ComponentModel{

    /**
     * Defines the schema of dataSource. 
     * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.     
     * @default []   
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * If `enableAltRow` is set to true, the grid will render with `e-altrow` CSS class to the alternative tr elements.    
     * > Check the [`AltRow`](../../grid/row/#styling-alternate-rows/) to customize the styles of alternative rows.
     * @default true 
     */
    enableAltRow?: boolean;

    /**
     * If `enableHover` is set to true, the row hover is enabled in the Grid.
     * @default true     
     */
    enableHover?: boolean;

    /**
     * If `enableAutoFill` is set to true, then the auto fill icon will displayed on cell selection for copy cells.
     * It requires the selection `mode` to be Cell and `cellSelectionMode` to be `Box`.
     * @default false 
     */
    enableAutoFill?: boolean;

    /**
     * Enables or disables the key board interaction of Grid.          
     * @hidden 
     * @default true     
     */
    allowKeyboard?: boolean;

    /**
     * If `allowTextWrap` set to true,  
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells. 
     * @default false     
     */
    allowTextWrap?: boolean;

    /**
     * Configures the text wrap in the Grid.  
     * @default {wrapMode:"Both"}     
     */
    textWrapSettings?: TextWrapSettingsModel;

    /**
     * If `allowPaging` is set to true, the pager renders at the footer of the Grid. It is used to handle page navigation in the Grid.
     * 
     * > Check the [`Paging`](../../grid/paging/) to configure the grid pager.
     * @default false     
     */
    allowPaging?: boolean;

    /**
     * Configures the pager in the Grid.  
     * @default {currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false, pageSizes: false, template: null}     
     */
    pageSettings?: PageSettingsModel;

    /**
     * If `enableVirtualization` set to true, then the Grid will render only the rows visible within the view-port
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in Grid.
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * If `enableColumnVirtualization` set to true, then the Grid will render only the columns visible within the view-port
     * and load subsequent columns on horizontal scrolling. This helps to load large dataset of columns in Grid.
     * @default false
     */
    enableColumnVirtualization?: boolean;

    /**
     * Configures the search behavior in the Grid. 
     * @default { ignoreCase: true, fields: [], operator: 'contains', key: '' }    
     */
    searchSettings?: SearchSettingsModel;

    /**
     * If `allowSorting` is set to true, it allows sorting of grid records when column header is clicked.  
     * 
     * > Check the [`Sorting`](../../grid/sorting/) to customize its default behavior.
     * @default false    
     */
    allowSorting?: boolean;

    /**
     * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the grid.
     * > `allowSorting` should be true.
     * @default false
     */
    allowMultiSorting?: boolean;

    /**
     * If `allowExcelExport` set to true, then it will allow the user to export grid to Excel file.
     * 
     * > Check the [`ExcelExport`](../../grid/excel-exporting/) to configure exporting document.
     * @default false    
     */
    allowExcelExport?: boolean;

    /**
     * If `allowPdfExport` set to true, then it will allow the user to export grid to Pdf file.
     * 
     * > Check the [`Pdfexport`](../../grid/pdf-export/) to configure the exporting document.
     * @default false    
     */
    allowPdfExport?: boolean;

    /**
     * Configures the sort settings.  
     * @default {columns:[]}    
     */
    sortSettings?: SortSettingsModel;

    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) Grid records by clicking it.  
     * @default true        
     */
    allowSelection?: boolean;

    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering. 
     * You can also get the currently selected row index.
     * @default -1        
     */
    selectedRowIndex?: number;

    /**
     * Configures the selection settings.  
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}    
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * If `allowFiltering` set to true the filter bar will be displayed. 
     * If set to false the filter bar will not be displayed. 
     * Filter bar allows the user to filter grid records with required criteria.   
     * 
     * > Check the [`Filtering`](../../grid/filtering/) to customize its default behavior.     
     * @default false    
     */
    allowFiltering?: boolean;

    /**
     * If `allowReordering` is set to true, Grid columns can be reordered. 
     * Reordering can be done by drag and drop of a particular column from one index to another index.  
     * > If Grid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
     * @default false    
     */
    allowReordering?: boolean;

    /**
     * If `allowResizing` is set to true, Grid columns can be resized.      
     * @default false    
     */
    allowResizing?: boolean;

    /**
     * If `allowRowDragAndDrop` is set to true, you can drag and drop grid rows at another grid.    
     * @default false    
     */
    allowRowDragAndDrop?: boolean;

    /**
     * Configures the row drop settings.  
     * @default {targetID: ''}   
     */
    rowDropSettings?: RowDropSettingsModel;

    /**
     * Configures the filter settings of the Grid.  
     * @default {columns: [], type: 'FilterBar', mode: 'Immediate', showFilterBarStatus: true, immediateModeDelay: 1500 , operators: {}}    
     */
    filterSettings?: FilterSettingsModel;

    /**
     * If `allowGrouping` set to true, then it will allow the user to dynamically group or ungroup columns.  
     * Grouping can be done by drag and drop columns from column header to group drop area. 
     * 
     * > Check the [`Grouping`](../../grid/grouping/) to customize its default behavior.
     * @default false    
     */
    allowGrouping?: boolean;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     * 
     * > Check the [`Column menu`](../../grid/columns/#column-menu/) for its configuration.
     * @default false    
     */
    showColumnMenu?: boolean;

    /**
     * Configures the group settings. 
     * @default {showDropArea: true, showToggleButton: false, showGroupedColumn: false, showUngroupButton: true, columns: []}    
     */
    groupSettings?: GroupSettingsModel;

    /**
     * Configures the edit settings. 
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Normal',
     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }    
     */
    editSettings?: EditSettingsModel;

    /**
     * Configures the Grid aggregate rows.
     * > Check the [`Aggregates`](../../grid/aggregates/) for its configuration.
     * @default []
     */
    aggregates?: AggregateRowModel[];

    /**
     * If `showColumnChooser` is set to true, it allows you to dynamically show or hide columns.  
     * 
     * > Check the [`ColumnChooser`](../../grid/columns/#column-chooser/) for its configuration.
     * @default false    
     */
    showColumnChooser?: boolean;

    /**
     * Defines the scrollable height of the grid content.    
     * @default 'auto'    
     */
    height?: string | number;

    /**
     * Defines the Grid width.    
     * @default 'auto'    
     */
    width?: string | number;

    /**
     * Defines the mode of grid lines. The available modes are, 
     * * `Both`: Displays both horizontal and vertical grid lines. 
     * * `None`: No grid lines are displayed.
     * * `Horizontal`: Displays the horizontal grid lines only. 
     * * `Vertical`: Displays the vertical grid lines only.
     * * `Default`: Displays grid lines based on the theme.
     * @default Default
     */
    gridLines?: GridLine;

    /**
     * The row template that renders customized rows from the given template. 
     * By default, Grid renders a table row for every data source item.
     * > * It accepts either [template string](../../common/template-engine/) or HTML element ID.   
     * > * The row template must be a table row.  
     * 
     * > Check the [`Row Template`](grid/row/) customization.
     */
    rowTemplate?: string;

    /**
     * The detail template allows you to show or hide additional information about a particular row.
     *  
     * > It accepts either the [template string](../../common/template-engine/) or the HTML element ID.
     * 
     * {% codeBlock src="grid/detail-template-api/index.ts" %}{% endcodeBlock %}
     */
    detailTemplate?: string;

    /**
     * Defines Grid options to render child Grid. 
     * It requires the [`queryString`](grid/#querystring-string) for parent 
     * and child relationship. 
     * 
     * > Check the [`Child Grid`](../../grid/hierarchy-grid/) for its configuration.
     */
    childGrid?: GridModel;

    /**
     * Defines the relationship between parent and child datasource. It acts as the foreign key for parent datasource.       
     */
    queryString?: string;

    /**
     * Defines the print modes. The available print modes are   
     * * `AllPages`: Prints all pages of the Grid. 
     * * `CurrentPage`: Prints the current page of the Grid.
     * @default AllPages
     */
    printMode?: PrintMode;

    /**
     * Defines the hierarchy grid print modes. The available modes are
     * * `Expanded` - Prints the master grid with expanded child grids. 
     * * `All` - Prints the master grid with all the child grids.
     * * `None` - Prints the master grid alone.
     * @default Expanded
     */
    hierarchyPrintMode?: HierarchyGridPrintMode;

    /**
     * It is used to render grid table rows. 
     * If the `dataSource` is an array of JavaScript objects, 
     * then Grid will create instance of [`DataManager`](https://ej2.syncfusion.com/documentation/data/api-dataManager.html) 
     * from this `dataSource`. 
     * If the `dataSource` is an existing [`DataManager`](https://ej2.syncfusion.com/documentation/data/api-dataManager.html),
     *  the Grid will not initialize a new one. 
     * 
     * > Check the available [`Adaptors`](../../data/adaptors/) to customize the data operation.
     * @default []    
     */
    dataSource?: Object | DataManager | DataResult;

    /**
     * Defines the height of Grid rows.
     * @default null
     */
    rowHeight?: number;

    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html) 
     * that will be executed along with data processing.    
     * @default null    
     */
    query?: Query;

    /**
     * Defines the currencyCode format of the Grid columns
     * @private
     */
    currencyCode?: string;

    /**
     * `toolbar` defines the ToolBar items of the Grid. 
     * It contains built-in and custom toolbar items. 
     * If a string value is assigned to the `toolbar` option, it is considered as the template for the whole Grid ToolBar. 
     * If an array value is assigned, it is considered as the list of built-in and custom toolbar items in the Grid's Toolbar. 
     * <br><br>     
     * The available built-in ToolBar items are:
     * * Add: Adds a new record.
     * * Edit: Edits the selected record.
     * * Update: Updates the edited record.
     * * Delete: Deletes the selected record.
     * * Cancel: Cancels the edit state.
     * * Search: Searches records by the given key.
     * * Print: Prints the Grid.
     * * ExcelExport - Export the Grid to Excel(excelExport() method manually to make export.)
     * * PdfExport - Export the Grid to PDF(pdfExport() method manually to make export.)
     * * CsvExport - Export the Grid to CSV(csvExport() method manually to make export.)<br><br>
     * The following code example implements the custom toolbar items.
     * 
     *  > Check the [`Toolbar`](../../grid/tool-bar/#custom-toolbar-items/) to customize its default items.
     * 
     * {% codeBlock src="grid/toolbar-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    toolbar?: (ToolbarItems | string | ItemModel | ToolbarItem)[];

    /**
     * `contextMenuItems` defines both built-in and custom context menu items.
     * <br><br> 
     * The available built-in items are,  
     * * `AutoFitAll` - Auto fit the size of all columns. 
     * * `AutoFit` - Auto fit the current column.
     * * `Group` - Group by current column. 
     * * `Ungroup` - Ungroup by current column.
     * * `Edit` - Edit the current record.
     * * `Delete` - Delete the current record.
     * * `Save` - Save the edited record.
     * * `Cancel` - Cancel the edited state.
     * * `Copy` - Copy the selected records.
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
     * * `Group` - Group by current column. 
     * * `Ungroup` - Ungroup by current column.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `Filter` - Filter options will show based on filterSettings property like checkbox filter, excel filter, menu filter.
     * @default null
     */
    columnMenuItems?: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * It used to render toolbar template
     * @default null
     */
    toolbarTemplate?: string;

    /**
     * It used to render pager template
     * @default null
     */
    pagerTemplate?: string;

    /**
     * Gets or sets the number of frozen rows.
     * @default 0
     */
    frozenRows?: number;

    /**
     * Gets or sets the number of frozen columns.
     * @default 0
     */
    frozenColumns?: number;

    /**
     * `columnQueryMode`provides options to retrive data from the datasource.Their types are 
     * * `All`: It Retrives whole datasource.
     * * `Schema`: Retrives data for all the defined columns in grid from the datasource. 
     * * `ExcludeHidden`: Retrives data only for visible columns of grid from the dataSource. 
     * @default All
     */
    columnQueryMode?: ColumnQueryModeType;

    /**
     * Triggers when the component is created.
     * @event 
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed. 
     * @event 
     * @blazorProperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

    /**
     * This event allows customization of Grid properties before rendering.
     * @event 
     * @blazorProperty 'OnLoad'
     */
    load?: EmitType<Object>;

    /**
     * Triggered every time a request is made to access row information, element, or data. 
     * This will be triggered before the row element is appended to the Grid element.
     * @event 
     * @blazorProperty 'RowDataBound'
     */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggered every time a request is made to access cell information, element, or data.
     * This will be triggered before the cell element is appended to the Grid element.
     * @event
     * @blazorProperty 'QueryCellInfo'
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * Triggered for stacked header.
     * @event 
     * @blazorProperty 'HeaderCellInfo'
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * Triggers when Grid actions such as sorting, filtering, paging, grouping etc., starts. 
     * @event
     * @blazorProperty 'OnActionBegin'
     */
    actionBegin?: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs>;

    /**
     * Triggers when Grid actions such as sorting, filtering, paging, grouping etc. are completed. 
     * @event 
     * @blazorProperty 'OnActionComplete'
     */
    actionComplete?: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs>;

    /**
     * Triggers when any Grid action failed to achieve the desired results. 
     * @event 
     * @blazorProperty 'OnActionFailure'
     */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
     * Triggers when data source is populated in the Grid.
     * @event 
     * @blazorProperty 'DataBound'
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when record is double clicked.
     * @event 
     * @blazorProperty 'OnRecordDoubleClick'
     */
    recordDoubleClick?: EmitType<RecordDoubleClickEventArgs>;

    /**
     * Triggers before row selection occurs.
     * @event 
     * @blazorProperty 'RowSelecting'
     */
    rowSelecting?: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     * @event 
     * @blazorProperty 'RowSelected'
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     * @event 
     * @deprecated  
     */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     * @event 
     * @blazorProperty 'RowDeselected'
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers before any cell selection occurs.
     * @event 
     * @blazorProperty 'CellSelecting'
     */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers after a cell is selected.
     * @event 
     * @blazorProperty 'CellSelected'
     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     * @event 
     * @deprecated  
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     * @event 
     * @deprecated  
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when column header element drag (move) starts. 
     * @event
     * @deprecated  
     */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously. 
     * @event
     * @deprecated
     */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column. 
     * @event
     * @deprecated
     */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers after print action is completed.  
     * @event 
     * @deprecated  
     */
    printComplete?: EmitType<PrintEventArgs>;

    /**
     * Triggers before the print action starts.  
     * @event
     * @deprecated
     */
    beforePrint?: EmitType<PrintEventArgs>;

    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     * @event
     * @deprecated 
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
     * @event
     * @deprecated 
     */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each detail Grid to PDF document.
     * @event
     * @deprecated 
     */
    exportDetailDataBound?: EmitType<ExportDetailDataBoundEventArgs>;

    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     * @event
     * @deprecated
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     * @event
     * @deprecated
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before Grid data is exported to Excel file.
     * @event
     * @deprecated
     */
    beforeExcelExport?: EmitType<Object>;

    /**
     * Triggers after Grid data is exported to Excel file.
     * @event
     * @deprecated
     */
    excelExportComplete?: EmitType<ExcelExportCompleteArgs>;

    /**
     * Triggers before Grid data is exported to PDF document.
     * @event
     * @blazorProperty 'OnPdfExport'
     */
    beforePdfExport?: EmitType<Object>;

    /**
     * Triggers after Grid data is exported to PDF document.
     * @event
     * @deprecated
     */
    pdfExportComplete?: EmitType<PdfExportCompleteArgs>;

    /**
     * Triggers when row element's before drag(move).
     * @event
     * @deprecated
     */
    rowDragStartHelper?: EmitType<RowDragEventArgs>;

    /**
     * Triggers after detail row expands.
     * > This event triggers at initial expand.  
     * @event 
     * @blazorProperty 'DetailDataBound'
     */
    detailDataBound?: EmitType<DetailDataBoundEventArgs>;

    /**
     * Triggers when row element's drag(move) starts. 
     * @event
     * @deprecated  
     */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements are dragged (moved) continuously. 
     * @event
     * @deprecated  
     */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements are dropped on the target row. 
     * @event
     * @deprecated 
     */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when toolbar item is clicked.
     * @event
     * @blazorProperty 'OnToolbarClick'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ClickEventArgs
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Triggers before the columnChooser open.
     * @event
     * @deprecated
     */
    beforeOpenColumnChooser?: EmitType<ColumnChooserEventArgs>;

    /**
     * Triggers when records are added in batch mode.   
     * @event
     * @deprecated
     */
    batchAdd?: EmitType<BatchAddArgs>;

    /**
     * Triggers when records are deleted in batch mode.
     * @event
     * @deprecated
     */
    batchDelete?: EmitType<BatchDeleteArgs>;

    /**
     * Triggers when cancel the batch edit changes batch mode.
     * @event
     * @deprecated
     */
    batchCancel?: EmitType<BatchCancelArgs>;

    /**
     * Triggers before records are added in batch mode.
     * @event
     * @blazorProperty 'OnBatchAdd'
     */
    beforeBatchAdd?: EmitType<BeforeBatchAddArgs>;

    /**
     * Triggers before records are deleted in batch mode.
     * @event
     * @blazorProperty 'OnBatchDelete'
     */
    beforeBatchDelete?: EmitType<BeforeBatchDeleteArgs>;

    /**
     * Triggers before records are saved in batch mode.
     * @event
     * @blazorProperty 'OnBatchSave'
     */
    beforeBatchSave?: EmitType<BeforeBatchSaveArgs>;

    /**
     * Triggers before the record is to be edit.
     * @event
     * @blazorProperty 'OnBeginEdit'
     */
    beginEdit?: EmitType<BeginEditArgs>;

    /**
     * Triggers when command button is clicked.
     * @event
     * @blazorProperty 'CommandClicked'
     */
    commandClick?: EmitType<CommandClickEventArgs>;

    /**
     * Triggers when the cell is being edited.
     * @event
     * @blazorProperty 'OnCellEdit'
     */
    cellEdit?: EmitType<CellEditArgs>;

    /**
     * Triggers when cell is saved.
     * @event
     * @blazorProperty 'OnCellSave'
     */
    cellSave?: EmitType<CellSaveArgs>;

    /**
     * Triggers when cell is saved.
     * @event
     * @blazorProperty 'CellSaved'
     */
    cellSaved?: EmitType<CellSaveArgs>;

    /**
     * Triggers when column resize starts.
     * @event
     * @deprecated
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     * @event
     * @deprecated
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     * @event
     * @deprecated
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers before data is bound to Grid.
     * @event
     * @blazorProperty 'OnDataBound'
     */
    beforeDataBound?: EmitType<BeforeDataBoundArgs>;

    /**
     * Triggers before context menu opens.
     * @event
     * @deprecated
     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when click on context menu.
     * @event
     * @blazorProperty 'ContextMenuItemClicked'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.MenuEventArgs
     */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers before column menu opens.
     * @event
     * @deprecated  
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when click on column menu.
     * @event
     * @blazorProperty 'ColumnMenuItemClicked'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.MenuEventArgs
     */
    columnMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers when the check box state change in checkbox column.
     * @event
     * @deprecated
     */
    checkBoxChange?: EmitType<CheckBoxChangeEventArgs>;

    /**
     * Triggers before Grid copy action.
     * @event
     * @deprecated
     */
    beforeCopy?: EmitType<BeforeCopyEventArgs>;

    /**
     * Triggers before Grid paste action.
     * @event
     * @deprecated 
     */
    beforePaste?: EmitType<BeforePasteEventArgs>;

    /**
     * Triggers when the grid actions such as Sorting, Paging, Grouping etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     * @event
     * @deprecated  
     */
    dataStateChange?: EmitType<DataStateChangeEventArgs>;

    /**
     * Triggers when the grid data is added, deleted and updated.
     * Invoke the done method from the argument to start render after edit operation.
     * @event
     * @deprecated 
     */
    dataSourceChanged?: EmitType<DataSourceChangedEventArgs>;

}