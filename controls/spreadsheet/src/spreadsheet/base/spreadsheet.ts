/// <reference path='../../workbook/base/workbook-model.d.ts'/>
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, ModuleDeclaration, Event, isUndefined } from '@syncfusion/ej2-base';
import { addClass, removeClass, EmitType, Complex, formatUnit, L10n, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { detach, select, closest, setStyleAttribute, EventHandler } from '@syncfusion/ej2-base';
import { MenuItemModel, BeforeOpenCloseMenuEventArgs, ItemModel } from '@syncfusion/ej2-navigations';
import { initialLoad, mouseDown, spreadsheetDestroyed, keyUp, BeforeOpenEventArgs, clearViewer, blankWorkbook } from '../common/index';
import { hideShow, performUndoRedo, overlay, DialogBeforeOpenEventArgs, createImageElement, deleteImage} from '../common/index';
import { HideShowEventArgs, sheetNameUpdate, updateUndoRedoCollection, getUpdateUsingRaf, setAutoFit, created } from '../common/index';
import { actionEvents, CollaborativeEditArgs, keyDown, enableFileMenuItems, hideToolbarItems, updateAction } from '../common/index';
import { ICellRenderer, colWidthChanged, rowHeightChanged, hideRibbonTabs, addFileMenuItems, getSiblingsHeight } from '../common/index';
import { defaultLocale, locale, setAriaOptions, setResize, updateToggleItem, initiateFilterUI, clearFilter } from '../common/index';
import { CellEditEventArgs, CellSaveEventArgs, ribbon, formulaBar, sheetTabs, formulaOperation, addRibbonTabs } from '../common/index';
import { addContextMenuItems, removeContextMenuItems, enableContextMenuItems, selectRange, addToolbarItems } from '../common/index';
import { cut, copy, paste, PasteSpecialType, dialog, editOperation, activeSheetChanged, refreshFormulaDatasource } from '../common/index';
import { Render } from '../renderer/render';
import { Scroll, VirtualScroll, Edit, CellFormat, Selection, KeyboardNavigation, KeyboardShortcut, WrapText } from '../actions/index';
import { Clipboard, ShowHide, UndoRedo, SpreadsheetHyperlink, Resize, Insert, Delete, FindAndReplace, Merge } from '../actions/index';
import { ProtectSheet } from '../actions/index';
import { CellRenderEventArgs, IRenderer, IViewport, OpenOptions, MenuSelectEventArgs, click, hideFileMenuItems } from '../common/index';
import { Dialog, ActionEvents, Overlay } from '../services/index';
import { ServiceLocator } from '../../workbook/services/index';
import { SheetModel, getColumnsWidth, getSheetIndex, WorkbookHyperlink, HyperlinkModel, DefineNameModel } from './../../workbook/index';
import { BeforeHyperlinkArgs, AfterHyperlinkArgs, getCellAddress, FindOptions, ValidationModel } from './../../workbook/common/index';
import { activeCellChanged, BeforeCellFormatArgs, afterHyperlinkCreate, getColIndex, CellStyleModel } from './../../workbook/index';
import { BeforeSaveEventArgs, SaveCompleteEventArgs, WorkbookInsert, WorkbookDelete, WorkbookMerge } from './../../workbook/index';
import { getSheetNameFromAddress, DataBind, CellModel, beforeHyperlinkCreate, DataSourceChangedEventArgs } from './../../workbook/index';
import { BeforeSortEventArgs, SortOptions, sortComplete, SortEventArgs, dataSourceChanged } from './../../workbook/index';
import { getSheetIndexFromId, WorkbookEdit, WorkbookOpen, WorkbookSave, WorkbookCellFormat, WorkbookSort } from './../../workbook/index';
import { FilterOptions, FilterEventArgs, ProtectSettingsModel, findKeyUp } from './../../workbook/index';
import { Workbook } from '../../workbook/base/workbook';
import { SpreadsheetModel } from './spreadsheet-model';
import { getRequiredModules, ScrollSettings, ScrollSettingsModel, SelectionSettingsModel, enableToolbarItems } from '../common/index';
import { SelectionSettings, BeforeSelectEventArgs, SelectEventArgs, getStartEvent, enableRibbonTabs } from '../common/index';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { setRowHeight, getRowsHeight, getColumnWidth, getRowHeight } from './../../workbook/base/index';
import { getRangeIndexes, getIndexesFromAddress, getCellIndexes, WorkbookNumberFormat, WorkbookFormula } from '../../workbook/index';
import { RefreshValueArgs, Ribbon, FormulaBar, SheetTabs, Open, ContextMenu, Save, NumberFormat, Formula } from '../integrations/index';
import { Sort, Filter, SpreadsheetImage, SpreadsheetChart } from '../integrations/index';
import { isNumber, getColumn, WorkbookFilter } from '../../workbook/index';
import { PredicateModel } from '@syncfusion/ej2-grids';
import { RibbonItemModel } from '../../ribbon/index';
import { DataValidation } from '../actions/index';
import { WorkbookDataValidation, WorkbookConditionalFormat, WorkbookFindAndReplace } from '../../workbook/actions/index';
import { FindAllArgs, findAllValues, ClearOptions, ConditionalFormatModel, ImageModel } from './../../workbook/common/index';
import { ConditionalFormatting } from '../actions/conditional-formatting';
import { WorkbookImage, WorkbookChart } from '../../workbook/integrations/index';
import { WorkbookProtectSheet } from '../../workbook/actions/index';
/**
 * Represents the Spreadsheet component. 
 * ```html
 * <div id='spreadsheet'></div>
 * <script>
 *  var spreadsheetObj = new Spreadsheet();
 *  spreadsheetObj.appendTo('#spreadsheet');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Spreadsheet extends Workbook implements INotifyPropertyChanged {
    /**
     * To specify a CSS class or multiple CSS class separated by a space, add it in the Spreadsheet root element.
     * This allows you to customize the appearance of component.
     * ```html
     * <div id='spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *  cssClass: 'e-custom1 e-custom2',
     *  ...
     * }, '#spreadsheet');
     * ```
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * It specifies whether the Spreadsheet should be rendered with scrolling or not.
     * To customize the Spreadsheet scrolling behavior, use the [`scrollSettings`]
     * (https://ej2.syncfusion.com/documentation/api/spreadsheet/#scrollSettings) property.
     * @default true
     */
    @Property(true)
    public allowScrolling: boolean;

    /**
     * If `allowResizing` is set to true, spreadsheet columns and rows can be resized.
     * @default true
     */
    @Property(true)
    public allowResizing: boolean;

    /**
     * It enables or disables the clipboard operations (cut, copy, and paste) of the Spreadsheet.
     * @default true
     */
    @Property(true)
    public enableClipboard: boolean;

    /**
     * It enables or disables the context menu option of spreadsheet. By default, context menu will opens for row header,
     * column header, sheet tabs, and cell.
     * @default true
     */
    @Property(true)
    public enableContextMenu: boolean;

    /**
     * It allows you to interact with cell, pager, formula bar, and ribbon through the keyboard device.
     * @default true
     */
    @Property(true)
    public enableKeyboardNavigation: boolean;

    /**
     * It enables shortcut keys to perform Spreadsheet operations like open, save, copy, paste, and more.
     * @default true
     */
    @Property(true)
    public enableKeyboardShortcut: boolean;

    /**
     * It allows to enable/disable undo and redo functionalities.
     * @default true
     */
    @Property(true)
    public allowUndoRedo: boolean;

    /**
     * It allows to enable/disable wrap text feature. By using this feature the wrapping applied cell text can wrap to the next line,
     * if the text width exceeds the column width.
     * @default true
     */
    @Property(true)
    public allowWrap: boolean;

    /**
     * Configures the selection settings.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      selectionSettings: {
     *          mode: 'None'
     *      }
     * ...
     * }, '#Spreadsheet');
     * 
     * The selectionSettings `mode` property has three values and it is described below:
     * 
     * * None: Disables UI selection.
     * * Single: Allows single selection of cell, row, or column and disables multiple selection.
     * * Multiple: Allows multiple selection of cell, row, or column and disables single selection.
     * 
     * ```
     * @default { mode: 'Multiple' }
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;

    /**
     * Configures the scroll settings.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      scrollSettings: {
     *          isFinite: true,
     *          enableVirtualization: false
     *      }
     * ...
     *  }, '#Spreadsheet');
     * ```
     * > The `allowScrolling` property should be `true`.
     * @default { isFinite: false, enableVirtualization: true }
     */
    @Complex<ScrollSettingsModel>({}, ScrollSettings)
    public scrollSettings: ScrollSettingsModel;

    /**
     * Triggers before the cell appended to the DOM.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      beforeCellRender: (args: CellRenderEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeCellRender: EmitType<CellRenderEventArgs>;

    /**
     * Triggers before the cell or range of cells being selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      beforeSelect: (args: BeforeSelectEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeSelect: EmitType<BeforeSelectEventArgs>;

    /**
     * Triggers after the cell or range of cells is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      select: (args: SelectEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * Triggers before opening the context menu and it allows customizing the menu items.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       contextMenuBeforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public contextMenuBeforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before opening the file menu.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileMenuBeforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public fileMenuBeforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the context menu.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       contextMenuBeforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public contextMenuBeforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before opening the dialog box.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       dialogBeforeOpen: (args: DialogBeforeOpenEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public dialogBeforeOpen: EmitType<DialogBeforeOpenEventArgs>;

    /**
     * Triggers before closing the file menu.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileMenuBeforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public fileMenuBeforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when the context menu item is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       contextMenuItemSelect: (args: MenuSelectEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public contextMenuItemSelect: EmitType<MenuSelectEventArgs>;

    /**
     * Triggers when the file menu item is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileMenuItemSelect: (args: MenuSelectEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public fileMenuItemSelect: EmitType<MenuSelectEventArgs>;

    /** 
     * Triggers before the data is populated to the worksheet.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeDataBound: (args: Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeDataBound: EmitType<Object>;

    /** 
     * Triggers when the data is populated in the worksheet.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       dataBound: (args: Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event 
     */
    @Event()
    public dataBound: EmitType<Object>;

    /**
     * Triggers during data changes when the data is provided as `dataSource` in the Spreadsheet.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       dataSourceChanged: (args: DataSourceChangedEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public dataSourceChanged: EmitType<DataSourceChangedEventArgs>;

    /**
     * Triggers when the cell is being edited.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       cellEdit: (args: CellEditEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public cellEdit: EmitType<CellEditEventArgs>;

    /**
     * Triggers every time a request is made to access cell information.
     * This will be triggered when editing a cell.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       cellEditing: (args: CellEditEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public cellEditing: EmitType<CellEditEventArgs>;

    /**
     * Triggers when the edited cell is saved.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       cellSave: (args: CellSaveEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public cellSave: EmitType<CellSaveEventArgs>;

    /**
     * Triggers when before the cell is saved.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeCellSave: (args: CellEditEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeCellSave: EmitType<CellEditEventArgs>;

    /**
     * Triggers when the component is created.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       created: () => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers before sorting the specified range.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeSort: (args: BeforeSortEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeSort: EmitType<BeforeSortEventArgs>;

    /**
     * Triggers before insert a hyperlink.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeHyperlinkCreate: (args: BeforeHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeHyperlinkCreate: EmitType<BeforeHyperlinkArgs>;

    /**
     * Triggers after the hyperlink inserted.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       afterHyperlinkCreate: (args: afterHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public afterHyperlinkCreate: EmitType<AfterHyperlinkArgs>;

    /**
     * Triggers when the Hyperlink is clicked.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeHyperlinkClick: (args: BeforeHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeHyperlinkClick: EmitType<BeforeHyperlinkArgs>;

    /**
     * Triggers when the Hyperlink function gets completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       afterHyperlinkClick: (args: AfterHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public afterHyperlinkClick: EmitType<AfterHyperlinkArgs>;


    /* tslint:disable */
    /**
     * Triggers when the Spreadsheet actions (such as editing, formatting, sorting etc..) are starts.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       actionBegin: (args: BeforeCellFormatArgs|BeforeOpenEventArgs|BeforeSaveEventArgs|BeforeSelectEventArgs
     *                    |BeforeSortEventArgs|CellEditEventArgs|MenuSelectEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public actionBegin: EmitType<BeforeCellFormatArgs | BeforeOpenEventArgs | BeforeSaveEventArgs | BeforeSelectEventArgs | BeforeSortEventArgs | CellEditEventArgs | MenuSelectEventArgs>;

    /**
     * Triggers when the spreadsheet actions (such as editing, formatting, sorting etc..) gets completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       actionComplete: (args: SortEventArgs|CellSaveEventArgs|SaveCompleteEventArgs|Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public actionComplete: EmitType<SortEventArgs | CellSaveEventArgs | SaveCompleteEventArgs | Object>;
    /* tslint:enable */
    /**
     * Triggers when the spreadsheet importing gets completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       openComplete: (args: Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public openComplete: EmitType<Object>;

    /**
     * Triggers after sorting action is completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       sortComplete: (args: SortEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public sortComplete: EmitType<SortEventArgs>;

    /** @hidden */
    public isEdit: boolean = false;

    /** @hidden */
    public renderModule: Render;

    /** @hidden */
    public scrollModule: Scroll;

    /** @hidden */
    public sheetModule: IRenderer;

    /** @hidden */
    public createdHandler: Function | object;

    /** @hidden */
    public viewport: IViewport = {
        rowCount: 0, colCount: 0, height: 0, topIndex: 0, leftIndex: 0, width: 0,
        bottomIndex: 0, rightIndex: 0
    };

    protected needsID: boolean = true;

    /**
     * Constructor for creating the widget.
     * @param  {SpreadsheetModel} options? - Configures Spreadsheet options.
     * @param  {string|HTMLElement} element? - Element to render Spreadsheet.
     */
    constructor(options?: SpreadsheetModel, element?: string | HTMLElement) {
        super(options);
        Spreadsheet.Inject(
            Ribbon, FormulaBar, SheetTabs, Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, DataBind, Open, ContextMenu,
            Save, NumberFormat, CellFormat, Formula, WrapText, WorkbookEdit, WorkbookOpen, WorkbookSave, WorkbookCellFormat,
            WorkbookNumberFormat, WorkbookFormula, Sort, WorkbookSort, Resize, UndoRedo, WorkbookFilter, Filter, SpreadsheetHyperlink,
            WorkbookHyperlink, Insert, Delete, WorkbookInsert, WorkbookDelete, DataValidation, WorkbookDataValidation,
            ProtectSheet, WorkbookProtectSheet, FindAndReplace, WorkbookFindAndReplace, Merge, WorkbookMerge, SpreadsheetImage,
            ConditionalFormatting, WorkbookImage, WorkbookConditionalFormat, SpreadsheetChart, WorkbookChart
        );
        if (element) {
            this.appendTo(element);
        }
    }

    /**
     * To get cell element.
     * @returns HTMLElement
     * @hidden
     */
    public getCell(rowIndex: number, colIndex: number, row?: HTMLTableRowElement): HTMLElement {
        colIndex = this.getViewportIndex(colIndex, true);
        if (!row) { row = this.getRow(rowIndex); }
        return row ? row.cells[colIndex] : row;
    }
    /**
     * Get cell element.
     * @returns HTMLTableRowElement
     * @hidden
     */
    public getRow(index: number, table?: HTMLTableElement): HTMLTableRowElement {
        index = this.getViewportIndex(index);
        table = table || this.getContentTable();
        return table ? table.rows[index] : null;
    }

    /**
     * To get hidden row/column count between two specified index.
     * Set `layout` as `columns` if you want to get column hidden count.
     * @hidden
     */
    public hiddenCount(startIndex: number, endIndex: number, layout: string = 'rows'): number {
        let sheet: SheetModel = this.getActiveSheet(); let count: number = 0;
        for (let i: number = startIndex; i <= endIndex; i++) {
            if ((sheet[layout])[i] && (sheet[layout])[i].hidden) { count++; }
        }
        return count;
    }

    /**
     * To get row/column viewport index.
     * @hidden
     */
    public getViewportIndex(index: number, isCol?: boolean): number {
        if (this.scrollSettings.enableVirtualization) {
            if (isCol) {
                index -= this.hiddenCount(this.viewport.leftIndex, index, 'columns'); index -= this.viewport.leftIndex;
            } else {
                index -= this.hiddenCount(this.viewport.topIndex, index); index -= this.viewport.topIndex;
            }
        }
        return index;
    }

    /**
     * To initialize the services;
     * @returns void
     * @hidden
     */
    protected preRender(): void {
        super.preRender();
        this.serviceLocator = new ServiceLocator;
        this.initServices();
    }

    private initServices(): void {
        this.serviceLocator.register(locale, new L10n(this.getModuleName(), defaultLocale, this.locale));
        this.serviceLocator.register(dialog, new Dialog(this));
        this.serviceLocator.register(actionEvents, new ActionEvents(this));
        this.serviceLocator.register(overlay, new Overlay(this));
    }

    /**
     * To Initialize the component rendering.
     * @returns void
     * @hidden
     */
    protected render(): void {
        super.render();
        this.element.setAttribute('tabindex', '0');
        setAriaOptions(this.element, { role: 'grid' });
        this.renderModule = new Render(this);
        this.notify(initialLoad, null);
        this.renderSpreadsheet();
        this.wireEvents();
        if (this.created) {
            if (this[created].observers) {
                if (this[created].observers.length > 0) {
                    this.createdHandler = { observers: this[created].observers };
                    this[created].observers = [];
                }
            } else {
                this.createdHandler = this.created;
                this.setProperties({ created: undefined }, true);
            }
        }
    }

    private renderSpreadsheet(): void {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        this.setHeight(); this.setWidth();
        createSpinner({ target: this.element }, this.createElement);
        if (this.isMobileView() && this.cssClass.indexOf('e-mobile-view') === -1) {
            this.element.classList.add('e-mobile-view');
        }
        this.sheetModule = this.serviceLocator.getService<IRenderer>('sheet');
        if (this.allowScrolling) {
            this.scrollModule = new Scroll(this);
        }
        if (this.scrollSettings.enableVirtualization) {
            new VirtualScroll(this);
        }
        this.renderModule.render();
        new ShowHide(this);
    }

    /**
     * By default, Spreadsheet shows the spinner for all its actions. To manually show spinner you this method at your needed time.
     * @return {void}
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }
    /**
     * To hide showed spinner manually.
     * @return {void}
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }

    /**
     * To protect the particular sheet.
     * @param {number | string} sheet - Specifies the sheet to protect.
     * @param {ProtectSettingsModel} protectSettings - Specifies the protect sheet options.
     * @default { selectCells: 'false', formatCells: 'false', formatRows: 'false', formatColumns:'false', insertLink:'false' }
     * @return {void}
     */
    public protectSheet(sheet?: number | string, protectSettings?: ProtectSettingsModel): void {
        if (typeof (sheet) === 'string') {
            sheet = getSheetIndex(this, sheet);
        }
        if (sheet) {
            this.setSheetPropertyOnMute(this.sheets[sheet], 'isProtected', true);
            this.setSheetPropertyOnMute(this.sheets[sheet], 'protectSettings', protectSettings);
        }
        sheet = this.getActiveSheet().index;
        this.setSheetPropertyOnMute(this.getActiveSheet(), 'isProtected', true);
        super.protectSheet(sheet, protectSettings);
    }

    /**
     * To unprotect the particular sheet.
     * @param {number | string} sheet - Specifies the sheet to Unprotect.
     * @return {void}
     */
    public unprotectSheet(sheet?: number | string): void {
        if (typeof (sheet) === 'string') {
            sheet = getSheetIndex(this, sheet);
        }
        if (sheet) {
            this.sheets[sheet].isProtected = false;

        } else {
            this.getActiveSheet().isProtected = false;
        }
        super.unprotectSheet(sheet);
    }

    /**
     * To find the specified cell value.
     * @param {FindOptions} args - Specifies the replace value with find args to replace specified cell value.
     * @param {string} args.value - Specifies the value to be find.
     * @param {FindModeType} args.mode - Specifies the value to be find within sheet or workbook.
     * @param {string} args.searchBy - Specifies the value to be find by row or column.
     * @param {boolean} args.isCSen - Specifies the find match with case sensitive or not.
     * @param {boolean} args.isEMatch - Specifies the find match with entire match or not.
     * @param {string} args.findOpt - Specifies the next or previous find match.
     * @param {number} args.sheetIndex - Specifies the current sheet to find.
     * @default { mode: 'Sheet', searchBy: 'By Row', isCSen: 'false', isEMatch:'false' }
     * @return {void}
     */
    public find(args: FindOptions): void {
        super.findHandler(args);
    }
    /**
     * To replace the specified cell value.
     * @param {FindOptions} args - Specifies the replace value with find args to replace specified cell value.
     * @param {string} args.replaceValue - Specifies the replacing value.
     * @param {string} args.replaceBy - Specifies the value to be replaced for one or all.
     * @param {string} args.value - Specifies the value to be replaced
     * @return {void}
     */
    public replace(args: FindOptions): void {
        args = {
            value: args.value, mode: args.mode ? args.mode : 'Sheet', isCSen: args.isCSen ? args.isCSen : false,
            isEMatch: args.isEMatch ? args.isEMatch : false, searchBy: args.searchBy ? args.searchBy : 'By Row',
            replaceValue: args.replaceValue, replaceBy: args.replaceBy,
            sheetIndex: args.sheetIndex ? args.sheetIndex : this.activeSheetIndex, findOpt: args.findOpt ? args.findOpt : ''
        };
        super.replaceHandler(args);
    }
    /**
     * To Find All the Match values Address within Sheet or Workbook.
     * @param {string} value - Specifies the value to find.
     * @param {FindModeType} mode - Specifies the value to be find within Sheet/Workbook.
     * @param {boolean} isCSen - Specifies the find match with case sensitive or not.
     * @param {boolean} isEMatch - Specifies the find match with entire match or not.
     * @param {number} sheetIndex - Specifies the sheetIndex. If not specified, it will consider the active sheet.
     * @return {string[]}
     */
    public findAll(value: string, mode?: string, isCSen?: boolean, isEMatch?: boolean, sheetIndex?: number): string[] {
        mode = mode ? mode : 'Sheet'; sheetIndex = sheetIndex ? sheetIndex : this.activeSheetIndex;
        isCSen = isCSen ? isCSen : false; isEMatch = isEMatch ? isEMatch : false;
        let findCollection: string[] = [];
        let findAllArguments: FindAllArgs = {
            value: value, mode: mode, sheetIndex: sheetIndex, isCSen: isCSen,
            isEMatch: isEMatch, findCollection: findCollection
        };
        this.notify(findAllValues, findAllArguments);
        return findCollection;
    }
    /**
     * Used to navigate to cell address within workbook.
     * @param {string} address - Specifies the cell address you need to navigate.
     * You can specify the address in two formats,
     * `{sheet name}!{cell address}` - Switch to specified sheet and navigate to specified cell address.
     * `{cell address}` - Navigate to specified cell address with in the active sheet.
     * @return {void}
     */
    public goTo(address: string): void {
        if (address.includes('!')) {
            let addrArr: string[] = address.split('!');
            let idx: number = getSheetIndex(this, addrArr[0]);
            if (idx === undefined) { return; }
            if (idx !== this.activeSheetIndex) {
                let activeCell: string = addrArr[1].split(':')[0];
                this.setSheetPropertyOnMute(this.sheets[idx], 'activeCell', activeCell);
                this.setSheetPropertyOnMute(this.sheets[idx], 'selectedRange', addrArr[1]);
                let cellIndex: number[] = getCellIndexes(activeCell);
                if (cellIndex[0] < this.viewport.rowCount) { cellIndex[0] = 0; }
                if (cellIndex[1] < this.viewport.colCount) { cellIndex[1] = 0; }
                this.setSheetPropertyOnMute(this.sheets[idx], 'topLeftCell', getCellAddress(cellIndex[0], cellIndex[1]));
                this.activeSheetIndex = idx; this.dataBind();
                return;
            }
        }
        let indexes: number[] = getRangeIndexes(address);
        let sheet: SheetModel = this.getActiveSheet();
        let insideDomCount: boolean = indexes[0] >= this.viewport.topIndex && indexes[0] < this.viewport.bottomIndex && indexes[1] >=
            this.viewport.leftIndex && indexes[1] < this.viewport.rightIndex;
        if (insideDomCount) {
            this.selectRange(address);
            let viewportIndexes: number[] = getCellIndexes(sheet.topLeftCell);
            viewportIndexes[2] = viewportIndexes[0] + this.viewport.rowCount;
            viewportIndexes[3] = viewportIndexes[1] + this.viewport.colCount;
            if (indexes[0] >= viewportIndexes[0] && indexes[0] < viewportIndexes[2] && indexes[1] >= viewportIndexes[1] &&
                indexes[1] < viewportIndexes[3]) { return; }
        }
        let content: Element = this.getMainContent();
        let vTrack: HTMLElement; let cVTrack: HTMLElement; let rVTrack: HTMLElement;
        let offset: number; let vWidth: number; let vHeight: number; let scrollableSize: number;
        if (indexes[0] === 0) {
            offset = getRowsHeight(sheet, 0);
        } else {
            offset = getRowsHeight(sheet, 0, indexes[0] - 1);
            if (this.scrollSettings.enableVirtualization) {
                scrollableSize = offset + this.getContentTable().getBoundingClientRect().height;
                vHeight = parseInt((content.querySelector('.e-virtualtrack') as HTMLElement).style.height, 10);
                if (scrollableSize > vHeight) {
                    scrollableSize += 10;
                    vTrack = content.querySelector('.e-virtualtrack') as HTMLElement;
                    vTrack.style.height = `${scrollableSize}px`;
                    if (sheet.showHeaders) {
                        rVTrack = this.getRowHeaderContent().querySelector('.e-virtualtrack') as HTMLElement;
                        rVTrack.style.height = `${scrollableSize}px`;
                    }
                    getUpdateUsingRaf((): void => {
                        vTrack.style.height = `${vHeight}px`;
                        if (sheet.showHeaders) { rVTrack.style.height = `${vHeight}px`; }
                    });
                }
            }
        }
        content.scrollTop = offset;
        if (indexes[1] === 0) {
            offset = getColumnsWidth(sheet, 0);
        } else {
            offset = getColumnsWidth(sheet, 0, indexes[1] - 1);
            if (this.scrollSettings.enableVirtualization) {
                scrollableSize = offset + this.getContentTable().getBoundingClientRect().width;
                vWidth = parseInt((content.querySelector('.e-virtualtrack') as HTMLElement).style.width, 10);
                if (scrollableSize > vWidth) {
                    scrollableSize += 10;
                    vTrack = content.querySelector('.e-virtualtrack') as HTMLElement;
                    vTrack.style.width = `${scrollableSize}px`;
                    if (sheet.showHeaders) {
                        cVTrack = this.getColumnHeaderContent().querySelector('.e-virtualtrack') as HTMLElement;
                        cVTrack.style.width = `${scrollableSize}px`;
                    }
                    getUpdateUsingRaf((): void => {
                        vTrack.style.width = `${vWidth}px`;
                        if (sheet.showHeaders) { cVTrack.style.width = `${vWidth}px`; }
                    });
                }
            }
        }
        content.scrollLeft = offset;
        if (!insideDomCount) {
            this.selectRange(address);
        }
    }

    /**
     * Used to resize the Spreadsheet.
     */
    public resize(): void {
        this.renderModule.setSheetPanelSize();
        if (this.scrollSettings.enableVirtualization) {
            this.renderModule.refreshSheet();
        }
    }
    /**
     * To cut the specified cell or cells properties such as value, format, style etc...
     * @param {string} address - Specifies the range address to cut.
     */
    public cut(address?: string): Promise<Object> {
        let promise: Promise<Object> =
            new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); });
        this.notify(cut, address ? {
            range: getIndexesFromAddress(address),
            sId: this.sheets[getSheetIndex(this, getSheetNameFromAddress(address))].id,
            promise: promise
        } : { promise: promise });
        return promise;
    }

    /**
     * To copy the specified cell or cells properties such as value, format, style etc...
     * @param {string} address - Specifies the range address.
     */
    public copy(address?: string): Promise<Object> {
        let activeAddress: string = this.getActiveSheet().name + '!' + this.getActiveSheet().activeCell;
        address = !isNullOrUndefined(address) ? address : activeAddress;
        let promise: Promise<Object> =
            new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); });
        this.notify(copy, address ? {
            range: getIndexesFromAddress(address),
            sId: this.sheets[getSheetIndex(this, getSheetNameFromAddress(address))].id,
            promise: promise
        } : { promise: promise });
        return promise;
    }

    /**
     * This method is used to paste the cut or copied cells in to specified address.
     * @param {string} address - Specifies the cell or range address.
     * @param {PasteSpecialType} type - Specifies the type of paste.
     */
    public paste(address?: string, type?: PasteSpecialType): void {
        this.notify(paste, {
            range: getIndexesFromAddress(address), sIdx: getSheetIndex(this, getSheetNameFromAddress(address)),
            type: type, isAction: false, isInternal: true
        });
    }

    /**
     * To update the action which need to perform.
     * @param {string} options - It describes an action and event args to perform.
     * @param {string} options.action - specifies an action.
     * @param {string} options.eventArgs - specifies an args to perform an action.
     */
    public updateAction(options: CollaborativeEditArgs): void {
        updateAction(options, this);
    }

    private setHeight(): void {
        if (this.height.toString().indexOf('%') > -1) { this.element.style.minHeight = '400px'; }
        this.element.style.height = formatUnit(this.height);
    }

    private setWidth(): void {
        if (this.width.toString().indexOf('%') > -1 || this.width === 'auto') { this.element.style.minWidth = '300px'; }
        this.element.style.width = formatUnit(this.width);
    }

    /**
     * Set the width of column. 
     * @param {number} width
     * @param {number} colIndex
     * @param {number} sheetIndex
     * {% codeBlock src='spreadsheet/setColWidth/index.md' %}{% endcodeBlock %}
     */
    public setColWidth(width: number | string = 64, colIndex: number = 0, sheetIndex?: number): void {
        let colThreshold: number = this.getThreshold('col');
        let lastIdx: number = this.viewport.leftIndex + this.viewport.colCount + (colThreshold * 2);
        let sheet: SheetModel = isNullOrUndefined(sheetIndex) ? this.getActiveSheet() : this.sheets[sheetIndex];
        if (sheet) {
            let mIndex: number = colIndex;
            let colWidth: string = (typeof width === 'number') ? width + 'px' : width;
            colIndex = isNullOrUndefined(colIndex) ? getCellIndexes(sheet.activeCell)[1] : colIndex;
            if (sheet === this.getActiveSheet()) {
                if (colIndex >= this.viewport.leftIndex && colIndex <= lastIdx) {
                    if (this.scrollSettings.enableVirtualization) { colIndex = colIndex - this.viewport.leftIndex; }
                    let trgt: HTMLElement = this.getColumnHeaderContent().getElementsByClassName('e-header-cell')[colIndex] as HTMLElement;
                    let eleWidth: number = parseInt(this.getMainContent().getElementsByTagName('col')[colIndex].style.width, 10);
                    let threshold: number = parseInt(colWidth, 10) - eleWidth;
                    if (threshold < 0 && eleWidth < -(threshold)) {
                        getCellIndexes(sheet.activeCell);
                        threshold = -eleWidth;
                    }
                    let oldIdx: number = parseInt(trgt.getAttribute('aria-colindex'), 10) - 1;
                    if (this.getActiveSheet() === sheet) {
                        this.notify(colWidthChanged, { threshold, colIdx: oldIdx });
                        setResize(colIndex, colWidth, true, this);
                    }
                } else {
                    let oldWidth: number = getColumnWidth(sheet, colIndex);
                    let threshold: number;
                    if (parseInt(colWidth, 10) > 0) {
                        threshold = -(oldWidth - parseInt(colWidth, 10));
                    } else {
                        threshold = -oldWidth;
                    }
                    this.notify(colWidthChanged, { threshold, colIdx: colIndex });
                }
            }
            getColumn(sheet, mIndex).width = parseInt(colWidth, 10) > 0 ? parseInt(colWidth, 10) : 0;
            sheet.columns[mIndex].customWidth = true;
        }
    }

    /**
     * Set the height of row. 
     * @param {number} height? - Specifies height needs to be updated. If not specified, it will set the default height 20.
     * @param {number} rowIndex? - Specifies the row index. If not specified, it will consider the first row.
     * @param {number} sheetIndex? - Specifies the sheetIndex. If not specified, it will consider the active sheet.
     * {% codeBlock src='spreadsheet/setRowHeight/index.md' %}{% endcodeBlock %}
     */
    public setRowHeight(height: number | string = 20, rowIndex: number = 0, sheetIndex?: number, edited?: boolean): void {
        let sheet: SheetModel = isNullOrUndefined(sheetIndex) ? this.getActiveSheet() : this.sheets[sheetIndex - 1];
        if (sheet) {
            let mIndex: number = rowIndex;
            let rowHeight: string = (typeof height === 'number') ? height + 'px' : height;
            rowIndex = isNullOrUndefined(rowIndex) ? getCellIndexes(sheet.activeCell)[0] : rowIndex;
            if (sheet === this.getActiveSheet()) {
                if (rowIndex <= this.viewport.bottomIndex && rowIndex >= this.viewport.topIndex) {
                    if (this.scrollSettings.enableVirtualization) { rowIndex = rowIndex - this.viewport.topIndex; }
                    let trgt: HTMLElement = this.getRowHeaderContent().getElementsByClassName('e-header-cell')[rowIndex] as HTMLElement;
                    let eleHeight: number = parseInt(this.getMainContent().getElementsByTagName('tr')[rowIndex].style.height, 10);
                    let threshold: number = parseInt(rowHeight, 10) - eleHeight;
                    if (threshold < 0 && eleHeight < -(threshold)) {
                        threshold = -eleHeight;
                    }
                    let oldIdx: number = parseInt(trgt.parentElement.getAttribute('aria-rowindex'), 10) - 1;
                    if (this.getActiveSheet() === sheet) {
                        this.notify(rowHeightChanged, { threshold, rowIdx: oldIdx });
                        if (isNullOrUndefined(edited)) {
                            edited = false;
                        }
                        if (!edited) {
                            setResize(rowIndex, rowHeight, false, this);
                            edited = false;
                        }

                    }
                } else {
                    let oldHeight: number = getRowHeight(sheet, rowIndex);
                    let threshold: number;
                    if (parseInt(rowHeight, 10) > 0) {
                        threshold = -(oldHeight - parseInt(rowHeight, 10));
                    } else {
                        threshold = -oldHeight;
                    }
                    this.notify(rowHeightChanged, { threshold, rowIdx: rowIndex });
                }
            }
            setRowHeight(sheet, mIndex, parseInt(rowHeight, 10) > 0 ? parseInt(rowHeight, 10) : 0);
            sheet.rows[mIndex].customHeight = true;
        }
    }

    /**
     * This method is used to autofit the range of rows or columns
     * @param {string} range - range that needs to be autofit. 
     * 
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * let spreadsheet = new Spreadsheet({
     *      allowResizing: true
     * ...
     * }, '#Spreadsheet');
     * spreadsheet.autoFit('A:D'); // Auto fit from A to D columns
     * Spreadsheet.autoFit('1:4'); // Auto fit from 1 to 4 rows
     * 
     * ```
     */
    public autoFit(range: string): void {
        let values: { startIdx: number, endIdx: number, isCol: boolean } = this.getIndexes(range);
        let startIdx: number = values.startIdx;
        let endIdx: number = values.endIdx;
        let isCol: boolean = values.isCol;
        let maximumColInx: number = isCol ? getColIndex('XFD') : 1048576;
        if (startIdx <= maximumColInx) {
            if (endIdx > maximumColInx) {
                endIdx = maximumColInx;
            }
        } else {
            return;
        }
        for (startIdx; startIdx <= endIdx; startIdx++) {
            this.notify(setAutoFit, { idx: startIdx, isCol });
        }
    }

    /** @hidden */
    public getIndexes(range: string): { startIdx: number, endIdx: number, isCol: boolean } {
        let startIsCol: boolean;
        let endIsCol: boolean;
        let start: string;
        let end: string;
        let isCol: boolean;
        if (range.indexOf(':') !== -1) {
            let starttoend: string[] = range.split(':');
            start = starttoend[0];
            end = starttoend[1];
        } else {
            start = range;
            end = range;
        }
        if (!isNullOrUndefined(start)) {
            let startValues: { address: string, isCol: boolean } = this.getAddress(start);
            start = startValues.address;
            startIsCol = startValues.isCol;
        }
        if (!isNullOrUndefined(end)) {
            let endValues: { address: string, isCol: boolean } = this.getAddress(end);
            end = endValues.address;
            endIsCol = endValues.isCol;
        }
        isCol = startIsCol === true && endIsCol === true ? true : false;
        let startIdx: number = isCol ? getColIndex(start.toUpperCase()) : parseInt(start, 10);
        let endIdx: number = isCol ? getColIndex(end.toUpperCase()) : parseInt(end, 10);
        return { startIdx: startIdx, endIdx: endIdx, isCol: isCol };
    }

    private getAddress(address: string): { address: string, isCol: boolean } {
        let isCol: boolean;
        if (address.substring(0, 1).match(/\D/g)) {
            isCol = true;
            address = address.replace(/[0-9]/g, '');
            return { address: address, isCol: isCol };
        } else if (address.substring(0, 1).match(/[0-9]/g) && address.match(/\D/g)) {
            return { address: '', isCol: false };
        } else {
            address = (parseInt(address, 10) - 1).toString();
            return { address: address, isCol: isCol };
        }
    }

    /**
     * To add the hyperlink in the cell 
     * @param {string | HyperlinkModel} hyperlink
     * @param {string} address
     */
    public addHyperlink(hyperlink: string | HyperlinkModel, address: string): void {
        this.insertHyperlink(hyperlink, address, '', true);
    }

    /**
     * To remove the hyperlink in the cell 
     * @param {string} range
     */
    public removeHyperlink(range: string): void {
        let rangeArr: string[];
        let sheet: SheetModel = this.getActiveSheet();
        let sheetIdx: number;
        if (range && range.indexOf('!') !== -1) {
            rangeArr = range.split('!');
            let sheets: SheetModel[] = this.sheets;
            for (let idx: number = 0; idx < sheets.length; idx++) {
                if (sheets[idx].name === rangeArr[0]) {
                    sheetIdx = idx;
                }
            }
            sheet = this.sheets[sheetIdx];
            range = rangeArr[1];
        }
        let rangeIndexes: number[] = range ? getRangeIndexes(range) : getRangeIndexes(this.getActiveSheet().activeCell);
        let cellMod: CellModel;
        for (let rowIdx: number = rangeIndexes[0]; rowIdx <= rangeIndexes[2]; rowIdx++) {
            for (let colIdx: number = rangeIndexes[1]; colIdx <= rangeIndexes[3]; colIdx++) {
                if (sheet && sheet.rows[rowIdx] && sheet.rows[rowIdx].cells[colIdx]) {
                    cellMod = sheet.rows[rowIdx].cells[colIdx];
                    if (cellMod) {
                        if (typeof (cellMod.hyperlink) === 'string') {
                            cellMod.value = cellMod.value ? cellMod.value : cellMod.hyperlink;
                        } else {
                            cellMod.value = cellMod.value ? cellMod.value : cellMod.hyperlink.address;
                        }
                        delete (cellMod.hyperlink);
                        if (sheet === this.getActiveSheet()) {
                            let eleRowIdx: number;
                            let eleColIdx: number;
                            if (this.scrollSettings.enableVirtualization) {
                                eleRowIdx = rowIdx - this.viewport.topIndex;
                                eleColIdx = colIdx - this.viewport.leftIndex;
                            }
                            let cell: HTMLElement = this.element.getElementsByClassName('e-sheet-content')[0].
                                getElementsByClassName('e-row')[eleRowIdx].getElementsByClassName('e-cell')[eleColIdx] as HTMLElement;
                            if (cell.getElementsByClassName('e-hyperlink')[0]) {
                                cell.innerText = cell.getElementsByClassName('e-hyperlink')[0].innerHTML;
                            }
                        }

                    }
                }
            }
        }
    }

    /** @hidden */
    public insertHyperlink(hyperlink: string | HyperlinkModel, address: string, displayText: string, isMethod: boolean): void {
        if (this.allowHyperlink) {
            let value: string;
            let addrRange: string[];
            let sheetIdx: number;
            let cellIdx: number[];
            let sheet: SheetModel = this.getActiveSheet();
            let isEmpty: boolean;
            address = address ? address : this.getActiveSheet().activeCell;
            let befArgs: BeforeHyperlinkArgs = { hyperlink: hyperlink, cell: address, cancel: false };
            let aftArgs: AfterHyperlinkArgs = { hyperlink: hyperlink, cell: address };
            if (!isMethod) {
                this.trigger(beforeHyperlinkCreate, befArgs);
            }
            if (!befArgs.cancel) {
                hyperlink = befArgs.hyperlink;
                address = befArgs.cell;
                super.addHyperlink(hyperlink, address);
                if (address && address.indexOf('!') !== -1) {
                    addrRange = address.split('!');
                    let sheets: SheetModel[] = this.sheets;
                    for (let idx: number = 0; idx < sheets.length; idx++) {
                        if (sheets[idx].name === addrRange[0]) {
                            sheetIdx = idx;
                        }
                    }
                    sheet = this.sheets[sheetIdx];
                    address = addrRange[1];
                }
                if (!sheet) {
                    return;
                }
                address = address ? address : this.getActiveSheet().activeCell;
                cellIdx = getRangeIndexes(address);
                if (typeof (hyperlink) === 'string') {
                    value = hyperlink;
                } else {
                    value = hyperlink.address;
                }
                let mCell: CellModel = sheet.rows[cellIdx[0]].cells[cellIdx[1]];
                if (isNullOrUndefined(mCell.value) || mCell.value === '') {
                    isEmpty = true;
                }
                if (!isMethod) {
                    this.trigger(afterHyperlinkCreate, aftArgs);
                }
                if (sheet === this.getActiveSheet()) {
                    this.serviceLocator.getService<ICellRenderer>('cell').refreshRange(cellIdx);
                }
            }
        }
    }

    /**
     * This method is used to add data validation.
     * @param {ValidationModel} rules - specifies the validation rules.
     * @param {string} range - range that needs to be add validation.
     */
    public addDataValidation(rules: ValidationModel, range?: string): void {
        super.addDataValidation(rules, range);
    }

    /**
     * This method is used for remove validation.
     * @param {string} range - range that needs to be remove validation.
     */
    public removeDataValidation(range?: string): void {
        super.removeDataValidation(range);
    }

    /**
     * This method is used to highlight the invalid data.
     * @param {string} range - range that needs to be highlight the invalid data.
     */
    public addInvalidHighlight(range?: string): void {
        super.addInvalidHighlight(range);
    }

    /**
     * This method is used for remove highlight from invalid data.
     * @param {string} range - range that needs to be remove invalid highlight.
     */
    public removeInvalidHighlight(range?: string): void {
        super.removeInvalidHighlight(range);
    }

    /**
     * This method is used to add conditional formatting.
     * @param  {string} type - Conditional formatting HighlightCell, TopBottom, DataBar, ColorScale, IconSet Type. 
     * HighlightCell- 'GreaterThan' | 'LessThan' | 'Between' | 'EqualTo' | 'ContainsText' | 'DateOccur' | 'Duplicate' | 'Unique', 
     * TopBottom - 'Top10Items' | 'Bottom10Items' | 'Top10Percentage' | 'Bottom10Percentage' | 'BelowAverage' | 'AboveAverage',
     * DataBar - 'BlueDataBar' | 'GreenDataBar' | 'RedDataBar' | 'OrangeDataBar' | 'LightBlueDataBar' | 'PurpleDataBar',
     * ColorScale - 'GYRColorScale' | 'RYGColorScale' | 'GWRColorScale' | 'RWGColorScale' | 'BWRColorScale' | 'RWBColorScale' |
     * 'WRColorScale' | 'RWColorScale' | 'GWColorScale' | 'WGColorScale' | 'GYColorScale' | 'YGColorScale',
     * IconSet - 'ThreeArrows' | 'ThreeArrowsGray' | 'FourArrowsGray' | 'FourArrows' | 'FiveArrowsGray' | 'FiveArrows' | 
     * 'ThreeTrafficLights1' | 'ThreeTrafficLights2' | 'ThreeSigns' | 'FourTrafficLights' | 'FourRedToBlack' | 'ThreeSymbols' | 
     * 'ThreeSymbols2' | 'ThreeFlags' | 'FourRating' | 'FiveQuarters' | 'FiveRating' | 'ThreeTriangles' | 'ThreeStars' | 'FiveBoxes';
     * @param  {string} cFColor - Pass the cFcolor to set the conditional formatting.
     * CFColor - 'RedFT' | 'YellowFT' | 'GreenFT' | 'RedF' | 'RedT'.
     * @param  {string} value - Pass the value to set the conditional formatting.
     * @param  {string} range - Pass the range to set the conditional formatting.
     */
    public conditionalFormat(conditionalFormat: ConditionalFormatModel): void {
        super.conditionalFormat(conditionalFormat);
    }

    /**
     * This method is used for remove conditional formatting.
     * @param {string} range - range that needs to be remove conditional formatting.
     */
    public clearConditionalFormat(range?: string): void {
        range = range || this.getActiveSheet().selectedRange;
        super.clearConditionalFormat(range);
    }

    /** @hidden */
    public setPanelSize(): void {
        if (this.height !== 'auto') {
            let panel: HTMLElement = document.getElementById(this.element.id + '_sheet_panel');
            panel.style.height = `${this.element.getBoundingClientRect().height - getSiblingsHeight(panel)}px`;
        }
    }

    /**
     * Opens the Excel file.
     * @param {OpenOptions} options - Options for opening the excel file.
     */
    public open(options: OpenOptions): void {
        this.isOpen = true;
        super.open(options);
        if (this.isOpen) {
            this.showSpinner();
        }
    }

    /** @hidden */
    public hideRow(startIndex: number, endIndex: number = startIndex, hide: boolean = true): void {
        if (this.renderModule) {
            this.notify(hideShow, <HideShowEventArgs>{ startIndex: startIndex, endIndex: endIndex, hide: hide });
        } else {
            super.hideRow(startIndex, endIndex, hide);
        }
    }

    /** @hidden */
    public hideColumn(startIndex: number, endIndex: number = startIndex, hide: boolean = true): void {
        if (this.renderModule) {
            this.notify(hideShow, <HideShowEventArgs>{ startIndex: startIndex, endIndex: endIndex, hide: hide, isCol: true });
        } else {
            super.hideColumn(startIndex, endIndex, hide);
        }
    }

    /**
     * This method is used to Clear contents, formats and hyperlinks in spreadsheet.
     *    * @param {ClearOptions} options - Options for clearing the content, formats and hyperlinks in spreadsheet.     
     */
    public clear(options: ClearOptions): void {
        this.notify(clearViewer, { options: options, isPublic: true });
    }
    /**
     * Used to refresh the spreadsheet.
     * @param {boolean} isNew - Specifies `true` / `false` to create new workbook in spreadsheet.
     * @returns void
     */
    public refresh(isNew?: boolean): void {
        (isNew) ? this.notify(blankWorkbook, {}) : super.refresh();
    }

    /**
     * Used to set the image in spreadsheet.
     * @param {ImageModel} images - Specifies the options to insert image in spreadsheet.
     * @param {string} range - Specifies the range in spreadsheet.
     * @returns void
     */
    public insertImage(images: ImageModel[], range?: string): void {
        let i: number;
        for (i = 0; i < images.length; i++) {
            this.notify(createImageElement, {
                options: images[i],
                range: range ? range : this.getActiveSheet().selectedRange, isPublic: true
            });
        }
    }

    /**
     * Used to delete the image in spreadsheet.
     * @param {string} id - Specifies the id of the image element to be deleted.
     * @param {string} range - Specifies the range in spreadsheet.
     * @returns void
     */
    public deleteImage(id: string, range?: string): void {
        this.notify(deleteImage, { id: id, range: range ? range : this.getActiveSheet().selectedRange });
    }

    /**
     * Gets the row header div of the Spreadsheet.
     * @return {Element} 
     * @hidden
     */
    public getRowHeaderContent(): HTMLElement {
        return this.sheetModule.getRowHeaderPanel() as HTMLElement;
    }

    /**
     * Gets the column header div of the Spreadsheet.     
     * @return {Element} 
     * @hidden 
     */
    public getColumnHeaderContent(): Element {
        return this.sheetModule.getColHeaderPanel();
    }

    /**
     * Gets the main content div of the Spreadsheet.     
     * @return {Element} 
     * @hidden
     */
    public getMainContent(): Element {
        return this.sheetModule.getContentPanel();
    }

    /**
     * Get the main content table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    public getContentTable(): HTMLTableElement {
        return this.sheetModule.getContentTable();
    }

    /**
     * Get the row header table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    public getRowHeaderTable(): HTMLTableElement {
        return this.sheetModule.getRowHeaderTable();
    }

    /**
     * Get the column header table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    public getColHeaderTable(): HTMLTableElement {
        return this.sheetModule.getColHeaderTable();
    }

    /**
     * To get the backup element count for row and column virtualization.
     * @hidden
     */
    public getThreshold(layout: 'row' | 'col'): number {
        let threshold: number = Math.round((this.viewport[layout + 'Count'] + 1) / 2);
        return threshold < 15 ? 15 : threshold;
    }

    /** @hidden */
    public isMobileView(): boolean {
        return ((this.cssClass.indexOf('e-mobile-view') > - 1 || Browser.isDevice) && this.cssClass.indexOf('e-desktop-view') === -1)
            && false;
    }

    /** @hidden */
    public getValueRowCol(sheetIndex: number, rowIndex: number, colIndex: number): string | number {
        let val: string | number = super.getValueRowCol(sheetIndex, rowIndex, colIndex);
        return val;
    }

    /**
     * To update a cell properties.
     * @param {CellModel} cell - Cell properties.
     * @param {string} address - Address to update.
     */
    public updateCell(cell: CellModel, address?: string): void {
        address = address || this.getActiveSheet().activeCell;
        super.updateCell(cell, address);
        this.serviceLocator.getService<ICellRenderer>('cell').refreshRange(getIndexesFromAddress(address));
        this.notify(activeCellChanged, null);
    }

    /**
     * Sorts the range of cells in the active sheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
    public sort(sortOptions?: SortOptions, range?: string): Promise<SortEventArgs> {
        if (!this.allowSorting) { return Promise.reject(); }
        return super.sort(sortOptions, range).then((args: SortEventArgs) => {
            this.notify(sortComplete, args);
            return Promise.resolve(args);
        });
    }

    /** @hidden */
    public setValueRowCol(sheetIndex: number, value: string | number, rowIndex: number, colIndex: number): void {
        if (value === 'circular reference: ') {
            let circularArgs: { action: string, argValue: string } = {
                action: 'isCircularReference', argValue: value
            };
            this.notify(formulaOperation, circularArgs);
            value = circularArgs.argValue;
        }
        super.setValueRowCol(sheetIndex, value, rowIndex, colIndex);
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        this.notify(
            editOperation, {
                action: 'refreshDependentCellValue', rowIdx: rowIndex, colIdx: colIndex,
                sheetIdx: sheetIndex
            });
    }

    /**
     * Get component name.
     * @returns string
     * @hidden
     */
    public getModuleName(): string {
        return 'spreadsheet';
    }

    /** @hidden */
    public refreshNode(td: Element, args?: RefreshValueArgs): void {
        let value: string;
        if (td) {
            let spanElem: Element = select('#' + this.element.id + '_currency', td);
            let alignClass: string = 'e-right-align';
            if (args) {
                args.result = isNullOrUndefined(args.result) ? '' : args.result.toString();
                if (spanElem) { detach(spanElem); }
                if (args.type === 'Accounting' && isNumber(args.value)) {
                    if (td.querySelector('a')) {
                        td.querySelector('a').textContent = args.result.split(args.curSymbol).join('');
                    } else {
                        td.innerHTML = '';
                    }
                    td.appendChild(this.createElement('span', {
                        id: this.element.id + '_currency',
                        innerHTML: `${args.curSymbol}`,
                        styles: 'float: left'
                    }));
                    if (!td.querySelector('a')) {
                        td.innerHTML += args.result.split(args.curSymbol).join('');
                    }
                    td.classList.add(alignClass);
                    return;
                } else {
                    if (args.result && (args.result.toLowerCase() === 'true' || args.result.toLowerCase() === 'false')) {
                        args.result = args.result.toUpperCase();
                        alignClass = 'e-center-align';
                        args.isRightAlign = true; // Re-use this to center align the cell.
                    }
                    value = args.result;
                }
                args.isRightAlign ? td.classList.add(alignClass) : td.classList.remove(alignClass);
            }
            value = !isNullOrUndefined(value) ? value : '';
            if (!isNullOrUndefined(td)) {
                let node: Node = td.lastChild;
                if (td.querySelector('.e-hyperlink')) {
                    node = td.querySelector('.e-hyperlink').lastChild;
                }
                if (node && (node.nodeType === 3 || node.nodeType === 1)) {
                    node.nodeValue = value;

                } else {
                    td.appendChild(document.createTextNode(value));
                }
            }
        }
    }
    /** @hidden */
    public calculateHeight(style: CellStyleModel, lines: number = 1, borderWidth: number = 1): number {
        let fontSize: string = (style && style.fontSize) || this.cellStyle.fontSize;
        let threshold: number = style.fontFamily === 'Arial Black' ? 1.44 : 1.24;
        return ((fontSize.indexOf('pt') > -1 ? parseInt(fontSize, 10) * 1.33 : parseInt(fontSize, 10)) * threshold * lines) +
            (borderWidth * threshold);
    }

    /** @hidden */
    public skipHidden(startIdx: number, endIdx: number, layout: string = 'rows'): number[] {
        let sheet: SheetModel = this.getActiveSheet(); let totalCount: number;
        if (this.scrollSettings.isFinite) { totalCount = (layout === 'rows' ? sheet.rowCount : sheet.colCount) - 1; }
        for (let i: number = startIdx; i <= endIdx; i++) {
            if ((sheet[layout])[i] && (sheet[layout])[i].hidden) {
                if (startIdx === i) { startIdx++; }
                endIdx++;
                if (totalCount && endIdx > totalCount) { endIdx = totalCount; break; }
            }
        }
        return [startIdx, endIdx];
    }

    /** @hidden */
    public updateActiveBorder(nextTab: HTMLElement, selector: string = '.e-ribbon'): void {
        let indicator: HTMLElement = select(`${selector} .e-tab-header .e-indicator`, this.element) as HTMLElement;
        indicator.style.display = 'none';
        setStyleAttribute(indicator, { 'left': '', 'right': '' });
        setStyleAttribute(indicator, {
            'left': nextTab.offsetLeft + 'px', 'right':
                nextTab.parentElement.offsetWidth - (nextTab.offsetLeft + nextTab.offsetWidth) + 'px'
        });
        indicator.style.display = '';
    }

    /** @hidden */
    public skipHiddenSheets(index: number, initIdx?: number, hiddenCount: number = 0): number {
        if (this.sheets[index] && this.sheets[index].state !== 'Visible') {
            if (initIdx === undefined) { initIdx = index; }
            if (index && index + 1 === this.sheets.length) {
                index = initIdx - 1;
            } else {
                index < initIdx ? index-- : index++;
            }
            index = this.skipHiddenSheets(index, initIdx, ++hiddenCount);
        }
        if (hiddenCount === this.sheets.length) {
            this.setSheetPropertyOnMute(this.sheets[0], 'state', 'Visible');
            return 0;
        }
        return index;
    }

    /**
     * To perform the undo operation in spreadsheet.
     */
    public undo(): void {
        this.notify(performUndoRedo, { isUndo: true, isPublic: true });
    }

    /**
     * To perform the redo operation in spreadsheet.
     */
    public redo(): void {
        this.notify(performUndoRedo, { isUndo: false, isPublic: true });
    }

    /**
     * To update the undo redo collection in spreadsheet.
     * @param {object} args - options for undo redo.
     */
    public updateUndoRedoCollection(args: { [key: string]: Object }): void {
        this.notify(updateUndoRedoCollection, { args: args, isPublic: true });
    }

    /**
     * Adds the defined name to the Spreadsheet.
     * @param {DefineNameModel} definedName - Specifies the name.
     * @return {boolean} - Return the added status of the defined name.
     */
    public addDefinedName(definedName: DefineNameModel): boolean {
        let eventArgs: { [key: string]: Object } = {
            action: 'addDefinedName',
            isAdded: false,
            definedName: definedName
        };
        this.notify(formulaOperation, eventArgs);
        return <boolean>eventArgs.isAdded;
    }

    /**
     * Removes the defined name from the Spreadsheet.
     * @param {string} definedName - Specifies the name.
     * @param {string} scope - Specifies the scope of the defined name.
     * @return {boolean} - Return the removed status of the defined name.
     */
    public removeDefinedName(definedName: string, scope: string): boolean {
        return super.removeDefinedName(definedName, scope);
    }

    private mouseClickHandler(e: MouseEvent & TouchEvent): void {
        this.notify(click, e);
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.notify(mouseDown, e);
    }

    private keyUpHandler(e: KeyboardEvent): void {
        if (closest(e.target as Element, '.e-find-dlg')) {
            this.notify(findKeyUp, e);
        } else {
            this.notify(keyUp, e);
        }
    }

    private keyDownHandler(e: KeyboardEvent): void {
        if (!closest(e.target as Element, '.e-findtool-dlg')) {
            this.notify(keyDown, e);
        }
    }

    /**
     * Binding events to the element while component creation.     
     */
    private wireEvents(): void {
        EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, getStartEvent(), this.mouseDownHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        EventHandler.add(this.element, 'noderefresh', this.refreshNode, this);
    }

    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     */
    public destroy(): void {
        this.unwireEvents();
        this.notify(spreadsheetDestroyed, null);
        super.destroy();
        this.element.innerHTML = '';
        this.element.removeAttribute('tabindex');
        this.element.removeAttribute('role');
        this.element.style.removeProperty('height');
        this.element.style.removeProperty('width');
        this.element.style.removeProperty('min-height');
        this.element.style.removeProperty('min-width');
    }

    /**
     * Unbinding events from the element while component destroy.     
     */
    private unwireEvents(): void {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
        EventHandler.remove(this.element, getStartEvent(), this.mouseDownHandler);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        EventHandler.remove(this.element, 'noderefresh', this.refreshNode);
    }

    /**
     * To add context menu items.
     * @param {MenuItemModel[]} items - Items that needs to be added.
     * @param {string} text - Item before / after that the element to be inserted.
     * @param {boolean} insertAfter - Set `false` if the `items` need to be inserted before the `text`.
     * By default, `items` are added after the `text`.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    public addContextMenuItems(items: MenuItemModel[], text: string, insertAfter: boolean = true, isUniqueId?: boolean): void {
        this.notify(addContextMenuItems, { items: items, text: text, insertAfter: insertAfter, isUniqueId: isUniqueId });
    }

    /**
     * To remove existing context menu items.
     * @param {string[]} items - Items that needs to be removed.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    public removeContextMenuItems(items: string[], isUniqueId?: boolean): void {
        this.notify(removeContextMenuItems, { items: items, isUniqueId: isUniqueId });
    }

    /**
     * To enable / disable context menu items.
     * @param {string[]} items - Items that needs to be enabled / disabled.
     * @param {boolean} enable - Set `true` / `false` to enable / disable the menu items.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    public enableContextMenuItems(items: string[], enable: boolean = true, isUniqueId?: boolean): void {
        this.notify(enableContextMenuItems, { items: items, enable: enable, isUniqueId: isUniqueId });
    }

    /**
     * To enable / disable file menu items.
     * @param {string[]} items - Items that needs to be enabled / disabled.
     * @param {boolean} enable? - Set `true` / `false` to enable / disable the menu items.
     * @param {boolean} isUniqueId? - Set `true` if the given file menu items `text` is a unique id.
     * @returns void.
     */
    public enableFileMenuItems(items: string[], enable: boolean = true, isUniqueId?: boolean): void {
        this.notify(enableFileMenuItems, { items: items, enable: enable, isUniqueId: isUniqueId });
    }

    /**
     * To show/hide the file menu items in Spreadsheet ribbon.
     * @param {string[]} items - Specifies the file menu items text which is to be show/hide.
     * @param {boolean} hide? - Set `true` / `false` to hide / show the file menu items.
     * @param {boolean} isUniqueId? - Set `true` if the given file menu items `text` is a unique id.
     * @returns void.
     */
    public hideFileMenuItems(items: string[], hide: boolean = true, isUniqueId?: boolean): void {
        this.notify(hideFileMenuItems, { items: items, hide: hide, isUniqueId: isUniqueId });
    }

    /**
     * To add custom file menu items.
     * @param {MenuItemModel[]} items - Specifies the ribbon file menu items to be inserted.
     * @param {string} text - Specifies the existing file menu item text before / after which the new file menu items to be inserted.
     * @param {boolean} insertAfter? - Set `false` if the `items` need to be inserted before the `text`.
     * By default, `items` are added after the `text`.
     * @param {boolean} isUniqueId? - Set `true` if the given file menu items `text` is a unique id.
     * @returns void.
     */
    public addFileMenuItems(items: MenuItemModel[], text: string, insertAfter: boolean = true, isUniqueId?: boolean): void {
        this.notify(addFileMenuItems, { items: items, text: text, insertAfter: insertAfter, isUniqueId: isUniqueId });
    }

    /**
     * To show/hide the existing ribbon tabs.
     * @param {string[]} tabs - Specifies the tab header text which needs to be shown/hidden.
     * @param {boolean} hide? - Set `true` / `false` to hide / show the ribbon tabs.
     * @returns void.
     */
    public hideRibbonTabs(tabs: string[], hide: boolean = true): void {
        this.notify(hideRibbonTabs, { tabs: tabs, hide: hide });
    }

    /**
     * To enable / disable the existing ribbon tabs.
     * @param {string[]} tabs - Specifies the tab header text which needs to be enabled / disabled.
     * @param {boolean} enable? - Set `true` / `false` to enable / disable the ribbon tabs.
     * @returns void.
     */
    public enableRibbonTabs(tabs: string[], enable: boolean = true): void {
        this.notify(enableRibbonTabs, { tabs: tabs, enable: enable });
    }


    /**
     * To add custom ribbon tabs.
     * @param {RibbonItemModel[]} items - Specifies the ribbon tab items to be inserted.
     * @param {string} insertBefore? - Specifies the existing ribbon header text before which the new tabs will be inserted.
     * If not specified, the new tabs will be inserted at the end.
     * @returns void.
     */
    public addRibbonTabs(items: RibbonItemModel[], insertBefore?: string): void {
        this.notify(addRibbonTabs, { items: items, insertBefore: insertBefore });
    }

    /**
     * Enables or disables the specified ribbon toolbar items or all ribbon items.
     * @param {string} tab - Specifies the ribbon tab header text under which the toolbar items need to be enabled / disabled.
     * @param {string[]} items? - Specifies the toolbar item indexes / unique id's which needs to be enabled / disabled.
     * If it is not specified the entire toolbar items will be enabled / disabled.
     * @param  {boolean} enable? - Boolean value that determines whether the toolbar items should be enabled or disabled.
     * @returns void.
     */
    public enableToolbarItems(tab: string, items?: number[] | string[], enable?: boolean): void {
        this.notify(enableToolbarItems, [{ tab: tab, items: items, enable: enable === undefined ? true : enable }]);
    }

    /**
     * To show/hide the existing Spreadsheet ribbon toolbar items.
     * @param {string} tab - Specifies the ribbon tab header text under which the specified items needs to be hidden / shown.
     * @param {string[]} indexes - Specifies the toolbar indexes which needs to be shown/hidden from UI.
     * @param {boolean} hide? - Set `true` / `false` to hide / show the toolbar items.
     * @returns void.
     */
    public hideToolbarItems(tab: string, indexes: number[], hide: boolean = true): void {
        this.notify(hideToolbarItems, { tab: tab, indexes: indexes, hide: hide });
    }

    /**
     * To add the custom items in Spreadsheet ribbon toolbar.
     * @param {string} tab - Specifies the ribbon tab header text under which the specified items will be inserted.
     * @param {ItemModel[]} items - Specifies the ribbon toolbar items that needs to be inserted.
     * @param {number} index? - Specifies the index text before which the new items will be inserted.
     * If not specified, the new items will be inserted at the end of the toolbar.
     * @returns void.
     */
    public addToolbarItems(tab: string, items: ItemModel[], index?: number): void {
        this.notify(addToolbarItems, { tab: tab, items: items, index: index });
    }

    /**
     * Selects the cell / range of cells with specified address.
     * @param {string} address - Specifies the range address.
     */
    public selectRange(address: string): void {
        this.notify(selectRange, { indexes: getRangeIndexes(address) });
    }

    /**
     * Start edit the active cell.
     * @return {void}
     */
    public startEdit(): void {
        this.notify(editOperation, { action: 'startEdit', isNewValueEdit: false });
    }

    /**
     * Cancels the edited state, this will not update any value in the cell.
     * @return {void}
     */
    public closeEdit(): void {
        this.notify(editOperation, { action: 'cancelEdit' });
    }

    /**
     * If Spreadsheet is in editable state, you can save the cell by invoking endEdit.
     * @return {void}
     */
    public endEdit(): void {
        this.notify(editOperation, { action: 'endEdit' });
    }

    /**
     * Called internally if any of the property value changed.
     * @param  {SpreadsheetModel} newProp
     * @param  {SpreadsheetModel} oldProp
     * @returns void
     * @hidden
     */
    public onPropertyChanged(newProp: SpreadsheetModel, oldProp: SpreadsheetModel): void {
        super.onPropertyChanged(newProp, oldProp);
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enableRtl':
                    newProp.enableRtl ? document.getElementById(this.element.id + '_sheet_panel').classList.add('e-rtl') :
                        document.getElementById(this.element.id + '_sheet_panel').classList.remove('e-rtl');
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) { removeClass([this.element], oldProp.cssClass.split(' ')); }
                    if (newProp.cssClass) { addClass([this.element], newProp.cssClass.split(' ')); }
                    break;
                case 'activeSheetIndex':
                    this.renderModule.refreshSheet();
                    this.notify(activeSheetChanged, { idx: newProp.activeSheetIndex });
                    break;
                case 'width':
                    this.setWidth();
                    this.resize();
                    break;
                case 'height':
                    this.setHeight();
                    this.resize();
                    break;
                case 'showRibbon':
                    this.notify(ribbon, { uiUpdate: true });
                    break;
                case 'showFormulaBar':
                    this.notify(formulaBar, { uiUpdate: true });
                    break;
                case 'showSheetTabs':
                    this.notify(sheetTabs, null);
                    break;
                case 'cellStyle':
                    this.renderModule.refreshSheet();
                    break;
                case 'allowEditing':
                    if (this.allowEditing) {
                        this.notify(editOperation, { action: 'renderEditor' });
                    }
                    break;
                case 'sheets':
                    // Object.keys(newProp.sheets).forEach((sheetIdx: string): void => {
                    // if (this.activeSheetIndex === Number(sheetIdx)) {
                    //     if (newProp.sheets[sheetIdx].showGridLines !== undefined) {
                    //         this.notify(updateToggleItem, { props: 'GridLines', pos: 2 });
                    //     }
                    //     if (newProp.sheets[sheetIdx].showHeaders !== undefined) {
                    //         this.sheetModule.showHideHeaders();
                    //         this.notify(updateToggleItem, { props: 'Headers', pos: 0 });
                    //     }
                    // }
                    // if (newProp.sheets[sheetIdx].name !== undefined) {
                    //     this.notify(sheetNameUpdate, {
                    //         items: this.element.querySelector('.e-sheet-tabs-items').children[sheetIdx],
                    //         value: newProp.sheets[sheetIdx].name,
                    //         idx: sheetIdx
                    //     });
                    // }
                    // if (newProp.sheets[sheetIdx].range) {
                    //     this.sheets[sheetIdx].range = newProp.sheets[sheetIdx].range;

                    Object.keys(newProp.sheets).forEach((sheetIdx: string, index: number) => {
                        let sheet: SheetModel = newProp.sheets[sheetIdx];
                        if (sheet.ranges && Object.keys(sheet.ranges).length) {
                            let ranges: string[] = Object.keys(sheet.ranges);
                            let newRangeIdx: number;
                            ranges.forEach((rangeIdx: string, idx: number) => {
                                if (!sheet.ranges[rangeIdx].info) {
                                    newRangeIdx = idx;
                                }
                            });
                            ranges.forEach((rangeIdx: string, idx: number) => {
                                if (sheet.ranges[rangeIdx].dataSource && (isUndefined(newRangeIdx)
                                    || (!isUndefined(newRangeIdx) && newRangeIdx === idx))) {
                                    this.notify(dataSourceChanged, {
                                        sheetIdx: sheetIdx, rangeIdx: rangeIdx,
                                        isLastRange: ranges.length - 1 === idx
                                    });
                                }
                            });
                        } else {
                            if (index === 0) {
                                this.renderModule.refreshSheet();
                            }
                            if (this.showSheetTabs && sheet.name) {
                                this.notify(sheetNameUpdate, {
                                    items: this.element.querySelector('.e-sheet-tabs-items').children[sheetIdx],
                                    value: sheet.name,
                                    idx: sheetIdx
                                });
                            }
                        }
                    });
                    break;
                case 'locale':
                    this.refresh();
                    break;
            }
        }
    }

    /**
     * To provide the array of modules needed for component rendering.
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        return getRequiredModules(this);
    }

    /**
     * Appends the control within the given HTML Div element.
     * @param {string | HTMLElement} selector - Target element where control needs to be appended.
     */
    public appendTo(selector: string | HTMLElement): void {
        super.appendTo(selector);
    }

    /**
     * Filters the range of cells in the sheet.
     */
    public filter(filterOptions?: FilterOptions, range?: string): Promise<FilterEventArgs> {
        if (!this.allowFiltering) { return Promise.reject(); }
        range = range || this.getActiveSheet().selectedRange;
        return super.filter(filterOptions, range);
    }

    /**
     * Clears the filter changes of the sheet.
     */
    public clearFilter(field?: string): void {
        if (field) {
            this.notify(clearFilter, { field: field });
        } else {
            super.clearFilter();
        }
    }

    /**
     * Applies the filter UI in the range of cells in the sheet.
     */
    public applyFilter(predicates?: PredicateModel[], range?: string): void {
        this.notify(initiateFilterUI, { predicates: predicates, range: range });
    }

    /**
     * To add custom library function.
     * @param {string} functionHandler - Custom function handler name
     * @param {string} functionName - Custom function name
     */
    public addCustomFunction(functionHandler: string | Function, functionName?: string): void {
        super.addCustomFunction(functionHandler, functionName);
        this.notify(refreshFormulaDatasource, null);
    }
}