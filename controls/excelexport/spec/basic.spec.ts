import { Workbook } from './../src/workbook';
import { Utils } from './../spec/utils.spec';
import './../node_modules/es6-promise/dist/es6-promise';


describe('ExcelCreation', () => {
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
    it('CurrencyGroup', (done) => {
        let book: Workbook = new Workbook({
           worksheets: [
                {
                    rows: [
                        { index: 1, cells: [{ index: 1, value:10000, style: { numberFormat:"C2" } }] },
                        { index: 2, cells: [{ index: 1, value:250000, style: { numberFormat:"C3" } }] },
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'CurrencyGrouping.xlsx');
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
    it('Empty-with-style', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->4*/{ name: 'DateStyle', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: 'mm-dd-yy' },
            ],
            worksheets: [
                {
                    rows: [
                        { index: 1, cells: [{ index: 1, style: { fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true } }] },
                        { index: 2, cells: [{ index: 1, style: { name: 'DateStyle' } }] },
                        { index: 3, cells: [{ index: 1, style: { fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true } }] },
                        { index: 4, cells: [{ index: 1, }] },
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EmptyCellStyle.xlsx');
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
    it('Number', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                    /*row -> 1*/ { index: 1, cells: [{ index: 1, value: 10.005 }] }, /*Number*/
                        { index: 2, cells: [{ index: 1, value: -10.005 }] },/*negative number*/
                    ]
                },
                {}
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Basic-Number.xlsx');
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
    //Methods testcase
    it('Text', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                    /*row -> 1*/ { index: 1, cells: [{ index: 1, value: "Hello" }, { index: 2, value: "World" }, { index: 3, value: "Hello" }] }, /*Text*/
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Basic-Text.xlsx');
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
    //Methods testcase
    it('Boolean', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                    /*row -> 1*/ { index: 1, cells: [{ index: 1, value: true }, { index: 2, value: false }] }, /*Boolean*/
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Boolean.xlsx');
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
    //Methods testcase
    it('Date', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                        {
                            index: 1,
                            cells: [
                                { index: 1, value: 'Thu Jul 04 1996 23:59:59 GMT+0530 (India Standard Time)' },
                                { index: 2, value: new Date('Thu Jul 04 1996 23:59:59 GMT+0530 (India Standard Time)') }
                            ]
                        },
                        {
                            index: 2,
                            cells: [
                                { index: 1, value: 'Thu Jul 04 1996 11:10:59 GMT+0530 (India Standard Time)' },
                                { index: 2, value: new Date('Thu Jul 04 1996 11:10:59 GMT+0530 (India Standard Time)') }
                            ]
                        },
                        {
                            index: 3,
                            cells: [
                                { index: 1, value: 'Thu Jul 04 1996 00:00:00 GMT+0530 (India Standard Time)' },
                                { index: 2, value: new Date('Thu Jul 04 1996 00:00:00 GMT+0530 (India Standard Time)') }
                            ]
                        },
                        {
                            index: 4,
                            cells: [
                                { index: 1, value: 'Sun Dec 31 2017 23:59:59 GMT+0530 (India Standard Time)' },
                                { index: 2, value: new Date(2017, 11, 31, 23, 59, 59) }
                            ]
                        },
                        {
                            index: 5,
                            cells: [
                                { index: 1, value: 'Thu Jan 1 2017 00:00:00 GMT+0530 (India Standard Time)' },
                                { index: 2, value: new Date(2017, 0, 1) }
                            ]
                        },
                        {
                            index: 6,
                            cells: [
                                { index: 1, value: new Date(24, 1, 1, 1, 0, 0) }
                            ]
                        }


                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Date.xlsx');
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
    it('Text-All-Possibilities', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                        { index: 1, cells: [{ index: 1, value: ' ' }, { index: 2, value: ' ' }] },
                        { index: 2, cells: [{ index: 1, value: '!' }, { index: 2, value: '!' }] },
                        { index: 3, cells: [{ index: 1, value: '"' }, { index: 2, value: '"' }] },
                        { index: 4, cells: [{ index: 1, value: '#' }, { index: 2, value: '#' }] },
                        { index: 5, cells: [{ index: 1, value: '$' }, { index: 2, value: '$' }] },
                        { index: 6, cells: [{ index: 1, value: '%' }, { index: 2, value: '%' }] },
                        { index: 7, cells: [{ index: 1, value: '&' }, { index: 2, value: '&' }] },
                        { index: 8, cells: [{ index: 1, value: '\'' }, { index: 2, value: '\'' }] },
                        { index: 9, cells: [{ index: 1, value: '(' }, { index: 2, value: '(' }] },
                        { index: 10, cells: [{ index: 1, value: ')' }, { index: 2, value: ')' }] },
                        { index: 11, cells: [{ index: 1, value: '*' }, { index: 2, value: '*' }] },
                        { index: 12, cells: [{ index: 1, value: '+' }, { index: 2, value: '+' }] },
                        { index: 13, cells: [{ index: 1, value: ',' }, { index: 2, value: ',' }] },
                        { index: 14, cells: [{ index: 1, value: '-' }, { index: 2, value: '-' }] },
                        { index: 15, cells: [{ index: 1, value: '.' }, { index: 2, value: '.' }] },
                        { index: 16, cells: [{ index: 1, value: '/' }, { index: 2, value: '/' }] },
                        { index: 17, cells: [{ index: 1, value: '0' }, { index: 2, value: '0' }] },
                        { index: 18, cells: [{ index: 1, value: '1' }, { index: 2, value: '1' }] },
                        { index: 19, cells: [{ index: 1, value: '2' }, { index: 2, value: '2' }] },
                        { index: 20, cells: [{ index: 1, value: '3' }, { index: 2, value: '3' }] },
                        { index: 21, cells: [{ index: 1, value: '4' }, { index: 2, value: '4' }] },
                        { index: 22, cells: [{ index: 1, value: '5' }, { index: 2, value: '5' }] },
                        { index: 23, cells: [{ index: 1, value: '6' }, { index: 2, value: '6' }] },
                        { index: 24, cells: [{ index: 1, value: '7' }, { index: 2, value: '7' }] },
                        { index: 25, cells: [{ index: 1, value: '8' }, { index: 2, value: '8' }] },
                        { index: 26, cells: [{ index: 1, value: '9' }, { index: 2, value: '9' },] },
                        { index: 27, cells: [{ index: 1, value: ':' }, { index: 2, value: ':' },] },
                        { index: 28, cells: [{ index: 1, value: ';' }, { index: 2, value: ';' }] },
                        { index: 29, cells: [{ index: 1, value: '<' }, { index: 2, value: '<' }] },
                        { index: 30, cells: [{ index: 1, value: '=' }, { index: 2, value: '=' }] },
                        { index: 31, cells: [{ index: 1, value: '>' }, { index: 2, value: '>' }] },
                        { index: 32, cells: [{ index: 1, value: '?' }, { index: 2, value: '?' }] },
                        { index: 33, cells: [{ index: 1, value: '@' }, { index: 2, value: '@' }] },
                        { index: 34, cells: [{ index: 1, value: 'A' }, { index: 2, value: 'A' }] },
                        { index: 35, cells: [{ index: 1, value: 'B' }, { index: 2, value: 'B' }] },
                        { index: 36, cells: [{ index: 1, value: 'C' }, { index: 2, value: 'C' }] },
                        { index: 37, cells: [{ index: 1, value: 'D' }, { index: 2, value: 'D' }] },
                        { index: 38, cells: [{ index: 1, value: 'E' }, { index: 2, value: 'E' }] },
                        { index: 39, cells: [{ index: 1, value: 'F' }, { index: 2, value: 'F' }] },
                        { index: 40, cells: [{ index: 1, value: 'G' }, { index: 2, value: 'G' }] },
                        { index: 41, cells: [{ index: 1, value: 'H' }, { index: 2, value: 'H' }] },
                        { index: 42, cells: [{ index: 1, value: 'I' }, { index: 2, value: 'I' }] },
                        { index: 43, cells: [{ index: 1, value: 'J' }, { index: 2, value: 'J' }] },
                        { index: 44, cells: [{ index: 1, value: 'K' }, { index: 2, value: 'K' }] },
                        { index: 45, cells: [{ index: 1, value: 'L' }, { index: 2, value: 'L' }] },
                        { index: 46, cells: [{ index: 1, value: 'M' }, { index: 2, value: 'M' }] },
                        { index: 47, cells: [{ index: 1, value: 'N' }, { index: 2, value: 'N' }] },
                        { index: 48, cells: [{ index: 1, value: 'O' }, { index: 2, value: 'O' }] },
                        { index: 49, cells: [{ index: 1, value: 'P' }, { index: 2, value: 'P' }] },
                        { index: 50, cells: [{ index: 1, value: 'Q' }, { index: 2, value: 'Q' }] },
                        { index: 51, cells: [{ index: 1, value: 'R' }, { index: 2, value: 'R' }] },
                        { index: 52, cells: [{ index: 1, value: 'S' }, { index: 2, value: 'S' }] },
                        { index: 53, cells: [{ index: 1, value: 'T' }, { index: 2, value: 'T' }] },
                        { index: 54, cells: [{ index: 1, value: 'U' }, { index: 2, value: 'U' }] },
                        { index: 55, cells: [{ index: 1, value: 'V' }, { index: 2, value: 'V' }] },
                        { index: 56, cells: [{ index: 1, value: 'W' }, { index: 2, value: 'W' }] },
                        { index: 57, cells: [{ index: 1, value: 'X' }, { index: 2, value: 'X' }] },
                        { index: 58, cells: [{ index: 1, value: 'Y' }, { index: 2, value: 'Y' }] },
                        { index: 59, cells: [{ index: 1, value: 'Z' }, { index: 2, value: 'Z' }] },
                        { index: 60, cells: [{ index: 1, value: '[' }, { index: 2, value: '[' }] },
                        { index: 61, cells: [{ index: 1, value: '\\' }, { index: 2, value: '\\' }] },
                        { index: 62, cells: [{ index: 1, value: ']' }, { index: 2, value: ']' }] },
                        { index: 63, cells: [{ index: 1, value: '^' }, { index: 2, value: '^' }] },
                        { index: 64, cells: [{ index: 1, value: '_' }, { index: 2, value: '_' }] },
                        { index: 65, cells: [{ index: 1, value: '`' }, { index: 2, value: '`' }] },
                        { index: 66, cells: [{ index: 1, value: 'a' }, { index: 2, value: 'a' }] },
                        { index: 67, cells: [{ index: 1, value: 'b' }, { index: 2, value: 'b' }] },
                        { index: 68, cells: [{ index: 1, value: 'c' }, { index: 2, value: 'c' }] },
                        { index: 69, cells: [{ index: 1, value: 'd' }, { index: 2, value: 'd' }] },
                        { index: 70, cells: [{ index: 1, value: 'e' }, { index: 2, value: 'e' }] },
                        { index: 71, cells: [{ index: 1, value: 'f' }, { index: 2, value: 'f' }] },
                        { index: 72, cells: [{ index: 1, value: 'g' }, { index: 2, value: 'g' }] },
                        { index: 73, cells: [{ index: 1, value: 'h' }, { index: 2, value: 'h' }] },
                        { index: 74, cells: [{ index: 1, value: 'i' }, { index: 2, value: 'i' }] },
                        { index: 75, cells: [{ index: 1, value: 'j' }, { index: 2, value: 'j' }] },
                        { index: 76, cells: [{ index: 1, value: 'k' }, { index: 2, value: 'k' }] },
                        { index: 77, cells: [{ index: 1, value: 'l' }, { index: 2, value: 'l' }] },
                        { index: 78, cells: [{ index: 1, value: 'm' }, { index: 2, value: 'm' }] },
                        { index: 79, cells: [{ index: 1, value: 'n' }, { index: 2, value: 'n' }] },
                        { index: 80, cells: [{ index: 1, value: 'o' }, { index: 2, value: 'o' }] },
                        { index: 81, cells: [{ index: 1, value: 'p' }, { index: 2, value: 'p' }] },
                        { index: 82, cells: [{ index: 1, value: 'q' }, { index: 2, value: 'q' }] },
                        { index: 83, cells: [{ index: 1, value: 'r' }, { index: 2, value: 'r' }] },
                        { index: 84, cells: [{ index: 1, value: 's' }, { index: 2, value: 's' }] },
                        { index: 85, cells: [{ index: 1, value: 't' }, { index: 2, value: 't' }] },
                        { index: 86, cells: [{ index: 1, value: 'u' }, { index: 2, value: 'u' }] },
                        { index: 87, cells: [{ index: 1, value: 'v' }, { index: 2, value: 'v' }] },
                        { index: 88, cells: [{ index: 1, value: 'w' }, { index: 2, value: 'w' }] },
                        { index: 89, cells: [{ index: 1, value: 'x' }, { index: 2, value: 'x' }] },
                        { index: 90, cells: [{ index: 1, value: 'y' }, { index: 2, value: 'y' }] },
                        { index: 91, cells: [{ index: 1, value: 'z' }, { index: 2, value: 'z' }] },
                        { index: 92, cells: [{ index: 1, value: '{' }, { index: 2, value: '{' }] },
                        { index: 93, cells: [{ index: 1, value: '|' }, { index: 2, value: '|' }] },
                        { index: 94, cells: [{ index: 1, value: '}' }, { index: 2, value: '}' }] },
                        { index: 95, cells: [{ index: 1, value: '~' }, { index: 2, value: '~' }] },
                        { index: 96, cells: [{ index: 1, value: '&&<<>>Hello' }] },
                    ]
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Text-All-Possibilities.xlsx');
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
    it('TextValue', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                    /*row -> 1*/ { index: 1, cells: [{ index: 1, value: "&<" }, { index: 2, value: "W&orld" }, { index: 3, value: "<Hello&" }] }, /*Text*/
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'TextValue.xlsx');
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
    it('RTLView', (done) => {
        let book: Workbook = new Workbook({
           worksheets: [
                {
                    enableRtl: true,
                    rows: [
                        { index: 1, cells: [{ index: 1, value:10000, style: { numberFormat:"C2" } }] },
                        { index: 2, cells: [{ index: 1, value:250000, style: { numberFormat:"C3" } }] },
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RTLView.xlsx');
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
    it('AutoFilter', (done) => {
        let book: Workbook = new Workbook({
           worksheets: [
                {
                    rows: [
                        { index: 1, cells: [{ index: 1, value:"Numbers", style: { numberFormat:"C2" } }] },
                        { index: 2, cells: [{ index: 1, value:10000, style: { numberFormat:"C2" } },{ index: 2, value:10000, style: { numberFormat:"C2" } }] },
                        { index: 3, cells: [{ index: 1, value:250000, style: { numberFormat:"C3" } },{ index: 2, value:10000, style: { numberFormat:"C2" } }] },
                    ],
                    autoFilters:{row: 1, column: 1, lastRow: 3, lastColumn: 2}
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'AutoFilters.xlsx');
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
    it('Hyperlinkswithampersand', (done) => {
        let linkEncodedText: any = ' R&D <a href="https://support.dynatrace.com/supportportal/browse/" target="_blank">https://support.dynatrace.com/supportportal/browse/</a>';
        let linkEncodedText1: any = ' R&D <a href="https://support.dynatrace.com/&supportportal/browse/" target="_blank">https://support.dynatrace.com/&supportportal/browse/</a>';
        let book: Workbook = new Workbook({
           worksheets: [
                {
                    rows: [
                        { index: 1, cells: [{ index: 1, value:linkEncodedText, style: { numberFormat:"C2" } }] },
                        { index: 2, cells: [{ index: 1, value:linkEncodedText1, style: { numberFormat:"C2" } }] },
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Hyperlinkswithampersand.xlsx');
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
    it('Hyperlinkswithampersand1', (done) => {
        let book: Workbook = new Workbook({
           worksheets: [
                {
                    rows: [
                        { index: 1, cells: [{ index: 1, hyperlink: { target: 'https://www.google.co&.in/', displayText: 'Google&' }}]},
                        { index: 2, cells: [{index: 1, hyperlink: { target: 'https://www.google.co&<>!@#$%^&*()_+-=.in/', displayText: 'Google&<>!@#$%^&*()_+-=' }}]},
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Hyperlinkswithampersand1.xlsx');
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
    it('EJ2-69584', (done) => {
        let book: Workbook = new Workbook({
           worksheets: [
                {
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 'etrefd%%% 0thethe 0thethe'}]},
                        { index: 2, cells: [{index: 1,  value: 'etrefd%%% 0the\vthe'}]},
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EJ2-69584.xlsx');
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
