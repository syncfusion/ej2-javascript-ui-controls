import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Collection, Complex, EmitType } from '@syncfusion/ej2-base';
import { Event, ModuleDeclaration, merge } from '@syncfusion/ej2-base';
import { Sheet, initSheet, getSheet, getSheetIndexFromId, getSheetNameCount, getMaxSheetId, getSheetIndex } from './sheet';
import { WorkbookModel } from './workbook-model';
import { DefineNameModel } from '../common/class-model';
import { getWorkbookRequiredModules } from '../common/module';
import { getData, clearRange } from './data';
import { SheetModel } from './sheet-model';
import { CellModel } from './cell-model';
import { OpenOptions, BeforeOpenEventArgs, OpenFailureArgs } from '../../spreadsheet/common/interface';
import { DefineName, CellStyle, updateUsedRange, getIndexesFromAddress } from '../common/index';
import * as events from '../common/event';
import { CellStyleModel } from '../common/index';
import { setCellFormat, sheetCreated } from '../common/index';
import { BeforeSaveEventArgs, SaveCompleteEventArgs, BeforeCellFormatArgs, SaveOptions } from '../common/interface';
import { SortOptions, BeforeSortEventArgs, SortEventArgs } from '../common/interface';
import { getCell, skipDefaultValue, setCell } from './cell';
import { DataBind } from '../index';
import { WorkbookSave, WorkbookFormula, WorkbookOpen, WorkbookSort } from '../integrations/index';
import { WorkbookNumberFormat } from '../integrations/number-format';
import { WorkbookEdit, WorkbookCellFormat } from '../actions/index';

/**
 * Represents the Workbook.
 */
@NotifyPropertyChanges
export class Workbook extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Configures sheets and its options.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      sheets: [{
     *                  name: 'First Sheet',
     *                  rangeSettings: [{ dataSource: data }],
     *                  rows: [{
     *                          index: 5,
     *                          cells: [{ index: 4, value: 'Total Amount:' },
     *                                  { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
     *                  }]
     *              }, {
     *                  name: 'Second Sheet',
     *                  columns: [{ width: 180 }, { index: 4, width: 130 }]
     *              }]
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default []
     */
    @Collection([], Sheet)
    public sheets: SheetModel[];

    /**
     * Specifies active sheet tab in workbook.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      activeSheetTab: 2
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default 1
     * @asptype int
     */
    @Property(1)
    public activeSheetTab: number;

    /**
     * Defines the height of the Spreadsheet. It accepts height as pixels, number, and percentage.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      height: '550px'
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Defines the width of the Spreadsheet. It accepts width as pixels, number, and percentage.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      width: '550px'
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * It shows or hides the ribbon in spreadsheet.
     * @default true
     */
    @Property(true)
    public showRibbon: boolean;

    /**
     * It shows or hides the formula bar and its features.
     * @default true
     */
    @Property(true)
    public showFormulaBar: boolean;

    /**
     * It shows or hides the sheets tabs, this is used to navigate among the sheets and create or delete sheets by UI interaction.
     * @default true
     */
    @Property(true)
    public showSheetTabs: boolean;

    /**
     * It allows you to add new data or update existing cell data. If it is false, it will act as read only mode.
     * @default true
     */
    @Property(true)
    public allowEditing: boolean;

    /**
     * It allows you to open an Excel file (.xlsx, .xls, and .csv) in Spreadsheet.
     * @default true
     */
    @Property(true)
    public allowOpen: boolean;

    /**
     * It allows you to save Spreadsheet with all data as Excel file (.xlsx, .xls, and .csv).
     * @default true
     */
    @Property(true)
    public allowSave: boolean;

    /**
     * It allows to enable/disable sort and its functionalities.
     * @default true
     */
    @Property(true)
    public allowSorting: boolean;

    /**
     * It allows formatting a raw number into different types of formats (number, currency, accounting, percentage, short date,
     * long date, time, fraction, scientific, and text) with built-in format codes.
     * @default true
     */
    @Property(true)
    public allowNumberFormatting: boolean;

    /**
     * It allows you to apply styles (font size, font weight, font family, fill color, and more) to the spreadsheet cells. 
     * @default true
     */
    @Property(true)
    public allowCellFormatting: boolean;

    /**
     * Specifies the cell style options.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      ...
     *          cellStyle: { fontWeight: 'bold', fontSize: 12, 
     *              fontStyle: 'italic', textIndent: '2pt' 
     *              backgroundColor: '#4b5366', color: '#ffffff'
     *      },
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @default {}
     */
    @Complex<CellStyleModel>({}, CellStyle)
    public cellStyle: CellStyleModel;

    /**
     * Specifies the service URL to open excel file in spreadsheet.
     * @default ''
     */
    @Property('')
    public openUrl: string;

    /**
     * Specifies the service URL to save spreadsheet as Excel file.
     * @default ''
     */
    @Property('')
    public saveUrl: string;

    /**
     * Specifies the name for a range and uses it in formula for calculation.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      ...
     *      definedNames: [{ name: 'namedRange1', refersTo: 'A1:B5' }],
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @default []
     */
    @Collection([], DefineName)
    public definedNames: DefineNameModel[];

    /**
     * Triggers before opening an Excel file.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeOpen: (args: BeforeOpenEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenEventArgs>;

    /**
     * Triggers when the opened Excel file fails to load.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       openFailure: (args: OpenFailureArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public openFailure: EmitType<OpenFailureArgs>;

    /**
     * Triggers before saving the Spreadsheet as Excel file.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeSave: (args: BeforeSaveEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeSave: EmitType<BeforeSaveEventArgs>;

    /**
     * Triggers after saving the Spreadsheet as Excel file.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       saveComplete: (args: SaveCompleteEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public saveComplete: EmitType<SaveCompleteEventArgs>;

    /**
     * Triggers before the cell format applied to the cell.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeCellFormat: (args: BeforeCellFormatArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    @Event()
    public beforeCellFormat: EmitType<BeforeCellFormatArgs>;

    /** @hidden */
    public commonCellStyle: CellStyleModel;

    /**
     * To generate sheet name based on sheet count.
     * @hidden
     */
    public sheetNameCount: number = 1;

    /**
     * Constructor for initializing the library.
     * @param options - Configures Workbook model.
     */
    constructor(options: WorkbookModel) {
        super(options);
        Workbook.Inject(
            DataBind, WorkbookSave, WorkbookOpen, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit, WorkbookFormula, WorkbookSort);
        this.commonCellStyle = {};
        if (options && options.cellStyle) { this.commonCellStyle = options.cellStyle; }
        if (this.getModuleName() === 'workbook') {
            this.dataBind(); this.initEmptySheet();
        }
    }

    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    protected preRender(): void {
        if (!Object.keys(this.commonCellStyle).length) {
            this.commonCellStyle = skipDefaultValue(this.cellStyle, true);
        }
        if (this.getModuleName() === 'spreadsheet') { this.initEmptySheet(); }
    }

    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    protected render(): void {
        /** code snippets */
    }

    /**
     * To provide the array of modules needed for workbook.
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        return getWorkbookRequiredModules(this);
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Applies the style (font family, font weight, background color, etc...) to the specified range of cells.
     * @param {CellStyleModel} style - Specifies the cell style.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    public cellFormat(style: CellStyleModel, range?: string): void {
        let sheet: SheetModel = this.getActiveSheet();
        range = range || sheet.selectedRange;
        this.notify(setCellFormat, { style: style, range: range, refreshRibbon: range.indexOf(sheet.activeCell) > -1 ? true : false });
    }

    /** @hidden */
    public getCellStyleValue(cssProps: string[], indexes: number[]): CellStyleModel {
        let cell: CellModel = getCell(indexes[0], indexes[1], this.getActiveSheet());
        let style: CellStyleModel = {};
        cssProps.forEach((cssProp: string): void => {
            style[cssProp] = this.cellStyle[cssProp];
            if (cell && cell.style && cell.style[cssProp]) {
                style[cssProp] = cell.style[cssProp];
            }
        });
        return style;
    }

    /**
     * Applies the number format (number, currency, percentage, short date, etc...) to the specified range of cells.
     * @param {string} format - Specifies the number format code.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    public numberFormat(format: string, range?: string): void {
        this.notify(events.applyNumberFormatting, { format: format, range: range });
    }

    /**
     * Used to create new sheet.
     * @hidden
     */
    public createSheet(index?: number): void {
        let sheet: SheetModel
            = new Sheet(this, 'sheets', { id: getMaxSheetId(this.sheets), name: 'Sheet' + getSheetNameCount(this) }, true);
        if (index > -1) {
            this.sheets.splice(index, 0, sheet);
        } else {
            this.sheets.push(sheet);
        }
        this.setProperties({ 'sheet': this.sheets }, true);
        this.notify(sheetCreated, { sheetIndex: index | 0 });
        this.notify(events.workbookFormulaOperation, { action: 'registerSheet', sheetIndex: this.sheets.length - 1 });
    }

    /**
     * Used to remove sheet.
     * @hidden
     */
    public removeSheet(idx: number): void {
        this.sheets.splice(idx, 1);
    }

    /**
     * Destroys the Workbook library.
     */
    public destroy(): void {
        this.notify(events.workbookDestroyed, null);
        super.destroy();
    }

    /**
     * Called internally if any of the property value changed.
     * @param  {WorkbookModel} newProp
     * @param  {WorkbookModel} oldProp
     * @returns void
     * @hidden
     */
    public onPropertyChanged(newProp: WorkbookModel, oldProp: WorkbookModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'cellStyle':
                    merge(this.commonCellStyle, skipDefaultValue(newProp.cellStyle));
                    break;
            }
        }
    }

    /**
     * Not applicable for workbook.
     * @hidden
     */
    public appendTo(selector: string | HTMLElement): void {
        super.appendTo(selector);
    }

    private initEmptySheet(): void {
        let len: number = this.sheets.length;
        if (len) {
            initSheet(this);
        } else {
            this.createSheet();
        }
    }

    /** @hidden */
    public getActiveSheet(): SheetModel {
        return this.sheets[this.activeSheetTab - 1];
    }

    /**
     * Used for setting the used range row and column index.
     * @hidden
     */
    public setUsedRange(rowIdx: number, colIdx: number): void {
        let sheet: SheetModel = this.getActiveSheet();
        if (rowIdx > sheet.usedRange.rowIndex) {
            sheet.usedRange.rowIndex = rowIdx;
            this.setProperties({ 'sheets': this.sheets }, true);
            this.notify(updateUsedRange, { index: rowIdx, update: 'row' });
        }
        if (colIdx > sheet.usedRange.colIndex) {
            sheet.usedRange.colIndex = colIdx;
            this.setProperties({ 'sheets': this.sheets }, true);
            this.notify(updateUsedRange, { index: colIdx, update: 'col' });
        }
    }

    /** @hidden */
    public getRangeData(cellIndexes: number[], sheetIdx?: number): string | number {
        let sheet: SheetModel;
        if (sheetIdx) {
            sheet = getSheet(this, sheetIdx - 1);
        } else {
            sheet = this.getActiveSheet();
        }
        let row: number = cellIndexes[0];
        let col: number = cellIndexes[1];
        let values: string = '';
        if (sheet.rows[row] && sheet.rows[row].cells[col]) {
            values = sheet.rows[row].cells[col].value;
        }
        return values;
    }


    /**
     * Gets the range of data as JSON from the specified address.
     * @param {string} address - Specifies the address for range of cells.
     */
    public getData(address: string): Promise<Map<string, CellModel>> {
        return getData(this, address);
    }

    /**
     * Get component name.
     * @returns string
     * @hidden
     */
    public getModuleName(): string {
        return 'workbook';
    }

    /** @hidden */
    public getValueRowCol(sheetIndex: number, rowIndex: number, colIndex: number): string | number {
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        let sheet: SheetModel = getSheet(this, sheetIndex - 1);
        let cell: CellModel = getCell(rowIndex - 1, colIndex - 1, sheet);
        return (cell && cell.value) || '';
    }

    /** @hidden */
    public setValueRowCol(sheetIndex: number, value: string | number, rowIndex: number, colIndex: number): void {
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        this.notify(
            events.workbookEditOperation,
            {
                action: 'updateCellValue', address: [rowIndex - 1, colIndex - 1], value: value,
                sheetIndex: sheetIndex, isValueOnly: true
            });
    }

    /**
     * Opens the specified excel file or stream.
     * @param {OpenOptions} options - Options for opening the excel file.
     */
    public open(options: OpenOptions): void {
        this.notify(events.workbookOpen, options);
    }

    /**
     * Saves the Spreadsheet data to Excel file.
     * @param {SaveOptions} saveOptions - Options for saving the excel file.
     */
    public save(saveOptions: SaveOptions = {}): void {
        if (this.allowSave) {
            let defaultProps: SaveOptions = {
                url: this.saveUrl,
                fileName: saveOptions.fileName || 'Sample',
                saveType: 'Xlsx'
            };
            let eventArgs: BeforeSaveEventArgs = {
                ...defaultProps,
                ...saveOptions,
                customParams: {},
                isFullPost: true,
                needBlobData: false,
                cancel: false
            };
            this.trigger('beforeSave', eventArgs);
            if (!eventArgs.cancel) {
                this.notify(
                    events.beginSave, {
                        saveSettings: eventArgs, isFullPost: eventArgs.isFullPost,
                        needBlobData: eventArgs.needBlobData, customParams: eventArgs.customParams
                    });
            }
        }
    }

    /**
     * Sorts the range of cells in the active Spreadsheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
    public sort(sortOptions?: SortOptions, range?: string): Promise<SortEventArgs> {
        if (!this.allowSorting) { return Promise.reject(); }
        let eventArgs: BeforeSortEventArgs = {
            range: range || this.getActiveSheet().selectedRange,
            sortOptions: sortOptions || { sortDescriptors: {} },
            cancel: false
        };
        let promise: Promise<SortEventArgs> = new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); });
        let sortArgs: {[key: string]: BeforeSortEventArgs | Promise<SortEventArgs>} = { args: eventArgs, promise: promise };
        this.notify(events.initiateSort, sortArgs);
        return sortArgs.promise as Promise<SortEventArgs>;
    }

    /**
     * To update a cell properties.
     * @param {CellModel} cell - Cell properties.
     * @param {string} address - Address to update.
     */
    public updateCell(cell: CellModel, address?: string): void {
        let range: number[] = getIndexesFromAddress(address);
        let sheetIdx: number = getSheetIndex(this, address.split('!')[0]) || this.activeSheetTab - 1;
        setCell(range[0], range[1], this.sheets[sheetIdx], cell);
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
        this.notify(events.workbookFormulaOperation, eventArgs);
        return <boolean>eventArgs.isAdded;
    }

    /**
     * Removes the defined name from the Spreadsheet.
     * @param {string} definedName - Specifies the name.
     * @param {string} scope - Specifies the scope of the defined name.
     * @return {boolean} - Return the removed status of the defined name.
     */
    public removeDefinedName(definedName: string, scope: string = ''): boolean {
        let eventArgs: { [key: string]: Object } = {
            action: 'removeDefinedName',
            isRemoved: false,
            definedName: definedName,
            scope: scope
        };
        this.notify(events.workbookFormulaOperation, eventArgs);
        return <boolean>eventArgs.isRemoved;
    }

    /** @hidden */
    public clearRange(
        address?: string, sheetIndex?: number, valueOnly: boolean = true): void {
        address = address ? address : this.getActiveSheet().selectedRange;
        sheetIndex = sheetIndex ? sheetIndex : this.activeSheetTab;
        clearRange(this, address, sheetIndex, valueOnly);
    }
}
