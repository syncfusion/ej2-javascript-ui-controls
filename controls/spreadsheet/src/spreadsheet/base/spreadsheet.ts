/// <reference path='../../workbook/base/workbook-model.d.ts'/>
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, ModuleDeclaration, EventHandler, Event } from '@syncfusion/ej2-base';
import { addClass, removeClass, EmitType, Complex, formatUnit, detach, L10n, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { MenuItemModel, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { initialLoad, mouseDown, spreadsheetDestroyed, keyUp, keyDown, getSiblingsHeight } from '../common/index';
import { defaultLocale, locale, setAriaOptions } from '../common/index';
import { CellEditEventArgs, CellSaveEventArgs, ribbon, formulaBar, sheetTabs, formulaOperation } from '../common/index';
import { addContextMenuItems, removeContextMenuItems, enableContextMenuItems, selectRange } from '../common/index';
import { cut, copy, paste, PasteSpecialType, dialog, editOperation, activeSheetChanged } from '../common/index';
import { Render } from '../renderer/render';
import { Scroll, VirtualScroll, Edit, CellFormat, Selection, KeyboardNavigation, KeyboardShortcut, Clipboard } from '../actions/index';
import { CellRenderEventArgs, IRenderer, IViewport, OpenOptions, MenuSelectArgs, click } from '../common/index';
import { ServiceLocator, Dialog } from '../services/index';
import { SheetModel, getCellPosition, getColumnsWidth, getSheetIndex, getSheetNameFromAddress, DataBind } from './../../workbook/index';
import { BeforeSortEventArgs, SortOptions, beforeSort } from './../../workbook/index';
import { getSheetIndexFromId, WorkbookEdit, WorkbookOpen, WorkbookSave, WorkbookCellFormat, WorkbookSort } from './../../workbook/index';
import { Workbook } from '../../workbook/base/workbook';
import { SpreadsheetModel } from './spreadsheet-model';
import { Resize } from '../actions/index';
import { getRequiredModules, setStyleAttribute, ScrollSettings, ScrollSettingsModel, SelectionSettingsModel } from '../common/index';
import { SelectionSettings, BeforeSelectEventArgs, SelectEventArgs, getStartEvent } from '../common/index';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { setRowHeight, getRowsHeight } from './../../workbook/base/row';
import { getRangeIndexes, getIndexesFromAddress, getCellIndexes, WorkbookNumberFormat, WorkbookFormula } from '../../workbook/index';
import { RefreshValueArgs, Ribbon, FormulaBar, SheetTabs, Open, ContextMenu, Save, NumberFormat, Formula } from '../integrations/index';
import { Sort } from '../integrations/index';
import { isNumber } from '../../workbook/index';

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

    /** @hidden */
    public isOpen: boolean = false;

    /** @hidden */
    public isEdit: boolean = false;

    /** @hidden */
    public serviceLocator: ServiceLocator;

    /** @hidden */
    public renderModule: Render;

    /** @hidden */
    public scrollModule: Scroll;

    /** @hidden */
    public sheetModule: IRenderer;

    /** @hidden */
    public viewport: IViewport = { rowCount: 0, colCount: 0, height: 0, topIndex: 0, leftIndex: 0, width: 0 };

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
            WorkbookNumberFormat, WorkbookFormula, Sort, WorkbookSort, Resize
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
    public getRow(rowIndex: number, table?: HTMLTableElement): HTMLTableRowElement {
        if (this.scrollSettings.enableVirtualization) { rowIndex = rowIndex - this.viewport.topIndex; }
        table = table || this.getContentTable();
        return table ? table.rows[rowIndex] : null;
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
        content.scrollTop = indexes[0] ? getRowsHeight(sheet, 0, indexes[0] - 1) : 0;
        content.scrollLeft = indexes[1] ? getColumnsWidth(sheet, 0, indexes[1] - 1) : 0;
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
    public cut(address?: string): void {
        this.notify(cut, address ? {
            range: getIndexesFromAddress(address),
            sId: this.sheets[getSheetIndex(this, getSheetNameFromAddress(address))].id
        } : null);
    }

    /**
     * To copy the specified cell or cells properties such as value, format, style etc...
     * @param {string} address - Specifies the range address.
     */
    public copy(address?: string): void {
        this.notify(copy, address ? {
            range: getIndexesFromAddress(address),
            sId: this.sheets[getSheetIndex(this, getSheetNameFromAddress(address))].id
        } : null);
    }

    /**
     * This method is used to paste the cut or copied cells in to specified address.
     * @param {string} address - Specifies the cell or range address.
     * @param {PasteSpecialType} type - Specifies the type of paste.
     */
    public paste(address?: string, type?: PasteSpecialType): void {
        this.notify(paste, {
            range: getIndexesFromAddress(address), sIdx: getSheetIndex(this, getSheetNameFromAddress(address)),
            type: type
        });
    }

    private setHeight(): void {
        if (this.height.toString().indexOf('%') > -1) { this.element.style.minHeight = '400px'; }
        this.element.style.height = formatUnit(this.height);
    }

    private setWidth(): void {
        if (this.width.toString().indexOf('%') > -1 || this.width === 'auto') { this.element.style.minWidth = '300px'; }
        this.element.style.width = formatUnit(this.width);
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
     * Sorts the range of cells in the active sheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
     public sort(sortOptions?: SortOptions, range?: string): void {
        if (!range) {
            range = this.getActiveSheet().selectedRange;
        }
        sortOptions = sortOptions || { sortDescriptors: {} };
        let args: BeforeSortEventArgs = { range: range, sortOptions: sortOptions, cancel: false };
        this.trigger(beforeSort, args);
        if (args.cancel) { return; }
        this.notify(beforeSort, args);
        super.sort(args.sortOptions, range);
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
    public setRowHeight(sheetIndex: number, rowIndex: number, height: number): void {
        let actRowIdx: number = getCellIndexes(this.getActiveSheet().activeCell)[0];
        let contentElem: HTMLTableElement = this.element.querySelector('.e-main-content .e-table') as HTMLTableElement;
        let rowHdrElem: HTMLTableElement = this.element.querySelector('.e-row-header .e-table') as HTMLTableElement;
        contentElem.rows[rowIndex].style.height = height + 'px';
        rowHdrElem.rows[rowIndex].style.height = height + 'px';
        setRowHeight(this.sheets[sheetIndex - 1], rowIndex, height);
        if (actRowIdx === rowIndex) {
            setStyleAttribute([{ element: this.element.getElementsByClassName('e-selection')[0], attrs: { 'height': height + 'px' } }]);
        } else {
            let cellPosition: { top: number, left: number } = getCellPosition(this.getActiveSheet(), [actRowIdx, 0, actRowIdx, 0]);
            setStyleAttribute([{
                element: this.element.getElementsByClassName('e-selection')[0],
                attrs: { 'top': cellPosition.top + 'px' }
            }]);
        }
    }

    /** @hidden */
    public refreshNode(td: Element, args?: RefreshValueArgs): void {
        let value: string;
        let spanElem: Element = td.querySelector('.' + this.element.id + '_currency');
        let alignClass: string = 'e-right-align';
        if (args) {
            args.result = isNullOrUndefined(args.result) ? '' : args.result.toString();
            if (args.type === 'Accounting' && isNumber(args.value)) {
                td.innerHTML = '';
                td.appendChild(this.createElement('span', {
                    className: this.element.id + '_currency',
                    innerHTML: ` ${args.curSymbol}`,
                    styles: 'float: left'
                }));
                td.innerHTML += args.result.split(args.curSymbol).join('');
                td.classList.add(alignClass);
                return;
            } else {
                if (spanElem) { detach(spanElem); }
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
            if (node && (node.nodeType === 3 || (node.nodeType === 1))) {
                node.nodeValue = value;
            } else {
                td.appendChild(document.createTextNode(value));
            }
        }
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
}