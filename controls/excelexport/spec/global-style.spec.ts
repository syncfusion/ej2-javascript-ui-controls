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
    it('GlobalStyle', (done) => {
        let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Tahoma', fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->2*/{ name: 'Custom Heading', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->3*/{ name: 'Custom H2', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->4*/{ name: 'Custom H3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: '$#,###.00' },
            ],

            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        {
                            index: 1,
                            cells: [{ index: 1, value: 10, style: { fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true } },
                            { index: 2, value: 20, style: { name: 'Tahoma' } }]
                        },
                        {
                            index: 2,
                            cells: [{ index: 1, value: 10, style: { fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true } },
                            { index: 2, value: 'Custom H2', style: { name: 'Custom H2' } }]
                        },
                        {
                            index: 3,
                            cells: [{ index: 1, value: 10, style: { wrapText: true } },
                            { index: 2, value: 'Custom Heading', style: { name: 'Custom Heading', fontName: 'Tahoma' } }]
                        },
                        {
                            index: 4,
                            cells: [{ index: 1, value: 10, style: { fontColor: '#C67878' } },
                            {
                                index: 2, value: 'Custom H3 ', style: { name: 'Custom H3' }
                            }]
                        },
                        {
                            index: 5,
                            cells: [{ index: 1, value: 10, style: { backColor: '#C67878' } },
                            {
                                index: 2, value: 'Custom H2', style: { name: 'Custom H2', fontName: 'Tahoma' }
                            }]
                        },
                        { index: 6, cells: [{ index: 1, value: 10, style: { backColor: '#C67878' } }] },
                        { index: 7, cells: [{ index: 4, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'right', vAlign: 'top' } }] },
                        { index: 8, cells: [{ index: 1, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'right', vAlign: 'top' } }] },
                        { index: 10, cells: [{ index: 3, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'center', vAlign: 'center' } }] },
                        { index: 12, cells: [{ index: 4, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'center', vAlign: 'center' } }] },
                        { index: 13, cells: [{ index: 7, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'fill', vAlign: 'justify' } }] },
                        { index: 16, cells: [{ index: 3, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'fill', vAlign: 'justify' } }] },
                        { index: 18, cells: [{ index: 9, value: 'erterterrrrrrrrrrrrrrrrrrrrrrrrr', style: { wrapText: true, hAlign: 'fill', vAlign: 'justify' } }] },
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'globalStyle.xlsx');
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
    it('GlobalStyleDuplicate', (done) => {
        let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Tahoma', fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->2*/{ name: 'Custom Heading', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->3*/{ name: 'Custom H2', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->4*/{ name: 'Custom H3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: '$#,###.00' },
            ],

            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        {
                            index: 1,
                            cells: [{ index: 1, value: 20, style: { name: 'Custom H2' } }]
                        },
                        {
                            index: 2,
                            cells: [{ index: 1, value: 'Custom H2', style: { name: 'Custom H2' } }]
                        },

                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GlobalStyleDuplicate.xlsx');
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
    it('GlobalStyle-1', (done) => {
        let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                { name: 'Custom H2', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: '$#,###.00' }

            ],

            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        {
                            index: 1,
                            cells: [{ index: 1, value: 20, style: { name: 'Custom H2' } }, { index: 2, value: 'commonStyle', style: { fontName: 'Tahoma', fontSize: 20, fontColor: '#C67878', backColor: '#C67878', wrapText: true, hAlign: 'right', vAlign: 'top', numberFormat: 'yyyy-mm-dd' } }]
                        },
                        {
                            index: 2,
                            cells: [{ index: 1, value: 'Custom H2', style: { name: 'Custom H2' } }, { index: 2, value: 'commonStyle', style: { fontName: 'Tahoma', fontSize: 20, fontColor: '#C67878', backColor: '#C67878', wrapText: true, hAlign: 'right', vAlign: 'top', numberFormat: 'yyyy-mm-dd' } }]
                        },

                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'globalStyle-1.xlsx');
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
    it('GlobalStyleWithouName', (done) => {
        let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                /*Style ->1*/{ fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->2*/{ fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->3*/{ name: 'Custom H2', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->4*/{ name: 'Custom H3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: '$#,###.00' },
            ],

            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        {
                            index: 1,
                            cells: [{ index: 1, value: 20, style: { name: 'Custom H2' } }]
                        },
                        {
                            index: 2,
                            cells: [{ index: 1, value: 'Custom H2', style: { name: 'Custom H2' } }]
                        },

                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GlobalStyleWithouName.xlsx');
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
    it('GlobalStyle-wrongName', (done) => {
        let book: Workbook = new Workbook({
            styles: [{
                name: 'check', fontName: 'Arial'

            }],
            worksheets: [{ rows: [{ index: 1, cells: [{ index: 1, style: { name: 'check1' } }] }] }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GlobalStyle-wrongName.xlsx');
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
    it('GlobalStyle-withoutvalue', (done) => {
        let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Tahoma', fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->2*/{ name: 'Custom Heading', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->3*/{ name: 'Custom H2', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->4*/{ name: 'Custom H3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: '$#,###.00' },
            ],

            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        {
                            index: 1,
                            cells: [{ index: 1, style: { name: 'Custom H2' } }, { index: 5, style: { name: 'Tahoma' } }]
                        },
                        {
                            index: 2,
                            cells: [{ index: 1, style: { name: 'Custom H3' } }, { index: 10, style: { name: 'Custom Heading' } }]
                        },

                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'globalStyle-withoutvalue.xlsx');
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
    it('GlobalStyle-Numberformat', (done) => {
        let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                /*Style ->1*/{ name: 'Tahoma', fontColor: '#C67878', fontName: 'Tahoma', fontSize: 20, italic: true, bold: true, underline: true, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->2*/{ name: 'Custom Heading', fontName: 'Arial', fontSize: 20, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->3*/{ name: 'Custom H2', fontName: 'Arial', fontSize: 18, wrapText: true, numberFormat: '$#,###.00' },
                /*Style ->4*/{ name: 'Custom H3', fontName: 'Arial', fontSize: 16, wrapText: true, numberFormat: '$#,###.00' },
            ],

            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        {
                            index: 1,
                            cells: [{ index: 1, style: { numberFormat: 'C' } }, { index: 2, style: { numberFormat: 'C' } }]
                        }
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'globalStyle-numberFormat.xlsx');
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
    it('GlobalStyle-duplicateHeader', (done) => {
        try {
            let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                    { name: 'duplicate', fontName: 'Arial', fontSize: '20', wrapText: true, backColor: '#C67890' },
                    { name: 'duplicate1', fontName: 'Arial', fontSize: '20', wrapText: true, backColor: '#C67890' },
                    { name: 'duplicate1', fontName: 'Arial', fontSize: '20', wrapText: true, backColor: '#C67890' },
                    // { name: 'duplicate', fontName: 'Arial', fontSize: '20', wrapText: true, backColor: '#C67896' },
                ],

                worksheets: [
                    {
                        name: 'CellStyle',
                        rows: [
                            {
                                index: 1,
                                cells: [{ index: 1, style: { name: 'duplicate' } }]
                            }
                        ],
                    }]
            }, 'xlsx');
            book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
                if (Utils.isDownloadEnabled) {
                    Utils.download(xlBlob.blobData, 'globalStyle-duplicateHeader.xlsx');
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
            expect('Style name duplicate1 is already existed').toEqual(error.message);
            done();
        }
    });
    it('GlobalStyle-duplicateStylee', (done) => {

        let book: Workbook = new Workbook({
                        /*Global Styles*/styles: [
                { name: 'norm', fontName: 'Arial', fontSize: '20', wrapText: true, backColor: '#C67890' },
                { name: 'duplicate', fontName: 'Arial', fontSize: '20', wrapText: true },
                { name: 'duplicate1', fontName: 'Arial', fontSize: '20', wrapText: true },
                // { name: 'duplicate', fontName: 'Arial', fontSize: '20', wrapText: true, backColor: '#C67896' },
            ],

            worksheets: [
                {
                    name: 'CellStyle',
                    rows: [
                        {
                            index: 1,
                            cells: [
                                {
                                    index: 1, value: 'A1', style: { name: 'duplicate' }
                                },
                                {
                                    index: 2, value: 'B1', style: { fontSize: 10 }
                                },
                                {
                                    index: 3, value: 'C1', style: { name: 'duplicate1' }
                                },
                                {
                                    index: 4, value: 10, style: { name: 'norm' }
                                }
                            ]
                        }
                    ],
                }]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'GlobalStyle-duplicateStylee.xlsx');
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
