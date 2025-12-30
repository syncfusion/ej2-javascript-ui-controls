import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Collection, Complex, EmitType, getUniqueID } from '@syncfusion/ej2-base';
import { initSheet, getSheet, getSheetIndexFromId, getSheetIndex, Sheet, moveSheet, duplicateSheet } from './sheet';
import { Event, ModuleDeclaration, merge, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { WorkbookModel } from './workbook-model';
import { getWorkbookRequiredModules } from '../common/module';
import { SheetModel, CellModel, ColumnModel, RowModel, getData, RangeModel, isHiddenRow, isHiddenCol, OpenSettingsModel } from './index';
import { OpenOptions, BeforeOpenEventArgs, OpenFailureArgs, UndoRedoEventArgs } from '../../spreadsheet/common/interface';
import { DefineName, CellStyle, updateRowColCount, getIndexesFromAddress, localeData, workbookLocale, getUpdatedRange } from '../common/index';
import { BorderType, getSheetIndexFromAddress, CalculationMode } from '../common/index';
import * as events from '../common/event';
import { CellStyleModel, DefineNameModel, HyperlinkModel, insertModel, InsertDeleteModelArgs, getAddressInfo } from '../common/index';
import { setCellFormat, sheetCreated, deleteModel, ModelType, ProtectSettingsModel, ValidationModel, setLockCells } from '../common/index';
import { BeforeSaveEventArgs, SaveCompleteEventArgs, BeforeCellFormatArgs, UnprotectArgs, ExtendedRange, SerializationOptions, ExtendedThreadedCommentModel, ExtendedNoteModel, ExtendedSheet } from '../common/interface';
import { SaveOptions, SetCellFormatArgs, ClearOptions, AutoFillSettings, AutoFillDirection, AutoFillType, dateToInt } from '../common/index';
import { SortOptions, BeforeSortEventArgs, SortEventArgs, FindOptions, CellInfoEventArgs, ConditionalFormatModel } from '../common/index';
import { FilterEventArgs, FilterOptions, BeforeFilterEventArgs, ChartModel, getCellIndexes, getCellAddress } from '../common/index';
import { setMerge, MergeType, MergeArgs, ImageModel, FilterCollectionModel, SortCollectionModel, dataChanged } from '../common/index';
import { getCell, skipDefaultValue, setCell, wrap as wrapText, OpenSettings } from './cell';
import { DataBind, setRow, setColumn, InsertDeleteEventArgs, NumberFormatArgs, parseLocaleNumber, refreshRibbonIcons } from '../index';
import { WorkbookSave, WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookFilter, WorkbookImage } from '../integrations/index';
import { WorkbookChart } from '../integrations/index';
import { WorkbookNumberFormat, getFormatFromType } from '../integrations/number-format';
import { WorkbookEdit, WorkbookCellFormat, WorkbookHyperlink, WorkbookInsert, WorkbookProtectSheet, WorkbookAutoFill } from '../actions/index';
import { WorkbookDataValidation, WorkbookMerge, addListValidationDropdown, checkColumnValidation } from '../index';
import { ServiceLocator } from '../services/index';
import { setLinkModel, setImage, setChart, setAutoFill, BeforeCellUpdateArgs, updateCell, isNumber } from '../common/index';
import { deleteChart, finiteAlert, formulaBarOperation, processSheetComments, processSheetNotes } from '../../spreadsheet/common/event';
import { beginAction, WorkbookFindAndReplace, getRangeIndexes, workbookEditOperation, clearCFRule, CFArgs, setCFRule } from '../index';
import { WorkbookConditionalFormat } from '../actions/conditional-formatting';
import { AutoFillSettingsModel } from '../..';
import { CheckCellValidArgs, setVisibleMergeIndex, calculateFormula, dataSourceChanged, ExtendedChartModel } from '../common/index';
import { IFormulaColl } from '../../calculate/common/interface';

/**
 * Represents the Workbook.
 */
@NotifyPropertyChanges
export class Workbook extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Configures sheets and its options.
     *
     * {% codeBlock src='spreadsheet/sheets/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Collection<SheetModel>([], Sheet)
    public sheets: SheetModel[];

    /**
     * Defines the display name of the author used for new notes, comments, or replies in the spreadsheet.
     * If the author is not set, comments or notes will appear without an author label.
     *
     * @default null
     */
    @Property(null)
    public author: string;

    /**
     * Specifies the active sheet index in the workbook.
     *
     * {% codeBlock src='spreadsheet/activeSheetIndex/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     * @asptype int
     */

    @Property(0)
    public activeSheetIndex: number;

    /**
     * Defines the height of the Spreadsheet. It accepts height as pixels, number, and percentage.
     *
     * {% codeBlock src='spreadsheet/height/index.md' %}{% endcodeBlock %}
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;
    /**
     * It allows to enable/disable find and replace with its functionalities.
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
     *
     * {% codeBlock src='spreadsheet/width/index.md' %}{% endcodeBlock %}
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
     * Enables or disables the ability to add or show notes in the Spreadsheet. If the property is set to false, the Spreadsheet will not add notes in the cells and the notes in the existing cells will not be visible.
     *
     * @default true
     */
    @Property(true)
    public enableNotes: boolean;

    /**
     * It allows you to insert rows, columns, and sheets into the spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public allowInsert: boolean;

    /**
     * It allows you to delete rows, columns, and sheets from a spreadsheet.
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
     * It allows you to apply data validation to the spreadsheet cells.
     *
     * @default true
     */
    @Property(true)
    public allowDataValidation: boolean;

    /**
     * It allows you to insert the image in a spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public allowImage: boolean;

    /**
     * It allows you to insert the chart in a spreadsheet.
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
     * Enables or disables the printing functionality in the spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public allowPrint: boolean;

    /**
     * Specifies the mode of calculation within the spreadsheet.
     * Setting the calculation mode to `Manual` can enhance performance,
     * particularly when working with multiple sheets at the same time.
     *
     * * `Automatic`: Calculations are performed automatically whenever a cell value changes.
     * * `Manual`: Calculations are performed only when explicitly triggered, improving performance
     *   when loading or working with large spreadsheets.
     *
     * @default 'Automatic'
     */
    @Property('Automatic')
    public calculationMode: CalculationMode;

    /**
     * Configures the auto fill settings.
     *
     * The autoFillSettings `fillType` property has FOUR types and it is described below:
     *
     * * CopyCells: To update the copied cells for the selected range.
     * * FillSeries: To update the filled series for the selected range.
     * * FillFormattingOnly: To fill the formats only for the selected range.
     * * FillWithoutFormatting: To fill without the format for the selected range.
     *
     * {% codeBlock src='spreadsheet/autoFillSettings/index.md' %}{% endcodeBlock %}
     *
     * > The `allowAutoFill` property should be `true`.
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
     *
     * {% codeBlock src='spreadsheet/cellStyle/index.md' %}{% endcodeBlock %}
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
     * Specifies the options for configuration when opening a document.
     *
     * {% codeBlock src='spreadsheet/openSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Complex(<OpenSettingsModel>{}, OpenSettings)
    public openSettings: OpenSettingsModel;

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
     * Specifies the name of a range and uses it in a formula for calculation.
     *
     * {% codeBlock src='spreadsheet/definedNames/index.md' %}{% endcodeBlock %}
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

    /**
     * Triggers before changing any cell properties.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     *  new Spreadsheet({
     *      beforeCellUpdate: (args: BeforeCellUpdateArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     *
     * @event beforeCellUpdate
     */
    @Event()
    public beforeCellUpdate: EmitType<BeforeCellUpdateArgs>;

    /**
     * It allows to enable/disable freeze pane functionality in spreadsheet.
     *
     * @default true
     */
    @Property(true)
    public allowFreezePane: boolean;

    /**
     * Specifies the list separator which is used as the formula argument separator.
     *
     * @default ','
     */
    @Property(',')
    public listSeparator: string;

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
    public dataValidationRange: string = '';

    /**
     * @hidden
     */
    public isOpen: boolean = false;

    /**
     * @hidden
     */
    public chartColl: ExtendedChartModel[] = [];
    /**
     * @hidden
     */
    public isPrintingProcessing: boolean = false;
    /**
     * @hidden
     */
    public currentPrintSheetIndex: number = 0;

    /** @hidden */
    public formulaRefCell: string;

    /** @hidden */
    public customFormulaCollection: Map<string, IFormulaColl> = new Map<string, IFormulaColl>();

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
        if (sheet && (!sheet.isProtected || sheet.protectSettings.formatCells)) {
            range = range || sheet.selectedRange;
            this.notify(setCellFormat, { style: style, range: range, refreshRibbon: range.indexOf(sheet.activeCell) > -1 ? true : false });
        }
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
        this.notify(setLockCells, { range: range, isLocked: isLocked, triggerEvent: true });
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
            style[`${cssProp}`] = this.cellStyle[`${cssProp}`];
            if (cell && cell.style && cell.style[`${cssProp}`]) {
                style[`${cssProp}`] = cell.style[`${cssProp}`];
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
     * @param {string} range - Specifies the address of the range of cells.
     * @returns {void} - Applies the number format (number, currency, percentage, short date, etc...) to the specified range of cells.
     */
    public numberFormat(format: string, range?: string): void {
        this.notify(events.applyNumberFormatting, { format: format, range: range });
        this.notify(events.localizedFormatAction, { action: 'addToCustomFormats', format: format });
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
                    initSheet(this, undefined, undefined, true);
                    this.notify(sheetCreated, null);
                    this.notify(events.workbookFormulaOperation, { action: 'registerSheet' });
                } else {
                    initSheet(this, undefined, undefined, true);
                }
                break;
            case 'listSeparator':
                this.notify(events.workbookFormulaOperation, { action: 'setArgumentSeparator' });
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
     * @param {boolean} isUndoRedo - Specifies is undo redo or not.
     * @returns {void} - To Sets the border to specified range of cells.
     */
    public setBorder(style: CellStyleModel, range?: string, type?: BorderType, isUndoRedo?: boolean): void {
        this.notify(setCellFormat, <SetCellFormatArgs>{
            style: style, borderType: type, range:
                range || this.getActiveSheet().selectedRange, isUndoRedo: isUndoRedo
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
        if (this.isProtected) {
            return;
        }
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
        if (this.isProtected) {
            return;
        }
        startIndex = startIndex || 0; let sheetModel: SheetModel | WorkbookModel;
        endIndex = isNullOrUndefined(endIndex) ? startIndex : endIndex;
        if (!model || model === 'Sheet') {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            sheetModel = this;
            if (Math.abs(endIndex - startIndex) >= this.sheets.length) {
                return;
            }
        } else {
            sheetModel = this.getSheetModel(sheet);
            if (!sheetModel) { return; }
        }
        this.notify(deleteModel, <InsertDeleteModelArgs>{
            model: sheetModel, start: startIndex, end: endIndex, modelType: model || 'Sheet'
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
        if (this.isProtected) {
            return;
        }
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
        if (this.isProtected) {
            return;
        }
        duplicateSheet(this, sheetIndex);
    }

    private getSheetModel(sheet: number | string): SheetModel {
        if (isNullOrUndefined(sheet)) {
            return this.getActiveSheet();
        } else {
            const index: number = typeof sheet === 'string' ? getSheetIndex(this, sheet) : sheet;
            if (isNullOrUndefined(index) || index >= this.sheets.length) {
                return null;
            }
            return this.sheets[index as number];
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
            sheetIdx = this.isPrintingProcessing ? this.currentPrintSheetIndex : getSheetIndexFromAddress(this, range);
            sheet = getSheet(this, sheetIdx);
        } else {
            sheet = this.getActiveSheet(); range = sheet.selectedRange; sheetIdx = this.activeSheetIndex;
        }
        if (sheet.isProtected) {
            return;
        }
        this.notify(setMerge, <MergeArgs>{ merge: true, range: range, type: type || 'All', sheetIndex: sheetIdx, refreshRibbon:
            range.indexOf(sheet.activeCell) > -1 ? true : false, preventRefresh: this.activeSheetIndex !== sheetIdx });
    }

    /**
     * Used to split the merged cell into multiple cells.
     *
     * {% codeBlock src='spreadsheet/unMerge/index.md' %}{% endcodeBlock %}
     *
     * @param {string} range - Specifies the range of cells as address.
     * @returns {void} - To split the merged cell into multiple cells.
     */
    public unMerge(range?: string): void {
        let sheetIdx: number; let sheet: SheetModel;
        if (range) {
            sheetIdx = getSheetIndexFromAddress(this, range); sheet = getSheet(this, sheetIdx);
        } else {
            sheet = this.getActiveSheet(); range = sheet.selectedRange; sheetIdx = this.activeSheetIndex;
        }
        if (sheet.isProtected) {
            return;
        }
        this.notify(setMerge, <MergeArgs>{
            merge: false, range: range, sheetIndex: sheetIdx, type: 'All',
            refreshRibbon: range.indexOf(sheet.activeCell) > -1 ? true : false, preventRefresh: this.activeSheetIndex !== sheetIdx
        });
    }

    /** Used to compute the specified expression/formula.
     *
     * {% codeBlock src='spreadsheet/computeExpression/index.md' %}{% endcodeBlock %}
     *
     * @param {string} formula - Specifies the formula(=SUM(A1:A3)) or expression(2+3).
     * @returns {string | number} - to compute the specified expression/formula.
     */
    public computeExpression(formula: string): string | number {
        const args: { action: string, formula: string, calcValue?: string | number, isFromComputeExpression?: boolean } = {
            action: 'computeExpression', formula: formula, isFromComputeExpression: true
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

    /**
     * @hidden
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
        if (this.sheets[index as number] && this.sheets[index as number].state !== 'Visible') {
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
     * @param {boolean} preventRowColUpdate - To prevent updating row and column count.
     * @param {boolean} forceUpdate - To force updating row and column count.
     * @returns {void} - To setting the used range row and column index.
     */
    public setUsedRange(
        rowIdx: number, colIdx: number, sheet: SheetModel = this.getActiveSheet(), preventRowColUpdate?: boolean,
        forceUpdate?: boolean ): void {
        if (forceUpdate) {
            this.setSheetPropertyOnMute(sheet, 'usedRange', { rowIndex: rowIdx, colIndex: colIdx });
            return;
        }
        if (rowIdx > sheet.usedRange.rowIndex) {
            this.setSheetPropertyOnMute(sheet, 'usedRange', { rowIndex: rowIdx, colIndex: sheet.usedRange.colIndex });
            if (sheet === this.getActiveSheet() && !preventRowColUpdate) {
                this.notify(updateRowColCount, { index: rowIdx, update: 'row' });
            }
        }
        if (colIdx > sheet.usedRange.colIndex) {
            this.setSheetPropertyOnMute(sheet, 'usedRange', { rowIndex: sheet.usedRange.rowIndex, colIndex: colIdx });
            if (sheet === this.getActiveSheet() && !preventRowColUpdate) {
                this.notify(updateRowColCount, { index: colIdx, update: 'col' });
            }
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
     * @param {boolean} isUnique - Specifies is unique formula or not.
     * @param {boolean} isSubtotal - Specifies is from Subtotal formula or not.
     * @returns {string | number} - To set the value for row and col.
     */
    public getValueRowCol(
        sheetId: number, rowIndex: number, colIndex: number, formulaCellReference?: string,
        refresh?: boolean, isUnique?: boolean, isSubtotal?: boolean): string | number {
        let sheetIndex: number = getSheetIndexFromId(this, sheetId);
        const sheet: SheetModel = getSheet(this, sheetIndex);
        let cell: CellModel = getCell(rowIndex - 1, colIndex - 1, sheet);
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
        } else if (cell && cell.formula && (refresh || isNullOrUndefined(cell.value)) &&
            !isUnique && this.calculationMode === 'Automatic') {
            this.notify(
                calculateFormula, {
                    cell: cell, rowIdx: rowIndex - 1, colIdx: colIndex - 1, sheetIndex: sheetIndex,
                    formulaRefresh: true
                });
        }
        if (cell && !isNumber(cell.value) && !this.isEdit) {
            const eventArgs: NumberFormatArgs = { formattedText: cell.value, value: cell.value, format: cell.format, cell: cell,
                skipFormatCheck: false };
            this.notify(events.getFormattedCellObject, eventArgs);
            cell = eventArgs.cell;
        }
        if (isSubtotal && cell && cell.formula && cell.formula.includes('SUBTOTAL(')) {
            return cell.formula; // To ignore subtotal result in the subtotal formula.
        }
        return cell && cell.value;
    }

    /** @hidden
     * @param {number} sheetId - Specifies the sheet id.
     * @param {string | number} value - Specifies the value.
     * @param {number} rowIndex - Specifies the rowIndex.
     * @param {number} colIndex - Specifies the colIndex.
     * @param {string} formula - Specifies the colIndex.
     * @param {boolean} isRandomFormula - Specifies is random formula or not.
     * @returns {void} - To set the value for row and col.
     */
    public setValueRowCol(sheetId: number, value: string | number, rowIndex: number,
                          colIndex: number, formula?: string, isRandomFormula?: boolean): void {
        this.notify(
            workbookEditOperation,
            {
                action: 'updateCellValue', address: [rowIndex - 1, colIndex - 1], value: value,
                sheetIndex: getSheetIndexFromId(this, sheetId), isValueOnly: true, formula: formula, isRandomFormula: isRandomFormula
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
     * * triggerEvent: Specifies whether to trigger the `openComplete` event or not.
     *
     * @param {Object} options - Options for opening the JSON object.
     * @param {string | object} options.file - Options for opening the JSON object.
     * @param {boolean} options.triggerEvent - Specifies whether to trigger the `openComplete` event or not.
     * @param {SerializationOptions} jsonConfig - Specify the serialization options to customize the loading of the JSON data.
     * @param {boolean} jsonConfig.onlyValues - If true, only the cell values will be loaded, excluding styles, formulas, etc.
     * @param {boolean} jsonConfig.ignoreStyle - If true, styles will be excluded when loading the JSON data.
     * @param {boolean} jsonConfig.ignoreFormula - If true, formulas will be excluded when loading the JSON data.
     * @param {boolean} jsonConfig.ignoreFormat - If true, number formats will be excluded when loading the JSON data.
     * @param {boolean} jsonConfig.ignoreConditionalFormat - If true, conditional formatting will be excluded when loading the JSON data.
     * @param {boolean} jsonConfig.ignoreValidation - If true, data validation rules will be excluded when loading the JSON data.
     * @param {boolean} jsonConfig.ignoreFreezePane - If true, freeze panes will be excluded when loading the JSON data.
     * @param {boolean} jsonConfig.ignoreWrap - If true, text wrapping settings will be excluded when loading the JSON data.
     * @param {boolean} jsonConfig.ignoreChart - If true, charts will be excluded when loading the JSON data.
     * @param {boolean} jsonConfig.ignoreImage - If true, images will be excluded when loading the JSON data.
     * @param {boolean} jsonConfig.ignoreNote -  If true, notes will be excluded when loading the JSON data.
     * @returns {void} - Opens the specified JSON object.
     */
    public openFromJson(options: { file: string | object, triggerEvent?: boolean }, jsonConfig?: SerializationOptions): void {
        this.isOpen = true;
        let jsonObject: string = typeof options.file === 'object' ? JSON.stringify(options.file) : options.file;
        if (jsonObject !== '' && jsonConfig) {
            const skipProps: string[] = [];
            if (jsonConfig.onlyValues) {
                skipProps.push(...['style', 'formula', 'format', 'conditionalFormats', 'validation',
                    'hyperlink', 'wrap', 'chart', 'image', 'notes']);
            } else {
                const ignoreProps: { [key: string]: boolean } = {
                    style: jsonConfig.ignoreStyle,
                    formula: jsonConfig.ignoreFormula,
                    format: jsonConfig.ignoreFormat,
                    conditionalFormats: jsonConfig.ignoreConditionalFormat,
                    validation: jsonConfig.ignoreValidation,
                    wrap: jsonConfig.ignoreWrap,
                    chart: jsonConfig.ignoreChart,
                    image: jsonConfig.ignoreImage,
                    notes: jsonConfig.ignoreNote
                };
                if (jsonConfig.ignoreFreezePane) { skipProps.push(...['frozenColumns', 'frozenRows']); }
                for (const prop in ignoreProps) {
                    if (ignoreProps[prop as string]) {
                        skipProps.push(prop);
                    }
                }
            }
            jsonObject = JSON.stringify(JSON.parse(jsonObject), (key: string, value: { [key: string]: object }) => {
                if (skipProps.indexOf(key) > -1) {
                    return undefined;
                }
                return value;
            });
        }
        this.notify(events.workbookOpen, { jsonObject: jsonObject, triggerEvent: options.triggerEvent });
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
     * @param {SerializationOptions} jsonConfig - Specify the serialization options to customize the JSON output.
     * @param {boolean} jsonConfig.onlyValues - If true, only the cell values will be included, excluding styles, formulas, etc.
     * @param {boolean} jsonConfig.ignoreStyle - If true, styles will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreFormula - If true, formulas will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreFormat - If true, number formats will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreConditionalFormat - If true, conditional formatting will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreValidation - If true, data validation rules will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreFreezePane - If true, freeze panes will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreWrap - If true, text wrapping settings will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreChart - If true, charts will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreImage - If true, images will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreNote -  If true, notes will be excluded from the JSON output.
     * @returns {void} - To Saves the Spreadsheet data to Excel file.
     */
    public save(saveOptions: SaveOptions = {}, jsonConfig?: SerializationOptions): void {
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
                autoDetectFormat: false,
                pdfLayoutSettings: { fitSheetOnOnePage: false, orientation: 'Portrait' },
                jsonConfig: jsonConfig
            };
            this.trigger('beforeSave', eventArgs);
            this.notify(beginAction, { eventArgs: eventArgs, action: 'beforeSave' });
            if (!eventArgs.cancel) {
                this.notify(
                    events.beginSave, {
                        saveSettings: eventArgs, isFullPost: eventArgs.isFullPost, needBlobData: eventArgs.needBlobData,
                        customParams: eventArgs.customParams, pdfLayoutSettings: eventArgs.pdfLayoutSettings,
                        jsonConfig: eventArgs.jsonConfig,
                        skipWorkerPipeline: (<{ skipWorkerPipeline?: boolean }>eventArgs).skipWorkerPipeline
                    });
            }
        }
    }

    /**
     * Saves the Spreadsheet data as JSON object.
     *
     * {% codeBlock src='spreadsheet/saveAsJson/index.md' %}{% endcodeBlock %}
     *
     * @param {SerializationOptions} jsonConfig - Specify the serialization options to customize the JSON output.
     * @param {boolean} jsonConfig.onlyValues - If true, only the cell values will be included, excluding styles, formulas, etc.
     * @param {boolean} jsonConfig.ignoreStyle - If true, styles will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreFormula - If true, formulas will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreFormat - If true, number formats will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreConditionalFormat - If true, conditional formatting will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreValidation - If true, data validation rules will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreFreezePane - If true, freeze panes will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreWrap - If true, text wrapping settings will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreChart - If true, charts will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreImage - If true, images will be excluded from the JSON output.
     * @param {boolean} jsonConfig.ignoreNote -  If true, notes will be excluded from the JSON output.
     * @returns {Promise<object>} - To Saves the Spreadsheet data as JSON object.
     */
    public saveAsJson(jsonConfig?: SerializationOptions): Promise<object> {
        return new Promise<object>((resolve: Function) => {
            this.on(events.onSave, (args: { cancel: boolean, jsonObject: object }) => {
                args.cancel = true;
                this.off(events.onSave);
                resolve({ jsonObject: { Workbook: args.jsonObject } });
                this.notify(events.saveCompleted, args);
            });
            this.save({}, jsonConfig);
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
        this.notify(events.find, args);
    }
    /**
     * @hidden
     * @param {FindOptions} args - Specifies the FindOptions.
     * @returns {void} - To replace the value.
     */
    public replaceHandler(args: FindOptions): void {
        if (args.replaceBy === 'replace') {
            this.notify(events.replace, args);
        } else {
            this.notify(events.replaceAll, args);
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
        if (isNullOrUndefined(sheet)) {
            sheet = this.activeSheetIndex;
        } else if (typeof (sheet) === 'string') {
            sheet = getSheetIndex(this, sheet);
        }
        const sheetModel: SheetModel = this.sheets[sheet as number];
        if (!sheetModel) {
            return;
        }
        this.setSheetPropertyOnMute(sheetModel, 'isProtected', true);
        this.setSheetPropertyOnMute(sheetModel, 'password', password ? password : '');
        this.setSheetPropertyOnMute(sheetModel, 'protectSettings', protectSettings ? protectSettings : {});
        this.notify(events.protectsheetHandler, {
            protectSettings: sheetModel.protectSettings, password: sheetModel.password, sheetIndex: sheet
        });
    }

    /**
     * Unprotect the active sheet.
     *
     * @param {number} sheet - Specifies the sheet to Unprotect.
     * @returns {void} - Unprotect the active sheet.
     */
    public unprotectSheet(sheet: number | string): void {
        if (isNullOrUndefined(sheet)) {
            sheet = this.activeSheetIndex;
        } else if (typeof (sheet) === 'string') {
            sheet = getSheetIndex(this, sheet);
        }
        if (!this.sheets[sheet as number]) {
            return;
        }
        const args: UnprotectArgs = { sheet: sheet};
        this.notify(events.unprotectsheetHandler, args);
    }

    /**
     * Sorts the range of cells in the active Spreadsheet.
     *
     * @param {SortOptions} sortOptions - options for sorting.
     * @param {string} range - address of the data range.
     * @param {SortCollectionModel[]} previousSort - specifies previous sort collection.
     * @returns {Promise<SortEventArgs>} - Sorts the range of cells in the active Spreadsheet.
     */
    public sort(sortOptions?: SortOptions, range?: string, previousSort?: SortCollectionModel[]): Promise<SortEventArgs> {
        if (!this.allowSorting) { return Promise.reject(); }
        const eventArgs: BeforeSortEventArgs = {
            range: range || this.getActiveSheet().selectedRange,
            sortOptions: sortOptions || { sortDescriptors: {} },
            cancel: false
        };
        const promise: Promise<SortEventArgs> = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        const sortArgs: { [key: string]: BeforeSortEventArgs | Promise<SortEventArgs> | SortCollectionModel[] } =
            { args: eventArgs, promise: promise, previousSort: previousSort };
        this.notify(events.initiateSort, sortArgs);
        return sortArgs.promise as Promise<SortEventArgs>;
    }

    public addDataValidation(rules: ValidationModel, range?: string): void {
        if (isNullOrUndefined(rules.value1)) {
            return;
        }
        if (rules.type === 'List') {
            if (rules.value1.length > 256) {
                rules.value1 = (rules.value1 as string).substring(0, 255);
            }
        } else {
            rules.value1 =  parseLocaleNumber([rules.value1], this)[0];
            if (rules.value2) {
                rules.value2 = parseLocaleNumber([rules.value2], this)[0];
            }
        }
        this.notify(events.cellValidation, { rules: rules, range: range || getUpdatedRange(this.getActiveSheet()) });
    }

    public removeDataValidation(range?: string): void {
        this.notify(events.cellValidation, {
            range: range || getUpdatedRange(this.getActiveSheet()),
            isRemoveValidation: true
        });
    }

    public addInvalidHighlight(range?: string): void {
        this.notify(events.addHighlight, { range: range });
    }

    public removeInvalidHighlight(range?: string): void {
        this.notify(events.removeHighlight, { range: range });
    }

    /**
     * To determine whether the cell value in a data validation applied cell is valid or not.
     *
     * @param {string} cellAddress - Address of the cell.
     * @returns {boolean} - It return true if the cell value is valid; otherwise, false.
     */
    public isValidCell(cellAddress?: string): boolean {
        let sheet: SheetModel; let sheetIdx: number; let range: number[];
        if (cellAddress) {
            const addressInfo: { sheetIndex: number, indices: number[] } = getAddressInfo(this, cellAddress);
            sheetIdx = addressInfo.sheetIndex;
            range = addressInfo.indices;
            sheet = getSheet(this, sheetIdx);
        } else {
            sheet = this.getActiveSheet();
            range = getCellIndexes(sheet.activeCell);
            sheetIdx = this.activeSheetIndex;
        }
        const cell: CellModel = getCell(range[0], range[1], sheet, false, true);
        if (cell.validation || checkColumnValidation(sheet.columns[range[1]], range[0], range[1])) {
            const value: string = (cell.value || <unknown>cell.value === 0) ? cell.value.toString() :
                cell.hyperlink ? (typeof cell.hyperlink === 'string' ? cell.hyperlink : (cell.hyperlink.address || '')) : '';
            const validEventArgs: CheckCellValidArgs = { value, range, sheetIdx, td: null, isValid: true };
            this.notify(events.isValidation, validEventArgs);
            return validEventArgs.isValid;
        } else {
            return true;
        }
    }

    public conditionalFormat(conditionalFormat: ConditionalFormatModel): void {
        if (conditionalFormat.range) {
            if (this.listSeparator !== ',' && conditionalFormat.range.includes(this.listSeparator)) {
                conditionalFormat.range = conditionalFormat.range.split(this.listSeparator).join(',');
            }
        } else {
            conditionalFormat.range = this.getActiveSheet().selectedRange;
        }
        if (conditionalFormat.value) {
            let cfValues: string[];
            if (conditionalFormat.type === 'Between') {
                if (this.listSeparator !== ',' && conditionalFormat.value.includes(this.listSeparator)) {
                    const dateValues: string[] = conditionalFormat.value.split('"').filter((date: string) => date.trim() && date.trim() !== this.listSeparator);
                    cfValues = dateValues.length > 1 ? dateValues : conditionalFormat.value.split(this.listSeparator);
                } else {
                    const dateValues: string[] = conditionalFormat.value.split('"').filter((date: string) => date.trim() && date.trim() !== ',');
                    cfValues = dateValues.length > 1 ? dateValues : conditionalFormat.value.split(',');
                }
            } else {
                cfValues = [conditionalFormat.value];
            }
            parseLocaleNumber(cfValues, this);
            conditionalFormat.value = cfValues.join(',');
        }
        this.notify(setCFRule, <CFArgs>{ cfModel: conditionalFormat });
    }

    public clearConditionalFormat(range: string): void {
        const clearCFArgs: CFArgs = {};
        if (!range || !range.includes('!')) {
            clearCFArgs.range = range || this.getActiveSheet().selectedRange;
            clearCFArgs.sheetIdx = this.activeSheetIndex;
        } else {
            const lastIndex: number = range.lastIndexOf('!');
            clearCFArgs.range = range.substring(lastIndex + 1);
            clearCFArgs.sheetIdx = getSheetIndex(this, range.substring(0, lastIndex));
        }
        this.notify(clearCFRule, clearCFArgs);
    }

    /**
     * Updates the properties of a specified cell.
     *
     * {% codeBlock src='spreadsheet/updateCell/index.md' %}{% endcodeBlock %}
     *
     * @param {CellModel} cell - The properties to update for the specified cell.
     * @param {string} address - The address of the cell to update. If not provided, the active cell's address will be used.
     * @param {boolean} enableDependentCellUpdate - Specifies whether dependent cells should also be updated. Default value is <c>true</c>.
     * @returns {void} - This method does not return a value.
     */
    public updateCell(cell: CellModel, address?: string, enableDependentCellUpdate?: boolean): void {
        if (isNullOrUndefined(enableDependentCellUpdate)) {
            enableDependentCellUpdate = true;
        }
        this.updateCellDetails(cell, address, undefined, undefined, enableDependentCellUpdate);
    }

    /**
     * Updates the properties of a specified cell.
     *
     * @param {CellModel} cell - The properties to update for the specified cell.
     * @param {string} address - The address of the cell to update. If not provided, the active cell's address will be used.
     * @param {UndoRedoEventArgs} cellInformation - It holds the undoRedoCollections.
     * @param {boolean} isRedo - It holds the undo redo information.
     * @param {boolean} isDependentUpdate - Specifies whether dependent cells should also be updated.
     * @param {boolean} isFinite - Specifies scroll settings of the sheet is finite or not.
     * @param {boolean} isPublic - It holds whether updateCell public method is used.
     * @returns {void} - This method does not return a value.
     *
     * @hidden
     */
    public updateCellDetails(cell: CellModel, address?: string, cellInformation?: UndoRedoEventArgs, isRedo?: boolean,
                             isDependentUpdate?: boolean, isFinite?: boolean, isPublic?: boolean): void {
        let range: number[];
        let sheetIdx: number;
        if (!address) {
            address = this.getActiveSheet().activeCell;
        }
        if (address.includes('!')) {
            range = getIndexesFromAddress(address);
            sheetIdx = getSheetIndex(this, address.substring(0, address.lastIndexOf('!')));
            if (sheetIdx === undefined) {
                return;
            }
        } else {
            range = getRangeIndexes(address);
            sheetIdx = this.activeSheetIndex;
        }
        const sheet: SheetModel = getSheet(this, sheetIdx);
        if (isFinite && !(sheet.rowCount > range[0] && sheet.rowCount > range[2] &&
            sheet.colCount > range[1] && sheet.colCount > range[3])) {
            this.notify(finiteAlert, null);
            return;
        }
        const cellModel: CellModel = getCell(range[0], range[1], sheet, false, true);
        if (cell && cell.comment) {
            if (cellModel.comment) {
                this.notify(processSheetComments, {
                    sheet: sheet, id: (cell.comment as ExtendedThreadedCommentModel).id, isDelete: true });
            }
            const comment: ExtendedThreadedCommentModel = cell.comment;
            if (!comment.address) {
                comment.address = [range[0], range[1]];
                if ((sheet as ExtendedSheet).comments && (sheet as ExtendedSheet).comments.length > 0) {
                    (sheet as ExtendedSheet).comments = (sheet as ExtendedSheet).comments.filter(
                        (c: ExtendedThreadedCommentModel) => !(c.address && c.address[0] === range[0] && c.address[1] === range[1]));
                }
            }
            this.notify(processSheetComments, {
                sheet: sheet as ExtendedSheet, comment: comment,
                isDelete: false, isRefresh: true, sheetIdx: sheetIdx
            });
        }
        if (cell && cell.notes) {
            if (cellModel.notes) {
                this.notify(processSheetNotes, { sheet: sheet, id: (cellModel.notes as ExtendedNoteModel).id, isDelete: true });
            }
            let note: ExtendedNoteModel;
            if (typeof cell.notes === 'string') {
                note = {
                    id: getUniqueID('e_note'),
                    text: cell.notes,
                    rowIdx: range[0],
                    colIdx: range[1],
                    isVisible: false
                } as ExtendedNoteModel;
                cell.notes = note;
            } else {
                note = cell.notes as ExtendedNoteModel;
                if (!note.id) {
                    note.id = getUniqueID('e_note');
                }
                if (isNullOrUndefined(note.rowIdx)) {
                    note.rowIdx = range[0];
                }
                if (isNullOrUndefined(note.colIdx)) {
                    note.colIdx = range[1];
                }
                if (isNullOrUndefined(note.isVisible)) {
                    note.isVisible = false;
                }
            }
            this.notify(
                processSheetNotes, { sheet: sheet as ExtendedSheet, note: note, isDelete: false, isRefresh: true, sheetIdx: sheetIdx });
        }
        updateCell(this, sheet, { cell: cell, rowIdx: range[0], colIdx: range[1], preventEvt: true });
        const val: string = isPublic ? cell.formula || (isNullOrUndefined(cell.value) ? null : cell.value) :
            isNullOrUndefined(cell.value) ? (cell.formula || null) : cell.value;
        const valChange: boolean = val !== null;
        if (cellInformation && cellInformation.format && isRedo) {
            cellModel.format = cellInformation.format;
        }
        if (valChange) {
            delete cellModel.formattedText;
            this.notify(workbookEditOperation, {
                action: 'updateCellValue', address: range, value: val, sheetIndex: sheetIdx,
                cellInformation: cellInformation, isRedo: isRedo, isDependentUpdate: isDependentUpdate
            });
            if (this.isEdit && cellModel.value === '#CIRCULARREF!') {
                cellModel.value = '0';
            }
        } else if (!isNullOrUndefined(cell.format) && cellModel.formattedText) {
            delete cellModel.formattedText;
        }
        if (sheetIdx === this.activeSheetIndex) {
            const eventArgs: { sheet: SheetModel, cell: CellModel, rowIdx: number, colIdx: number, td?: HTMLElement,
                validation?: ValidationModel, isRefresh?: boolean } = { sheet: sheet, cell: cellModel, rowIdx: range[0], colIdx: range[1] };
            if (cellModel.rowSpan > 1 || cellModel.colSpan > 1) {
                setVisibleMergeIndex(eventArgs);
            }
            const cellEle: HTMLElement = !isHiddenRow(sheet, eventArgs.rowIdx) && !isHiddenCol(sheet, eventArgs.colIdx) &&
                this.getCell(eventArgs.rowIdx, eventArgs.colIdx);
            if (cellEle) {
                this.serviceLocator.getService<{ refresh: Function }>('cell').refresh(
                    eventArgs.rowIdx, eventArgs.colIdx, true, cellEle, valChange, valChange);
            }
            const activeCellIdx: number[] = getCellIndexes(sheet.activeCell);
            if (range[0] === activeCellIdx[0] && range[1] === activeCellIdx[1]) {
                this.notify(refreshRibbonIcons, null);
                this.notify(formulaBarOperation, { action: 'refreshFormulabar', cell: cellModel });
                if (cellEle && cell.validation) {
                    eventArgs.validation = cellModel.validation; eventArgs.td = cellEle; eventArgs.isRefresh = true;
                    this.notify(addListValidationDropdown, eventArgs);
                }
            }
        }
        if (!valChange && cell.comment || cell.notes) {
            this.setUsedRange(range[0], range[1], sheet);
        }
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
     * This method is used to update the Range property in specified sheet index.
     *
     * @param {RangeModel} range - Specifies the range properties to update.
     * @param {number} [sheetIndex] - Specifies the sheet index to update the range. By default, it consider the active sheet index.
     * @returns {void} - To update a range properties.
     */
    public updateRange(range: RangeModel, sheetIndex: number = this.activeSheetIndex): void {
        const sheet: SheetModel = getSheet(this, sheetIndex);
        if (!sheet) {
            return;
        }
        if (!range.startCell) {
            range.startCell = 'A1';
        }
        if (range.showFieldAsHeader === undefined) {
            range.showFieldAsHeader = true;
        }
        if (range.template && !range.address) {
            range.address = range.startCell;
        }
        sheet.ranges.push(range);
        this.setSheetPropertyOnMute(sheet, 'ranges', sheet.ranges);
        if (range.dataSource) {
            this.notify(dataSourceChanged, { sheetIdx: sheetIndex, rangeIdx: sheet.ranges.length - 1, changedData: range.dataSource });
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
        wrapText(address, wrap, this, null, true);
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
        const promise: Promise<FilterEventArgs> = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        const filterArgs: { [key: string]: BeforeFilterEventArgs | Promise<FilterEventArgs> } = { args: eventArgs, promise: promise };
        this.notify(events.initiateFilter, filterArgs);
        return filterArgs.promise as Promise<FilterEventArgs>;
    }

    /**
     * To add custom library function.
     *
     * @param {string} functionHandler - Custom function handler name
     * @param {string} functionName - Custom function name
     * @param {string} formulaDescription - Specifies formula description.
     * {% codeBlock src='spreadsheet/addCustomFunction/index.md' %}{% endcodeBlock %}
     * @returns {void} - To add custom library function.
     */
    public addCustomFunction(functionHandler: string | Function, functionName?: string, formulaDescription?: string ): void {
        functionName = functionName ? functionName : typeof functionHandler === 'string' ? functionHandler :
            functionHandler.name.replace('bound ', '');
        const eventArgs: { [key: string]: Object } = {
            action: 'addCustomFunction',
            functionHandler: functionHandler,
            functionName: functionName,
            formulaDescription: formulaDescription
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
            const eventArgs: NumberFormatArgs = { formattedText: cell.value, value: cell.value, format: cell.format, cell: cell,
                skipFormatCheck: true };
            this.notify(events.getFormattedCellObject, eventArgs);
            return eventArgs.formattedText;
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
        if (!this.allowFreezePane || (model.frozenRows === row && model.frozenColumns === column)) {
            return;
        }
        this.setSheetPropertyOnMute(model, 'frozenRows', row);
        this.setSheetPropertyOnMute(model, 'frozenColumns', column);
        this.updateTopLeftCell();
        if (model.id === this.getActiveSheet().id && this.getModuleName() === 'spreadsheet') {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (<any>this).renderModule.refreshSheet();
        }
    }

    /**
     * This method is used to unfreeze the frozen rows and columns from the active sheet.
     *
     * @param {number | string} sheet - Specifies the sheet name or index in which the unfreeze operation will perform. By default,
     * active sheet will be considered.
     * {% codeBlock src='spreadsheet/unfreezePanes/index.md' %}{% endcodeBlock %}
     * @returns {void}
     * @deprecated This method is deprecated, use `unfreezePanes` method to unfreeze the frozen rows and columns.
     */
    public Unfreeze(sheet?: number | string): void {
        this.freezePanes(0, 0, sheet);
    }

    /**
     * This method is used to unfreeze the frozen rows and columns from spreadsheet.
     *
     * @param {number | string} sheet - Specifies the sheet name or index in which the unfreeze operation will perform. By default,
     * active sheet will be considered.
     * {% codeBlock src='spreadsheet/unfreezePanes/index.md' %}{% endcodeBlock %}
     * @returns {void}
     */
    public unfreezePanes(sheet?: number | string): void {
        this.freezePanes(0, 0, sheet);
    }

    /**
     * The `calculateNow` method is used to calculate any uncalculated formulas in a spreadsheet.
     * This method accepts an option to specify whether the calculation should be performed for the entire workbook or a specific sheet.
     *
     * @param {string} scope - Specifies the scope of the calculation. Acceptable values are `Sheet` or `Workbook`.
     * If not provided, the default scope is `Sheet`.
     * * `Sheet`: Calculates formulas only on the current sheet or a specified sheet.
     * * `Workbook`: Calculates formulas across the entire workbook.
     * @param {number | string} sheet - The index or name of the sheet to calculate if the scope is set to `Sheet`.
     * If not provided and the scope is `Sheet`, the current active sheet will be used.
     * @returns {Promise<void>} - A promise that resolves when the calculation is complete.
     * The promise does not return a specific value, but it can be used to perform actions after the calculation has finished.
     */
    public calculateNow(scope?: string, sheet?: number | string): Promise<void> {
        let sheets: SheetModel[];
        if (scope === 'Workbook' && this.calculationMode === 'Manual') {
            scope = 'CalculateWorkbook';
            this.setProperties({ calculationMode: 'Automatic' }, true);
        }
        if (scope === 'Workbook' || scope === 'CalculateWorkbook') {
            sheets = this.sheets;
        } else {
            if (typeof sheet === 'string') {
                sheet = getSheetIndex(this, sheet);
            } else {
                sheet = isNullOrUndefined(sheet) ? this.activeSheetIndex : sheet;
            }
            sheets = [getSheet(this, <number>sheet)];
        }
        const calcArgs: { action: string, scope: string, sheets: SheetModel[], promise: Promise<void> } = { action: 'calculateNow',
            scope: scope, sheets: sheets, promise: new Promise((resolve: Function) => { resolve((() => { /** */ })()); }) };
        this.notify(events.workbookFormulaOperation, calcArgs);
        return calcArgs.promise;
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
            if (isNullOrUndefined(top)  || top < 0) { top = sheet.frozenRows ? 0 : indexes[0]; }
            if (isNullOrUndefined(left)  || left < 0) { left = sheet.frozenColumns ? 0 : indexes[1]; }
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
        sheet[`${prop}`] = value;
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
     * @param {boolean} isRangeFormula - Specifies is range formula or not.
     * @param {number} rowIndex - Specifies the row index of the cell that contains the formula which is going to be refreshed.
     * @param {number} colIndex - Specifies the column index of the cell that contains the formula which is going to be refreshed.
     * @param {boolean} isAbsoluteRef - Specifies is the range used in the formula is Absolute reference or not.
     * @param {boolean} isSingleRangeRef - Specifies whether the formula as single range reference or not.
     * @returns {boolean} - It return `true`, if the insert / delete action happens between the provided range, otherwise `false`.
     * @hidden
     */
    public updateRangeOnInsertDelete(
        args: InsertDeleteEventArgs,
        index: number[],
        isRangeFormula?: boolean,
        rowIndex?: number,
        colIndex?: number,
        isAbsoluteRef?: boolean,
        isSingleRangeRef?: boolean
    ): boolean {
        let diff: number; let updated: boolean = false;
        if (args.isInsert) {
            diff = (args.endIndex - args.startIndex) + 1;
            if (args.modelType === 'Row') {
                if (args.forceUpdate) {
                    index[0] += 1; index[2] += 1;
                    updated = true;
                } else {
                    const isRangeRefresh: boolean = !isAbsoluteRef && isSingleRangeRef
                        && index[2] === args.startIndex - 1 && rowIndex === args.startIndex && index[1] === index[3];
                    if (args.startIndex <= index[0]) {
                        index[0] += diff; updated = true;
                    }
                    if (args.startIndex <= index[2] || (isRangeFormula && args.startIndex === index[2] + 1 && isRangeRefresh)) {
                        index[2] += diff; updated = true;
                    }
                }
            } else {
                if (args.forceUpdate) {
                    index[1] += 1; index[3] += 1;
                    updated = true;
                } else {
                    const isRangeRefresh: boolean = !isAbsoluteRef && isSingleRangeRef
                        && index[3] === args.startIndex - 1 && colIndex === args.startIndex && index[0] === index[2];
                    if (args.startIndex <= index[1]) {
                        index[1] += diff; updated = true;
                    }
                    if (args.startIndex <= index[3] || (isRangeFormula && args.startIndex === index[3] + 1 && isRangeRefresh)) {
                        index[3] += diff; updated = true;
                    }
                }
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

    /**
     * @param {number} rowIndex - Specifies the row index.
     * @param {number} colIndex - Specifies the column index.
     * @param {HTMLTableRowElement} row - Specifies the row.
     * @returns {HTMLElement} - returns cell element.
     * @hidden
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getCell(rowIndex: number, colIndex: number, row?: HTMLTableRowElement): HTMLElement {
        return null;
    }

    /**
     * Used in calculate to compute integer value of date
     *
     * @param {Date} date - Specifies the date value.
     * @param {boolean} isTime -Specifies is Time or not.
     * @returns {number} - Returns integer value of date.
     */
    private dateToInt(date: Date, isTime: boolean): number {
        return dateToInt(date, isTime);
    }

    /**
     * Used to update format from calculate.
     *
     * @param {number} sheetId - Specifies the sheetId.
     * @param {number} rowIndex - Specifies the row index.
     * @param {number} colIndex - Specifies the col index.
     * @returns {void} - Update format from calculate.
     */
    private setDateFormat(sheetId: number, rowIndex: number, colIndex: number): void {
        const sheet: SheetModel = getSheet(this, getSheetIndexFromId(this, sheetId));
        const formatType: string = getCell(rowIndex, colIndex, sheet, null, true).format;
        if (!formatType || formatType === 'General') {
            setCell(rowIndex, colIndex, sheet, { format: getFormatFromType('ShortDate') }, true);
        }
    }
}
