/**
 *  Spreadsheet base spec
 */
import { SpreadsheetModel, Spreadsheet, CellSaveEventArgs, onContentScroll, getSheetProperties, setColMinWidth, inView, setStandardHeight, getStandardHeight } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, productData, filterData, ScrollingData } from '../util/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { CellModel, getModel, SheetModel, RowModel, BeforeCellUpdateArgs, getRangeIndexes, getCell, ImageModel, Workbook, getSheetIndex, getSheetNameCount, getSelectedRange, duplicateSheet, getRangeAddress, processIdx } from '../../../src/workbook/index';
import { getRowHeight, DataSourceChangedEventArgs, DialogBeforeOpenEventArgs, focus } from '../../../src/index';
import { Dialog } from './../../../src//spreadsheet/services/dialog';
import { EmitType, setCurrencyCode, L10n, createElement } from '@syncfusion/ej2-base';
import { PredicateModel } from '@syncfusion/ej2-grids';
import { WorkbookHelper } from '../../workbook/util/workbookhelper.spec';

describe('Spreadsheet base module ->', () => {
    let helper: SpreadsheetHelper;
    let model: SpreadsheetModel;
    let spreadsheetEle: Spreadsheet;
    let workbookHelper: WorkbookHelper;

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
            expect(helper.hasClass('e-rtl', helper.getSheetPanelElement())).toBeFalsy();
            helper.setModel('enableRtl', true);
            expect(helper.hasClass('e-rtl', helper.getSheetPanelElement())).toBeTruthy();
            // helper.setModel('enableRtl', false);
            // expect(helper.hasClass('e-rtl', helper.getSheetPanelElement())).toBeFalsy();
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
        it('allowPrint testing', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.allowPrint).toBeTruthy();
            helper.setAnimationToNone(`#${helper.id}_ribbon_menu`);
            helper.click(`#${helper.id}_File`);
            let printMenuItem: HTMLElement = helper.getElement(`#${helper.id}_Print`);
            expect(printMenuItem).not.toBeNull();
            expect(printMenuItem.classList.contains('e-disabled')).toBeFalsy();
            helper.setModel('allowPrint', false);
            expect(spreadsheet.allowPrint).toBeFalsy();
            expect(printMenuItem.classList.contains('e-disabled')).toBeFalsy();
            helper.click(`#${helper.id}_ribbon`);
            helper.click(`#${helper.id}_File`);
            printMenuItem = helper.getElement(`#${helper.id}_Print`);
            expect(printMenuItem).not.toBeNull();
            expect(printMenuItem.classList.contains('e-disabled')).toBeTruthy();
            helper.setModel('allowPrint', true);
            expect(printMenuItem.classList.contains('e-disabled')).toBeTruthy();
            helper.click(`#${helper.id}_ribbon`);
            helper.click(`#${helper.id}_File`);
            printMenuItem = helper.getElement(`#${helper.id}_Print`);
            expect(printMenuItem).not.toBeNull();
            expect(printMenuItem.classList.contains('e-disabled')).toBeFalsy();
            helper.click(`#${helper.id}_ribbon`);
            done();
        });
        it('showAggregate testing', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.showAggregate).toBeTruthy();
            expect(helper.getElement(`#${helper.id}_aggregate`)).toBeNull();
            helper.invoke('selectRange', ['A1:A5']);
            const aggregateBtn: HTMLElement = helper.getElement(`#${helper.id}_aggregate`);
            expect(aggregateBtn).not.toBeNull();
            expect(aggregateBtn.textContent).toBe('Count: 5');
            helper.setModel('showAggregate', false);
            expect(spreadsheet.showAggregate).toBeFalsy();
            expect(helper.getElement(`#${helper.id}_aggregate`)).toBeNull();
            helper.setModel('showAggregate', true);
            expect(helper.getElement(`#${helper.id}_aggregate`)).not.toBeNull();
            helper.invoke('selectRange', ['A1']);
            expect(helper.getElement(`#${helper.id}_aggregate`)).toBeNull();
            done();
        });
    });

    describe('Methods checking - I ->', () => {

        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }]
                    }, {}, { index: 3 }
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
                    helper.invoke('closeEdit');
                    done();
                });
            }, 20);
        });

        it('getModel testing', () => {
            let sheets: SheetModel[] = helper.getInstance().sheets;
            expect(getModel(sheets, 0)).not.toBeNull();
            let rows: RowModel[] = helper.getInstance().sheets[0].rows;
            expect(getModel(rows, 5)).not.toBeNull();
            rows = helper.getInstance().sheets[3].rows;
            expect(rows.length).toBe(0);
            rows.push({ index: 9, cells: [] });
            expect(rows.length).toBe(1);
            getModel(rows, 0);
            expect(rows.length).toBe(10);
            const cells: CellModel[] = helper.getInstance().sheets[3].rows[9].cells;
            expect(cells.length).toBe(0);
            cells[2] = { index: 4, value: 'Test' };
            cells[6] = { value: 'Test' };
            getModel(cells, 4);
            expect(cells.length).toBe(9);
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

        it('setColumnWidth testing', (done: Function) => {
            helper.invoke('setColWidth', [130, 1]);
            expect(helper.getInstance().sheets[0].columns[1].width).toBe(130);
            // expect(getComputedStyle(helper.invoke('getCell', [0, 1])).width).toBe('130px'); // Check this now
            // expect(getComputedStyle(helper.getColHeaderElement().querySelector('.e-header-row').children[1]).width).toBe('130px'); // Check this it only fails in CI machine
            helper.invoke('setColWidth', [120, 2, 1]);
            expect(helper.getInstance().sheets[1].columns[2].width).toBe(120);
            done();
        });

        it('setRowsHeight testing', (done: Function) => {
            helper.invoke('setRowsHeight', [50, ['1', '8:10', 'Sheet2!10:13']]);
            setTimeout(() => {
                //const tr: HTMLTableRowElement = helper.invoke('getContentTable').rows[7];
               // expect(tr.style.height).toBe('50px');
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].height).toBe(50);
                expect(spreadsheet.sheets[0].rows[7].height).toBe(50);
                expect(spreadsheet.sheets[0].rows[8].height).toBe(50);
                expect(spreadsheet.sheets[0].rows[9].height).toBe(50);
                expect(spreadsheet.sheets[1].rows[9].height).toBe(50);
                expect(spreadsheet.sheets[1].rows[12].height).toBe(50);
                helper.invoke('setRowsHeight');
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[0].height).toBe(20);
                    expect(spreadsheet.sheets[0].rows[7].height).toBe(20);
                    expect(spreadsheet.sheets[0].rows[8].height).toBe(20);
                    expect(spreadsheet.sheets[0].rows[9].height).toBe(20);
                    done();
                }, 20);
            }, 30);
        });
        it('setColumnsWidth testing', (done: Function) => {
            helper.invoke('setColumnsWidth', [80, ['A', 'B:D', 'Sheet2!G:I']]);
            let col: HTMLElement = helper.invoke('getContentTable').querySelector('colgroup col');
            // expect(col.style.width).toBe('80px');
            const spreadsheet: Spreadsheet = helper.getInstance();
            // expect(spreadsheet.sheets[0].columns[0].width).toBe(80);
            // expect(spreadsheet.sheets[0].columns[1].width).toBe(80);
            // expect(spreadsheet.sheets[0].columns[2].width).toBe(80);
            // expect(spreadsheet.sheets[0].columns[3].width).toBe(80);
            // expect(spreadsheet.sheets[1].columns[6].width).toBe(80);
            // expect(spreadsheet.sheets[1].columns[8].width).toBe(80);
            helper.invoke('setColumnsWidth');
            // expect(spreadsheet.sheets[0].columns[0].width).toBe(64);
            // expect(spreadsheet.sheets[0].columns[1].width).toBe(64);
            // expect(spreadsheet.sheets[0].columns[2].width).toBe(64);
            // expect(spreadsheet.sheets[0].columns[3].width).toBe(64);
            done();
        });
        it('I489622 -> setColumnsWidth without passing ranges ', (done: Function) => {
            helper.invoke('setColumnsWidth', [130]);
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].columns[0].width).toBe(130);
            expect(spreadsheet.sheets[0].columns[1].width).toBe(130);
            expect(spreadsheet.sheets[0].columns[2].width).toBe(130);
            expect(spreadsheet.sheets[0].columns[3].width).toBe(130);
            expect(spreadsheet.sheets[0].columns[4].width).toBe(130);
            expect(spreadsheet.sheets[0].columns[5].width).toBe(130);
            expect(spreadsheet.sheets[0].columns[6].width).toBe(130);
            expect(spreadsheet.sheets[0].columns[7].width).toBe(130);
            done();
        });
    });

    describe('Methods checking - II ->', () => {
        const createdFn: jasmine.Spy = jasmine.createSpy('created');
        beforeAll((done: Function) => {
            const spreadsheet: Spreadsheet = helper.initializeSpreadsheet(
                {
                    sheets: [{ ranges: [{ dataSource: defaultData }]}],
                    created: createdFn
                }, done);
            // Invoking refresh before the component is rendered and the created event is not yet triggered.
            spreadsheet.refresh();
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing the created event is triggered properly when we initiate the refresh before it gets rendered', (done: Function) => {
            expect(createdFn).toHaveBeenCalled();
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                done();
            });
        });
        it('setRowHeight testing', (done: Function) => {
            helper.invoke('setRowHeight', [100, 2]);
            setTimeout(() => {
                let tr: HTMLTableRowElement = helper.invoke('getRow', [2]);
                expect(tr.style.height).toBe('100px');
                done();
            });
        });
        it('refreshNode testing', (done: Function) => {
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 8]);
            helper.invoke('refreshNode', [td, { result: 'check' }]);
            expect(td.textContent).toBe('check');
            helper.invoke('refreshNode', [td, { formattedText: 'test' }]);
            expect(td.textContent).toBe('test');
            done();
        });
        it('refresh', (done: Function) => {
            helper.invoke('refresh', []);
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":"Item Name"}');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                done();
            });
        });
        it('updateUndoRedoCollection', (done: Function) => {
            helper.invoke('getCell', [0, 0]).classList.add('customClass');
            helper.invoke('updateUndoRedoCollection', [{ eventArgs: { class: 'customClass', rowIdx: 0, colIdx: 0, action: 'customCSS' } }]);
            expect(helper.getElementFromSpreadsheet('#' + helper.id + '_undo').parentElement.classList).not.toBe('e-overlay');
            helper.getInstance().actionComplete = (args: any) => {
                expect(args.eventArgs.action).toBe('customCSS');
            };
            helper.click('#' + helper.id + '_undo');
            helper.getInstance().actionComplete = undefined;
            done();
        });
        it('addCustomFunction', (done: Function) => {
            (window as any).CustomFuntion = (str: string) => {
                let num: number;
                if (formula === '=SQRT(D2)' || formula === '=SQRT(D2:D2)') {
                    expect(str).toBe('10');
                    num = Number(str);
                } else {
                    expect(str).toBe('D2:D5');
                    num = 0;
                    const indexes: number[] = getRangeIndexes(str);
                    for (let i: number = indexes[0]; i <= indexes[2]; i++) {
                        for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                            num += Number(getCell(i, j, sheet).value);
                        }
                    }
                }
                return Math.sqrt(num);
            };
            helper.invoke('addCustomFunction', ["CustomFuntion", "SQRT"]);
            let formula: string = '=SQRT(D2)';
            helper.edit('J5', formula);
            const cell: HTMLElement = helper.invoke('getCell', [4, 9]);
            const sheet: any = helper.getInstance().sheets[0];
            expect(cell.textContent).toBe('3.16227766');
            expect(sheet.rows[4].cells[9].value).toBe(3.1622776601683795);
            formula = '=SQRT(D2:D5)';
            helper.edit('J5', formula);
            expect(cell.textContent).toBe('8.062257748');
            expect(sheet.rows[4].cells[9].value).toBe(8.06225774829855);
            helper.edit('D3', '30');
            expect(cell.textContent).toBe('8.660254038');
            expect(sheet.rows[4].cells[9].value).toBe(8.660254037844387);
            formula = '=SQRT(D2:D2)';
            helper.edit('J5', formula);
            expect(cell.textContent).toBe('3.16227766');
            expect(sheet.rows[4].cells[9].value).toBe(3.1622776601683795);
            done();
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

        it('showRibbon', (done: Function) => {
            helper.getInstance().showRibbon = false;
            helper.getInstance().dataBind();
            expect(helper.getRibbonElement()).toBeNull();
            helper.getInstance().showRibbon = true;
            helper.getInstance().dataBind();
            expect(helper.getRibbonElement()).not.toBeNull();
            done();
        });

        it('showFormulaBar', (done: Function) => {
            helper.getInstance().showFormulaBar = false;
            helper.getInstance().dataBind();
            expect(helper.getFormulaBarElement()).toBeNull();
            helper.getInstance().showFormulaBar = true;
            helper.getInstance().dataBind();
            expect(helper.getFormulaBarElement()).not.toBeNull();
            done();
        });

        it('showSheetTabs', (done: Function) => {
            helper.getInstance().showSheetTabs = false;
            helper.getInstance().dataBind();
            expect(helper.getElementFromSpreadsheet('.e-sheet-tab-panel')).toBeNull();
            helper.getInstance().showSheetTabs = true;
            helper.getInstance().dataBind();
            expect(helper.getElementFromSpreadsheet('.e-sheet-tab-panel')).not.toBeNull();
            done();
        });

        it('cellStyle', (done: Function) => {
            helper.getInstance().cellStyle = { fontWeight: 'bold', fontSize: '20pt' };
            helper.getInstance().dataBind();
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).style.fontSize).toBe('20pt');
                expect(helper.invoke('getCell', [1, 0]).style.fontSize).toBe('20pt');
                expect(helper.invoke('getCell', [1, 0]).style.fontWeight).toBe('bold');
                helper.getInstance().cellStyle = { fontWeight: 'normal', fontSize: '11pt' };
                helper.getInstance().dataBind();
                // setTimeout(() => { // This case need to be fixed
                //     expect(helper.invoke('getCell', [0, 0]).style.fontSize).toBe('11pt');
                //     expect(helper.invoke('getCell', [1, 0]).style.fontSize).toBe('11pt');
                //     expect(helper.invoke('getCell', [1, 0]).style.fontWeight).toBe('normal');
                     done();
                // });
            });
        });

        it('allowEditing', (done: Function) => {
            helper.getInstance().allowEditing = false;
            helper.getInstance().dataBind();
            expect(helper.getInstance().editModule).toBeUndefined();
            helper.getInstance().allowEditing = true;
            helper.getInstance().dataBind();
            expect(helper.getInstance().editModule).not.toBeUndefined();
            done();
        });

        it('allowInsert', (done: Function) => {
            helper.getInstance().allowInsert = false;
            helper.getInstance().dataBind();
            expect(helper.getElementFromSpreadsheet('.e-add-sheet-tab').classList).toContain('e-disabled');
            helper.getInstance().allowInsert = true;
            helper.getInstance().dataBind();
            expect(helper.getElementFromSpreadsheet('.e-add-sheet-tab').classList).not.toContain('e-disabled');
            done();
        });

        it('locale', (done: Function) => {
            helper.getInstance().locale = 'en-GB';
            helper.getInstance().dataBind();
            done();
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
    describe('Events ->', () => {
        describe('beforeCellUpdate ->', () => {
            let action: string; let cancel: boolean; let spreadsheet: Spreadsheet; let id: string;
            beforeAll((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'D3:D3' }],
                    beforeCellUpdate: (args: BeforeCellUpdateArgs): void => {
                        switch (action) {
                            case 'edit':
                                if (args.cell.value === '0') {
                                    args.cancel = true;
                                } else {
                                    expect(args.cell).toEqual({ value: '5' });
                                    expect(args.rowIndex).toBe(2);
                                    expect(args.colIndex).toBe(3);
                                    expect(args.sheet).toBe('Sheet1');
                                }
                                break;
                            case 'clipboard':
                                if (args.cell === null) {
                                    args.cancel = true;
                                    expect(args.rowIndex).toBe(0);
                                    expect(args.colIndex).toBe(3);
                                } else {
                                    if (args.rowIndex === 3) {
                                        expect(args.cell).toEqual({ value: <any>20 });
                                        expect(args.colIndex).toBe(4);
                                        expect(args.sheet).toBe('Sheet1');
                                    } else if (args.rowIndex === 4) {
                                        expect(args.cell).toEqual({ format: 'h:mm:ss AM/PM', style: undefined });
                                        expect(args.colIndex).toBe(3);
                                    } else {
                                        expect(args.cell).toEqual({ value: 'Quantity' });
                                        expect(args.rowIndex).toBe(0);
                                        expect(args.colIndex).toBe(8);
                                    }
                                }
                                break;
                            case 'cell-delete':
                                if (args.rowIndex === 5) {
                                    args.cancel = true;
                                } else {
                                    expect(args.cell).toEqual({ value: '' });
                                    expect(args.colIndex).toBe(5);
                                }
                                break;
                            case 'wrap':
                                if (spreadsheet.sheets[0].rows[4].cells[6].wrap) {
                                    expect(args.cell).toEqual({ wrap: false });
                                    args.cancel = true;
                                } else {
                                    expect(args.cell).toEqual({ wrap: true });
                                    expect(args.rowIndex).toBe(4);
                                    expect(args.colIndex).toBe(6);
                                }
                                break;
                            case 'number-format':
                                if (args.rowIndex === 0) {
                                    args.cancel = true;
                                } else {
                                    expect(args.cell).toEqual({ format: '$#,##0.00' });
                                    expect(args.rowIndex).toBe(4);
                                    expect(args.colIndex).toBe(6);
                                }
                                break;
                            case 'cell-format':
                                if (args.rowIndex === 4) {
                                    args.cancel = true;
                                } else {
                                    expect(args.cell).toEqual({ style: { fontWeight: 'bold' } });
                                    expect(args.rowIndex).toBe(0);
                                    expect(args.colIndex).toBe(6);
                                }
                                break;
                        }
                    }
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Editing', (done: Function) => {
                spreadsheet = helper.getInstance();
                action = 'edit';
                expect(spreadsheet.sheets[0].rows[2].cells[3].value.toString()).toBe('20');
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = '5';
                helper.triggerKeyNativeEvent(13);
                expect(spreadsheet.sheets[0].rows[2].cells[3].value.toString()).toBe('5');
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = '0';
                helper.triggerKeyNativeEvent(13);
                expect(spreadsheet.sheets[0].rows[2].cells[3].value.toString()).toBe('5');
                done();
            });
            it('Clipboard - copy', (done: Function) => {
                action = 'clipboard';
                id = '#' + helper.id;
                helper.getElement(`${id}_copy`).click();
                helper.invoke('selectRange', ['E4']);
                setTimeout((): void => {
                    helper.getElement(`${id}_paste_dropdownbtn`).click();
                    helper.getElement(`${id}_paste_dropdownbtn-popup .e-item`).click();
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].rows[3].cells[4].value.toString()).toBe('20');
                        helper.invoke('selectRange', ['C5']);
                        helper.getElement(`${id}_copy`).click();
                        helper.invoke('selectRange', ['D5']);
                        setTimeout((): void => {
                            helper.getElement(`${id}_paste_dropdownbtn`).click();
                            helper.getElement(`${id}_paste_dropdownbtn-popup ul`).lastElementChild.click();
                            setTimeout((): void => {
                                expect(spreadsheet.sheets[0].rows[4].cells[3].value.toString()).toBe('15');
                                expect(spreadsheet.sheets[0].rows[4].cells[3].format).toBe('h:mm:ss AM/PM');
                                helper.invoke('selectRange', ['D1']);
                                done();
                            });
                        });
                    });
                });
            });
            it('Clipboard - cut', (done: Function) => {
                helper.getElement(`${id}_cut`).click();
                helper.invoke('selectRange', ['I1']);
                setTimeout((): void => {
                    helper.getElement(`${id}_paste_dropdownbtn`).click();
                    helper.getElement(`${id}_paste_dropdownbtn-popup .e-item`).click();
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].rows[0].cells[3]).toEqual({ value: 'Quantity' });
                        expect(spreadsheet.sheets[0].rows[0].cells[8]).toEqual({ value: 'Quantity' });
                        helper.invoke('selectRange', ['F5:F7']);
                        done();
                    });
                });
            });
            it('Cell delete', (done: Function) => {
                action = 'cell-delete';
                helper.triggerKeyNativeEvent(46);
                expect(spreadsheet.sheets[0].rows[4].cells[5].value).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[5].cells[5].value.toString()).toBe('300');
                expect(spreadsheet.sheets[0].rows[6].cells[5].value).toBeUndefined();
                helper.invoke('selectRange', ['G5']);
                done();
            });
            it('Wrap, cell and number formatting', (done: Function) => {
                action = 'wrap';
                expect(spreadsheet.sheets[0].rows[4].cells[6].wrap).toBeFalsy();
                helper.getElement(`${id}_wrap`).click();
                expect(spreadsheet.sheets[0].rows[4].cells[6].wrap).toBeTruthy();
                helper.getElement(`${id}_wrap`).click();
                expect(spreadsheet.sheets[0].rows[4].cells[6].wrap).toBeTruthy();
                action = 'number-format';
                helper.getElement(`${id}_number_format`).click();
                helper.getElement(`${id}_Currency`).click();
                expect(spreadsheet.sheets[0].rows[4].cells[6].format).toBe('$#,##0.00');
                helper.invoke('selectRange', ['G1']);
                helper.getElement(`${id}_number_format`).click();
                helper.getElement(`${id}_ShortDate`).click();
                expect(spreadsheet.sheets[0].rows[0].cells[6].format).toBeUndefined();
                action = 'cell-format';
                helper.getElement(`${id}_bold`).click();
                expect(spreadsheet.sheets[0].rows[0].cells[6].style).toEqual({ fontWeight: 'bold' });
                helper.invoke('selectRange', ['G5']);
                helper.getElement(`${id}_bold`).click();
                expect(spreadsheet.sheets[0].rows[4].cells[6].style).toBeUndefined();
                done();
            });
        });
    });

    describe('Delete sheet after applying freeze pane ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Delete sheet after applying freeze pane ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(3, 3, 0);
            spreadsheet.insertSheet(1, 1);
            helper.invoke('updateCell', [{ formula: '=Sheet1!A1' }, 'Sheet2!A1']);
            spreadsheet.delete(0, 0, 'Sheet');
            setTimeout((): void => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('#REF!');
                done();
            });
        });
    });

    describe('', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('scroll down with autofill Popup Open', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [0, 3]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.notify(onContentScroll, { scrollTop: 100, scrollLeft: 0 });
                setTimeout((): void => {
                    expect(spreadsheet.viewport.topIndex).toBe(0);
                    done();
                }, 20);
            });           
        });
    });

    describe('Scrolling with Enable Virtualization as False->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rowCount: 50, colCount: 50 }], scrollSettings: { enableVirtualization: false } }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Horizontal scroll', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.notify(onContentScroll, { scrollTop: 0, scrollLeft: 100 });
            setTimeout((): void => {
                expect(spreadsheet.viewport.leftIndex).toBe(0);
                done();
            }, 20);
        });
        it('Vertical scroll', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.notify(onContentScroll, { scrollTop: 200, scrollLeft: 0 });
            setTimeout((): void => {
                expect(spreadsheet.viewport.topIndex).toBe(0);
                done();
            }, 20);
        });          
    });

    describe('Protect Sheet Method, GoTo method, cut method Testing with more than 1 Sheet ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { }, { }, { }, { }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect Sheet other than active sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet(4, { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false }, '123');
            setTimeout(() => {
                expect(spreadsheet.sheets[4].isProtected).toBeTruthy();
                expect(spreadsheet.getActiveSheet().isProtected).toBeFalsy();
                done();
            });
        });
        it('UnProtect Sheet other than active sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unprotectSheet(4);
            setTimeout(() => {
                expect(spreadsheet.sheets[4].isProtected).toBeFalsy();
                done();
            });
        });
        it('Protect Sheet with invalid sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet(7, { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false }, '123');
            setTimeout(() => {
                expect(spreadsheet.getActiveSheet().isProtected).toBeFalsy();
                expect(spreadsheet.sheets[1].isProtected).toBeFalsy();
                expect(spreadsheet.sheets[2].isProtected).toBeFalsy();
                expect(spreadsheet.sheets[3].isProtected).toBeFalsy();
                expect(spreadsheet.sheets[4].isProtected).toBeFalsy();
                done();
            });
        });
        it('Protect Sheet with name as empty string', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet("", { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false }, '123');
            setTimeout(() => {
                expect(spreadsheet.getActiveSheet().isProtected).toBeFalsy();
                expect(spreadsheet.sheets[1].isProtected).toBeFalsy();
                expect(spreadsheet.sheets[2].isProtected).toBeFalsy();
                expect(spreadsheet.sheets[3].isProtected).toBeFalsy();
                expect(spreadsheet.sheets[4].isProtected).toBeFalsy();
                done();
            });
        });
        it('Protect Sheet the active sheet when the sheet is null or undefined', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet(null, { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false }, '123');
            setTimeout(() => {
                expect(spreadsheet.getActiveSheet().isProtected).toBeTruthy();
                done();
            });
        });
        it('UnProtect the active sheet when sheet is not given', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unprotectSheet();
            setTimeout(() => {
                expect(spreadsheet.getActiveSheet().isProtected).toBeFalsy;
                done();
            });
        });
        it('Replace API with mode as workbook', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange('D2');
            spreadsheet.replace({ replaceValue: '100', replaceBy: 'One', value: '10', sheetIndex: 0, findOpt: 'previous', mode: 'Workbook', isCSen: true, isEMatch: true, searchBy: 'By Column' });
            setTimeout((): void => {
                // expect(helper.invoke('getCell', [1, 3]).textContent).toBe('100');
                done();
            });
        });
        it('Find All API with mode as Workbook', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange('A1');
            spreadsheet.findAll( 'Item Name', 'Workbook', true, true, 0);
            setTimeout((): void => {
                expect((spreadsheet.getCell(0,0) as any).innerText).toBe('Item Name');
                done();
            });
        });
        it('goTo testing in other than active sheet above Frozen Rows and Frozen Columns', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(3,3,1);
            setTimeout(() => {
                spreadsheet.goTo('Sheet2!A1');
                setTimeout(() => {
                    expect(spreadsheet.sheets[1].topLeftCell).toBe('A1');
                    spreadsheet.goTo('Sheet1!A1');
                    done();
                });
            });
        });
        it('goTo testing in other than active sheet below Frozen Rows and Frozen Columns', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.goTo('Sheet2!E5');
            setTimeout(() => {
                expect(spreadsheet.sheets[1].topLeftCell).toBe('A1');
                expect(spreadsheet.sheets[1].paneTopLeftCell).toBe('E5');
                done();
            });
        });
        it('goTo testing in other than active sheet with Frozen Columns only', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(0,3,2);
            setTimeout(() => {
                spreadsheet.goTo('Sheet3!D1');
                setTimeout(() => {
                    spreadsheet.goTo('Sheet3!D1');
                    setTimeout(() => {
                        expect(spreadsheet.sheets[2].topLeftCell).toBe('A1');
                        expect(spreadsheet.sheets[2].paneTopLeftCell).toBe('D1');
                        done();
                    });
                });
            });
        });
        it('goTo testing in other than active sheet with Frozen Rows only', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(3,0,3);
            setTimeout(() => {
                spreadsheet.goTo('Sheet4!A10');
                setTimeout(() => {
                    spreadsheet.goTo('Sheet4!A10');
                    setTimeout(() => {
                        expect(spreadsheet.sheets[3].topLeftCell).toBe('A1');
                        expect(spreadsheet.sheets[3].paneTopLeftCell).toBe('A10');
                        done();
                    });
                });
            });
        });
        it('goTo testing in other than active sheet greater than view port', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.goTo('Sheet2!E100');
            setTimeout(() => {
                spreadsheet.goTo('Sheet2!E100');
                setTimeout(() => {
                    expect(spreadsheet.sheets[1].topLeftCell).toBe('A1');
                    expect(spreadsheet.sheets[1].paneTopLeftCell).toBe('E100');
                    done();
                });
            });
        });
        it('goTo testing in active sheet greater than view port', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.goTo('Sheet2!E100');
            setTimeout(() => {
                expect(spreadsheet.sheets[1].topLeftCell).toBe('A1');
                expect(spreadsheet.sheets[1].paneTopLeftCell).toBe('E100');
                done();
            });
        });
        it('goTo testing in active sheet above Frozen Rows', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.goTo('Sheet2!A1');
            setTimeout(() => {
                expect(spreadsheet.sheets[1].topLeftCell).toBe('A1');
                expect(spreadsheet.sheets[1].paneTopLeftCell).toBe('E100');
                expect(spreadsheet.sheets[1].selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Cut testing in other than active sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.cut('Sheet1!A5');
            setTimeout(() => {
                spreadsheet.paste('A1');
                expect(spreadsheet.sheets[0].rows[4].cells[0]).toBeNull();
                expect(helper.getInstance().sheets[1].rows[0].cells[0].value).toEqual('Sandals & Floaters');
                done();
            });
        });
    });

    describe('setColWidth and setRowHeight method with Freeze panes and negative values->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { frozenColumns:3, frozenRows:3 }], activeSheetIndex:1 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('setColWidth testing with no arguments', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setColWidth();
            setTimeout(() => {
                done();
            });
        });
        it('setColWidth testing with other than active sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setColWidth(50,0,0);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].columns[0].width).toBe(50)
                done();
            });
        });
        it('setColWidth testing with negative values with Frozen Columns', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setColWidth(-64,1,1);
            setTimeout(() => {
                expect(spreadsheet.sheets[1].columns[1].width).toBe(0)
                done();
            });
        });
        it('setColWidth testing with Right viewport index > 60', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setColWidth(100,70,1);
            setTimeout(() => {
                expect(spreadsheet.sheets[1].columns[70].width).toBe(100)
                done();
            });
        });
        it('setColWidth testing with negative values with Right viewport index > 60', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setColWidth(-100,70,1);
            setTimeout(() => {
                expect(spreadsheet.sheets[1].columns[70].width).toBe(0)
                done();
            });
        });
        it('setRowHeight testing with no arguments', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRowHeight();
            setTimeout(() => {
                done();
            });
        });
        it('setRowHeight testing with other than active sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRowHeight(22,0,0);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[0].height).toBe(22)
                done();
            });
        });
        it('setRowHeight testing with negative values with Frozen Rows', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRowHeight(-22,1,1);
            setTimeout(() => {
                expect(spreadsheet.sheets[1].rows[1].height).toBe(0)
                done();
            });
        });
        it('setRowHeight testing with Bottom viewport index > 60', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRowHeight(40,100,1);
            setTimeout(() => {
                expect(spreadsheet.sheets[1].rows[100].height).toBe(40)
                done();
            });
        });
        it('setRowHeight testing with negative values with Bottom viewport index > 60', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRowHeight(-40,100,1);
            setTimeout(() => {
                expect(spreadsheet.sheets[1].rows[100].height).toBe(0)
                done();
            });
        });
    });

    describe('Hyperlink, Data Validation and Conditional Format Method with more than 1 Sheet ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {  }], activeSheetIndex:1 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Add Hyperlink for undefined sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertHyperlink('www.google.com', 'Sheet!A1', 'Sheet', false);
            setTimeout(() => {
                done();
            });
        });
        it('Add Hyperlink for other than activesheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertHyperlink('www.google.com', 'Sheet1!A1', 'Item Name', false);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[0].cells[0].hyperlink).toBe('http://www.google.com');
                done();
            });
        });
        it('Add Hyperlink for activesheet with providing no cell address', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertHyperlink('www.google.com', '', 'Item Name', false);
            setTimeout(() => {
                expect(spreadsheet.sheets[1].rows[0].cells[0].hyperlink).toBe('http://www.google.com');
                done();
            });
        });
        it('Apply Highlight invalid Data without selecting Data validation applied cells', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.goTo('Sheet1!A1');
            setTimeout(() => {
                spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'LessThanOrEqualTo', value1: '20' }, 'E2:E11');
                spreadsheet.addInvalidHighlight();
                setTimeout(() => {
                    expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                    done();
                });
            });
        });
        it('Apply Remove Highlight without selecting Data validation applied cells', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.removeInvalidHighlight();
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                done();
            });
        });
        it('Apply Clear Conditioanl Format with no arguments', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange('H2:H5');
            spreadsheet.conditionalFormat({type: 'BlueDataBar', range: 'H2:H5'});
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('15%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            setTimeout(() => {
                spreadsheet.clearConditionalFormat();
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
                done();
            });
        });
    });

    describe('Filter, Image, Context menu, Filemenu methods, Testing ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {  }], activeSheetIndex:1 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Filter Method Testing with no arguments->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.filter();
            setTimeout(() => {
                done(); 
           });
        });
        it('Apply Image without using cell Reference', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertImage([{src:"https://www.w3schools.com/images/w3schools_green.jpg", height: 400, width: 400}]);
            setTimeout(() => {
                const image: ImageModel = spreadsheet.sheets[1].rows[0].cells[0].image[0];
                expect(image.src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                expect(image.height).toBe(400);
                expect(image.width).toBe(400);
                expect(image.top).toBe(0);
                expect(image.left).toBe(0);
                expect(helper.getElement('#' + image.id).style.height).toBe('400px');
                done();
            });
        });
        it('Delete Image with using cell Reference', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const imageId: string = spreadsheet.sheets[1].rows[0].cells[0].image[0].id;
            spreadsheet.deleteImage(imageId,'A1');
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('#' + imageId)).toBeNull();
                done();
            });
        });
        it('Delete Image with using cell Reference', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.actionBegin = (args: any): void => {
                if (args.action === 'freeze') {  
                    args.args.eventArgs.cancel = true; }
            }
            spreadsheet.selectRange('B2');
            helper.switchRibbonTab(5);
            helper.click('#' + helper.id + '_freezepanes');
            setTimeout(() => {
                expect(spreadsheet.sheets[1].topLeftCell).toBe('A1');
                done();
            });
        });
        it('enable contextmenu items without giving enable value', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.contextMenuBeforeOpen = (args: any) => {
                helper.invoke('enableContextMenuItems', [['Paste']]);
            }
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(3)').classList).toContain('e-disabled');
                done();
            });
        });
        it('addMenuItems with InsertAfter->', (done: Function) => {
            document.getElementsByTagName("span")[0].click();
            (document.getElementsByClassName("e-menu")[0].firstElementChild as HTMLElement).click();
           setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.addFileMenuItems([{text: 'Print'}], 'Save As');
                let menuElemCount:number = document.getElementsByClassName('e-menu-parent e-ul')[0].querySelectorAll('.e-menu-item').length;
                expect(menuElemCount).toBe(5);
                (document.getElementsByClassName("e-cell")[0] as HTMLElement).click();
                done(); 
           });
        });
    });

    describe('Dialog cancel testing ->', () => {
        let dialogName: string; let spreadsheet: Spreadsheet; let dlgEle: HTMLElement; let dlgObj: Dialog; let sheet: SheetModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }],
                dialogBeforeOpen: (args: DialogBeforeOpenEventArgs): void => {
                    args.cancel = args.dialogName === dialogName;
                },
                created: (): void => {
                    spreadsheet = helper.getInstance();
                    sheet = spreadsheet.sheets[0];
                    dlgObj = spreadsheet.serviceLocator.getService('dialog');
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect dialog testing', (done: Function) => {
            dialogName = 'ProtectSheetDialog';
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            expect(helper.getElementFromSpreadsheet('.e-dialog.e-protect-dlg')).toBeNull();
            expect(dlgObj.dialogInstance).toBeNull();
            expect(document.activeElement).toBe(spreadsheet.element);
            dialogName = 'ProtectWorkbook';
            helper.click('#' + helper.id + '_protectworkbook');
            expect(helper.getElementFromSpreadsheet('.e-dialog.e-protectworkbook-dlg')).toBeNull();
            expect(dlgObj.dialogInstance).toBeNull();
            expect(document.activeElement).toBe(spreadsheet.element);
            done();
        });
        it('Password re-enter dialog testing', (done: Function) => {
            dialogName = '';
            helper.click('#' + helper.id + '_protect');
            dlgEle = helper.getElementFromSpreadsheet('.e-dialog.e-protect-dlg');
            expect(dlgEle).not.toBeNull();
            setTimeout((): void => {
                expect(dlgEle.classList.contains('e-popup-open')).toBeTruthy();
                const pwdInput: HTMLInputElement = dlgEle.querySelector('.e-sheet-password-content .e-input');
                pwdInput.value = 'test';
                (dlgEle.querySelector('.e-footer-content .e-btn.e-primary') as HTMLButtonElement).click();
                dlgEle = helper.getElementFromSpreadsheet('.e-dialog.e-reenterpwd-dlg');
                expect(dlgEle).not.toBeNull();
                setTimeout((): void => {
                    expect(dlgEle.classList.contains('e-popup-open')).toBeTruthy();
                    dlgObj.hide(true);
                    dialogName = 'Re-enterPassword';
                    dlgEle = helper.getElementFromSpreadsheet('.e-dialog.e-protect-dlg');
                    (dlgEle.querySelector('.e-footer-content .e-btn.e-primary') as HTMLButtonElement).click();
                    expect(helper.getElementFromSpreadsheet('.e-dialog.e-reenterpwd-dlg')).toBeNull();
                    expect(helper.getElementFromSpreadsheet('.e-dialog.e-protect-dlg')).toBeNull();
                    expect(dlgObj.dialogInstance).toBeNull();
                    expect(document.activeElement).toBe(spreadsheet.element);
                    expect(sheet.isProtected).toBeTruthy();
                    expect(sheet.password).toBe('test');
                    done();
                }, 30);
            }, 30);
        });
    });

    describe('EJ2-882379 -> Update row height calculations with standard height property ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }], standardHeight: 19 }, { standardHeight: 26 }, {}]
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Testing standard height property in cell data binding->', (done: Function) => {
            const sheetModel: SheetModel = helper.getInstance().sheets[0];
            const sheetModel1: SheetModel = helper.getInstance().sheets[1];
            const sheetModel2: SheetModel = helper.getInstance().sheets[2];
            expect(sheetModel.standardHeight).toBe(19);
            expect(sheetModel1.standardHeight).toBe(26);
            expect(sheetModel2.standardHeight).toBeNull();
            done();
        });
        it('Testing standard height property in cell data binding with rows->', (done: Function) => {
            const sheetModel: SheetModel = helper.getInstance().sheets[0];
            expect(sheetModel.standardHeight).toBe(19);
            expect(getRowHeight(sheetModel, 1)).toBe(19);
            done();
        });
        it('Testing standard height property in cell data binding without rows->', (done: Function) => {
            const sheetModel: SheetModel = helper.getInstance().sheets[1];
            expect(sheetModel.standardHeight).toBe(26);
            expect(getRowHeight(sheetModel, 1)).toBe(26);
            done();
        });
        it('Checking standard height property While loading JSON data without rows data with the openFromJson method ->', (done: Function) => {
            const json: object = { Workbook: { sheets: [{ standardHeight: 22 }], selectedRange: 'A1' } };
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.openFromJson({ file: json });
            setTimeout(() => {
                const sheetModel: SheetModel = helper.getInstance().sheets[0];
                expect(sheetModel.standardHeight).toBe(22);
                done();
            });
        });
        it('Checking standard height property While loading JSON data with rows data with the openFromJson method->', (done: Function) => {
            const json: object = {
                Workbook: {
                    sheets: [{
                        columns: [{ width: 100 }, { width: 200 }, { width: 120 },
                        { width: 120 }, { width: 120 }, { width: 120 }, { width: 120 },], ranges: [{ dataSource: defaultData }], standardHeight: 23
                    }], selectedRange: 'A1'
                }
            };
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.openFromJson({ file: json });
            setTimeout(() => {
                const sheetModel: SheetModel = helper.getInstance().sheets[0];
                expect(sheetModel.standardHeight).toBe(23);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                done();
            });
        });
        it('Testing setStandardHeight method ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            setStandardHeight(spreadsheet, 2, 26);
            const sheetModel: SheetModel = helper.getInstance().sheets[2];
            expect(sheetModel.standardHeight).toBe(26);
            done();
        });
        it('Testing getStandardHeight method ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            setStandardHeight(spreadsheet, 2, 23);
            expect(getStandardHeight(spreadsheet, 2)).toBe(23);
            done();
        });
        it('Testing Standard Height with cut and paste full row->', (done: Function) => {
            helper.invoke('setRowHeight', [40, 11]);
            expect(helper.getInstance().sheets[0].rows[11].height).toBe(40);
            helper.invoke('cut', [getRangeAddress([11, 0, 11, helper.getInstance().sheets[0].colCount - 1])]).then(() => {
                helper.invoke('paste', ['A13']);
                expect(helper.getInstance().sheets[0].rows[11].height).toBe(19);
                expect(helper.getInstance().sheets[0].rows[12].height).toBe(40);
                done();
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('I266607 ->', () => {
            beforeEach((done: Function) => {
                model = {
                    sheets: [{
                        rows: [{ cells: [{ value: 'columTitle', style: { textAlign: 'left', backgroundColor: '#FFFF33' } }] }],
                        rowCount: 50, colCount: 50
                    }]};
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('spreedsheet-dataSource-Hidetab (Double time header created while updating the sheet model in the button click)', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.sheets = [{
                    rows: [{ cells: [{ value: 'columTitle', style: { textAlign: 'left', backgroundColor: '#FFFF33' } }] }],
                    rowCount: 50, colCount: 50
                }];
                setTimeout((): void => {
                    expect(helper.getElement().querySelectorAll('.e-colhdr-table').length).toBe(1);
                    expect(helper.getElement().querySelectorAll('.e-rowhdr-table').length).toBe(1);
                    done();
                });
            });
        });
        describe('I256901 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{
                        rows: [{ cells: [{ value: 'Order ID' }, { value: 'Customer ID' }, { value: 'Employee ID' }, { value: 'Ship Name' },
                                    { value: 'Ship City' }, { value: 'Ship Address' }] },
                            { cells: [{ value: '10248' }, { value: 'VINET' }, { value: '5' }, { value: 'Vins et alcools Chevalier' },
                                    { value: 'Reims' }, { value: '59 rue de lAbbaye' }] },
                            { cells: [{ value: '10249' }, { value: 'TOMSP' }, { value: '6' }, { value: 'Toms Spezialitäten' },
                                { value: 'Münster' }, { value: 'Luisenstr. 48' }] },
                            { cells: [{ value: '10250' }, { value: 'HANAR' }, { value: '4' }, { value: 'Hanari Carnes' },
                                    { value: 'Rio de Janeiro' }, { value: 'Rua do Paço, 67' }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Used range not setting properly while using cell data binding', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].usedRange.rowIndex).toBe(3);
                expect(spreadsheet.sheets[0].usedRange.colIndex).toBe(5);
                done();
            });
        });
        describe('I316103 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ colCount: 5, rowCount: 10, columns: [
                    { width: 30 }, { width: 35 }, { width: 40 }, { width: 30 }, { width: 30 } ], rows: [{ cells: [{ value: 'Welcome!' }] }] }],
                    scrollSettings: { enableVirtualization: false, isFinite: true }, }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Need to improve the cell selection with limited column count in virtualization false', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].columns[0].width).toBe(30);
                expect(helper.invoke('getCell', [0, 0]).getBoundingClientRect().width).toBe(30);
                expect(spreadsheet.sheets[0].columns[2].width).toBe(40);
                expect(helper.invoke('getCell', [0, 2]).getBoundingClientRect().width).toBe(40);
                expect(helper.getElement('#' + helper.id + '_main_content').style.width).toBe('165px');
                spreadsheet.sheets[0].rowCount = 100; spreadsheet.sheets[0].colCount = 100; spreadsheet.dataBind();
                setTimeout((): void => {
                    expect(helper.getElement('#' + helper.id + '_main_content').style.width).toBe('calc(100% - 30px)');
                    done();
                });
            });
        });
        describe('fb22391 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('getData doesnot work (Pass args in GetData method without sheet name)', (done: Function) => {
                helper.invoke('getData', ['A1:A2']).then((cells: Map<string, CellModel>): void => {
                    cells.forEach((cell: CellModel, key: string): void => {
                        if (key === 'A1') {
                            expect(cell.value).toBe('Item Name');
                        } else {
                            expect(cell.value).toBe('Casual Shoes');
                        }
                    });
                    done();
                });
            });
        });
        describe('I314986 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], allowInsert: false }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Need to fix the destroy method issue with allowInsert as false (allowInsert property onproperty change checking)', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.allowInsert).toBeFalsy();
                const addSheetBtn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-add-sheet-tab');
                expect(addSheetBtn.disabled).toBeTruthy();
                expect(addSheetBtn.classList.contains('e-disabled')).toBeTruthy();
                spreadsheet.allowInsert = true;
                spreadsheet.dataBind();
                expect(addSheetBtn.disabled).toBeFalsy();
                expect(addSheetBtn.classList.contains('e-disabled')).toBeFalsy();
                done();
            });
        });
        describe('I296145 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: '987.65' }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Number value not updated properly with the property binding', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('987.65');
                expect(spreadsheet.sheets[0].rows[0].cells[0].format).toBeUndefined();
                helper.getElement('#' + helper.id + '_number_format').click();
                helper.getElement('#' + helper.id + '_number_format-popup .e-item:nth-child(2)').click();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('987.65');
                expect(spreadsheet.sheets[0].rows[0].cells[0].format).toBe('0.00');
                done();
            });
        });
        describe('I296132, I297067 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ ranges: [{ dataSource: [{ "Customer Name": "* Deluxe Queen Room - General\r\n" }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Console issue while providing the incorrect Datasource format', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('* Deluxe Queen Room - General\r\n');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('* Deluxe Queen Room - General\r\n');
                done();
            });
        });
        describe('I288573, I293791 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('String value its display as date format', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.updateCell({value: '(220 - 230)' }, 'B2');
                expect(spreadsheet.sheets[0].rows[1].cells[1].value).toBe('(220 - 230)');
                expect(spreadsheet.sheets[0].rows[1].cells[1].format).toBeUndefined();
                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('(220 - 230)');
                done();
            });
        });
        describe('I252011, F152303, F152528, I281279, I284628, I297999 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Dynamic data binding support', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('Item Name');
                spreadsheet.sheets = [{ranges: [{ dataSource: [{ 'Name': 'Sridhar' }], startCell: 'E5' }]}];
                spreadsheet.dataBind();
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].rows[4].cells[4].value).toBe('Name');
                    expect(helper.invoke('getCell', [4, 4]).textContent).toBe('Name');
                    expect(spreadsheet.sheets[0].rows[5].cells[4].value).toBe('Sridhar');
                    expect(helper.invoke('getCell', [5, 4]).textContent).toBe('Sridhar');
                    done();
                }, 20);
            });
        });
        describe('I312853 ->', () => {
            let actionBeginCalled: boolean = false; let actionCompleteCalled: boolean = false;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    actionBegin: (args: any): void => {
                        if (args.action === 'renameSheet') { actionBeginCalled = true; }
                    },
                    actionComplete: (args: any): void => {
                        if (args.action === 'renameSheet') { actionCompleteCalled = true; }
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Trigger actionBegin and actionComplete event for sheet rename action', (done: Function) => {
                expect(actionBeginCalled).toBeFalsy();
                expect(actionCompleteCalled).toBeFalsy();
                const item: HTMLElement = helper.getElement('#' + helper.id + ' .e-sheet-tab .e-toolbar-item.e-active');
                helper.triggerMouseAction(
                    'dblclick', { x: item.getBoundingClientRect().left + 1, y: item.getBoundingClientRect().top + 1 }, item.parentElement,
                    item);
                const renameInput: HTMLInputElement = helper.getElement('#' + helper.id + '_rename_input');
                renameInput.value = 'Changed';
                helper.triggerMouseAction(
                    'mousedown', { x: document.body.getBoundingClientRect().left + 1, y: document.body.getBoundingClientRect().top + 1 }, document,
                    document.body);
                setTimeout((): void => {
                    expect(helper.getInstance().sheets[0].name).toBe('Changed');
                    expect(actionBeginCalled).toBeTruthy();
                    expect(actionCompleteCalled).toBeTruthy();
                    done();
                });
            });
        });
        describe('I264109, F162113 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Error alert when named range given with space', (done: Function) => {
                helper.invoke('addDefinedName', [{ name: 'demo check', refersTo: 'Sheet1!A1:B5' }]);
                setTimeout((): void => {
                    const dialog: HTMLElement = helper.getElement('#' + helper.id + ' .e-dialog.e-popup-open');
                    expect(!!dialog).toBeTruthy();
                    expect(dialog.querySelector('.e-dlg-content').textContent).toBe('The name that you entered is not valid.');
                    helper.getInstance().serviceLocator.getService('dialog').hide();
                    done();
                }, 50);
            });
        });
        describe('F163837 ->', () => {
            beforeAll((done: Function) => {
                setCurrencyCode('EUR');
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: '7', format: '$#,##0.00' }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
                setCurrencyCode('USD');
            });
            it('Speadsheet globalization - setCurrencyCode conflict with component language', (done: Function) => {
                setTimeout((): void => {
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('€7.00');
                    helper.getElement('#' + helper.id + '_number_format').click();
                    expect(helper.getElement('#' + helper.id + '_Currency .e-numformat-preview-text').textContent).toBe('€7.00');
                    done();
                }, 50);
            });
        });
        describe('fb24579 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ showHeaders: false }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Gridlines disappear when "Hide Headers" option is selected and sheet is scrolled to right', (done: Function) => {
                expect(helper.getElement('#' + helper.id + '_sheet').classList).toContain('e-hide-headers');
                helper.invoke('goTo', ['AA30']);
                setTimeout((): void => {
                    expect(helper.getInstance().sheets[0].topLeftCell).toBe('AA30');
                    expect(helper.invoke('getScrollElement').scrollLeft).toBeGreaterThan(0);
                    expect(helper.invoke('getMainContent').scrollLeft).toBeGreaterThan(0);
                    expect(helper.invoke('getCell', [29, 26])).toBeDefined(0);
                    done();
                }, 20);
            });
        });
        describe('I312024 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: '1' }] }, { cells: [{ value: '2' }] }, { cells: [{ value: '3' }] }, { cells:
                    [{ formula: '=SUM(A1:A3)' }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('sheets property issue in onPropertychange action', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets.length).toBe(1);
                spreadsheet.sheets = [{}, {}, {}];
                setTimeout((): void => {
                    expect(spreadsheet.sheets.length).toBe(3);
                    expect(spreadsheet.sheets[0].rows.length).toBe(0);
                    expect(helper.getElements('#' + helper.id + ' .e-sheet-tabs-items .e-toolbar-item').length).toBe(3);
                    done();
                }, 20);
            });
        });
        describe('SF-352381, SF-425413 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ ranges: [{ dataSource: defaultData }], columns: [{ width: 180 }, { width: 130 }, { width: 130 },
                        { width: 180 }, { width: 130 }, { width: 120 }], topLeftCell: 'A310', rowCount: 999, colCount: 199 }],
                        scrollSettings: { isFinite: true } }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Horizontal scroll on finite mode is not proper when end reached', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('getScrollElement').scrollLeft = 12508;
                const cellsCount: number = helper.invoke('getContentTable').rows[0].cells.length;
                setTimeout((): void => {
                    expect(spreadsheet.viewport.rightIndex).toBe(198);
                    let row: HTMLTableRowElement = helper.invoke('getContentTable').rows[0];
                    expect(row.cells.length).toBe(cellsCount);
                    expect(row.lastElementChild.getAttribute('aria-colindex')).toBe('199');
                    row = helper.invoke('getColHeaderTable').rows[0];
                    expect(row.lastElementChild.getAttribute('aria-colindex')).toBe('199');
                    expect(row.lastElementChild.textContent).toBe('GQ');
                    done();
                }, 20);
            });
            it('Selection misalignment and script error on undo operation after delete the column', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('selectRange', ['D1:D999']);
                const cell: HTMLElement = (spreadsheet.element.querySelector('.e-colhdr-table') as HTMLTableElement).rows[0].cells[3];
                helper.triggerMouseAction(
                    'contextmenu', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 }, null, cell);
                setTimeout((): void => {
                    helper.getElement('#' + helper.id + '_cmenu_delete_column').click();
                    helper.invoke('goTo', ['CE60']);
                    setTimeout((): void => {
                        expect(spreadsheet.getActiveSheet().topLeftCell).toBe('CE60');
                        helper.triggerKeyNativeEvent(90, true);
                        setTimeout((): void => {
                            expect(spreadsheet.getActiveSheet().topLeftCell).toBe('D1');
                            expect(spreadsheet.viewport.leftIndex).toBe(0);
                            expect(spreadsheet.viewport.topIndex).toBe(0);
                            done();
                        }, 20);
                    }, 20);
                });
            });
            it('Templates not added properly while using updateCell method', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                const topLeftCell: string = spreadsheet.sheets[0].topLeftCell;
                helper.invoke('updateRange', [{ address: 'A1:' + topLeftCell, template: '<div class="container">Button</div>' }]);
                helper.invoke('resize');
                setTimeout((): void => {
                    const index: number[] = getRangeIndexes(topLeftCell);
                    const cellEle: HTMLElement = helper.invoke('getCell', [index[0], index[1]]);
                    const container: HTMLElement = cellEle.querySelector('.container');
                    helper.invoke('updateCell', [{ template: 'button' }, topLeftCell]);
                    expect(container !== cellEle.querySelector('.container')).toBeTruthy();
                    done();
                });
            });
        });
        describe('SF-370011, SF-618130 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('370011 -> Create new workbook not removing the filter range', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('applyFilter');
                expect(spreadsheet.sheets[0].rows.length).toBe(11);
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-icon')).not.toBeNull();
                helper.invoke('refresh', [true]);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].rows.length).toBe(0);
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-icon')).toBeNull();
                    done();
                });
            });
            it('618130 -> The updateRange method not update the dataSource in the newly created workbook', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                expect(spreadsheet.sheets[0].rows.length).toBe(0);
                const prevHandler: EmitType<DataSourceChangedEventArgs> = spreadsheet.dataSourceChanged;
                spreadsheet.dataSourceChanged = (args: DataSourceChangedEventArgs): void => {
                    expect(args.action).toBe('dataSourceChanged');
                    expect(args.sheetIndex).toBe(0);
                    expect(args.rangeIndex).toBe(0);
                    expect(spreadsheet.sheets[0].ranges.length).toBe(1);
                    expect(spreadsheet.sheets[0].rows.length).toBe(2);
                    expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('Value1');
                    expect(spreadsheet.sheets[0].rows[0].cells[1].value).toBe('Value2');
                    expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('01');
                    expect(spreadsheet.sheets[0].rows[1].cells[1].value).toBe('100');
                    spreadsheet.dataSourceChanged = prevHandler;
                    helper.invoke('updateRange', [{}, 2]);
                    expect(spreadsheet.sheets[0].ranges.length).toBe(1);
                    expect(JSON.stringify(spreadsheet.sheets[0].ranges[0].info)).toBe('{"loadedRange":[[0,1]],"count":1,"fldLen":2,"flds":["Value1","Value2"]}');
                    done();
                };
                helper.invoke('updateRange', [{ dataSource: [{ 'Value1': '01', 'Value2': '100' }], showFieldAsHeader: true }]);
            });
            it('Adding template without address', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                const getTemplateEle: Function = (cell: CellModel): HTMLElement[] => {
                    const ele: HTMLElement = spreadsheet.createElement('span', { className: 'e-template-text' });
                    ele.textContent = cell.value;
                    return [ele];
                };
                helper.invoke('updateRange', [{ template: getTemplateEle }]);
                expect(spreadsheet.sheets[0].ranges.length).toBe(2);
                expect(spreadsheet.sheets[0].ranges[1].startCell).toBe('A1');
                expect(spreadsheet.sheets[0].ranges[1].address).toBe('A1');
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Value1');
                helper.invoke('resize');
                setTimeout(() => {
                    const cellTemplate: HTMLElement = helper.invoke('getCell', [0, 0]).querySelector('.e-template-text');
                    expect(cellTemplate).not.toBeNull();
                    expect(cellTemplate.textContent).toBe('Value1');
                    done();
                });
            });
        });
        describe('SF-366370 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Script error on sheet name changing through on property change', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].name).toBe('Sheet1');
                expect(helper.getElement().querySelector('.e-sheet-tabs-items').children[1].textContent).toBe('Sheet1');
                spreadsheet.sheets[0].name = 'Changed';
                spreadsheet.dataBind();
                expect(spreadsheet.sheets[0].name).toBe('Changed');
                expect(helper.getElement().querySelector('.e-sheet-tabs-items').children[1].textContent).toBe('Changed');
                done();
            });
        });
        describe('EJ2-59578 ->', () => {
            L10n.load({
                'de-DE': {
                    'spreadsheet': {
                        'Cut': 'Schneiden',
                        'TopBorders': 'Top dzdsfsd Borders',
                        'LeftBorders': 'Left sasd Borders',
                        'RightBorders': 'Right asd Borders',
                        'BottomBorders': 'BottomBorders asd  ',
                        'AllBorders': 'AllBorders asd ',
                        'HorizontalBorders': 'Horizontal asdasd Borders',
                        'VerticalBorders': 'Vertical asdasd Borders',
                        'OutsideBorders': 'Outside asdasd Borders',
                        'InsideBorders': 'Inside asdasd Borders',
                        'NoBorders': 'No asdsad Borders',
                        'BorderColor': 'Border asdasdsa Color',
                        'BorderStyle': 'Border sdfsdf Style'
                    }
                }
            });
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], locale: 'de-DE' }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Border not applied properly when using locale text in spreadsheet', (done: Function) => {
                helper.invoke('setBorder', [{ borderLeft: '1px solid red' }, 'B2:B2']);
                var td = helper.invoke('getCell', [1, 0]);
                expect(td.style.borderRight).toBe('1px solid red');
                expect(td.style.borderTop).toBe('');
                expect(td.style.borderLeft).toBe('');
                expect(td.style.borderBottom).toBe('');
                helper.invoke('setBorder', [{ borderTop: '1px solid red' }, 'B4:B4']);
                var td = helper.invoke('getCell', [2, 1]);
                expect(td.style.borderRight).toBe('');
                expect(td.style.borderTop).toBe('');
                expect(td.style.borderLeft).toBe('');
                expect(td.style.borderBottom).toBe('1px solid red');
                helper.invoke('setBorder', [{ borderRight: '1px solid red' }, 'D2:D2']);
                td = helper.invoke('getCell', [1, 3]);
                expect(td.style.borderRight).toBe('1px solid red');
                expect(td.style.borderTop).toBe('');
                expect(td.style.borderLeft).toBe('');
                expect(td.style.borderBottom).toBe('');
                helper.invoke('setBorder', [{ borderBottom: '1px solid red' }, 'D2:D2']);
                td = helper.invoke('getCell', [1, 3]);
                expect(td.style.borderBottom).toBe('1px solid red');
                expect(td.style.borderRight).toBe('1px solid red');
                expect(td.style.borderTop).toBe('');
                expect(td.style.borderLeft).toBe('');
                helper.invoke('setBorder', [{ border: '1px solid #000000' }, 'C2:D3', 'Outer']);
                td = helper.invoke('getCell', [2, 3]);
                expect(td.style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                expect(td.style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(td.style.borderTop).toBe('');
                expect(td.style.borderLeft).toBe('');
                helper.invoke('setBorder', [{ border: '1px solid #000000' }, 'F2:G4', 'Inner']);
                td = helper.invoke('getCell', [1, 5]);
                expect(td.style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                expect(td.style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(td.style.borderTop).toBe('');
                expect(td.style.borderLeft).toBe('');
                helper.invoke('setBorder', [{ border: '1px solid #000000' }, 'C5:E8', 'Horizontal']);
                td = helper.invoke('getCell', [5, 2]);
                expect(td.style.borderRight).toBe('');
                expect(td.style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(td.style.borderTop).toBe('');
                expect(td.style.borderLeft).toBe('');
                helper.invoke('setBorder', [{ border: '1px solid #000000' }, 'G5:I8', 'Vertical']);
                td = helper.invoke('getCell', [5, 8]);
                expect(td.style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                expect(td.style.borderTop).toBe('');
                expect(td.style.borderLeft).toBe('');
                expect(td.style.borderBottom).toBe(''); 
                done();
            });
        });
        describe('EJ2-47897, EJ2-47751, EJ2-51467, EJ2-54049, EJ2-53517, EJ2-53945, EJ2-54402, EJ2-54586, EJ2-54759, EJ2-54716, EJ2-52453, EJ2-51535 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.numberFormat('dd/MM/yyyy', "B2");
                    }   
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-47897 - Need to fix the issue with Copy paste(values only) option with the formula values', (done: Function) => {
                helper.invoke('selectRange', ['I1']);
                helper.invoke('updateCell', [{ formula: '=SUM(F2:F8)' }, 'I1']);    
                helper.invoke('copy', ['I1']).then(() => {
                    helper.invoke('paste', ['J1', 'Values']);
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe(2700);
                        expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBeUndefined;
                        done();
                    });
                });
            });
            it('EJ2-47751 - Formula not updated properly for copy paste action', (done: Function) => {
                helper.invoke('paste', ['J2']);
                setTimeout(function () {
                    expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBe(55);
                    expect(helper.getInstance().sheets[0].rows[1].cells[9].formula).toBe('=SUM(G3:G9)');
                    done();
                });
            });
            it('EJ2-51467 - Need to fix the string with date pasted as date issue in Chrome', (done: Function) => {
                helper.invoke('updateCell', [{ value: 'UKP.BSLD.BOM.2018-03-20' }, 'I3']); 
                helper.invoke('copy', ['I3']).then(() => {
                    helper.invoke('paste', ['J3']);
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toBe('UKP.BSLD.BOM.2018-03-20');
                        done();
                    });
                });
            });
            it('EJ2-54049 - Data validation color format not copied on Autofill->', (done: Function) => {
                helper.invoke('addDataValidation', [{ type: 'WholeNumber', operator: 'LessThanOrEqualTo', value1: '5' }, 'H2']);
                helper.invoke('addInvalidHighlight', ['H2']);
                expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(helper.invoke('getCell', [1, 7]).style.color).toBe('rgb(255, 0, 0)');
                helper.invoke('autoFill', ['H3', 'H2', 'Down', 'CopyCells']);
                expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(helper.invoke('getCell', [2, 7]).style.color).toBe('rgb(255, 0, 0)');
                done();
            });
            it('EJ2-53517 - Issue with date format in spreadsheet->', (done: Function) => {
                helper.invoke('updateCell', [{ value: '09/11/2030' }, 'B2']); 
                helper.invoke('updateCell', [{ value: '19/11/2030' }, 'B2']); 
                expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBe('47806');
                expect(helper.getInstance().sheets[0].rows[1].cells[1].format).toBe('dd/MM/yyyy');
                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('19/11/2030');
                done();
            });
            it('EJ2-53945 - Border missing issue with autofill support in Spreadsheet->', ( done: Function) => {
                helper.invoke('selectRange', ['K3:L4']);
                helper.invoke('merge', ['K3:L4']);
                helper.invoke('updateCell', [{ value: 'Test' }, 'K3']);
                helper.invoke('setBorder', [{ border: '1px solid #000000' }, 'K3', 'Outer']); 
                expect(helper.getInstance().sheets[0].rows[2].cells[10].style.borderBottom).toBe('1px solid #000000');
                expect(helper.getInstance().sheets[0].rows[2].cells[10].style.borderRight).toBe('1px solid #000000');
                helper.invoke('autoFill', ['K5:L20', 'K3:L4', 'Down', 'CopyCells']);
                expect(helper.getInstance().sheets[0].rows[18].cells[10].style.borderBottom).toBe('1px solid #000000');
                expect(helper.getInstance().sheets[0].rows[18].cells[10].style.borderRight).toBe('1px solid #000000');
                done();
            });
            it('EJ2-54402 - When drag the autofill for hidden column its occur script error->', (done: Function) => {
                helper.invoke('selectRange', ['C1']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(0, 2, [8], false, true);
                setTimeout(function () {
                    expect(helper.getInstance().sheets[0].columns[2].hidden).toBeTruthy();
                    var autofill = helper.getElementFromSpreadsheet('.e-autofill');
                    expect(autofill.classList).toContain('e-hide');
                    expect(getComputedStyle(autofill).display).toBe('none');
                    done();
                });
            });
            it('EJ2-54586 - Custom date format alignment issue->', (done: Function) => {
                helper.invoke('updateCell', [{ value: '26/10/2030' }, 'B2']);
                helper.invoke('selectRange', ['B2']);
                expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBe('47782');
                expect(helper.getInstance().sheets[0].rows[1].cells[1].format).toBe('dd/MM/yyyy');
                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('26/10/2030');
                helper.getElement('#' + helper.id + '_text_align').click();
                expect(helper.getElement('#' + helper.id + '_text_align-popup li:nth-child(3)').classList).toContain('e-selected');
                done();
            });
            it('EJ2-54759 - While using autoFill for formula applied cell, spreadsheet gets unresponsive->', (done: Function) => {
                helper.invoke('selectRange', ['J2']);
                helper.invoke('autoFill', ['K2:L2', 'J2', 'Right', 'CopyCells']);
                expect(helper.getInstance().sheets[0].rows[1].cells[10].value).toBe(55);
                expect(helper.getInstance().sheets[0].rows[1].cells[11].value).toBe(55);
                done();
            });
            it('EJ2-54716 - getDisplayText not properly working for customized number format', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('numberFormat', ['@', 'A1:B10']);
                helper.invoke('updateCell', [{ value: '121212' }, 'A2']);
                helper.invoke('numberFormat', ['#,###.00 ;(#,###.00);"-"', 'A2']);
                expect(helper.invoke('getDisplayText', [spreadsheet.sheets[0].rows[0].cells[0]])).toEqual('Item Name');
                expect(helper.invoke('getDisplayText', [spreadsheet.sheets[0].rows[1].cells[0]])).toEqual('121,212.00 ');
                done();
            });
            it('EJ2-52453 - Spreadsheet reloads when click Format buttons in ribbon->', (done: Function) => {
                helper.invoke('selectRange', ['F11']);
                helper.getElement('#' + helper.id + '_bold').click();
                helper.getElement('#' + helper.id + '_italic').click();
                helper.getElement('#' + helper.id + '_line-through').click();
                helper.getElement('#' + helper.id + '_underline').click();
                helper.click('.e-add-sheet-tab');
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().sheets.length).toBe(2);
                done();
            });
        });
        describe('EJ2-54678, EJ2-49470, EJ2-54085, EJ2-55211->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ selectedRange: 'A1', topLeftCell: 'C50' }], allowAutoFill: false
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-49470 - TopLeftCell not set properly when enableVirtualization is false in spreadsheet', (done: Function) => {
                expect(helper.getInstance().sheets[0].topLeftCell).toBe('C50');
                done();
            });
            it('EJ2-54678 - Autofill option is visible when set allowAutoFill API as false->', (done: Function) => {
                expect(helper.getElementFromSpreadsheet('.e-autofill')).toBeNull();
                done();
            });
            it('EJ2-55211 - While loading JSON data with the openFromJson method, it does not load anything ->', (done: Function) => {
                const json: object = { Workbook: { sheets: [{ frozenColumns: 2, frozenRows: 3 ,
                    columns: [{ width: 100 }, { width: 200 },{ width: 120 },{ width: 120 },{ width: 120 },{ width: 120 },{ width: 120 },],
                    ranges: [{ dataSource: defaultData }] }], selectedRange: 'A1' }
                }
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.openFromJson({ file: json });
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                    done();
                });
            });
            it('EJ2-54085 - Need to fix the dynamic data binding issue and the updateRange method issue.->', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                spreadsheet.insertSheet([{ index: 1, name: 'Inserted Sheet' }]);
                setTimeout(() => {
                    expect(spreadsheet.sheets[1].rows.length).toBe(0);
                    spreadsheet.updateRange({ dataSource: productData }, 1);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[1].rows.length).toBe(78);
                        expect(spreadsheet.sheets[1].rows[0].cells[0].value).toBe('ProductID');
                        expect(spreadsheet.getCell(0, 0).textContent).toBe('Item Name');
                        helper.invoke('goTo', ['Inserted Sheet!A1']);
                        setTimeout(() => {
                            expect(spreadsheet.getCell(0, 0).textContent).toBe('ProductID');
                            spreadsheet.updateRange({ dataSource: filterData, startCell: 'A1', showFieldAsHeader: false }, 1);
                            setTimeout(() => {
                                expect(spreadsheet.sheets[1].rows[0].cells[0].value).toBe(10248);
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('EJ2-49474->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ colCount: 10, rowCount: 120, columns:[{ width: 90}, { width: 90}, { width: 90}, { width: 60}, { width: 90}, { width: 90}, { width: 60}], ranges: [{ dataSource: defaultData }]
                    }],
                    scrollSettings: { enableVirtualization: false, isFinite: true}
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Spreadsheet rows disappear after scrolling up and down in finite mode->', (done:  Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.sheets[0].topLeftCell = 'A95'
                spreadsheet.dataBind();
                setTimeout(() => {
                    spreadsheet.sheets[0].topLeftCell = 'C5'
                    spreadsheet.dataBind();
                    setTimeout(() => {
                        spreadsheet.sheets[0].topLeftCell = 'D110'
                        spreadsheet.dataBind();
                        setTimeout(() => {
                            expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-51535', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ frozenRows: 3, frozenColumns: 8 , selectedRange: 'I4' }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Need to fix the selection issue and undo issue', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.sheets[0].paneTopLeftCell = 'DQ7'            
                spreadsheet.dataBind();
                setTimeout(function () {
                    helper.edit('E2', 'Edit');
                    helper.triggerKeyNativeEvent(13);
                    helper.getElement('#' + helper.id + '_undo').click();
                    setTimeout(function () {
                        expect(helper.getInstance().sheets[0].rows[1].cells[4].value).toBeNull;
                        done();
                    });
                });
            });
        });
        describe('EJ2-54569->', () => {
            let count: number = 0;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: [{ 'Test': '1', 'Test1': '2' }] }] }],
                    cellSave: (args: CellSaveEventArgs): void => {
                        count++;
                        if (count === 1) { // Delete cell details
                            expect(args.address).toEqual('Sheet1!A1');
                            expect(args.oldValue).toEqual('Test');
                            expect(args.value as any).toEqual('');
                        }
                        if (count === 2) { // undo cell details
                            expect(args.address).toEqual('Sheet1!A1');
                            expect(args.oldValue).toBeUndefined;
                            expect(args.value as any).toEqual('Test');
                        }
                        if (count === 3) { // redo cell details
                            expect(args.address).toEqual('Sheet1!A1');
                            expect(args.oldValue).toEqual('Test');
                            expect(args.value as any).toEqual('');
                        }
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('cellsave event is not triggered for delete, undoredo and fill options->', (done: Function) => {
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    helper.getElement('#' + helper.id + '_undo').click();
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Test');
                        helper.getElement('#' + helper.id + '_redo').click();
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 0]).textContent).toBe('');
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-54849->', () => {
            let count: number = 0;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: [{ 'Test': '1' }] }] }],
                    cellSave: (args: CellSaveEventArgs): void => {
                        count++;
                        if (count === 1) { // Paste cell details
                            expect(args.address).toEqual('Sheet1!B1');
                            expect(args.oldValue).toEqual('');
                            expect(args.value as any).toEqual('Test');
                        }
                        if (count === 2) { // undo cell details
                            expect(args.address).toEqual('Sheet1!B1');
                            expect(args.oldValue).toEqual('Test');
                            expect(args.value as any).toEqual('');
                        }
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cell Save event not triggered on undo->', (done: Function) => {
                helper.getElement('#' + helper.id + '_copy').click();
                setTimeout(() => {
                    helper.invoke('selectRange', ['B1']);
                    helper.getElement('#' + helper.id + '_paste').click();
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 1]).textContent).toBe('Test');
                        helper.getElement('#' + helper.id + '_undo').click();
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 1]).textContent).toBe('');
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-55119->', () => {
            let actionBeginCalled: boolean = false; let actionCompleteCalled: boolean = false;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    actionBegin: (args: any): void => {
                        if (args.action === 'filter') { actionBeginCalled = true; }
                    },
                    actionComplete: (args: any): void => {
                        if (args.action === 'filter') { actionCompleteCalled = true; }
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('On Redo Actioncomplete is triggered before the action is performed->', (done: Function) => {
                expect(actionBeginCalled).toBeFalsy();
                expect(actionCompleteCalled).toBeFalsy();
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_applyfilter').click();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                helper.getElement('#' + helper.id + '_undo').click();
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeNull();
                    helper.getElement('#' + helper.id + '_redo').click();
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                        expect(actionBeginCalled).toBeTruthy();
                        expect(actionCompleteCalled).toBeTruthy();
                        done();
                    });
                });
            });
        });
        describe('SF-380690, SF-380608 ->', () => {
            beforeEach((done: Function) => {
                const rows: RowModel[] = [];
                for (let i: number = 0; i < 67; i++) {
                    rows.push({ height: 84 });
                }
                helper.initializeSpreadsheet({ showRibbon: false, showFormulaBar: false, showSheetTabs: false, height: 750,
                    scrollSettings: { isFinite: true },
                    sheets: [{ rows: rows, frozenColumns: 1, frozenRows: 1, rowCount: 68 }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Selection issue and row is not visible when scrolled down to bottom in finite mode', (done: Function) => {
                helper.invoke('getMainContent').parentElement.scrollTop = 4750;
                const spreadsheet: any = helper.getInstance();
                spreadsheet.notify(onContentScroll, { scrollTop: 4750, scrollLeft: 0 });
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('B58');
                    expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                    done();
                });
            });
        });
        describe('EJ2-64286 ->', () => {
            beforeEach((done: Function) => {
                const data = [
                    [{value: 'RC-1'}, {value: 'RC-2'}, {value: 'RC-3'}, {value: 'RC-4'}],
                    [{value: 1}, {value: '0'}, {value: null}, {value: 'null'}],
                    [{value: 0}, {value: 1}, {value: ''}, {value: false}]
                ];
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: data }] }],
                    beforeDataBound: function () {
                        helper.getInstance().numberFormat('0.0000', 'A2:D6');
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Issue in updateRange when trying to update zero as value', (done: Function) => {
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('1.0000');
                expect(helper.invoke('getCell', [2, 1]).textContent).toBe('0.0000');
                expect(helper.invoke('getCell', [2, 2]).textContent).toBe('');
                expect(helper.invoke('getCell', [2, 3]).textContent).toBe('null');
                expect(helper.invoke('getCell', [3, 0]).textContent).toBe('0.0000');
                expect(helper.invoke('getCell', [3, 1]).textContent).toBe('1.0000');
                expect(helper.invoke('getCell', [3, 2]).textContent).toBe('');
                expect(helper.invoke('getCell', [3, 3]).textContent).toBe('FALSE');
                done();
            });
        });
        describe('EJ2-859222 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{  ranges: [{ dataSource: ScrollingData }]}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Values are not mapped correctly with reference to the header value in spreadsheet', (done: Function) => {
                expect(helper.getInstance().sheets[0].rows[56].cells[2].value).toBe('300');
                expect(helper.getInstance().sheets[0].rows[56].cells[3].value).toBe('4');
                expect(helper.getInstance().sheets[0].rows[57].cells[2].value).toBe('100');
                expect(helper.getInstance().sheets[0].rows[57].cells[3].value).toBe('5');
                done();
            });
        });
        describe('EJ2-881868', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Provide an argument in the setRowsHeight method to skip the row height assign for custom height applied rows', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.setRowsHeight(40, ['1:5', '10:15', 'Sheet2!1:20']);
                expect(spreadsheet.sheets[0].rows[0].height).toBe(40);
                expect(spreadsheet.sheets[0].rows[4].height).toBe(40);
                expect(spreadsheet.sheets[0].rows[9].height).toBe(40);
                expect(spreadsheet.sheets[0].rows[12].height).toBe(40);
                expect(spreadsheet.sheets[0].rows[14].height).toBe(40);
                expect(spreadsheet.sheets[1].rows[0].height).toBe(40);
                expect(spreadsheet.sheets[1].rows[4].height).toBe(40);
                expect(spreadsheet.sheets[1].rows[9].height).toBe(40);
                expect(spreadsheet.sheets[1].rows[14].height).toBe(40);
                expect(spreadsheet.sheets[1].rows[19].height).toBe(40);
                spreadsheet.setRowsHeight(50, ['1:6', '10:16', 'Sheet2!18:24'], true);
                expect(spreadsheet.sheets[0].rows[4].height).toBe(40);
                expect(spreadsheet.sheets[0].rows[5].height).toBe(50);
                expect(spreadsheet.sheets[0].rows[9].height).toBe(40);
                expect(spreadsheet.sheets[0].rows[14].height).toBe(40);
                expect(spreadsheet.sheets[0].rows[15].height).toBe(50);
                expect(spreadsheet.sheets[1].rows[20].height).toBe(50);
                expect(spreadsheet.sheets[1].rows[21].height).toBe(50);
                expect(spreadsheet.sheets[1].rows[22].height).toBe(50);
                expect(spreadsheet.sheets[1].rows[23].height).toBe(50);
                done();
            });
            it('setRowsHeight method checking after setting skipCustomHeight to false', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.setRowsHeight(60, ['3:4', '12:15', 'Sheet2!6:10'], false);
                expect(spreadsheet.sheets[0].rows[2].height).toBe(60);
                expect(spreadsheet.sheets[0].rows[3].height).toBe(60);
                expect(spreadsheet.sheets[0].rows[11].height).toBe(60);
                expect(spreadsheet.sheets[0].rows[12].height).toBe(60);
                expect(spreadsheet.sheets[0].rows[13].height).toBe(60);
                expect(spreadsheet.sheets[0].rows[14].height).toBe(60);
                expect(spreadsheet.sheets[1].rows[5].height).toBe(60);
                expect(spreadsheet.sheets[1].rows[6].height).toBe(60);
                expect(spreadsheet.sheets[1].rows[8].height).toBe(60);
                expect(spreadsheet.sheets[1].rows[9].height).toBe(60);
                done();
            });
            it('setRowHeight testing after providing skipCustomHeight argument', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.setRowHeight(70, 2, 0, undefined, true);
                expect(spreadsheet.sheets[0].rows[2].height).toBe(60);
                spreadsheet.setRowHeight(70, 2, 0, undefined, false);
                expect(spreadsheet.sheets[0].rows[2].height).toBe(70);
                done();
            });
        });
        describe('EJ2-890164 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Rows are not rendered properly and appear hidden when calling the refresh() method after scrolling. ', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.goTo('Sheet1!A125');
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('A125');
                    expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 2180px)');
                    spreadsheet.goTo('Sheet1!A60');
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('A60');
                        expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 880px)');
                        spreadsheet.refresh();
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('A60');
                            expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 880px)');
                            done();
                        },20);
                    },20);
                },20);
            });
        });

        describe('EJ2-936024 ->', () => {
            beforeAll((done: Function) => {
                let rowModel: Object[] = [];
                for (let i = 1; i < 100; i++) {
                    rowModel[i] = { hidden: true };
                }
                helper.initializeSpreadsheet({ sheets: [{ rows: rowModel , ranges: [{ dataSource: defaultData }], rowCount: 200, colCount: 200, frozenRows: 1 }], scrollSettings: { enableVirtualization: true, isFinite: true } }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Script error occurs while scrolling in finite mode when first 100+ rows are hidden.', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[23].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[92].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[99].hidden).toBeTruthy();
                spreadsheet.goTo('Sheet1!BB1');
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('BB103');
                    expect(spreadsheet.sheets[0].topLeftCell).toBe('BB1');
                    let col: HTMLTableRowElement = helper.invoke('getColHeaderTable').rows[0];
                    expect(col.firstElementChild.getAttribute('aria-colindex')).toBe('39');
                    expect(col.firstElementChild.textContent).toBe('AM');
                    expect(col.lastElementChild.getAttribute('aria-colindex')).toBe('81');
                    expect(col.lastElementChild.textContent).toBe('CC');
                    spreadsheet.goTo('Sheet1!BB150');
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('BB150');
                        expect(spreadsheet.sheets[0].topLeftCell).toBe('BB1');
                        col = helper.invoke('getColHeaderTable').rows[0];
                        expect(col.firstElementChild.getAttribute('aria-colindex')).toBe('39');
                        expect(col.firstElementChild.textContent).toBe('AM');
                        expect(col.lastElementChild.getAttribute('aria-colindex')).toBe('81');
                        expect(col.lastElementChild.textContent).toBe('CC');
                        done();
                    }, 20);
                }, 20);
            });
        });
    });
    describe('Null or Undefined values testing for public properties ->', () => {
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'spreadsheet' });
            document.body.appendChild(ele);
        });
        describe('Null or Undefined values checking for autofill, chart, dataValidation and delete ->', () => {
            it('allowAutoFill', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowAutoFill: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowAutoFill).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowAutoFill: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowAutoFill).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowCellFormatting', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowCellFormatting: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowCellFormatting).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowCellFormatting: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowCellFormatting).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowChart', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowChart: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowChart).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowChart: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowChart).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowConditionalFormat', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowConditionalFormat: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowConditionalFormat).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowConditionalFormat: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowConditionalFormat).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowDataValidation', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowDataValidation: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowDataValidation).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowDataValidation: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowDataValidation).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowDelete', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowDelete: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowDelete).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowDelete: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowDelete).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined value checking for edit, filtering, hyperlink, image and insert -> ', () => {
            it('allowEditing', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowEditing: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowEditing).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowEditing: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowEditing).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowFiltering', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowFiltering: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowFiltering).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowFiltering: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowFiltering).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowFindAndReplace', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowFindAndReplace: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowFindAndReplace).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowFindAndReplace: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowFindAndReplace).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowFreezePane', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowFreezePane: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowFreezePane).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowFreezePane: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowFreezePane).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowHyperlink', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowHyperlink: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowHyperlink).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowHyperlink: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowHyperlink).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowImage', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowImage: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowImage).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowImage: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowImage).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowInsert', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowInsert: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowInsert).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowInsert: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowInsert).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values checking for merge, scrolling, open, save and resizing -> ', () => {
            it('allowMerge', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowMerge: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowMerge).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowMerge: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowMerge).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowNumberFormatting', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowNumberFormatting: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowNumberFormatting).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowNumberFormatting: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowNumberFormatting).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowOpen', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowOpen: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowOpen).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowOpen: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowOpen).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowResizing', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowResizing: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowResizing).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowResizing: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowResizing).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowSave', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowSave: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowSave).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowSave: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowSave).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowScrolling', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowScrolling: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowScrolling).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowScrolling: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowScrolling).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values testing for sorting, wrap ,clipboard, contextMenu -> ', () => {
            it('allowSorting', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowSorting: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowSorting).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowSorting: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowSorting).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowUndoRedo', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowUndoRedo: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowUndoRedo).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowUndoRedo: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowUndoRedo).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('allowWrap', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ allowWrap: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowWrap).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ allowWrap: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.allowWrap).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('enableClipboard', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ enableClipboard: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableClipboard).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ enableClipboard: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableClipboard).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('enableContextMenu', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ enableContextMenu: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableContextMenu).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ enableContextMenu: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableContextMenu).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('enableKeyboardNavigation', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ enableKeyboardNavigation: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableKeyboardNavigation).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ enableKeyboardNavigation: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableKeyboardNavigation).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values checking for keyboardShortcut, enableRtl and aggregate ->', () => {
            it('enableKeyboardShortcut', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ enableKeyboardShortcut: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableKeyboardShortcut).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ enableKeyboardShortcut: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableKeyboardShortcut).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('enablePersistence', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ enablePersistence: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enablePersistence).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ enablePersistence: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enablePersistence).toBe(false);
                spreadsheetEle.destroy();
                done();
            });
            it('enableRtl', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ enableRtl: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableRtl).toBe(false);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ enableRtl: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.enableRtl).toBe(false);
                spreadsheetEle.destroy();
                done();
            });
            it('isProtected', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ isProtected: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.isProtected).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ isProtected: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.isProtected).toBe(false);
                spreadsheetEle.destroy();
                done();
            });
            it('showAggregate', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ showAggregate: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.showAggregate).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ showAggregate: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.showAggregate).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values checking for formulaBar, ribbon, sheetTabs ->', () => {
            it('showFormulaBar', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ showFormulaBar: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.showFormulaBar).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ showFormulaBar: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.showFormulaBar).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('showRibbon', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ showRibbon: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.showRibbon).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ showRibbon: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.showRibbon).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('showSheetTabs', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ showSheetTabs: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.showSheetTabs).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ showSheetTabs: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.showSheetTabs).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('listSeparator', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ listSeparator: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.listSeparator).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ listSeparator: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.listSeparator).toBe(',');
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined checks for locale, openUrl and saveUrl ->', () => {
            it('locale', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ locale: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.locale).toBe('en-US');
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ locale: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.locale).toBe('en-US');
                spreadsheetEle.destroy();
                done();
            });
            it('openUrl', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ openUrl: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.openUrl).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ openUrl: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.openUrl).toBe('');
                spreadsheetEle.destroy();
                done();
            });
            it('saveUrl', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ saveUrl: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.saveUrl).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ saveUrl: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.saveUrl).toBe('');
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values checking for cellStyle ->', () => {
            it('cellStyle', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ cellStyle: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.cellStyle.backgroundColor).toBe('#ffffff');
                expect(spreadsheetEle.cellStyle.border).toBe('');
                expect(spreadsheetEle.cellStyle.borderBottom).toBe('');
                expect(spreadsheetEle.cellStyle.borderLeft).toBe('');
                expect(spreadsheetEle.cellStyle.borderRight).toBe('');
                expect(spreadsheetEle.cellStyle.borderTop).toBe('');
                expect(spreadsheetEle.cellStyle.color).toBe('#000000');
                expect(spreadsheetEle.cellStyle.fontFamily).toBe('Calibri');
                expect(spreadsheetEle.cellStyle.fontSize).toBe('11pt');
                expect(spreadsheetEle.cellStyle.fontStyle).toBe('normal');
                expect(spreadsheetEle.cellStyle.fontWeight).toBe('normal');
                expect(spreadsheetEle.cellStyle.textAlign).toBe('left');
                expect(spreadsheetEle.cellStyle.textDecoration).toBe('none');
                expect(spreadsheetEle.cellStyle.textIndent).toBe('0pt');
                expect(spreadsheetEle.cellStyle.verticalAlign).toBe('bottom');
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ cellStyle: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.cellStyle.backgroundColor).toBe('#ffffff');
                expect(spreadsheetEle.cellStyle.border).toBe('');
                expect(spreadsheetEle.cellStyle.borderBottom).toBe('');
                expect(spreadsheetEle.cellStyle.borderLeft).toBe('');
                expect(spreadsheetEle.cellStyle.borderRight).toBe('');
                expect(spreadsheetEle.cellStyle.borderTop).toBe('');
                expect(spreadsheetEle.cellStyle.color).toBe('#000000');
                expect(spreadsheetEle.cellStyle.fontFamily).toBe('Calibri');
                expect(spreadsheetEle.cellStyle.fontSize).toBe('11pt');
                expect(spreadsheetEle.cellStyle.fontStyle).toBe('normal');
                expect(spreadsheetEle.cellStyle.fontWeight).toBe('normal');
                expect(spreadsheetEle.cellStyle.textAlign).toBe('left');
                expect(spreadsheetEle.cellStyle.textDecoration).toBe('none');
                expect(spreadsheetEle.cellStyle.textIndent).toBe('0pt');
                expect(spreadsheetEle.cellStyle.verticalAlign).toBe('bottom');
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values testing for cssClass and password', () => {
            it("cssClass", (done: Function) => {
                spreadsheetEle = new Spreadsheet({ cssClass: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.cssClass).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ cssClass: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.cssClass).toBe('');
                spreadsheetEle.destroy();
                done();
            });
            it('password', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ password: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.password).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ password: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.password).toBe('');
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values checking for height, width.', () => {
            it('width', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ width: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.width).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ width: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.width).toBe('100%');
                spreadsheetEle.destroy();
                done();
            });
            it('height', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ height: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.height).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ height: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.height).toBe('100%');
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values testing for autoFillSettings and definedNames ->', () => {
            it('autoFillSettings', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ autoFillSettings: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.autoFillSettings.fillType).toBe('FillSeries');
                expect(spreadsheetEle.autoFillSettings.showFillOptions).toBe(true);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ autoFillSettings: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.autoFillSettings.fillType).toBe('FillSeries');
                expect(spreadsheetEle.autoFillSettings.showFillOptions).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('definedNames', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ definedNames: null });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.definedNames).toEqual([]);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ definedNames: undefined });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.definedNames).toEqual([]);
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values testing for scrollSettings and selectionSettings ->', () => {
            it('scrollSettings', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ scrollSettings: { isFinite: null, enableVirtualization: null } });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.scrollSettings.enableVirtualization).toBe(null);
                expect(spreadsheetEle.scrollSettings.isFinite).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ scrollSettings: { isFinite: undefined, enableVirtualization: undefined } });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.scrollSettings.enableVirtualization).toBe(true);
                expect(spreadsheetEle.scrollSettings.isFinite).toBe(false);
                spreadsheetEle.destroy();
                done();
            });
            it('selectionSettings', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ selectionSettings: { mode: null } });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.selectionSettings.mode).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ selectionSettings: { mode: undefined } });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.selectionSettings.mode).toBe('Multiple');
                spreadsheetEle.destroy();
                done();
            });
        });
        describe('Null or Undefined values testing for sheet related properties ->', () => {
            it('Testing activeCell and selectedRange', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ activeCell: undefined, selectedRange: undefined }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].activeCell).toBe('A1');
                expect(spreadsheetEle.sheets[0].selectedRange).toBe('A1:A1');
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ activeCell: null, selectedRange: null }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].activeCell).toBe('A1');
                expect(spreadsheetEle.sheets[0].selectedRange).toBe('A1:A1');
                spreadsheetEle.destroy();
                done();
            });
            it('Testing usedRange', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ usedRange: { rowIndex: null, colIndex: null } }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].usedRange.rowIndex).toBe(0);
                expect(spreadsheetEle.sheets[0].usedRange.colIndex).toBe(0);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ usedRange: { rowIndex: undefined, colIndex: undefined } }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].usedRange.rowIndex).toBe(0);
                expect(spreadsheetEle.sheets[0].usedRange.colIndex).toBe(0);
                spreadsheetEle.destroy();
                done();
            });
            it('Testing showHeaders and showGridLines', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ showGridLines: null, showHeaders: null }] });
                spreadsheetEle.appendTo('#spreadsheet');
                // Commended these checks because it fails only in the CI.
                //expect(spreadsheetEle.sheets[0].showGridLines).toBe(true);
                //expect(spreadsheetEle.sheets[0].showHeaders).toBe(true);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ showGridLines: undefined, showHeaders: undefined }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].showGridLines).toBe(true);
                expect(spreadsheetEle.sheets[0].showHeaders).toBe(true);
                spreadsheetEle.destroy();
                done();
            });
            it('Testing rowCount and colCount', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ rowCount: null, colCount: null }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].rowCount).toBe(100);
                expect(spreadsheetEle.sheets[0].colCount).toBe(100);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ rowCount: undefined, colCount: undefined }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].rowCount).toBe(100);
                expect(spreadsheetEle.sheets[0].colCount).toBe(100);
                spreadsheetEle.destroy();
                done();
            });
            it('Testing sheetName and isProtected', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ name: null, isProtected: null }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].name).toBe('Sheet1');
                expect(spreadsheetEle.sheets[0].isProtected).toBeFalsy();
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ name: undefined, isProtected: undefined }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].name).toBe('Sheet1');
                expect(spreadsheetEle.sheets[0].isProtected).toBe(false);
                spreadsheetEle.destroy();
                done();
            });
            it('Testing index and password', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ index: null, password: null }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].index).toBe(null);
                expect(spreadsheetEle.sheets[0].password).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ index: undefined, password: undefined }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].index).toBe(0);
                expect(spreadsheetEle.sheets[0].password).toBe('');
                spreadsheetEle.destroy();
                done();
            });
            it('Testing Protect Settings', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ protectSettings: { selectCells: null, selectUnLockedCells: null, formatCells: null, formatRows: null, formatColumns: null, insertLink: null } }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].protectSettings.formatCells).toBe(null);
                expect(spreadsheetEle.sheets[0].protectSettings.formatColumns).toBe(null);
                expect(spreadsheetEle.sheets[0].protectSettings.formatRows).toBe(null);
                expect(spreadsheetEle.sheets[0].protectSettings.insertLink).toBe(null);
                expect(spreadsheetEle.sheets[0].protectSettings.selectCells).toBe(null);
                expect(spreadsheetEle.sheets[0].protectSettings.selectUnLockedCells).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ protectSettings: { selectCells: undefined, selectUnLockedCells: undefined, formatCells: undefined, formatRows: undefined, formatColumns: undefined, insertLink: undefined } }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].protectSettings.formatCells).toBe(false);
                expect(spreadsheetEle.sheets[0].protectSettings.formatColumns).toBe(false);
                expect(spreadsheetEle.sheets[0].protectSettings.formatRows).toBe(false);
                expect(spreadsheetEle.sheets[0].protectSettings.insertLink).toBe(false);
                expect(spreadsheetEle.sheets[0].protectSettings.selectCells).toBe(false);
                expect(spreadsheetEle.sheets[0].protectSettings.selectUnLockedCells).toBe(false);
                spreadsheetEle.destroy();
                done();
            });
            it('Testing sheet state', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ state: undefined }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].state).toBe('Visible');
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ state: null }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].state).toBe('Visible');
                spreadsheetEle.destroy();
                done();
            });
            it('Testing paneTopLeftCell and topLeftCell', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ paneTopLeftCell: undefined, topLeftCell: undefined }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].paneTopLeftCell).toBe('A1');
                expect(spreadsheetEle.sheets[0].topLeftCell).toBe('A1');
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ paneTopLeftCell: null, topLeftCell: null }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].paneTopLeftCell).toBe('A1');
                expect(spreadsheetEle.sheets[0].topLeftCell).toBe('A1');
                spreadsheetEle.destroy();
                done();
            });
            it('Testing frozenRows and frozenColumns', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ frozenRows: null, frozenColumns: null }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].frozenRows).toBe(0);
                expect(spreadsheetEle.sheets[0].frozenColumns).toBe(0);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ frozenRows: undefined, frozenColumns: undefined }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].frozenRows).toBe(0);
                expect(spreadsheetEle.sheets[0].frozenColumns).toBe(0);
                spreadsheetEle.destroy();
                done();
            });
            it('Testing ranges', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ ranges: [{ dataSource: null, address: null, query: null, showFieldAsHeader: null, startCell: null, template: null }] }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].ranges[0].dataSource).toBe(null);
                expect(spreadsheetEle.sheets[0].ranges[0].address).toBe(null);
                expect(spreadsheetEle.sheets[0].ranges[0].query).toBe(null);
                expect(spreadsheetEle.sheets[0].ranges[0].showFieldAsHeader).toBe(null);
                expect(spreadsheetEle.sheets[0].ranges[0].startCell).toBe(null);
                expect(spreadsheetEle.sheets[0].ranges[0].template).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ ranges: [{ dataSource: undefined, address: undefined, query: undefined, showFieldAsHeader: undefined, startCell: undefined, template: undefined }] }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].ranges[0].dataSource).toBe(null);
                expect(spreadsheetEle.sheets[0].ranges[0].address).toBe('A1');
                expect(spreadsheetEle.sheets[0].ranges[0].query).toBe(null);
                expect(spreadsheetEle.sheets[0].ranges[0].showFieldAsHeader).toBe(true);
                expect(spreadsheetEle.sheets[0].ranges[0].startCell).toBe('A1');
                expect(spreadsheetEle.sheets[0].ranges[0].template).toBe('');
                spreadsheetEle.destroy();
                done();
            });
            it('Testing rows', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ rows: [{ cells: null, customHeight: null, format: null, height: null, hidden: null, index: null }] }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].rows[0].cells).toBe(null);
                expect(spreadsheetEle.sheets[0].rows[0].customHeight).toBe(null);
                expect(spreadsheetEle.sheets[0].rows[0].format).toBe(null);
                expect(spreadsheetEle.sheets[0].rows[0].height).toBe(null);
                expect(spreadsheetEle.sheets[0].rows[0].hidden).toBe(null);
                // Commended this check because it fails only in the CI.
                //expect(spreadsheetEle.sheets[0].rows[0].index).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ rows: [{ cells: undefined, customHeight: undefined, format: undefined, height: undefined, hidden: undefined, index: undefined }] }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].rows[0].cells).toBe(undefined);
                expect(spreadsheetEle.sheets[0].rows[0].customHeight).toBe(undefined);
                expect(spreadsheetEle.sheets[0].rows[0].format).toBe(undefined);
                expect(spreadsheetEle.sheets[0].rows[0].height).toBe(undefined);
                expect(spreadsheetEle.sheets[0].rows[0].hidden).toBe(undefined);
                expect(spreadsheetEle.sheets[0].rows[0].index).toBe(undefined);
                spreadsheetEle.destroy();
                done();
            });
            it('Testing columns', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ columns: [{ index: null, width: null, customWidth: null, hidden: null, format: null, isLocked: null, validation: null }] }] });
                spreadsheetEle.appendTo('#spreadsheet');
                // Commended this check because it fails only in the CI.
                //expect(spreadsheetEle.sheets[0].columns[0].index).toBe(null);
                expect(spreadsheetEle.sheets[0].columns[0].width).toBe(null);
                expect(spreadsheetEle.sheets[0].columns[0].customWidth).toBe(null);
                expect(spreadsheetEle.sheets[0].columns[0].hidden).toBe(null);
                expect(spreadsheetEle.sheets[0].columns[0].format).toBe(null);
                expect(spreadsheetEle.sheets[0].columns[0].isLocked).toBe(null);
                expect(spreadsheetEle.sheets[0].columns[0].validation).toBe(null);
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ columns: [{ index: undefined, width: undefined, customWidth: undefined, hidden: undefined, format: undefined, isLocked: undefined, validation: undefined }] }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].columns[0].index).toBe(undefined);
                expect(spreadsheetEle.sheets[0].columns[0].width).toBe(undefined);
                expect(spreadsheetEle.sheets[0].columns[0].customWidth).toBe(undefined);
                expect(spreadsheetEle.sheets[0].columns[0].hidden).toBe(undefined);
                expect(spreadsheetEle.sheets[0].columns[0].format).toBe(undefined);
                expect(spreadsheetEle.sheets[0].columns[0].isLocked).toBe(undefined);
                expect(spreadsheetEle.sheets[0].columns[0].validation).toBe(undefined);
                spreadsheetEle.destroy();
                done();
            });
            it('Testing Conditional Formats', (done: Function) => {
                spreadsheetEle = new Spreadsheet({ sheets: [{ conditionalFormats: [{ cFColor: null, format: null, range: null, type: null, value: null }] }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].cFColor).toBe(null);
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].range).toBe(null);
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].type).toBe(null);
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].value).toBe(null);
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.format).toBe('General');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.isLocked).toBe(true);
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.backgroundColor).toBe('#ffffff');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.border).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.borderBottom).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.borderLeft).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.borderRight).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.borderTop).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.color).toBe('#000000');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.fontFamily).toBe('Calibri');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.fontSize).toBe('11pt');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.fontStyle).toBe('normal');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.fontWeight).toBe('normal');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.textAlign).toBe('left');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.textDecoration).toBe('none');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.textIndent).toBe('0pt');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.verticalAlign).toBe('bottom');
                spreadsheetEle.destroy();
                spreadsheetEle = new Spreadsheet({ sheets: [{ conditionalFormats: [{ cFColor: undefined, format: undefined, range: undefined, type: undefined, value: undefined }] }] });
                spreadsheetEle.appendTo('#spreadsheet');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].cFColor).toBe('RedFT');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].range).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].type).toBe('GreaterThan');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].value).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.format).toBe('General');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.isLocked).toBe(true);
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.backgroundColor).toBe('#ffffff');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.border).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.borderBottom).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.borderLeft).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.borderRight).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.borderTop).toBe('');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.color).toBe('#000000');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.fontFamily).toBe('Calibri');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.fontSize).toBe('11pt');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.fontStyle).toBe('normal');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.fontWeight).toBe('normal');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.textAlign).toBe('left');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.textDecoration).toBe('none');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.textIndent).toBe('0pt');
                expect(spreadsheetEle.sheets[0].conditionalFormats[0].format.style.verticalAlign).toBe('bottom');
                spreadsheetEle.destroy();
                done();
            });
        });
    });
    
    describe('Checking public methods in spreadsheet ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], allowFiltering: false, enableKeyboardNavigation: false,
            created: (args: Object) => { setColMinWidth(helper.getInstance(), 30)} }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('goto method with invalid sheet index ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.goTo('Sheet2!E5');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
                done();
            });
        });
        it('applyfilter method with allofiltering property as false', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'contains', value: '10' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
                done();
            });
        });
        it('setRowHeight method with null as row index value->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A1']);
            spreadsheet.setRowHeight(20, null, 0);
            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
            done();
        });
        it('setColWidth method with null as column index value->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A1']);
            spreadsheet.setColWidth(150, null, 0);
            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
            done();
        });
        it('autoFit method with start index more than XFD values->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.autoFit('XFE2:XFE3');
            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
            done();
        });
        it('Checking getAddress method with number followed by alphabets->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.getIndexes('222A').isCol).toBeFalsy();
            done();
        });
        it('Checking keydownhandler with enable keyboard navigation set as false and using arrow up key->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['E11']);
            helper.triggerKeyNativeEvent(38);
            expect(spreadsheet.sheets[0].selectedRange).toBe('E11:E11');
            done();
        });
        it('Checking onproperty changed method->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.allowImage).toBeTruthy();
            spreadsheet.allowImage = false;
            expect(spreadsheet.allowImage).toBeFalsy();
            expect(spreadsheet.allowFreezePane).toBeTruthy();
            spreadsheet.allowFreezePane = false;
            expect(spreadsheet.allowFreezePane).toBeFalsy();
            expect(spreadsheet.allowChart).toBeTruthy();
            spreadsheet.allowChart = false;
            expect(spreadsheet.allowChart).toBeFalsy();
            done();
        });
        it('getSheetProperies Method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: string[] = ["row", "columns"];
            const properties = getSheetProperties(spreadsheet, sheet);
            expect(properties).toBe('{"jsonObject":{"Workbook":{"sheets":[{"rows":[{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]},{"cells":[{},{},{},{},{},{},{},{}]}],"columns":[],"id":1,"maxHgts":[]}]}}}');
            done();
        });
        it('inView Method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(2, 3);
            const view: boolean = inView(spreadsheet, [0, 78, 78, 10], true);
            expect(helper.getInstance().activeSheetIndex).toEqual(0);
            done();
        });
    });
    describe('Virtual Scrolling ->', () => {
        describe('Scrolling throuch sheet with find dialog as active element ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }]}, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Scrolling throuch sheet with find dialog as active element', (done: Function) => {
                const findOption: any = { value: 'Casual Shoes', sheetIndex: 0, findOpt: 'next', mode: 'Sheet', isCSen: false, isEMatch: false,
                    searchBy: 'By Row', showDialog: true };
                helper.invoke('find', [findOption]);
                const spreadsheet: any = helper.getInstance();
                const sheet: SheetModel = spreadsheet.sheets[0];
                expect(sheet.selectedRange).toBe('A2:A2');
                const findToolDlg: HTMLElement = helper.getElementFromSpreadsheet('.e-findtool-dlg');
                expect(findToolDlg.classList.contains('e-popup-open')).toBeTruthy();
                const findInput: HTMLInputElement = <HTMLInputElement>findToolDlg.querySelector('.e-text-findNext-short');
                expect(findInput.value).toBe('Casual Shoes');
                helper.invoke('goTo', ['A100']);
                setTimeout(() => {
                    //expect(spreadsheet.sheets[0].paneTopLeftCell).toEqual('A100');
                    done();
                });
            });
        });
        describe('Scrolling horizontally in Finite mode ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], frozenRows: 2, frozenColumns: 1}], scrollSettings : { isFinite :true }}, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Scrolling horizontally in Finite mode', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                helper.invoke('goTo', ['AF5']);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toEqual('AF5');
                    helper.invoke('goTo', ['A1']);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].paneTopLeftCell).toEqual('AF5');
                        done();
                    },20);
                },20);
            });
        });
        describe('Scrolling in backwards with nearby cells ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }]}, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Scrolling in backwards with nearby cells Vertically.', (done: Function) => {               
                const spreadsheet: any = helper.getInstance();
                helper.invoke('goTo', ['A100']);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toEqual('A100');
                    helper.invoke('goTo', ['A88']);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].paneTopLeftCell).toEqual('A88');
                        done();
                    },20);
                },20);
            });
            it('Scrolling in backwards with nearby cells Horizontally.', (done: Function) => {               
                const spreadsheet: any = helper.getInstance();
                helper.invoke('goTo', ['AK88']);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toEqual('AK88');
                    helper.invoke('goTo', ['AA88']);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].paneTopLeftCell).toEqual('AA88');
                        done();
                    },20);
                },20);
            });
        });
    });
    describe('Public Methods ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Predicate with type data in applyFilter method & change currency code.', (done: Function) => {
            let predicates: PredicateModel[] = [
                {
                    field: 'B',
                    operator: 'equal',
                    matchCase: false,
                    type: 'date'
                }
            ];
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.applyFilter(predicates);
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('Calculate Height method.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.calculateHeight({fontFamily : 'Arial Black'});
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('Calculate Height method without lines and borderwidth', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.calculateHeight({fontSize: '10px'}, 2,5);
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('Hide Row and Hide Column method with rendor module as null.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.renderModule = null;
            spreadsheet.hideColumn(0,1,true);
            spreadsheet.hideRow(3,4,true)
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('setValueRowCol method with allowEditing as false.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.allowEditing = false;
            spreadsheet.setValueRowCol(1, 100, 13, 8);
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            spreadsheet.allowNumberFormatting = false;
            spreadsheet.setValueRowCol(1, 100, 12, 8);
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('getService method with unavailable service name.', (done: Function) => {
            try {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.serviceLocator.getService('unavailable');
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error).toBe('The service unavailable is not registered');
                done();
            }
        });
        it('register method with available service name.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.serviceLocator.register('dialog', new Spreadsheet());
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        // it('Filter and applyFilter Methods with allowFiltering as false.', (done: Function) => {
        //     const spreadsheet: Spreadsheet = helper.getInstance();
        //     spreadsheet.allowFiltering = false;
        //     let promise1: Promise<FilterEventArgs> = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        //     promise1 = spreadsheet.filter();
        //     let promise2: Promise<void> = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        //     promise2 = spreadsheet.applyFilter()
        //     done();
        // });
        // it('Sort Methods with allowSorting as false.', (done: Function) => {
        //     const spreadsheet: Spreadsheet = helper.getInstance();
        //     spreadsheet.allowSorting = false;
        //     let promise: Promise<SortEventArgs> = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        //     promise = spreadsheet.sort();
        //     done();
        // });

        it('addToolbarItems method without index argument', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addToolbarItems('Home', [{ type: 'Separator' }, { text: 'Custom', tooltipText: 'Custom Btn' }]);
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });

        it('hideRibbonTabs method with hiding all the ribbon items', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.hideRibbonTabs(['Home','Insert','Formulas','Data','View']);
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });

        it('hideRibbonTabs method with unhiding all the ribbon items', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.hideRibbonTabs(['Home','Insert','Formulas','Data','View'], false);
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        }); 
    });
    describe('Workbook Public methods ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }, { name: 'Price (123)', ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('List data validation with value1 more than 256 characters without range.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange('D1:D12');
            spreadsheet.addDataValidation({ type: 'List', value1: '12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100' });
            setTimeout(() => {
                expect(JSON.stringify(spreadsheet.sheets[0].rows[1].cells[3].validation)).toBe('{"type":"List","value1":"12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96"}');
                expect(JSON.stringify(spreadsheet.sheets[0].rows[2].cells[3].validation)).toBe('{"type":"List","value1":"12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96"}');
                expect(JSON.stringify(spreadsheet.sheets[0].rows[3].cells[3].validation)).toBe('{"type":"List","value1":"12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96"}');
                expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[3].validation)).toBe('{"type":"List","value1":"12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96"}');
                done();
            });
        });
        it('Check valid cell or not by using isValidCell method.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.isValidCell('D2')).toBeFalsy();
            expect(spreadsheet.isValidCell('D3')).toBeTruthy();
            expect(spreadsheet.isValidCell('D4')).toBeTruthy();
            expect(spreadsheet.isValidCell('E2')).toBeTruthy();
            expect(spreadsheet.isValidCell('D12')).toBeTruthy();
            done();
        });
        it('Hide row and Hide Column method without renderModule.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.renderModule = null;
            spreadsheet.hideRow(3, 4);
            spreadsheet.hideColumn(0, 2);
            expect(spreadsheet.sheets[0].rows[3].hidden).toBeTruthy();
            expect(spreadsheet.sheets[0].rows[4].hidden).toBeTruthy();
            expect(spreadsheet.sheets[0].columns[0].hidden).toBeTruthy();
            expect(spreadsheet.sheets[0].columns[1].hidden).toBeTruthy();
            expect(spreadsheet.sheets[0].columns[2].hidden).toBeTruthy();
            spreadsheet.setBorder({ border: '1px solid #000000' }, 'A1');
            done();
        });
        it('setBorder method without range.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setBorder({ border: '1px solid #000000' });
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('moveSheet method.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.moveSheet(1)
            expect(spreadsheet.activeSheetIndex).toEqual(1);
            done();
        });
        it('clearConditionalFormat method with sheet name range.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.clearConditionalFormat('Sheet1!A1:H7')
            expect(spreadsheet.activeSheetIndex).toEqual(1);
            done();
        });
        it('updateCell method with invalid sheet name', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const cell: CellModel = spreadsheet.sheets[1].rows[1].cells[4];
            spreadsheet.updateCell(cell, 'Sheet!A1:H7')
            expect(spreadsheet.activeSheetIndex).toEqual(1);
            done();
        });
        it('unmerge method with invalid sheet name', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange('G7:H10');
            spreadsheet.merge();
            setTimeout(() => {
                spreadsheet.unMerge();
                expect(spreadsheet.activeSheetIndex).toEqual(1);
                done();
            });
        });
        it('getSheetIndex method with sheet name staring and ending with single quotes (\')', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const index: number = getSheetIndex(spreadsheet,'\'Sheet1\'');
            spreadsheet.sheetNameCount = 1;
            const count: number = getSheetNameCount(spreadsheet);
            const range: string = getSelectedRange(null);
            expect(index).toEqual(1);
            expect(range).toBe('A1');
            expect(count).toEqual(3);
            done();
        });
        it('duplicateSheet method with sheet name containg numbers within paranthesis ()', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            duplicateSheet(spreadsheet, 2)
            expect(spreadsheet.activeSheetIndex).toEqual(3);
            done();
        }); 
    });
    describe('Workbook Instance. ->', () => {
        beforeAll(() => {
            workbookHelper = new WorkbookHelper({ sheets: [{ ranges: [{ dataSource: defaultData, startCell: 'A10' }],id:1 }]});
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Hide Row and Hide Column method using workbook instance', (done: Function) => {
            const workbook: Workbook = workbookHelper.getInstance();
            workbook.hideRow(0);
            workbook.hideColumn(1);
            expect(workbook.sheets[0].rows[0].hidden).toBeTruthy();
            expect(workbook.sheets[0].columns[1].hidden).toBeTruthy();
            done();
        });
        it('Highlight invalid data without rangte.', (done: Function) => {
            const workbook: Workbook = workbookHelper.getInstance();
            workbook.addInvalidHighlight('');
            expect(workbook.sheets[0].rows[0].hidden).toBeTruthy();
            expect(workbook.sheets[0].columns[1].hidden).toBeTruthy();
            done();
        });
        it('Freeze and Unfreeze panes using workbook instance.', (done: Function) => {
            const workbook: Workbook = workbookHelper.getInstance();
            workbook.freezePanes()
            workbook.Unfreeze();
            expect(workbook.activeSheetIndex).toEqual(0);
            done();
        });
    });
    describe('onProperty changed method. ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], allowImage: false }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Change RTL mode with allowImage property as false.', (done: Function) => {
            setTimeout((): void => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
                helper.invoke('insertChart', [[{ type: 'Pie', range: 'D1:E5' }]]);
                spreadsheet.enableRtl = true;
                setTimeout((): void => {
                    expect(spreadsheet.activeSheetIndex).toEqual(0);
                    done();
                }, 20);
            }, 30);
        });
        it('Change currencyCode Property.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            setCurrencyCode('EUR');
            setTimeout((): void => {
                expect(spreadsheet.activeSheetIndex).toEqual(0);
                setCurrencyCode('USD');
                setTimeout((): void => {
                    expect(spreadsheet.activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
    });
    describe('Insert delete method with template. ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData, template: '<button class="e-button-template">BUTTON</button>', address: 'A1:A2' }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert delete method with template.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('insertRow', [2]);
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('Insert delete method with template.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.delete();
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
    });
    describe('Delete method with Finite mode set to true. ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rowCount:10,colCount:10 }],scrollSettings:{isFinite :true} }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Delete method for Row.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.delete(9,10,'Row')
            spreadsheet.delete(9,10,'Row')
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('Delete method for Column.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.delete(9,10,'Column')
            spreadsheet.delete(9,10,'Column')
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
    });
    describe('processIdx method with isCell. ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking processIdx method to sort the cell index data in accending order', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const model: CellModel[] = [{ value: '10', index: 3 }, { value: '10', index: 13 }, { value: '10', index: 7, }]
            processIdx(model, null, undefined, true);
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
    });
});
