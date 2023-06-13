import { Worksheets } from './worksheets';
import { Worksheet, FreezePane, MergeCell, MergeCells, HyperLink, Grouping } from './worksheet';
import { CellStyle, Font, Border, Borders, CellXfs, Alignment, NumFmt, CellStyleXfs, CellStyles } from './cell-style';
import { Column } from './column';
import { Row, Rows } from './row';
import { Image } from './image';
import { Cell, Cells } from './cell';
import { ZipArchive, ZipArchiveItem } from '@syncfusion/ej2-compression';
import { SaveType, BlobSaveType } from './enum';
import { CsvHelper } from './csv-helper';
import { Internationalization, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BlobHelper } from './blob-helper';
import { AutoFilters } from './auto-filters';
/**
 * Workbook class
 */
export class Workbook {
    private mArchive: ZipArchive;
    private sharedString: string[];
    private sharedStringCount: number = 0;
    public cellStyles: Map<string, CellStyles>;
    public mergedCellsStyle: Map<string, { x: number, y: number, styleIndex: number }>;
    private worksheets: Worksheets;
    private builtInProperties: BuiltInProperties;
    private mFonts: Font[];
    private mBorders: Borders[];
    private mFills: Map<string, number>;
    private mNumFmt: Map<string, NumFmt>;
    private mStyles: CellStyle[];
    private mCellXfs: CellXfs[];
    private mCellStyleXfs: CellStyleXfs[];
    private mergeCells: MergeCells;
    private csvHelper: CsvHelper;
    private mSaveType: SaveType;
    private mHyperLinks: HyperLink[];
    private unitsProportions: number[] = [
        96 / 75.0,          // Display
        96 / 300.0,         // Document
        96,               // Inch
        96 / 25.4,       // Millimeter
        96 / 2.54,       // Centimeter
        1,                            // Pixel
        96 / 72.0,          // Point
        96 / 72.0 / 12700,  // EMU
    ];
    /* tslint:disable:no-any */
    private hyperlinkStyle: any = { fontColor: '#0000FF', underline: true };
    private printTitles: Map<number, string>;
    private culture: string;
    private currency: string;
    private intl: Internationalization;
    private globalStyles: Map<string, any>;
    private rgbColors: Map<string, string>;
    private drawingCount: number;
    private imageCount: number;
    /* tslint:disable:no-any */
    public constructor(json: any, saveType: SaveType, culture?: string, currencyString?: string, separator?: string) {
        if (culture !== undefined) {
            this.culture = culture;
        } else {
            this.culture = 'en-US';
        }
        if (currencyString !== undefined) {
            this.currency = currencyString;
        } else {
            this.currency = 'USD';
        }
        this.intl = new Internationalization(this.culture);
        this.mSaveType = saveType;
        if (saveType === 'xlsx') {
            this.mArchive = new ZipArchive();
            this.sharedString = [];
            this.mFonts = [];
            this.mBorders = [];
            this.mStyles = [];
            this.printTitles = new Map<number, string>();
            this.cellStyles = new Map<string, CellStyles>();
            this.mNumFmt = new Map<string, NumFmt>();
            this.mFills = new Map<string, number>();
            this.mStyles.push(new CellStyle());
            this.mFonts.push(new Font());
            /* tslint:disable */
            this.cellStyles.set('Normal', new CellStyles());
            /* tslint:enable */
            this.mCellXfs = [];
            this.mCellStyleXfs = [];
            this.drawingCount = 0;
            this.imageCount = 0;

            if (json.styles !== null && json.styles !== undefined) {
                /* tslint:disable-next-line:no-any */
                this.globalStyles = new Map<string, any>();
                for (let i: number = 0; i < json.styles.length; i++) {
                    if (json.styles[i].name !== undefined) {
                        if (!this.cellStyles.has(json.styles[i].name)) {
                            let cellStyle: CellStyle = new CellStyle();
                            cellStyle.isGlobalStyle = true;
                            this.parserCellStyle(json.styles[i], cellStyle, 'none');
                            let cellStylesIn: CellStyles = new CellStyles();
                            cellStylesIn.name = cellStyle.name;
                            cellStylesIn.xfId = (cellStyle.index - 1);
                            this.cellStyles.set(cellStylesIn.name, cellStylesIn);
                            /* tslint:disable-next-line:no-any */
                            let tFormat: any = {};
                            if (json.styles[i].numberFormat !== undefined) {
                                tFormat.format = json.styles[i].numberFormat;
                            }
                            if (json.styles[i].type !== undefined) {
                                tFormat.type = json.styles[i].type;
                            } else {
                                tFormat.type = 'datetime';
                            }
                            if (tFormat.format !== undefined) {
                                this.globalStyles.set(json.styles[i].name, tFormat);
                            }
                        } else {
                            throw Error('Style name ' + json.styles[i].name + ' is already existed');
                        }
                    }
                }
            }
            // Parses Worksheets data to DOM.        
            if (json.worksheets !== null && json.worksheets !== undefined) {
                this.parserWorksheets(json.worksheets);
            } else {
                throw Error('Worksheet is expected.');
            }

            // Parses the BuiltInProperties data to DOM.        
            if (json.builtInProperties !== null && json.builtInProperties !== undefined) {
                this.builtInProperties = new BuiltInProperties();
                this.parserBuiltInProperties(json.builtInProperties, this.builtInProperties);
            }
        } else {
            this.csvHelper = new CsvHelper(json, separator);
        }
    }
    /* tslint:disable:no-any */
    private parserBuiltInProperties(jsonBuiltInProperties: any, builtInProperties: BuiltInProperties): void {
        //Author
        if (jsonBuiltInProperties.author !== null && jsonBuiltInProperties.author !== undefined) {
            builtInProperties.author = jsonBuiltInProperties.author;
        }
        //Comments
        if (jsonBuiltInProperties.comments !== null && jsonBuiltInProperties.comments !== undefined) {
            builtInProperties.comments = jsonBuiltInProperties.comments;
        }
        //Category
        if (jsonBuiltInProperties.category !== null && jsonBuiltInProperties.category !== undefined) {
            builtInProperties.category = jsonBuiltInProperties.category;
        }
        //Company
        if (jsonBuiltInProperties.company !== null && jsonBuiltInProperties.company !== undefined) {
            builtInProperties.company = jsonBuiltInProperties.company;
        }
        //Manager
        if (jsonBuiltInProperties.manager !== null && jsonBuiltInProperties.manager !== undefined) {
            builtInProperties.manager = jsonBuiltInProperties.manager;
        }
        //Subject
        if (jsonBuiltInProperties.subject !== null && jsonBuiltInProperties.subject !== undefined) {
            builtInProperties.subject = jsonBuiltInProperties.subject;
        }
        //Title
        if (jsonBuiltInProperties.title !== null && jsonBuiltInProperties.title !== undefined) {
            builtInProperties.title = jsonBuiltInProperties.title;
        }
        //Creation date
        if (jsonBuiltInProperties.createdDate !== null && jsonBuiltInProperties.createdDate !== undefined) {
            builtInProperties.createdDate = jsonBuiltInProperties.createdDate;
        }
        //Modified date
        if (jsonBuiltInProperties.modifiedDate !== null && jsonBuiltInProperties.modifiedDate !== undefined) {
            builtInProperties.modifiedDate = jsonBuiltInProperties.modifiedDate;
        }
        //Tags
        if (jsonBuiltInProperties.tags !== null && jsonBuiltInProperties.tags !== undefined) {
            builtInProperties.tags = jsonBuiltInProperties.tags;
        }
        //Status
        if (jsonBuiltInProperties.status !== null && jsonBuiltInProperties.status !== undefined) {
            builtInProperties.status = jsonBuiltInProperties.status;
        }

    }
    /* tslint:disable:no-any */
    private parserWorksheets(json: any): void {
        this.worksheets = new Worksheets();
        let length: number = json.length;
        for (let i: number = 0; i < length; i++) {
            let jsonSheet: any = json[i];
            let sheet: Worksheet = new Worksheet();
            this.mergeCells = new MergeCells();
            this.mergedCellsStyle = new Map<string, { x: number, y: number, styleIndex: number }>();
            this.mHyperLinks = [];
            //Name
            if (jsonSheet.name !== null && jsonSheet.name !== undefined) {
                sheet.name = jsonSheet.name;
            } else {
                sheet.name = 'Sheet' + (i + 1).toString();
            }

            if (jsonSheet.enableRtl !== null && jsonSheet.enableRtl !== undefined) {
               sheet.enableRtl = jsonSheet.enableRtl;
            }
            sheet.index = (i + 1);

            //Columns
            if (jsonSheet.columns !== null && jsonSheet.columns !== undefined) {
                this.parserColumns(jsonSheet.columns, sheet);
            }
            //Rows
            if (jsonSheet.rows !== null && jsonSheet.rows !== undefined) {
                this.parserRows(jsonSheet.rows, sheet);
            }
            //showGridLines
            if (jsonSheet.showGridLines !== null && jsonSheet.showGridLines !== undefined) {
                sheet.showGridLines = jsonSheet.showGridLines;
            }
            //FreezePanes
            if (jsonSheet.freeze !== null && jsonSheet.freeze !== undefined) {
                this.parserFreezePanes(jsonSheet.freeze, sheet);
            }
            //Print Title
            if (jsonSheet.printTitle !== null && jsonSheet.printTitle !== undefined) {
                this.parserPrintTitle(jsonSheet.printTitle, sheet);
            }

            if (jsonSheet.pageSetup !== undefined) {
                if (jsonSheet.pageSetup.isSummaryRowBelow !== undefined) {
                    sheet.isSummaryRowBelow = jsonSheet.pageSetup.isSummaryRowBelow;
                }
            }

            if (jsonSheet.images !== undefined) {
                this.parserImages(jsonSheet.images, sheet);
            }
            if (jsonSheet.autoFilters !== null && jsonSheet.autoFilters !== undefined) {
                this.parseFilters(jsonSheet.autoFilters, sheet);
            }
            sheet.index = (i + 1);
            sheet.mergeCells = this.mergeCells;
            sheet.hyperLinks = this.mHyperLinks;
            this.worksheets.push(sheet);
        }
    }
    /* tslint:disable:no-any */
    private mergeOptions(fromJson: any, toJson: any): any {
        /* tslint:disable:no-any */
        let result: any = {};
        this.applyProperties(fromJson, result);
        this.applyProperties(toJson, result);
        return result;
    }
    /* tslint:disable:no-any */
    private applyProperties(sourceJson: any, destJson: any): void {
        let keys: any = Object.keys(sourceJson);
        for (let index: number = 0; index < keys.length; index++) {
            if (keys[index] !== 'name') {
                destJson[keys[index]] = sourceJson[keys[index]];
            }
        }
    }
    private getCellName(row: number, column: number): string {
        return this.getColumnName(column) + row.toString();
    }
    private getColumnName(col: number): string {
        col--;
        let strColumnName: string = '';
        do {
            let iCurrentDigit: number = col % 26;
            col = col / 26 - 1;
            strColumnName = String.fromCharCode(65 + iCurrentDigit) + strColumnName;
        }
        while (col >= 0);
        return strColumnName;
    }
    /* tslint:disable:no-any */
    private parserPrintTitle(json: any, sheet: Worksheet): void {
        let printTitleName: string = '';
        let titleRowName: string;
        if (json.fromRow !== null && json.fromRow !== undefined) {
            let fromRow: number = json.fromRow;
            let toRow: number;
            if (json.toRow !== null && json.toRow !== undefined) {
                toRow = json.toRow;
            } else {
                toRow = json.fromRow;
            }
            titleRowName = '$' + fromRow + ':$' + toRow;
        }
        let titleColName: string;
        if (json.fromColumn !== null && json.fromColumn !== undefined) {
            let fromColumn: number = json.fromColumn;
            let toColumn: number;
            if (json.toColumn !== null && json.toColumn !== undefined) {
                toColumn = json.toColumn;
            } else {
                toColumn = json.fromColumn;
            }
            titleColName = '$' + this.getColumnName(fromColumn) + ':$' + this.getColumnName(toColumn);
        }

        if (titleRowName !== undefined) {
            printTitleName += (sheet.name + '!' + titleRowName);
        }
        if (titleColName !== undefined && titleRowName !== undefined) {
            printTitleName += ',' + (sheet.name + '!' + titleColName);
        } else if (titleColName !== undefined) {
            printTitleName += (sheet.name + '!' + titleColName);
        }
        if (printTitleName !== '') {
            this.printTitles.set(sheet.index - 1, printTitleName);
        }

    }
    /* tslint:disable:no-any */
    private parserFreezePanes(json: any, sheet: Worksheet): void {
        sheet.freezePanes = new FreezePane();

        if (json.row !== null && json.row !== undefined) {
            sheet.freezePanes.row = json.row;
        } else {
            sheet.freezePanes.row = 0;
        }
        if (json.column !== null && json.column !== undefined) {
            sheet.freezePanes.column = json.column;
        } else {
            sheet.freezePanes.column = 0;
        }
        sheet.freezePanes.leftCell = this.getCellName(sheet.freezePanes.row + 1, sheet.freezePanes.column + 1);

    }
    /* tslint:disable:no-any */
    private parserColumns(json: any, sheet: Worksheet): void {
        let columnsLength: number = json.length;

        sheet.columns = [];

        for (let column: number = 0; column < columnsLength; column++) {
            let col: Column = new Column();
            if (json[column].index !== null && json[column].index !== undefined) {
                col.index = json[column].index;
            } else {
                throw Error('Column index is missing.');
            }
            if (json[column].width !== null && json[column].width !== undefined) {
                col.width = json[column].width;
            }

            sheet.columns.push(col);
        }
    }
    /* tslint:disable:no-any */
    private parserRows(json: any, sheet: Worksheet): void {
        let rowsLength: number = json.length;

        sheet.rows = new Rows();
        let rowId: number = 0;
        for (let r: number = 0; r < rowsLength; r++) {
            let row: Row = this.parserRow(json[r], rowId);
            rowId = row.index;
            sheet.rows.add(row);
        }
        this.insertMergedCellsStyle(sheet);
    }
    private insertMergedCellsStyle(sheet: Worksheet): void {
        if (this.mergeCells.length > 0) {
            this.mergedCellsStyle.forEach((value: { x: number, y: number, styleIndex: number }, key: string) => {
                let row: Row = sheet.rows.filter((item: Row) => {
                    return item.index === value.y;
                })[0];
                if (!isNullOrUndefined(row)) {
                    let cell: Cell = row.cells.filter((item: Cell) => {
                        return item.index === value.x;
                    })[0];
                    if (!isNullOrUndefined(cell)) {
                        cell.styleIndex = value.styleIndex;
                    } else {
                        let cells: Cell[] = row.cells.filter((item: Cell) => {
                            return item.index <= value.x;
                        });
                        let insertIndex: number = 0;
                        if (cells.length > 0) {
                            insertIndex = row.cells.indexOf(cells[cells.length - 1]) + 1;
                        }
                        row.cells.splice(insertIndex, 0, this.createCell(value, key));
                    }
                } else {
                    let rows: Row[] = sheet.rows.filter((item: Row) => {
                        return item.index <= value.y;
                    });
                    let rowToInsert: Row = new Row();
                    rowToInsert.index = value.y;
                    rowToInsert.cells = new Cells();
                    rowToInsert.cells.add(this.createCell(value, key));
                    let insertIndex: number = 0;
                    if (rows.length > 0) {
                        insertIndex = sheet.rows.indexOf(rows[rows.length - 1]) + 1;
                    }
                    sheet.rows.splice(insertIndex, 0, rowToInsert);
                }
            });
        }
    }
    private createCell(value: { x: number, y: number, styleIndex: number }, key: string): Cell {
        let cellToInsert: Cell = new Cell();
        cellToInsert.refName = key;
        cellToInsert.index = value.x;
        cellToInsert.cellStyle = new CellStyle();
        cellToInsert.styleIndex = value.styleIndex;
        return cellToInsert;
    }
    /* tslint:disable:no-any */
    private parserRow(json: any, rowIndex: number): Row {
        let row: Row = new Row();
        //Row Height
        if (json.height !== null && json.height !== undefined) {
            row.height = json.height;
        }

        //Row index
        if (json.index !== null && json.index !== undefined) {
            row.index = json.index;
        } else {
            throw Error('Row index is missing.');
        }
        if (json.grouping !== null && json.grouping !== undefined) {
            this.parseGrouping(json.grouping, row);
        }
        this.parseCells(json.cells, row);

        return row;
    }
    /* tslint:disable:no-any */
    private parseGrouping(json: any, row: Row): void {
        row.grouping = new Grouping();

        if (json.outlineLevel !== undefined) {

            row.grouping.outlineLevel = json.outlineLevel;
        }
        if (json.isCollapsed !== undefined) {
            row.grouping.isCollapsed = json.isCollapsed;

        }
        if (json.isHidden !== undefined) {
            row.grouping.isHidden = json.isHidden;
        }
    }
    /* tslint:disable:no-any */
    private parseCells(json: any, row: Row): void {
        row.cells = new Cells();
        let cellsLength: number = json !== undefined ? json.length : 0;
        let spanMin: number = 1;
        let spanMax: number = 1;
        let curCellIndex: number = 0;
        for (let cellId: number = 0; cellId < cellsLength; cellId++) {
            /* tslint:disable:no-any */
            let jsonCell: any = json[cellId];
            let cell: Cell = new Cell();

            //cell index
            if (jsonCell.index !== null && jsonCell.index !== undefined) {
                cell.index = jsonCell.index;
            } else {
                throw Error('Cell index is missing.');
            }

            if (cell.index < spanMin) {
                spanMin = cell.index;
            } else if (cell.index > spanMax) {
                spanMax = cell.index;
            }

            //Update the Cell name
            cell.refName = this.getCellName(row.index, cell.index);

            //Row span
            if (jsonCell.rowSpan !== null && jsonCell.rowSpan !== undefined) {
                cell.rowSpan = jsonCell.rowSpan - 1;
            } else {
                cell.rowSpan = 0;
            }
            //Column span
            if (jsonCell.colSpan !== null && jsonCell.colSpan !== undefined) {
                cell.colSpan = jsonCell.colSpan - 1;
            } else {
                cell.colSpan = 0;
            }

            //Hyperlink
            if (jsonCell.hyperlink !== null && jsonCell.hyperlink !== undefined) {
                let hyperLink: HyperLink = new HyperLink();
                if (jsonCell.hyperlink.target !== undefined) {
                    hyperLink.target = jsonCell.hyperlink.target;
                    if (jsonCell.hyperlink.displayText !== undefined) {
                        cell.value = jsonCell.hyperlink.displayText;
                    } else {
                        cell.value = jsonCell.hyperlink.target;
                    }
                    cell.type = this.getCellValueType(cell.value);
                    hyperLink.ref = cell.refName;
                    hyperLink.rId = (this.mHyperLinks.length + 1);
                    this.mHyperLinks.push(hyperLink);
                    cell.cellStyle = new CellStyle();
                    /* tslint:disable-next-line:max-line-length */
                    this.parserCellStyle((jsonCell.style !== undefined ? this.mergeOptions(jsonCell.style, this.hyperlinkStyle) : this.hyperlinkStyle), cell.cellStyle, 'string');
                    cell.styleIndex = cell.cellStyle.index;
                }

            }
            // formulas
            if (jsonCell.formula !== null && jsonCell.formula !== undefined) {
                cell.formula = jsonCell.formula;
                cell.type = 'formula';
            }
            //Cell value
            if (jsonCell.value !== null && jsonCell.value !== undefined) {
                if (cell.formula !== undefined) {
                cell.value = 0;
            } else {
                cell.value = jsonCell.value;
                cell.type = this.getCellValueType(cell.value);
            }
        }
            if (jsonCell.style !== null && jsonCell.style !== undefined && cell.styleIndex === undefined) {
                cell.cellStyle = new CellStyle();
                if (cell.value instanceof Date) {
                    this.parserCellStyle(jsonCell.style, cell.cellStyle, cell.type, 14);
                } else {
                    this.parserCellStyle(jsonCell.style, cell.cellStyle, cell.type);
                }
                cell.styleIndex = cell.cellStyle.index;
            } else if (cell.value instanceof Date) {
                cell.cellStyle = new CellStyle();
                this.parserCellStyle({}, cell.cellStyle, cell.type, 14);
                cell.styleIndex = cell.cellStyle.index;
            }

            this.parseCellType(cell);
            this.mergeCells = this.processMergeCells(cell, row.index, this.mergeCells);

            row.cells.add(cell);
            curCellIndex = (cell.index + 1);
        }
        row.spans = (spanMin) + ':' + (spanMax);
    }
    private GetColors(): Map<string, string> {
        let colors: Map<string, string>;
        colors = new Map<string, string>();
        /* tslint:disable */
        colors.set('WHITE', 'FFFFFFFF');
        /* tslint:disable */
        colors.set('SILVER', 'FFC0C0C0');
        /* tslint:disable */
        colors.set('GRAY', 'FF808080');
        /* tslint:disable */
        colors.set('BLACK', 'FF000000');
        /* tslint:disable */
        colors.set('RED', 'FFFF0000');
        /* tslint:disable */
        colors.set('MAROON', 'FF800000');
        /* tslint:disable */
        colors.set('YELLOW', 'FFFFFF00');
        /* tslint:disable */
        colors.set('OLIVE', 'FF808000');
        /* tslint:disable */
        colors.set('LIME', 'FF00FF00');
        /* tslint:disable */
        colors.set('GREEN', 'FF008000');
        /* tslint:disable */
        colors.set('AQUA', 'FF00FFFF');
        /* tslint:disable */
        colors.set('TEAL', 'FF008080');
        /* tslint:disable */
        colors.set('BLUE', 'FF0000FF');
        /* tslint:disable */
        colors.set('NAVY', 'FF000080');
        /* tslint:disable */
        colors.set('FUCHSIA', 'FFFF00FF');
        /* tslint:disable */
        colors.set('PURPLE', 'FF800080');
        return colors;
    }
    private processColor(colorVal: string): string {
        if (colorVal.indexOf('#') === 0) {
           return colorVal.replace('#', 'FF');
        }
        colorVal = colorVal.toUpperCase();
        this.rgbColors = this.GetColors();
        if (this.rgbColors.has(colorVal)) {
          colorVal = this.rgbColors.get(colorVal);
        } else {
          colorVal = 'FF000000';
        }
        return colorVal;
    }
    private processCellValue(value: string, cell: Cell): string {
        let cellValue : string = value;
        if(value.indexOf("<font") !== -1 || value.indexOf("<a") !== -1 || value.indexOf("<b>") !== -1 || 
        value.indexOf("<i>") !== -1 || value.indexOf("<u>") !== -1 ){
        let processedVal: string = '';
        let startindex: number = value.indexOf('<', 0);
        let endIndex: number = value.indexOf('>', startindex + 1);
        if (startindex >= 0 && endIndex >= 0) {
        if (startindex !== 0) {
            processedVal += '<r><t xml:space="preserve">' + this.processString(value.substring(0, startindex)) + '</t></r>';
        }        
        while (startindex >= 0 && endIndex >= 0 ) {
           endIndex = value.indexOf('>', startindex + 1);
           if (endIndex >= 0) {
           let subString: string = value.substring(startindex + 1, endIndex);

           startindex = value.indexOf('<', endIndex + 1);
            if (startindex < 0) {
               startindex = cellValue.length;
            }
           let text = cellValue.substring(endIndex + 1, startindex);
           if(text.length !== 0) {
           let subSplit: string[]  = subString.split(' ');
           if (subSplit.length > 0) {
              processedVal += '<r><rPr>';
           }
           if (subSplit.length > 1) {
                for (let element of subSplit) {
                    let start: string = element.trim().substring(0,5);
                    switch (start) {
                        case 'size=':
                            processedVal += '<sz val="' + element.substring(6, element.length - 1) + '"/>';
                            break;
                        case 'face=' :
                            processedVal += '<rFont val="' + element.substring(6, element.length - 1) + '"/>';
                            break;
                        case 'color':
                            processedVal += '<color rgb="' + this.processColor(element.substring(7, element.length - 1)) + '"/>';
                            break;
                        case 'href=':
                            let hyperLink: HyperLink = new HyperLink();
                            hyperLink.target = element.substring(6, element.length - 1).trim();
                            hyperLink.ref = cell.refName;
                            hyperLink.rId = (this.mHyperLinks.length + 1);                      
                            this.mHyperLinks.push(hyperLink);
                            processedVal += '<color rgb="FF0000FF"/><u/><b/>';
                            break;
                    }
                }
           } else if (subSplit.length === 1) {
               let style: string = subSplit[0].trim();
               switch (style){
                case 'b':
                  processedVal += '<b/>';
                  break;
                case 'i':
                  processedVal += '<i/>';
                  break;
                case 'u':
                  processedVal += '<u/>';
                  break;                
                }
            }                     
             processedVal += '</rPr><t xml:space="preserve">' + this.processString(text) + '</t></r>';
           }               
         }            
        }
        if (processedVal === '') {
           return cellValue;
        }
        return processedVal;
    } else {
        return cellValue;
    }
    }else
    {
        return cellValue;
    }
    }
    private applyGlobalStyle(json: any, cellStyle: CellStyle): void {
        let index: number = 0;
        if (this.cellStyles.has(json.name)) {
            cellStyle.index = this.mStyles.filter((a: CellStyle) => (a.name === json.name))[0].index;
            cellStyle.name = json.name;
        }
    }
    /* tslint:disable:no-any */
    private parserCellStyle(json: any, cellStyle: CellStyle, cellType: string): void;
    /* tslint:disable:no-any */
    private parserCellStyle(json: any, cellStyle: CellStyle, cellType: string, defStyleIndex: number): void;
    /* tslint:disable:no-any */
    private parserCellStyle(json: any, cellStyle: CellStyle, cellType: string, defStyleIndex?: number): void {
        //name
        if (json.name !== null && json.name !== undefined) {
            if (cellStyle.isGlobalStyle) {
                cellStyle.name = json.name;
            } else {
                this.applyGlobalStyle(json, cellStyle);
                return;
            }


        }
        //background color
        if (json.backColor !== null && json.backColor !== undefined) {
            cellStyle.backColor = json.backColor;
        }
        //borders
        //leftBorder
        cellStyle.borders = new Borders();
        //AllBorder
        if (json.borders !== null && json.borders !== undefined) {
            this.parserBorder(json.borders, cellStyle.borders.all);
        }
        //leftborder
        if (json.leftBorder !== null && json.leftBorder !== undefined) {
            this.parserBorder(json.leftBorder, cellStyle.borders.left);
        }
        //rightBorder
        if (json.rightBorder !== null && json.rightBorder !== undefined) {
            this.parserBorder(json.rightBorder, cellStyle.borders.right);
        }
        //topBorder
        if (json.topBorder !== null && json.topBorder !== undefined) {
            this.parserBorder(json.topBorder, cellStyle.borders.top);
        }
        //bottomBorder
        if (json.bottomBorder !== null && json.bottomBorder !== undefined) {
            this.parserBorder(json.bottomBorder, cellStyle.borders.bottom);
        }
        //fontName
        if (json.fontName !== null && json.fontName !== undefined) {
            cellStyle.fontName = json.fontName;
        }
        //fontSize
        if (json.fontSize !== null && json.fontSize !== undefined) {
            cellStyle.fontSize = json.fontSize;
        }
        //fontColor
        if (json.fontColor !== null && json.fontColor !== undefined) {
            cellStyle.fontColor = json.fontColor;
        }
        //italic
        if (json.italic !== null && json.italic !== undefined) {
            cellStyle.italic = json.italic;
        }
        //bold
        if (json.bold !== null && json.bold !== undefined) {
            cellStyle.bold = json.bold;
        }
        //hAlign
        if (json.hAlign !== null && json.hAlign !== undefined) {
            cellStyle.hAlign = json.hAlign.toLowerCase();
        }
        //indent
        if (json.indent !== null && json.indent !== undefined) {
            cellStyle.indent = json.indent;
            if (!(cellStyle.hAlign === 'left' || cellStyle.hAlign === 'right')) {
                cellStyle.hAlign = 'left';
            }
        }
        if (json.rotation !== null && json.rotation !== undefined) {
            cellStyle.rotation = json.rotation;
        }
        //vAlign
        if (json.vAlign !== null && json.vAlign !== undefined) {
            cellStyle.vAlign = json.vAlign.toLowerCase();
        }
        //underline
        if (json.underline !== null && json.underline !== undefined) {
            cellStyle.underline = json.underline;
        }
        //strikeThrough
        if (json.strikeThrough !== null && json.strikeThrough !== undefined) {
            cellStyle.strikeThrough = json.strikeThrough;
        }
        //wrapText
        if (json.wrapText !== null && json.wrapText !== undefined) {
            cellStyle.wrapText = json.wrapText;
        }
        //numberFormat
        if (json.numberFormat !== null && json.numberFormat !== undefined) {
            if (json.type !== null && json.type !== undefined) {
                cellStyle.numberFormat = this.getNumberFormat(json.numberFormat, json.type);
            } else {
                cellStyle.numberFormat = this.getNumberFormat(json.numberFormat, cellType);
            }
        } else if (defStyleIndex !== undefined) {
            cellStyle.numFmtId = 14;
            cellStyle.numberFormat = 'GENERAL';
        } else {
            cellStyle.numberFormat = 'GENERAL';
        }
        cellStyle.index = this.processCellStyle(cellStyle);
    }
    private switchNumberFormat(numberFormat: string, type: string): void {
        let format: string = this.getNumberFormat(numberFormat, type);
        if (format !== numberFormat) {
            let numFmt: NumFmt = this.mNumFmt.get(numberFormat);
            if (numFmt !== undefined) {
                numFmt.formatCode = format;
                if (this.mNumFmt.has(format)) {
                    for (let cellStyleXfs of this.mCellStyleXfs) {
                        if (cellStyleXfs.numFmtId === numFmt.numFmtId) {
                            cellStyleXfs.numFmtId = this.mNumFmt.get(format).numFmtId;
                        }
                    }
                    for (let cellXfs of this.mCellXfs) {
                        if (cellXfs.numFmtId === numFmt.numFmtId) {
                            cellXfs.numFmtId = this.mNumFmt.get(format).numFmtId;
                        }
                    }
                }
            }

        }
    }
    private changeNumberFormats(value: any): any {
        if (typeof value == "string") {
            const regex = new RegExp(this.currency, 'g');
            value = value.replace(regex, '[$' + this.currency + ']');
        }
        else if (typeof value == "object") {
            for (var i = 0; i < value.length; i++) {
                value[i] = value[i].replace(this.currency, '[$'+this.currency+']');
            }
        }
        return value;
    }
    private getNumberFormat(numberFormat: string, type: string): string {
        let returnFormat: string;
        switch (type) {
            case 'number':
                try {
                    returnFormat = this.intl.getNumberPattern({ format: numberFormat, currency: this.currency, useGrouping: true }, true);
                    if(this.currency.length >1){
                        returnFormat = this.changeNumberFormats(returnFormat);
                    }
                } catch (error) {
                    returnFormat = numberFormat;
                }
                break;
            case 'datetime':
                try {
                    returnFormat = this.intl.getDatePattern({ skeleton: numberFormat, type: 'dateTime' }, true);
                } catch (error) {
                    try {
                        returnFormat = this.intl.getDatePattern({ format: numberFormat, type: 'dateTime' }, true);
                    } catch (error) {
                        returnFormat = numberFormat;
                    }
                }
                break;
            case 'date':
                try {
                    returnFormat = this.intl.getDatePattern({ skeleton: numberFormat, type: 'date' }, true);
                } catch (error) {
                    try {
                        returnFormat = this.intl.getDatePattern({ format: numberFormat, type: 'date' }, true);
                    } catch (error) {
                        returnFormat = numberFormat;
                    }
                }
                break;
            case 'time':
                try {
                    returnFormat = this.intl.getDatePattern({ skeleton: numberFormat, type: 'time' }, true);
                } catch (error) {
                    try {
                        returnFormat = this.intl.getDatePattern({ format: numberFormat, type: 'time' }, true);
                    } catch (error) {
                        returnFormat = numberFormat;
                    }
                }
                break;
            default:
                returnFormat = numberFormat;
                break;
        }
        return returnFormat;
    }
    /* tslint:disable:no-any */
    private parserBorder(json: any, border: Border): void {
        if (json.color !== null && json.color !== undefined) {
            border.color = json.color;
        } else {
            border.color = '#000000';
        }

        if (json.lineStyle !== null && json.lineStyle !== undefined) {
            border.lineStyle = json.lineStyle;
        } else {
            border.lineStyle = 'thin';
        }
    }
    private processCellStyle(style: CellStyle): number {
        if (style.isGlobalStyle) {
            this.processNumFormatId(style);
            this.mStyles.push(style);
            return this.mStyles.length;
        } else {
            let compareResult: { index: number, result: boolean } = this.compareStyle(style);
            if (!compareResult.result) {
                this.processNumFormatId(style);
                this.mStyles.push(style);
                return this.mStyles.length;

            } else {
                //Return the index of the already existing style.
                return compareResult.index;
            }
        }
    }
    private processNumFormatId(style: CellStyle): void {
        if (style.numberFormat !== 'GENERAL' && !this.mNumFmt.has(style.numberFormat)) {
            let id: number = this.mNumFmt.size + 164;
            this.mNumFmt.set(style.numberFormat, new NumFmt(id, style.numberFormat));
        }
    }
    private isNewFont(toCompareStyle: CellStyle): { index: number, result: boolean } {
        let result: boolean = false;
        let index: number = 0;
        for (let font of this.mFonts) {
            index++;
            let fontColor: string = undefined;
            if (toCompareStyle.fontColor !== undefined) {
                fontColor = ('FF' + toCompareStyle.fontColor.replace('#', ''));

            }
            result = font.color === fontColor &&
                font.b === toCompareStyle.bold &&
                font.i === toCompareStyle.italic &&
                font.u === toCompareStyle.underline &&
                font.strike === toCompareStyle.strikeThrough &&
                font.name === toCompareStyle.fontName &&
                font.sz === toCompareStyle.fontSize;
            if (result) {
                break;
            }
        }
        index = index - 1;
        return { index, result };
    }
    private isNewBorder(toCompareStyle: CellStyle): boolean {
        let bStyle: CellStyle = new CellStyle();
        if (this.isAllBorder(toCompareStyle.borders)) {
            return (bStyle.borders.all.color === toCompareStyle.borders.all.color &&
                bStyle.borders.all.lineStyle === toCompareStyle.borders.all.lineStyle);
        } else {
            return (bStyle.borders.left.color === toCompareStyle.borders.left.color &&
                bStyle.borders.left.lineStyle === toCompareStyle.borders.left.lineStyle &&
                bStyle.borders.right.color === toCompareStyle.borders.right.color &&
                bStyle.borders.right.lineStyle === toCompareStyle.borders.right.lineStyle &&
                bStyle.borders.top.color === toCompareStyle.borders.top.color &&
                bStyle.borders.top.lineStyle === toCompareStyle.borders.top.lineStyle &&
                bStyle.borders.bottom.color === toCompareStyle.borders.bottom.color &&
                bStyle.borders.bottom.lineStyle === toCompareStyle.borders.bottom.lineStyle);
        }
    }
    private isAllBorder(toCompareBorder: Borders): boolean {
        let allBorderStyle: CellStyle = new CellStyle();
        return allBorderStyle.borders.all.color !== toCompareBorder.all.color &&
            allBorderStyle.borders.all.lineStyle !== toCompareBorder.all.lineStyle;
    }
    private compareStyle(toCompareStyle: CellStyle): { index: number, result: boolean } {
        let result: boolean = true;
        let index: number = 0;
        let globalStyleIndex: number = 0;
        for (let baseStyle of this.mStyles) {
            result = baseStyle.isGlobalStyle ? false : (baseStyle.backColor === toCompareStyle.backColor &&
                baseStyle.bold === toCompareStyle.bold &&
                baseStyle.numFmtId === toCompareStyle.numFmtId &&
                baseStyle.numberFormat === toCompareStyle.numberFormat &&
                baseStyle.type === toCompareStyle.type &&
                baseStyle.fontColor === toCompareStyle.fontColor &&
                baseStyle.fontName === toCompareStyle.fontName &&
                baseStyle.fontSize === toCompareStyle.fontSize &&
                baseStyle.hAlign === toCompareStyle.hAlign &&
                baseStyle.italic === toCompareStyle.italic &&
                baseStyle.underline === toCompareStyle.underline &&
                baseStyle.strikeThrough === toCompareStyle.strikeThrough &&
                baseStyle.vAlign === toCompareStyle.vAlign &&
                baseStyle.indent === toCompareStyle.indent &&
                baseStyle.rotation === toCompareStyle.rotation &&
                baseStyle.wrapText === toCompareStyle.wrapText &&
                (baseStyle.borders.all.color === toCompareStyle.borders.all.color &&
                    baseStyle.borders.all.lineStyle === toCompareStyle.borders.all.lineStyle) &&
                (baseStyle.borders.left.color === toCompareStyle.borders.left.color &&
                    baseStyle.borders.left.lineStyle === toCompareStyle.borders.left.lineStyle &&
                    baseStyle.borders.right.color === toCompareStyle.borders.right.color &&
                    baseStyle.borders.right.lineStyle === toCompareStyle.borders.right.lineStyle &&
                    baseStyle.borders.top.color === toCompareStyle.borders.top.color &&
                    baseStyle.borders.top.lineStyle === toCompareStyle.borders.top.lineStyle &&
                    baseStyle.borders.bottom.color === toCompareStyle.borders.bottom.color &&
                    baseStyle.borders.bottom.lineStyle === toCompareStyle.borders.bottom.lineStyle));
            if (result) {
                index = baseStyle.index;
                break;
            }
        }
        return { index, result };
    }
    private contains(array: string[], item: string): boolean {
        let index: number = array.indexOf(item);
        return index > -1 && index < array.length;
    }
    private getCellValueType(value: any): string {
        if (value instanceof Date) {
            return 'datetime';
        } else if (typeof (value) === 'boolean') {
            return 'boolean';
        } else if (typeof (value) === 'number') {
            return 'number';
        } else {
            return 'string';
        }
    }
    private parseCellType(cell: Cell): void {
        let type: string = cell.type;
        let saveType: string;
        let value: any = cell.value;
        switch (type) {
            case 'datetime':
                value = this.toOADate(value);
                if (cell.cellStyle !== undefined && cell.cellStyle.name !== undefined) {
                    if (this.globalStyles.has(cell.cellStyle.name)) {
                        let value: any = this.globalStyles.get(cell.cellStyle.name);
                        this.switchNumberFormat(value.format, value.type);
                    }
                }
                saveType = 'n';
                break;
            //TODO: Update the number format index and style
            case 'boolean':
                value = value ? 1 : 0;
                saveType = 'b';
                break;
            case 'number':
                saveType = 'n';
                if (cell.cellStyle !== undefined && cell.cellStyle.name !== undefined) {
                    if (this.globalStyles.has(cell.cellStyle.name)) {
                        this.switchNumberFormat(this.globalStyles.get(cell.cellStyle.name).format, 'number');
                    }
                }
                break;
            case 'string':
                this.sharedStringCount++;
                saveType = 's';
                let sstvalue = this.processCellValue(value, cell);
                if (!this.contains(this.sharedString, sstvalue)) {
                    this.sharedString.push(sstvalue);
                }
                value = this.sharedString.indexOf(sstvalue);
                break;
            default:
                break;
        }
        cell.saveType = saveType;
        cell.value = value;
    }
    private parserImages(json: any, sheet: Worksheet): void {
        let imagesLength: number = json.length;

        sheet.images = [];
        let imageId: number = 0;
        for (let p: number = 0; p < imagesLength; p++) {
            let image: Image = this.parserImage(json[p]);
            sheet.images.push(image);
        }
    }
    private parseFilters(json: any, sheet: Worksheet): void {
        sheet.autoFilters = new AutoFilters();
        if (json.row !== null && json.row !== undefined)
           sheet.autoFilters.row = json.row; 
        else
           throw new Error('Argument Null Exception: row null or empty');
        if (json.lastRow !== null && json.lastRow !== undefined)
           sheet.autoFilters.lastRow = json.lastRow;
        else
           throw new Error('Argument Null Exception: lastRow cannot be null or empty');
        if (json.column !== null && json.column !== undefined)
           sheet.autoFilters.column = json.column;
        else
           throw new Error('Argument Null Exception: column cannot be null or empty');
        if (json.lastColumn !== null && json.row !== undefined)
           sheet.autoFilters.lastColumn = json.lastColumn;
        else
           throw new Error('Argument Null Exception: lastColumn cannot be null or empty');

    }
    private parserImage(json: any): Image {
        let image: Image = new Image();

        if (json.image !== null && json.image !== undefined) {
            image.image = json.image;
        }
        if (json.row !== null && json.row !== undefined) {
            image.row = json.row;
        }
        if (json.column !== null && json.column !== undefined) {
            image.column = json.column;
        }
        if (json.lastRow !== null && json.lastRow !== undefined) {
            image.lastRow = json.lastRow;
        }
        if (json.lastColumn !== null && json.lastColumn !== undefined) {
            image.lastColumn = json.lastColumn;
        }
        if (json.width !== null && json.width !== undefined) {
            image.width = json.width;
        }
        if (json.height !== null && json.height !== undefined) {
            image.height = json.height;
        }
        if (json.horizontalFlip !== null && json.horizontalFlip !== undefined) {
            image.horizontalFlip = json.horizontalFlip;
        }
        if (json.verticalFlip !== null && json.verticalFlip !== undefined) {
            image.verticalFlip = json.verticalFlip;
        }
        if (json.rotation !== null && json.rotation !== undefined) {
            image.rotation = json.rotation;
        }
        return image;
    }
    public saveAsBlob(blobSaveType: BlobSaveType): Promise<{ blobData: Blob }> {
        switch (blobSaveType) {
            case 'text/csv':
                return new Promise((resolve: Function, reject: Function) => {
                    let obj: any = {};
                    obj.blobData = this.csvHelper.saveAsBlob();
                    resolve(obj);
                });
            default:
                return new Promise((resolve: Function, reject: Function) => {
                    this.saveInternal();
                    this.mArchive.saveAsBlob().then((blob: Blob) => {
                        let obj: any = {};
                        obj.blobData = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        resolve(obj);
                    });
                });
        }
    }

    public save(fileName: string, proxyUrl?: string): void {
        if (fileName === null || fileName === undefined || fileName === '') {
            throw new Error('Argument Null Exception: fileName cannot be null or empty');
        }
        let xlsxMatch: RegExpMatchArray = fileName.match('.xlsx$');
        let csvMatch: RegExpMatchArray = fileName.match('.csv$');
        if (xlsxMatch !== null && xlsxMatch[0] === ('.' + this.mSaveType)) {
            this.saveInternal();
            this.mArchive.save(fileName).then(() => {
                this.mArchive.destroy();
            });
        } else if (csvMatch !== null && csvMatch[0] === ('.' + this.mSaveType)) {
            this.csvHelper.save(fileName);
        } else {
            throw Error('Save type and file extension is different.');
        }

    }
    private saveInternal(): void {
        this.saveWorkbook();
        this.saveWorksheets();
        this.saveSharedString();
        this.saveStyles();
        this.saveApp(this.builtInProperties);
        this.saveCore(this.builtInProperties);
        this.saveContentType();
        this.saveTopLevelRelation();
        this.saveWorkbookRelation();
    }
    private saveWorkbook(): void {
        /* tslint:disable-next-line:max-line-length */
        let workbookTemp: string = '<?xml version="1.0" encoding="utf-8"?><workbook xmlns:r = "http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns= "http://schemas.openxmlformats.org/spreadsheetml/2006/main"><workbookPr codeName="ThisWorkbook" defaultThemeVersion= "153222"/><bookViews><workbookView activeTab="0"/></bookViews>';
        let sheets: string = '<sheets>';
        let length: number = this.worksheets.length;
        for (let i: number = 0; i < length; i++) {
            /* tslint:disable-next-line:max-line-length */
            let sheetName= this.worksheets[i].name;
            sheetName= sheetName.replace("&", "&amp;");
            sheetName= sheetName.replace("<", "&lt;");
            sheetName= sheetName.replace(">", "&gt;");
            sheetName= sheetName.replace("\"", "&quot;");
            sheets += '<sheet name="' + sheetName + '" sheetId="' + (i + 1).toString() + '" r:id ="rId' + (i + 1).toString() + '" />';
        }
        sheets += '</sheets>';
        workbookTemp += sheets;
        if (this.printTitles.size > 0) {
            let printTitle: string = '<definedNames>';
            this.printTitles.forEach((value: string, key: number) => {
                printTitle += '<definedName name="_xlnm.Print_Titles" localSheetId="' + key + '">' + value + '</definedName>';
            });
            printTitle += '</definedNames>';
            workbookTemp += printTitle;
        }

        this.addToArchive(workbookTemp + '</workbook>', 'xl/workbook.xml');
    }
    private saveWorksheets(): void {
        let length: number = this.worksheets.length;
        for (let i: number = 0; i < length; i++) {
            this.saveWorksheet(this.worksheets[i], i);
        }
    }
    private saveWorksheet(sheet: Worksheet, index: number): void {
        let sheetBlob: BlobHelper = new BlobHelper();
        /* tslint:disable-next-line:max-line-length */
        let sheetString: string = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';

        if (!sheet.isSummaryRowBelow) {
            sheetString += ('<sheetPr>' + '<outlinePr ' + 'summaryBelow="0" >' + '</outlinePr>' + '</sheetPr>');
        } else {
            sheetString += ('<sheetPr />');
        }

        sheetString += this.saveSheetView(sheet);

        if (sheet.columns !== undefined) {
            let colString: string = '<cols>';
            for (let column of sheet.columns) {
                /* tslint:disable-next-line:max-line-length */
                if (column.width !== undefined) {
                    colString += '<col min="' + (column.index) + '" max="' + (column.index) + '" width="' + this.pixelsToColumnWidth(column.width) + '" customWidth="1" />';
                } else {
                    colString += '<col min="' + (column.index) + '" max="' + (column.index) + '" width="' + '8.43' + '" customWidth="1" />';
                }
            }
            sheetString += (colString + '</cols>');
        }
        sheetString += ('<sheetData>');
        sheetBlob.append(sheetString);
        sheetString = '';
        if (sheet.rows !== undefined) {
            for (let row of sheet.rows) {

                let rowString: string = '<row r="' + (row.index) + '" ';
                if (!isNullOrUndefined(row.spans)) {
                    rowString += 'spans="' + row.spans + '" ';
                }
                if (row.height !== undefined) {
                    rowString += ('ht="' + this.pixelsToRowHeight(row.height) + '" customHeight="1" ');
                }
                if (row.grouping !== undefined) {
                    if (row.grouping.isHidden) {
                        rowString += ('hidden="1" ');
                    }
                    if (row.grouping.outlineLevel !== undefined) {
                        rowString += ('outlineLevel="' + row.grouping.outlineLevel + '" ');
                    }
                    if (row.grouping.isCollapsed) {
                        rowString += ('collapsed="1" ');
                    }
                }
                rowString += ('>');

                for (let cell of row.cells) {
                    if (cell !== undefined && (cell.value !== undefined || cell.cellStyle !== undefined)) {
                        rowString += ('<c r="' + cell.refName + '" ');
                        if (cell.saveType !== undefined) {
                            rowString += ('t="' + cell.saveType + '" ');
                        }
                        if (cell.styleIndex !== undefined) {
                            rowString += ('s="' + cell.styleIndex + '" ');
                        }
                        rowString += (' >');
                        if (cell.formula !== undefined) {
                            rowString += ('<f>' + cell.formula + '</f>');
                        }
                        if (cell.value !== undefined) {
                            rowString += ('<v>' + cell.value + '</v></c>');
                        } else {
                            rowString += ('</c>');
                        }
                    }
                }
                rowString += ('</row>');
                sheetBlob.append(rowString);
            }
        }
        sheetString += ('</sheetData>');
        /* tslint:disable-next-line:max-line-length */
        if(sheet.autoFilters !== null && sheet.autoFilters !== undefined)
           sheetString += ('<autoFilter ref="' + this.getCellName(sheet.autoFilters.row,sheet.autoFilters.column) + ':' + this.getCellName(sheet.autoFilters.lastRow,sheet.autoFilters.lastColumn) + '"/>');
        if (sheet.mergeCells.length > 0) {
            sheetString += ('<mergeCells count="' + sheet.mergeCells.length + '">');
            for (let mCell of sheet.mergeCells) {
                sheetString += ('<mergeCell ref="' + mCell.ref + '" />');
            }
            sheetString += ('</mergeCells>');
        }
        if (sheet.hyperLinks.length > 0) {
            sheetString += ('<hyperlinks>');
            for (let hLink of sheet.hyperLinks) {
                sheetString += ('<hyperlink ref="' + hLink.ref + '" r:id="rId' + hLink.rId + '" />');
            }
            sheetString += ('</hyperlinks>');
        }
        /* tslint:disable-next-line:max-line-length */
        sheetString += ('<pageMargins left="0.75" right="0.75" top="1" bottom="1" header="0.5" footer="0.5" /><headerFooter scaleWithDoc="1" alignWithMargins="0" differentFirst="0" differentOddEven="0" />');
        if(sheet.images != undefined && sheet.images.length > 0){
            this.drawingCount++;
            this.saveDrawings(sheet, sheet.index);
            sheetString += '<drawing r:id="rId'+ (sheet.hyperLinks.length + 1) + '"/>';
        }
        this.addToArchive(this.saveSheetRelations(sheet), ('xl/worksheets/_rels/sheet' + sheet.index + '.xml.rels'));
        sheetBlob.append(sheetString+'</worksheet>');
        this.addToArchive(sheetBlob.getBlob(), 'xl/worksheets' + '/sheet' + (index + 1) + '.xml');
    }
    private saveDrawings(sheet: Worksheet, index: number): void {
        let drawings: BlobHelper = new BlobHelper();
        /* tslint:disable-next-line:max-line-length */
        let sheetDrawingString: string = '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">';
        if (sheet.images !== undefined) {
            let imgId: number = 0;
            for (let pic of sheet.images) {
            if(pic.height !== undefined && pic.width !== undefined){
            this.updatelastRowOffset(sheet, pic);
            this.updatelastColumnOffSet(sheet, pic);
            pic.lastRow -= 1;
            pic.lastColumn -= 1;
            }else if(pic.lastRow !== undefined && pic.lastColumn !== undefined)
            {
                pic.lastRowOffset = 0;
                pic.lastColOffset = 0;
            }
            imgId++;
            sheetDrawingString += '<xdr:twoCellAnchor editAs="oneCell">';
            sheetDrawingString += '<xdr:from><xdr:col>';
            //col
            sheetDrawingString += pic.column - 1;
            sheetDrawingString += '</xdr:col><xdr:colOff>';
            //colOff
            sheetDrawingString += 0;
            sheetDrawingString += '</xdr:colOff><xdr:row>';
            //row
            sheetDrawingString += pic.row - 1;
            sheetDrawingString += '</xdr:row><xdr:rowOff>';
            //rowOff
            sheetDrawingString += 0;
            sheetDrawingString += '</xdr:rowOff></xdr:from>';

            sheetDrawingString += '<xdr:to><xdr:col>';
            //col
            sheetDrawingString += pic.lastColumn;
            sheetDrawingString += '</xdr:col><xdr:colOff>';
            
            //colOff
            sheetDrawingString += pic.lastColOffset;
            sheetDrawingString += '</xdr:colOff><xdr:row>';
            //row
            sheetDrawingString += pic.lastRow;
            sheetDrawingString += '</xdr:row><xdr:rowOff>';
            //rowOff
            sheetDrawingString += pic.lastRowOffset;
            sheetDrawingString += '</xdr:rowOff></xdr:to>';

            sheetDrawingString += '<xdr:pic>';
            sheetDrawingString += '<xdr:nvPicPr>';
            sheetDrawingString += '<xdr:cNvPr id="' + imgId + '" name="Picture ' + imgId + '"> </xdr:cNvPr>';
            sheetDrawingString += '<xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr> </xdr:nvPicPr>';
            sheetDrawingString += '<xdr:blipFill>';
            /* tslint:disable-next-line:max-line-length */
            sheetDrawingString += '<a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId'+ imgId + '" cstate="print">';
            sheetDrawingString += '</a:blip><a:stretch><a:fillRect /></a:stretch></xdr:blipFill>';
            sheetDrawingString +=  '<xdr:spPr>';
            sheetDrawingString += '<a:xfrm';
            if (pic.rotation != undefined && pic.rotation <= 3600 && pic.rotation >= -3600) {
              sheetDrawingString +=' rot="' + (pic.rotation * 60000) + '"';
            }
            if (pic.verticalFlip != undefined && pic.verticalFlip != false)
            {
                sheetDrawingString += ' flipV="1"';
            }
            if (pic.horizontalFlip != undefined && pic.horizontalFlip != false)
            {
                sheetDrawingString += ' flipH="1"';
            }  
            sheetDrawingString +=  '/>';
            sheetDrawingString += '<a:prstGeom prst="rect"><a:avLst /></a:prstGeom></xdr:spPr>';
            sheetDrawingString += '</xdr:pic><xdr:clientData /></xdr:twoCellAnchor>';            
            let imageFile: BlobHelper = new BlobHelper();
            let imageData:Blob = this.convertBase64toImage(pic.image);
            this.imageCount += 1;
            this.addToArchive(imageData, 'xl/media/image' + this.imageCount  + '.png');
            }
            drawings.append(sheetDrawingString);
            drawings.append('</xdr:wsDr>');
            this.saveDrawingRelations(sheet);
            this.addToArchive(drawings.getBlob(), 'xl/drawings/drawing'+ this.drawingCount +'.xml');
        }
    }
    private updatelastRowOffset(sheet : Worksheet, picture: Image) : void{
        let iCurHeight = picture.height;
        let iCurRow = picture.row;
        let iCurOffset = 0;
  
        while( iCurHeight >= 0 )
        {
            let iRowHeight = 0;
            if(sheet.rows !== undefined && sheet.rows[iCurRow - 1] !== undefined)
            iRowHeight = this.convertToPixels(sheet.rows[iCurRow - 1].height === undefined? 15: sheet.rows[iCurRow - 1].height);
            else
            iRowHeight = this.convertToPixels(15);
          let iSpaceInCell = iRowHeight - (iCurOffset * iRowHeight / 256);
  
          if( iSpaceInCell > iCurHeight )
          {
            picture.lastRow = iCurRow;
            picture.lastRowOffset = iCurOffset + (iCurHeight * 256 / iRowHeight);
            let rowHiddenHeight = 0;
            if(sheet.rows !== undefined && sheet.rows[iCurRow - 1] !== undefined)
            rowHiddenHeight = this.convertToPixels(sheet.rows[iCurRow - 1].height === undefined ? 15 :sheet.rows[iCurRow - 1].height );
            else
            rowHiddenHeight = this.convertToPixels(15);

            picture.lastRowOffset = (rowHiddenHeight *  picture.lastRowOffset)/256;
            picture.lastRowOffset = Math.round(picture.lastRowOffset / this.unitsProportions[7]);
            break;
          }
          else
          {
            iCurHeight -= iSpaceInCell;
            iCurRow++;
            iCurOffset = 0;
          }
        }
    }
    private updatelastColumnOffSet(sheet : Worksheet, picture: Image) : void{
        let iCurWidth = picture.width;
        let iCurCol = picture.column;
        let iCurOffset = 0;
  
        while( iCurWidth >= 0 )
        {
            let iColWidth = 0;
            if(sheet.columns !== undefined && sheet.columns[iCurCol - 1] !== undefined)
            iColWidth = this.ColumnWidthToPixels(sheet.columns[iCurCol - 1].width === undefined ? 8.43 :sheet.columns[iCurCol - 1].width );
            else
            iColWidth = this.ColumnWidthToPixels(8.43);
          let iSpaceInCell = iColWidth - (iCurOffset * iColWidth / 1024);
  
          if( iSpaceInCell > iCurWidth )
          {
            picture.lastColumn = iCurCol;
            picture.lastColOffset = iCurOffset + (iCurWidth * 1024 / iColWidth);
            let colHiddenWidth = 0;
            if(sheet.columns !== undefined && sheet.columns[iCurCol - 1] !== undefined)
            colHiddenWidth = this.ColumnWidthToPixels(sheet.columns[iCurCol - 1].width === undefined ? 8.43 :sheet.columns[iCurCol - 1].width );
            else
            colHiddenWidth = this.ColumnWidthToPixels(8.43);

            picture.lastColOffset = (colHiddenWidth *  picture.lastColOffset)/1024;
            picture.lastColOffset = Math.round(picture.lastColOffset / this.unitsProportions[7]);

            break;
          }
          else
          {
            iCurWidth -= iSpaceInCell;
            iCurCol++;
            iCurOffset = 0;
          }
        }
    }

    private convertToPixels(value: number): number{
        return value * this.unitsProportions[6];
    }  
    private convertBase64toImage(img: string) : Blob
    {
        const byteStr = window.atob(img);
        const buffer = new ArrayBuffer(byteStr.length);
        const data = new Uint8Array(buffer);
        for (let i = 0; i < byteStr.length; i++) {
            data[i] = byteStr.charCodeAt(i);
        }
        const blob = new Blob([data], { type: 'image/png' });    
         return blob;
    }
    private saveDrawingRelations(sheet: Worksheet)
    {
        /* tslint:disable-next-line:max-line-length */
        let drawingRelation: string = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        let length: number = sheet.images.length;
        let id: number = this.imageCount - sheet.images.length;
        for (let i: number = 1; i <= length; i++ ) {
            id++;
            /* tslint:disable-next-line:max-line-length */
            drawingRelation += '<Relationship Id="rId' + i + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image' + id + '.png" />';
        }

        this.addToArchive((drawingRelation + '</Relationships>'), 'xl/drawings/_rels/drawing'+ this.drawingCount +'.xml.rels');
    }
    private pixelsToColumnWidth(pixels: number): number {
        let dDigitWidth: number = 7;
        let val: number = (pixels > dDigitWidth + 5) ?
            this.trunc((pixels - 5) / dDigitWidth * 100 + 0.5) / 100 :
            pixels / (dDigitWidth + 5);
        return (val > 1) ?
            ((val * dDigitWidth + 5) / dDigitWidth * 256.0) / 256.0 :
            (val * (dDigitWidth + 5) / dDigitWidth * 256.0) / 256.0;
    }
    private ColumnWidthToPixels(val: number): number {
        let dDigitWidth: number = 7;
        let fileWidth = (val > 1) ?
        ((val * dDigitWidth + 5) / dDigitWidth * 256.0) / 256.0 :
        (val * (dDigitWidth + 5) / dDigitWidth * 256.0) / 256.0;
        return  this.trunc( ( ( 256 * fileWidth + this.trunc( 128 / dDigitWidth ) ) / 256 ) * dDigitWidth );
    }

    private trunc(x: number): number {
        let n: number = x - x % 1;
        return n === 0 && (x < 0 || (x === 0 && (1 / x !== 1 / 0))) ? -0 : n;
    }

    private pixelsToRowHeight(pixels: number): number {
        return (pixels * this.unitsProportions[5] / this.unitsProportions[6]);
    }
    private saveSheetRelations(sheet: Worksheet): string {
        /* tslint:disable-next-line:max-line-length */
        let relStr: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        for (let hLink of sheet.hyperLinks) {
            /* tslint:disable-next-line:max-line-length */
            relStr += '<Relationship Id="rId' + hLink.rId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="' + this.processString(hLink.target) + '" TargetMode="External" />';
        }
        if(sheet.images != undefined && sheet.images.length > 0)
        {
            /* tslint:disable-next-line:max-line-length */
            relStr +=  '<Relationship Id="rId'+ (sheet.hyperLinks.length + 1) +'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing'+ this.drawingCount +'.xml" />'
        }
        relStr += '</Relationships>';
        return relStr;
    }
    private saveSheetView(sheet: Worksheet): string {
        let paneString: string = '<sheetViews><sheetView workbookViewId="0" ';
        if(sheet.enableRtl === true)
        {
            paneString += 'rightToLeft="1"';
        }
        if (sheet.showGridLines === false) {
            paneString += 'showGridLines="0" >';
        } else {
            paneString += '>';
        }
        if (sheet.freezePanes !== undefined) {
            paneString += '<pane state="frozen"' +
                ' topLeftCell="' + sheet.freezePanes.leftCell + '" ';
            if (sheet.freezePanes.row !== 0) {
                paneString += 'ySplit="' + sheet.freezePanes.row + '" ';
            }
            if (sheet.freezePanes.column !== 0) {
                paneString += 'xSplit="' + sheet.freezePanes.column + '" ';
            }
            paneString += '/>';
        }
        paneString += '</sheetView></sheetViews > ';
        return paneString;
    }
    private saveSharedString(): void {
        let length: number = this.sharedString.length;
        if (length > 0) {
            /* tslint:disable-next-line:max-line-length */
            let sstStart: string = '<?xml version="1.0" encoding="utf-8"?><sst uniqueCount="' + length + '" count="' + this.sharedStringCount + '" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
            let si: string = '';
            for (let i: number = 0; i < length; i++) {
                if (this.sharedString[i].indexOf('<r>') !== 0) {
                 si += '<si><t>';
                 si += this.processString(this.sharedString[i]);
                 si += '</t></si>';
                } else {
                 si += '<si>';
                 si += this.sharedString[i];
                 si += '</si>';
                }
            }
            si += '</sst>';
            this.addToArchive(sstStart + si, 'xl/sharedStrings.xml');
        }
    }
    private processString(value: string|string[]): string|string[] {
        if (typeof value == "string") {
            if (value.indexOf('&') !== -1) {
                value = value.replace(/&/g, '&amp;');
            }
            if (value.indexOf('<') !== -1) {
                value = value.replace(/</g, '&lt;');
            }
            if (value.indexOf('>') !== -1) {
                value = value.replace(/>/g, '&gt;');
            }
            if (value.indexOf('\v') !== -1) {
                value = value.replace(/\v/g, '_x000B_');
            }
        }
        else if (typeof value == "object") {
            for (var i = 0; i < value.length; i++) {
                if (value[i].indexOf('&') !== -1) {
                    value[i] = value[i].replace(/&/g, '&amp;');
                }
                if (value[i].indexOf('<') !== -1) {
                    value[i] = value[i].replace(/</g, '&lt;');
                }
                if (value[i].indexOf('>') !== -1) {
                    value[i] = value[i].replace(/>/g, '&gt;');
                }
                if (value[i].indexOf('\v') !== -1) {
                    value[i] = value[i].replace(/\v/g, '_x000B_');
                }
            }
        }
        return value;
    }
    private saveStyles(): void {
        this.updateCellXfsStyleXfs();
        /* tslint:disable-next-line:max-line-length */
        let styleTemp: string = '<?xml version="1.0" encoding="utf-8"?><styleSheet xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
        styleTemp += this.saveNumberFormats();
        styleTemp += this.saveFonts();
        styleTemp += this.saveFills();
        styleTemp += this.saveBorders();
        styleTemp += this.saveCellStyleXfs();
        styleTemp += this.saveCellXfs();
        styleTemp += this.saveCellStyles();
        this.addToArchive(styleTemp + '</styleSheet>', 'xl/styles.xml');
    }
    private updateCellXfsStyleXfs(): void {
        for (let style of this.mStyles) {
            let cellXfs: any = undefined;
            if (style.isGlobalStyle) {
                cellXfs = new CellStyleXfs();
                cellXfs.xfId = (style.index - 1);
            } else {
                cellXfs = new CellXfs();
                cellXfs.xfId = 0;
            }

            //Add font
            let compareFontResult: { index: number, result: boolean } = this.isNewFont(style);
            if (!compareFontResult.result) {
                let font: Font = new Font();
                font.b = style.bold;
                font.i = style.italic;
                font.name = style.fontName;
                font.sz = style.fontSize;
                font.u = style.underline;
                font.strike = style.strikeThrough;
                font.color = ('FF' + style.fontColor.replace('#', ''));
                this.mFonts.push(font);
                cellXfs.fontId = this.mFonts.length - 1;
            } else {
                cellXfs.fontId = compareFontResult.index;
            }
            //Add fill
            if (style.backColor !== 'none') {
                let backColor: string = 'FF' + style.backColor.replace('#', '');
                if (this.mFills.has(backColor)) {
                    let fillId: number = this.mFills.get(backColor);
                    cellXfs.fillId = fillId;
                } else {
                    let fillId: number = this.mFills.size + 2;
                    this.mFills.set(backColor, fillId);
                    cellXfs.fillId = (fillId);
                }

            } else {
                cellXfs.fillId = 0;
            }

            //Add border            
            if (!this.isNewBorder(style)) {
                this.mBorders.push(style.borders);
                cellXfs.borderId = this.mBorders.length;
            } else {
                cellXfs.borderId = 0;
            }


            //Add Number Format            

            if (style.numberFormat !== 'GENERAL') {
                if (this.mNumFmt.has(style.numberFormat)) {
                    let numFmt: NumFmt = this.mNumFmt.get(style.numberFormat);
                    cellXfs.numFmtId = numFmt.numFmtId;
                } else {
                    let id: number = this.mNumFmt.size + 164;
                    this.mNumFmt.set(style.numberFormat, new NumFmt(id, style.numberFormat));
                    cellXfs.numFmtId = id;
                }

            } else {
                if (style.numberFormat === 'GENERAL' && style.numFmtId === 14) {
                    cellXfs.numFmtId = 14;
                } else {
                    cellXfs.numFmtId = 0;
                }
            }


            //Add alignment            
            if (!style.isGlobalStyle) {
                cellXfs.applyAlignment = 1;
            }
            cellXfs.alignment = new Alignment();
            cellXfs.alignment.indent = style.indent;
            cellXfs.alignment.horizontal = style.hAlign;
            cellXfs.alignment.vertical = style.vAlign;
            cellXfs.alignment.wrapText = style.wrapText ? 1 : 0;
            cellXfs.alignment.rotation = style.rotation;


            if (style.isGlobalStyle) {
                this.mCellStyleXfs.push(cellXfs);
                this.mCellXfs.push(cellXfs);
            } else {
                //Add cellxfs
                this.mCellXfs.push(cellXfs);
            }
        }

    }
    private saveNumberFormats(): string {
        if (this.mNumFmt.size >= 1) {
            let numFmtStyle: string = '<numFmts count="' + (this.mNumFmt.size) + '">';
            this.mNumFmt.forEach((value: NumFmt, key: string) => {
                numFmtStyle += '<numFmt numFmtId="' + value.numFmtId + '" formatCode="' + value.formatCode.replace(/"/g, '&quot;') + '" />';
            });
            return (numFmtStyle += '</numFmts>');
        } else {
            return '';
        }
    }
    private saveFonts(): string {
        /* tslint:disable-next-line:max-line-length */
        let fontStyle: string = '<fonts count="' + (this.mFonts.length) + '">';
        if (this.mFonts.length >= 1) {
            for (let font of this.mFonts) {
                fontStyle += '<font>';
                if (font.b) {
                    fontStyle += '<b />';
                }
                if (font.i) {
                    fontStyle += '<i />';
                }
                if (font.u) {
                    fontStyle += '<u />';
                }
                if (font.strike) {
                    fontStyle += '<strike />';
                }
                fontStyle += '<sz val="' + font.sz + '" />';
                fontStyle += '<color rgb="' + font.color + '" />';
                fontStyle += '<name val="' + font.name + '" /></font>';
            }
        }
        return fontStyle + '</fonts>';
    }
    private saveFills(): string {
        /* tslint:disable-next-line:max-line-length */
        let fillsStyle: string = '<fills count="' + (this.mFills.size + 2) + '"><fill><patternFill patternType="none"></patternFill></fill><fill><patternFill patternType="gray125"></patternFill></fill>';
        if (this.mFills.size >= 1) {
            this.mFills.forEach((value: number, key: string) => {
                /* tslint:disable-next-line:max-line-length */
                fillsStyle += '<fill><patternFill patternType="solid"><fgColor rgb="' + key + '" /><bgColor rgb="FFFFFFFF" /></patternFill></fill>';
            });

        }
        return fillsStyle + '</fills>';
    }
    private saveBorders(): string {
        /* tslint:disable-next-line:max-line-length */
        let bordersStyle: string = '<borders count="' + (this.mBorders.length + 1) + '"><border><left /><right /><top /><bottom /><diagonal /></border>';
        if (this.mBorders.length >= 1) {
            for (let borders of this.mBorders) {
                if (this.isAllBorder(borders)) {
                    let color: string = borders.all.color.replace('#', '');
                    let lineStyle: string = borders.all.lineStyle;
                    /* tslint:disable-next-line:max-line-length */
                    bordersStyle += '<border><left style="' + lineStyle + '"><color rgb="FF' + color + '" /></left><right style="' + lineStyle + '"><color rgb="FF' + color + '" /></right><top style="' + lineStyle + '"><color rgb="FF' + color + '" /></top><bottom style="' + lineStyle + '"><color rgb="FF' + color + '" /></bottom></border>';
                } else {
                    /* tslint:disable-next-line:max-line-length */
                    bordersStyle += '<border><left style="' + borders.left.lineStyle + '"><color rgb="FF' + borders.left.color.replace('#', '') + '" /></left><right style="' + borders.right.lineStyle + '"><color rgb="FF' + borders.right.color.replace('#', '') + '" /></right><top style="' + borders.top.lineStyle + '"><color rgb="FF' + borders.top.color.replace('#', '') + '" /></top><bottom style="' + borders.bottom.lineStyle + '"><color rgb="FF' + borders.bottom.color.replace('#', '') + '" /></bottom></border>';
                }
            }
        }
        return bordersStyle + '</borders>';
    }
    private saveCellStyles(): string {
        let cellStyleString: string = '<cellStyles  count="' + (this.cellStyles.size) + '">';
        this.cellStyles.forEach((value: CellStyles, key: string) => {
            cellStyleString += '<cellStyle name="' + key + '" xfId="' + this.cellStyles.get(key).xfId + '"';
            if (key === 'Normal') {
                cellStyleString += ' builtinId="0"';
            }
            cellStyleString += ' />';
        });



        return cellStyleString += '</cellStyles>';
    }
    private saveCellStyleXfs(): string {
        /* tslint:disable-next-line:max-line-length */
        let cellXfsStyle: string = '<cellStyleXfs count="' + (this.mCellStyleXfs.length + 1) + '"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" />';
        if (this.mCellStyleXfs.length >= 1) {
            for (let cellStyleXf of this.mCellStyleXfs) {
                /* tslint:disable-next-line:max-line-length */
                cellXfsStyle += '<xf numFmtId="' + cellStyleXf.numFmtId + '" fontId="' + cellStyleXf.fontId + '" fillId="' + cellStyleXf.fillId + '" borderId="' + cellStyleXf.borderId + '" ';
                if (cellStyleXf.alignment !== undefined) {
                    cellXfsStyle += '>' + this.saveAlignment(cellStyleXf) + '</xf>';
                } else {
                    cellXfsStyle += ' />';
                }
            }
        }
        return cellXfsStyle + '</cellStyleXfs>';
    }
    private saveCellXfs(): string {
        /* tslint:disable-next-line:max-line-length */
        let cellXfsStyle: string = '<cellXfs count="' + (this.mCellXfs.length + 1) + '"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" />';
        if (this.mCellXfs.length >= 1) {
            for (let cellXf of this.mCellXfs) {
                /* tslint:disable-next-line:max-line-length */
                cellXfsStyle += '<xf numFmtId="' + cellXf.numFmtId + '" fontId="' + cellXf.fontId + '" fillId="' + cellXf.fillId + '" borderId="' + cellXf.borderId + '" xfId="' + cellXf.xfId + '" ';
                if (cellXf.applyAlignment === 1) {
                    cellXfsStyle += 'applyAlignment="1"';
                }
                cellXfsStyle += '>' + this.saveAlignment(cellXf) + '</xf>';
            }
        }
        return cellXfsStyle + '</cellXfs>';
    }
    private saveAlignment(cellXf: any): string {
        let alignString: string = '<alignment ';
        if (cellXf.alignment.horizontal !== undefined) {
            alignString += 'horizontal="' + cellXf.alignment.horizontal + '" ';
        }
        if (cellXf.alignment.indent !== undefined && cellXf.alignment.indent !== 0 ) {
            alignString += 'indent="' + cellXf.alignment.indent + '" ';
        }else if (cellXf.alignment.rotation !== undefined &&  cellXf.alignment.rotation !== 0 ) {
            alignString += 'textRotation="' + cellXf.alignment.rotation + '" ';
        }
        if (cellXf.alignment.vertical !== undefined) {
            alignString += 'vertical="' + cellXf.alignment.vertical + '" ';
        }
        alignString += 'wrapText="' + cellXf.alignment.wrapText + '" />';
        return alignString;
    }
    private saveApp(builtInProperties: BuiltInProperties): void {
        /* tslint:disable-next-line:max-line-length */
        let appString: string = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Essential XlsIO</Application>';
        if (builtInProperties !== undefined) {
            if (builtInProperties.manager !== undefined) {
                appString += '<Manager>' + builtInProperties.manager + '</Manager>';
            }
            if (builtInProperties.company !== undefined) {
                appString += '<Company>' + builtInProperties.company + '</Company>';
            }
        }
        this.addToArchive((appString + '</Properties>'), 'docProps/app.xml');
    }
    private saveCore(builtInProperties: BuiltInProperties): void {
        let createdDate: Date = new Date();
        /* tslint:disable-next-line:max-line-length */
        let coreString: string = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><cp:coreProperties xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties">';
        if (this.builtInProperties !== undefined) {
            if (builtInProperties.author !== undefined) {
                coreString += '<dc:creator>' + builtInProperties.author + '</dc:creator>';
            }
            if (builtInProperties.subject !== undefined) {
                coreString += '<dc:subject>' + builtInProperties.subject + '</dc:subject>';
            }
            if (builtInProperties.category !== undefined) {
                coreString += '<cp:category>' + builtInProperties.category + '</cp:category>';
            }
            if (builtInProperties.comments !== undefined) {
                coreString += '<dc:description>' + builtInProperties.comments + '</dc:description>';
            }
            if (builtInProperties.title !== undefined) {
                coreString += '<dc:title>' + builtInProperties.title + '</dc:title>';
            }
            if (builtInProperties.tags !== undefined) {
                coreString += '<cp:keywords>' + builtInProperties.tags + '</cp:keywords>';
            }
            if (builtInProperties.status !== undefined) {
                coreString += '<cp:contentStatus>' + builtInProperties.status + '</cp:contentStatus>';
            }
            if (builtInProperties.createdDate !== undefined) {
                /* tslint:disable-next-line:max-line-length */
                coreString += '<dcterms:created xsi:type="dcterms:W3CDTF">' + builtInProperties.createdDate.toISOString() + '</dcterms:created>';
            } else {
                coreString += '<dcterms:created xsi:type="dcterms:W3CDTF">' + createdDate.toISOString() + '</dcterms:created>';
            }
            if (builtInProperties.modifiedDate !== undefined) {
                /* tslint:disable-next-line:max-line-length */
                coreString += '<dcterms:modified xsi:type="dcterms:W3CDTF">' + builtInProperties.modifiedDate.toISOString() + '</dcterms:modified>';
            } else {
                coreString += '<dcterms:modified xsi:type="dcterms:W3CDTF">' + createdDate.toISOString() + '</dcterms:modified>';
            }
        } else {
            coreString += '<dcterms:created xsi:type="dcterms:W3CDTF">' + createdDate.toISOString() + '</dcterms:created>';
            coreString += '<dcterms:modified xsi:type="dcterms:W3CDTF">' + createdDate.toISOString() + '</dcterms:modified>';
        }
        /* tslint:disable-next-line:max-line-length */
        coreString += '</cp:coreProperties>';
        this.addToArchive(coreString, 'docProps/core.xml');
    }
    private saveTopLevelRelation(): void {
        /* tslint:disable-next-line:max-line-length */
        let topRelation: string = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml" /><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml" /><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml" /></Relationships>';
        this.addToArchive(topRelation, '_rels/.rels');
    }
    private saveWorkbookRelation(): void {
        /* tslint:disable-next-line:max-line-length */
        let wbRelation: string = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        let length: number = this.worksheets.length;
        let count: number = 0;
        for (let i: number = 0; i < length; i++ , count++) {
            /* tslint:disable-next-line:max-line-length */
            wbRelation += '<Relationship Id="rId' + (i + 1).toString() + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1).toString() + '.xml" />';
        }
        /* tslint:disable-next-line:max-line-length */
        wbRelation += '<Relationship Id="rId' + (++count).toString() + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml" />';
        if (this.sharedStringCount > 0) {
            /* tslint:disable-next-line:max-line-length */
            wbRelation += '<Relationship Id="rId' + (++count).toString() + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml" />';
        }
        this.addToArchive((wbRelation + '</Relationships>'), 'xl/_rels/workbook.xml.rels');
    }
    private saveContentType(): void {
        /* tslint:disable-next-line:max-line-length */
        let contentTypeString: string = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml" /><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" /><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml" /><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml" />';
        let sheetsOverride: string = '';
        let length: number = this.worksheets.length;
        let drawingIndex: number = 0;
        for (let i: number = 0; i < length; i++) {
            /* tslint:disable-next-line:max-line-length */
            sheetsOverride += '<Override PartName="/xl/worksheets/sheet' + (i + 1).toString() + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />';
            if(this.worksheets[i].images != undefined && this.worksheets[i].images.length > 0){
                drawingIndex++;
                /* tslint:disable-next-line:max-line-length */
                sheetsOverride += '<Override PartName="/xl/drawings/drawing' + (drawingIndex).toString() + '.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml" />';                
            }            
        }
        if(this.imageCount > 0)
          sheetsOverride += '<Default Extension="png" ContentType="image/png" />';
        if (this.sharedStringCount > 0) {
            /* tslint:disable-next-line:max-line-length */
            contentTypeString += '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" />';
        }
        this.addToArchive((contentTypeString + sheetsOverride + '</Types>'), '[Content_Types].xml');
    }
    private addToArchive(xmlString: string | Blob, itemName: string): void {
        if (typeof (xmlString) === 'string') {
            let blob: Blob = new Blob([xmlString], { type: 'text/plain' });
            let archiveItem: ZipArchiveItem = new ZipArchiveItem(blob, itemName);
            this.mArchive.addItem(archiveItem);
        } else {
            let archiveItem: ZipArchiveItem = new ZipArchiveItem(xmlString, itemName);
            this.mArchive.addItem(archiveItem);
        }

    }
    private processMergeCells(cell: Cell, rowIndex: number, mergeCells: MergeCells): MergeCells {
        if (cell.rowSpan !== 0 || cell.colSpan !== 0) {
            let mCell: MergeCell = new MergeCell();
            mCell.x = cell.index;
            mCell.width = cell.colSpan;
            mCell.y = rowIndex;
            mCell.height = cell.rowSpan;
            let startCell: string = this.getCellName(mCell.y, mCell.x);
            let endCell: string = this.getCellName(rowIndex + mCell.height, cell.index + mCell.width);
            mCell.ref = startCell + ':' + endCell;
            let mergedCell: MergeCell = mergeCells.add(mCell);
            let start: { x: number, y: number } = { x: mCell.x, y: mCell.y };
            let end: { x: number, y: number } = {
                x: (cell.index + mCell.width), y: (rowIndex + mCell.height)
            };
            this.updatedMergedCellStyles(start, end, cell);
        }
        return mergeCells;
    }
    private updatedMergedCellStyles(sCell: { x: number, y: number }, eCell: { x: number, y: number }, cell: Cell): void {
        for (let x: number = sCell.x; x <= eCell.x; x++) {
            for (let y: number = sCell.y; y <= eCell.y; y++) {
                this.mergedCellsStyle.set(this.getCellName(y, x), { x: x, y: y, styleIndex: cell.styleIndex });
            }
        }
    }
    /**
     * Returns the tick count corresponding to the given year, month, and day.
     * @param year number value of year
     * @param month number value of month
     * @param day number value of day
     */
    private dateToTicks(year: number, month: number, day: number): number {
        let ticksPerDay: number = 10000 * 1000 * 60 * 60 * 24;
        let daysToMonth365: number[] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
        let daysToMonth366: number[] = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
        if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) {
            let days: number[] = this.isLeapYear(year) ? daysToMonth366 : daysToMonth365;
            let y: number = year - 1;
            let n: number = y * 365 + ((y / 4) | 0) - ((y / 100) | 0) + ((y / 400) | 0) + days[month - 1] + day - 1;
            return n * ticksPerDay;
        }
        throw new Error('Not a valid date');
    }
    /**
     * Return the tick count corresponding to the given hour, minute, second. 
     * @param hour number value of hour
     * @param minute number value if minute
     * @param second number value of second
     */
    private timeToTicks(hour: number, minute: number, second: number): number {
        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) {
            let totalSeconds: number = hour * 3600 + minute * 60 + second;
            return totalSeconds * 10000 * 1000;
        }
        throw new Error('Not valid time');
    }
    /**
     * Checks if given year is a leap year.
     * @param year Year value.
     */
    public isLeapYear(year: number): boolean {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    /**
     * Converts `DateTime` to the equivalent OLE Automation date.
     */
    private toOADate(date: Date): number {
        let ticks: number = 0;
        /* tslint:disable-next-line:max-line-length */
        ticks = this.dateToTicks(date.getFullYear(), (date.getMonth() + 1), date.getDate()) + this.timeToTicks(date.getHours(), date.getMinutes(), date.getSeconds());
        if (ticks === 0) {
            return 0.0;
        }
        let ticksPerDay: number = 10000 * 1000 * 60 * 60 * 24;
        let daysTo1899: number = (((365 * 4 + 1) * 25 - 1) * 4 + 1) * 4 + ((365 * 4 + 1) * 25 - 1) * 3 - 367;
        let doubleDateOffset: number = daysTo1899 * ticksPerDay;

        let oaDateMinAsTicks: number = (((365 * 4 + 1) * 25 - 1) - 365) * ticksPerDay;
        if (ticks < oaDateMinAsTicks) {
            throw new Error('Arg_OleAutDateInvalid');
        }
        let millisPerDay: number = 1000 * 60 * 60 * 24;
        return ((ticks - doubleDateOffset) / 10000) / millisPerDay;
    }
}
/**
 * BuiltInProperties Class
 * @private
 */
export class BuiltInProperties {
    public author: string;
    public comments: string;
    public category: string;
    public company: string;
    public manager: string;
    public subject: string;
    public title: string;
    public createdDate: Date;
    public modifiedDate: Date;
    public tags: string;
    public status: string;
}
