import { Workbook } from './../src/workbook';
import { Utils } from './../spec/utils.spec';
describe('CSV-Export', () => {
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
    //Bug - 829928
    it('text-doublequotes-csv', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Sheet',
                    columns: [
                        /*column -> 1*/{
                            index: 1,
                            width: 100,
                        },
                    ],
                    rows: [
                        /*row -> 1*/ { index: 1, cells: [{ index: 1, value: '"Hello" World' }] },
                        /*row -> 2*/ { index: 2, cells: [{ index: 1, value: '"Hello" World' }] },
                    ],
                }
            ]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'text-doublequotes-csv.csv');
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
    it('csv-encoding-ansi', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Sheet',
                    columns: [
                        /*column -> 1*/{
                            index: 1,
                            width: 100,
                        },
                    ],
                    rows: [
                        /*row -> 1*/ { index: 1, cells: [{ index: 1, value: '漢語' }] },
                        /*row -> 2*/ { index: 2, cells: [{ index: 1, value: '12345' }] },
                    ],
                }
            ]
        }, 'csv');
        book.saveAsBlob('text/csv','ansi').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'csv-encoding-ansi.csv');
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
    it('csv-encoding-unicode', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Sheet',
                    columns: [
                        /*column -> 1*/{
                            index: 1,
                            width: 100,
                        },
                    ],
                    rows: [
                        /*row -> 1*/ { index: 1, cells: [{ index: 1, value: '漢語' }] },
                        /*row -> 2*/ { index: 2, cells: [{ index: 1, value: '€' }] },
                    ],
                }
            ]
        }, 'csv');
        book.saveAsBlob('text/csv','unicode').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'csv-encoding-unicode.csv');
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
    it('csv-encoding-utf8', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Sheet',
                    columns: [
                        /*column -> 1*/{
                            index: 1,
                            width: 100,
                        },
                    ],
                    rows: [
                        /*row -> 1*/ { index: 1, cells: [{ index: 1, value: '漢語' }] },
                        /*row -> 2*/ { index: 2, cells: [{ index: 1, value: '12345' }] },
                    ],
                }
            ]
        }, 'csv');
        book.saveAsBlob('text/csv','utf8').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'csv-encoding-utf8.csv');
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
    it('export-as-csv', (done) => {
        let book: Workbook = new Workbook({
            builtInProperties: {
                author: 'Rex',
                comments: 'Listed the development team members',
                category: 'Report',
                company: 'NorthWind Traders',
                manager: 'John',
                subject: 'Development Team Members',
                title: 'Active Development Team Members',
                createdDate: new Date()
            },
            /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Tahoma', fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: 'C' },
                /*Style ->2*/{ name: 'Custom Heading', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: 'C' },
                /*Style ->3*/{ name: 'Custom H2', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: 'C' },
                /*Style ->4*/{ name: 'Custom H3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'C' },
            ],
            worksheets: [
                {
                    name: 'Sheet',
                    columns: [
                        /*column -> 1*/{
                            index: 1,
                            width: 100,
                        },
                        /*column -> 3*/{
                            index: 2,
                            width: 150,
                        },
                        /*column -> 3*/{
                            index: 3,
                            width: 75,
                        },
                        /*column -> 4*/{
                            index: 4,
                            width: 150,
                        }
                    ],
                    rows: [
                        /*row -> 1*/ { index: 1, cells: [{ index: 1, value: 'Hello World' }] }, /*Text*/
                        /*row -> 2*/ { index: 2, cells: [{ index: 1, value: 10 }] }, /*Number*/
                        /*row -> 3*/ { index: 3, cells: [{ index: 1, value: new Date() }] }, /*Date without NumberFormat*/
                        /*row -> 4*/ { index: 4, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'yMd' } }] }, /*Date with NumberFormat*/
                        /*row -> 5*/ {
                            index: 5, cells: [
                                /*column -> 1*/{
                                    index: 1,
                                    /*Hyperlink with custom display text*/
                                    hyperlink: { target: 'https://www.google.co.in/', displayText: 'Google' }
                                },
                                /*column -> 2*/{
                                    index: 2,
                                    /*Hyperlink default*/
                                    hyperlink: { target: 'https://www.google.co.in/' }
                                }
                            ]
                        },
                        /*row -> 6*/ {
                            index: 6, cells: [
                                /*column -> 1*/
                                {
                                    index: 1, value: 'Font Style',
                                    /*Font Style - FontColor, Size, Bold, Italic, Underline*/
                                    style: {
                                        fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true
                                    }
                                }]
                        },
                        /*row -> 7*/ {
                            index: 7, cells: [
                                /*column -> 1*/
                                {
                                    index: 1, value: 'Background Color',
                                    /*Cell Style - Background color*/
                                    style: {
                                        backColor: '#C67878'
                                    }
                                }]
                        },
                        /*row -> 8*/ {
                            index: 8, cells: [
                                /*column -> 1*/
                                {
                                    index: 1, value: 'Test for wrap text - So text need to long wrapping',
                                    /*Cell Style - Wrap text*/
                                    style: {
                                        wrapText: true
                                    }
                                }]
                        },
                        /*row -> 9*/ {
                            index: 9, cells: [
                                /*column ->1*/
                                {
                                    index: 1, value: 'Horizontal alignment',
                                    /*Cell Style - Horizontal alignment
                                    Allowed values 'center', 'justify', 'left', 'right'
                                    Default value 'left'
                                    */
                                    style: {
                                        hAlign: 'right'
                                    }
                                },
                                /*column ->2*/
                                {
                                    index: 2, value: 'Horizontal alignment',
                                    /*Cell Style - Horizontal alignment - Center*/
                                    style: {
                                        hAlign: 'center'
                                    }
                                }]
                        },
                        /*row -> 10*/ {
                            index: 10, cells: [
                                /*column ->1*/
                                {
                                    index: 1, value: 'Vertical alignment',
                                    /*Cell Style - Vertical alignment
                                    Allowed values 'bottom', 'center', 'top'
                                    Default value 'bottom'
                                    */
                                    style: {
                                        vAlign: 'center'
                                    }
                                },
                                /*column ->2*/
                                {
                                    index: 2, value: 'Vertical alignment',
                                    /*Cell Style - Vertical alignment - top*/
                                    style: {
                                        vAlign: 'top'
                                    }
                                }]
                        },
                        /*row -> 11*/ {
                            index: 11, cells: [
                                /*column ->1*/
                                {
                                    index: 1, value: 'all borders',
                                    /*Cell Style - All Borders(left, right, top, bottom)
                                    Allowed line styles 'thin', 'medium', 'thick'                                    
                                    */
                                    style: {
                                        borders: { color: '#C67878', lineStyle: 'thick' }
                                    }
                                }]
                        },
                        /*row -> 12*/ {
                            index: 12, cells: [
                                /*column ->1*/
                                {
                                    index: 1, value: 'Separate borders',
                                    /*Cell Style - All Borders(left, right, top, bottom)
                                    Allowed line styles 'thin', 'medium', 'thick'                                    
                                    */
                                    style: {
                                        leftBorder: { color: '#C67878', lineStyle: 'thick' },
                                        rightBorder: { color: '#C67878', lineStyle: 'thick' },
                                        topBorder: { color: '#C67878', lineStyle: 'thick' },
                                        bottomBorder: { color: '#C67878', lineStyle: 'thick' }
                                    }
                                }]
                        },
                        /*row -> 13*/ {
                            index: 13, cells: [
                                /*column ->1*/
                                {
                                    index: 1,
                                    image: {
                                        base64: 'data:image/png;base64,/*encoded string*/iVBORw0KGgoAAAANSUhEUgAAABgAAAAXCAYAAAARIY8tAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIfSURBVEhL7ZTPaxNBHMW9eGlP/h8eLS3Riwq11luFugr1UEERvbRgL94EFQ8VFBREc6k/uxYVsSrSelGSCOpmJS31KJKk3fxaYTd2k908+2Y72KyTNCIeBB88mNmdeZ/5zszulkQigb/p/4BN3REgnU4jl8vBdV34vi/MNp+ZpqmcI90WkEqlkM/nsZkISiaTyoyWAIbbti0CGp6H6sxdlE+OoDC4C9a+GMrHj8CdnhLvqEqlooS0BMiVB9Yyysc0WHt7lLYnTotxFCuJ5igB3HOKqyuNDougwv6dcG5dQ+2TgVrGhBO/jtLRIfhfv4ixUtEzUQK4EqpuXEVxqBdWf99aaAhtUhCsN34qWoUSwBtC+e964D3tQvXOKdHvRI7jNGUpAbyGVP11N+pzW9EoPhd9qT3nnV98Vv8u3nHuxqz2gPmuEFCYFX0pFeDMvd8AyC369nY7SnPb8MScFH2Vzj1aFYDJ2VXR72iL5CF/WLyEAf0A+vRhfLQWxLONWsoF6L8YVvBmKaw6m802ZSkBvGqU59dw6MUYdjw4iJiu4Up6Cu9XMmuwRdzM6Bi8fQO7L9g4Ea+i0RBTYBhGU5YSQMsqVtwitHWIytrjy1i2w/To6umWAH72/PwpL6jh/udnGHk1gdhDTVRz+OU44gszqNbDvedY/l6iOS0BNCGyknbiylXhdFuANM+EIN4QXkOabQZH9zzqjgB/4n8dkMAPcKlEy0IZ6hkAAAAASUVORK5CYII=',
                                        width: 200,
                                        height: 200,
                                        moveWithCell: true,
                                        sizeWithCell: true
                                    }
                                }]
                        },
                        /*row -> 14*/ {
                            index: 14,
                            height: 100, /*Row height*/
                            cells: [{ index: 1, value: 'Hello World' }]
                        },
                        /*row -> 15*/ {
                            index: 15,
                            height: 100, /*Row height*/
                            cells: [
                                /*cell with merge*/{
                                    index: 1,
                                    rowSpan: 3,
                                    colSpan: 4,
                                    value: 'Hello World'
                                }
                            ]
                        },
                        /*row -> 16*/ {
                            index: 16,
                            grouping: { outlineLevel: 2, isCollapsed: false, isHidden: true }
                        },
                        /*row -> 1*/ { index: 17, cells: [{ index: 1, value: true }, { index: 2, value: false }] }, /*Text*/
                    ],
                },
                {
                    name: 'FreezeTopRow',
                    freeze: { row: 2 },
                },
                {
                    name: 'FreezeFirstColumn',
                    freeze: { column: 2 },
                },
                {
                    name: 'FreezeRowColumn',
                    freeze: { row: 2, column: 3 },
                }
            ]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'export-as-csv.csv');
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
    it('RowIndex', (done) => {
        try {
            let book: Workbook = new Workbook({
                worksheets: [
                    {
                        name: 'Rows Add',
                        rows: [
                            { cells: [{ index: 1, value: "This is text" }] },
                        ],

                    }]
            }, 'csv');
            book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(csvBlob.blobData, 'RowIndex.csv');
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
        } catch (error) {
            expect("Row index is missing.").toEqual(error.message);
            done();
        }
    });
    it('CellIndex', (done) => {
        try {
            let book: Workbook = new Workbook({
                worksheets: [
                    {
                        name: 'Rows Add',
                        rows: [
                            { index: 1, cells: [{ value: "This is text" }] },
                        ],

                    }]
            }, 'csv');
            book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(csvBlob.blobData, 'CellIndex.csv');
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
        } catch (error) {
            expect("Cell index is missing.").toEqual(error.message);
            done();
        }
    });
    it('SimpleCSV', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "This is text" }, { index: 10, value: "This is text" }] },
                        { index: 4, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "This is text" }, { index: 10, value: "This is text" }] },
                    ],

                }]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'SimpleCSV.csv');
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
    it('SimpleCSV-1', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "text, text" }] },
                    ],

                }]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'SimpleCSV-1.csv');
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
    it('Worksheets missing', (done) => {
        let book: Workbook = new Workbook({}, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'WorksheetsMissing.csv');
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
    it('Rows Missing', (done) => {

        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                }]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'Rows.csv');
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
    it('NumberFormat', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Currency', numberFormat: 'C' },
                /*Style ->2*/{ name: 'NewDate', numberFormat: 'yMd' }
            ],
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 10, style: { numberFormat: 'C' } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'yMd' } }] },
                        { index: 3, cells: [{ index: 1, value: new Date(), style: { name: 'NewDate' } }] },
                        { index: 4, cells: [{ index: 1, value: 20.3, style: { name: 'Currency' } }] },
                        { index: 5, cells: [{ index: 1, value: 200 }] },
                        { index: 6, cells: [{ index: 1, value: new Date() }] },
                        { index: 5, cells: [{ index: 1, value: 200, style: { numberFormat: undefined } }] },
                    ],
                }]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'NumberFormat.csv');
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

    it('Save(null)', (done) => {
        try {
            let book: Workbook = new Workbook({
                worksheets: [
                    {
                        name: 'Rows Add',
                        rows: [
                            { index: 1, cells: [{ index: 1, value: "This is text" }] },
                        ],

                    }]
            }, 'csv');
            book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(csvBlob.blobData, 'Save(null).csv');
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
        } catch (error) {
            expect("Argument Null Exception: fileName cannot be null or empty").toEqual(error.message);
            done();
        }
    });
    it('Save(undefined)', (done) => {
        try {
            let book: Workbook = new Workbook({
                worksheets: [
                    {
                        name: 'Rows Add',
                        rows: [
                            { index: 1, cells: [{ index: 1, value: "This is text" }] },
                        ],

                    }]
            }, 'csv');
            book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(csvBlob.blobData, 'Save(undefined).csv');
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
        } catch (error) {
            expect("Argument Null Exception: fileName cannot be null or empty").toEqual(error.message);
            done();
        }
    });
    it('Save()', (done) => {
        try {
            let book: Workbook = new Workbook({
                worksheets: [
                    {
                        name: 'Rows Add',
                        rows: [
                            { index: 1, cells: [{ index: 1, value: "This is text" }] },
                        ],

                    }]
            }, 'csv');
            book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(csvBlob.blobData, 'Save.csv');
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
        } catch (error) {
            expect("Argument Null Exception: fileName cannot be null or empty").toEqual(error.message);
            done();
        }
    });
    it('GlobalStyles', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->1*/{ fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: 'C' },
                /*Style ->2*/{ name: 'Custom Heading', fontName: 'Arial', fontSize: 20, wrapText: true },
            ],
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "This is text" }, { index: 10, value: "This is text" }] },
                        { index: 4, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "This is text" }, { index: 10, value: "This is text" }] },
                    ],

                }]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'SimpleCSV-WithStyle.csv');
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
                    ],
                }]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'number-format-with-type.csv');
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
    it('SimpleCSV-SaveAsBlob', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "text, text" }] },
                    ],

                }]
        }, 'csv');
        book.saveAsBlob("text/csv").then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'SimpleCSV-SaveAsBlob.csv');
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
    it('LatinCharacter', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "'ShipName': 'ꬰ'" }] },
                    ],

                }]
        }, 'csv');
        book.saveAsBlob("text/csv").then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'LatinCharacter.csv');
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
    it('Custom-NumberFormat-Date', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Custom-NumberFormat-Date',
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
        }, 'csv');
        book.saveAsBlob("text/csv").then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'Custom-NumberFormat-Date.csv');
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
    it('NewLineCharacter', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "Simple\nText" },{ index: 2, value: "Sample,Text" }] },
                        { index: 2, cells: [{ index: 1, value: "Simple\nText, Separator" }] },
                        { index: 3, cells: [{ index: 1, value: "Values2" }] },
                    ],

                }]
        }, 'csv');
        book.saveAsBlob("text/csv").then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'NewLineCharacter.csv');
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
    it('DoubleQuote', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 'Jones, John "JR"' },
                        { index: 2, value: 'Phillips, Suzy "Suz"' } ,
                        { index: 3, value: '"Phillips, "Suzy "Suz""' }] },
                    ],

                }]
        }, 'csv');
        book.saveAsBlob("text/csv").then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'DoubleQuote.csv');
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
    it('ServerRendered', (done) => {
        let book: Workbook = new Workbook({
             isServerRendered : true,
            /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Currency', numberFormat: 'C' },
            ],
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 10, style: { numberFormat: 'C' } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'd' } }] },
                    ],
                }]
        }, 'csv');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'ServerRendered.csv');
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
    it('ServerRendered-with-moduloseparator', (done) => {
        let book: Workbook = new Workbook({
             isServerRendered : true,
            /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Currency', numberFormat: 'C' },
            ],
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 10},{ index: 2, value: 20},{ index: 4, value: 40},{ index: 5, value: 50},{ index: 6, value: 60},{ index: 8, value: 80}] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'd' } },{ index: 5, value: new Date(), style: { numberFormat: 'd' }},{ index: 6, value: 30} ] },
                    ],
                }]
        }, 'csv','en-US','USD','%');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'ServerRendered-with-moduloseparator.csv');
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
    it('New-Line-Text-with-commaseparator', (done) => {
        let book: Workbook = new Workbook({
                    worksheets: [
                        {
                            name: 'Rows Add',
                            rows: [
                                { index: 1, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "This is text" }, { index: 10, value: "This is text" }] },
                                { index: 2, cells: [{ index: 1, value: "Simple\nText" },{ index: 2, value: "Sample,Text" }] },
                                { index: 3, cells: [{ index: 1, value: "Simple\nText, Separator" }] },
                                { index: 4, cells: [{ index: 1, value: "Values2" }] },
                                { index: 5, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "This is text" }, { index: 10, value: "This is text" }] },
                            ],
        
                        }]
        }, 'csv','en-US','USD',',');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'New-Line-Text-with-commaseparator.csv');
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
    it('NumberFormat-Date-with-starseparator', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
               {
                    name: 'Custom-NumberFormat-Date',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: new Date(), style: { numberFormat: "ccc dd.MM.yyyy" } },{ index: 2, value: new Date(), style: { numberFormat: "ccc" } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { numberFormat: "ccc" } },{ index: 2, value: new Date(), style: { numberFormat: "yyy" } }] },
                        { index: 3, cells: [{ index: 1, value: new Date(), style: { numberFormat: "yyy" } },{ index: 2, value: new Date(), style: { numberFormat: "LLL" } }] },
                        { index: 4, cells: [{ index: 1, value: new Date(), style: { numberFormat: "LLL" } },{ index: 2, value: new Date(), style: { numberFormat: "EEE" } }] },
                        { index: 5, cells: [{ index: 1, value: new Date(), style: { numberFormat: "EEE" } },{ index: 2, value: new Date(), style: { numberFormat: "d" } }] },
                        { index: 6, cells: [{ index: 1, value: new Date(), style: { numberFormat: "d" } },{ index: 2, value: new Date(), style: { numberFormat: "hh:mm:ss a" } }] },
                        { index: 7, cells: [{ index: 1, value: new Date(), style: { numberFormat: "m" } },{ index: 2, value: new Date(), style: { numberFormat: "hh:mm:ss a" } }] },
                        { index: 8, cells: [{ index: 1, value: new Date(), style: { numberFormat: "s" } },{ index: 2, value: new Date(), style: { numberFormat: "hh:mm:ss a" } }] },
                        { index: 9, cells: [{ index: 1, value: new Date(), style: { numberFormat: "hh:mm:ss a" } }] },
                        { index: 10, cells: [{ index: 1, value: new Date(), style: { numberFormat: "z" } }] },
                        { index: 11, cells: [{ index: 1, value: new Date(), style: { numberFormat: "hh" } },{ index: 2, value: new Date(), style: { numberFormat: "ccc dd.MM.yyyy" } }] },  
                    ],
                }]
        }, 'csv','en-US','USD','*');
        book.saveAsBlob("text/csv").then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'NumberFormat-Date-with-starseparator.csv');
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
    it('NumberFormatwithdotseparator', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Currency', numberFormat: 'C' },
                /*Style ->2*/{ name: 'NewDate', numberFormat: 'yMd' }
            ],
            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: 10, style: { numberFormat: 'C' } },{ index: 2, value: new Date(), style: { numberFormat: 'yyyyMMdd' } }] },
                        { index: 2, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'yyyyMMdd' } },{ index: 2, value: new Date(), style: { name: 'NewDate' }}] },
                        { index: 3, cells: [{ index: 1, value: new Date(), style: { name: 'NewDate' }},{ index: 2, value: 20.3, style: { name: 'Currency' } } ] },
                        { index: 4, cells: [{ index: 1, value: 20.3, style: { name: 'Currency' } },{ index: 2, value: 200 }] },
                        { index: 5, cells: [{ index: 1, value: 200 },{ index: 2, value: new Date() }] },
                        { index: 6, cells: [{ index: 1, value: new Date() },{ index: 2, value: 200, style: { numberFormat: undefined } }] },
                        { index: 7, cells: [{ index: 1, value: 200, style: { numberFormat: undefined } },{ index: 2, value: 10, style: { numberFormat: 'C' } }] },
                    ],
                }]
        }, 'csv','en-US','USD','.');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'NumberFormatwithdotseparator.csv');
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
    it('number-format-with-type-Ampersandseparator', (done) => {
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
                        ],
                    }]
            }, 'csv','en-US','USD','&');
            book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(csvBlob.blobData, 'number-format-with-type-Ampersandseparator.csv');
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
    it('GlobalStyleswithbackslashseparator', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->1*/{ fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: 'C' },
                /*Style ->2*/{ name: 'Custom Heading', fontName: 'Arial', fontSize: 20, wrapText: true },
            ],
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "This is text" }, { index: 10, value: "This is text" }] },
                        { index: 2, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "This is text" }, { index: 10, value: "This is text" }] },
                    ],

                }]
        }, 'csv','en-US','USD','\\');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'GlobalStyleswithbackslashseparator.csv');
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
       it('export-as-csv-with-semicolonspeatator', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Tahoma', fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: 'C' },
                /*Style ->2*/{ name: 'Custom Heading', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: 'C' },
                /*Style ->3*/{ name: 'Custom H2', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: 'C' },
                /*Style ->4*/{ name: 'Custom H3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: 'C' },
            ],
            worksheets: [
                {
                    name: 'Sheet',
                    columns: [
                        /*column -> 1*/{
                            index: 1,
                            width: 100,
                        },
                        /*column -> 3*/{
                            index: 2,
                            width: 150,
                        },
                        /*column -> 3*/{
                            index: 3,
                            width: 75,
                        },
                        /*column -> 4*/{
                            index: 4,
                            width: 150,
                        }
                    ],
                    rows: [
                        /*row -> 1*/ { index: 1, cells: [{ index: 1, value: 'Hello World' }] }, /*Text*/
                        /*row -> 2*/ { index: 2, cells: [{ index: 1, value: 10 }] }, /*Number*/
                        /*row -> 3*/ { index: 3, cells: [{ index: 1, value: new Date() }] }, /*Date without NumberFormat*/
                        /*row -> 4*/ { index: 4, cells: [{ index: 1, value: new Date(), style: { numberFormat: 'yMd' } }] }, /*Date with NumberFormat*/                        
                        /*row -> 5*/ {
                            index: 5, cells: [
                                /*column -> 1*/
                                {
                                    index: 1, value: 'Font Style',
                                    /*Font Style - FontColor, Size, Bold, Italic, Underline*/
                                    style: {
                                        fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true
                                    }
                                }]
                        },
                        /*row -> 6*/ {
                            index: 6, cells: [
                                /*column -> 1*/
                                {
                                    index: 1, value: 'Background Color',
                                    /*Cell Style - Background color*/
                                    style: {
                                        backColor: '#C67878'
                                    }
                                }]
                        },
                        /*row -> 7*/ {
                            index: 7, cells: [
                                /*column -> 1*/
                                {
                                    index: 1, value: 'Test for wrap text - So text need to long wrapping',
                                    /*Cell Style - Wrap text*/
                                    style: {
                                        wrapText: true
                                    }
                                }]
                        },                                                     
                        /*row -> 8*/ {
                            index: 8,
                            height: 100, /*Row height*/
                            cells: [{ index: 1, value: 'Hello World' }]
                        },
                        /*row -> 9*/ {
                            index: 9,
                            height: 100, /*Row height*/
                            cells: [
                                /*cell with merge*/{
                                    index: 1,
                                    rowSpan: 3,
                                    colSpan: 4,
                                    value: 'Hello World'
                                }
                            ]
                        }                        
                    ],
                }
           ]
        }, 'csv','en-US','USD',';');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'semicolonseparatorexport-as-csv.csv');
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
    it('samesymbol', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "This # is text" }, { index: 2, value: "This # is text" }, { index: 10, value: "This # is text" }] },
                        { index: 4, cells: [{ index: 1, value: "This # is text" }, { index: 2, value: "This # is text" }, { index: 10, value: "This # is text" }] },
                    ],

                }]
        }, 'csv','en-US','USD','#');
        book.saveAsBlob('text/csv').then((csvBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(csvBlob.blobData, 'samesymbol.csv');
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
});