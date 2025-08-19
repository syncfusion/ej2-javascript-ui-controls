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
    it('grouping', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                        /*row -> 1*/ {
                            index: 7,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                 /*row -> 1*/ {
                            index: 8,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                        /*row -> 1*/ {
                            index: 9,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                /*row -> 1*/ {
                            index: 10,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                        /*row -> 1*/ {
                            index: 11,
                            grouping: { isCollapsed: true }
                        }
                    ]
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'grouping.xlsx');
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
    it('grouping-withoutHidden', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                        /*row -> 1*/ {
                            index: 7,
                            grouping: { outlineLevel: 1 }
                        },
                                 /*row -> 1*/ {
                            index: 8,
                            grouping: { outlineLevel: 1 }
                        },
                                        /*row -> 1*/ {
                            index: 9,
                            grouping: { outlineLevel: 1 }
                        },
                                /*row -> 1*/ {
                            index: 10,
                            grouping: { outlineLevel: 1 }
                        },
                                        /*row -> 1*/ {
                            index: 11,
                            grouping: { isCollapsed: true }
                        }
                    ]
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'grouping-withouthidden.xlsx');
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
    it('SummaryBelow', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    pageSetup: { isSummaryRowBelow: false },
                    rows: [
                        /*row -> 1*/ {
                            index: 7,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                 /*row -> 1*/ {
                            index: 8,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                        /*row -> 1*/ {
                            index: 9,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                /*row -> 1*/ {
                            index: 10,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                        /*row -> 1*/ {
                            index: 11,
                            grouping: { isCollapsed: true }
                        }
                    ]
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'SummaryBelow.xlsx');
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
    it('summaryRow-1', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    pageSetup: { isSummaryRowBelow: false },
                    rows: [

                                                /*row -> 1*/ {
                            index: 3,
                            grouping: { isCollapsed: true }
                        },
                        /*row -> 1*/ {
                            index: 4,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                        /*row -> 1*/ {
                            index: 5,
                            grouping: { outlineLevel: 1, isHidden: true, isCollapsed: true }
                        },
                                                /*row -> 1*/ {
                            index: 6,
                            grouping: { outlineLevel: 2, isHidden: true }
                        },
                        /*row -> 1*/ {
                            index: 7,
                            grouping: { outlineLevel: 2, isHidden: true }
                        },
                                 /*row -> 1*/ {
                            index: 8,
                            grouping: { outlineLevel: 2, isHidden: true, isCollapsed: true }
                        },
                                        /*row -> 1*/ {
                            index: 9,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                /*row -> 1*/ {
                            index: 10,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 11,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 12,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 13,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 14,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 15,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 16,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 17,
                            grouping: { outlineLevel: 2, isHidden: true, isCollapsed: true }
                        },
                                                      /*row -> 1*/ {
                            index: 18,
                            grouping: { outlineLevel: 1, isHidden: true, isCollapsed: true }
                        },
                        /*row -> 1*/ {
                            index: 19,
                            grouping: { isCollapsed: true }
                        }
                    ]
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'summaryRow-1.xlsx');
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
    it('grouping-1', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [

                                                /*row -> 1*/ {
                            index: 3,
                            grouping: { isCollapsed: true }
                        },
                        /*row -> 1*/ {
                            index: 4,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                        /*row -> 1*/ {
                            index: 5,
                            grouping: { outlineLevel: 1, isHidden: true, isCollapsed: true }
                        },
                                                /*row -> 1*/ {
                            index: 6,
                            grouping: { outlineLevel: 2, isHidden: true }
                        },
                        /*row -> 1*/ {
                            index: 7,
                            grouping: { outlineLevel: 2, isHidden: true }
                        },
                                 /*row -> 1*/ {
                            index: 8,
                            grouping: { outlineLevel: 2, isHidden: true, isCollapsed: true }
                        },
                                        /*row -> 1*/ {
                            index: 9,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                /*row -> 1*/ {
                            index: 10,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 11,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 12,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 13,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 14,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 15,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 16,
                            grouping: { outlineLevel: 3, isHidden: true }
                        },
                                                      /*row -> 1*/ {
                            index: 17,
                            grouping: { outlineLevel: 2, isHidden: true, isCollapsed: true }
                        },
                                                      /*row -> 1*/ {
                            index: 18,
                            grouping: { outlineLevel: 1, isHidden: true, isCollapsed: true }
                        },
                        /*row -> 1*/ {
                            index: 19,
                            grouping: { isCollapsed: true }
                        }
                    ]
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'grouping-1.xlsx');
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
    it('SummaryBelow-Coverage', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    pageSetup: { isSummaryRowBelow: undefined },
                    rows: [
                        /*row -> 1*/ {
                            index: 7,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                 /*row -> 1*/ {
                            index: 8,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                        /*row -> 1*/ {
                            index: 9,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                /*row -> 1*/ {
                            index: 10,
                            grouping: { outlineLevel: 1, isHidden: true }
                        },
                                        /*row -> 1*/ {
                            index: 11,
                            grouping: { isCollapsed: true }
                        }
                    ]
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'SummaryBelow-Coverage.xlsx');
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
    it('StringArray', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    rows: [
                        { index: 1, cells: [{ index: 1, value: ["(Vendor 7njmjhhhhhnn | 4)", "(Vendor 7njmjhhhhhnn | < > & / ? \\  ''' )"] }] },
                    ]
                }
            ],

        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'StringArray.xlsx');
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
