/// <reference path='../../workbook/base/workbook-model.d.ts'/>
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, ModuleDeclaration, EventHandler, Event } from '@syncfusion/ej2-base';
import { addClass, removeClass, EmitType, Complex, formatUnit, detach, L10n, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { MenuItemModel, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { initialLoad, mouseDown, spreadsheetDestroyed, keyUp, BeforeOpenEventArgs, hideShowRow, performUndoRedo } from '../common/index';
import { HideShowEventArgs, sheetNameUpdate, updateUndoRedoCollection, getUpdateUsingRaf } from '../common/index';
import { actionEvents, collaborativeUpdate, CollaborativeEditArgs, keyDown } from '../common/index';
import { getSiblingsHeight, ICellRenderer, colWidthChanged, rowHeightChanged } from '../common/index';
import { defaultLocale, locale, setAriaOptions, setResize, updateToggleItem, initiateFilterUI, clearFilter } from '../common/index';
import { CellEditEventArgs, CellSaveEventArgs, ribbon, formulaBar, sheetTabs, formulaOperation } from '../common/index';
import { addContextMenuItems, removeContextMenuItems, enableContextMenuItems, selectRange } from '../common/index';
import { cut, copy, paste, PasteSpecialType, dialog, editOperation, activeSheetChanged } from '../common/index';
import { Render } from '../renderer/render';
import { Scroll, VirtualScroll, Edit, CellFormat, Selection, KeyboardNavigation, KeyboardShortcut } from '../actions/index';
import { Clipboard, ShowHide, UndoRedo, SpreadsheetHyperlink } from '../actions/index';
import { CellRenderEventArgs, IRenderer, IViewport, OpenOptions, MenuSelectArgs, click } from '../common/index';
import { Dialog, ActionEvents } from '../services/index';
import { ServiceLocator } from '../../workbook/services/index';
import { SheetModel, getColumnsWidth, getSheetIndex, WorkbookHyperlink, HyperlinkModel, DefineNameModel } from './../../workbook/index';
import { BeforeHyperlinkArgs, AfterHyperlinkArgs } from './../../workbook/common/interface';
import { activeCellChanged, BeforeCellFormatArgs, afterHyperlinkCreate } from './../../workbook/index';
import { BeforeSaveEventArgs, SaveCompleteEventArgs } from './../../workbook/index';
import { getSheetNameFromAddress, DataBind, CellModel, beforeHyperlinkCreate } from './../../workbook/index';
import { BeforeSortEventArgs, SortOptions, sortComplete, SortEventArgs } from './../../workbook/index';
import { getSheetIndexFromId, WorkbookEdit, WorkbookOpen, WorkbookSave, WorkbookCellFormat, WorkbookSort } from './../../workbook/index';
import { FilterOptions, FilterEventArgs } from './../../workbook/index';
import { Workbook } from '../../workbook/base/workbook';
import { SpreadsheetModel } from './spreadsheet-model';
import { Resize } from '../actions/index';
import { getRequiredModules, ScrollSettings, ScrollSettingsModel, SelectionSettingsModel } from '../common/index';
import { SelectionSettings, BeforeSelectEventArgs, SelectEventArgs, getStartEvent } from '../common/index';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { setRowHeight, getRowsHeight, isHiddenRow, getColumnWidth, getRowHeight } from './../../workbook/base/index';
import { getRangeIndexes, getIndexesFromAddress, getCellIndexes, WorkbookNumberFormat, WorkbookFormula } from '../../workbook/index';
import { RefreshValueArgs, Ribbon, FormulaBar, SheetTabs, Open, ContextMenu, Save, NumberFormat, Formula } from '../integrations/index';
import { Sort, Filter } from '../integrations/index';
import { isNumber, getColumn, WorkbookFilter } from '../../workbook/index';
import { PredicateModel } from '@syncfusion/ej2-grids';

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
     *       contextMenuItemSelect: (args: MenuSelectArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public contextMenuItemSelect: EmitType<MenuSelectArgs>;

    /**
     * Triggers when the file menu item is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileItemSelect: (args: MenuSelectArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public fileItemSelect: EmitType<MenuSelectArgs>;

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
     * Triggers when the component is created.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       created: (args: Event) => {
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
     *                    |BeforeSortEventArgs|CellEditEventArgs|MenuSelectArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public actionBegin: EmitType<BeforeCellFormatArgs | BeforeOpenEventArgs | BeforeSaveEventArgs | BeforeSelectEventArgs | BeforeSortEventArgs | CellEditEventArgs | MenuSelectArgs>;

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
    public viewport: IViewport = {
        rowCount: 0, colCount: 0, height: 0, topIndex: 0, leftIndex: 0, width: 0,
        bottomIndex: 0
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
            Save, NumberFormat, CellFormat, Formula, WorkbookEdit, WorkbookOpen, WorkbookSave, WorkbookCellFormat,
            WorkbookNumberFormat, WorkbookFormula, Sort, WorkbookSort, Resize, UndoRedo, WorkbookFilter, Filter,
            SpreadsheetHyperlink, WorkbookHyperlink
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
    public getCell(rowIndex: number, colIndex: number): HTMLElement {
        if (this.scrollSettings.enableVirtualization) { colIndex = colIndex - this.viewport.leftIndex; }
        let row: HTMLTableRowElement = this.getRow(rowIndex);
        return row ? row.cells[colIndex] : row;
    }

    /**
     * Get cell element.
     * @returns HTMLTableRowElement
     * @hidden
     */
    public getRow(index: number, table?: HTMLTableElement): HTMLTableRowElement {
        if (this.scrollSettings.enableVirtualization) {
            index -= this.hiddenRowsCount(this.viewport.topIndex, index);
            index -= this.viewport.topIndex;
        }
        table = table || this.getContentTable();
        return table ? table.rows[index] : null;
    }

    /** @hidden */
    public hiddenRowsCount(startIndex: number, endIndex: number): number {
        let sheet: SheetModel = this.getActiveSheet(); let count: number = 0;
        for (let i: number = startIndex; i <= endIndex; i++) {
            if (isHiddenRow(sheet, i)) { count++; }
        }
        return count;
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
     * Selection will navigates to the specified cell address in active sheet.
     * @param {string} address - Specifies the cell address which needs to navigate.
     */
    public goTo(address: string): void {
        let indexes: number[] = getRangeIndexes(address);
        let content: Element = this.getMainContent();
        let sheet: SheetModel = this.getActiveSheet();
        let vTrack: HTMLElement; let cVTrack: HTMLElement; let rVTrack: HTMLElement;
        let offset: number; let vWidth: number; let vHeight: number; let scrollableSize: number;
        if (indexes[0] === 0) {
            content.scrollTop = 0;
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
            content.scrollTop = offset;
        }
        if (indexes[1] === 0) {
            content.scrollLeft = 0;
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
            content.scrollLeft = offset;
        }
    }

    /**
     * This method is used to resize the Spreadsheet component.
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
            type: type, isAction: false
        });
    }

    /**
     * To update the action which need to perform.
     * @param {string} options - event options.
     */
    public updateAction(options: string): void {
        let model: CollaborativeEditArgs = JSON.parse(options) as CollaborativeEditArgs;
        this.notify(collaborativeUpdate, { action: model.action, eventArgs: model.eventArgs });
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
     */
    public setColWidth(width: number | string, colIndex: number, sheetIndex: number): void {
        let colThreshold: number = this.getThreshold('col');
        let lastIdx: number = this.viewport.leftIndex + this.viewport.colCount + (colThreshold * 2);
        sheetIndex = isNullOrUndefined(sheetIndex) ? null : sheetIndex - 1;
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
            this.setProperties({ sheets: this.sheets }, true);
        }
    }

    /**
     * Set the height of row. 
     * @param {number} height
     * @param {number} rowIndex
     * @param {number} sheetIndex
     */
    public setRowHeight(height: number | string, rowIndex: number, sheetIndex: number): void {
        sheetIndex = isNullOrUndefined(sheetIndex) ? null : sheetIndex - 1;
        let sheet: SheetModel = isNullOrUndefined(sheetIndex) ? this.getActiveSheet() : this.sheets[sheetIndex];
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
                        setResize(rowIndex, rowHeight, false, this);
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
            this.setProperties({ sheets: this.sheets }, true);
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
            sheetIdx = parseInt(rangeArr[0].replace(/\D/g, ''), 10) - 1;
            sheet = this.sheets[sheetIdx];
            range = rangeArr[1];
        }
        let rangeIndexes: number[] = range ? getRangeIndexes(range) : getRangeIndexes(this.getActiveSheet().activeCell);
        let cellMod: CellModel;
        for (let rowIdx: number = rangeIndexes[0]; rowIdx <= rangeIndexes[2]; rowIdx++) {
            for (let colIdx: number = rangeIndexes[1]; colIdx <= rangeIndexes[3]; colIdx++) {
                if (sheet && sheet.rows[rowIdx] && sheet.rows[rowIdx].cells[colIdx]) {
                    cellMod = sheet.rows[rowIdx].cells[colIdx];
                    if (typeof (cellMod.hyperlink) === 'string') {
                        cellMod.value = cellMod.value ? cellMod.value : cellMod.hyperlink;
                    } else {
                        cellMod.value = cellMod.value ? cellMod.value : cellMod.hyperlink.address;
                    }
                    delete (cellMod.hyperlink);
                    if (sheet === this.getActiveSheet()) {
                        let eleRowIdx: number ;
                        let eleColIdx: number;
                        if (this.scrollSettings.enableVirtualization) {
                            eleRowIdx = rowIdx - this.viewport.topIndex;
                            eleColIdx = colIdx - this.viewport.leftIndex;
                        }
                        let cell: HTMLElement = this.element.getElementsByClassName('e-main-content')[0].
                            getElementsByClassName('e-row')[eleRowIdx].getElementsByClassName('e-cell')[eleColIdx] as HTMLElement;
                        if (cell.getElementsByClassName('e-hyperlink')[0]) {
                            cell.innerText = cell.getElementsByClassName('e-hyperlink')[0].innerHTML;
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
                    sheetIdx = parseInt(addrRange[0].replace(/\D/g, ''), 10) - 1;
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
                if (displayText !== '' ) {
                    mCell.value = displayText;
                } else if (isNullOrUndefined(mCell.value) || mCell.value === '' ) {
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
    public showHideRow(hide: boolean, startRow: number, endRow: number = startRow): void {
        this.notify(hideShowRow, <HideShowEventArgs>{ startRow: startRow, endRow: endRow, hide: hide });
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
    public getThreshold(layout: string): number {
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
        this.notify(activeCellChanged, {});
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
        let spanElem: Element = td.querySelector('.e-' + this.element.id + '_currency');
        let alignClass: string = 'e-right-align';
        if (args) {
            args.result = isNullOrUndefined(args.result) ? '' : args.result.toString();
            if (spanElem) { detach(spanElem); }
            if (args.type === 'Accounting' && isNumber(args.value)) {
                td.textContent = args.result.split(args.curSymbol).join('');
                td.appendChild(this.createElement('span', {
                    className: 'e-' + this.element.id + '_currency',
                    innerHTML: ` ${args.curSymbol}`,
                    styles: 'float: left'
                }));
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

    /** @hidden */
    public skipHiddenRows(startIdx: number, endIdx: number): number[] {
        let count: number = 0;
        let sheet: SheetModel = this.getActiveSheet();
        for (let i: number = startIdx; i <= endIdx; i++) {
            if (isHiddenRow(sheet, i)) {
                if (startIdx === i) { startIdx++; }
                endIdx++;
            }
        }
        return [startIdx, endIdx];
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
        return super.addDefinedName(definedName);
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
        this.notify(keyUp, e);
    }

    private keyDownHandler(e: KeyboardEvent): void {
        this.notify(keyDown, e);
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
     * Selects the cell / range of cells with specified address.
     * @param {string} address - Specifies the range address.
     */
    public selectRange(address: string): void {
        this.notify(selectRange, getRangeIndexes(address));
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
                case 'activeSheetTab':
                    this.renderModule.refreshSheet();
                    this.notify(activeSheetChanged, { idx: newProp.activeSheetTab - 1 });
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
                case 'sheets':
                    Object.keys(newProp.sheets).forEach((sheetIdx: string): void => {
                        if (this.activeSheetTab - 1 === Number(sheetIdx)) {
                            if (newProp.sheets[sheetIdx].showGridLines !== undefined) {
                                this.notify(updateToggleItem, { props: 'GridLines', pos: 2 });
                            }
                            if (newProp.sheets[sheetIdx].showHeaders !== undefined) {
                                this.sheetModule.showHideHeaders();
                                this.notify(updateToggleItem, { props: 'Headers', pos: 0 });
                            }
                        }
                        if (newProp.sheets[sheetIdx].name !== undefined) {
                            this.notify(sheetNameUpdate, {
                                items: this.element.querySelector('.e-sheet-tabs-items').children[sheetIdx],
                                value: newProp.sheets[sheetIdx].name,
                                idx: sheetIdx
                            });
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
}