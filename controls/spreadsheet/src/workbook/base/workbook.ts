import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Collection, Complex, EmitType } from '@syncfusion/ej2-base';
import { initSheet, getSheet, getSheetIndexFromId, getSheetIndexByName, getSheetIndex, Sheet, moveSheet, duplicateSheet } from './sheet';
import { Event, ModuleDeclaration, merge, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { WorkbookModel } from './workbook-model';
import { getWorkbookRequiredModules } from '../common/module';
import { SheetModel, CellModel, ColumnModel, RowModel, getData, clearRange, RangeModel } from './index';
import { OpenOptions, BeforeOpenEventArgs, OpenFailureArgs, CellValidationEventArgs } from '../../spreadsheet/common/interface';
import { DefineName, CellStyle, updateRowColCount, getIndexesFromAddress, localeData, workbookLocale, BorderType } from '../common/index';
import * as events from '../common/event';
import { CellStyleModel, DefineNameModel, HyperlinkModel, insertModel, InsertDeleteModelArgs, getAddressInfo } from '../common/index';
import { setCellFormat, sheetCreated, deleteModel, ModelType, ProtectSettingsModel, ValidationModel, setLockCells } from '../common/index';
import { BeforeSaveEventArgs, SaveCompleteEventArgs, BeforeCellFormatArgs, UnprotectArgs, ExtendedRange } from '../common/interface';
import { SaveOptions, SetCellFormatArgs, ClearOptions, AutoFillSettings, AutoFillDirection, AutoFillType } from '../common/index';
import { SortOptions, BeforeSortEventArgs, SortEventArgs, FindOptions, CellInfoEventArgs, ConditionalFormatModel } from '../common/index';
import { FilterEventArgs, FilterOptions, BeforeFilterEventArgs, ChartModel, getCellIndexes, getCellAddress } from '../common/index';
import { setMerge, MergeType, MergeArgs, ImageModel, FilterCollectionModel, SortCollectionModel, dataChanged } from '../common/index';
import { getCell, skipDefaultValue, setCell, wrap as wrapText } from './cell';
import { DataBind, setRow, setColumn, InsertDeleteEventArgs } from '../index';
import { WorkbookSave, WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookFilter, WorkbookImage } from '../integrations/index';
import { WorkbookChart } from '../integrations/index';
import { WorkbookNumberFormat } from '../integrations/number-format';
import { WorkbookEdit, WorkbookCellFormat, WorkbookHyperlink, WorkbookInsert, WorkbookProtectSheet, WorkbookAutoFill } from '../actions/index';
import { WorkbookDataValidation, WorkbookMerge } from '../actions/index';
import { ServiceLocator } from '../services/index';
import { setLinkModel, setImage, setChart, updateView, setAutoFill } from '../common/event';
import { beginAction, completeAction, deleteChart } from '../../spreadsheet/common/event';
import { WorkbookFindAndReplace } from '../actions/find-and-replace';
import { WorkbookConditionalFormat } from '../actions/conditional-formatting';
import { AutoFillSettingsModel } from '../..';

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
     *                  range: [{ dataSource: data }],
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
     *
     * @default []
     */
    @Collection<SheetModel>([], Sheet)
    public sheets: SheetModel[];

    /**
     * Specifies active sheet index in workbook.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      activeSheetIndex: 2
     * ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public activeSheetIndex: number;

    /**
     * Defines the height of the Spreadsheet. It accepts height as pixels, number, and percentage.
     *
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      height: '550px'
     * ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;
    /**
     * It allows to enable/disable find & replace with its functionalities.
     *
     * @default true
     */
    @Property(true)
    public allowFindAndReplace: boolean;

    /**
     * It stores the filtered range collection.
     *
     * @hidden
     */
    @Property()
    public filterCollection: FilterCollectionModel[];

    /**
     * It stores the filtered range collection.
     *
     * @hidden
     */
    @Property()
    public sortCollection: SortCollectionModel[];

    /** @hidden */
    public isEdit: boolean = false;

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
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * It shows or hides the ribbon in spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public showRibbon: boolean;

    /**
     * It shows or hides the formula bar and its features.
     *
     * @default true
     */
    @Property(true)
    public showFormulaBar: boolean;

    /**
     * It shows or hides the sheets tabs, this is used to navigate among the sheets and create or delete sheets by UI interaction.
     *
     * @default true
     */
    @Property(true)
    public showSheetTabs: boolean;

    /**
     * It allows you to add new data or update existing cell data. If it is false, it will act as read only mode.
     *
     * @default true
     */
    @Property(true)
    public allowEditing: boolean;

    /**
     * It allows you to open an Excel file (.xlsx, .xls, and .csv) in Spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public allowOpen: boolean;

    /**
     * It allows you to save Spreadsheet with all data as Excel file (.xlsx, .xls, and .csv).
     *
     * @default true
     */
    @Property(true)
    public allowSave: boolean;

    /**
     * It allows to enable/disable sort and its functionalities.
     *
     * @default true
     */
    @Property(true)
    public allowSorting: boolean;

    /**
     * It allows to enable/disable filter and its functionalities.
     *
     * @default true
     */
    @Property(true)
    public allowFiltering: boolean;

    /**
     * It allows formatting a raw number into different types of formats (number, currency, accounting, percentage, short date,
     * long date, time, fraction, scientific, and text) with built-in format codes.
     *
     * @default true
     */
    @Property(true)
    public allowNumberFormatting: boolean;

    /**
     * It allows you to apply styles (font size, font weight, font family, fill color, and more) to the spreadsheet cells.
     *
     * @default true
     */
    @Property(true)
    public allowCellFormatting: boolean;

    /**
     * It allows to enable/disable Hyperlink and its functionalities.
     *
     * @default true
     */
    @Property(true)
    public allowHyperlink: boolean;

    /**
     * It allows you to insert rows, columns and sheets in to the spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public allowInsert: boolean;

    /**
     * It allows you to delete rows, columns and sheets from spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public allowDelete: boolean;

    /**
     * It allows you to merge the range of cells.
     *
     * @default true
     */
    @Property(true)
    public allowMerge: boolean;

    /**
     * It allows you to apply validation to the spreadsheet cells.
     *
     * @default true
     */
    @Property(true)
    public allowDataValidation: boolean;

    /**
     * It allows you to insert the image in spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public allowImage: boolean;

    /**
     * It allows you to insert the chart in spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public allowChart: boolean;

    /**
     * It allows to enable/disable AutoFill functionalities.
     *
     * @default true
     */
    @Property(true)
    public allowAutoFill: boolean;

    /**
     * Configures the auto fill settings.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      autoFillSettings: {
     *          fillType: 'FillSeries',
     *          showFillOptions: true
     *      }
     * ...
     * }, '#Spreadsheet');
     *
     * The autoFillSettings `fillType` property has FOUR values and it is described below:
     *
     * * CopyCells: To update the copied cells of the selected range.
     * * FillSeries: To update the filled series of the selected range.
     * * FillFormattingOnly: To fill the formats only for the selected range.
     * * FillWithoutFormatting: To fill without the format of the selected range.
     *
     * ```
     *
     * @default { fillType: 'FillSeries', showFillOptions: true }
     */

    @Complex<AutoFillSettingsModel>({}, AutoFillSettings)
    public autoFillSettings: AutoFillSettingsModel;

    /**
     * It allows you to apply conditional formatting to the sheet.
     *
     * @default true
     */
    @Property(true)
    public allowConditionalFormat: boolean;

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
     *
     * @default {}
     */
    @Complex<CellStyleModel>({}, CellStyle)
    public cellStyle: CellStyleModel;

    /**
     * Specifies the service URL to open excel file in spreadsheet.
     *
     * @default ''
     */
    @Property('')
    public openUrl: string;

    /**
     * Specifies the service URL to save spreadsheet as Excel file.
     *
     * @default ''
     */
    @Property('')
    public saveUrl: string;

    /**
     * Specifies the password.
     *
     * @default ''
     */
    @Property('')
    public password: string;

    /**
     * Specifies to  protect the workbook.
     *
     * @default false
     */
    @Property(false)
    public isProtected: boolean;

    /**
     * Specifies the name for a range and uses it in formula for calculation.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      ...
     *      definedNames: [{ name: 'namedRange1', refersTo: 'Sheet1!A1:B5' }],
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
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
     *
     * @event beforeOpen
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
     *
     * @event openFailure
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
     *
     * @event beforeSave
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
     *
     * @event saveComplete
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
     *
     * @event beforeCellFormat
     */
    @Event()
    public beforeCellFormat: EmitType<BeforeCellFormatArgs>;

    /**
     * Triggered every time a request is made to access cell information.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      queryCellInfo: (args: CellInfoEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @event queryCellInfo
     */
    @Event()
    public queryCellInfo: EmitType<CellInfoEventArgs>;

    /** @hidden */
    public commonCellStyle: CellStyleModel;

    /**
     * To generate sheet name based on sheet count.
     *
     * @hidden
     */
    public sheetNameCount: number = 1;

    /** @hidden */
    public serviceLocator: ServiceLocator;

    /**
     * @hidden
     */
    public isOpen: boolean = false;

    /**
     * @hidden
     */
    public chartColl: ChartModel[] = [];

    /**
     * @hidden
     */
    public chartCount: number = 1;

    /** @hidden */
    public formulaRefCell: string;

    /**
     * Constructor for initializing the library.
     *
     * @param {WorkbookModel} options - Configures Workbook model.
     */
    constructor(options: WorkbookModel) {
        super(options);
        Workbook.Inject(
            DataBind, WorkbookSave, WorkbookOpen, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit,
            WorkbookFormula, WorkbookSort, WorkbookHyperlink, WorkbookFilter, WorkbookInsert, WorkbookFindAndReplace,
            WorkbookDataValidation, WorkbookProtectSheet, WorkbookMerge, WorkbookConditionalFormat, WorkbookImage, WorkbookChart,
            WorkbookAutoFill);
        this.commonCellStyle = {};
        if (options && options.cellStyle) { this.commonCellStyle = options.cellStyle; }
        if (this.getModuleName() === 'workbook') {
            this.serviceLocator = new ServiceLocator;
            this.initWorkbookServices();
            this.dataBind(); this.initEmptySheet();
        }
    }

    /**
     * For internal use only.
     *
     * @returns {void} - For internal use only.
     * @hidden
     */
    protected preRender(): void {
        if (!Object.keys(this.commonCellStyle).length) {
            this.commonCellStyle = skipDefaultValue(this.cellStyle, true);
        }
        if (this.getModuleName() === 'spreadsheet' && !this.refreshing) {
            this.initEmptySheet();
        }
    }

    private initWorkbookServices(): void {
        this.serviceLocator.register(workbookLocale, new L10n(this.getModuleName(), localeData, this.locale));
    }

    /**
     * For internal use only.
     *
     * @returns {void} - For internal use only.
     * @hidden
     */
    protected render(): void {
        /** code snippets */
    }

    /**
     * To provide the array of modules needed for workbook.
     *
     * @returns {ModuleDeclaration[]} - To provide the array of modules needed for workbook.
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        return getWorkbookRequiredModules(this);
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Get the properties to be maintained in the persisted state.
     * @hidden
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Applies the style (font family, font weight, background color, etc...) to the specified range of cells.
     *
     * {% codeBlock src='spreadsheet/cellFormat/index.md' %}{% endcodeBlock %}
     *
     * @param {CellStyleModel} style - Specifies the cell style.
     * @param {string} range - Specifies the address for the range of cells.
     * @returns {void} - Applies the style (font family, font weight, background color, etc...) to the specified range of cells.
     */
    public cellFormat(style: CellStyleModel, range?: string): void {
        const sheet: SheetModel = this.getActiveSheet();
        range = range || sheet.selectedRange;
        this.notify(setCellFormat, { style: style, range: range, refreshRibbon: range.indexOf(sheet.activeCell) > -1 ? true : false });
    }

    /**
     * Applies cell lock to the specified range of cells.
     *
     * {% codeBlock src='spreadsheet/lockCells/index.md' %}{% endcodeBlock %}
     *
     * @param {string} range - Specifies the address for the range of cells.
     * @param {boolean} isLocked -Specifies the cell is locked or not.
     * @returns {void} - To Applies cell lock to the specified range of cells.
     */
    public lockCells(range?: string, isLocked?: boolean): void {
        const sheet: SheetModel = this.getActiveSheet();
        range = range || sheet.selectedRange;
        this.notify(setLockCells, { range: range, isLocked: isLocked});
    }

    /**
     * @hidden
     * @param {Workbook} cssProps - Specifies the cssProps.
     * @param {number[]} indexes - Specifies the indexes.
     * @returns {CellStyleModel} - To get Cell Style Value.
     */
    public getCellStyleValue(cssProps: string[], indexes: number[]): CellStyleModel {
        const cell: CellModel = getCell(indexes[0], indexes[1], this.getActiveSheet());
        const style: CellStyleModel = {};
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
     *
     * {% codeBlock src='spreadsheet/numberFormat/index.md' %}{% endcodeBlock %}
     *
     * @param {string} format - Specifies the number format code.
     * @param {string} range - Specifies the address for the range of cells.
     * @returns {void} - Applies the number format (number, currency, percentage, short date, etc...) to the specified range of cells.
     */
    public numberFormat(format: string, range?: string): void {
        this.notify(events.applyNumberFormatting, { format: format, range: range });
    }

    /**
     * Used to create new sheet.
     *
     * @hidden
     * @param {number} index - Specifies the index.
     * @param {SheetModel[]} sheets - Specifies the sheets.
     * @returns {void} - To create new sheet.
     */
    public createSheet(index: number = this.sheets.length, sheets: SheetModel[] = [{}]): void {
        this.sheets.splice(index, 0, ...sheets);
        initSheet(this, sheets);
        this.notify(sheetCreated, { sheetIndex: index || 0, sheets: sheets });
        this.notify(events.workbookFormulaOperation, {
            action: 'registerSheet', sheetIndex: index || 0, sheetCount: index + sheets.length
        });
    }

    /**
     * Used to remove sheet.
     *
     * @hidden
     * @param  {number} idx - Specifies the index.
     * @returns {void} - To remove sheet
     */
    public removeSheet(idx: number): void {
        this.sheets.splice(idx, 1);
    }

    /**
     * Destroys the Workbook library.
     *
     * @returns {void} - To destroy sheet
     */
    public destroy(): void {
        this.notify(events.workbookDestroyed, null);
        super.destroy();
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {WorkbookModel} newProp - To set the properties
     * @param {WorkbookModel} oldProp - To get the properties
     * @returns {void} - property value changed
     * @hidden
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: WorkbookModel, oldProp: WorkbookModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'cellStyle':
                merge(this.commonCellStyle, newProp.cellStyle);
                break;
            case 'sheets':
                if (newProp.sheets === this.sheets) {
                    this.notify(events.workbookFormulaOperation, { action: 'unRegisterSheet', propertyChange: true });
                    this.sheetNameCount = 1;
                    this.notify(events.sheetsDestroyed, {});
                    initSheet(this);
                    this.notify(sheetCreated, null);
                    this.notify(events.workbookFormulaOperation, { action: 'registerSheet' });
                } else {
                    initSheet(this);
                }
                break;
            }
        }
    }

    /**
     * Not applicable for workbook.
     *
     * @hidden
     * @param {string | HTMLElement} selector - Specifies the selector.
     * @returns {void} - To append the element.
     */
    public appendTo(selector: string | HTMLElement): void {
        super.appendTo(selector);
    }

    /**
     * Used to hide/show the rows in spreadsheet.
     *
     * @param {number} startIndex - Specifies the start row index.
     * @param {number} endIndex - Specifies the end row index.
     * @param {boolean} hide - To hide/show the rows in specified range.
     * @returns {void} - To hide/show the rows in spreadsheet.
     */
    public hideRow(startIndex: number, endIndex: number = startIndex, hide: boolean = true): void {
        const sheet: SheetModel = this.getActiveSheet();
        if (hide && (sheet.frozenRows || sheet.frozenColumns)) { return; }
        for (let i: number = startIndex; i <= endIndex; i++) {
            setRow(sheet, i, { hidden: hide });
        }
    }

    /**
     * Used to hide/show the columns in spreadsheet.
     *
     * @param {number} startIndex - Specifies the start column index.
     * @param {number} endIndex - Specifies the end column index.
     * @param {boolean} hide - Set `true` / `false` to hide / show the columns.
     * @returns {void} - To hide/show the columns in spreadsheet.
     */
    public hideColumn(startIndex: number, endIndex: number = startIndex, hide: boolean = true): void {
        const sheet: SheetModel = this.getActiveSheet();
        if (sheet.frozenRows || sheet.frozenColumns) { return; }
        for (let i: number = startIndex; i <= endIndex; i++) {
            setColumn(sheet, i, { hidden: hide });
        }
    }
    /**
     * Sets the border to specified range of cells.
     *
     * {% codeBlock src='spreadsheet/setBorder/index.md' %}{% endcodeBlock %}
     *
     * @param {CellStyleModel} style - Specifies the style property which contains border value.
     * @param {string} range - Specifies the range of cell reference. If not specified, it will considered the active cell reference.
     * @param {BorderType} type - Specifies the range of cell reference. If not specified, it will considered the active cell reference.
     * @returns {void} - To Sets the border to specified range of cells.
     */
    public setBorder(style: CellStyleModel, range?: string, type?: BorderType): void {
        this.notify(setCellFormat, <SetCellFormatArgs>{
            style: style, borderType: type, range:
                range || this.getActiveSheet().selectedRange
        });
    }

    /**
     * Used to insert rows in to the spreadsheet.
     *
     * {% codeBlock src='spreadsheet/insertRow/index.md' %}{% endcodeBlock %}
     *
     * @param {number | RowModel[]} startRow - Specifies the start row index / row model which needs to be inserted.
     * @param {number} endRow - Specifies the end row index.
     * @param {number | string} sheet - Specifies the sheet name or index in which the insert operation will perform. By default,
     * active sheet will be considered.
     * @returns {void} - To insert rows in to the spreadsheet.
     */
    public insertRow(startRow?: number | RowModel[], endRow?: number, sheet?: number | string): void {
        this.notify(insertModel, <InsertDeleteModelArgs>{ model: this.getSheetModel(sheet), start: startRow, end: endRow,
            modelType: 'Row', insertType: 'below' });
    }

    /**
     * Used to insert columns in to the spreadsheet.
     *
     * {% codeBlock src='spreadsheet/insertColumn/index.md' %}{% endcodeBlock %}
     *
     * @param {number | ColumnModel[]} startColumn - Specifies the start column index / column model which needs to be inserted.
     * @param {number} endColumn - Specifies the end column index.
     * @param {number | string} sheet - Specifies the sheet name or index in which the insert operation will perform. By default,
     * active sheet will be considered.
     * @returns {void} - To insert columns in to the spreadsheet.
     */
    public insertColumn(startColumn?: number | ColumnModel[], endColumn?: number, sheet?: number | string): void {
        this.notify(insertModel, <InsertDeleteModelArgs>{ model: this.getSheetModel(sheet), start: startColumn, end: endColumn,
            modelType: 'Column', insertType: 'after' });
    }

    /**
     * Used to insert sheets in to the spreadsheet.
     *
     * {% codeBlock src='spreadsheet/insertSheet/index.md' %}{% endcodeBlock %}
     *
     * @param {number | SheetModel[]} startSheet - Specifies the start sheet index / sheet model which needs to be inserted.
     * @param {number} endSheet - Specifies the end sheet index.
     * @returns {void} - To insert sheets in to the spreadsheet.
     */
    public insertSheet(startSheet?: number | SheetModel[], endSheet?: number): void {
        this.notify(insertModel, <InsertDeleteModelArgs>{ model: this, start: startSheet, end: endSheet, modelType: 'Sheet' });
    }

    /**
     * Used to delete rows, columns and sheets from the spreadsheet.
     *
     * {% codeBlock src='spreadsheet/delete/index.md' %}{% endcodeBlock %}
     *
     * @param {number} startIndex - Specifies the start sheet / row / column index.
     * @param {number} endIndex - Specifies the end sheet / row / column index.
     * @param {ModelType} model - Specifies the delete model type. By default, the model is considered as `Sheet`. The possible values are,
     * - Row: To delete rows.
     * - Column: To delete columns.
     * - Sheet: To delete sheets.
     * @param {number | string} sheet - Specifies the sheet name or index in which the delete operation will perform. By default,
     * active sheet will be considered. It is applicable only for model type Row and Column.
     * @returns {void} - To delete rows, columns and sheets from the spreadsheet.
     */
    public delete(startIndex?: number, endIndex?: number, model?: ModelType, sheet?: number | string): void {
        startIndex = startIndex || 0; let sheetModel: SheetModel | WorkbookModel;
        if (!model || model === 'Sheet') {
            sheetModel = this;
        } else {
            sheetModel = this.getSheetModel(sheet);
            if (!sheetModel) { return; }
        }
        this.notify(deleteModel, <InsertDeleteModelArgs>{
            model: sheetModel, start: startIndex, end: isNullOrUndefined(endIndex) ? startIndex : endIndex, modelType: model || 'Sheet'
        });
    }

    /**
     * Used to move the sheets to the specified position in the list of sheets.
     *
     * {% codeBlock src='spreadsheet/moveSheet/index.md' %}{% endcodeBlock %}
     *
     * @param {number} position - Specifies the position to move a sheet in the list of sheets.
     * @param {number[]} sheetIndexes - Specifies the indexes of the sheet to be moved. By default, the active sheet will be moved.
     * @returns {void} - Used to move the sheets to the specified position in the list of sheets.
     */
    public moveSheet(position: number, sheetIndexes?: number[]): void {
        moveSheet(this, position, sheetIndexes);
    }

    /**
     * Used to make a duplicate/copy of the sheet in the spreadsheet.
     *
     * {% codeBlock src='spreadsheet/duplicateSheet/index.md' %}{% endcodeBlock %}
     *
     * @param {number} sheetIndex - Specifies the index of the sheet to be duplicated. By default, the active sheet will be duplicated.
     * @returns {void} - Used to make a duplicate/copy of the sheet in the spreadsheet.
     */
    public duplicateSheet(sheetIndex?: number): void {
        duplicateSheet(this, sheetIndex);
    }

    private getSheetModel(sheet: number | string): SheetModel {
        if (isNullOrUndefined(sheet)) {
            return this.getActiveSheet();
        } else {
            const index: number = typeof sheet === 'string' ? getSheetIndex(this, sheet) : sheet;
            if (isNullOrUndefined(index) || index >= this.sheets.length) { return null; }
            return this.sheets[index];
        }
    }

    /**
     * Used to merge the range of cells.
     *
     * {% codeBlock src='spreadsheet/merge/index.md' %}{% endcodeBlock %}
     *
     * @param {string} range - Specifies the range of cells as address.
     * @param {MergeType} type - Specifies the merge type. The possible values are,
     * - All: Merge all the cells between provided range.
     * - Horizontally: Merge the cells row-wise.
     * - Vertically: Merge the cells column-wise.
     * @returns {void} - To merge the range of cells.
     */
    public merge(range?: string, type?: MergeType): void {
        let sheetIdx: number; let sheet: SheetModel;
        if (range) {
            sheetIdx = this.getAddressInfo(range).sheetIndex; sheet = getSheet(this, sheetIdx);
        } else {
            sheet = this.getActiveSheet(); range = sheet.selectedRange;
        }
        this.notify(setMerge, <MergeArgs>{ merge: true, range: range, type: type || 'All', sheet: sheet, refreshRibbon:
            range.indexOf(sheet.activeCell) > -1 ? true : false, preventRefresh: this.activeSheetIndex !== sheetIdx });
    }

    /** Used to compute the specified expression/formula.
     *
     * {% codeBlock src='spreadsheet/computeExpression/index.md' %}{% endcodeBlock %}
     *
     * @param {string} formula - Specifies the formula(=SUM(A1:A3)) or expression(2+3).
     * @returns {string | number} - to compute the specified expression/formula.
     */
    public computeExpression(formula: string): string | number {
        const args: { action: string, formula: string, calcValue?: string | number } = {
            action: 'computeExpression', formula: formula
        };
        this.notify(events.workbookFormulaOperation, args);
        return args.calcValue;
    }

    private initEmptySheet(): void {
        if (!this.sheets.length) {
            this.createSheet();
        } else {
            initSheet(this);
        }
    }

    /** @hidden
     * @returns {SheetModel} - To get Active Sheet.
     */
    public getActiveSheet(): SheetModel {
        return this.sheets[this.activeSheetIndex];
    }

    /** @hidden
     * @param {number} index - Specifies the index.
     * @param {number} initIdx - Specifies the initIdx.
     * @param {number} hiddenCount - Specifies the initIdx.
     * @returns {number} - To skip Hidden Sheets.
     */
    public skipHiddenSheets(index: number, initIdx?: number, hiddenCount: number = 0): number {
        if (this.sheets[index] && this.sheets[index].state !== 'Visible') {
            if (initIdx === undefined) { initIdx = index; }
            if (index && index + 1 === this.sheets.length) {
                index = initIdx - 1;
            } else {
                index = index < initIdx ? --index : ++index;
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
     * Used for setting the used range row and column index.
     *
     * @hidden
     * @param {number} rowIdx - Specifies the rowIndex.
     * @param {number} colIdx - Specifies the colIndex.
     * @param {SheetModel} sheet - Specifies the active sheet.
     * @returns {void} - To setting the used range row and column index.
     */
    public setUsedRange(rowIdx: number, colIdx: number, sheet: SheetModel = this.getActiveSheet()): void {
        if (rowIdx > sheet.usedRange.rowIndex) {
            sheet.usedRange.rowIndex = rowIdx;
            if (sheet === this.getActiveSheet()) { this.notify(updateRowColCount, { index: rowIdx, update: 'row' }); }
        }
        if (colIdx > sheet.usedRange.colIndex) {
            sheet.usedRange.colIndex = colIdx;
            if (sheet === this.getActiveSheet()) { this.notify(updateRowColCount, { index: colIdx, update: 'col' }); }
        }
    }

    /**
     * Gets the range of data as JSON from the specified address.
     *
     * {% codeBlock src='spreadsheet/getData/index.md' %}{% endcodeBlock %}
     *
     * @param {string} address - Specifies the address for range of cells.
     * @returns {Promise<Map<string, CellModel>>} - Gets the range of data as JSON from the specified address.
     */
    public getData(address: string): Promise<Map<string, CellModel>> {
        return getData(this, address) as Promise<Map<string, CellModel>>;
    }

    /**
     * Get component name.
     *
     * @returns {string} - Gets the module name.
     * @hidden
     */
    public getModuleName(): string {
        return 'workbook';
    }

    /** @hidden
     * @param {string} address - Specifies the sheet id.
     * @returns {void} - To set the value for row and col.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public goTo(address?: string): void {
        /** */
    }

    /** @hidden
     * @param {number} sheetId - Specifies the sheet id.
     * @param {number} rowIndex - Specifies the rowIndex.
     * @param {number} colIndex - Specifies the colIndex.
     * @param {string} formulaCellReference - Specifies the formulaCellReference.
     * @param {boolean} refresh - Specifies the refresh.
     * @returns {string | number} - To set the value for row and col.
     */
    public getValueRowCol(
        sheetId: number, rowIndex: number, colIndex: number, formulaCellReference?: string, refresh?: boolean): string | number {
        const args: { action: string, sheetInfo: { visibleName: string, sheet: string, index: number }[] } = {
            action: 'getSheetInfo', sheetInfo: []
        };
        this.notify(events.workbookFormulaOperation, args);
        if (getSheetIndexByName(this, 'Sheet' + sheetId, args.sheetInfo) === -1) {
            const errArgs: { action: string, refError: string } = { action: 'getReferenceError', refError: '' };
            this.notify(events.workbookFormulaOperation, errArgs);
            return errArgs.refError;
        }
        let sheetIndex: number = getSheetIndexFromId(this, sheetId);
        const sheet: SheetModel = getSheet(this, sheetIndex);
        const cell: CellModel = getCell(rowIndex - 1, colIndex - 1, sheet);
        if (formulaCellReference && formulaCellReference.includes('!') && !cell && sheet.ranges && sheet.ranges.length) {
            let isNotLoaded: boolean;
            if (this.formulaRefCell && this.formulaRefCell === formulaCellReference) { return cell && cell.value; }
            sheet.ranges.forEach((range: ExtendedRange): void => {
                if (!range.info || !range.info.loadedRange || !range.info.loadedRange.length) { isNotLoaded = true; return; }
            });
            if (isNotLoaded) {
                this.formulaRefCell = formulaCellReference;
                sheetIndex = getSheetIndexFromId(
                    this, Number(formulaCellReference.substring(formulaCellReference.lastIndexOf(',') + 1, formulaCellReference.length)));
                if (isNullOrUndefined(sheetIndex)) { return cell && cell.value; }
                formulaCellReference = formulaCellReference.substring(
                    formulaCellReference.lastIndexOf('!') + 1, formulaCellReference.lastIndexOf(','));
                getData(
                    this, `${sheet.name}!A1:${getCellAddress(rowIndex - 1, colIndex - 1)}`, null, null, null, null, formulaCellReference,
                    sheetIndex);
            }
        } else if (cell && cell.formula && (refresh || isNullOrUndefined(cell.value)) && cell.formula.indexOf('UNIQUE') === -1) {
            this.notify('calculateFormula', { cell: cell, rowIdx: rowIndex - 1, colIdx: colIndex - 1, sheetIndex: sheetIndex });
        }
        return cell && cell.value;
    }

    /** @hidden
     * @param {number} sheetId - Specifies the sheet id.
     * @param {string | number} value - Specifies the value.
     * @param {number} rowIndex - Specifies the rowIndex.
     * @param {number} colIndex - Specifies the colIndex.
     * @param {string} formula - Specifies the colIndex.
     * @returns {void} - To set the value for row and col.
     */
    public setValueRowCol(sheetId: number, value: string | number, rowIndex: number, colIndex: number, formula?: string): void {
        this.notify(
            events.workbookEditOperation,
            {
                action: 'updateCellValue', address: [rowIndex - 1, colIndex - 1], value: value,
                sheetIndex: getSheetIndexFromId(this, sheetId), isValueOnly: true, formula: formula
            });
    }

    /**
     * Opens the specified excel file or stream.
     *
     * @param {OpenOptions} options - Options for opening the excel file.
     * @returns {void} - Opens the specified excel file or stream.
     */
    public open(options: OpenOptions): void {
        this.notify(events.workbookOpen, options);
    }

    /**
     * Opens the specified JSON object.
     *
     * {% codeBlock src='spreadsheet/openFromJson/index.md' %}{% endcodeBlock %}
     *
     * The available arguments in options are:
     * * file: Specifies the spreadsheet model as object or string. And the object contains the jsonObject,
     * which is saved from spreadsheet using saveAsJson method.
     *
     * @param {Object} options - Options for opening the JSON object.
     * @param {string | object} options.file - Options for opening the JSON object.
     * @returns {void} - Opens the specified JSON object.
     */
    public openFromJson(options: { file: string | object }): void {
        this.isOpen = true;
        const jsonObject: string = typeof options.file === 'object' ? JSON.stringify(options.file) : options.file;
        this.notify(events.workbookOpen, { jsonObject: jsonObject });
    }

    /**
     * Saves the Spreadsheet data to Excel file.
     *
     * {% codeBlock src='spreadsheet/save/index.md' %}{% endcodeBlock %}
     *
     * The available arguments in saveOptions are:
     * * url: Specifies the save URL.
     * * fileName: Specifies the file name.
     * * saveType: Specifies the file type need to be saved.
     *
     * @param {SaveOptions} saveOptions - Options for saving the excel file.
     * @returns {void} - To Saves the Spreadsheet data to Excel file.
     */
    public save(saveOptions: SaveOptions = {}): void {
        if (this.allowSave) {
            const defaultProps: SaveOptions = {
                url: this.saveUrl,
                fileName: saveOptions.fileName || 'Sample',
                saveType: 'Xlsx'
                //passWord: args.passWord
            };
            const eventArgs: BeforeSaveEventArgs = {
                ...defaultProps,
                ...saveOptions,
                customParams: {},
                isFullPost: true,
                needBlobData: false,
                cancel: false,
                pdfLayoutSettings: { fitSheetOnOnePage: false }
            };
            this.trigger('beforeSave', eventArgs);
            this.notify(beginAction, { eventArgs: eventArgs, action: 'beforeSave' });
            if (!eventArgs.cancel) {
                this.notify(
                    events.beginSave, {
                        saveSettings: eventArgs, isFullPost: eventArgs.isFullPost,
                        needBlobData: eventArgs.needBlobData, customParams: eventArgs.customParams, pdfLayoutSettings:
                        eventArgs.pdfLayoutSettings
                    });
            }
        }
    }

    /**
     * Saves the Spreadsheet data as JSON object.
     *
     * {% codeBlock src='spreadsheet/saveAsJson/index.md' %}{% endcodeBlock %}
     *
     * @returns {Promise<object>} - To Saves the Spreadsheet data as JSON object.
     */
    public saveAsJson(): Promise<object> {
        return new Promise<object>((resolve: Function) => {
            this.on(events.onSave, (args: { cancel: boolean, jsonObject: object }) => {
                args.cancel = true;
                this.off(events.onSave);
                resolve({ jsonObject: { Workbook: args.jsonObject } });
                this.notify(events.saveCompleted, args);
            });
            this.save();
        });
    }

    public addHyperlink(hyperlink: string | HyperlinkModel, cellAddress: string): void {
        const args: object = { hyperlink: hyperlink, cell: cellAddress };
        this.notify(setLinkModel, args);
    }
    /**
     * To find the specified cell value.
     *
     * @hidden
     * @param {FindOptions} args - options for find.
     * {% codeBlock src='spreadsheet/findHandler/index.md' %}{% endcodeBlock %}
     * @returns {void} - To find the specified cell value.
     */
    public findHandler(args: FindOptions): void {
        if (args.findOpt === 'next') {
            this.notify(events.findNext, args);
        } else if (args.findOpt === 'prev') {
            this.notify(events.findPrevious, args);
        }
    }
    /**
     * @hidden
     * @param {FindOptions} args - Specifies the FindOptions.
     * @returns {void} - To replace the value.
     */
    public replaceHandler(args: FindOptions): void {
        if (args.replaceBy === 'replace') {
            this.notify(events.replaceHandler, args);
        } else {
            this.notify(events.replaceAllHandler, args);
        }
    }

    /**
     * Protect the active sheet based on the protect sheetings.
     *
     * @param {number} sheet - Specifies the sheet to protect.
     * @param {ProtectSettingsModel} protectSettings - Specifies the protect settings of the sheet.
     * @param {string} password - Specifies the password to protect
     * @returns {void} - protect the active sheet.
     */
    public protectSheet(sheet?: number | string, protectSettings?: ProtectSettingsModel, password?: string): void {
        this.notify(events.protectsheetHandler, { protectSettings: protectSettings, password: password} );
    }

    /**
     * Unprotect the active sheet.
     *
     * @param {number} sheet - Specifies the sheet to Unprotect.
     * @returns {void} - Unprotect the active sheet.
     */
    public unprotectSheet(sheet: number): void {
        const args: UnprotectArgs = { sheet: sheet};
        this.notify(events.unprotectsheetHandler, args);
    }

    /**
     * Sorts the range of cells in the active Spreadsheet.
     *
     * @param {SortOptions} sortOptions - options for sorting.
     * @param {string} range - address of the data range.
     * @returns {Promise<SortEventArgs>} - Sorts the range of cells in the active Spreadsheet.
     */
    public sort(sortOptions?: SortOptions, range?: string): Promise<SortEventArgs> {
        if (!this.allowSorting) { return Promise.reject(); }
        const eventArgs: BeforeSortEventArgs = {
            range: range || this.getActiveSheet().selectedRange,
            sortOptions: sortOptions || { sortDescriptors: {} },
            cancel: false
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const promise: Promise<SortEventArgs> = new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); });
        const sortArgs: { [key: string]: BeforeSortEventArgs | Promise<SortEventArgs> } = { args: eventArgs, promise: promise };
        this.notify(events.initiateSort, sortArgs);
        return sortArgs.promise as Promise<SortEventArgs>;
    }

    public addDataValidation(rules: ValidationModel, range?: string): void {
        range = range ? range : this.getActiveSheet().selectedRange;
        const eventArgs: CellValidationEventArgs = {
            range: range, type: rules.type, operator: rules.operator, value1: rules.value1,
            value2: rules.value2, ignoreBlank: rules.ignoreBlank, inCellDropDown: rules.inCellDropDown, cancel: false
        };
        this.notify(beginAction, { eventArgs: eventArgs, action: 'validation' });
        if (!eventArgs.cancel) {
            range = eventArgs.range;
            rules.type = eventArgs.type;
            rules.operator = eventArgs.operator;
            rules.value1 = eventArgs.value1;
            rules.value2 = eventArgs.value2;
            rules.ignoreBlank = eventArgs.ignoreBlank;
            rules.inCellDropDown = eventArgs.inCellDropDown;
            this.notify(events.setValidation, { rules: rules, range: range });
            delete eventArgs.cancel;
            this.notify(completeAction, { eventArgs: eventArgs, action: 'validation' });
        }
    }

    public removeDataValidation(range?: string): void {
        this.notify(events.removeValidation, { range: range });
    }

    public addInvalidHighlight(range: string): void {
        this.notify(events.addHighlight, { range: range });
    }

    public removeInvalidHighlight(range: string): void {
        this.notify(events.removeHighlight, { range: range });
    }

    public conditionalFormat(conditionalFormat: ConditionalFormatModel): void {
        conditionalFormat.range = conditionalFormat.range || this.getActiveSheet().selectedRange;
        this.notify(events.setCFRule, { conditionalFormat: conditionalFormat });
    }

    public clearConditionalFormat(range: string): void {
        range = range || this.getActiveSheet().selectedRange;
        this.notify(events.clearCFRule, { range: range });
    }

    /**
     * To update a cell properties.
     *
     * @param {CellModel} cell - Cell properties.
     * @param {string} address - Address to update.
     * @returns {void} - To update a cell properties
     * {% codeBlock src='spreadsheet/updateCell/index.md' %}{% endcodeBlock %}
     */
    public updateCell(cell: CellModel, address?: string): void {
        let sheetIdx: number; const range: number[] = getIndexesFromAddress(address);
        if (address.includes('!')) {
            sheetIdx = getSheetIndex(this, address.split('!')[0]);
            if (sheetIdx === undefined) { sheetIdx = this.activeSheetIndex; }
        } else {
            sheetIdx = this.activeSheetIndex;
        }
        setCell(range[0], range[1], this.sheets[sheetIdx], cell, true);
        if (cell.value || cell.value === '') {
            this.notify(
                events.workbookEditOperation,
                {
                    action: 'updateCellValue', address: range, value: cell.value,
                    sheetIndex: sheetIdx
                });
        }
        this.notify(updateView, { indexes: range, sheetIndex: sheetIdx });
    }

    /**
     * Used to get a row data from the data source with updated cell value.
     *
     * {% codeBlock src='spreadsheet/getRowData/index.md' %}{% endcodeBlock %}
     *
     * @param {number} index - Specifies the row index.
     * @param {number} sheetIndex - Specifies the sheet index. By default, it consider the active sheet index.
     * @returns {Object[]} - Return row data.
     */
    public getRowData(index?: number, sheetIndex?: number): Object[] {
        if (isNullOrUndefined(index)) { index = 0; }
        if (isNullOrUndefined(sheetIndex)) { sheetIndex = this.activeSheetIndex; }
        const eventArgs: { sheetIdx: number, startIndex: number, modelType: ModelType, isDataRequest: boolean, data?: Object[] } =
            { sheetIdx: sheetIndex, startIndex: index, modelType: 'Row', isDataRequest: true };
        this.notify(dataChanged, eventArgs);
        return eventArgs.data;
    }

    /**
     * This method is used to update the Range property in specified sheetIndex.
     *
     * @param {RangeModel} range - Specifies the range properties to update.
     * @param {number} sheetIdx - Specifies the sheetIdx to update.
     * @returns {void} - To update a range properties.
     */
    public updateRange(range: RangeModel, sheetIdx?: number): void {
        sheetIdx = sheetIdx ? sheetIdx - 1 : this.activeSheetIndex;
        const sheet: SheetModel = getSheet(this, sheetIdx);
        const ranges: RangeModel[] = sheet.ranges;
        if (!isNullOrUndefined(sheet)) {
            ranges.push(range);
            sheet.ranges = ranges;
        }
    }

    /**
     * This method is used to wrap/unwrap the text content of the cell.
     *
     * {% codeBlock src='spreadsheet/wrap/index.md' %}{% endcodeBlock %}
     *
     * @param {string} address - Address of the cell to be wrapped.
     * @param {boolean} wrap - Set `false` if the text content of the cell to be unwrapped.
     * @returns {void} - To wrap/unwrap the text content of the cell.
     * {% codeBlock src='spreadsheet/wrap/index.md' %}{% endcodeBlock %}
     */
    public wrap(address: string, wrap: boolean = true): void {
        wrapText(address, wrap, this);
    }

    /**
     * Adds the defined name to the Spreadsheet.
     *
     * @param {DefineNameModel} definedName - Specifies the name.
     * @returns {boolean} - Return the added status of the defined name.
     * {% codeBlock src='spreadsheet/addDefinedName/index.md' %}{% endcodeBlock %}
     */
    public addDefinedName(definedName: DefineNameModel): boolean {
        const eventArgs: { [key: string]: Object } = {
            action: 'addDefinedName',
            isAdded: false,
            definedName: definedName
        };
        this.notify(events.workbookFormulaOperation, eventArgs);
        return <boolean>eventArgs.isAdded;
    }

    /**
     * Removes the defined name from the Spreadsheet.
     *
     * @param {string} definedName - Specifies the name.
     * @param {string} scope - Specifies the scope of the defined name.
     * @returns {boolean} - Return the removed status of the defined name.
     * {% codeBlock src='spreadsheet/removeDefinedName/index.md' %}{% endcodeBlock %}
     */
    public removeDefinedName(definedName: string, scope: string = ''): boolean {
        const eventArgs: { [key: string]: Object } = {
            action: 'removeDefinedName',
            isRemoved: false,
            definedName: definedName,
            scope: scope
        };
        this.notify(events.workbookFormulaOperation, eventArgs);
        return <boolean>eventArgs.isRemoved;
    }

    /** @hidden
     * @param {string} address - Specifies the address.
     * @param {number} sheetIndex - Specifies the sheetIndex.
     * @param {boolean} valueOnly - Specifies the bool value.
     * @returns {void} - To clear range.
     */
    public clearRange(address?: string, sheetIndex?: number, valueOnly?: boolean): void {
        address = address || this.getActiveSheet().selectedRange;
        sheetIndex = isNullOrUndefined(sheetIndex) ? this.activeSheetIndex : sheetIndex;
        valueOnly = valueOnly === null || valueOnly === undefined;
        clearRange(this, getIndexesFromAddress(address), sheetIndex, valueOnly);
    }

    /**
     * Used to set the image in spreadsheet.
     *
     * @param {ImageModel} images - Specifies the options to insert image in spreadsheet.
     * @param {string} range - Specifies the range in spreadsheet.
     * @returns {void} - To set the image in spreadsheet.
     */
    public insertImage(images: ImageModel[], range?: string): void {
        this.notify(setImage, { options: images, range: range ? range : this.getActiveSheet().selectedRange });
    }

    /**
     * Used to perform autofill action based on the specified range in spreadsheet.
     *
     * @param {string} fillRange - Specifies the fill range.
     * @param {string} dataRange - Specifies the data range.
     * @param {AutoFillDirection} direction - Specifies the direction("Down","Right","Up","Left") to be filled.
     * @param {AutoFillType} fillType - Specifies the fill type("FillSeries","CopyCells","FillFormattingOnly","FillWithoutFormatting") for autofill action.
     * @returns {void} - To perform autofill action based on the specified range in spreadsheet.
     */
    public autoFill(fillRange: string, dataRange?: string,  direction?: AutoFillDirection, fillType?: AutoFillType): void {
        const options: { dataRange: string, fillRange: string, direction: AutoFillDirection, fillType: AutoFillType } = {
            dataRange: dataRange ? dataRange : this.getActiveSheet().selectedRange,
            fillRange: fillRange,
            direction: direction ? direction : 'Down',
            fillType: fillType ? fillType : 'FillSeries'
        };
        this.notify(setAutoFill, options);
    }

    /**
     * Used to set the chart in spreadsheet.
     *
     * {% codeBlock src='spreadsheet/insertChart/index.md' %}{% endcodeBlock %}
     *
     * @param {ChartModel} chart - Specifies the options to insert chart in spreadsheet
     * @returns {void} - To set the chart in spreadsheet.
     */
    public insertChart(chart?: ChartModel[]): void {
        this.notify(setChart, { chart: chart });
    }

    /**
     * Used to delete the chart from spreadsheet.
     *
     * {% codeBlock src='spreadsheet/deleteChart/index.md' %}{% endcodeBlock %}
     *
     * @param {string} id - Specifies the chart element id.
     * @returns {void} - To delete the chart from spreadsheet.
     */
    public deleteChart(id?: string): void {
        this.notify(deleteChart, { id: id });
    }

    /**
     * Filters the range of cells in the sheet.
     *
     * @param {FilterOptions} filterOptions - Specifies the filterOptions
     * @param {string} range - Specifies the range
     * @returns {Promise<FilterEventArgs>} - To Filters the range of cells in the sheet.
     */
    public filter(filterOptions?: FilterOptions, range?: string): Promise<FilterEventArgs> {
        if (!this.allowFiltering) { return Promise.reject(); }
        const eventArgs: BeforeFilterEventArgs = {
            range: range || this.getActiveSheet().selectedRange,
            filterOptions: filterOptions,
            cancel: false
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const promise: Promise<FilterEventArgs> = new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); });
        const filterArgs: { [key: string]: BeforeFilterEventArgs | Promise<FilterEventArgs> } = { args: eventArgs, promise: promise };
        this.notify(events.initiateFilter, filterArgs);
        return filterArgs.promise as Promise<FilterEventArgs>;
    }

    /**
     * To add custom library function.
     *
     * @param {string} functionHandler - Custom function handler name
     * @param {string} functionName - Custom function name
     * {% codeBlock src='spreadsheet/addCustomFunction/index.md' %}{% endcodeBlock %}
     * @returns {void} - To add custom library function.
     */
    public addCustomFunction(functionHandler: string | Function, functionName?: string): void {
        functionName = functionName ? functionName : typeof functionHandler === 'string' ? functionHandler :
            functionHandler.name.replace('bound ', '');
        const eventArgs: { [key: string]: Object } = {
            action: 'addCustomFunction',
            functionHandler: functionHandler,
            functionName: functionName
        };
        this.notify(events.workbookFormulaOperation, eventArgs);
    }

    /**
     * This method is used to Clear contents, formats and hyperlinks in spreadsheet.
     *
     * @param {ClearOptions} options - Options for clearing the content, formats and hyperlinks in spreadsheet.
     * @returns {void} - To Clear contents, formats and hyperlinks.
     */
    public clear(options: ClearOptions): void {
        this.notify(events.clear, options);
    }

    /**
     * Gets the formatted text of the cell.
     *
     * {% codeBlock src='spreadsheet/getDisplayText/index.md' %}{% endcodeBlock %}
     *
     * @param {CellModel} cell - Specifies the cell.
     * @returns {string} - To get Display Text.
     */
    public getDisplayText(cell: CellModel): string {
        if (!cell) { return ''; }
        if (cell.format && !isNullOrUndefined(cell.value)) {
            const eventArgs: { [key: string]: string | number | boolean | CellModel } = {
                formattedText: cell.value, value: cell.value, format: cell.format, onLoad: true, cell: cell
            };
            this.notify(events.getFormattedCellObject, eventArgs);
            return eventArgs.formattedText as string;
        } else if (!cell.value && cell.hyperlink) {
            return typeof cell.hyperlink === 'string' ? cell.hyperlink : cell.hyperlink.address;
        } else { return cell.value || typeof cell.value === 'number' ? cell.value.toString() : ''; }
    }

    /**
     * This method is used to freeze rows and columns after the specified cell in the Spreadsheet.
     *
     * @param {number} row - Specifies the freezed row count.
     * @param {number} column - Specifies the freezed column count.
     * @param {number | string} sheet - Specifies the sheet name or index in which the freeze operation will perform. By default,
     * active sheet will be considered.
     * {% codeBlock src='spreadsheet/freezePanes/index.md' %}{% endcodeBlock %}
     * @returns {void}
     */
    public freezePanes(row: number = 1, column: number = 1, sheet?: number | string): void {
        const model: SheetModel = this.getSheetModel(sheet);
        if (model.frozenRows === row && model.frozenColumns === column) { return; }
        this.setSheetPropertyOnMute(model, 'frozenRows', row);
        this.setSheetPropertyOnMute(model, 'frozenColumns', column);
        this.updateTopLeftCell();
        if (model.name === this.getActiveSheet().name) { this.notify(events.dataRefresh, null); }
    }

    /**
     * This method is used to unfreeze the frozen rows and columns from the active sheet.
     *
     * @param {number | string} sheet - Specifies the sheet name or index in which the unfreeze operation will perform. By default,
     * active sheet will be considered.
     * {% codeBlock src='spreadsheet/unfreezePanes/index.md' %}{% endcodeBlock %}
     * @returns {void}
     */
    public Unfreeze(sheet?: number | string): void {
        this.freezePanes(0, 0, sheet);
    }

    /**
     * @param {number} top - Specifies the top.
     * @param {number} left - Specifies the fleft.
     * @param {string} model - Specifies the model.
     * @param {SheetModel} sheet - Specifies the sheet.
     * @returns {void}
     * @hidden
     */
    public updateTopLeftCell(top?: number, left?: number, model?: string, sheet?: SheetModel): void {
        if (!sheet) { sheet = this.getActiveSheet(); }
        const indexes: number[] = getCellIndexes(sheet.topLeftCell);
        if (sheet.frozenRows || sheet.frozenColumns) {
            if (isNullOrUndefined(top)) { top = sheet.frozenRows ? 0 : indexes[0]; }
            if (isNullOrUndefined(left)) { left = sheet.frozenColumns ? 0 : indexes[1]; }
            top += this.frozenRowCount(sheet); left += this.frozenColCount(sheet);
            if (model) {
                if (model === 'row') {
                    top = getCellIndexes(sheet.paneTopLeftCell)[0];
                } else {
                    left = getCellIndexes(sheet.paneTopLeftCell)[1];
                }
            }
            this.setSheetPropertyOnMute(sheet, 'paneTopLeftCell', getCellAddress(top, left));
            if (sheet.frozenRows) { top = indexes[0]; }
            if (sheet.frozenColumns) { left = indexes[1]; }
        } else {
            if (isNullOrUndefined(top)) { top = indexes[0]; }
            if (isNullOrUndefined(left)) { left = indexes[1]; }
            this.setSheetPropertyOnMute(sheet, 'paneTopLeftCell', getCellAddress(top, left));
        }
        this.setSheetPropertyOnMute(sheet, 'topLeftCell', getCellAddress(top, left));
    }

    /**
     * @hidden
     * @param {string} address - Specifies the address.
     * @returns {number | number[]} - To get address info.
     */
    public getAddressInfo(address: string): { sheetIndex: number, indices: number[] } {
        return getAddressInfo(this, address);
    }

    /**
     * @hidden
     * @param {SheetModel} sheet - Specifies the sheet.
     * @param {string} prop - Specifies the prop.
     * @param {Object} value - Specifies the value.
     * @returns {void} - To set sheet properties.
     */
    public setSheetPropertyOnMute(sheet: SheetModel, prop: string, value: Object): void {
        this.isProtectedOnChange = true;
        sheet[prop] = value;
        this.isProtectedOnChange = false;
    }

    /**
     * To get frozen row count from top index.
     *
     * @hidden
     * @param {SheetModel} sheet - Specifies the sheet.
     * @returns {number} - to get the frozen count.
     */
    public frozenRowCount(sheet: SheetModel): number {
        return sheet.frozenRows ? (sheet.topLeftCell === 'A1' ? sheet.frozenRows : getCellIndexes(sheet.topLeftCell)[0] + sheet.frozenRows)
            : 0;
    }

    /**
     * To get frozen column count from left index.
     *
     * @hidden
     * @param {SheetModel} sheet - Specifies the sheet.
     * @returns {number} - to get the frozen count.
     */
    public frozenColCount(sheet: SheetModel): number {
        return sheet.frozenColumns ? (sheet.topLeftCell === 'A1' ? sheet.frozenColumns : getCellIndexes(sheet.topLeftCell)[1] +
            sheet.frozenColumns) : 0;
    }

    /**
     * To update the provided range while inserting or deleting rows and columns.
     *
     * @param {InsertDeleteEventArgs} args - Insert / Detele event arguments.
     * @param {number[]} index - Existing range.
     * @returns {boolean} - It return `true`, if the insert / delete action happens between the provided range, otherwise `false`.
     * @hidden
     */
    public updateRangeOnInsertDelete(args: InsertDeleteEventArgs, index: number[]): boolean {
        let diff: number; let updated: boolean = false;
        if (args.isInsert) {
            diff = (args.endIndex - args.startIndex) + 1;
            if (args.modelType === 'Row') {
                if (args.startIndex <= index[0]) { index[0] += diff; updated = true; }
                if (args.startIndex <= index[2]) { index[2] += diff; updated = true; }
            } else {
                if (args.startIndex <= index[1]) { index[1] += diff; updated = true; }
                if (args.startIndex <= index[3]) { index[3] += diff; updated = true; }
            }
        } else {
            if (args.modelType === 'Row') {
                diff = index[0] - args.startIndex;
                if (diff > 0) {
                    if (index[0] > args.endIndex) {
                        diff = (args.endIndex - args.startIndex) + 1;
                        if (diff > 0) { index[0] -= diff; updated = true; }
                    } else {
                        index[0] -= diff; updated = true;
                    }
                }
                if (args.startIndex <= index[2]) {
                    if (args.endIndex <= index[2]) {
                        index[2] -= (args.endIndex - args.startIndex) + 1;
                    } else {
                        index[2] -= (index[2] - args.startIndex) + 1;
                    }
                    updated = true;
                }
            } else {
                diff = index[1] - args.startIndex;
                if (diff > 0) {
                    if (index[1] > args.endIndex) {
                        diff = (args.endIndex - args.startIndex) + 1;
                        if (diff > 0) { index[1] -= diff; updated = true; }
                    } else {
                        index[1] -= diff; updated = true;
                    }
                }
                if (args.startIndex <= index[3]) {
                    if (args.endIndex <= index[3]) {
                        index[3] -= (args.endIndex - args.startIndex) + 1;
                    } else {
                        index[3] -= (index[3] - args.startIndex) + 1;
                    }
                    updated = true;
                }
            }
        }
        return updated;
    }
}
