import { Workbook } from './../src/workbook';
import { Utils } from './../spec/utils.spec';
describe('Demo', () => {
    it('All-Features', (done) => {
        let book: Workbook = new Workbook({
            builtInProperties: {
                author: 'Rex',
                comments: 'Listed the development team members',
                category: 'Report',
                company: 'NorthWind Traders',
                manager: 'John',
                subject: 'Development Team Members',
                title: 'Active Development Team Members',
                createdDate: new Date(),
                modifiedDate: new Date(),
                status: "In-Progress",
                tags: "Excel",
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
                  /*grouping-setup*/  pageSetup: { isSummaryRowBelow: false },
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
                            index: 6,
                            /*grouping*/  grouping: { outlineLevel: 1, isHidden: true },
                            cells: [
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
                            index: 7,
                            /*grouping*/  grouping: { outlineLevel: 1, isHidden: true },
                            cells: [
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
                            index: 8,
                            /*grouping*/  grouping: { outlineLevel: 1, isHidden: true },
                            cells: [
                                /*column -> 1*/
                                {
                                    index: 1, value: 'Test for wrap text - So text need to long wrapping',
                                    /*Cell Style - Wrap text*/
                                    style: {
                                        wrapText: true
                                    }
                                }]
                        }
                    ],
                },
                {
                    name: 'FreezeTopRow',
                    showGridLines: false,
                    freeze: { row: 2 },
                },
                {
                    name: 'FreezeFirstColumn',
                    freeze: { column: 2 },
                },
                {
                    name: 'FreezeRowColumn',
                    freeze: { row: 2, column: 3 },
                },
                {
                    name: 'PrintTitles',
                    printTitle: { fromRow: 1, toRow: 2, fromColumn: 1, toColumn: 2 },
                },
            ]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'All-Features-1.xlsx');
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

    it('All-Features-2', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Sheet',
              /*grouping-setup*/  pageSetup: { isSummaryRowBelow: false },
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
                            /*row -> 10*/ {
                            index: 1,
        /*grouping*/  grouping: { outlineLevel: 1, isHidden: true },
                            cells: [
                                /*column ->1*/
                                {
                                    index: 1, value: 'Vertical alignment center',
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
                                    index: 2, value: 'Vertical alignment top',
                                    /*Cell Style - Vertical alignment - top*/
                                    style: {
                                        vAlign: 'top'
                                    }
                                },
                                /*column ->3*/
                                {
                                    index: 3, value: 'Vertical alignment bottom default',
                                    /*Cell Style - Vertical alignment - bottom*/
                                }]
                        },
                        /*row -> 11*/ {
                            index: 2,
                            /*grouping*/  grouping: { outlineLevel: 1, isHidden: true },
                            cells: [
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
                            index: 3,
                            /*grouping*/  grouping: { outlineLevel: 1, isHidden: true },
                            cells: [
                                /*column ->1*/
                                {
                                    index: 1, value: 'Separate bottom border',
                                    /*Cell Style - All Borders(left, right, top, bottom)
                                    Allowed line styles 'thin', 'medium', 'thick'                                    
                                    */
                                    style: {
                                        bottomBorder: { color: '#C67878', lineStyle: 'thick' }
                                    }
                                },
                                /*column ->2*/
                                {
                                    index: 2, value: 'Separate top border',
                                    /*Cell Style - All Borders(left, right, top, bottom)
                                    Allowed line styles 'thin', 'medium', 'thick'                                    
                                    */
                                    style: {
                                        topBorder: { color: '#C67878', lineStyle: 'thick' }
                                    }
                                },
                                /*column ->3*/
                                {
                                    index: 3, value: 'Separate left border',
                                    /*Cell Style - All Borders(left, right, top, bottom)
                                    Allowed line styles 'thin', 'medium', 'thick'                                    
                                    */
                                    style: {
                                        leftBorder: { color: '#C67878', lineStyle: 'thick' }
                                    }

                                },
                                /*column ->4*/
                                {
                                    index: 4, value: 'Separate right border',
                                    /*Cell Style - All Borders(left, right, top, bottom)
                                    Allowed line styles 'thin', 'medium', 'thick'                                    
                                    */
                                    style: {
                                        rightBorder: { color: '#C67878', lineStyle: 'thick' }
                                    }

                                }]
                        },
                        /*row -> 13*/ {
                            index: 4,
                            /*grouping*/  grouping: { outlineLevel: 1, isHidden: true },
                            cells: [
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
                            index: 5,
                            /*grouping*/  grouping: { outlineLevel: 1, isHidden: true },
                            height: 100, /*Row height*/
                            cells: [{ index: 1, value: 'Row height' }]
                        },
                        /*row -> 15*/ {
                            index: 6,
                            /*grouping*/  grouping: { outlineLevel: 1, isHidden: true },
                            height: 100, /*Row height*/
                            cells: [
                                /*cell with merge*/{
                                    index: 1,
                                    rowSpan: 3,
                                    colSpan: 4,
                                    value: 'Merge text'
                                }
                            ]
                        },
                        /*row -> 16*/ {
                            index: 7,
                           /*grouping*/ grouping: { isCollapsed: true }
                        }]
                }
            ]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'All-Features-2.xlsx');
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

    it('All-Features-3', (done) => {
        let book: Workbook = new Workbook({
            worksheets: [
                {
                    name: 'Sheet',
                    rows: [
    /*row -> 9*/ {
                            index: 1,
                            cells: [
                                /*column ->1*/
                                {
                                    index: 1, value: 'Horizontal alignment right',
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
                                    index: 2, value: 'Horizontal alignment center',
                                    /*Cell Style - Horizontal alignment - Center*/
                                    style: {
                                        hAlign: 'center'
                                    }
                                },
                                /*column ->3*/
                                {
                                    index: 3, value: 'Horizontal alignment left',
                                    /*Cell Style - Horizontal alignment - left*/
                                    style: {
                                        hAlign: 'left'
                                    }
                                }]
                        },

                    ]
                }
            ]
        }, 'xlsx');
        book.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'All-Features-3.xlsx');
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
