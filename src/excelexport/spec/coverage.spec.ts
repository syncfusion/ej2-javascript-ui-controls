import { Workbook } from './../src/workbook';
import { Utils } from './../spec/utils.spec';
describe('Branching Coverage', () => {
    it('builtInProperties', (done) => {
        let book: Workbook = new Workbook({
            builtInProperties: {
                author: undefined,
                comments: undefined,
                category: undefined,
                company: undefined,
                manager: undefined,
                subject: undefined,
                title: undefined,
                createdDate: undefined
            },
            worksheets: [{
                name: 'FreezeTopRow',
                freeze: { row: 2 },
            }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'builtInProperties.xlsx');
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
    it('Rows Add', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, value: "This is text" }] },
                        { index: 3, cells: [{ index: 1, mergeColumn: 1 }] },
                        { index: 4, cells: [{ index: 1, value: "This is text" }, { index: 3, value: "Column Insert" }, { index: 3, value: "New" }] },
                        { index: 5, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "Column Insert" }, { index: 2, value: "New" }] },
                        { index: 7, cells: [{ index: 1, value: "This is text" }, { index: 2, value: "Column Insert" }, { index: 2, value: "New" }] },

                    ],

                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'Rows-Add.xlsx');
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
    it('ColumnIndex', (done) => {
        try {
            let book: Workbook = new Workbook({
                worksheets: [
                    {
                        name: 'Rows Add',
                        columns: [
                        /*column -> 1*/{
                                width: 100,
                            }
                        ],
                        rows: [
                            { index: 1, cells: [{ index: 1, value: "This is text" }] },
                        ],

                    }]
            }, 'xlsx');
            book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(xlBlob.blobData, 'ColumnWidth.xlsx');
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
        } catch (error) {
            expect("Column index is missing.").toEqual(error.message);
            done();
        }
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
            }, 'xlsx');
            book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(xlBlob.blobData, 'RowIndex.xlsx');
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
            }, 'xlsx');
            book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(xlBlob.blobData, 'CellIndex.xlsx');
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
        } catch (error) {
            expect("Cell index is missing.").toEqual(error.message);
            done();
        }
    });
    it('Worksheet', (done) => {
        try {
            let book: Workbook = new Workbook({
            }, 'xlsx');
            book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(xlBlob.blobData, 'Worksheet.xlsx');
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
        } catch (error) {
            expect("Worksheet is expected.").toEqual(error.message);
            done();
        }
    });
    it('AllBorders', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        /*row -> 11*/ {
                            index: 1, cells: [
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
                            /*row -> 11*/ {
                            index: 2, cells: [
                                /*column ->1*/
                                {
                                    index: 1, value: 'all borders',
                                    /*Cell Style - All Borders(left, right, top, bottom)
                                    Allowed line styles 'thin', 'medium', 'thick'                                    
                                    */
                                    style: {
                                        borders: { color: '#C67978', lineStyle: 'thin' }
                                    }
                                }]
                        },
                            /*row -> 11*/ {
                            index: 3, cells: [
                                /*column ->1*/
                                {
                                    index: 1, value: 'all borders',
                                    /*Cell Style - All Borders(left, right, top, bottom)
                                    Allowed line styles 'thin', 'medium', 'thick'                                    
                                    */
                                    style: {
                                        borders: { color: '#C67978', lineStyle: 'medium' }
                                    }
                                }]
                        },
                    ],

                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'AllBorders.xlsx');
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

    it('EmptyCell', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Rows Add',
                    rows: [
                        { index: 1, cells: [{ index: 1, style: { numberFormat: 'C' } } ] },
                    ],

                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'EmptyCell.xlsx');
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
    // it('Wrong save type', (done) => {
    //     try {
    //         let book: Workbook = new Workbook({
    //             worksheets: [
    //                 {
    //                     name: 'Rows Add',
    //                     rows: [
    //                         { index: 1, cells: [{ index: 1 }, { index: 2, value: "test" }] },
    //                     ],

    //                 }]
    //         }, 'csv');
    //         book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
    //             if (Utils.isDownloadEnabled) {
    //                 Utils.download(xlBlob.blobData, 'Wrong-save-type.xlsx');
    //             }
    //             let reader: FileReader = new FileReader();
    //             reader.readAsArrayBuffer(xlBlob.blobData);
    //             reader.onload = (): void => {
    //                 if (reader.readyState == 2) { // DONE == 2
    //                     expect(reader.result.byteLength).toBeGreaterThanOrEqual(0);
    //                     done();
    //                 }
    //             }
    //         });
    //     } catch (error) {
    //         expect('Save type and file extension is different.').toEqual(error.message);
    //         done();
    //     }
    // });
    it('PrintTitleCoverage', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'PrintTitlesRow',
                    printTitle: { fromRow: 1 },
                },
                {
                    name: 'PrintTitlesCol',
                    printTitle: { fromColumn: 1 },
                },
                {
                    name: 'PrintTitles',
                    printTitle: {},
                },
            ]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'PrintTitleCoverage.xlsx');
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