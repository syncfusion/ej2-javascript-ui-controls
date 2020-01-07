import { ZipArchive, ZipArchiveItem } from '@syncfusion/ej2-compression';
import { Internationalization, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * CellStyle class
 * @private
 */
var CellStyle = /** @__PURE__ @class */ (function () {
    function CellStyle() {
        this.numFmtId = 0;
        this.backColor = 'none';
        this.fontName = 'Calibri';
        this.fontSize = 14;
        this.fontColor = '#000000';
        this.italic = false;
        this.bold = false;
        this.underline = false;
        this.wrapText = false;
        this.hAlign = 'general';
        this.vAlign = 'bottom';
        this.indent = 0;
        this.rotation = 0;
        this.numberFormat = 'GENERAL';
        this.type = 'datetime';
        this.borders = new Borders();
        this.isGlobalStyle = false;
    }
    return CellStyle;
}());
/**
 * Font Class
 * @private
 */
var Font = /** @__PURE__ @class */ (function () {
    function Font() {
        this.sz = 14;
        this.name = 'Calibri';
        this.u = false;
        this.b = false;
        this.i = false;
        this.color = 'FF000000';
    }
    return Font;
}());
/**
 * CellXfs class
 * @private
 */
var CellXfs = /** @__PURE__ @class */ (function () {
    function CellXfs() {
    }
    return CellXfs;
}());
/**
 * Alignment class
 * @private
 */
var Alignment = /** @__PURE__ @class */ (function () {
    function Alignment() {
    }
    return Alignment;
}());
/**
 * CellStyleXfs class
 * @private
 */
var CellStyleXfs = /** @__PURE__ @class */ (function () {
    function CellStyleXfs() {
    }
    return CellStyleXfs;
}());
/**
 * CellStyles class
 * @private
 */
var CellStyles = /** @__PURE__ @class */ (function () {
    function CellStyles() {
        this.name = 'Normal';
        this.xfId = 0;
    }
    return CellStyles;
}());
/**
 * NumFmt class
 * @private
 */
var NumFmt = /** @__PURE__ @class */ (function () {
    function NumFmt(id, code) {
        this.numFmtId = id;
        this.formatCode = code;
    }
    return NumFmt;
}());
/**
 * Border class
 * @private
 */
var Border = /** @__PURE__ @class */ (function () {
    function Border(mLine, mColor) {
        this.lineStyle = mLine;
        this.color = mColor;
    }
    return Border;
}());
/**
 * Borders class
 * @private
 */
var Borders = /** @__PURE__ @class */ (function () {
    function Borders() {
        this.left = new Border('none', '#FFFFFF');
        this.right = new Border('none', '#FFFFFF');
        this.top = new Border('none', '#FFFFFF');
        this.bottom = new Border('none', '#FFFFFF');
        this.all = new Border('none', '#FFFFFF');
    }
    return Borders;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Worksheet class
 * @private
 */
var Cell = /** @__PURE__ @class */ (function () {
    function Cell() {
    }
    return Cell;
}());
/**
 * Cells class
 * @private
 */
var Cells = /** @__PURE__ @class */ (function (_super) {
    __extends(Cells, _super);
    function Cells() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.add = function (cell) {
            var inserted = false;
            var count = 0;
            for (var _i = 0, _a = _this; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.index === cell.index) {
                    _this[count] = cell;
                    inserted = true;
                }
                count++;
            }
            if (!inserted) {
                _this.push(cell);
            }
        };
        return _this;
    }
    return Cells;
}(Array));

/**
 * Column class
 * @private
 */
var Column = /** @__PURE__ @class */ (function () {
    function Column() {
    }
    return Column;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Row class
 * @private
 */
var Row = /** @__PURE__ @class */ (function () {
    function Row() {
    }
    return Row;
}());
/**
 * Rows class
 * @private
 */
var Rows = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Rows, _super);
    function Rows() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.add = function (row) {
            var inserted = false;
            var count = 0;
            for (var _i = 0, _a = _this; _i < _a.length; _i++) {
                var r = _a[_i];
                if (r.index === row.index) {
                    _this[count] = row;
                    inserted = true;
                }
                count++;
            }
            if (!inserted) {
                _this.push(row);
            }
        };
        return _this;
    }
    return Rows;
}(Array));

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Worksheets class
 * @private
 */
var Worksheets = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Worksheets, _super);
    function Worksheets() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Worksheets;
}(Array));

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Worksheet class
 * @private
 */
var Worksheet = /** @__PURE__ @class */ (function () {
    function Worksheet() {
        this.isSummaryRowBelow = true;
        this.showGridLines = true;
    }
    return Worksheet;
}());
/**
 * Hyperlink class
 * @private
 */
var HyperLink = /** @__PURE__ @class */ (function () {
    function HyperLink() {
    }
    return HyperLink;
}());
/**
 * Grouping class
 * @private
 */
var Grouping = /** @__PURE__ @class */ (function () {
    function Grouping() {
    }
    return Grouping;
}());
/**
 * FreezePane class
 * @private
 */
var FreezePane = /** @__PURE__ @class */ (function () {
    function FreezePane() {
    }
    return FreezePane;
}());
/**
 * MergeCell
 * @private
 */
var MergeCell = /** @__PURE__ @class */ (function () {
    function MergeCell() {
    }
    return MergeCell;
}());
/**
 * MergeCells class
 * @private
 */
var MergeCells = /** @__PURE__ @class */ (function (_super) {
    __extends$3(MergeCells, _super);
    function MergeCells() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.add = function (mergeCell) {
            var inserted = false;
            var count = 0;
            for (var _i = 0, _a = _this; _i < _a.length; _i++) {
                var mCell = _a[_i];
                if (MergeCells.isIntersecting(mCell, mergeCell)) {
                    var intersectingCell = new MergeCell();
                    intersectingCell.x = Math.min(mCell.x, mergeCell.x);
                    intersectingCell.y = Math.min(mCell.Y, mergeCell.y);
                    intersectingCell.width = Math.max(mCell.Width + mCell.X, mergeCell.width + mergeCell.x);
                    intersectingCell.height = Math.max(mCell.Height + mCell.Y, mergeCell.height + mergeCell.y);
                    intersectingCell.ref = (_this[count].ref.split(':')[0]) + ':' + (mergeCell.ref.split(':')[1]);
                    _this[count] = intersectingCell;
                    mergeCell = intersectingCell;
                    inserted = true;
                }
                count++;
            }
            if (!inserted) {
                _this.push(mergeCell);
            }
            return mergeCell;
        };
        return _this;
    }
    MergeCells.isIntersecting = function (base, compare) {
        return (base.x <= compare.x + compare.width)
            && (compare.x <= base.x + base.width)
            && (base.y <= compare.y + compare.height)
            && (compare.y <= base.y + base.height);
    };
    return MergeCells;
}(Array));

/**
 * Image class
 * @private
 */
var Image = /** @__PURE__ @class */ (function () {
    function Image() {
    }
    return Image;
}());

// import { IValueFormatter } from '../base/interface';
/**
 * ValueFormatter class to globalize the value.
 * @private
 */
var ValueFormatter = /** @__PURE__ @class */ (function () {
    function ValueFormatter(cultureName) {
        this.intl = new Internationalization();
        // if (!isNullOrUndefined(cultureName)) {
        //     this.intl.culture = cultureName;
        // }
    }
    ValueFormatter.prototype.getFormatFunction = function (format, isServerRendered) {
        if (format.type) {
            if (isServerRendered) {
                format.isServerRendered = true;
            }
            return this.intl.getDateFormat(format);
        }
        else {
            return this.intl.getNumberFormat(format);
        }
    };
    // public getParserFunction(format: NumberFormatOptions | DateFormatOptions): Function {
    //     if ((<DateFormatOptions>format).type) {
    //         return this.intl.getDateParser(<DateFormatOptions>format);
    //     } else {
    //         return this.intl.getNumberParser(<DateFormatOptions>format);
    //     }
    // }
    // public fromView(value: string, format: Function, type?: string): string | number | Date {
    //     if (type === 'date' || type === 'datetime' || type === 'number') {
    //         return format(value);
    //     } else {
    //         return value;
    //     }
    // }
    ValueFormatter.prototype.toView = function (value, format) {
        var result = value;
        if (!isNullOrUndefined(format) && !isNullOrUndefined(value)) {
            result = format(value);
        }
        return result;
    };
    // public setCulture(cultureName: string): void {
    //     if (!isNullOrUndefined(cultureName)) {
    //         setCulture(cultureName);
    //     }
    // }
    /* tslint:disable:no-any */
    ValueFormatter.prototype.displayText = function (value, format, isServerRendered) {
        return this.toView(value, this.getFormatFunction(format, isServerRendered));
    };
    return ValueFormatter;
}());

/**
 * CsvHelper class
 * @private
 */
var CsvHelper = /** @__PURE__ @class */ (function () {
    /* tslint:disable:no-any */
    function CsvHelper(json) {
        this.csvStr = '';
        this.formatter = new ValueFormatter();
        this.isMicrosoftBrowser = !(!navigator.msSaveBlob);
        if (json.isServerRendered !== null && json.isServerRendered !== undefined) {
            this.isServerRendered = json.isServerRendered;
        }
        if (json.styles !== null && json.styles !== undefined) {
            this.globalStyles = new Map();
            for (var i = 0; i < json.styles.length; i++) {
                if (json.styles[i].name !== undefined && json.styles[i].numberFormat !== undefined) {
                    this.globalStyles.set(json.styles[i].name, json.styles[i].numberFormat);
                }
            }
        }
        // Parses Worksheets data to DOM.        
        if (json.worksheets !== null && json.worksheets !== undefined) {
            this.parseWorksheet(json.worksheets[0]);
        }
        //this.csvStr = 'a1,a2,a3\nb1,b2,b3';
    }
    CsvHelper.prototype.parseWorksheet = function (json) {
        //Rows
        if (json.rows !== null && json.rows !== undefined) {
            this.parseRows(json.rows);
        }
    };
    /* tslint:disable:no-any */
    CsvHelper.prototype.parseRows = function (rows) {
        var count = 1;
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            //Row index
            if (row.index !== null && row.index !== undefined) {
                while (count < row.index) {
                    this.csvStr += '\n';
                    count++;
                }
                this.parseRow(row);
            }
            else {
                throw Error('Row index is missing.');
            }
        }
    };
    /* tslint:disable:no-any */
    CsvHelper.prototype.parseRow = function (row) {
        if (row.cells !== null && row.cells !== undefined) {
            var count = 1;
            for (var _i = 0, _a = row.cells; _i < _a.length; _i++) {
                var cell = _a[_i];
                //cell index
                if (cell.index !== null && cell.index !== undefined) {
                    while (count < cell.index) {
                        this.csvStr += ',';
                        count++;
                    }
                    this.parseCell(cell);
                }
                else {
                    throw Error('Cell index is missing.');
                }
            }
        }
    };
    /* tslint:disable:no-any */
    CsvHelper.prototype.parseCell = function (cell) {
        var csv = this.csvStr;
        if (cell.value !== undefined) {
            if (cell.value instanceof Date) {
                if (cell.style !== undefined && cell.style.numberFormat !== undefined) {
                    /* tslint:disable-next-line:max-line-length */
                    try {
                        csv += this.parseCellValue(this.formatter.displayText(cell.value, { type: 'dateTime', skeleton: cell.style.numberFormat }, this.isServerRendered));
                    }
                    catch (error) {
                        /* tslint:disable-next-line:max-line-length */
                        csv += this.parseCellValue(this.formatter.displayText(cell.value, { type: 'dateTime', format: cell.style.numberFormat }, this.isServerRendered));
                    }
                }
                else if (cell.style !== undefined && cell.style.name !== undefined && this.globalStyles.has(cell.style.name)) {
                    /* tslint:disable-next-line:max-line-length */
                    try {
                        csv += this.parseCellValue(this.formatter.displayText(cell.value, { type: 'dateTime', skeleton: this.globalStyles.get(cell.style.name) }, this.isServerRendered));
                    }
                    catch (error) {
                        /* tslint:disable-next-line:max-line-length */
                        csv += this.parseCellValue(this.formatter.displayText(cell.value, { type: 'dateTime', format: this.globalStyles.get(cell.style.name) }, this.isServerRendered));
                    }
                }
                else {
                    csv += cell.value;
                }
            }
            else if (typeof (cell.value) === 'boolean') {
                csv += cell.value ? 'TRUE' : 'FALSE';
            }
            else if (typeof (cell.value) === 'number') {
                if (cell.style !== undefined && cell.style.numberFormat !== undefined) {
                    /* tslint:disable-next-line:max-line-length */
                    csv += this.parseCellValue(this.formatter.displayText(cell.value, { format: cell.style.numberFormat }, this.isServerRendered));
                }
                else if (cell.style !== undefined && cell.style.name !== undefined && this.globalStyles.has(cell.style.name)) {
                    /* tslint:disable-next-line:max-line-length */
                    csv += this.parseCellValue(this.formatter.displayText(cell.value, { format: this.globalStyles.get(cell.style.name) }, this.isServerRendered));
                }
                else {
                    csv += cell.value;
                }
            }
            else {
                csv += this.parseCellValue(cell.value);
            }
        }
        this.csvStr = csv;
    };
    CsvHelper.prototype.parseCellValue = function (value) {
        var val = '';
        var length = value.length;
        for (var start = 0; start < length; start++) {
            if (value[start] === '\"') {
                val += value[start].replace('\"', '\"\"');
            }
            else {
                val += value[start];
            }
        }
        value = val;
        if (value.indexOf(',') !== -1 || value.indexOf('\n') !== -1) {
            return value = '\"' + value + '\"';
        }
        else {
            return value;
        }
    };
    /**
     * Saves the file with specified name and sends the file to client browser
     * @param  {string} fileName- file name to save.
     * @param  {Blob} buffer- the content to write in file
     */
    CsvHelper.prototype.save = function (fileName) {
        this.buffer = new Blob(['\ufeff' + this.csvStr], { type: 'text/csv;charset=UTF-8' });
        if (this.isMicrosoftBrowser) {
            navigator.msSaveBlob(this.buffer, fileName);
        }
        else {
            var dataUrl_1 = window.URL.createObjectURL(this.buffer);
            var dwlLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            dwlLink.download = fileName;
            dwlLink.href = dataUrl_1;
            var event_1 = document.createEvent('MouseEvent');
            event_1.initEvent('click', true, true);
            dwlLink.dispatchEvent(event_1);
            setTimeout(function () {
                window.URL.revokeObjectURL(dataUrl_1);
            });
        }
    };
    CsvHelper.prototype.saveAsBlob = function () {
        return new Blob(['\ufeff' + this.csvStr], { type: 'text/csv;charset=UTF-8' });
    };
    return CsvHelper;
}());

/**
 * BlobHelper class
 * @private
 */
var BlobHelper = /** @__PURE__ @class */ (function () {
    function BlobHelper() {
        /* tslint:disable:no-any */
        this.parts = [];
    }
    /* tslint:disable:no-any */
    BlobHelper.prototype.append = function (part) {
        this.parts.push(part);
        this.blob = undefined; // Invalidate the blob
    };
    BlobHelper.prototype.getBlob = function () {
        return new Blob(this.parts, { type: 'text/plain' });
    };
    return BlobHelper;
}());

/**
 * Workbook class
 */
var Workbook = /** @__PURE__ @class */ (function () {
    /* tslint:disable:no-any */
    function Workbook(json, saveType, culture, currencyString) {
        this.sharedStringCount = 0;
        this.unitsProportions = [
            96 / 75.0,
            96 / 300.0,
            96,
            96 / 25.4,
            96 / 2.54,
            1,
            96 / 72.0,
            96 / 72.0 / 12700,
        ];
        /* tslint:disable:no-any */
        this.hyperlinkStyle = { fontColor: '#0000FF', underline: true };
        if (culture !== undefined) {
            this.culture = culture;
        }
        else {
            this.culture = 'en-US';
        }
        if (currencyString !== undefined) {
            this.currency = currencyString;
        }
        else {
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
            this.printTitles = new Map();
            this.cellStyles = new Map();
            this.mNumFmt = new Map();
            this.mFills = new Map();
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
                this.globalStyles = new Map();
                for (var i = 0; i < json.styles.length; i++) {
                    if (json.styles[i].name !== undefined) {
                        if (!this.cellStyles.has(json.styles[i].name)) {
                            var cellStyle = new CellStyle();
                            cellStyle.isGlobalStyle = true;
                            this.parserCellStyle(json.styles[i], cellStyle, 'none');
                            var cellStylesIn = new CellStyles();
                            cellStylesIn.name = cellStyle.name;
                            cellStylesIn.xfId = (cellStyle.index - 1);
                            this.cellStyles.set(cellStylesIn.name, cellStylesIn);
                            /* tslint:disable-next-line:no-any */
                            var tFormat = {};
                            if (json.styles[i].numberFormat !== undefined) {
                                tFormat.format = json.styles[i].numberFormat;
                            }
                            if (json.styles[i].type !== undefined) {
                                tFormat.type = json.styles[i].type;
                            }
                            else {
                                tFormat.type = 'datetime';
                            }
                            if (tFormat.format !== undefined) {
                                this.globalStyles.set(json.styles[i].name, tFormat);
                            }
                        }
                        else {
                            throw Error('Style name ' + json.styles[i].name + ' is already existed');
                        }
                    }
                }
            }
            // Parses Worksheets data to DOM.        
            if (json.worksheets !== null && json.worksheets !== undefined) {
                this.parserWorksheets(json.worksheets);
            }
            else {
                throw Error('Worksheet is expected.');
            }
            // Parses the BuiltInProperties data to DOM.        
            if (json.builtInProperties !== null && json.builtInProperties !== undefined) {
                this.builtInProperties = new BuiltInProperties();
                this.parserBuiltInProperties(json.builtInProperties, this.builtInProperties);
            }
        }
        else {
            this.csvHelper = new CsvHelper(json);
        }
    }
    /* tslint:disable:no-any */
    Workbook.prototype.parserBuiltInProperties = function (jsonBuiltInProperties, builtInProperties) {
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
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parserWorksheets = function (json) {
        this.worksheets = new Worksheets();
        var length = json.length;
        for (var i = 0; i < length; i++) {
            var jsonSheet = json[i];
            var sheet = new Worksheet();
            this.mergeCells = new MergeCells();
            this.mergedCellsStyle = new Map();
            this.mHyperLinks = [];
            //Name
            if (jsonSheet.name !== null && jsonSheet.name !== undefined) {
                sheet.name = jsonSheet.name;
            }
            else {
                sheet.name = 'Sheet' + (i + 1).toString();
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
            sheet.index = (i + 1);
            sheet.mergeCells = this.mergeCells;
            sheet.hyperLinks = this.mHyperLinks;
            this.worksheets.push(sheet);
        }
    };
    /* tslint:disable:no-any */
    Workbook.prototype.mergeOptions = function (fromJson, toJson) {
        /* tslint:disable:no-any */
        var result = {};
        this.applyProperties(fromJson, result);
        this.applyProperties(toJson, result);
        return result;
    };
    /* tslint:disable:no-any */
    Workbook.prototype.applyProperties = function (sourceJson, destJson) {
        var keys = Object.keys(sourceJson);
        for (var index = 0; index < keys.length; index++) {
            if (keys[index] !== 'name') {
                destJson[keys[index]] = sourceJson[keys[index]];
            }
        }
    };
    Workbook.prototype.getCellName = function (row, column) {
        return this.getColumnName(column) + row.toString();
    };
    Workbook.prototype.getColumnName = function (col) {
        col--;
        var strColumnName = '';
        do {
            var iCurrentDigit = col % 26;
            col = col / 26 - 1;
            strColumnName = String.fromCharCode(65 + iCurrentDigit) + strColumnName;
        } while (col >= 0);
        return strColumnName;
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parserPrintTitle = function (json, sheet) {
        var printTitleName = '';
        var titleRowName;
        if (json.fromRow !== null && json.fromRow !== undefined) {
            var fromRow = json.fromRow;
            var toRow = void 0;
            if (json.toRow !== null && json.toRow !== undefined) {
                toRow = json.toRow;
            }
            else {
                toRow = json.fromRow;
            }
            titleRowName = '$' + fromRow + ':$' + toRow;
        }
        var titleColName;
        if (json.fromColumn !== null && json.fromColumn !== undefined) {
            var fromColumn = json.fromColumn;
            var toColumn = void 0;
            if (json.toColumn !== null && json.toColumn !== undefined) {
                toColumn = json.toColumn;
            }
            else {
                toColumn = json.fromColumn;
            }
            titleColName = '$' + this.getColumnName(fromColumn) + ':$' + this.getColumnName(toColumn);
        }
        if (titleRowName !== undefined) {
            printTitleName += (sheet.name + '!' + titleRowName);
        }
        if (titleColName !== undefined && titleRowName !== undefined) {
            printTitleName += ',' + (sheet.name + '!' + titleColName);
        }
        else if (titleColName !== undefined) {
            printTitleName += (sheet.name + '!' + titleColName);
        }
        if (printTitleName !== '') {
            this.printTitles.set(sheet.index - 1, printTitleName);
        }
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parserFreezePanes = function (json, sheet) {
        sheet.freezePanes = new FreezePane();
        if (json.row !== null && json.row !== undefined) {
            sheet.freezePanes.row = json.row;
        }
        else {
            sheet.freezePanes.row = 0;
        }
        if (json.column !== null && json.column !== undefined) {
            sheet.freezePanes.column = json.column;
        }
        else {
            sheet.freezePanes.column = 0;
        }
        sheet.freezePanes.leftCell = this.getCellName(sheet.freezePanes.row + 1, sheet.freezePanes.column + 1);
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parserColumns = function (json, sheet) {
        var columnsLength = json.length;
        sheet.columns = [];
        for (var column = 0; column < columnsLength; column++) {
            var col = new Column();
            if (json[column].index !== null && json[column].index !== undefined) {
                col.index = json[column].index;
            }
            else {
                throw Error('Column index is missing.');
            }
            if (json[column].width !== null && json[column].width !== undefined) {
                col.width = json[column].width;
            }
            sheet.columns.push(col);
        }
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parserRows = function (json, sheet) {
        var rowsLength = json.length;
        sheet.rows = new Rows();
        var rowId = 0;
        for (var r = 0; r < rowsLength; r++) {
            var row = this.parserRow(json[r], rowId);
            rowId = row.index;
            sheet.rows.add(row);
        }
        this.insertMergedCellsStyle(sheet);
    };
    Workbook.prototype.insertMergedCellsStyle = function (sheet) {
        var _this = this;
        if (this.mergeCells.length > 0) {
            this.mergedCellsStyle.forEach(function (value, key) {
                var row = sheet.rows.filter(function (item) {
                    return item.index === value.y;
                })[0];
                if (!isNullOrUndefined(row)) {
                    var cell = row.cells.filter(function (item) {
                        return item.index === value.x;
                    })[0];
                    if (!isNullOrUndefined(cell)) {
                        cell.styleIndex = value.styleIndex;
                    }
                    else {
                        var cells = row.cells.filter(function (item) {
                            return item.index <= value.x;
                        });
                        var insertIndex = 0;
                        if (cells.length > 0) {
                            insertIndex = row.cells.indexOf(cells[cells.length - 1]) + 1;
                        }
                        row.cells.splice(insertIndex, 0, _this.createCell(value, key));
                    }
                }
                else {
                    var rows = sheet.rows.filter(function (item) {
                        return item.index <= value.y;
                    });
                    var rowToInsert = new Row();
                    rowToInsert.index = value.y;
                    rowToInsert.cells = new Cells();
                    rowToInsert.cells.add(_this.createCell(value, key));
                    var insertIndex = 0;
                    if (rows.length > 0) {
                        insertIndex = sheet.rows.indexOf(rows[rows.length - 1]) + 1;
                    }
                    sheet.rows.splice(insertIndex, 0, rowToInsert);
                }
            });
        }
    };
    Workbook.prototype.createCell = function (value, key) {
        var cellToInsert = new Cell();
        cellToInsert.refName = key;
        cellToInsert.index = value.x;
        cellToInsert.cellStyle = new CellStyle();
        cellToInsert.styleIndex = value.styleIndex;
        return cellToInsert;
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parserRow = function (json, rowIndex) {
        var row = new Row();
        //Row Height
        if (json.height !== null && json.height !== undefined) {
            row.height = json.height;
        }
        //Row index
        if (json.index !== null && json.index !== undefined) {
            row.index = json.index;
        }
        else {
            throw Error('Row index is missing.');
        }
        if (json.grouping !== null && json.grouping !== undefined) {
            this.parseGrouping(json.grouping, row);
        }
        this.parseCells(json.cells, row);
        return row;
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parseGrouping = function (json, row) {
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
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parseCells = function (json, row) {
        row.cells = new Cells();
        var cellsLength = json !== undefined ? json.length : 0;
        var spanMin = 1;
        var spanMax = 1;
        for (var cellId = 0; cellId < cellsLength; cellId++) {
            /* tslint:disable:no-any */
            var jsonCell = json[cellId];
            var cell = new Cell();
            //cell index
            if (jsonCell.index !== null && jsonCell.index !== undefined) {
                cell.index = jsonCell.index;
            }
            else {
                throw Error('Cell index is missing.');
            }
            if (cell.index < spanMin) {
                spanMin = cell.index;
            }
            else if (cell.index > spanMax) {
                spanMax = cell.index;
            }
            //Update the Cell name
            cell.refName = this.getCellName(row.index, cell.index);
            //Row span
            if (jsonCell.rowSpan !== null && jsonCell.rowSpan !== undefined) {
                cell.rowSpan = jsonCell.rowSpan - 1;
            }
            else {
                cell.rowSpan = 0;
            }
            //Column span
            if (jsonCell.colSpan !== null && jsonCell.colSpan !== undefined) {
                cell.colSpan = jsonCell.colSpan - 1;
            }
            else {
                cell.colSpan = 0;
            }
            //Hyperlink
            if (jsonCell.hyperlink !== null && jsonCell.hyperlink !== undefined) {
                var hyperLink = new HyperLink();
                if (jsonCell.hyperlink.target !== undefined) {
                    hyperLink.target = jsonCell.hyperlink.target;
                    if (jsonCell.hyperlink.displayText !== undefined) {
                        cell.value = jsonCell.hyperlink.displayText;
                    }
                    else {
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
                }
                else {
                    cell.value = jsonCell.value;
                    cell.type = this.getCellValueType(cell.value);
                }
            }
            if (jsonCell.style !== null && jsonCell.style !== undefined && cell.styleIndex === undefined) {
                cell.cellStyle = new CellStyle();
                if (cell.value instanceof Date) {
                    this.parserCellStyle(jsonCell.style, cell.cellStyle, cell.type, 14);
                }
                else {
                    this.parserCellStyle(jsonCell.style, cell.cellStyle, cell.type);
                }
                cell.styleIndex = cell.cellStyle.index;
            }
            else if (cell.value instanceof Date) {
                cell.cellStyle = new CellStyle();
                this.parserCellStyle({}, cell.cellStyle, cell.type, 14);
                cell.styleIndex = cell.cellStyle.index;
            }
            this.parseCellType(cell);
            this.mergeCells = this.processMergeCells(cell, row.index, this.mergeCells);
            row.cells.add(cell);
            
        }
        row.spans = (spanMin) + ':' + (spanMax);
    };
    Workbook.prototype.GetColors = function () {
        var colors;
        colors = new Map();
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
    };
    Workbook.prototype.processColor = function (colorVal) {
        if (colorVal.indexOf('#') === 0) {
            return colorVal.replace('#', 'FF');
        }
        colorVal = colorVal.toUpperCase();
        this.rgbColors = this.GetColors();
        if (this.rgbColors.has(colorVal)) {
            colorVal = this.rgbColors.get(colorVal);
        }
        else {
            colorVal = 'FF000000';
        }
        return colorVal;
    };
    Workbook.prototype.processCellValue = function (value, cell) {
        var cellValue = value;
        var processedVal = '';
        var startindex = value.indexOf('<', 0);
        if (startindex >= 0) {
            if (startindex !== 0) {
                processedVal += '<r><t xml:space="preserve">' + value.substring(0, startindex) + '</t></r>';
            }
            var endIndex = value.indexOf('>', startindex + 1);
            while (startindex >= 0 && endIndex >= 0) {
                endIndex = value.indexOf('>', startindex + 1);
                if (endIndex >= 0) {
                    var subString = value.substring(startindex + 1, endIndex);
                    startindex = value.indexOf('<', endIndex + 1);
                    if (startindex < 0) {
                        startindex = cellValue.length;
                    }
                    var text = cellValue.substring(endIndex + 1, startindex);
                    if (text.length !== 0) {
                        var subSplit = subString.split(' ');
                        if (subSplit.length > 0) {
                            processedVal += '<r><rPr>';
                        }
                        if (subSplit.length > 1) {
                            for (var _i = 0, subSplit_1 = subSplit; _i < subSplit_1.length; _i++) {
                                var element = subSplit_1[_i];
                                var start = element.trim().substring(0, 5);
                                switch (start) {
                                    case 'size=':
                                        processedVal += '<sz val="' + element.substring(6, element.length - 1) + '"/>';
                                        break;
                                    case 'face=':
                                        processedVal += '<rFont val="' + element.substring(6, element.length - 1) + '"/>';
                                        break;
                                    case 'color':
                                        processedVal += '<color rgb="' + this.processColor(element.substring(7, element.length - 1)) + '"/>';
                                        break;
                                    case 'href=':
                                        var hyperLink = new HyperLink();
                                        hyperLink.target = element.substring(6, element.length - 1).trim();
                                        hyperLink.ref = cell.refName;
                                        hyperLink.rId = (this.mHyperLinks.length + 1);
                                        this.mHyperLinks.push(hyperLink);
                                        processedVal += '<color rgb="FF0000FF"/><u/><b/>';
                                        break;
                                }
                            }
                        }
                        else if (subSplit.length === 1) {
                            var style = subSplit[0].trim();
                            switch (style) {
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
                        processedVal += '</rPr><t xml:space="preserve">' + text + '</t></r>';
                    }
                }
            }
            if (processedVal === '') {
                return cellValue;
            }
            return processedVal;
        }
        else {
            return cellValue;
        }
    };
    Workbook.prototype.applyGlobalStyle = function (json, cellStyle) {
        if (this.cellStyles.has(json.name)) {
            cellStyle.index = this.mStyles.filter(function (a) { return (a.name === json.name); })[0].index;
            cellStyle.name = json.name;
        }
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parserCellStyle = function (json, cellStyle, cellType, defStyleIndex) {
        //name
        if (json.name !== null && json.name !== undefined) {
            if (cellStyle.isGlobalStyle) {
                cellStyle.name = json.name;
            }
            else {
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
        //wrapText
        if (json.wrapText !== null && json.wrapText !== undefined) {
            cellStyle.wrapText = json.wrapText;
        }
        //numberFormat
        if (json.numberFormat !== null && json.numberFormat !== undefined) {
            if (json.type !== null && json.type !== undefined) {
                cellStyle.numberFormat = this.getNumberFormat(json.numberFormat, json.type);
            }
            else {
                cellStyle.numberFormat = this.getNumberFormat(json.numberFormat, cellType);
            }
        }
        else if (defStyleIndex !== undefined) {
            cellStyle.numFmtId = 14;
            cellStyle.numberFormat = 'GENERAL';
        }
        else {
            cellStyle.numberFormat = 'GENERAL';
        }
        cellStyle.index = this.processCellStyle(cellStyle);
    };
    Workbook.prototype.switchNumberFormat = function (numberFormat, type) {
        var format = this.getNumberFormat(numberFormat, type);
        if (format !== numberFormat) {
            var numFmt = this.mNumFmt.get(numberFormat);
            if (numFmt !== undefined) {
                numFmt.formatCode = format;
                if (this.mNumFmt.has(format)) {
                    for (var _i = 0, _a = this.mCellStyleXfs; _i < _a.length; _i++) {
                        var cellStyleXfs = _a[_i];
                        if (cellStyleXfs.numFmtId === numFmt.numFmtId) {
                            cellStyleXfs.numFmtId = this.mNumFmt.get(format).numFmtId;
                        }
                    }
                    for (var _b = 0, _c = this.mCellXfs; _b < _c.length; _b++) {
                        var cellXfs = _c[_b];
                        if (cellXfs.numFmtId === numFmt.numFmtId) {
                            cellXfs.numFmtId = this.mNumFmt.get(format).numFmtId;
                        }
                    }
                }
            }
        }
    };
    Workbook.prototype.getNumberFormat = function (numberFormat, type) {
        var returnFormat;
        switch (type) {
            case 'number':
                try {
                    returnFormat = this.intl.getNumberPattern({ format: numberFormat, currency: this.currency });
                }
                catch (error) {
                    returnFormat = numberFormat;
                }
                break;
            case 'datetime':
                try {
                    returnFormat = this.intl.getDatePattern({ skeleton: numberFormat, type: 'dateTime' }, true);
                }
                catch (error) {
                    try {
                        returnFormat = this.intl.getDatePattern({ format: numberFormat, type: 'dateTime' }, true);
                    }
                    catch (error) {
                        returnFormat = numberFormat;
                    }
                }
                break;
            case 'date':
                try {
                    returnFormat = this.intl.getDatePattern({ skeleton: numberFormat, type: 'date' }, true);
                }
                catch (error) {
                    try {
                        returnFormat = this.intl.getDatePattern({ format: numberFormat, type: 'date' }, true);
                    }
                    catch (error) {
                        returnFormat = numberFormat;
                    }
                }
                break;
            case 'time':
                try {
                    returnFormat = this.intl.getDatePattern({ skeleton: numberFormat, type: 'time' }, true);
                }
                catch (error) {
                    try {
                        returnFormat = this.intl.getDatePattern({ format: numberFormat, type: 'time' }, true);
                    }
                    catch (error) {
                        returnFormat = numberFormat;
                    }
                }
                break;
            default:
                returnFormat = numberFormat;
                break;
        }
        return returnFormat;
    };
    /* tslint:disable:no-any */
    Workbook.prototype.parserBorder = function (json, border) {
        if (json.color !== null && json.color !== undefined) {
            border.color = json.color;
        }
        else {
            border.color = '#000000';
        }
        if (json.lineStyle !== null && json.lineStyle !== undefined) {
            border.lineStyle = json.lineStyle;
        }
        else {
            border.lineStyle = 'thin';
        }
    };
    Workbook.prototype.processCellStyle = function (style) {
        if (style.isGlobalStyle) {
            this.processNumFormatId(style);
            this.mStyles.push(style);
            return this.mStyles.length;
        }
        else {
            var compareResult = this.compareStyle(style);
            if (!compareResult.result) {
                this.processNumFormatId(style);
                this.mStyles.push(style);
                return this.mStyles.length;
            }
            else {
                //Return the index of the already existing style.
                return compareResult.index;
            }
        }
    };
    Workbook.prototype.processNumFormatId = function (style) {
        if (style.numberFormat !== 'GENERAL' && !this.mNumFmt.has(style.numberFormat)) {
            var id = this.mNumFmt.size + 164;
            this.mNumFmt.set(style.numberFormat, new NumFmt(id, style.numberFormat));
        }
    };
    Workbook.prototype.isNewFont = function (toCompareStyle) {
        var result = false;
        var index = 0;
        for (var _i = 0, _a = this.mFonts; _i < _a.length; _i++) {
            var font = _a[_i];
            index++;
            var fontColor = undefined;
            if (toCompareStyle.fontColor !== undefined) {
                fontColor = ('FF' + toCompareStyle.fontColor.replace('#', ''));
            }
            result = font.color === fontColor &&
                font.b === toCompareStyle.bold &&
                font.i === toCompareStyle.italic &&
                font.u === toCompareStyle.underline &&
                font.name === toCompareStyle.fontName &&
                font.sz === toCompareStyle.fontSize;
            if (result) {
                break;
            }
        }
        index = index - 1;
        return { index: index, result: result };
    };
    Workbook.prototype.isNewBorder = function (toCompareStyle) {
        var bStyle = new CellStyle();
        if (this.isAllBorder(toCompareStyle.borders)) {
            return (bStyle.borders.all.color === toCompareStyle.borders.all.color &&
                bStyle.borders.all.lineStyle === toCompareStyle.borders.all.lineStyle);
        }
        else {
            return (bStyle.borders.left.color === toCompareStyle.borders.left.color &&
                bStyle.borders.left.lineStyle === toCompareStyle.borders.left.lineStyle &&
                bStyle.borders.right.color === toCompareStyle.borders.right.color &&
                bStyle.borders.right.lineStyle === toCompareStyle.borders.right.lineStyle &&
                bStyle.borders.top.color === toCompareStyle.borders.top.color &&
                bStyle.borders.top.lineStyle === toCompareStyle.borders.top.lineStyle &&
                bStyle.borders.bottom.color === toCompareStyle.borders.bottom.color &&
                bStyle.borders.bottom.lineStyle === toCompareStyle.borders.bottom.lineStyle);
        }
    };
    Workbook.prototype.isAllBorder = function (toCompareBorder) {
        var allBorderStyle = new CellStyle();
        return allBorderStyle.borders.all.color !== toCompareBorder.all.color &&
            allBorderStyle.borders.all.lineStyle !== toCompareBorder.all.lineStyle;
    };
    Workbook.prototype.compareStyle = function (toCompareStyle) {
        var result = true;
        var index = 0;
        for (var _i = 0, _a = this.mStyles; _i < _a.length; _i++) {
            var baseStyle = _a[_i];
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
        return { index: index, result: result };
    };
    Workbook.prototype.contains = function (array, item) {
        var index = array.indexOf(item);
        return index > -1 && index < array.length;
    };
    Workbook.prototype.getCellValueType = function (value) {
        if (value instanceof Date) {
            return 'datetime';
        }
        else if (typeof (value) === 'boolean') {
            return 'boolean';
        }
        else if (typeof (value) === 'number') {
            return 'number';
        }
        else {
            return 'string';
        }
    };
    Workbook.prototype.parseCellType = function (cell) {
        var type = cell.type;
        var saveType;
        var value = cell.value;
        switch (type) {
            case 'datetime':
                value = this.toOADate(value);
                if (cell.cellStyle !== undefined && cell.cellStyle.name !== undefined) {
                    if (this.globalStyles.has(cell.cellStyle.name)) {
                        var value_1 = this.globalStyles.get(cell.cellStyle.name);
                        this.switchNumberFormat(value_1.format, value_1.type);
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
                var sstvalue = this.processCellValue(value, cell);
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
    };
    Workbook.prototype.parserImages = function (json, sheet) {
        var imagesLength = json.length;
        sheet.images = [];
        for (var p = 0; p < imagesLength; p++) {
            var image = this.parserImage(json[p]);
            sheet.images.push(image);
        }
    };
    Workbook.prototype.parserImage = function (json) {
        var image = new Image();
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
    };
    Workbook.prototype.saveAsBlob = function (blobSaveType) {
        var _this = this;
        switch (blobSaveType) {
            case 'text/csv':
                return new Promise(function (resolve, reject) {
                    var obj = {};
                    obj.blobData = _this.csvHelper.saveAsBlob();
                    resolve(obj);
                });
            default:
                return new Promise(function (resolve, reject) {
                    _this.saveInternal();
                    _this.mArchive.saveAsBlob().then(function (blob) {
                        var obj = {};
                        obj.blobData = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        resolve(obj);
                    });
                });
        }
    };
    Workbook.prototype.save = function (fileName, proxyUrl) {
        var _this = this;
        if (fileName === null || fileName === undefined || fileName === '') {
            throw new Error('Argument Null Exception: fileName cannot be null or empty');
        }
        var xlsxMatch = fileName.match('.xlsx$');
        var csvMatch = fileName.match('.csv$');
        if (xlsxMatch !== null && xlsxMatch[0] === ('.' + this.mSaveType)) {
            this.saveInternal();
            this.mArchive.save(fileName).then(function () {
                _this.mArchive.destroy();
            });
        }
        else if (csvMatch !== null && csvMatch[0] === ('.' + this.mSaveType)) {
            this.csvHelper.save(fileName);
        }
        else {
            throw Error('Save type and file extension is different.');
        }
    };
    Workbook.prototype.saveInternal = function () {
        this.saveWorkbook();
        this.saveWorksheets();
        this.saveSharedString();
        this.saveStyles();
        this.saveApp(this.builtInProperties);
        this.saveCore(this.builtInProperties);
        this.saveContentType();
        this.saveTopLevelRelation();
        this.saveWorkbookRelation();
    };
    Workbook.prototype.saveWorkbook = function () {
        /* tslint:disable-next-line:max-line-length */
        var workbookTemp = '<?xml version="1.0" encoding="utf-8"?><workbook xmlns:r = "http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns= "http://schemas.openxmlformats.org/spreadsheetml/2006/main"><workbookPr codeName="ThisWorkbook" defaultThemeVersion= "153222"/><bookViews><workbookView activeTab="0"/></bookViews>';
        var sheets = '<sheets>';
        var length = this.worksheets.length;
        for (var i = 0; i < length; i++) {
            /* tslint:disable-next-line:max-line-length */
            sheets += '<sheet name="' + this.worksheets[i].name + '" sheetId="' + (i + 1).toString() + '" r:id ="rId' + (i + 1).toString() + '" />';
        }
        sheets += '</sheets>';
        workbookTemp += sheets;
        if (this.printTitles.size > 0) {
            var printTitle_1 = '<definedNames>';
            this.printTitles.forEach(function (value, key) {
                printTitle_1 += '<definedName name="_xlnm.Print_Titles" localSheetId="' + key + '">' + value + '</definedName>';
            });
            printTitle_1 += '</definedNames>';
            workbookTemp += printTitle_1;
        }
        this.addToArchive(workbookTemp + '</workbook>', 'xl/workbook.xml');
    };
    Workbook.prototype.saveWorksheets = function () {
        var length = this.worksheets.length;
        for (var i = 0; i < length; i++) {
            this.saveWorksheet(this.worksheets[i], i);
        }
    };
    Workbook.prototype.saveWorksheet = function (sheet, index) {
        var sheetBlob = new BlobHelper();
        /* tslint:disable-next-line:max-line-length */
        var sheetString = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
        if (!sheet.isSummaryRowBelow) {
            sheetString += ('<sheetPr>' + '<outlinePr ' + 'summaryBelow="0" >' + '</outlinePr>' + '</sheetPr>');
        }
        else {
            sheetString += ('<sheetPr />');
        }
        sheetString += this.saveSheetView(sheet);
        if (sheet.columns !== undefined) {
            var colString = '<cols>';
            for (var _i = 0, _a = sheet.columns; _i < _a.length; _i++) {
                var column = _a[_i];
                /* tslint:disable-next-line:max-line-length */
                if (column.width !== undefined) {
                    colString += '<col min="' + (column.index) + '" max="' + (column.index) + '" width="' + this.pixelsToColumnWidth(column.width) + '" customWidth="1" />';
                }
                else {
                    colString += '<col min="' + (column.index) + '" max="' + (column.index) + '" width="' + '8.43' + '" customWidth="1" />';
                }
            }
            sheetString += (colString + '</cols>');
        }
        sheetString += ('<sheetData>');
        sheetBlob.append(sheetString);
        sheetString = '';
        if (sheet.rows !== undefined) {
            for (var _b = 0, _c = sheet.rows; _b < _c.length; _b++) {
                var row = _c[_b];
                var rowString = '<row r="' + (row.index) + '" ';
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
                for (var _d = 0, _e = row.cells; _d < _e.length; _d++) {
                    var cell = _e[_d];
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
                        }
                        else {
                            rowString += ('</c>');
                        }
                    }
                }
                rowString += ('</row>');
                sheetBlob.append(rowString);
            }
        }
        sheetString += ('</sheetData>');
        if (sheet.mergeCells.length > 0) {
            sheetString += ('<mergeCells count="' + sheet.mergeCells.length + '">');
            for (var _f = 0, _g = sheet.mergeCells; _f < _g.length; _f++) {
                var mCell = _g[_f];
                sheetString += ('<mergeCell ref="' + mCell.ref + '" />');
            }
            sheetString += ('</mergeCells>');
        }
        if (sheet.hyperLinks.length > 0) {
            sheetString += ('<hyperlinks>');
            for (var _h = 0, _j = sheet.hyperLinks; _h < _j.length; _h++) {
                var hLink = _j[_h];
                sheetString += ('<hyperlink ref="' + hLink.ref + '" r:id="rId' + hLink.rId + '" />');
            }
            sheetString += ('</hyperlinks>');
        }
        /* tslint:disable-next-line:max-line-length */
        sheetString += ('<pageMargins left="0.75" right="0.75" top="1" bottom="1" header="0.5" footer="0.5" /><headerFooter scaleWithDoc="1" alignWithMargins="0" differentFirst="0" differentOddEven="0" />');
        if (sheet.images != undefined && sheet.images.length > 0) {
            this.drawingCount++;
            this.saveDrawings(sheet, sheet.index);
            sheetString += '<drawing r:id="rId' + (sheet.hyperLinks.length + 1) + '"/>';
        }
        this.addToArchive(this.saveSheetRelations(sheet), ('xl/worksheets/_rels/sheet' + sheet.index + '.xml.rels'));
        sheetBlob.append(sheetString + '</worksheet>');
        this.addToArchive(sheetBlob.getBlob(), 'xl/worksheets' + '/sheet' + (index + 1) + '.xml');
    };
    Workbook.prototype.saveDrawings = function (sheet, index) {
        var drawings = new BlobHelper();
        /* tslint:disable-next-line:max-line-length */
        var sheetDrawingString = '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">';
        if (sheet.images !== undefined) {
            var imgId = 0;
            for (var _i = 0, _a = sheet.images; _i < _a.length; _i++) {
                var pic = _a[_i];
                if (pic.height !== undefined && pic.width !== undefined) {
                    this.updatelastRowOffset(sheet, pic);
                    this.updatelastColumnOffSet(sheet, pic);
                }
                else if (pic.lastRow !== undefined && pic.lastColumn !== undefined) {
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
                sheetDrawingString += '<a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId' + imgId + '" cstate="print">';
                sheetDrawingString += '</a:blip><a:stretch><a:fillRect /></a:stretch></xdr:blipFill>';
                sheetDrawingString += '<xdr:spPr>';
                sheetDrawingString += '<a:xfrm';
                if (pic.rotation != undefined && pic.rotation <= 3600 && pic.rotation >= -3600) {
                    sheetDrawingString += ' rot="' + (pic.rotation * 60000) + '"';
                }
                if (pic.verticalFlip != undefined && pic.verticalFlip != false) {
                    sheetDrawingString += ' flipV="1"';
                }
                if (pic.horizontalFlip != undefined && pic.horizontalFlip != false) {
                    sheetDrawingString += ' flipH="1"';
                }
                sheetDrawingString += '/>';
                sheetDrawingString += '<a:prstGeom prst="rect"><a:avLst /></a:prstGeom></xdr:spPr>';
                sheetDrawingString += '</xdr:pic><xdr:clientData /></xdr:twoCellAnchor>';
                var imageData = this.convertBase64toImage(pic.image);
                this.imageCount += 1;
                this.addToArchive(imageData, 'xl/media/image' + this.imageCount + '.png');
            }
            drawings.append(sheetDrawingString);
            drawings.append('</xdr:wsDr>');
            this.saveDrawingRelations(sheet);
            this.addToArchive(drawings.getBlob(), 'xl/drawings/drawing' + this.drawingCount + '.xml');
        }
    };
    Workbook.prototype.updatelastRowOffset = function (sheet, picture) {
        var iCurHeight = picture.height;
        var iCurRow = picture.row;
        var iCurOffset = 0;
        while (iCurHeight >= 0) {
            var iRowHeight = 0;
            if (sheet.rows !== undefined && sheet.rows[iCurRow - 1] !== undefined)
                iRowHeight = this.convertToPixels(sheet.rows[iCurRow - 1].height === undefined ? 15 : sheet.rows[iCurRow - 1].height);
            else
                iRowHeight = this.convertToPixels(15);
            var iSpaceInCell = iRowHeight - (iCurOffset * iRowHeight / 256);
            if (iSpaceInCell > iCurHeight) {
                picture.lastRow = iCurRow;
                picture.lastRowOffset = iCurOffset + (iCurHeight * 256 / iRowHeight);
                var rowHiddenHeight = 0;
                if (sheet.rows !== undefined && sheet.rows[iCurRow - 1] !== undefined)
                    rowHiddenHeight = this.convertToPixels(sheet.rows[iCurRow - 1].height === undefined ? 15 : sheet.rows[iCurRow - 1].height);
                else
                    rowHiddenHeight = this.convertToPixels(15);
                picture.lastRowOffset = (rowHiddenHeight * picture.lastRowOffset) / 256;
                picture.lastRowOffset = Math.round(picture.lastRowOffset / this.unitsProportions[7]);
                break;
            }
            else {
                iCurHeight -= iSpaceInCell;
                iCurRow++;
                iCurOffset = 0;
            }
        }
    };
    Workbook.prototype.updatelastColumnOffSet = function (sheet, picture) {
        var iCurWidth = picture.width;
        var iCurCol = picture.column;
        var iCurOffset = 0;
        while (iCurWidth >= 0) {
            var iColWidth = 0;
            if (sheet.columns !== undefined && sheet.columns[iCurCol - 1] !== undefined)
                iColWidth = this.ColumnWidthToPixels(sheet.columns[iCurCol - 1].width === undefined ? 8.43 : sheet.columns[iCurCol - 1].width);
            else
                iColWidth = this.ColumnWidthToPixels(8.43);
            var iSpaceInCell = iColWidth - (iCurOffset * iColWidth / 1024);
            if (iSpaceInCell > iCurWidth) {
                picture.lastColumn = iCurCol;
                picture.lastColOffset = iCurOffset + (iCurWidth * 1024 / iColWidth);
                var colHiddenWidth = 0;
                if (sheet.columns !== undefined && sheet.columns[iCurCol - 1] !== undefined)
                    colHiddenWidth = this.ColumnWidthToPixels(sheet.columns[iCurCol - 1].width === undefined ? 8.43 : sheet.columns[iCurCol].width);
                else
                    colHiddenWidth = this.ColumnWidthToPixels(8.43);
                picture.lastColOffset = (colHiddenWidth * picture.lastColOffset) / 1024;
                picture.lastColOffset = Math.round(picture.lastColOffset / this.unitsProportions[7]);
                break;
            }
            else {
                iCurWidth -= iSpaceInCell;
                iCurCol++;
                iCurOffset = 0;
            }
        }
    };
    Workbook.prototype.convertToPixels = function (value) {
        return value * this.unitsProportions[6];
    };
    Workbook.prototype.convertBase64toImage = function (img) {
        var byteStr = window.atob(img);
        var buffer = new ArrayBuffer(byteStr.length);
        var data = new Uint8Array(buffer);
        for (var i = 0; i < byteStr.length; i++) {
            data[i] = byteStr.charCodeAt(i);
        }
        var blob = new Blob([data], { type: 'image/png' });
        return blob;
    };
    Workbook.prototype.saveDrawingRelations = function (sheet) {
        /* tslint:disable-next-line:max-line-length */
        var drawingRelation = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        var length = sheet.images.length;
        var id = this.imageCount - sheet.images.length;
        for (var i = 1; i <= length; i++) {
            id++;
            /* tslint:disable-next-line:max-line-length */
            drawingRelation += '<Relationship Id="rId' + i + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image' + id + '.png" />';
        }
        this.addToArchive((drawingRelation + '</Relationships>'), 'xl/drawings/_rels/drawing' + this.drawingCount + '.xml.rels');
    };
    Workbook.prototype.pixelsToColumnWidth = function (pixels) {
        var dDigitWidth = 7;
        var val = (pixels > dDigitWidth + 5) ?
            this.trunc((pixels - 5) / dDigitWidth * 100 + 0.5) / 100 :
            pixels / (dDigitWidth + 5);
        return (val > 1) ?
            ((val * dDigitWidth + 5) / dDigitWidth * 256.0) / 256.0 :
            (val * (dDigitWidth + 5) / dDigitWidth * 256.0) / 256.0;
    };
    Workbook.prototype.ColumnWidthToPixels = function (val) {
        var dDigitWidth = 7;
        var fileWidth = (val > 1) ?
            ((val * dDigitWidth + 5) / dDigitWidth * 256.0) / 256.0 :
            (val * (dDigitWidth + 5) / dDigitWidth * 256.0) / 256.0;
        return this.trunc(((256 * fileWidth + this.trunc(128 / dDigitWidth)) / 256) * dDigitWidth);
    };
    Workbook.prototype.trunc = function (x) {
        var n = x - x % 1;
        return n === 0 && (x < 0 || (x === 0 && (1 / x !== 1 / 0))) ? -0 : n;
    };
    Workbook.prototype.pixelsToRowHeight = function (pixels) {
        return (pixels * this.unitsProportions[5] / this.unitsProportions[6]);
    };
    Workbook.prototype.saveSheetRelations = function (sheet) {
        /* tslint:disable-next-line:max-line-length */
        var relStr = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        for (var _i = 0, _a = sheet.hyperLinks; _i < _a.length; _i++) {
            var hLink = _a[_i];
            /* tslint:disable-next-line:max-line-length */
            relStr += '<Relationship Id="rId' + hLink.rId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="' + hLink.target + '" TargetMode="External" />';
        }
        if (sheet.images != undefined && sheet.images.length > 0) {
            /* tslint:disable-next-line:max-line-length */
            relStr += '<Relationship Id="rId' + (sheet.hyperLinks.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing' + this.drawingCount + '.xml" />';
        }
        relStr += '</Relationships>';
        return relStr;
    };
    Workbook.prototype.saveSheetView = function (sheet) {
        var paneString = '<sheetViews><sheetView workbookViewId="0" ';
        if (sheet.showGridLines === false) {
            paneString += 'showGridLines="0" >';
        }
        else {
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
    };
    Workbook.prototype.saveSharedString = function () {
        var length = this.sharedString.length;
        if (length > 0) {
            /* tslint:disable-next-line:max-line-length */
            var sstStart = '<?xml version="1.0" encoding="utf-8"?><sst uniqueCount="' + length + '" count="' + this.sharedStringCount + '" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
            var si = '';
            for (var i = 0; i < length; i++) {
                if (this.sharedString[i].indexOf('<r>') !== 0) {
                    si += '<si><t>';
                    si += this.processString(this.sharedString[i]);
                    si += '</t></si>';
                }
                else {
                    si += '<si>';
                    si += this.sharedString[i];
                    si += '</si>';
                }
            }
            si += '</sst>';
            this.addToArchive(sstStart + si, 'xl/sharedStrings.xml');
        }
    };
    Workbook.prototype.processString = function (value) {
        if (value.indexOf('&') !== -1) {
            value = value.replace(/&/g, '&amp;');
        }
        if (value.indexOf('<') !== -1) {
            value = value.replace(/</g, '&lt;');
        }
        if (value.indexOf('>') !== -1) {
            value = value.replace(/>/g, '&gt;');
        }
        return value;
    };
    Workbook.prototype.saveStyles = function () {
        this.updateCellXfsStyleXfs();
        /* tslint:disable-next-line:max-line-length */
        var styleTemp = '<?xml version="1.0" encoding="utf-8"?><styleSheet xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
        styleTemp += this.saveNumberFormats();
        styleTemp += this.saveFonts();
        styleTemp += this.saveFills();
        styleTemp += this.saveBorders();
        styleTemp += this.saveCellStyleXfs();
        styleTemp += this.saveCellXfs();
        styleTemp += this.saveCellStyles();
        this.addToArchive(styleTemp + '</styleSheet>', 'xl/styles.xml');
    };
    Workbook.prototype.updateCellXfsStyleXfs = function () {
        for (var _i = 0, _a = this.mStyles; _i < _a.length; _i++) {
            var style = _a[_i];
            var cellXfs = undefined;
            if (style.isGlobalStyle) {
                cellXfs = new CellStyleXfs();
                cellXfs.xfId = (style.index - 1);
            }
            else {
                cellXfs = new CellXfs();
                cellXfs.xfId = 0;
            }
            //Add font
            var compareFontResult = this.isNewFont(style);
            if (!compareFontResult.result) {
                var font = new Font();
                font.b = style.bold;
                font.i = style.italic;
                font.name = style.fontName;
                font.sz = style.fontSize;
                font.u = style.underline;
                font.color = ('FF' + style.fontColor.replace('#', ''));
                this.mFonts.push(font);
                cellXfs.fontId = this.mFonts.length - 1;
            }
            else {
                cellXfs.fontId = compareFontResult.index;
            }
            //Add fill
            if (style.backColor !== 'none') {
                var backColor = 'FF' + style.backColor.replace('#', '');
                if (this.mFills.has(backColor)) {
                    var fillId = this.mFills.get(backColor);
                    cellXfs.fillId = fillId;
                }
                else {
                    var fillId = this.mFills.size + 2;
                    this.mFills.set(backColor, fillId);
                    cellXfs.fillId = (fillId);
                }
            }
            else {
                cellXfs.fillId = 0;
            }
            //Add border            
            if (!this.isNewBorder(style)) {
                this.mBorders.push(style.borders);
                cellXfs.borderId = this.mBorders.length;
            }
            else {
                cellXfs.borderId = 0;
            }
            //Add Number Format            
            if (style.numberFormat !== 'GENERAL') {
                if (this.mNumFmt.has(style.numberFormat)) {
                    var numFmt = this.mNumFmt.get(style.numberFormat);
                    cellXfs.numFmtId = numFmt.numFmtId;
                }
                else {
                    var id = this.mNumFmt.size + 164;
                    this.mNumFmt.set(style.numberFormat, new NumFmt(id, style.numberFormat));
                    cellXfs.numFmtId = id;
                }
            }
            else {
                if (style.numberFormat === 'GENERAL' && style.numFmtId === 14) {
                    cellXfs.numFmtId = 14;
                }
                else {
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
            }
            else {
                //Add cellxfs
                this.mCellXfs.push(cellXfs);
            }
        }
    };
    Workbook.prototype.saveNumberFormats = function () {
        if (this.mNumFmt.size >= 1) {
            var numFmtStyle_1 = '<numFmts count="' + (this.mNumFmt.size) + '">';
            this.mNumFmt.forEach(function (value, key) {
                numFmtStyle_1 += '<numFmt numFmtId="' + value.numFmtId + '" formatCode="' + value.formatCode.replace(/"/g, '&quot;') + '" />';
            });
            return (numFmtStyle_1 += '</numFmts>');
        }
        else {
            return '';
        }
    };
    Workbook.prototype.saveFonts = function () {
        /* tslint:disable-next-line:max-line-length */
        var fontStyle = '<fonts count="' + (this.mFonts.length) + '">';
        if (this.mFonts.length >= 1) {
            for (var _i = 0, _a = this.mFonts; _i < _a.length; _i++) {
                var font = _a[_i];
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
                fontStyle += '<sz val="' + this.pixelsToRowHeight(font.sz) + '" />';
                fontStyle += '<color rgb="' + font.color + '" />';
                fontStyle += '<name val="' + font.name + '" /></font>';
            }
        }
        return fontStyle + '</fonts>';
    };
    Workbook.prototype.saveFills = function () {
        /* tslint:disable-next-line:max-line-length */
        var fillsStyle = '<fills count="' + (this.mFills.size + 2) + '"><fill><patternFill patternType="none"></patternFill></fill><fill><patternFill patternType="gray125"></patternFill></fill>';
        if (this.mFills.size >= 1) {
            this.mFills.forEach(function (value, key) {
                /* tslint:disable-next-line:max-line-length */
                fillsStyle += '<fill><patternFill patternType="solid"><fgColor rgb="' + key + '" /><bgColor rgb="FFFFFFFF" /></patternFill></fill>';
            });
        }
        return fillsStyle + '</fills>';
    };
    Workbook.prototype.saveBorders = function () {
        /* tslint:disable-next-line:max-line-length */
        var bordersStyle = '<borders count="' + (this.mBorders.length + 1) + '"><border><left /><right /><top /><bottom /><diagonal /></border>';
        if (this.mBorders.length >= 1) {
            for (var _i = 0, _a = this.mBorders; _i < _a.length; _i++) {
                var borders = _a[_i];
                if (this.isAllBorder(borders)) {
                    var color = borders.all.color.replace('#', '');
                    var lineStyle = borders.all.lineStyle;
                    /* tslint:disable-next-line:max-line-length */
                    bordersStyle += '<border><left style="' + lineStyle + '"><color rgb="FF' + color + '" /></left><right style="' + lineStyle + '"><color rgb="FF' + color + '" /></right><top style="' + lineStyle + '"><color rgb="FF' + color + '" /></top><bottom style="' + lineStyle + '"><color rgb="FF' + color + '" /></bottom></border>';
                }
                else {
                    /* tslint:disable-next-line:max-line-length */
                    bordersStyle += '<border><left style="' + borders.left.lineStyle + '"><color rgb="FF' + borders.left.color.replace('#', '') + '" /></left><right style="' + borders.right.lineStyle + '"><color rgb="FF' + borders.right.color.replace('#', '') + '" /></right><top style="' + borders.top.lineStyle + '"><color rgb="FF' + borders.top.color.replace('#', '') + '" /></top><bottom style="' + borders.bottom.lineStyle + '"><color rgb="FF' + borders.bottom.color.replace('#', '') + '" /></bottom></border>';
                }
            }
        }
        return bordersStyle + '</borders>';
    };
    Workbook.prototype.saveCellStyles = function () {
        var _this = this;
        var cellStyleString = '<cellStyles  count="' + (this.cellStyles.size) + '">';
        this.cellStyles.forEach(function (value, key) {
            cellStyleString += '<cellStyle name="' + key + '" xfId="' + _this.cellStyles.get(key).xfId + '"';
            if (key === 'Normal') {
                cellStyleString += ' builtinId="0"';
            }
            cellStyleString += ' />';
        });
        return cellStyleString += '</cellStyles>';
    };
    Workbook.prototype.saveCellStyleXfs = function () {
        /* tslint:disable-next-line:max-line-length */
        var cellXfsStyle = '<cellStyleXfs count="' + (this.mCellStyleXfs.length + 1) + '"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" />';
        if (this.mCellStyleXfs.length >= 1) {
            for (var _i = 0, _a = this.mCellStyleXfs; _i < _a.length; _i++) {
                var cellStyleXf = _a[_i];
                /* tslint:disable-next-line:max-line-length */
                cellXfsStyle += '<xf numFmtId="' + cellStyleXf.numFmtId + '" fontId="' + cellStyleXf.fontId + '" fillId="' + cellStyleXf.fillId + '" borderId="' + cellStyleXf.borderId + '" ';
                if (cellStyleXf.alignment !== undefined) {
                    cellXfsStyle += '>' + this.saveAlignment(cellStyleXf) + '</xf>';
                }
                else {
                    cellXfsStyle += ' />';
                }
            }
        }
        return cellXfsStyle + '</cellStyleXfs>';
    };
    Workbook.prototype.saveCellXfs = function () {
        /* tslint:disable-next-line:max-line-length */
        var cellXfsStyle = '<cellXfs count="' + (this.mCellXfs.length + 1) + '"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" />';
        if (this.mCellXfs.length >= 1) {
            for (var _i = 0, _a = this.mCellXfs; _i < _a.length; _i++) {
                var cellXf = _a[_i];
                /* tslint:disable-next-line:max-line-length */
                cellXfsStyle += '<xf numFmtId="' + cellXf.numFmtId + '" fontId="' + cellXf.fontId + '" fillId="' + cellXf.fillId + '" borderId="' + cellXf.borderId + '" xfId="' + cellXf.xfId + '" ';
                if (cellXf.applyAlignment === 1) {
                    cellXfsStyle += 'applyAlignment="1"';
                }
                cellXfsStyle += '>' + this.saveAlignment(cellXf) + '</xf>';
            }
        }
        return cellXfsStyle + '</cellXfs>';
    };
    Workbook.prototype.saveAlignment = function (cellXf) {
        var alignString = '<alignment ';
        if (cellXf.alignment.horizontal !== undefined) {
            alignString += 'horizontal="' + cellXf.alignment.horizontal + '" ';
        }
        if (cellXf.alignment.indent !== undefined && cellXf.alignment.indent !== 0) {
            alignString += 'indent="' + cellXf.alignment.indent + '" ';
        }
        else if (cellXf.alignment.rotation !== undefined && cellXf.alignment.rotation !== 0) {
            alignString += 'textRotation="' + cellXf.alignment.rotation + '" ';
        }
        if (cellXf.alignment.vertical !== undefined) {
            alignString += 'vertical="' + cellXf.alignment.vertical + '" ';
        }
        alignString += 'wrapText="' + cellXf.alignment.wrapText + '" />';
        return alignString;
    };
    Workbook.prototype.saveApp = function (builtInProperties) {
        /* tslint:disable-next-line:max-line-length */
        var appString = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Essential XlsIO</Application>';
        if (builtInProperties !== undefined) {
            if (builtInProperties.manager !== undefined) {
                appString += '<Manager>' + builtInProperties.manager + '</Manager>';
            }
            if (builtInProperties.company !== undefined) {
                appString += '<Company>' + builtInProperties.company + '</Company>';
            }
        }
        this.addToArchive((appString + '</Properties>'), 'docProps/app.xml');
    };
    Workbook.prototype.saveCore = function (builtInProperties) {
        var createdDate = new Date();
        /* tslint:disable-next-line:max-line-length */
        var coreString = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><cp:coreProperties xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties">';
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
            }
            else {
                coreString += '<dcterms:created xsi:type="dcterms:W3CDTF">' + createdDate.toISOString() + '</dcterms:created>';
            }
            if (builtInProperties.modifiedDate !== undefined) {
                /* tslint:disable-next-line:max-line-length */
                coreString += '<dcterms:modified xsi:type="dcterms:W3CDTF">' + builtInProperties.modifiedDate.toISOString() + '</dcterms:modified>';
            }
            else {
                coreString += '<dcterms:modified xsi:type="dcterms:W3CDTF">' + createdDate.toISOString() + '</dcterms:modified>';
            }
        }
        else {
            coreString += '<dcterms:created xsi:type="dcterms:W3CDTF">' + createdDate.toISOString() + '</dcterms:created>';
            coreString += '<dcterms:modified xsi:type="dcterms:W3CDTF">' + createdDate.toISOString() + '</dcterms:modified>';
        }
        /* tslint:disable-next-line:max-line-length */
        coreString += '</cp:coreProperties>';
        this.addToArchive(coreString, 'docProps/core.xml');
    };
    Workbook.prototype.saveTopLevelRelation = function () {
        /* tslint:disable-next-line:max-line-length */
        var topRelation = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml" /><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml" /><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml" /></Relationships>';
        this.addToArchive(topRelation, '_rels/.rels');
    };
    Workbook.prototype.saveWorkbookRelation = function () {
        /* tslint:disable-next-line:max-line-length */
        var wbRelation = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        var length = this.worksheets.length;
        var count = 0;
        for (var i = 0; i < length; i++, count++) {
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
    };
    Workbook.prototype.saveContentType = function () {
        /* tslint:disable-next-line:max-line-length */
        var contentTypeString = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml" /><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" /><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml" /><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml" />';
        var sheetsOverride = '';
        var length = this.worksheets.length;
        for (var i = 0; i < length; i++) {
            /* tslint:disable-next-line:max-line-length */
            sheetsOverride += '<Override PartName="/xl/worksheets/sheet' + (i + 1).toString() + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />';
            if (this.worksheets[i].images != undefined && this.worksheets[i].images.length > 0) {
                /* tslint:disable-next-line:max-line-length */
                sheetsOverride += '<Override PartName="/xl/drawings/drawing' + (i + 1).toString() + '.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml" />';
            }
        }
        if (this.imageCount > 0)
            sheetsOverride += '<Default Extension="png" ContentType="image/png" />';
        if (this.sharedStringCount > 0) {
            /* tslint:disable-next-line:max-line-length */
            contentTypeString += '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" />';
        }
        this.addToArchive((contentTypeString + sheetsOverride + '</Types>'), '[Content_Types].xml');
    };
    Workbook.prototype.addToArchive = function (xmlString, itemName) {
        if (typeof (xmlString) === 'string') {
            var blob = new Blob([xmlString], { type: 'text/plain' });
            var archiveItem = new ZipArchiveItem(blob, itemName);
            this.mArchive.addItem(archiveItem);
        }
        else {
            var archiveItem = new ZipArchiveItem(xmlString, itemName);
            this.mArchive.addItem(archiveItem);
        }
    };
    Workbook.prototype.processMergeCells = function (cell, rowIndex, mergeCells) {
        if (cell.rowSpan !== 0 || cell.colSpan !== 0) {
            var mCell = new MergeCell();
            mCell.x = cell.index;
            mCell.width = cell.colSpan;
            mCell.y = rowIndex;
            mCell.height = cell.rowSpan;
            var startCell = this.getCellName(mCell.y, mCell.x);
            var endCell = this.getCellName(rowIndex + mCell.height, cell.index + mCell.width);
            mCell.ref = startCell + ':' + endCell;
            var mergedCell = mergeCells.add(mCell);
            var start = { x: mCell.x, y: mCell.y };
            var end = {
                x: (cell.index + mCell.width), y: (rowIndex + mCell.height)
            };
            this.updatedMergedCellStyles(start, end, cell);
        }
        return mergeCells;
    };
    Workbook.prototype.updatedMergedCellStyles = function (sCell, eCell, cell) {
        for (var x = sCell.x; x <= eCell.x; x++) {
            for (var y = sCell.y; y <= eCell.y; y++) {
                this.mergedCellsStyle.set(this.getCellName(y, x), { x: x, y: y, styleIndex: cell.styleIndex });
            }
        }
    };
    /**
     * Returns the tick count corresponding to the given year, month, and day.
     * @param year number value of year
     * @param month number value of month
     * @param day number value of day
     */
    Workbook.prototype.dateToTicks = function (year, month, day) {
        var ticksPerDay = 10000 * 1000 * 60 * 60 * 24;
        var daysToMonth365 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
        var daysToMonth366 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
        if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) {
            var days = this.isLeapYear(year) ? daysToMonth366 : daysToMonth365;
            var y = year - 1;
            var n = y * 365 + ((y / 4) | 0) - ((y / 100) | 0) + ((y / 400) | 0) + days[month - 1] + day - 1;
            return n * ticksPerDay;
        }
        throw new Error('Not a valid date');
    };
    /**
     * Return the tick count corresponding to the given hour, minute, second.
     * @param hour number value of hour
     * @param minute number value if minute
     * @param second number value of second
     */
    Workbook.prototype.timeToTicks = function (hour, minute, second) {
        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) {
            var totalSeconds = hour * 3600 + minute * 60 + second;
            return totalSeconds * 10000 * 1000;
        }
        throw new Error('Not valid time');
    };
    /**
     * Checks if given year is a leap year.
     * @param year Year value.
     */
    Workbook.prototype.isLeapYear = function (year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    };
    /**
     * Converts `DateTime` to the equivalent OLE Automation date.
     */
    Workbook.prototype.toOADate = function (date) {
        var ticks = 0;
        /* tslint:disable-next-line:max-line-length */
        ticks = this.dateToTicks(date.getFullYear(), (date.getMonth() + 1), date.getDate()) + this.timeToTicks(date.getHours(), date.getMinutes(), date.getSeconds());
        if (ticks === 0) {
            return 0.0;
        }
        var ticksPerDay = 10000 * 1000 * 60 * 60 * 24;
        var daysTo1899 = (((365 * 4 + 1) * 25 - 1) * 4 + 1) * 4 + ((365 * 4 + 1) * 25 - 1) * 3 - 367;
        var doubleDateOffset = daysTo1899 * ticksPerDay;
        var oaDateMinAsTicks = (((365 * 4 + 1) * 25 - 1) - 365) * ticksPerDay;
        if (ticks < oaDateMinAsTicks) {
            throw new Error('Arg_OleAutDateInvalid');
        }
        var millisPerDay = 1000 * 60 * 60 * 24;
        return ((ticks - doubleDateOffset) / 10000) / millisPerDay;
    };
    return Workbook;
}());
/**
 * BuiltInProperties Class
 * @private
 */
var BuiltInProperties = /** @__PURE__ @class */ (function () {
    function BuiltInProperties() {
    }
    return BuiltInProperties;
}());

/**
 * index class
 */

export { CellStyle, Font, CellXfs, Alignment, CellStyleXfs, CellStyles, NumFmt, Border, Borders, Cell, Cells, Column, Row, Rows, Workbook, BuiltInProperties, Worksheet, HyperLink, Grouping, FreezePane, MergeCell, MergeCells, Worksheets, CsvHelper, ValueFormatter, BlobHelper };
//# sourceMappingURL=ej2-excel-export.es5.js.map
