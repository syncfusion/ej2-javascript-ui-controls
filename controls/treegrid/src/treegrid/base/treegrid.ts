import { Component, addClass, createElement, EventHandler, isNullOrUndefined, Ajax, ModuleDeclaration, extend} from '@syncfusion/ej2-base';
import { removeClass, EmitType, Complex, Collection, KeyboardEventArgs, isBlazor, getElement, getValue } from '@syncfusion/ej2-base';
import {Event, Property, NotifyPropertyChanges, INotifyPropertyChanged, setValue, KeyboardEvents, L10n } from '@syncfusion/ej2-base';
import { Column, ColumnModel } from '../models/column';
import { GridModel, ColumnQueryModeType, HeaderCellInfoEventArgs, EditSettingsModel as GridEditModel } from '@syncfusion/ej2-grids';
import {RowDragEventArgs, RowDropEventArgs, RowDropSettingsModel, RowDropSettings, ReturnType, getUid } from '@syncfusion/ej2-grids';
import { ActionEventArgs } from'@syncfusion/ej2-grids';
import { DetailDataBoundEventArgs, Row}  from '@syncfusion/ej2-grids';
import { SearchEventArgs, AddEventArgs, EditEventArgs, DeleteEventArgs}  from '@syncfusion/ej2-grids';
import { SaveEventArgs, CellSaveArgs, BatchAddArgs, BatchCancelArgs,  BeginEditArgs, CellEditArgs}  from '@syncfusion/ej2-grids';
import { FilterSettings } from '../models/filter-settings';
import { TextWrapSettings } from '../models/textwrap-settings';
import { TextWrapSettingsModel } from '../models/textwrap-settings-model';
import {Filter} from '../actions/filter';
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
import { RowSelectingEventArgs, RowSelectEventArgs, RowDeselectEventArgs, IIndex, ISelectedCell } from '@syncfusion/ej2-grids';
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
import { DataManager, ReturnOption, RemoteSaveAdaptor, Query, JsonAdaptor, Deferred } from '@syncfusion/ej2-data';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { isRemoteData, isOffline, extendArray, isCountRequired } from '../utils';
import { Grid, QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { Render } from '../renderer/render';
import { DataManipulation } from './data';
import { RowDD } from '../actions/rowdragdrop';
import { Sort } from '../actions/sort';
import { ITreeData, RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs } from './interface';
import { CellSaveEventArgs, DataStateChangeEventArgs, RowExpandingEventArgs } from './interface';
import { iterateArrayOrObject, GridLine } from '@syncfusion/ej2-grids';
import { DataSourceChangedEventArgs, RecordDoubleClickEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';
import { ToolbarItems, ToolbarItem, ContextMenuItem, ContextMenuItems, RowPosition } from '../enum';
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
    TreeGrid.Inject(TreeGridSelection);
    setValue('mergePersistData', this.mergePersistTreeGridData, this);
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
  /**
   * The `sortModule` is used to manipulate sorting in TreeGrid.
   */
  public sortModule: Sort;
  private isSelfReference: boolean;
  private columnModel: Column[];
  private isExpandAll: boolean;
  private isCollapseAll: boolean;
  private isExpandRefresh: boolean;
  private gridSettings: GridModel;

  public initialRender: boolean;

  public flatData: Object[];

  public isLocalData: boolean;

  public parentData: Object[];
  // module Declarations
  /**

   */
  public renderModule: Render;

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

   */
  public detailRowModule: DetailRow;
  /**
   * `freezeModule` is used to freeze the rows and columns in the TreeGrid.

   */
  public freezeModule: Freeze;
  /**
   * Gets or sets the number of frozen rows.

   */
  @Property(0)
  public frozenRows: number;

  /**
   * Gets or sets the number of frozen columns.

   */
  @Property(0)
  public frozenColumns: number;

  /**
   * `resizeModule` is used to manipulate resizing in the TreeGrid.

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

  private keyConfigs: { [key: string]: string };

  public filterModule: Filter;
  public excelExportModule: ExcelExport;
  public pdfExportModule: PdfExport;
  public selectionModule: TreeGridSelection;



  public grid: Grid;
  /**     
   * Defines the schema of dataSource. 
   * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.     

   */
  @Property([])
  public columns: ColumnModel[] | string[] | Column[];
  /**
   * Specifies the mapping property path for sub tasks in data source

   */
  @Property(null)
  public childMapping: string;
  /**
   * Specifies whether record is parent or not for the remote data binding

   */
  @Property(null)
  public hasChildMapping: string;
  /**
   * Specifies the index of the column that needs to have the expander button.

   */
  @Property(0)
  public treeColumnIndex: number;
  /**
   * Specifies the name of the field in the dataSource, which contains the id of that row.

   */
  @Property(null)
  public idMapping: string;
  /**
   * Specifies the name of the field in the dataSource, which contains the parent’s id

   */
  @Property(null)
  public parentIdMapping: string;

  /**
   * Specifies whether to load all the rows in collapsed state when the TreeGrid is rendered for the first time.

   */
  @Property(false)
  public enableCollapseAll: boolean;

  /**
   * Specifies the mapping property path for the expand status of a record in data source.

   */
  @Property(null)
  public expandStateMapping: string;

  /**
   * Specifies the mapping property path for the expand status of a record in data source

   */
  @Property(false)
  public allowRowDragAndDrop: boolean;

  /**
   * It is used to render TreeGrid table rows.



   */
  @Property([])
  public dataSource: Object | DataManager;
  /**    
   * Defines the external [`Query`](../../data/query/) 
   * that will be executed along with data processing.    

   */
  @Property()
  public query: Query;
 /**    

  */
 @Property()
 public cloneQuery: Query;
 /**   
  * Defines the print modes. The available print modes are   
  * * `AllPages`: Prints all pages of the TreeGrid. 
  * * `CurrentPage`: Prints the current page of the TreeGrid.




  */
 @Property('AllPages')
 public printMode: PrintMode;
  /**
   * If `allowPaging` is set to true, pager renders.

   */
  @Property(false)
 public allowPaging: boolean;
  /**
   * If `loadChildOnDemand` is enabled, parent records are render in expanded state.

   */
  @Property(false)
 public loadChildOnDemand: boolean;

/**   
 * If `allowTextWrap` set to true,  
 * then text content will wrap to the next line when its text content exceeds the width of the Column Cells. 

 */
  @Property(false)
 public allowTextWrap: boolean;
 /**     
  * Configures the text wrap in the TreeGrid.  

  */
 @Complex<TextWrapSettingsModel>({}, TextWrapSettings)
 public textWrapSettings: TextWrapSettingsModel;
 /**    
  * If `allowReordering` is set to true, TreeGrid columns can be reordered. 
  * Reordering can be done by drag and drop of a particular column from one index to another index.  
  * > If TreeGrid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.

  */
@Property(false)
public allowReordering: boolean;
/**    
 * If `allowResizing` is set to true, TreeGrid columns can be resized.      

 */
@Property(false)
public allowResizing: boolean;
/**    
 * If `autoCheckHierarchy` is set to true, hierarchy checkbox selection has been enabled in TreeGrid.      

 */
@Property(false)
public autoCheckHierarchy: boolean;
  /**     
   * Configures the pager in the TreeGrid.  

   */
@Complex<PageSettingsModel>({}, PageSettings)
public pageSettings: PageSettingsModel;

/**
 * Configures the row drop settings of the TreeGrid.
 */
@Complex<RowDropSettingsModel>({}, RowDropSettings)
public rowDropSettings: RowDropSettingsModel;

/**

 * It used to render pager template

 */
@Property()
public pagerTemplate: string;
  /**    
   * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
   * 
   * > Check the [`Column menu`](./columns.html#column-menu) for its configuration.

   */
  @Property(false)
  public showColumnMenu: boolean;
  /**
   * If `allowSorting` is set to true, it allows sorting of treegrid records when column header is clicked.

   */
  @Property(false)
  public allowSorting: boolean;
  /**
   * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the treegrid.
   * > `allowSorting` should be true.

   */
  @Property(true)
  public allowMultiSorting: boolean;
  /**
   * Configures the sort settings of the TreeGrid.

   */
  @Complex<SortSettingsModel>({}, SortSettings)
  public sortSettings: SortSettingsModel;
  /**
   * Configures the TreeGrid aggregate rows.
   * > Check the [`Aggregates`](./aggregates.html) for its configuration.

   */
  @Collection<AggregateRowModel>([], AggregateRow)
  public aggregates: AggregateRowModel[];
    /**    
     * Configures the edit settings. 

     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }    
     */
    @Complex<EditSettingsModel>({}, EditSettings)
    public editSettings: EditSettingsModel;
  /**
   * If `allowFiltering` is set to true, pager renders.

   */
  @Property(false)
  public allowFiltering: boolean;
  /**
   * The detail template allows you to show or hide additional information about a particular row.
   *
   * > It accepts either the [template string](../../common/template-engine/) or the HTML element ID.
   *
   */
  @Property()
  public detailTemplate: string;
  /**
   * Configures the filter settings of the TreeGrid.

   */
  @Complex<FilterSettingsModel>({}, FilterSettings)
  public filterSettings: FilterSettingsModel;
  /**
   * Configures the search settings of the TreeGrid.

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

     */
    @Property()
    public toolbar: (ToolbarItems | string| ItemModel | ToolbarItem)[];
    /**

     * It used to render toolbar template

     */
    @Property()
    public toolbarTemplate: string;
  /**   
   * Defines the mode of TreeGrid lines. The available modes are, 
   * * `Both`: Displays both horizontal and vertical TreeGrid lines. 
   * * `None`: No TreeGrid lines are displayed.
   * * `Horizontal`: Displays the horizontal TreeGrid lines only. 
   * * `Vertical`: Displays the vertical TreeGrid lines only.
   * * `Default`: Displays TreeGrid lines based on the theme.




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

     */
    @Property()
    public columnMenuItems: ColumnMenuItem[] | ColumnMenuItemModel[];
    /**   
     * The row template that renders customized rows from the given template. 
     * By default, TreeGrid renders a table row for every data source item.
     * > * It accepts either [template string](../../common/template-engine.html) or HTML element ID.   
     * > * The row template must be a table row.  
     * 
     * > Check the [`Row Template`](../../treegrid/row) customization.
     */
    @Property()
    public rowTemplate: string;

  /**
   * Defines the height of TreeGrid rows.

   */
  @Property(null)
  public rowHeight: number;
  /**     
   * If `enableAltRow` is set to true, the TreeGrid will render with `e-altrow` CSS class to the alternative tr elements.    
   * > Check the [`AltRow`](./row.html#styling-alternate-rows) to customize the styles of alternative rows.

   */
  @Property(true)
  public enableAltRow: boolean;
  /**
   * Enables or disables the key board interaction of TreeGrid.          


   */
  @Property(true)
  public allowKeyboard: boolean;
  /**     
   * If `enableHover` is set to true, the row hover is enabled in the TreeGrid.

   */
  @Property(false)
  public enableHover: boolean;
  /**    
   * Defines the scrollable height of the TreeGrid content.    

   */
  @Property('auto')
  public height: string | number;

  /**    
   * Defines the TreeGrid width.    

   */
  @Property('auto')
  public width: string | number;
  /**
   * If `enableVirtualization` set to true, then the TreeGrid will render only the rows visible within the view-port
   * and load subsequent rows on vertical scrolling. This helps to load large dataset in TreeGrid.

   */
  @Property(false)
  public enableVirtualization: boolean;
    /**
     * `columnQueryMode`provides options to retrieves data from the data source.Their types are 
     * * `All`: It retrieves whole data source.
     * * `Schema`: retrieves data for all the defined columns in TreeGrid from the data source. 
     * * `ExcludeHidden`: retrieves data only for visible columns of TreeGrid from the data Source. 

     */
    @Property('All')
    public columnQueryMode: ColumnQueryModeType;
  /**
   * Triggers when the component is created.
   * @event

   */
  @Event()
  public created: EmitType<Object>;
  /**
   * This event allows customization of TreeGrid properties before rendering.
   * @event

   */
  @Event()
  public load: EmitType<Object>;
  /**
   * Triggers while expanding the TreeGrid record
   * @event

   */
  @Event()
  public expanding: EmitType<RowExpandingEventArgs>;
  /**
   * Triggers after expand the record
   * @event

   */
  @Event()
  public expanded: EmitType<RowExpandedEventArgs>;
  /**
   * Triggers while collapsing the TreeGrid record
   * @event

   */
  @Event()
  public collapsing: EmitType<RowExpandingEventArgs>;
  /**
   * Triggers after collapse the TreeGrid record
   * @event

   */
  @Event()
  public collapsed: EmitType<RowExpandingEventArgs>;
  /**
   * Triggers when cell is saved.
   * @event


   */
  @Event()
  public cellSave: EmitType<CellSaveArgs>;
  /* tslint:disable */
  /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc., starts.
   * @event


   */
  @Event()
  public actionBegin: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs | SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;
  
  /**
   * Triggers when TreeGrid actions such as sorting, filtering, paging etc. are completed.
   * @event


   */

  @Event()
  public actionComplete: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs| SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | CellSaveEventArgs>;

  /** 
   * Triggers before the record is to be edit.
   * @event


   */
  @Event()
  public beginEdit: EmitType<BeginEditArgs>;
  /** 
   * Triggers when the cell is being edited.
   * @event


   */
    @Event()
    public cellEdit: EmitType<CellEditArgs>;
  /* tslint:enable */
  /**
   * Triggers when any TreeGrid action failed to achieve the desired results.
   * @event


   */
  @Event()
  public actionFailure: EmitType<FailureEventArgs>;
  /**
   * Triggers when data source is populated in the TreeGrid.
   * @event

   */
  @Event()
  public dataBound: EmitType<Object>;

  /**
   * Triggers when the TreeGrid data is added, deleted and updated.
   * Invoke the done method from the argument to start render after edit operation.
   * @event



   */
  @Event()
  public dataSourceChanged: EmitType<DataSourceChangedEventArgs>;

  /** 
   * Triggers when the TreeGrid actions such as Sorting, Paging etc., are done.
   * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
   * @event


   */
  @Event()
  public dataStateChange: EmitType<DataStateChangeEventArgs>;

  /** 
   * Triggers when record is double clicked.
   * @event


   */
  @Event()
  public recordDoubleClick: EmitType<RecordDoubleClickEventArgs>;

  /**
   * Triggered every time a request is made to access row information, element, or data.
   * This will be triggered before the row element is appended to the TreeGrid element.
   * @event


   */
  @Event()
  public rowDataBound: EmitType<RowDataBoundEventArgs>;
  /** 
   * Triggers after detail row expands.
   * > This event triggers at initial expand.  
   * @event


   */
  @Event()
  public detailDataBound: EmitType<DetailDataBoundEventArgs>;
  /**
   * Triggered every time a request is made to access cell information, element, or data.
   * This will be triggered before the cell element is appended to the TreeGrid element.
   * @event


   */
  @Event()
  public queryCellInfo: EmitType<QueryCellInfoEventArgs>;
  /**
   * If `allowSelection` is set to true, it allows selection of (highlight row) TreeGrid records by clicking it.  

   */
  @Property(true)
  public allowSelection: boolean;
    /**
     * Triggers before row selection occurs.
     * @event


     */
  @Event()
  public rowSelecting: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     * @event


     */
  @Event()
  public rowSelected: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     * @event


     */
  @Event()
  public rowDeselecting: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     * @event


     */
  @Event()
  public rowDeselected: EmitType<RowDeselectEventArgs>;
    /** 
     * Triggered for stacked header.
     * @event


     */
  @Event()
  public headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

      /**
       * Triggers before any cell selection occurs.
       * @event


       */
  @Event()
  public cellSelecting: EmitType<CellSelectingEventArgs>;
    /** 
     * Triggers before column menu opens.
     * @event


     */
    @Event()
  public columnMenuOpen: EmitType<ColumnMenuOpenEventArgs>;
    /** 
     * Triggers when click on column menu.
     * @event


     */
    @Event()
  public columnMenuClick: EmitType<MenuEventArgs>;


    /**
     * Triggers after a cell is selected.
     * @event 


     */
  @Event()
  public cellSelected: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     * @event 


     */
  @Event()
  public cellDeselecting: EmitType<CellDeselectEventArgs>;

  /**
   * Triggers when a particular selected cell is deselected.
   * @event 


   */
  @Event()
  public cellDeselected: EmitType<CellDeselectEventArgs>;

  /** 
   * Triggers when column resize starts.
   * @event

   */
  @Event()
  public resizeStart: EmitType<ResizeArgs>;

  /** 
   * Triggers on column resizing.
   * @event

   */
  @Event()
  public resizing: EmitType<ResizeArgs>;

  /** 
   * Triggers when column resize ends.
   * @event

   */
  @Event()
  public resizeStop: EmitType<ResizeArgs>;

  /**  
   * Triggers when column header element drag (move) starts. 
   * @event  


   */
  @Event()
  public columnDragStart: EmitType<ColumnDragEventArgs>;

  /**  
   * Triggers when column header element is dragged (moved) continuously. 
   * @event  


   */
  @Event()
  public columnDrag: EmitType<ColumnDragEventArgs>;

 /**  
  * Triggers when a column header element is dropped on the target column. 
  * @event  


  */
  @Event()
  public columnDrop: EmitType<ColumnDragEventArgs>;
  /** 
   * Triggers when the check box state change in checkbox column.
   * @event

   */
  @Event()
  public checkboxChange: EmitType<CheckBoxChangeEventArgs>;

 /** 
  * Triggers after print action is completed.  
  * @event 


  */
  @Event()
  public printComplete: EmitType<PrintEventArgs>;
 /** 
  * Triggers before the print action starts.  
  * @event 


  */
  @Event()
  public beforePrint: EmitType<PrintEventArgs>;
  /**      
   * Triggers when toolbar item is clicked.
   * @event


   */
  @Event()
  public toolbarClick: EmitType<ClickEventArgs>;
  /**
   * Triggers when a particular selected cell is deselected.
   * @event 


   */
@Event()
public beforeDataBound: EmitType<BeforeDataBoundArgs>;
  /**
   * Triggers before context menu opens.
   * @event


   */
  @Event()
  public contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

  /**
   * Triggers when click on context menu.
   * @event


   */
  @Event()
  public contextMenuClick: EmitType<MenuEventArgs>;
  /**
   * Triggers when row elements are dragged (moved) continuously.
   * @event

   */
  @Event()
  public rowDrag: EmitType<RowDragEventArgs>;
  /**
   * Triggers when row element’s drag(move) starts.
   * @event

   */
  @Event()
  public rowDragStart: EmitType<RowDragEventArgs>;
  /**
   * Triggers when row element’s before drag(move).
   * @event

   */
  @Event()
  public rowDragStartHelper: EmitType<RowDragEventArgs>;
  /**
   * Triggers when row elements are dropped on the target row.
   * @event

   */
  @Event()
  public rowDrop: EmitType<RowDragEventArgs>;

  /**
   * The `selectedRowIndex` allows you to select a row at initial rendering. 
   * You can also get the currently selected row index.

   */
  @Property(-1)
  public selectedRowIndex: number;

  /**
   * Configures the selection settings.

   */
  @Complex<SelectionSettingsModel>({}, SelectionSettings)
  public selectionSettings: SelectionSettingsModel;

  /**
   * If `allowExcelExport` set to true, then it will allow the user to export treegrid to Excel file.
   * 
   * > Check the [`ExcelExport`](./excel-exporting.html) to configure exporting document.

   */
  @Property(false)
  public allowExcelExport: boolean;
  /**    
   * If `allowPdfExport` set to true, then it will allow the user to export treegrid to Pdf file.
   * 
   * > Check the [`Pdfexport`](./pdf-exporting.html) to configure the exporting document.

   */
  @Property(false)
  public allowPdfExport: boolean;
    /** 
     * Triggers before exporting each cell to PDF document. 
     * You can also customize the PDF cells.
     * @event 


     */
@Event()
public pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;

/** 
 * Triggers before exporting each header cell to PDF document. 
 * You can also customize the PDF cells.
 * @event 


 */
@Event()
public pdfHeaderQueryCellInfo: EmitType<PdfHeaderQueryCellInfoEventArgs>;

/** 
 * Triggers before exporting each cell to Excel file.
 * You can also customize the Excel cells.
 * @event


 */
@Event()
public excelQueryCellInfo: EmitType<ExcelQueryCellInfoEventArgs>;

/** 
 * Triggers before exporting each header cell to Excel file.
 * You can also customize the Excel cells.
 * @event


 */
@Event()
public excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

/**
 * Triggers before TreeGrid data is exported to Excel file.
 * @event

 */
@Event()
public beforeExcelExport: EmitType<Object>;

/**
 * Triggers after TreeGrid data is exported to Excel file.
 * @event


 */
@Event()
public excelExportComplete: EmitType<ExcelExportCompleteArgs>;

/**
 * Triggers before TreeGrid data is exported to PDF document.
 * @event

 */
@Event()
public beforePdfExport: EmitType<Object>;

/**
 * Triggers after TreeGrid data is exported to PDF document.
 * @event


 */
@Event()
public pdfExportComplete: EmitType<PdfExportCompleteArgs>;
    /**
     * Export TreeGrid data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>} 
     */
    public excelExport(
      excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean,
      /* tslint:disable-next-line:no-any */
      workbook?: any, isBlob?: boolean): Promise<any> {
      return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, false);
    }
  /**
   * Export TreeGrid data to CSV file.
   * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
   * @param  {boolean} isMultipleExport - Define to enable multiple export.
   * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
   * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
   * @return {Promise<any>} 
   * 
   */
  public csvExport(
      excelExportProperties?: ExcelExportProperties,
      /* tslint:disable-next-line:no-any */
      isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Promise<any> {
      return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, true);
  }
  /**
   * Export TreeGrid data to PDF document.
   * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
   * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
   * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
   * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
   * @return {Promise<any>} 
   * 
   */
  public pdfExport(
      pdfExportProperties?: PdfExportProperties,
      /* tslint:disable-next-line:no-any */
      isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Promise<Object> {
      return this.pdfExportModule.Map(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
  }


  /**
   * For internal use only - Get the module name.
   * @private
   */
  protected getModuleName(): string {
    return 'treegrid';
  }

  /**
   * For internal use only - Initialize the event handler;
   * @private
   */
  protected preRender(): void {
    this.TreeGridLocale();
    this.initProperties();
    this.defaultLocale = {
      Above: 'Above',
      Below: 'Below',
      AddRow: 'Add Row',
      ExpandAll: 'Expand All',
      CollapseAll: 'Collapse All',
      RowIndent: 'Indent',
      RowOutdent: 'Outdent'
    };
    if (this.isSelfReference && isNullOrUndefined(this.childMapping)) {
      this.childMapping = 'Children';
    }
  }

 /** 
  * Sorts a column with the given options. 
  * @param {string} columnName - Defines the column name to be sorted.  
  * @param {SortDirection} direction - Defines the direction of sorting field.  
  * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained. 
  * @return {void} 
  */
  public sortByColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
      this.sortModule.sortColumn(columnName, direction, isMultiSort);
  }

  /**  
   * Clears all the sorted columns of the TreeGrid.  
   * @return {void} 
   */
  public clearSorting() : void {
    if (this.sortModule) {
      this.sortModule.clearSorting();
    }
  }

  /** 
   * Remove sorted column by field name. 
   * @param {string} field - Defines the column field name to remove sort.  
   * @return {void} 

   */
  public removeSortColumn(field: string): void {
    this.sortModule.removeSortColumn(field);
  }



 /**
  * Searches TreeGrid records using the given key.
  * You can customize the default search option by using the
  * [`searchSettings`](./api-searchSettings.html).
  * @param  {string} searchString - Defines the key.
  * @return {void}
  */
  public search(searchString: string): void {
      this.grid.search(searchString);
  }

  /** 
   * Changes the column width to automatically fit its content to ensure that the width shows the content without wrapping/hiding.
   * > * This method ignores the hidden columns.
   * > * Uses the `autoFitColumns` method in the `dataBound` event to resize at initial rendering.
   * @param  {string |string[]} fieldNames - Defines the column names. 
   * @return {void} 
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
   * @param  {string} fromFName - Defines the origin field name. 
   * @param  {string} toFName - Defines the destination field name. 
   * @return {void} 
   */
  public reorderColumns(fromFName: string | string[], toFName: string): void {
    this.grid.reorderColumns(fromFName, toFName);
  }

  private TreeGridLocale(): void {
     /* tslint:disable-next-line:no-any */
    let locale: any = (L10n as any).locale;
    let localeObject: Object; localeObject = {}; setValue(this.locale, {}, localeObject);
    let gridLocale: Object; gridLocale = {}; gridLocale = getObject(this.locale, locale);
    let treeGridLocale: Object; treeGridLocale = {};
    treeGridLocale = getObject(this.getModuleName(), gridLocale);
    setValue('grid', treeGridLocale, getObject(this.locale, localeObject));
    L10n.load(localeObject);
  }

  /**
   * By default, prints all the pages of the TreeGrid and hides the pager.
   * > You can customize print options using the 
   * [`printMode`](./api-treegrid.html#printmode-string). 
   * @return {void}
   */
  public print(): void {
    this.printModule.print();
  }

  private treeGridkeyActionHandler(e: KeyboardEventArgs): void {
    if (this.allowKeyboard) {
      switch (e.action) {
        case 'ctrlDownArrow':
          this.expandAll();
          break;
        case 'ctrlUpArrow':
          this.collapseAll();
          break;
        case 'ctrlShiftUpArrow':
          let collapsetarget: HTMLElement = <HTMLElement>e.target;
          let collapsecolumn: HTMLElement = <HTMLElement>collapsetarget.closest('.e-rowcell');
          let collapserow : HTMLElement = <HTMLElement>collapsecolumn.closest('tr');
          this.expandCollapseRequest(<HTMLElement>collapserow.querySelector('.e-treegridexpand'));
          break;
        case 'ctrlShiftDownArrow':
          let expandtarget: HTMLElement = <HTMLElement>e.target;
          let expandcolumn: HTMLElement = <HTMLElement>expandtarget.closest('.e-rowcell');
          let expandrow: HTMLElement = <HTMLElement>expandcolumn.closest('tr');
          this.expandCollapseRequest(<HTMLElement>expandrow.querySelector('.e-treegridcollapse'));
          break;
          case 'downArrow':
            let target: HTMLElement = (<HTMLTableCellElement>e.target).parentElement;
            let summaryElement: Element = this.findnextRowElement(target);
            if (summaryElement !== null) {
              let rowIndex: number = (<HTMLTableRowElement>summaryElement).rowIndex;
              this.selectRow(rowIndex);
              let cellIndex: number = (<HTMLTableCellElement>e.target).cellIndex;
              let row: Element = (<HTMLTableRowElement>summaryElement).children[cellIndex];
              addClass([row], 'e-focused');
              addClass([row], 'e-focus');
            } else {
                this.clearSelection();
            }
          break;
        case 'upArrow':
          let targetRow: HTMLElement = (<HTMLTableCellElement>e.target).parentElement;
          let summaryRowElement: Element = this.findPreviousRowElement(targetRow);
          if (summaryRowElement !== null) {
            let rIndex: number = (<HTMLTableRowElement>summaryRowElement).rowIndex;
            this.selectRow(rIndex);
            let cIndex: number = (<HTMLTableCellElement>e.target).cellIndex;
            let rows: Element = (<HTMLTableRowElement>summaryRowElement).children[cIndex];
            addClass([rows], 'e-focused');
            addClass([rows], 'e-focus');
          } else {
            this.clearSelection();
          }
      }
    }
  }

  // Get Proper Row Element from the summary 

  private findnextRowElement(summaryRowElement: HTMLElement ): Element {
    let rowElement: Element = <Element>summaryRowElement.nextSibling;
    if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
        (<HTMLTableRowElement>rowElement).style.display === 'none')) {
        rowElement = this.findnextRowElement(<HTMLElement>rowElement);
    }
    return rowElement;
  }

  // Get Proper Row Element from the summary 

  private findPreviousRowElement(summaryRowElement: HTMLElement ): Element {
    let rowElement: Element = <Element>summaryRowElement.previousSibling;
    if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
        (<HTMLTableRowElement>rowElement).style.display === 'none')) {
        rowElement = this.findPreviousRowElement(<HTMLElement>rowElement);
    }
    return rowElement;
  }

  private initProperties(): void {
    this.defaultLocale = {};
    this.flatData = [];
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

   */
  public wireEvents(): void {
    EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
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
     * @return {ModuleDeclaration[]}

     */
    public requiredModules(): ModuleDeclaration[] {
      let modules: ModuleDeclaration[] = [];
      if (this.isDestroyed) { return modules; }
      modules.push({
        member: 'filter', args: [this, this.filterSettings]
      });
      if (!isNullOrUndefined(this.toolbar)) {
          modules.push({
              member: 'toolbar',
              args: [this]
          });
      }
      if (this.contextMenuItems) {
        modules.push({
          member: 'contextMenu',
          args: [this]
        });
      }
      if (this.allowPaging) {
        modules.push({
            member: 'pager',
            args: [this, this.pageSettings]
        });
      }
      if (this.allowReordering) {
        modules.push({
          member: 'reorder',
          args: [this]
        });
      }
      if (this.allowSorting) {
        modules.push({
          member: 'sort',
          args: [this]
        });
      }
      if (this.aggregates.length > 0) {
        modules.push({
          member: 'summary', args: [this]
        });
      }
      modules.push({
        member: 'resize', args: [this]
      });
      if (this.allowExcelExport) {
        modules.push({
          member: 'ExcelExport', args: [this]
        });
      }
      if (this.frozenColumns || this.frozenRows || this.getFrozenColumns()) {
        modules.push({
          member: 'freeze', args: [this]
        });
      }
      if (this.detailTemplate) {
        modules.push({
          member: 'detailRow', args: [this]
        });
      }
      if (this.allowPdfExport) {
        modules.push({
          member: 'PdfExport', args: [this]
        });
      }
      if (this.showColumnMenu) {
        modules.push({
          member: 'columnMenu', args: [this]
        });
      }
      if (this.allowRowDragAndDrop) {
        modules.push({
          member: 'rowDragAndDrop',
          args: [this]
        });
      }
      if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
        modules.push({
          member: 'edit',
          args: [this]
        });
      }
      if (this.isCommandColumn(<Column[]>this.columns)) {
        modules.push({
            member: 'commandColumn',
            args: [this]
        });
      }
      if (this.allowSelection) {
        modules.push({
          member: 'selection',
          args: [this]
        });
      }
      if (this.enableVirtualization) {
        modules.push({
            member: 'virtualScroll',
            args: [this]
        });
      }
      return modules;
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

     */
    public unwireEvents(): void {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
    }

  /**
   * For internal use only - To Initialize the component rendering.
   * @private
   */
  protected render(): void {
    createSpinner({ target: this.element }, this.createElement);
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
    let gridContainer: Element = createElement('div', {id: this.element.id + '_gridcontrol'});
    addClass([this.element], 'e-treegrid');
    if (!isNullOrUndefined(this.height) && typeof(this.height) === 'string' && this.height.indexOf('%') !== -1) {
      this.element.style.height = this.height;
    }
    if (!isNullOrUndefined(this.width) && typeof(this.width) === 'string' && this.width.indexOf('%') !== -1) {
      this.element.style.width = this.width;
    }
    this.element.appendChild(gridContainer);
    this.grid.appendTo(gridContainer as HTMLElement);
    this.wireEvents();
    this.renderComplete();
  }
  private convertTreeData(data: Object): void {
    if (data instanceof Array && data.length > 0 && (<Object>data[0]).hasOwnProperty('level')) {
        this.flatData = isCountRequired(this) ? getValue('result', data) : data;
        this.flatData.filter((e: ITreeData) => {
          setValue('uniqueIDCollection.' + e.uniqueID, e, this);
          if (e.level === 0) {
            this.parentData.push(e);
          }
        });
    } else {
      if (isCountRequired(this)) {
        let griddata: Object[] = getValue('result', this.dataSource);
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
    let edit: GridEditModel = {};
    this.bindedDataSource();
    this.grid.enableRtl = this.enableRtl;
    this.grid.allowKeyboard = this.allowKeyboard;
    this.grid.columns = this.getGridColumns(this.columns as Column[]);
    this.grid.allowExcelExport = this.allowExcelExport;
    this.grid.allowPdfExport = this.allowPdfExport;
    this.grid.query = this.query;
    this.grid.columnQueryMode = this.columnQueryMode;
    this.grid.allowPaging = this.allowPaging;
    this.grid.pageSettings = getActualProperties(this.pageSettings);
    this.grid.pagerTemplate = this.pagerTemplate;
    this.grid.showColumnMenu = this.showColumnMenu;
    this.grid.allowSorting = this.allowSorting;
    this.grid.allowFiltering = this.allowFiltering;
    this.grid.enableVirtualization = this.enableVirtualization;
    this.grid.width = this.width;
    this.grid.height = this.height;
    this.grid.enableAltRow = this.enableAltRow;
    this.grid.allowReordering = this.allowReordering;
    this.grid.allowTextWrap = this.allowTextWrap;
    this.grid.allowResizing = this.allowResizing;
    this.grid.enableHover = this.enableHover;
    this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop;
    this.grid.rowDropSettings = getActualProperties(this.rowDropSettings);
    this.grid.rowHeight = this.rowHeight;
    this.grid.gridLines = this.gridLines;
    this.grid.allowSelection = this.allowSelection;
    this.grid.toolbar = getActualProperties(this.getGridToolbar());
    this.grid.toolbarTemplate = this.toolbarTemplate;
    this.grid.filterSettings = getActualProperties(this.filterSettings);
    this.grid.selectionSettings = getActualProperties(this.selectionSettings);
    this.grid.sortSettings = getActualProperties(this.sortSettings);
    this.grid.searchSettings = getActualProperties(this.searchSettings);
    this.grid.aggregates = getActualProperties(this.aggregates);
    this.grid.textWrapSettings = getActualProperties(this.textWrapSettings);
    this.grid.printMode = getActualProperties(this.printMode);
    this.grid.locale = getActualProperties(this.locale);
    this.grid.selectedRowIndex = this.selectedRowIndex;
    this.grid.contextMenuItems = getActualProperties(this.getContextMenu());
    this.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
    this.grid.editSettings = this.getGridEditSettings();
    this.grid.rowTemplate = getActualProperties(this.rowTemplate);
    this.grid.detailTemplate = getActualProperties(this.detailTemplate);
    this.grid.frozenRows = this.frozenRows;
    this.grid.frozenColumns = this.frozenColumns;
    let templateInstance: string = 'templateDotnetInstance';
    this.grid[templateInstance] = this[templateInstance];
    let isJsComponent: string = 'isJsComponent';
    this.grid[isJsComponent] = true;
  }
  private triggerEvents(args?: Object): void {
    this.trigger(getObject('name', args), args);
  }
  private bindGridEvents(): void {
    let treeGrid: TreeGrid = this;
    this.grid.rowSelecting = this.triggerEvents.bind(this);
    this.grid.rowSelected = (args: RowDeselectEventArgs): void => {
      this.selectedRowIndex = this.grid.selectedRowIndex;
      treeGrid.notify(events.rowSelected, args);
      this.trigger(events.rowSelected, args);
    };
    this.grid.rowDeselected = (args: RowDeselectEventArgs): void => {
      this.selectedRowIndex = this.grid.selectedRowIndex;
      if (isBlazor()) {
        let data: string = 'data'; let rowIndex: string = 'rowIndex';
        let row: string = 'row';
        args[data] = args[data][args[data].length - 1];
        args[rowIndex] = args[rowIndex][args[rowIndex].length - 1];
        args[row] = args[row][args[row].length - 1];
      }
      this.trigger(events.rowDeselected, args);
    };
    this.grid.resizeStop = (args: ResizeArgs): void => {
      this.updateColumnModel();
      this.trigger(events.resizeStop, args);
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
    this.grid.rowDeselecting = this.triggerEvents.bind(this);
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
    this.grid.printComplete = this.triggerEvents.bind(this);
    this.grid.cellEdit = this.triggerEvents.bind(this);
    this.grid.actionFailure = this.triggerEvents.bind(this);
    this.grid.dataBound = (args: Object): void => {
      this.updateRowTemplate(args); this.updateColumnModel();
      this.updateAltRow(this.getRows()); this.notify('dataBoundArg', args);
      this.trigger(events.dataBound, args);
      if (isRemoteData(this) && !isOffline(this) && !this.hasChildMapping) {
        let req: number = getObject('dataSource.requests', this).filter((e: Ajax) => {
          return e.httpRequest.statusText !== 'OK';
        }).length;
        setValue('grid.contentModule.isLoaded', !(req > 0), this);
      }
      this.initialRender = false;
    };
    this.grid.beforeDataBound = function (args: BeforeDataBoundArgs): void | Deferred  {
      let dataSource: string = 'dataSource'; let requestType: string = getObject('action', args);
      if (isRemoteData(treeGrid) && !isOffline(treeGrid) && requestType !== 'edit') {
        treeGrid.notify('updateRemoteLevel', args);
        args = <BeforeDataBoundArgs>(treeGrid.dataResults);
      } else if (treeGrid.flatData.length === 0 && isOffline(treeGrid) && treeGrid.dataSource instanceof DataManager) {
        let dm: DataManager = <DataManager>treeGrid.dataSource;
        treeGrid.dataModule.convertToFlatData(dm.dataSource.json);
        args.result = treeGrid.grid.dataSource[dataSource].json = treeGrid.flatData;
      }
      if (!isRemoteData(treeGrid) && !isCountRequired(this) && !isNullOrUndefined(treeGrid.dataSource)) {
        if ((<IGrid>this).isPrinting) {
          setValue('isPrinting',  true, args);
        }
        treeGrid.notify('dataProcessor', args);
        //args = this.dataModule.dataProcessor(args);
      }
      extend(args, treeGrid.dataResults);
      // this.notify(events.beforeDataBound, args);
      if (!(<IGrid>this).isPrinting) {
        let callBackPromise: Deferred = new Deferred();
        treeGrid.trigger(events.beforeDataBound, args, (beforeDataBoundArgs: BeforeDataBoundArgs) => {
          callBackPromise.resolve(beforeDataBoundArgs);
        });
        return callBackPromise;
      }
    };
    this.extendedGridEvents();
    this.extendedGridEditEvents();
    this.bindGridDragEvents();
    this.bindCallBackEvents();
  }
  private bindCallBackEvents(): void {
    this.grid.toolbarClick = (args: ClickEventArgs): Deferred | void => {
      let callBackPromise: Deferred = new Deferred();
      this.trigger(events.toolbarClick, args, (toolbarargs: ClickEventArgs) => {
        if (!toolbarargs.cancel) {
          this.notify(events.toolbarClick, args);
        }
        callBackPromise.resolve(toolbarargs);
      });
      return callBackPromise;
    };
    this.grid.cellSelecting = (args: CellSelectingEventArgs): Deferred | void => {
      let callBackPromise: Deferred = new Deferred();
      this.trigger(getObject('name', args), args, (cellselectingArgs: CellSelectingEventArgs) => {
        callBackPromise.resolve(cellselectingArgs);
      });
      return callBackPromise;
    };
    this.grid.beginEdit = (args: BeginEditArgs): Deferred | void => {
      let callBackPromise: Deferred = new Deferred();
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
        this.trigger(events.dataStateChange, args);
      }
    };
    this.grid.cellSave = (args: CellSaveArgs): Deferred | void => {
      if (this.grid.isContextMenuOpen()) {
        let contextitems: HTMLElement;
        contextitems = <HTMLElement>this.grid.contextMenuModule.contextMenu.element.getElementsByClassName('e-selected')[0];
        if ((isNullOrUndefined(contextitems) || contextitems.id !== this.element.id + '_gridcontrol_cmenu_Save')) {
          args.cancel = true;
        }
      }
      let callBackPromise: Deferred = new Deferred();
      this.trigger(events.cellSave, args, (cellsaveArgs: CellSaveArgs) => {
        if (isBlazor()) {
          cellsaveArgs.cell = getElement(cellsaveArgs.cell);
         }
        if (!cellsaveArgs.cancel) {
          this.notify(events.cellSave, cellsaveArgs);
        }
        callBackPromise.resolve(cellsaveArgs);
      });
      return callBackPromise;
    };
    // this.grid.cellSaved = (args: CellSaveArgs): void => {
    //   this.trigger(events.cellSaved, args);
    //   this.notify(events.cellSaved, args);
    // };
    this.grid.cellEdit = (args: BatchAddArgs): Deferred | void => {
        let prom: string = 'promise';
        let promise: Deferred = new Deferred();
        args[prom] = promise;
        this.notify(events.cellEdit, args);
        return promise;
    };
    // this.grid.batchAdd = (args: BatchAddArgs): void => {
    //   this.trigger(events.batchAdd, args);
    //   this.notify(events.batchAdd, args);
    // }
    // this.grid.beforeBatchSave = (args: BeforeBatchSaveArgs): void => {
    //   this.trigger(events.beforeBatchSave, args);
    //   this.notify(events.beforeBatchSave, args);
    // }
    // this.grid.beforeBatchAdd = (args: BeforeBatchAddArgs): void => {
    //   this.trigger(events.beforeBatchAdd, args);
    //   this.notify(events.beforeBatchAdd, args);
    // }
    // this.grid.batchDelete = (args: BatchDeleteArgs): void => {
    //   this.trigger(events.batchDelete, args);
    //   this.notify(events.batchDelete, args);
    // }
    this.grid.batchCancel = (args: BatchCancelArgs): void => {
      if (this.editSettings.mode !== 'Cell') {
        this.trigger(events.batchCancel, args);
      }
      this.notify(events.batchCancel, args);
      };
  }

  private updateRowTemplate(args: Object): void {
      if (isBlazor()) {
        setTimeout(
          () => {
            this.treeColumnRowTemplate(args);
          },
          1000
        );
      } else {
        this.treeColumnRowTemplate(args);
      }
  }

  private bindedDataSource(): void {
    let dataSource: string = 'dataSource';
    let isDataAvailable: string = 'isDataAvailable';
    let adaptor: string = 'adaptor';
    let ready: string = 'ready';
    let adaptorName: string = 'adaptorName';
    let dotnetInstance: string = 'dotnetInstance';
    let key: string = 'key';
    if (this.dataSource && isCountRequired(this)) {
      let data: Object[] = this.flatData;
      let datacount: number = getValue('count', this.dataSource);
      this.grid.dataSource = { result: data, count: datacount };
    } else {
      this.grid.dataSource = !(this.dataSource instanceof DataManager) ?
      this.flatData : new DataManager(this.dataSource.dataSource, this.dataSource.defaultQuery, this.dataSource.adaptor);
    }
    if (isBlazor() && this.dataSource instanceof DataManager) {
      this.grid.dataSource[adaptorName] = this.dataSource[adaptorName];
      this.grid.dataSource[dotnetInstance] = this.dataSource[dotnetInstance];
      this.grid.dataSource[key] = this.dataSource[key];
    }
    if (this.dataSource instanceof DataManager && (this.dataSource.dataSource.offline || this.dataSource.ready)) {
      this.grid.dataSource[dataSource].json = extendArray(this.dataSource[dataSource].json);
      this.grid.dataSource[ready] = this.dataSource.ready;
      let dm: object = this.grid.dataSource;
      if ( !isNullOrUndefined(this.grid.dataSource[ready]) ) {
        this.grid.dataSource[ready].then((e: ReturnOption): void => {
          dm[dataSource].offline = true;
          dm[isDataAvailable] = true;
          dm[dataSource].json = e.result;
          dm[adaptor] = new JsonAdaptor();
        } );
      }
    }
  }

  private extendedGridEvents(): void {
    let treeGrid: TreeGrid = this;
    this.grid.recordDoubleClick =  (args: RecordDoubleClickEventArgs) => {
      this.trigger(events.recordDoubleClick, args);
      this.notify(events.recordDoubleClick, args);
    };
    this.grid.detailDataBound = (args: DetailDataBoundEventArgs): void => {
      this.notify('detaildataBound', args);
      this.trigger(events.detailDataBound, args);
    };
    this.grid.actionBegin = (args: ActionEventArgs): Deferred| void => {
      if (args.requestType === 'sorting' && args.target && args.target.parentElement.classList.contains('e-hierarchycheckbox')) {
        args.cancel = true;
      }
      let requestType: string = getObject('requestType', args);
      if (requestType === 'reorder') {
        this.notify('getColumnIndex', {});
      }
      this.notify('actionBegin', { editAction: args });
      if (!isRemoteData(this) && !isNullOrUndefined(this.filterModule) && !isCountRequired(this)
        && (this.grid.filterSettings.columns.length === 0 || this.grid.searchSettings.key.length === 0)) {
        this.notify('clearFilters', { flatData: this.grid.dataSource });
        this.grid.dataSource = this.dataResults.result;
      }
      let callBackPromise: Deferred = new Deferred();
      if (isBlazor() && args.requestType === 'delete') {
        let data: string = 'data'; args[data] = args[data][0];
      }
      this.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
        if (!actionArgs.cancel) {
          this.notify(events.beginEdit, actionArgs);
        }
        if (isBlazor() && actionArgs.requestType === 'delete') {
          let data: string = 'data'; actionArgs[data] = this.getSelectedRecords();
        }
        if (isBlazor() && actionArgs.requestType === 'beginEdit') {
          actionArgs.row = getElement(actionArgs.row);
        }
        callBackPromise.resolve(actionArgs);
      });
      return callBackPromise;
    };
    this.grid.actionComplete = (args: CellSaveEventArgs) => {
      this.notify('actioncomplete', args);
      this.updateColumnModel();
      this.updateTreeGridModel();
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
      if (isBlazor() && args.requestType === 'delete') {
        let data: string = 'data'; args[data] = args[data][0];
      }
      this.trigger(events.actionComplete, args);
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
    let treeGrid: TreeGrid = this;
    this.grid.rowDragStartHelper = (args: RowDragEventArgs): void => {
      treeGrid.trigger(events.rowDragStartHelper, args);
    };
    this.grid.rowDragStart = (args: RowDragEventArgs): void => {
      treeGrid.trigger(events.rowDragStart, args);
    };
    this.grid.rowDrag = (args: RowDragEventArgs): void => {
      treeGrid.notify(events.rowdraging, args);
      treeGrid.trigger(events.rowDrag, args);
    };
    this.grid.rowDrop = (args: RowDropEventArgs): void => {
      treeGrid.notify(events.rowDropped, args);
      args.cancel = true;
    };
  }

  /**
   * Renders TreeGrid component
   * @private
   */
  protected loadGrid(): void {
    this.bindGridProperties();
    this.bindGridEvents();
    setValue('registeredTemplate', this.registeredTemplate, this.grid);
    let ref: string = 'viewContainerRef';
    setValue('viewContainerRef', this[ref], this.grid);
  }

  /**
   * AutoGenerate TreeGrid columns from first record

   */
  private autoGenerateColumns(): void {
    if (!this.columns.length && (!this.dataModule.isRemote() && Object.keys(this.dataSource).length)) {
      let record: Object;
      // if (this.dataSource instanceof DataManager) {
      //   record = (<DataManager>this.dataSource).dataSource.json[0];
      // } else {
      record = this.dataSource[0];
      // }
      let keys: string[] = Object.keys(record);
      for (let i: number = 0; i < keys.length; i++) {
        if ([this.childMapping, this.parentIdMapping].indexOf(keys[i]) === -1) {
          (<string[]>this.columns).push(keys[i]);
        }
      }
    }
  }

private getGridEditSettings(): GridEditModel {
 let edit: GridEditModel = {};
 let guid: string = 'guid';
 edit.allowAdding = this.editSettings.allowAdding;
 edit.allowEditing = this.editSettings.allowEditing;
 edit.allowDeleting = this.editSettings.allowDeleting;
 edit.newRowPosition = this.editSettings.newRowPosition === 'Bottom' ? 'Bottom' : 'Top';
 edit.allowEditOnDblClick = this.editSettings.allowEditOnDblClick;
 edit.showConfirmDialog = this.editSettings.showConfirmDialog; edit.template = this.editSettings.template;
 edit.showDeleteConfirmDialog = this.editSettings.showDeleteConfirmDialog;
 edit[guid] = this.editSettings[guid];
 edit.dialog = this.editSettings.dialog;
 switch (this.editSettings.mode) {
   case 'Dialog' :
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

   */
  private getContextMenu(): Object[] {
    if (this.contextMenuItems) {
      let items: Object[] = [];
      for (let i: number = 0; i < this.contextMenuItems.length; i++) {
        let item: ContextMenuItemModel;
        switch (this.contextMenuItems[i]) {
          case 'AddRow':
          case ContextMenuItems.AddRow:
          items.push(<ContextMenuItemModel>{ text: 'AddRow' , target: '.e-content' , id: this.element.id + '_gridcontrol_cmenu_AddRow' ,
                 items: [{ text: 'Above' , id: 'Above' }, { text: 'Below' , id: 'Below'}]});
               break;
          default:
            items.push(this.contextMenuItems[i]);
        }
      }
      return items;
    } else {
      return null;
    }
  }

  /**
   * Defines grid toolbar from treegrid toolbar model

   */
  private getGridToolbar(): Object[] {
    if (this.toolbar) {
      this.l10n = new L10n('treegrid', this.defaultLocale, this.locale);
      let items: Object[] = [];
      for (let i: number = 0; i < this.toolbar.length; i++) {
        let item: ItemModel;
        switch (this.toolbar[i]) {
          case 'Search':
          case ToolbarItem.Search:
            items.push('Search'); break;
          case 'Print':
          case ToolbarItem.Print:
            items.push('Print'); break;
          case 'ExpandAll':
          case ToolbarItem.ExpandAll:
            let tooltipText: string = this.l10n.getConstant('ExpandAll');
            items.push(<ItemModel>{text: tooltipText, tooltipText: tooltipText,
                   prefixIcon: 'e-expand', id: this.element.id + '_gridcontrol_expandall' });
            break;
          case 'CollapseAll':
          case ToolbarItem.CollapseAll:
            let tooltip: string = this.l10n.getConstant('CollapseAll');
            items.push(<ItemModel>{text: tooltip,
              tooltipText: tooltip, prefixIcon: 'e-collapse', id: this.element.id + '_gridcontrol_collapseall'
            });
            break;
          case 'Indent':
          case ToolbarItem.RowIndent:
            let tooltipindent: string = this.l10n.getConstant('RowIndent');
            items.push(<ItemModel>{
              text: tooltipindent, tooltipText: tooltipindent,
              prefixIcon: 'e-indent', id: this.element.id + '_gridcontrol_indent'
            });
            break;
          case 'Outdent':
          case ToolbarItem.RowOutdent:
            let tooltipoutdent: string = this.l10n.getConstant('RowOutdent');
            items.push(<ItemModel>{
              text: tooltipoutdent, tooltipText: tooltipoutdent,
              prefixIcon: 'e-outdent', id: this.element.id + '_gridcontrol_outdent'
            });
            break;
          default:
            items.push(this.toolbar[i]);
        }
      }
      return items;
    } else {
      return null;
    }

  }

  /**
   * Convert TreeGrid ColumnModel to Grid Column

   */
  private getGridColumns(columns: Column[]): GridColumnModel[] {
    let column: Column[] | ColumnModel[] | string[] = columns;
    this.columnModel = [];
    let treeGridColumn: ColumnModel;
    let gridColumn: GridColumnModel;
    let gridColumnCollection: GridColumnModel[] = [];
    for (let i: number = 0; i < column.length; i++) {
      gridColumn = {}; treeGridColumn = {};
      if (typeof this.columns[i] === 'string') {
        gridColumn.field =  treeGridColumn.field = <string>this.columns[i];
      } else {
        for (let prop of Object.keys(column[i])) {
          gridColumn[prop] =  treeGridColumn[prop] = column[i][prop];
        }
      }
      if (column[i].columns) {
        this.getGridColumns(columns[i].columns as Column[]);
      } else {
        this.columnModel.push(new Column(treeGridColumn));
      }
      gridColumnCollection.push(gridColumn);
    }
    return gridColumnCollection;
  }

  /**
   * Called internally if any of the property value changed.

   */

  /* tslint:disable-next-line:max-line-length */
  // tslint:disable-next-line:max-func-body-length
  public onPropertyChanged(newProp: TreeGridModel, oldProp: TreeGridModel): void {
    let properties: string[] = Object.keys(newProp);
    let requireRefresh: boolean = false;
    for (let prop of properties) {
      switch (prop) {
        case 'columns':
        this.grid.columns = this.getGridColumns(this.columns as Column[]); break;
        case 'treeColumnIndex':
          this.grid.refreshColumns(); break;
        case 'allowPaging':
           this.grid.allowPaging = this.allowPaging; break;
        case 'pageSettings':
          this.grid.pageSettings = getActualProperties(this.pageSettings);
          requireRefresh = true;
          break;
        case 'enableVirtualization':
          this.grid.enableVirtualization = this.enableVirtualization;
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
          this.grid.filterSettings = getActualProperties(this.filterSettings); break;
        case 'showColumnMenu':
          this.grid.showColumnMenu = this.showColumnMenu; break;
        case 'allowRowDragAndDrop':
          this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop; break;
        case 'aggregates':
          this.grid.aggregates = getActualProperties(this.aggregates); break;
        case 'dataSource':
          this.isLocalData = (!(this.dataSource instanceof DataManager) || (!isNullOrUndefined((<DataManager>this.dataSource).ready))
                           || this.dataSource.adaptor instanceof RemoteSaveAdaptor) ;
          this.convertTreeData(this.dataSource);
          if (this.isLocalData) {
            if (isCountRequired(this)) {
              let count: number = getValue('count', this.dataSource);
              this.grid.dataSource = {result: this.flatData, count: count};
            } else {
              this.grid.dataSource = this.flatData;
            }
          } else {
            this.bindedDataSource();
          }
          break;
        case 'query':
          this.grid.query = this.query; break;
        case 'enableCollapseAll':
          if (newProp[prop]) {
                this.collapseAll();
          } else {
                this.expandAll();
          }
          break;
        case 'expandStateMapping':
          this.refresh();
          break;
        case 'gridLines':
          this.grid.gridLines = this.gridLines; break;
        case 'rowTemplate':
          this.grid.rowTemplate = getActualProperties(this.rowTemplate);
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
          this.grid.locale = this.locale; break;
        case 'selectedRowIndex':
          this.grid.selectedRowIndex = this.selectedRowIndex; break;
        case 'enableAltRow':
          this.grid.enableAltRow = this.enableAltRow; break;
        case 'enableHover':
          this.grid.enableHover = this.enableHover; break;
        case 'allowExcelExport':
          this.grid.allowExcelExport = this.allowExcelExport; break;
        case 'allowPdfExport':
          this.grid.allowPdfExport = this.allowPdfExport; break;
        case 'enableRtl':
          this.grid.enableRtl = this.enableRtl; break;
        case 'allowReordering':
          this.grid.allowReordering = this.allowReordering; break;
        case 'allowResizing':
          this.grid.allowResizing = this.allowResizing; break;
        case 'textWrapSettings':
          this.grid.textWrapSettings = getActualProperties(this.textWrapSettings); break;
        case 'allowTextWrap':
          this.grid.allowTextWrap = getActualProperties(this.allowTextWrap);
          this.refresh(); break;
        case 'contextMenuItems':
          this.grid.contextMenuItems = this.getContextMenu(); break;
        case 'detailTemplate':
          this.grid.detailTemplate = getActualProperties(this.detailTemplate); break;
        case 'columnMenuItems':
          this.grid.columnMenuItems = getActualProperties(this.columnMenuItems); break;
        case 'editSettings':
          if (this.grid.isEdit && this.grid.editSettings.mode === 'Normal' && newProp[prop].mode &&
                          (newProp[prop].mode === 'Cell' || newProp[prop].mode === 'Row')) {
            this.grid.closeEdit();
          }
          this.grid.editSettings = this.getGridEditSettings(); break;
      }
      if (requireRefresh) {
        this.refresh();
      }
    }
  }

    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.removeListener();
        this.unwireEvents();
        super.destroy();
        this.grid.destroy();
        this.dataModule.destroy();
        let modules: string[] = ['dataModule', 'sortModule', 'renderModule', 'filterModule', 'printModule',
        'excelExportModule', 'pdfExportModule', 'toolbarModule', 'summaryModule', 'reorderModule', 'resizeModule',
        'pagerModule', 'keyboardModule', 'columnMenuModule', 'contextMenuModule', 'editModule', 'virtualScrollModule',
         'selectionModule', 'detailRow', 'rowDragAndDropModule', 'freezeModule'];
        for (let i: number = 0; i < modules.length; i++) {
            if (this[modules[i]]) {
                this[modules[i]] = null;
            }
        }
        this.element.innerHTML = '';
        this.grid = null;
    }

    /**
     * Update the TreeGrid model
     * @method dataBind
     * @return {void}
     * @private
     */
    public dataBind(): void {
      super.dataBind();
      this.grid.dataBind();
  }

  /**
   * Get the properties to be maintained in the persisted state.
   * @return {string}

   */
  public getPersistData(): string {
    let keyEntity: string[] = ['pageSettings', 'sortSettings',
    'filterSettings', 'columns', 'searchSettings', 'selectedRowIndex'];
    let ignoreOnPersist: { [x: string]: string[] } = {
        pageSettings: ['template', 'pageSizes', 'pageSizeMode', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
        filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent', 'hierarchyMode'],
        searchSettings: ['fields', 'operator', 'ignoreCase'],
        sortSettings: [], columns: [], selectedRowIndex: []
    };
    let ignoreOnColumn: string[] = ['filter', 'edit', 'filterBarTemplate', 'headerTemplate', 'template',
        'commandTemplate', 'commands', 'dataSource'];
    keyEntity.forEach((value: string) => {
        let currentObject: Object = this[value];
        for (let val of ignoreOnPersist[value]) {
            delete currentObject[val];
        }
    });
    this.ignoreInArrays(ignoreOnColumn, <Column[]>this.columns);
    return this.addOnPersist(keyEntity);
  }
  private ignoreInArrays(ignoreOnColumn: string[], columns: Column[]): void {
      columns.forEach((column: Column) => {
          if (column.columns) {
              this.ignoreInColumn(ignoreOnColumn, column);
              this.ignoreInArrays(ignoreOnColumn, <Column[]>column.columns);
          } else {
              this.ignoreInColumn(ignoreOnColumn, column);
          }
      });
  }

  private ignoreInColumn(ignoreOnColumn: string[], column: Column): void {
      ignoreOnColumn.forEach((val: string) => {
          delete column[val];
          column.filter = {};
      });
  }
  private mouseClickHandler(e: MouseEvent & TouchEvent): void {
    if (!isNullOrUndefined(e.touches)) {
        return;
    }
    let target: HTMLElement = <HTMLElement>e.target;
    if (
      target.classList.contains('e-treegridexpand') ||
      target.classList.contains('e-treegridcollapse')
    ) {
      this.expandCollapseRequest(target);
    }
    this.notify('checkboxSelection', {target: target});
  }

  /**
   * Returns TreeGrid rows
   * @return {HTMLTableRowElement[]}
   */
  public getRows(): HTMLTableRowElement[] {
    return this.grid.getRows() as HTMLTableRowElement[];
  }

    /**
     * Gets the pager of the TreeGrid.
     * @return {Element} 
     */
    public getPager(): Element {
      return this.grid.getPager(); //get element from pager
  }

  /**
   * Adds a new record to the TreeGrid. Without passing parameters, it adds empty rows.
   * > `editSettings.allowEditing` should be true.
   * @param {Object} data - Defines the new add record data.
   * @param {number} index - Defines the row index to be added.
   * @param {RowPosition} position - Defines the new row position to be added.
   */
    public addRecord(data?: Object, index?: number,  position?: RowPosition): void {
      this.editModule.addRecord(data, index, position);
  }
  /**
   * Cancels edited state.
   */
    public closeEdit(): void {
      this.grid.editModule.closeEdit();
  }

    /**
     * Delete a record with Given options. If fieldName and data is not given then TreeGrid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldName - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     */
    public deleteRecord(fieldName?: string, data?: Object): void {
      this.grid.editModule.deleteRecord(fieldName, data);
  }

  /**
   * To edit any particular row by TR element.
   * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
   */
  public startEdit(): void {
      this.grid.editModule.startEdit();
  }

  /**
   * To edit any particular cell using row index and cell index.
   * @param {number} rowIndex - Defines row index to edit a particular cell.
   * @param {string} field - Defines the field name of the column to perform cell edit.
   */
  public editCell(rowIndex?: number, field?: string): void {
    this.editModule.editCell(rowIndex, field);
  }

  /**
   * If TreeGrid is in editable state, you can save a record by invoking endEdit.
   */
  public endEdit(): void {
      this.grid.editModule.endEdit();
  }

  /**
   * Delete any visible row by TR element.
   * @param {HTMLTableRowElement} tr - Defines the table row element.
   */
    public deleteRow(tr: HTMLTableRowElement): void {
      this.grid.editModule.deleteRow(tr);
  }

  /**
   * Get the names of the primary key columns of the TreeGrid. 
   * @return {string[]}
   */
    public getPrimaryKeyFieldNames(): string[] {
      return this.grid.getPrimaryKeyFieldNames();
  }

    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.  
     */
    public setCellValue(key: string | number, field: string, value: string | number | boolean | Date): void {
      this.grid.setCellValue(key, field, value);
    }

    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     */
    public setRowData(key: string | number, rowData?: Object): void {
      this.grid.setRowData(key, rowData);
    }

    /** 
     * Navigates to the specified target page. 
     * @param  {number} pageNo - Defines the page number to navigate. 
     * @return {void} 
     */
    public goToPage(pageNo: number): void {
      this.grid.pagerModule.goToPage(pageNo);
  }

    /** 
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update. 
     * @return {void} 
     */
    public updateExternalMessage(message: string): void {
      if (this.pagerModule) {
          this.grid.pagerModule.updateExternalMessage(message);
      }
  }

    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element} 
     */
    public getCellFromIndex(rowIndex: number, columnIndex: number): Element {
      return this.grid.getCellFromIndex(rowIndex, columnIndex);
  }

  /**
   * Gets a Column by column name.
   * @param  {string} field - Specifies the column name.
   * @return {Column}
   */
  public getColumnByField(field: string): Column {
    return iterateArrayOrObject<Column, Column>(<Column[]>this.columnModel, (item: Column, index: number) => {
      if (item.field === field) {
          return item;
      }
      return undefined;
    })[0];
  }

    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     */
    public getColumnByUid(uid: string): Column {
      return iterateArrayOrObject<Column, Column>(<Column[]>this.columnModel, (item: Column, index: number) => {
        if (item.uid === uid) {
            return item;
        }
        return undefined;
    })[0];
  }

    /**
     * Gets the collection of column fields.     
     * @return {string[]}
     */
    public getColumnFieldNames(): string[] {
      return this.grid.getColumnFieldNames();
  }

   /**
    * Gets the footer div of the TreeGrid.
    * @return {Element} 
    */
    public getFooterContent(): Element {
      return this.grid.getFooterContent();
 }

   /**
    * Gets the footer table element of the TreeGrid.
    * @return {Element} 
    */
   public getFooterContentTable(): Element {
      return this.grid.getFooterContentTable();
 }

   /** 
    * Shows a column by its column name. 
    * @param  {string|string[]} keys - Defines a single or collection of column names. 
    * @param  {string} showBy - Defines the column key either as field name or header text. 
    * @return {void} 
    */

  public showColumns(keys: string | string[], showBy?: string): void {
    return this.grid.showColumns(keys, showBy);
  }

   /** 
    * Hides a column by column name. 
    * @param  {string|string[]} keys - Defines a single or collection of column names. 
    * @param  {string} hideBy - Defines the column key either as field name or header text. 
    * @return {void} 
    */
    public hideColumns(keys: string | string[], hideBy?: string): void {
      return this.grid.hideColumns(keys, hideBy);
  }

    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element} 
     */
    public getColumnHeaderByField(field: string): Element {
      return this.grid.getColumnHeaderByField(field);
  }

    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element} 
     */
    public getColumnHeaderByIndex(index: number): Element {
      return this.grid.getColumnHeaderByIndex(index);
  }

    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element} 
     */
    public getColumnHeaderByUid(uid: string): Element {
      return this.grid.getColumnHeaderByUid(uid);
  }

    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    public getColumnIndexByField(field: string): number {
     return this.grid.getColumnIndexByField(field);
  }

    /**
     * Gets a column index by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {number}
     */
  public getColumnIndexByUid(uid: string): number {
    return this.grid.getColumnIndexByUid(uid);
  }

    /**
     * Gets the columns from the TreeGrid.
     * @return {Column[]} 
     */
  public getColumns(isRefresh?: boolean): Column[] {
    this.updateColumnModel(this.grid.getColumns(isRefresh));
    return this.columnModel;
  }

  private updateColumnModel(column?: GridColumn[]): ColumnModel[] {
    let gridColumns: GridColumn[] = isNullOrUndefined(column) ? this.grid.getColumns() : column;
    let gridColumn: ColumnModel;
    this.columnModel = [];
    for (let i: number = 0; i < gridColumns.length; i++) {
      gridColumn = {};
      for (let prop of Object.keys(gridColumns[i])) {
          gridColumn[prop] =  gridColumns[i][prop];
      }
      this.columnModel.push(new Column(gridColumn));
    }
    let merge: string = 'deepMerge';
    this[merge] = ['columns']; // Workaround for blazor updateModel 
    this.setProperties({columns : this.columnModel}, true);
    this[merge] = undefined;  // Workaround for blazor updateModel
    return this.columnModel;
  }

    /**
     * Gets the content div of the TreeGrid.
     * @return {Element} 
     */
    public getContent(): Element {
      return this.grid.getContent();
  }
  private mergePersistTreeGridData(): void {
    let persist1: string = 'mergePersistGridData';
    this.grid[persist1].apply(this);
  }
  private mergeColumns(storedColumn: Column[], columns: Column[]): void {
    let persist2: string = 'mergeColumns';
    this.grid[persist2].apply(this, [storedColumn, columns]);
  }

    private updateTreeGridModel() : void {
      this.setProperties({filterSettings: getObject('properties', this.grid.filterSettings)}, true);
      this.setProperties({pageSettings: getObject('properties', this.grid.pageSettings)}, true);
      this.setProperties({searchSettings: getObject('properties', this.grid.searchSettings)}, true);
      this.setProperties({sortSettings: getObject('properties', this.grid.sortSettings)}, true);
  }

    /**
     * Gets the content table of the TreeGrid.
     * @return {Element} 
     */
    public getContentTable(): Element {
      return this.grid.getContentTable();
  }

    /**
     * Gets all the TreeGrid's data rows.
     * @return {Element[]} 
     */
    public getDataRows(): Element[] {
      let dRows: Element[] = []; let rows: Element[] = this.grid.getDataRows();
      for (let i: number = 0, len: number = rows.length; i < len; i++) {
        if (!rows[i].classList.contains('e-summaryrow')) {
           dRows.push(rows[i] as Element);
        }
      }
      return dRows;
  }

    /** 
     * Get current visible data of TreeGrid.
     * @return {Object[]}

     */
    public getCurrentViewRecords(): Object[] {
      return this.grid.currentViewData;
  }

    /**
     * Gets the header div of the TreeGrid. 
     * @return {Element} 
     */
    public getHeaderContent(): Element {
      return this.grid.getHeaderContent();
  }

    /**
     * Gets the header table element of the TreeGrid.
     * @return {Element} 
     */
    public getHeaderTable(): Element {
      return this.grid.getHeaderTable();
  }

    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element} 
     */
    public getRowByIndex(index: number): Element {
      return this.grid.getRowByIndex(index);
  }

    /**
     * Get a row information based on cell
     * @param {Element}
     * @return RowInfo
     */
    public getRowInfo(target: Element | EventTarget): RowInfo {
      return this.grid.getRowInfo(target);
  }

    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    public getUidByColumnField(field: string): string {
      return this.grid.getUidByColumnField(field);
  }

    /**
     * Gets the visible columns from the TreeGrid.
     * @return {Column[]} 
     */
    public getVisibleColumns(): Column[] {
      let cols: Column[] = [];
      for (let col of this.columnModel) {
          if (col.visible) {
              cols.push(col);
          }
      }
      return cols;
  }

    /**
     * By default, TreeGrid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     */
    public showSpinner(): void {
      showSpinner(this.element);
  }
  /**
   * Manually shown spinner needs to hide by `hideSpinnner`.
   */
  public hideSpinner(): void {
      hideSpinner(this.element);
  }
    /**
     * Refreshes the TreeGrid header and content.
     */
    public refresh(): void {
      this.grid.refresh();
  }

  /** 
   * Get the records of checked rows.
   * @return {Object[]}

   */

    public getCheckedRecords(): Object[] {
      return this.selectionModule.getCheckedrecords();
  }
    /** 
     * Get the indexes of checked rows.
     * @return {number[]}
     */

    public getCheckedRowIndexes(): number[] {
      return this.selectionModule.getCheckedRowIndexes();
    }

    /** 
     * Checked the checkboxes using rowIndexes.
     */

    public selectCheckboxes(indexes: number[]): void {
      this.selectionModule.selectCheckboxes(indexes);
    }


  /**
   * Refreshes the TreeGrid column changes.
   */
  public refreshColumns(): void {
    this.grid.columns = this.getGridColumns(this.columns as Column[]);
    this.grid.refreshColumns();
  }

    /**
     * Refreshes the TreeGrid header.
     */
    public refreshHeader(): void {
      this.grid.refreshHeader();
  }

  /**
   * Expands or collapse child records
   * @return {string}

   */
  private expandCollapseRequest(target: HTMLElement): void {
    if (this.rowTemplate) {
      let rowInfo: HTMLElement = target.closest('.e-treerowcell').parentElement;
      let record: object = this.getCurrentViewRecords()[(<HTMLTableRowElement>rowInfo).rowIndex];
      if (target.classList.contains('e-treegridexpand')) {
        this.collapseRow(<HTMLTableRowElement>rowInfo, record);
      } else {
        this.expandRow(<HTMLTableRowElement>rowInfo, record);
      }
    }else {
      let rowInfo: RowInfo = this.grid.getRowInfo(target);
      let record: ITreeData = <ITreeData>rowInfo.rowData;
      if (target.classList.contains('e-treegridexpand')) {
        this.collapseRow(<HTMLTableRowElement>rowInfo.row, record);
      }else {
        this.expandRow(<HTMLTableRowElement>rowInfo.row, record);
      }
    }
  }
  /**
   * Expands child rows
   * @return {void}
   */
  public expandRow(row: HTMLTableRowElement, record?: Object): void {
    record = this.getCollapseExpandRecords(row, record);
    let args: RowExpandingEventArgs = {data: record, row: row, cancel: false};
    this.trigger(events.expanding, args, (expandingArgs: RowExpandingEventArgs) => {
      if (!expandingArgs.cancel) {
        this.expandCollapse('expand', row, record);
        if (!(isRemoteData(this) && !isOffline(this)) && !isCountRequired(this)) {
          let collapseArgs: RowExpandedEventArgs = { data: record, row: row };
          this.trigger(events.expanded, collapseArgs);
        }
    }
   });
  }
  private getCollapseExpandRecords(row?: HTMLTableRowElement, record?: Object): Object {
    if (this.allowPaging && this.pageSettings.pageSizeMode === 'All' && this.isExpandAll && isNullOrUndefined(record) &&
      !isRemoteData(this)) {
      record = this.flatData.filter((e: ITreeData) => {
        return e.hasChildRecords;
      });
    } else if (isNullOrUndefined(record)) {
      record = <ITreeData>this.grid.getCurrentViewRecords()[row.rowIndex];
    }
    return record;
  }
  /**
   * Collapses child rows
   * @return {void}
   */
  public collapseRow(row: HTMLTableRowElement, record?: Object): void {
    record = this.getCollapseExpandRecords(row, record);
    let args: RowCollapsingEventArgs = {data: record, row: row, cancel: false};
    this.trigger(events.collapsing, args, (collapsingArgs: RowCollapsingEventArgs) => {
      if (!collapsingArgs.cancel) {
        this.expandCollapse('collapse', row, record);
        let collapseArgs: RowCollapsedEventArgs = {data: record, row: row};
        this.trigger(events.collapsed, collapseArgs);
      }
    });
  }

  /**
   * Expands the records at specific hierarchical level
   * @return {void}
   */
  public expandAtLevel(level: number): void {
    if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
      let rec: ITreeData[] =  (<ITreeData[]>this.grid.dataSource).filter((e: ITreeData) => {
        if (e.hasChildRecords && e.level === level) {
          e.expanded = true;
        }
        return e.hasChildRecords && e.level === level;
      });
      this.expandRow(null, rec);
    } else {
      let rec: Object = this.getRecordDetails(level);
      let row: HTMLTableRowElement[] = getObject('rows', rec);
      let record: HTMLTableRowElement[] = getObject('records', rec);
      for (let i: number = 0; i < record.length; i++) {
        this.expandRow(row[i], record[i]);
      }
    }
  }
  private getRecordDetails(level: number) : Object {
    let rows: HTMLTableRowElement[] = this.getRows().filter((e: HTMLTableRowElement) => {
      return (e.className.indexOf('level' + level) !== -1
        && (e.querySelector('.e-treegridcollapse') || e.querySelector('.e-treegridexpand')));
      } );
    let records: ITreeData[] = this.getCurrentViewRecords().filter((e: ITreeData) => {return e.level === level && e.hasChildRecords; });
    let obj: Object = { records: records, rows: rows };
    return obj;
  }
  /**
   * Collapses the records at specific hierarchical level
   * @return {void}
   */
  public collapseAtLevel(level: number): void {
    if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
      let record: ITreeData[] = (<ITreeData[]>this.grid.dataSource).filter((e: ITreeData) => {
          if (e.hasChildRecords && e.level === level) {
            e.expanded = false;
          }
          return e.hasChildRecords && e.level === level;
      });
      this.collapseRow(null, record);
    } else {
      let rec: Object = this.getRecordDetails(level);
      let rows: HTMLTableRowElement[] = getObject('rows', rec);
      let records: HTMLTableRowElement[] = getObject('records', rec);
      for (let i: number = 0  ; i < records.length; i++) {
        this.collapseRow(rows[i], records[i]);
      }
    }
  }

  /**
   * Expands All the rows
   * @return {void}
   */
  public expandAll(): void {
    this.expandCollapseAll('expand');
  }
  /**
   * Collapses All the rows
   * @return {void}
   */
  public collapseAll(): void {
    this.expandCollapseAll('collapse');
  }
  private expandCollapseAll(action: string): void {
    let rows: HTMLTableRowElement[] = this.getRows().filter((e: HTMLTableRowElement) => {
      return e.querySelector('.e-treegrid' + (action  === 'expand' ? 'collapse' : 'expand'));
    });
    this.isExpandAll = true;
    this.isCollapseAll = true;
    if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
      this.flatData.filter((e: ITreeData) => {
        if (e.hasChildRecords) {
          e.expanded = action === 'collapse' ? false : true;
        }
      });
      if (rows.length) {
        action === 'collapse' ? this.collapseRow(rows[0]) :  this.expandRow(rows[0]);
      }
    } else {
        for (let i: number = 0; i < rows.length; i++) {
            action === 'collapse' ? this.collapseRow(rows[i]) : this.expandRow(rows[i]);
        }
    }
    this.isExpandAll = false;
    this.isCollapseAll = false;
  }
  private expandCollapse(action: string, row: HTMLTableRowElement, record?: ITreeData, isChild?: boolean): void {
    let expandingArgs: DataStateChangeEventArgs = { row: row, data: record, childData: [], requestType: action };
    if (!isRemoteData(this) && action === 'expand' && this.isSelfReference) {
      this.updateChildOnDemand(expandingArgs);
    }
    let gridRows: HTMLTableRowElement[] = this.getRows();
    if (this.rowTemplate) {
      let rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
      gridRows = [].slice.call(rows);
    }
    let rowIndex: number;
    if (isNullOrUndefined(row)) {
      rowIndex = this.getCurrentViewRecords().indexOf(record);
      row = gridRows[rowIndex];
    } else {
      rowIndex = +row.getAttribute('aria-rowindex');
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
        let targetEle: Element = row.getElementsByClassName('e-treegridcollapse')[0];
        if (isNullOrUndefined(targetEle)) {
          return;
        }
        addClass([targetEle], 'e-treegridexpand');
        removeClass([targetEle], 'e-treegridcollapse');
      } else {
          displayAction = 'none';
          if (!isChild) {
            record.expanded = false;
            this.uniqueIDCollection[record.uniqueID].expanded = record.expanded;
          }
          let targetEle: Element = row.getElementsByClassName('e-treegridexpand')[0];
          if (isNullOrUndefined(targetEle)) {
            return;
          }
          addClass([targetEle], 'e-treegridcollapse');
          removeClass([targetEle], 'e-treegridexpand');
      }
      let detailrows: HTMLTableRowElement[] = gridRows.filter(
        (r: HTMLTableRowElement) =>
          r.classList.contains(
            'e-griddetailrowindex' + record.index + 'level' + (record.level + 1)
          )
      );
      if (isRemoteData(this) && !isOffline(this)) {
        this.remoteExpand(action, row, record, isChild);
      } else {
        if (!isCountRequired(this) || action === 'collapse') {
          this.localExpand(action, row, record, isChild);
        }
      }
      this.notify('rowExpandCollapse', { detailrows: detailrows, action: displayAction, record: record, row: row });
      this.updateAltRow(gridRows);
    }
  }

  private updateChildOnDemand(expandingArgs: DataStateChangeEventArgs) : void {
      let deff: Deferred = new Deferred();
      let childDataBind: string = 'childDataBind';
      expandingArgs[childDataBind] = deff.resolve;
      let record: ITreeData = expandingArgs.data;
      this.trigger(events.dataStateChange, expandingArgs);
      deff.promise.then((e: ReturnType) => {
        if (expandingArgs.childData.length) {
          let currentData: ITreeData[] = <ITreeData[]>(this.flatData);
          let index: number = 0;
          for (let i: number = 0; i < currentData.length; i++ ) {
            if (currentData[i].taskData === record.taskData) {
              index = i;
              break;
            }
          }
          let data: Object = getValue('result', this.dataSource);
          let childData: ITreeData[] = extendArray(expandingArgs.childData);
          let length: number = record[this.childMapping] ?
            record[this.childMapping].length > childData.length ? record[this.childMapping].length : childData.length : childData.length;
          for (let i: number = 0; i < length; i++) {
            if (record[this.childMapping]) {
              (data as Object[]).filter((e: ITreeData, i: number) => {
                if (e[this.parentIdMapping] === record[this.idMapping]) {
                  (data as Object[]).splice(i, 1);
                }
              });
            }
            if (childData[i]) {
              childData[i].level = record.level + 1;
              childData[i].index = Math.ceil(Math.random() * 1000);
              childData[i].parentItem = extend({}, record);
              childData[i].taskData = extend({}, childData[i]);
              delete childData[i].parentItem.childRecords;
              delete childData[i].taskData.parentItem;
              childData[i].parentUniqueID = record.uniqueID;
              childData[i].uniqueID = getUid(this.element.id + '_data_');
              setValue('uniqueIDCollection.' + childData[i].uniqueID, childData[i], this);
              currentData.splice(index + 1 + i, record[this.childMapping] && record[this.childMapping][i] ? 1 : 0, childData[i]);
            } else {
              currentData.splice(index + 1 + i, 1);
            }
          }
          currentData[index][this.childMapping] = childData;
          currentData[index].childRecords = childData;
          currentData[index].expanded = true;
          setValue('uniqueIDCollection.' + currentData[index].uniqueID, currentData[index], this);
          for (let j: number = 0; j < expandingArgs.childData.length; j++) {
            (data as Object[]).push(expandingArgs.childData[j]);
          }
        }
        this.isExpandRefresh = true;
        this.refresh();
        this.trigger(events.expanded, expandingArgs);
      });
  }

  private remoteExpand(action: string, row: HTMLTableRowElement, record?: ITreeData, isChild?: boolean) : void {
    let gridRows: HTMLTableRowElement[] = this.getRows();
    if (this.rowTemplate) {
      let rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
      gridRows = [].slice.call(rows);
    }
    let args: RowCollapsedEventArgs = {data: record, row: row};
    let rows: HTMLTableRowElement[] = gridRows.filter(
      (r: HTMLTableRowElement) =>
        r.classList.contains(
          'e-gridrowindex' + record.index + 'level' + (record.level + 1)
        )
    );
    if (action === 'expand') {
      this.notify(events.remoteExpand, {record: record, rows: rows, parentRow: row});
      let args: RowExpandedEventArgs = {row: row, data: record};
      if (rows.length > 0) {
        this.trigger(events.expanded, args);
      }
    } else {
      this.collapseRemoteChild(rows);
      this.trigger(events.collapsed, args);
    }
  }
  private localExpand(action: string, row: HTMLTableRowElement, record?: ITreeData, isChild?: boolean) : void {
    let childRecords: ITreeData[] = this.getCurrentViewRecords().filter((e: ITreeData) => {
      return e.parentUniqueID === record.uniqueID ;
    });
    let movableRows: HTMLTableRowElement[];
    let gridRows: HTMLTableRowElement[] = this.getRows();
    if (this.rowTemplate) {
      let rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
      gridRows = [].slice.call(rows);
    }
    let displayAction: string = (action === 'expand') ? 'table-row' : 'none';
    let index: number = (<ITreeData>childRecords[0].parentItem).index;
    let rows: HTMLTableRowElement[] = gridRows.filter(
      (r: HTMLTableRowElement) =>
        r.classList.contains(
          'e-gridrowindex' + record.index + 'level' + (record.level + 1)
        ));
    if (this.frozenRows > 0) {
        movableRows = <HTMLTableRowElement[]>this.getMovableRows().filter(
          (r: HTMLTableRowElement) =>
            r.classList.contains(
            'e-gridrowindex' + record.index + 'level' + (record.level + 1)
          ));
    }
    for (let i: number = 0; i < rows.length; i++) {
      rows[i].style.display = displayAction;
      if (!isNullOrUndefined(movableRows)) {
        movableRows[i].style.display = displayAction;
      }
      this.notify('childRowExpand', { row: rows[i] });
      if (!isNullOrUndefined(childRecords[i].childRecords) && (action !== 'expand' ||
        isNullOrUndefined(childRecords[i].expanded) || childRecords[i].expanded)) {
        this.expandCollapse(action, rows[i], childRecords[i], true);
        if (this.frozenColumns <= this.treeColumnIndex && !isNullOrUndefined(movableRows)) {
          this.expandCollapse(action, movableRows[i], childRecords[i], true );
        }
      }
    }
  }
  private updateAltRow(rows: HTMLTableRowElement[]) : void {
    if (this.enableAltRow && !this.rowTemplate) {
      let visibleRowCount: number = 0;
      for (let i: number = 0; rows && i < rows.length; i++) {
        let gridRow: HTMLTableRowElement = rows[i];
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
  private treeColumnRowTemplate(args: object): void {
    if (this.rowTemplate) {
    let rows: HTMLCollection = (this.getContentTable() as HTMLTableElement).rows;
    rows = [].slice.call(rows);
    for (let i: number = 0; i < rows.length; i++) {
      let rcell: HTMLElement = (this.grid.getContentTable() as HTMLTableElement).rows[i].cells[this.treeColumnIndex];
      let row: object = rows[i];
      let rowData: object = this.grid.getRowsObject()[i].data;
      let arg: object = { data: rowData, row: row, cell: rcell, column: this.getColumns()[this.treeColumnIndex] };
      this.renderModule.cellRender(arg);
    }
    }
  }
  private collapseRemoteChild(rows: HTMLTableRowElement[]): void {
    let rData: ITreeData;
    for (let i: number = 0; i < rows.length; i++) {
      if (this.rowTemplate) {
        rData = this.grid.getCurrentViewRecords()[rows[i].rowIndex];
      } else {
        rData = this.grid.getRowObjectFromUID(rows[i].getAttribute('data-Uid')).data;
      }
      rData.expanded = false;
      rows[i].style.display = 'none';
      let collapsingTd: Element = rows[i].querySelector('.e-detailrowexpand');
      if (!isNullOrUndefined(collapsingTd)) {
        this.grid.detailRowModule.collapse(collapsingTd);
      }
      if (rows[i].querySelector('.e-treecolumn-container .e-treegridexpand')) {
        let expandElement: HTMLElement = rows[i].querySelector('.e-treecolumn-container .e-treegridexpand');
        removeClass([expandElement], 'e-treegridexpand');
        addClass([expandElement], 'e-treegridcollapse');
        let cRow: HTMLTableRowElement[] = [];
        let eRows: HTMLTableRowElement[] = this.getRows();
        for (let i: number = 0; i < eRows.length; i++) {
          if (eRows[i].classList.contains('e-gridrowindex' + rData.index + 'level' + (rData.level + 1))) {
            cRow.push(eRows[i]);
          }
        }
        this.collapseRemoteChild(cRow);
      }
    }
  }
    /**

     */
    public addListener(): void {
      this.on('updateResults', this.updateResultModel, this);
    }
    private updateResultModel(returnResult: BeforeDataBoundArgs): void {
      this.dataResults = <ReturnOption>returnResult;
    }
    /**

     */
    private removeListener(): void {
      if (this.isDestroyed) { return; }
      this.off('updateResults', this.updateResultModel);
    }
    /** 
     * Filters TreeGrid row by column name with the given options. 
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.   
     * @param  {boolean} matchCase - If match case is set to true, TreeGrid filters the records with exact match. if false, it filters case 
     * insensitive records (uppercase and lowercase letters treated the same).  
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true, 
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column. 
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column. 
     * @return {void} 
     */
    public filterByColumn(
      fieldName: string, filterOperator: string, filterValue: string | number | Date | boolean, predicate?: string, matchCase?: boolean,
      ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): void {
      this.grid.filterByColumn(
          fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent,
          actualFilterValue, actualOperator
      );
  }
  /** 
   * Clears all the filtered rows of the TreeGrid.
   * @return {void} 
   */
  public clearFiltering(): void {
      this.grid.clearFiltering();
  }
  /** 
   * Removes filtered column by field name. 
   * @param  {string} field - Defines column field name to remove filter. 
   * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.     
   * @return {void} 

   */
  public removeFilteredColsByField(field: string, isClearFilterBar?: boolean): void {
      this.grid.removeFilteredColsByField(field, isClearFilterBar);
  }
    /**
     * Selects a row by given index. 
     * @param  {number} index - Defines the row index. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    public selectRow(index: number, isToggle?: boolean): void {
      this.grid.selectRow(index, isToggle);
  }

  /**
   * Selects a collection of rows by indexes. 
   * @param  {number[]} rowIndexes - Specifies the row indexes.
   * @return {void}
   */
  public selectRows(rowIndexes: number[]): void {
      this.grid.selectRows(rowIndexes);
  }

  /**
   * Deselects the current selected rows and cells.
   * @return {void}
   */
  public clearSelection(): void {
      this.grid.clearSelection();
  }

  /**
   * Selects a cell by the given index.
   * @param  {IIndex} cellIndex - Defines the row and column indexes. 
   * @param  {boolean} isToggle - If set to true, then it toggles the selection.
   * @return {void}
   */
  public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
      this.grid.selectCell(cellIndex, isToggle);
  }
  /**
   * Gets the collection of selected rows.
   * @return {Element[]}
   */
    public getSelectedRows(): Element[] {
      return this.grid.getSelectedRows();
  }

  /**
   * Gets a movable table cell by row and column index.
   * @param  {number} rowIndex - Specifies the row index.
   * @param  {number} columnIndex - Specifies the column index.
   * @return {Element} 
   */
  public getMovableCellFromIndex(rowIndex: number, columnIndex: number): Element {
    return this.grid.getMovableCellFromIndex(rowIndex, columnIndex);
  }

  /**
   * Gets all the TreeGrid's movable table data rows.
   * @return {Element[]} 
   */
  public getMovableDataRows(): Element[] {
    return this.grid.getMovableDataRows();
  }

  /**
   * Gets a movable tables row by index.
   * @param  {number} index - Specifies the row index.
   * @return {Element} 
   */
  public getMovableRowByIndex(index: number): Element {
    return this.grid.getMovableRowByIndex(index);
  }

  /**
   * Gets the TreeGrid's movable content rows from frozen treegrid.
   * @return {Element[]} 
   */
  public getMovableRows(): Element[] {
    return this.grid.getMovableRows();
  }

  /**

   */
  public getFrozenColumns(): number {
    return this.getFrozenCount(this.columns as Column[], 0);
  }

  private getFrozenCount(cols: Column[], cnt: number): number {
    for (let i: number = 0, len: number = cols.length; i < len; i++) {
      if (cols[i].columns) {
        cnt = this.getFrozenCount(cols[i].columns as Column[], cnt);
      } else {
        if (cols[i].isFrozen) {
          cnt++;
        }
      }
    }
    return cnt;
  }

  /**
   * Gets the collection of selected row indexes.
   * @return {number[]}
   */
  public getSelectedRowIndexes(): number[] {
      return this.grid.getSelectedRowIndexes();
  }

  /**
   * Gets the collection of selected row and cell indexes.
   * @return {number[]}
   */
  public getSelectedRowCellIndexes(): ISelectedCell[] {
      return this.grid.getSelectedRowCellIndexes();
  }

  /**
   * Gets the collection of selected records.

   * @return {Object[]}
   */
  public getSelectedRecords(): Object[] {
      return this.grid.getSelectedRecords();
  }

    /**
     * Gets the data module. 
     * @return {Data}
     */
    public getDataModule(): {baseModule: Data, treeModule: DataManipulation} {
      return {baseModule: this.grid.getDataModule(), treeModule: this.dataModule};
  }

  /**
   * Reorder the rows based on given indexes and position
   */
  public reorderRows(fromIndexes: number[], toIndex: number, position: string): void {
    this.rowDragAndDropModule.reorderRows(fromIndexes, toIndex, position);
  }

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

