import { Workbook } from './../src/workbook';
import { Utils } from './../spec/utils.spec';
describe('CellStyle', () => {
    // afterEach(function () {
    //     sleep(3000);
    // });
    // function sleep(millSecs: any) {
    //     let date: any = new Date();
    //     let curDate: any = null;
    //     do { curDate = new Date(); }
    //     while (curDate - date < millSecs);
    // }
    //Methods testcase
	it('BUG_896899_1', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->3*/{ name: 'Date-1', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: '$'},
                /*Style ->4*/{ name: 'Date-2', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: '$' },
                /*Style ->4*/{ name: 'Date-3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'full' },
                /*Style ->4*/{ name: 'Date-4', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'long' },
            ],
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: new Date(), style: { name: 'Date-1' } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { name: 'Date-2' } }] },
                        { index: 3, cells: [{ index: 1, value: new Date(), style: { name: 'Date-3' } }] },
                        { index: 4, cells: [{ index: 1, value: new Date(), style: { name: 'Date-4' } }] },
                    ],
                }]
        }, 'csv');
        book.saveAsBlob('text/csv').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'BUG_896899_1.csv');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('BUG_896899_2', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 1160099.5, style: { numberFormat: 'R$ #,##0.00' } }] },
                    ],
                }]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'BUG_896899_2.csv');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(csvBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });        
    });
    it('Font', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 10, style: { fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true } }] },
                        { index: 2, cells: [{ index: 1, value: 10, style: { fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true } }] },
                        { index: 3, cells: [{ index: 1, value: 10, style: { fontColor: '#C67878' } }] },
                        { index: 4, cells: [{ index: 1, value: 10, style: { fontColor: '#C67878' } }] },
                        { index: 5, cells: [{ index: 1, value: 10, style: { backColor: '#C67878' } }] },
                        { index: 6, cells: [{ index: 1, value: 10, style: { backColor: '#C67878' } }] },
                        { index: 7, cells: [{ index: 1, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'right', vAlign: 'top' } }] },
                        { index: 8, cells: [{ index: 1, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'right', vAlign: 'top' } }] },
                        { index: 9, cells: [{ index: 1, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'center', vAlign: 'center' } }] },
                        { index: 10, cells: [{ index: 1, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'center', vAlign: 'center' } }] },
                        { index: 11, cells: [{ index: 1, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'fill', vAlign: 'justify' } }] },
                        { index: 12, cells: [{ index: 1, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'fill', vAlign: 'justify' } }] },
                        { index: 13, cells: [{ index: 1, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'fill', vAlign: 'justify' } }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Font.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('Font-duplicate', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 10, style: { fontColor: '#C67878', fontName: 'Tahoma' } }] },
                        { index: 2, cells: [{ index: 1, value: 10, style: { fontColor: '#C67878', fontName: 'Tahoma', wrapText: true } }] },
                        { index: 3, cells: [{ index: 1, style: { wrapText: true } }] }
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Font-duplicate.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('Border', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        {
                            index: 1,
                            cells: [{
                                index: 1, value: 'Border', style: {
                                    leftBorder: { color: '#C67878', lineStyle: 'thick' },
                                    rightBorder: { color: '#C67878', lineStyle: 'thick' },
                                    topBorder: { color: '#C67878', lineStyle: 'thick' },
                                    bottomBorder: { color: '#C67878', lineStyle: 'thick' }
                                }
                            }, {
                                index: 2, value: 'Border', style: {
                                    leftBorder: { color: '#C67878', lineStyle: 'thick' },
                                    rightBorder: { color: '#C67878', lineStyle: 'thick' },
                                    topBorder: { color: '#C67878', lineStyle: 'thick' },
                                    bottomBorder: { color: '#C67878', lineStyle: 'thick' }
                                }
                            }]
                        },
                        { index: 2, cells: [{ index: 1, value: 10 }] },
                        {
                            index: 3,
                            cells: [{
                                index: 1,
                                value: 'Border', style: {
                                    leftBorder: {},
                                    rightBorder: {},
                                    topBorder: {},
                                    bottomBorder: {}
                                }
                            }]
                        },
                        { index: 4, cells: [{ index: 1, value: 10 }] },
                        {
                            index: 5,
                            cells: [{
                                index: 1,
                                value: 'Border', style: {
                                    leftBorder: { color: '#C67878' },
                                    rightBorder: { color: '#C67878' },
                                    topBorder: { color: '#C67878' },
                                    bottomBorder: { color: '#C67878' }
                                }
                            }]
                        },
                        { index: 6, cells: [{ index: 1, value: 10 }] },
                        {
                            index: 7,
                            cells: [{
                                index: 1,
                                value: 'Border', style: {
                                    leftBorder: { lineStyle: 'thick' },
                                    rightBorder: { lineStyle: 'thick' },
                                    topBorder: { lineStyle: 'thick' },
                                    bottomBorder: { lineStyle: 'thick' }
                                }
                            }]
                        },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Border.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });

    it('NumberFormat-Date', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: new Date(), style: { numberFormat: "E" } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { numberFormat: "EHm" } }] },
                        { index: 3, cells: [{ index: 1, value: new Date(), style: { numberFormat: "EHms" } }] },
                        { index: 4, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Ed" } }] },
                        { index: 5, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Ehm" } }] },
                        { index: 6, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Ehms" } }] },
                        { index: 7, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Gy" } }] },
                        { index: 8, cells: [{ index: 1, value: new Date(), style: { numberFormat: "GyMMM" } }] },
                        { index: 9, cells: [{ index: 1, value: new Date(), style: { numberFormat: "GyMMMEd" } }] },
                        { index: 10, cells: [{ index: 1, value: new Date(), style: { numberFormat: "GyMMMd" } }] },
                        { index: 11, cells: [{ index: 1, value: new Date(), style: { numberFormat: "H" } }] },
                        { index: 12, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Hm" } }] },
                        { index: 13, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Hms" } }] },
                        { index: 14, cells: [{ index: 1, value: new Date(), style: { numberFormat: "M" } }] },
                        { index: 15, cells: [{ index: 1, value: new Date(), style: { numberFormat: "MEd" } }] },
                        { index: 16, cells: [{ index: 1, value: new Date(), style: { numberFormat: "MMM" } }] },
                        { index: 17, cells: [{ index: 1, value: new Date(), style: { numberFormat: "MMMEd" } }] },
                        { index: 18, cells: [{ index: 1, value: new Date(), style: { numberFormat: "MMMd" } }] },
                        { index: 19, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Md" } }] },
                        { index: 20, cells: [{ index: 1, value: new Date(), style: { numberFormat: "d" } }] },
                        { index: 21, cells: [{ index: 1, value: new Date(), style: { numberFormat: "h" } }] },
                        { index: 22, cells: [{ index: 1, value: new Date(), style: { numberFormat: "hm" } }] },
                        { index: 23, cells: [{ index: 1, value: new Date(), style: { numberFormat: "hms" } }] },
                        { index: 24, cells: [{ index: 1, value: new Date(), style: { numberFormat: "ms" } }] },
                        { index: 25, cells: [{ index: 1, value: new Date(), style: { numberFormat: "y" } }] },
                        { index: 26, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yM" } }] },
                        { index: 27, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMEd" } }] },
                        { index: 28, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMMM" } }] },
                        { index: 29, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMMMEd" } }] },
                        { index: 30, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMMMd" } }] },
                        { index: 31, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMd" } }] },
                        // { index: 32, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yQQQ" } }] },
                        // { index: 33, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yQQQQ" } }] },
                        // { index: 34, cells: [{ index: 1, value: new Date(), style: { numberFormat: "GyMMMEdhms" } }] },
                        { index: 35, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Ehms" } }] },
                        // { index: 36, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yQQQHm" } }] },
                        // { index: 37, cells: [{ index: 1, value: new Date(), style: { numberFormat: "MMMEdhm" } }] },
                        // { index: 38, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMMMdhm" } }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'NumberFormat-Date.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('NumberFormat', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 20, style: { numberFormat: "A5" } }] },
                        { index: 2, cells: [{ index: 1, value: 20, style: { numberFormat: "A3" } }] },
                        { index: 3, cells: [{ index: 1, value: 20, style: { numberFormat: "P3" } }] },
                        { index: 4, cells: [{ index: 1, value: 20, style: { numberFormat: "P2" } }] },
                        { index: 5, cells: [{ index: 1, value: 20, style: { numberFormat: "C2" } }] },
                        { index: 6, cells: [{ index: 1, value: 20, style: { numberFormat: "C" } }] },
                        { index: 7, cells: [{ index: 1, value: 20, style: { numberFormat: "N" } }] },
                        { index: 8, cells: [{ index: 1, value: 20, style: { numberFormat: "N2" } }] },
                        { index: 9, cells: [{ index: 1, value: 20, style: { numberFormat: "N3" } }] },
                        { index: 10, cells: [{ index: 1, value: 20, style: { numberFormat: "N4" } }] }
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'NumberFormat.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('NumberFormat-Culture-Currency', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 20, style: { numberFormat: "A5" } }] },
                        { index: 2, cells: [{ index: 1, value: 20, style: { numberFormat: "A3" } }] },
                        { index: 3, cells: [{ index: 1, value: 20, style: { numberFormat: "P3" } }] },
                        { index: 4, cells: [{ index: 1, value: 20, style: { numberFormat: "P2" } }] },
                        { index: 5, cells: [{ index: 1, value: 20, style: { numberFormat: "C2" } }] },
                        { index: 6, cells: [{ index: 1, value: 20, style: { numberFormat: "C" } }] },
                        { index: 7, cells: [{ index: 1, value: 20, style: { numberFormat: "N" } }] },
                        { index: 8, cells: [{ index: 1, value: 20, style: { numberFormat: "N2" } }] },
                        { index: 9, cells: [{ index: 1, value: 20, style: { numberFormat: "N3" } }] },
                        { index: 10, cells: [{ index: 1, value: 20, style: { numberFormat: "N4" } }] }
                    ],
                }]
        }, 'xlsx', 'de-DE', 'EUR');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'NumberFormat-Culture-Currency.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('NumberFormat-duplicate', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Currency-1', fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: 'C' },
                /*Style ->2*/{ name: 'Currency-2', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: 'C' },
                /*Style ->3*/{ name: 'Date-1', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: 'MMM' },
                /*Style ->4*/{ name: 'Date-3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'yMd' },
                /*Style ->4*/{ name: 'Date-4', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'mm-dd-yy' },
            ],
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'yMd' } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'yMd', backColor: '#C67978' } }] },
                        { index: 3, cells: [{ index: 1, value: new Date(), style: { backColor: '#C67878' } }] },
                        { index: 4, cells: [{ index: 1, value: new Date() }] },
                        { index: 5, cells: [{ index: 1, value: 10.0, style: { name: 'Currency-1' } }] },
                        { index: 6, cells: [{ index: 1, value: 10.0, style: { name: 'Currency-2' } }] },
                        { index: 7, cells: [{ index: 1, value: new Date(), style: { name: 'Date-1' } }] },
                        { index: 8, cells: [{ index: 1, value: new Date(), style: { name: 'Date-3' } }] },
                        { index: 9, cells: [{ index: 1, value: new Date(), style: { name: 'Date-4' } }] },
                        { index: 10, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'yyyy-MM-dd' } }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'NumberFormat-duplicate.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('fill-duplicate', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 'text', style: { backColor: '#C67878', numberFormat: 'yyyy-mm-dd' } }] },
                        { index: 2, cells: [{ index: 1, value: 'text2', style: { numberFormat: 'yyyy-mm-dd', backColor: '#C67978' } }] },
                        { index: 3, cells: [{ index: 1, value: 'text3', style: { backColor: '#C67878' } }] },
                        { index: 4, cells: [{ index: 1, value: new Date() }] },
                        { index: 5, cells: [{ index: 1, value: 10, style: { backColor: '#C67978' } }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'fill-duplicate.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('MixedFormats', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 10.05, style: { numberFormat: 'C' } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'yMd' } }] },
                        { index: 3, cells: [{ index: 1, value: 21.95, style: { numberFormat: '$ #,##0.00' } }] },
                        { index: 4, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'mm-dd-yy' } }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'MixedFormats.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('NumberFormat-full-long', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->3*/{ name: 'Date-1', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: 'short' },
                /*Style ->4*/{ name: 'Date-2', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'medium' },
                /*Style ->4*/{ name: 'Date-3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'full' },
                /*Style ->4*/{ name: 'Date-4', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'long' },
            ],
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: new Date(), style: { name: 'Date-1' } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { name: 'Date-2' } }] },
                        { index: 3, cells: [{ index: 1, value: new Date(), style: { name: 'Date-3' } }] },
                        { index: 4, cells: [{ index: 1, value: new Date(), style: { name: 'Date-4' } }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'NumberFormat-full-long.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('number-format-with-type', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->3*/{ name: 'time-1', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: 'short', type: 'time' },
                /*Style ->4*/{ name: 'time-2', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'medium', type: 'time' },
                /*Style ->4*/{ name: 'time-3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'full', type: 'time' },
                /*Style ->4*/{ name: 'time-4', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'long', type: 'time' },
                /*Style ->3*/{ name: 'date-1', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: 'short', type: 'date' },
                /*Style ->4*/{ name: 'date-2', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'medium', type: 'date' },
                /*Style ->4*/{ name: 'date-3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'full', type: 'date' },
                /*Style ->4*/{ name: 'date-4', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'long', type: 'date' },
                /*Style ->3*/{ name: 'datetime-1', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: 'short', type: 'datetime' },
                /*Style ->4*/{ name: 'datetime-2', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'medium', type: 'datetime' },
                /*Style ->4*/{ name: 'datetime-3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'full', type: 'datetime' },
                /*Style ->4*/{ name: 'datetime-4', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'long', type: 'datetime' },
                /*Style ->2*/{ name: 'Currency-1', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: 'C' },
                /*Style ->2*/{ name: 'Currency-2', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: 'C2' },
            ],
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        {
                            index: 1, cells: [
                                { index: 1, value: new Date(), style: { name: 'date-1' } },
                                { index: 2, value: new Date(), style: { name: 'time-1' } },
                                { index: 3, value: new Date(), style: { name: 'datetime-1' } }
                            ]
                        },
                        {
                            index: 2, cells: [
                                { index: 1, value: new Date(), style: { name: 'date-2' } },
                                { index: 2, value: new Date(), style: { name: 'time-2' } },
                                { index: 3, value: new Date(), style: { name: 'datetime-2' } }
                            ]
                        },
                        {
                            index: 3, cells: [
                                { index: 1, value: new Date(), style: { name: 'date-3' } },
                                { index: 2, value: new Date(), style: { name: 'time-3' } },
                                { index: 3, value: new Date(), style: { name: 'datetime-3' } }
                            ]
                        },
                        {
                            index: 4, cells: [
                                { index: 1, value: new Date(), style: { name: 'date-4' } },
                                { index: 2, value: new Date(), style: { name: 'time-4' } },
                                { index: 3, value: new Date(), style: { name: 'datetime-4' } }
                            ]
                        },
                        { index: 5, cells: [{ index: 1, value: 20, style: { numberFormat: "A5" } }] },
                        { index: 6, cells: [{ index: 1, value: 20, style: { numberFormat: "A3" } }] },
                        { index: 7, cells: [{ index: 1, value: 20, style: { numberFormat: "P3" } }] },
                        { index: 8, cells: [{ index: 1, value: 20, style: { numberFormat: "P2" } }] },
                        { index: 9, cells: [{ index: 1, value: 20, style: { numberFormat: "C2" } }] },
                        { index: 10, cells: [{ index: 1, value: 20, style: { numberFormat: "C" } }] },
                        { index: 11, cells: [{ index: 1, value: 20, style: { numberFormat: "N" } }] },
                        { index: 12, cells: [{ index: 1, value: 20, style: { numberFormat: "N2" } }] },
                        { index: 13, cells: [{ index: 1, value: 20, style: { numberFormat: "N3" } }] },
                        { index: 14, cells: [{ index: 1, value: 20, style: { numberFormat: "N4" } }] },
                        { index: 15, cells: [{ index: 1, value: 21.95, style: { numberFormat: '$ #,##0.00' } }] },
                        { index: 16, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'mm-dd-yy' } }] },
                        { index: 17, cells: [{ index: 1, value: 'text', style: { backColor: '#C67878', numberFormat: 'yyyy-mm-dd' } }] },
                        { index: 18, cells: [{ index: 1, value: 'text2', style: { numberFormat: 'yyyy-mm-dd', backColor: '#C67978' } }] },
                        { index: 19, cells: [{ index: 1, value: new Date(), style: { numberFormat: "E" } }] },
                        { index: 20, cells: [{ index: 1, value: new Date(), style: { numberFormat: "EHm" } }] },
                        { index: 21, cells: [{ index: 1, value: new Date(), style: { numberFormat: "EHms" } }] },
                        { index: 22, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Ed" } }] },
                        { index: 23, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Ehm" } }] },
                        { index: 24, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Ehms" } }] },
                        { index: 25, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Gy" } }] },
                        { index: 26, cells: [{ index: 1, value: new Date(), style: { numberFormat: "GyMMM" } }] },
                        { index: 27, cells: [{ index: 1, value: new Date(), style: { numberFormat: "GyMMMEd" } }] },
                        { index: 28, cells: [{ index: 1, value: new Date(), style: { numberFormat: "GyMMMd" } }] },
                        { index: 29, cells: [{ index: 1, value: new Date(), style: { numberFormat: "H" } }] },
                        { index: 30, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Hm" } }] },
                        { index: 31, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Hms" } }] },
                        { index: 32, cells: [{ index: 1, value: new Date(), style: { numberFormat: "M" } }] },
                        { index: 33, cells: [{ index: 1, value: new Date(), style: { numberFormat: "MEd" } }] },
                        { index: 34, cells: [{ index: 1, value: new Date(), style: { numberFormat: "MMM" } }] },
                        { index: 35, cells: [{ index: 1, value: new Date(), style: { numberFormat: "MMMEd" } }] },
                        { index: 36, cells: [{ index: 1, value: new Date(), style: { numberFormat: "MMMd" } }] },
                        { index: 37, cells: [{ index: 1, value: new Date(), style: { numberFormat: "Md" } }] },
                        { index: 38, cells: [{ index: 1, value: new Date(), style: { numberFormat: "d" } }] },
                        { index: 39, cells: [{ index: 1, value: new Date(), style: { numberFormat: "h" } }] },
                        { index: 40, cells: [{ index: 1, value: new Date(), style: { numberFormat: "hm" } }] },
                        { index: 41, cells: [{ index: 1, value: new Date(), style: { numberFormat: "hms" } }] },
                        { index: 42, cells: [{ index: 1, value: new Date(), style: { numberFormat: "ms" } }] },
                        { index: 43, cells: [{ index: 1, value: new Date(), style: { numberFormat: "y" } }] },
                        { index: 44, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yM" } }] },
                        { index: 45, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMEd" } }] },
                        { index: 46, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMMM" } }] },
                        { index: 47, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMMMEd" } }] },
                        { index: 48, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMMMd" } }] },
                        { index: 49, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yMd" } }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'number-format-with-type.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('Text-Indent', (done) => {
        let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Indent-Left', indent: 10 },
                /*Style ->2*/{ name: 'Indent-Right', hAlign: 'right', indent: 10 },
                /*Style ->3*/{ name: 'Indent', hAlign: 'centre', indent: 10 },
                /*Style ->4*/{ name: 'Indent-Left-dup', indent: 10 },
            ],
            worksheets: [
                {
                    name: 'CellStyle',
                    columns: [
                        /*column -> 1*/{
                            index: 1,
                            width: 200,
                        },
                        /*column -> 3*/{
                            index: 2,
                            width: 200,
                        },
                        /*column -> 3*/{
                            index: 3,
                            width: 200,
                        },
                        /*column -> 4*/{
                            index: 4,
                            width: 200,
                        },
                        /*column -> 5*/{
                            index: 5,
                            width: 200,
                        },
                        /*column -> 6*/{
                            index: 6,
                            width: 200,
                        }
                    ],
                    rows: [
                        {
                            index: 1,
                            cells: [
                                {
                                    index: 1, value: 'Horizontal alignment right',
                                    style: {
                                        hAlign: 'right',
                                        indent: 10
                                    }
                                },
                                {
                                    index: 2, value: 'Horizontal alignment center to left',
                                    /*Cell Style - Horizontal alignment - Center*/
                                    style: {
                                        hAlign: 'center',
                                        indent: 10
                                    }
                                },
                                {
                                    index: 3, value: 'Horizontal alignment left',
                                    /*Cell Style - Horizontal alignment - left*/
                                    style: {
                                        hAlign: 'left',
                                        indent: 10
                                    }
                                },
                                {
                                    index: 4, value: 'Horizontal alignment right',
                                    style: {
                                        hAlign: 'right',
                                        indent: 10
                                    }
                                },
                                {
                                    index: 5, value: 'Horizontal alignment center to left',
                                    /*Cell Style - Horizontal alignment - Center*/
                                    style: {
                                        hAlign: 'center',
                                        indent: 10
                                    }
                                },
                                {
                                    index: 6, value: 'Horizontal alignment left',
                                    /*Cell Style - Horizontal alignment - left*/
                                    style: {
                                        hAlign: 'left',
                                        indent: 10
                                    }
                                }
                            ]
                        },
                        {
                            index: 2,
                            cells: [
                                {
                                    index: 1, value: 'Horizontal alignment right',
                                    style: {
                                        name: 'Indent-Right'
                                    }
                                },
                                {
                                    index: 2, value: 'Horizontal alignment center to left',
                                    /*Cell Style - Horizontal alignment - Center*/
                                    style: {
                                        name: 'Indent'
                                    }
                                },
                                {
                                    index: 3, value: 'Horizontal alignment left',
                                    /*Cell Style - Horizontal alignment - left*/
                                    style: {
                                        name: 'Indent-Left'
                                    }
                                },
                                {
                                    index: 4, value: 'Horizontal alignment left',
                                    /*Cell Style - Horizontal alignment - left*/
                                    style: {
                                        name: 'Indent-Left-dup'
                                    }
                                }
                            ]
                        }
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'TextIndent.xlsx');
                done();
            } else {
                let reader: FileReader = new FileReader();
                reader.readAsArrayBuffer(xlBlob.blobData);
                reader.onload = (): void => {
                    if (reader.readyState == 2) { // DONE == 2
                        expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                        done();
                    }
                }
            }
        });
    });
    it('Merged-Cells-CellStyle', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellMerge',
                    rows: [
                        {
                            index: 2, cells: [
                                {
                                    index: 2,
                                    rowSpan: 2,
                                    colSpan: 2,
                                    value: 'Merge text', style: {
                                        leftBorder: { lineStyle: 'thick' },
                                        rightBorder: { lineStyle: 'thick' },
                                        topBorder: { lineStyle: 'thick' },
                                        bottomBorder: { lineStyle: 'thick' }
                                    }
                                },
                            ]
                        },
                        {
                            index: 5, cells: [
                                {
                                    index: 2,
                                    rowSpan: 2,
                                    colSpan: 2,
                                    value: 'Merge text', style: {
                                        leftBorder: { lineStyle: 'thick' },
                                        rightBorder: { lineStyle: 'thick' },
                                        topBorder: { lineStyle: 'thick' },
                                        bottomBorder: { lineStyle: 'thick' }
                                    }
                                },
                                {
                                    index: 3,
                                    value: 'Merge text'
                                }
                            ]
                        },
                        {
                            index: 6, cells: [
                                {
                                    index: 2,
                                    value: 'Merge text',
                                },
                                {
                                    index: 3,
                                    value: 'Merge text',
                                }
                            ]
                        },
                        {
                            index: 10, cells: [
                                {
                                    index: 2,
                                    rowSpan: 2,
                                    colSpan: 2,
                                    value: 'Merge text', style: {
                                        leftBorder: { lineStyle: 'thick' },
                                        rightBorder: { lineStyle: 'thick' },
                                        topBorder: { lineStyle: 'thick' },
                                        bottomBorder: { lineStyle: 'thick' }
                                    }
                                }
                            ]
                        },
                        {
                            index: 11, cells: [
                                {
                                    index: 2,
                                    value: 'Merge text',
                                },
                                {
                                    index: 3,
                                    value: 'Merge text',
                                }
                            ]
                        },
                        {
                            index: 14, cells: [
                                {
                                    index: 2,
                                    rowSpan: 2,
                                    colSpan: 2,
                                    value: 'Merge text', style: {
                                        leftBorder: { lineStyle: 'thick' },
                                        rightBorder: { lineStyle: 'thick' },
                                        topBorder: { lineStyle: 'thick' },
                                        bottomBorder: { lineStyle: 'thick' }
                                    }
                                },
                                {
                                    index: 3,
                                    value: 'Merge text',
                                },
                            ]
                        }
                    ]
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Merged-Cells-CellStyle.xlsx');
                done();
            } else {
                let reader: FileReader = new FileReader();
                reader.readAsArrayBuffer(xlBlob.blobData);
                reader.onload = (): void => {
                    if (reader.readyState == 2) { // DONE == 2
                        expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                        done();
                    }
                }
            }
        });
    });
    it('Text-Rotation', (done) => {
        let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Rotation', rotation: 30 },
              ],
            worksheets: [
                {
                    name: 'TextRotation',
                    rows: [
                        {
                            index: 1,
                            cells: [
                                {
                                    index: 1, value: 'Text1',
                                    style: {
                                        hAlign: 'right',
                                        rotation: 45
                                    }
                                },
                                {
                                    index: 2, value: 'Text2',
                                    style: {
                                        hAlign: 'center',
                                        rotation: 90
                                    }
                                },
                                {
                                    index: 3, value: 'Text3',
                                    style: {
                                        hAlign: 'left',
                                        rotation: 120
                                    }
                                }
                            ]
                        },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'TextRotation.xlsx');
                done();
            } else {
                let reader: FileReader = new FileReader();
                reader.readAsArrayBuffer(xlBlob.blobData);
                reader.onload = (): void => {
                    if (reader.readyState == 2) { // DONE == 2
                        expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                        done();
                    }
                }
            }
        });
    });
    it('Custom-NumberFormat-Date', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: new Date(), style: { numberFormat: "ccc dd.MM.yyyy" } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { numberFormat: "ccc" } }] },
                        { index: 3, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yyy" } }] },
                        { index: 4, cells: [{ index: 1, value: new Date(), style: { numberFormat: "LLL" } }] },
                        { index: 5, cells: [{ index: 1, value: new Date(), style: { numberFormat: "EEE" } }] },
                        { index: 6, cells: [{ index: 1, value: new Date(), style: { numberFormat: "d" } }] },
                        { index: 7, cells: [{ index: 1, value: new Date(), style: { numberFormat: "m" } }] },
                        { index: 8, cells: [{ index: 1, value: new Date(), style: { numberFormat: "s" } }] },
                        { index: 9, cells: [{ index: 1, value: new Date(), style: { numberFormat: "hh:mm:ss a" } }] },
                        { index: 10, cells: [{ index: 1, value: new Date(), style: { numberFormat: "z" } }] },
                        { index: 11, cells: [{ index: 1, value: new Date(), style: { numberFormat: "hh" } }] },  
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Custom-NumberFormat-Date.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('Rich-Text-Font', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rich-Text',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: '<font color=\'red\' size=\'12\'>McFadden DG</font> Mike' }] },
                        { index: 2, cells: [{ index: 1, value: 'Hodges E, <b>Rosebrock AP</b>' }] },
                        { index: 3, cells: [{ index: 1, value: '<i> Chen FK</i>' }] },
                        { index: 4, cells: [{ index: 1, value: '<u>This is some text!</u> Plain Text' }] },
                        { index: 5, cells: [{ index: 1, value: '<font face="verdana" color="#CD5C5C" size="12">This is some text!</font> <b>Plain Text</b>' }] },
                        { index: 6, cells: [{ index: 1, value: '<font size="12" face="Segoe UI" color="blue" >This is some text!</font> <i>Plain Text</i>' }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Rich-Text.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
    it('NumberFormatGermanCulture', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 20, style: { numberFormat: "A5" } }] },
                        { index: 2, cells: [{ index: 1, value: 20, style: { numberFormat: "A3" } }] },
                        { index: 3, cells: [{ index: 1, value: 20, style: { numberFormat: "P3" } }] },
                        { index: 4, cells: [{ index: 1, value: 20, style: { numberFormat: "P2" } }] },
                        { index: 5, cells: [{ index: 1, value: 20, style: { numberFormat: "C2" } }] },
                        { index: 6, cells: [{ index: 1, value: 20, style: { numberFormat: "C" } }] },
                        { index: 7, cells: [{ index: 1, value: 20, style: { numberFormat: "N" } }] },
                        { index: 8, cells: [{ index: 1, value: 20, style: { numberFormat: "N2" } }] },
                        { index: 9, cells: [{ index: 1, value: 20, style: { numberFormat: "N3" } }] },
                        { index: 10, cells: [{ index: 1, value: 20, style: { numberFormat: "N4" } }] }
                    ],
                }]
        }, 'xlsx', "de-DE");
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'NumberFormatGermanCulture.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });    
    it('StrikeThrough', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'StrikeThrough',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 'Strikethrough', style: { fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, strikeThrough: true } }] },
                        { index: 2, cells: [{ index: 1, value: 10, style: { fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, strikeThrough: true } }] },
                        { index: 3, cells: [{ index: 1, value: 'Strikethrough', style: { fontColor: '#C67878', strikeThrough: true } }] },
                        { index: 4, cells: [{ index: 1, value: 'Strikethrough', style: { backColor: '#C67878', strikeThrough: true } }] },
                        { index: 5, cells: [{ index: 1, value: 'Strikethrough', style: { wrapText: true, hAlign: 'right', vAlign: 'top', strikeThrough: true } }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'StrikeThrough.xlsx');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
    });
});