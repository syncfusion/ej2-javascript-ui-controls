/**
 *  Spreadsheet base spec
 */
import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, productData } from '../util/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { CellModel, getModel, SheetModel, RowModel } from '../../../src/workbook/index';
import { EmitType } from '@syncfusion/ej2-base';

Spreadsheet.Inject(BasicModule);

describe('Spreadsheet base module ->', () => {
    let helper: SpreadsheetHelper;
    let model: SpreadsheetModel;

    beforeAll(() => {
        helper = new SpreadsheetHelper('spreadsheet');
    });

    describe('Render checking ->', () => {

        afterEach(() => {
            helper.invoke('destroy');
        });

        it('Local data bind testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => {
                setTimeout(() => {
                    let sheets: SheetModel[] = helper.getInstance().sheets;
                    expect(sheets.length).toBe(1);
                    expect(sheets[0].rows.length).toBe(11);
                    expect(sheets[0].rows[0].cells.length).toBe(8);
                    done();
                }, 30);
            };
            model = {
                sheets: [{
                    ranges: [{ dataSource: defaultData }]
                }],
                dataBound: dataBound
            };
            helper.initializeSpreadsheet(model);
        });

        it('Cell data bind testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => {
                setTimeout(() => {
                    helper.invoke('getData', ['Sheet1!D1']).then((values: Map<string, CellModel>) => {
                        expect(values.get('D1').value).toEqual('10.1');
                    });
                    helper.invoke('getData', ['Sheet1!G1']).then((values: Map<string, CellModel>) => {
                        expect(values.get('G1').value.toString()).toBe('30');
                        expect(values.get('G1').formula).toEqual('=SUM(10,20)');
                        done();
                    });
                }, 30);
            };
            model = {
                sheets: [{
                    rows: [
                        {
                            index: 0,
                            cells: [
                                { value: 'JavaScript' },
                                { value: '10' },
                                { value: '100' },
                                { value: '10.1' },
                                { index: 5, value: 'SUM' },
                                { formula: '=SUM(10,20)' },
                                { formula: '=SUM(B1,10)' },
                                { formula: '=SUM(20,B1)' },
                                { formula: '=SUM(B1,C1,D1)' },
                                { formula: '=SUM(B1:B5, 50)' },
                                { formula: '=SUM(Sheet1!C2, 10)' },
                                { formula: '=SUM(Sheet2!C1, 10)' },
                                { formula: '=SUM(Sheet2!C5, 10)' }
                            ]
                        },
                        {
                            index: 1,
                            cells: [
                                { value: 'Angular' },
                                { value: '20' },
                                { value: '200' },
                                { value: '20.2' }
                            ]
                        },
                        {
                            index: 2,
                            cells: [
                                { value: 'React' },
                                { value: '30' },
                                { value: '300' },
                                { value: '30.3' }
                            ]
                        },
                        {
                            index: 3,
                            cells: [
                                { value: 'Vue' },
                                { value: '40' },
                                { value: '400' },
                                { value: '40.4' }
                            ]
                        },
                        {
                            index: 4,
                            cells: [
                                { value: 'Asp.Net Core' },
                                { value: '50' },
                                { value: '500' },
                                { value: '50.5' }
                            ]
                        }
                    ],
                    columns: [
                        { width: 120 }
                    ]
                },
                {
                    rows: [
                        {
                            index: 0,
                            cells: [
                                { value: 'JavaScript' },
                                { value: '10' },
                                { value: '100' },
                                { value: '10.1' },
                                { index: 5, value: 'SUM' },
                                { formula: '=SUM(10,20)' },
                                { formula: '=SUM(B1,10)' },
                                { formula: '=SUM(20,B1)' },
                                { formula: '=SUM(B1,C1,D1)' },
                                { formula: '=SUM(B1:B5, 50)' },
                                { formula: '=SUM(Sheet2!C2, 10)' },
                                { formula: '=SUM(Sheet1!C1, 10)' },
                                { formula: '=SUM(Sheet1!C5, 10)' }
                            ]
                        },
                        {
                            index: 1,
                            cells: [
                                { value: 'Angular' },
                                { value: '20' },
                                { value: '200' },
                                { value: '20.2' }
                            ]
                        },
                        {
                            index: 2,
                            cells: [
                                { value: 'React' },
                                { value: '30' },
                                { value: '300' },
                                { value: '30.3' }
                            ]
                        },
                        {
                            index: 3,
                            cells: [
                                { value: 'Vue' },
                                { value: '40' },
                                { value: '400' },
                                { value: '40.4' }
                            ]
                        },
                        {
                            index: 4,
                            cells: [
                                { value: 'Asp.Net Core' },
                                { value: '50' },
                                { value: '500' },
                                { value: '50.5' }
                            ]
                        }
                    ],
                    columns: [
                        { width: 120 }
                    ]
                }],
                dataBound: dataBound
            };
            helper.initializeSpreadsheet(model);
        });

        it('Column width testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => {
                setTimeout(() => {
                    let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                    expect(getComputedStyle(td).width).toBe('130px');
                    td = helper.invoke('getCell', [0, 1]);
                    expect(getComputedStyle(td).width).toBe('92px');
                    td = helper.invoke('getCell', [0, 2]);
                    expect(getComputedStyle(td).width).toBe('96px');
                    done();
                }, 30);
            };
            model = {
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    columns: [
                        {
                            width: 130
                        },
                        {
                            width: 92
                        },
                        {
                            width: 96
                        }
                    ]
                }],
                dataBound: dataBound
            };
            helper.initializeSpreadsheet(model);
        });

        it('Defined names testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => {
                setTimeout(() => {
                    let nameBoxElem: HTMLElement = helper.getElementFromSpreadsheet('.e-name-box .e-ddl-icon');
                    helper.triggerMouseAction('mousedown', null, nameBoxElem, nameBoxElem);
                    nameBoxElem.click();
                    setTimeout(() => {
                        helper.click('#spreadsheet_name_box_popup .e-item-focus');
                        setTimeout(() => {
                            expect(helper.getInstance().sheets[0].selectedRange).toEqual('B1:B1');
                            done();
                        }, 20);
                    }, 20);
                }, 30);
            };
            model = {
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    columns: [
                        {
                            width: 130
                        },
                        {
                            width: 92
                        },
                        {
                            width: 96
                        }
                    ]
                },
                {
                    ranges: [{ dataSource: defaultData }]
                }
                ],
                definedNames: [
                    { name: 'value', refersTo: '=Sheet1!B1' },
                    { name: 'Range', refersTo: '=Sheet1!B1:B5' },
                    { name: 'Cross_Range', refersTo: '=Sheet2!C5:C10' },
                ],
                dataBound: dataBound
            };
            helper.initializeSpreadsheet(model);
        });

    });

    describe('UI interaction checking ->', () => {

        afterEach(() => {
            helper.invoke('destroy');
        });

        it('Column scrolling testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => {
                setTimeout(() => {
                    //As of now, checked for code coverage.
                    helper.getContentElement().scroll(1500, 0);
                    setTimeout(() => {
                        helper.getContentElement().scroll(15000, 0);
                        setTimeout(() => {
                            done();
                        }, 10);
                    }, 10);
                }, 30);
            };
            model = {
                sheets: [{
                    ranges: [{ dataSource: defaultData }]
                }],
                dataBound: dataBound
            };
            helper.initializeSpreadsheet(model);
        });

        it('Row scrolling testing', (done: Function) => {
            let dataBound: EmitType<Object> = () => {
                setTimeout(() => {
                    //As of now, checked for code coverage.
                    helper.getContentElement().scroll(0, 400);
                    setTimeout(() => {
                        helper.getContentElement().scroll(0, 5000);
                        setTimeout(() => {
                            done();
                        }, 10);
                    }, 10);
                }, 30);
            };
            model = {
                sheets: [{
                    ranges: [{ dataSource: defaultData }]
                }],
                dataBound: dataBound
            };
            helper.initializeSpreadsheet(model);
        });

        // it('Non-virtual mode -> Column scrolling testing', (done: Function) => {
        //     let dataBound: EmitType<Object> = () => {
        //         setTimeout(() => {
        //             //As of now, checked for code coverage.
        //             helper.getContentElement().scroll(1500, 0);
        //             setTimeout(() => {
        //                 done();
        //             }, 10);
        //         }, 30);
        //     };
        //     model = {
        //         sheets: [{
        //             ranges: [{ dataSource: defaultData }]
        //         }],
        //         scrollSettings: {
        //             enableVirtualization: false
        //         },
        //         dataBound: dataBound
        //     };
        //     helper.initializeSpreadsheet(model);
        // });

        // it('Non-virtual mode -> Row scrolling testing', (done: Function) => {
        //     let dataBound: EmitType<Object> = () => {
        //         setTimeout(() => {
        //             //As of now, checked for code coverage.
        //             helper.getContentElement().scroll(0, 1500);
        //             setTimeout(() => {
        //                 done();
        //             }, 10);
        //         }, 30);
        //     };
        //     model = {
        //         sheets: [{
        //             ranges: [{ dataSource: defaultData }]
        //         }],
        //         scrollSettings: {
        //             enableVirtualization: false
        //         },
        //         dataBound: dataBound
        //     };
        //     helper.initializeSpreadsheet(model);
        // });
    });

    describe('Property checking ->', () => {

        afterEach(() => {
            helper.invoke('destroy');
        });

        it('cssClass testing', (done: Function) => {
            model = {
                cssClass: 'e-custom'
            };
            helper.initializeSpreadsheet(model);
            expect(helper.hasClass('e-custom')).toBeTruthy();
            done();
        });

    });

    describe('OnProperty change checking ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }]
                    },
                    {
                        ranges: [{ dataSource: productData }]
                    }
                ]
            };
            helper.initializeSpreadsheet(model, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        it('enableRtl testing', (done: Function) => {
            helper.setModel('enableRtl', true);
            expect(helper.hasClass('e-rtl', helper.getSheetPanelElement())).toBeTruthy();
            helper.setModel('enableRtl', false);
            expect(helper.hasClass('e-rtl', helper.getSheetPanelElement())).toBeFalsy();
            done();
        });

        it('cssClass testing', (done: Function) => {
            helper.setModel('cssClass', 'e-custom e-custom1');
            expect(helper.hasClass('e-custom')).toBeTruthy();
            expect(helper.hasClass('e-custom1')).toBeTruthy();
            helper.setModel('cssClass', '');
            expect(helper.hasClass('e-custom')).toBeFalsy();
            expect(helper.hasClass('e-custom1')).toBeFalsy();
            done();
        });

        it('activeSheetIndex testing', (done: Function) => {
            helper.setModel('activeSheetIndex', 1);
            helper.eventHandler('dataBound', (args: EmitType<Object>) => {
                setTimeout(() => {
                    if (helper.getModel('activeSheetIndex') === 0) {
                        helper.eventHandler('dataBound', null);
                        done();
                    } else {
                        expect(helper.getModel('activeSheetIndex')).toBe(1);
                        let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                        expect(td.textContent).toBe('ProductID');
                        helper.setModel('activeSheetIndex', 0);
                    }
                }, 30);
            });
        });

        it('width testing', (done: Function) => {
            helper.setModel('width', 1000);
            expect(helper.getElement().style.width).toBe('1000px');
            done();
        });

        it('height testing', (done: Function) => {
            helper.setModel('height', 500);
            expect(helper.getElement().style.height).toBe('500px');
            done();
        });

    });

    describe('Methods checking ->', () => {

        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }]
                    }
                ]
            };
            helper.initializeSpreadsheet(model, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        it('getCell testing', (done: Function) => {
            let td: HTMLTableCellElement = helper.invoke('getCell', [10, 10]);
            expect(helper.hasClass('e-cell', td)).toBeTruthy();
            expect(td.getAttribute('aria-colindex')).toEqual('11');
            done();
        });

        it('getRow testing', (done: Function) => {
            let tr: HTMLTableRowElement = helper.invoke('getRow', [10]);
            expect(helper.hasClass('e-row', tr)).toBeTruthy();
            expect(tr.getAttribute('aria-rowindex')).toEqual('11');
            done();
        });

        //Checked for code coverage.
        it('resize testing', (done: Function) => {
            document.body.style.height = '120%';
            helper.invoke('resize');
            done();
        });

        it('showSpinner testing', (done: Function) => {
            let spinnerElem: HTMLElement = helper.getSpinnerElement();
            helper.invoke('showSpinner');
            expect(helper.hasClass('e-spin-show', spinnerElem)).toBeTruthy();
            done();
        });

        it('hideSpinner testing', (done: Function) => {
            let spinnerElem: HTMLElement = helper.getSpinnerElement();
            helper.invoke('hideSpinner');
            expect(helper.hasClass('e-spin-hide', spinnerElem)).toBeTruthy();
            done();
        });

        it('goTo testing', (done: Function) => {
            // let content: HTMLElement = helper.getContentElement();
            // let rhdr: HTMLElement = helper.getRowHeaderElement();
            // let chdr: HTMLElement = helper.getColHeaderElement();
            helper.invoke('goTo', ['Z100']);
            setTimeout(() => {
                // expect(content.querySelector('tr[aria-rowindex="100"]')).toBeDefined();
                // expect(helper.getInstance().sheets[0].topLeftCell).toEqual('Z100');
                // expect(content.scrollTop).toEqual(1980);
                // expect(rhdr.scrollTop).toEqual(1980);
                // expect(content.scrollLeft).toEqual(1600);
                // expect(chdr.scrollLeft).toEqual(1600);
                helper.invoke('goTo', ['A1']);
                // setTimeout(() => {
                //     expect(content.querySelector('tr[aria-rowindex="1"]')).toBeDefined();
                //     expect(helper.getInstance().sheets[0].topLeftCell).toEqual('A1');
                //     expect(content.scrollTop).toEqual(0);
                //     expect(rhdr.scrollTop).toEqual(0);
                //     expect(content.scrollLeft).toEqual(0);
                //     expect(chdr.scrollLeft).toEqual(0);
                //     done();
                // });
                done();
            }, 10);
        });

        it('selectRange testing', (done: Function) => {
            helper.invoke('selectRange', ['D1']);
            expect(helper.getInstance().sheets[0].selectedRange).toEqual('D1:D1');
            done();
        });

        it('cut testing', (done: Function) => {
            helper.invoke('cut').then(() => {
                helper.invoke('selectRange', ['K1']);
                helper.invoke('paste', ['K1']);
                helper.invoke('getData', ['Sheet1!K1']).then((values: Map<string, CellModel>) => {
                    expect(values.get('K1').value).toEqual('Quantity');
                    done();
                });
            });
        });

        it('copy testing', (done: Function) => {
            helper.invoke('copy').then(() => {
                helper.invoke('selectRange', ['K2']);
                helper.invoke('paste', ['K2']);
                helper.invoke('getData', ['Sheet1!K2']).then((values: Map<string, CellModel>) => {
                    expect(values.get('K2').value).toEqual('Quantity');
                    done();
                });
            })
        });

        it('paste testing', (done: Function) => {
            helper.invoke('selectRange', ['K1']);
            helper.invoke('copy').then(() => {
                helper.invoke('selectRange', ['K3']);
                helper.invoke('paste', ['K3']);
                helper.invoke('getData', ['Sheet1!K3']).then((values: Map<string, CellModel>) => {
                    expect(values.get('K3').value).toEqual('Quantity');
                    done();
                });
            });
        });

        it('setUsedRange testing', (done: Function) => {
            helper.invoke('setUsedRange', [11, 12]);
            expect(helper.getInstance().sheets[0].usedRange.rowIndex).toEqual(11);
            expect(helper.getInstance().sheets[0].usedRange.colIndex).toEqual(12);
            done();
        });

        it('getRowHeaderContent testing', (done: Function) => {
            expect(helper.invoke('getRowHeaderContent')).not.toBeNull();
            done();
        });

        it('getColumnHeaderContent testing', (done: Function) => {
            expect(helper.invoke('getColumnHeaderContent')).not.toBeNull();
            done();
        });

        it('getMainContent testing', (done: Function) => {
            expect(helper.invoke('getMainContent')).not.toBeNull();
            done();
        });

        it('getContentTable testing', (done: Function) => {
            expect(helper.invoke('getContentTable')).not.toBeNull();
            done();
        });

        it('getRowHeaderTable testing', (done: Function) => {
            expect(helper.invoke('getRowHeaderTable')).not.toBeNull();
            done();
        });

        it('getColHeaderTable testing', (done: Function) => {
            expect(helper.invoke('getColHeaderTable')).not.toBeNull();
            done();
        });

        it('isMobileView testing', (done: Function) => {
            expect(helper.invoke('isMobileView')).toBeFalsy();
            done();
        });

        it('getModuleName testing', (done: Function) => {
            expect(helper.invoke('getModuleName')).toBe('spreadsheet');
            done();
        });

        it('setRowHeight testing', (done: Function) => {
            helper.invoke('setRowHeight', [100, 2, 1]);
            let tr: HTMLTableRowElement = helper.invoke('getRow', [2]);
            expect(tr.style.height).toBe('100px');
            done();
        });

        it('refreshNode testing', (done: Function) => {
            let td: HTMLTableCellElement = helper.invoke('getCell', [0, 8]);
            helper.invoke('refreshNode', [td, { result: 'test' }]);
            expect(td.textContent).toBe('test');
            done();
        });

        it('startEdit testing', (done: Function) => {
            helper.invoke('selectRange', ['K3']);
            helper.invoke('startEdit');
            let editorElem: HTMLElement = helper.getElement('.e-spreadsheet-edit');
            expect(helper.getInstance().isEdit).toBeTruthy();
            setTimeout(() => {
                expect(editorElem.textContent).toBe('Quantity');
                editorElem.textContent = 'Test';
                helper.triggerKeyNativeEvent(17); //To update internal props.
                done();
            }, 20);
        });

        it('endEdit testing', (done: Function) => {
            helper.invoke('endEdit');
            expect(helper.getInstance().isEdit).toBeFalsy();
            helper.invoke('getData', ['Sheet1!K3']).then((values: Map<string, CellModel>) => {
                expect(values.get('K3').value).toEqual('Test');
                done();
            });
        });

        it('closeEdit testing', (done: Function) => {
            helper.invoke('startEdit');
            let editorElem: HTMLElement = helper.getElement('.e-spreadsheet-edit');
            expect(helper.getInstance().isEdit).toBeTruthy();
            setTimeout(() => {
                expect(editorElem.textContent).toBe('Test');
                editorElem.textContent = 'Quantity';
                helper.triggerKeyNativeEvent(17); //To update internal props.
                helper.invoke('closeEdit');
                expect(helper.getInstance().isEdit).toBeFalsy();
                helper.invoke('getData', ['Sheet1!K3']).then((values: Map<string, CellModel>) => {
                    expect(values.get('K3').value).toEqual('Test');
                    done();
                });
            }, 20);
        });

        it('clearRange testing', (done: Function) => {
            helper.invoke('clearRange', ['K3']);
            helper.invoke('getData', ['Sheet1!K3']).then((values: Map<string, CellModel>) => {
                expect(values.get('K3').value).toBeUndefined();
                done();
            });
        });

        it('getModel testing', () => {
            let sheets: SheetModel[] = helper.getInstance().sheets;
            expect(getModel(sheets, 0)).not.toBeNull();
            let rows: RowModel[] = helper.getInstance().sheets[0].rows;
            expect(getModel(rows, 5)).not.toBeNull();
        });

        it('addDefinedName testing', () => {
            expect(helper.getInstance().definedNames.length).toBe(0);
            let result: boolean = helper.invoke('addDefinedName', [{ name: 'TestName', refersTo: 'Sheet1!A1:A10' }]);
            expect(result).toBeTruthy();
            expect(helper.getInstance().definedNames.length).toBe(1);
            expect(helper.getInstance().definedNames[0].name).toBe('TestName');
        });

        it('removeDefinedName testing', () => {
            expect(helper.getInstance().definedNames.length).toBe(1);
            let result: boolean = helper.invoke('removeDefinedName', ['TestName']);
            expect(result).toBeTruthy();
            expect(helper.getInstance().definedNames.length).toBe(0);
        });

    });

    describe('OnProperty change checking ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }]
                    }
                ]
            };
            helper.initializeSpreadsheet(model, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

    });

    // describe('Device Mode Checking ->', () => {

    //     beforeAll(() => {
    //         Browser.userAgent = helper.androidUserAgent;
    //     });

    //     afterAll(() => {
    //         Browser.userAgent = '';
    //     });

    //     afterEach(() => {
    //         helper.invoke('destroy');
    //     });

    //     it('Render testing', (done: Function) => {
    //         helper.initializeSpreadsheet(model, done);
    //         expect(helper.hasClass('e-mobile-view')).toBeTruthy();
    //     });

    //     it('isMobileView method testing', (done: Function) => {
    //         expect(helper.invoke('isMobileView')).toBeTruthy();
    //         done();
    //     });

    // });

});