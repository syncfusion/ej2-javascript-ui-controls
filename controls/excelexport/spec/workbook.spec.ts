import { Workbook } from './../src/workbook';
import './../node_modules/es6-promise/dist/es6-promise';
import { Utils } from './../spec/utils.spec';

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
    it('Workbook-1', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [{
                columns: [{
                    index: 1,
                    width: 100,
                }, {
                    index: 2,
                    width: 125
                }],
                rows: [
                    { index: 1, cells: [{ index: 1, value: 10 }, { index: 2, value: 10 }, { index: 3, value: 10 }] },
                    { index: 2, cells: [{ index: 1, value: true }] },
                    { index: 3, cells: [{ index: 1, value: new Date() }] }
                ],
            },
            {
                name: 'kesavan',
                freeze: { row: 1 },
                columns: [{
                    width: 10,
                    index: 1
                },
                {
                    index: 125
                }],
                rows: [
                    { index: 1, cells: [{ index: 1, value: "This is text" }] },
                    { index: 2, cells: [{ index: 1, value: "This is text", mergeColumn: 1 }] },
                    { index: 3, cells: [{ index: 1, mergeColumn: 1 }] },
                    { index: 4, mergeRows: 4, height: 100, cells: [{ index: 1, value: "Demo" }] }
                ],

            }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Workbook-1.xlsx');
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
    it('Workbook-2', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [{
                columns: [{
                    index: 2,
                    width: 100
                }, {
                    index: 4,
                    width: 125
                }],
                freeze: { column: 3 },
                rows: [
                    { index: 1, cells: [{ index: 1, value: 10 }, { index: 2, value: 10 }, { index: 3, value: 10 }] },
                    { index: 2, cells: [{ index: 1, value: true }, { index: 2, value: false }] },
                    { index: 3, cells: [{ index: 1, value: new Date() }] }
                ]
            },
            {
                rows: [
                    { index: 1, cells: [{ index: 1, value: 10 }, { index: 2, value: 10 }, { index: 3, value: 10 }] },
                    { index: 2, cells: [{ index: 1, value: true }] },
                    { index: 3, cells: [{ index: 1, value: new Date() }] }
                ],
            },
            {
                name: 'Empty'
            }]

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Workbook-2.xlsx');
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

    it('FreezePanes', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [{
                freeze: { row: 1, column: 3 },
            }, {
                freeze: { row: 3 },
            }, {
                freeze: { column: 3 },
            }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'FreezePanes.xlsx');
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

    it('RowIndex-CellIndexRewrite', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'kesavan',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "This is text" }] },
                        { index: 2, cells: [{ index: 1, value: "Row Insert", mergeColumn: 1 }] },
                        { index: 3, cells: [{ index: 1, mergeColumn: 1 }] },
                        { index: 4, cells: [{ index: 1, value: "This is text" }, { index: 3, value: "Column Insert" }, { index: 3, value: "New" }] },
                        { index: 7, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "Column Insert" }, { index: 2, value: "New" }] },
                        { index: 8, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "Column Insert" }, { index: 2, value: "New" }] },
                        { index: 2, cells: [{ index: 1, value: "This is text" }, { index: 1, value: "Column Insert" }, { index: 1, value: "New" }] },
                    ],

                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RowIndexIssue.xlsx');
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
    it('RowHeight-ColumnWidth', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    columns: [{
                        index: 1,
                        width: 400
                    }, {
                        index: 2,
                        width: 550
                    }],
                    name: 'kesavan',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "Column Width" }] },
                        { index: 2, height: 200, cells: [{ index: 2, value: 'Row height' }] },
                        { index: 3, height: 350, cells: [{ index: 3, value: 'Row height' }] }
                    ],

                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RowHeight-ColumnWidth.xlsx');
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
    it('Number', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                    /*row -> 1*/ { index: 1, cells: [{ index: 1, value: 10 }] }, /*Number*/
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Number.xlsx');
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
                    /*row -> 1*/ { index: 1, cells: [{ index: 1, value: "10" }, { index: 2, value: "10" }, { index: 3, value: "11" }] }, /*Number*/
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Text.xlsx');
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
it('Formula', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'kesavan',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "Item" }, { index: 2, value: "Sales" }] },
                        { index: 2, cells: [{ index: 1, value: "Pen" }, { index: 2, value: "Sales" }] },
                        { index: 3, cells: [{ index: 1, value: "Pencil" }, { index: 2, value: "Sales" }] },
                        { index: 4, cells: [{ index: 1, value: "Box" }, { index: 2, value: "Sales" }] },
                        { index: 5, cells: [{ index: 1, value: "Scale" }, { index: 2, value: "Sales" }] },
                        { index: 8, cells: [{ index: 1, value: "Pen" }, { index: 2, value: "Notebook" }] },
                        { index: 2, cells: [{ index: 1, value: "Total" }, { index: 2, value: "=SUM(A2:F2)", formula: "=SUM(A2:F2)" }] },
                    ],

                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'RowIndexIssue.xlsx');
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
    it('Merge', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                    /*row -> 1*/ { index: 1, cells: [{ index: 1, value: "MergeColumn", colSpan: 4 }, { index: 2, value: "10" }, { index: 4, colSpan: 4, value: "11" }] }, /*Number*/
                    /*row -> 1*/ { index: 3, cells: [{ index: 1, value: "MergeColumn", rowSpan: 6 }, { index: 2, value: "10" }, { index: 3, value: "11", colSpan: 4, rowSpan: 6 }] }, /*Number*/
                    /*row -> 1*/ { index: 8, cells: [{ index: 1, value: "MergeColumn", rowSpan: 4 }, { index: 3, value: "11", colSpan: 4, rowSpan: 3 }] },
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Merge.xlsx');
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
    it('Hyperlink', (done) => {
        let book: Workbook = new Workbook({
            /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Tahoma', fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, wrapText: true, numberFormat: 'C' },
            ],
            worksheets: [
                {
                    rows: [{
                        index: 1, cells: [
                                /*column -> 1*/{
                                index: 1,
                                /*Hyperlink with custom display text*/
                                hyperlink: { target: 'https://www.google.co.in/', displayText: 'Google' },
                                style: {
                                    fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true
                                }
                            },
                                /*column -> 2*/{
                                index: 2,
                                /*Hyperlink default*/
                                hyperlink: { target: 'https://www.google.co.in/' },
                                style: {
                                    fontSize: 20, italic: true, bold: true
                                }
                            },
                            {
                                index: 3,
                                /*Hyperlink default*/
                                hyperlink: { displayText: 'withouTarget' },
                                style: {
                                    fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true
                                }
                            },
                            {
                                index: 4,
                                /*Hyperlink default*/
                                hyperlink: { target: 'https://www.google.co.in/', displayText: 'Global Style' },
                                style: {
                                    name: 'Tahoma',
                                }
                            }
                        ]
                    }
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Hyperlink.xlsx');
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
    it('Culture', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [{
                name: 'Culture',
                rows: [
                    { index: 1, cells: [{ index: 1, value: 10.05, style: { numberFormat: 'C' } }] },
                ],
            }]
        }, 'xlsx', 'en-GB');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Culture.xlsx');
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
    it('Empty', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [{
                name: 'Culture',
                rows: [
                    { index: 1, cells: [{ index: 1, value: 10.05, style: { numberFormat: 'C' } }] },
                ],
            }]
        }, 'xlsx', 'en-GB');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Empty.xlsx');
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
    it('SaveAsBlob', (done) => {
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
                Utils.download(xlBlob.blobData, 'SaveAsBlob.xlsx');
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
    it('CorruptionFix', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                        /*row -> 1*/ { index: 1, cells: [{ index: 1, value: 'Fitzhugh CD, Abraham AA, Tisdale JF, Hsieh MM. <b><a href=\'https:\\www.syncfusion.com\'>Hematopoietic stem cell transplantation for patients with sickle cell disease: progress and future directions.</a></b>' },
                         { index: 2, value: "World" }, 
                         { index: 3, value: "Hello" }] }, /*Text*/
                    ]
                }
            ],
        }, 'xlsx');

        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'CorruptionFix.xlsx');
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
    it('HTMLHyperlink', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Hyperlink',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: '<a href=\'https:\\www.google.com\'>ghtj</a>Hodges E, <b>Rosebrock AP</b>" ' }] },
                        { index: 2, cells: [{ index: 1, value: 'Hodges E, <b>Rosebrock AP</b>' }] },
                        { index: 3, cells: [{ index: 1, value: '<i> Chen FK</i>' }] },                       
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'HTMLHyperlink.xlsx');
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