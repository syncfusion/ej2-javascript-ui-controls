import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, virtualData, dataSource } from '../util/datasource.spec';
import { CellModel, SortEventArgs, SortDescriptor, getCell, DialogBeforeOpenEventArgs, SheetModel, setCell } from '../../../src/index';
import { Dialog } from '../../../src/spreadsheet/services/index';

Spreadsheet.Inject(BasicModule);

/**
 *  Sorting test cases
 */
describe('Spreadsheet sorting module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    describe('UI interaction checking ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }]
                    }
                ],
                created: (): void => {
                    helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                }
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('sort ascending testing', (done: Function) => {
            helper.invoke('cellFormat', [{ border: '1px solid #000' }, 'D3']);
            helper.invoke('selectRange', ['D2:E5']);
            helper.setModel('activeCell', 'D2');
            helper.invoke('sort', null).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('D2').value.toString()).toEqual('10');
                    expect(values.get('E2').value.toString()).toEqual('20');
                    expect(values.get('D3').value.toString()).toEqual('15');
                    expect(values.get('E3').value.toString()).toEqual('20');
                    expect(values.get('D4').value.toString()).toEqual('20');
                    expect(values.get('E4').value.toString()).toEqual('30');
                    expect(values.size).toEqual(8);
                    // Checking for border should not be sorted
                    expect(JSON.stringify(values.get('D3').style)).toBe('{"borderBottom":"1px solid #000","borderTop":"1px solid #000","borderRight":"1px solid #000","borderLeft":"1px solid #000"}');
                    expect(JSON.stringify(values.get('D4').style)).toBe('{}');
                    let td: HTMLElement = helper.invoke('getCell', [2, 3]);
                    expect(td.style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                    expect(td.style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                    expect(helper.invoke('getCell', [2, 2]).style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                    expect(helper.invoke('getCell', [1, 3]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                    td = helper.invoke('getCell', [3, 3]);
                    expect(td.style.borderRight).toBe('');
                    expect(td.style.borderBottom).toBe('');
                    expect(helper.invoke('getCell', [3, 2]).style.borderRight).toBe('');
                    done();
                });
            });
        });

        // it('sort undo testing', (done: Function) => {
        //     helper.invoke('undo', null);
        //     expect(getCell(1, 3, instance.getActiveSheet()).value.toString()).toEqual('10');
        //     expect(getCell(1, 4, instance.getActiveSheet()).value.toString()).toEqual('20');
        //     expect(getCell(2, 3, instance.getActiveSheet()).value.toString()).toEqual('20');
        //     expect(getCell(2, 4, instance.getActiveSheet()).value.toString()).toEqual('30');
        //     expect(getCell(3, 3, instance.getActiveSheet()).value.toString()).toEqual('20');
        //     expect(getCell(3, 4, instance.getActiveSheet()).value.toString()).toEqual('15');
        //     done();
        // });

        it('sort redo testing', (done: Function) => {
            const instance: Spreadsheet = helper.getInstance();
            helper.invoke('redo', null);
            setTimeout(() => {
                expect(getCell(1, 3, instance.getActiveSheet()).value.toString()).toEqual('10');
                expect(getCell(1, 4, instance.getActiveSheet()).value.toString()).toEqual('20');
                expect(getCell(2, 3, instance.getActiveSheet()).value.toString()).toEqual('15');
                expect(getCell(2, 4, instance.getActiveSheet()).value.toString()).toEqual('20');
                expect(getCell(3, 3, instance.getActiveSheet()).value.toString()).toEqual('20');
                expect(getCell(3, 4, instance.getActiveSheet()).value.toString()).toEqual('30');
                done();
            }, 10);
        });

        it('sort descending testing', (done: Function) => {
            helper.invoke('selectRange', ['D2:E5']);
            helper.setModel('activeCell', 'D2');
            helper.invoke('sort', [{ sortDescriptors: { order: 'Descending' } }]).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('D2').value.toString()).toEqual('20');
                    expect(values.get('E2').value.toString()).toEqual('30');
                    expect(values.get('D3').value.toString()).toEqual('20');
                    expect(values.get('E3').value.toString()).toEqual('15');
                    expect(values.get('D4').value.toString()).toEqual('15');
                    expect(values.get('E4').value.toString()).toEqual('20');
                    expect(values.size).toEqual(8);
                    done();
                });
            });
        });

        it('sort auto containsHeader testing', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.setModel('activeCell', 'D1');
            helper.invoke('sort', null).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('D1')).toBeUndefined(); //Quantity - skipped
                    expect(values.get('E1')).toBeUndefined(); // Price - skipped
                    expect(values.get('D2').value.toString()).toEqual('10');
                    expect(values.get('E2').value.toString()).toEqual('20');
                    expect(values.get('D3').value.toString()).toEqual('15');
                    expect(values.get('E3').value.toString()).toEqual('20');
                    expect(values.get('D4').value.toString()).toEqual('20');
                    expect(values.get('E4').value.toString()).toEqual('30');
                    expect(values.size).toEqual(8);
                    done();
                });
            });
        });

        it('automatic sort range testing', (done: Function) => {
            helper.invoke('selectRange', ['A1:A1']); //no selection
            helper.invoke('sort', null).then((args: SortEventArgs) => {
                expect(args.range).toEqual('Sheet1!A2:H11'); //excluding header
                done();
            });
        });

        it('catch invalid sort range error testing', (done: Function) => {
            helper.invoke('selectRange', ['K2:M5']);
            helper.invoke('sort', null).catch((error: string) => {
                expect(error).toEqual('Select a cell or range inside the used range and try again.');
                done();
            });
        });

        it('custom sort testing', (done: Function) => {
            helper.invoke('selectRange', ['D1:E11']);
            //Price - ascending, Quantity - descending
            let sortDescriptors: SortDescriptor[] = [
                {
                    field: 'E',
                    order: 'Ascending'
                },
                {
                    field: 'D',
                    order: 'Descending'
                }
            ];
            helper.invoke('sort', [{ sortDescriptors: sortDescriptors }]).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('E2').value.toString()).toEqual('10');
                    expect(values.get('E3').value.toString()).toEqual('10');
                    expect(values.get('E4').value.toString()).toEqual('10');
                    expect(values.get('E5').value.toString()).toEqual('10');
                    expect(values.get('D2').value.toString()).toEqual('50');
                    expect(values.get('D3').value.toString()).toEqual('31');
                    expect(values.get('D4').value.toString()).toEqual('30');
                    expect(values.get('D5').value.toString()).toEqual('20');
                    expect(values.size).toEqual(20);
                    done();
                });
            });
        });

        it('case sensitive sort testing', (done: Function) => {
            let td: HTMLTableCellElement = helper.invoke('getCell', [4, 0]);
            let cellValue: string = td.textContent;
            helper.invoke('updateCell', [{ value: cellValue.toLowerCase() }, 'A7']);
            helper.invoke('selectRange', ['A2:B7']);
            helper.setModel('activeCell', 'A2');
            helper.invoke('sort', [{ caseSensitive: true }]).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    // expect(values.get('A5').value.toString()).toEqual(cellValue.toLowerCase());//lowercase first Check this now
                    // expect(values.get('A6').value.toString()).toEqual(cellValue);//uppercase next
                    // expect(values.size).toEqual(12);
                    done();
                });
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('I311230, I311230, I309407, I300737, I315895 ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{
                        rows: [{ cells: [{ index: 1, value: 'Amount' }] }, { cells: [{ index: 1, value: 2 }] },
                        { cells: [{ index: 1, value: 3 }] }, { cells: [{ index: 1, value: 5 }] }, { cells: [{ index: 1, value: 11 }] },
                        { cells: [{ index: 1, value: 7 }] }, { cells: [{ index: 1, value: 6 }] }, { cells: [{ index: 1, value: 4 }] }]
                    }],
                    created: (): void => {
                        helper.getInstance().hideColumn(0, 10, false);
                    }
                } as any;
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Try to filter an unsorted number list', (done: Function) => {
                helper.invoke('numberFormat', ['_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-', 'B1:B8']);
                const inst: Spreadsheet = helper.getInstance();
                expect(inst.sheets[0].rows[1].cells[1].format).toEqual('_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-');
                expect(helper.invoke('getCell', [1, 1]).textContent).toEqual('2.00');
                helper.invoke('selectRange', ['B1:B8']);
                setTimeout((): void => {
                    helper.getElement('#' + helper.id + '_sorting').click();
                    helper.getElement('#' + helper.id + '_applyfilter').click();
                    expect(!!helper.invoke('getCell', [0, 1]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                    const td: HTMLTableCellElement = helper.invoke('getCell', [0, 1]);
                    helper.invoke('selectRange', ['B1']);
                    helper.invoke('getCell', [0, 1]).focus();
                    helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                    setTimeout((): void => {
                        setTimeout((): void => {
                            const sortAsc: HTMLElement = helper.getElement('.e-excelfilter .e-filter-sortasc');
                            helper.triggerMouseAction(
                                'mousedown', { x: sortAsc.getBoundingClientRect().left + 1, y: sortAsc.getBoundingClientRect().top + 1 },
                                null, sortAsc);
                            setTimeout((): void => {
                                expect(inst.sheets[0].rows[3].cells[1].value.toString()).toEqual('4');
                                expect(helper.invoke('getCell', [3, 1]).textContent).toEqual('4.00');
                                expect(inst.sheets[0].rows[4].cells[1].value.toString()).toEqual('5');
                                expect(helper.invoke('getCell', [4, 1]).textContent).toEqual('5.00');
                                expect(inst.sheets[0].rows[5].cells[1].value.toString()).toEqual('6');
                                expect(helper.invoke('getCell', [5, 1]).textContent).toEqual('6.00');
                                expect(inst.sheets[0].rows[6].cells[1].value.toString()).toEqual('7');
                                expect(helper.invoke('getCell', [6, 1]).textContent).toEqual('7.00');
                                expect(inst.sheets[0].rows[7].cells[1].value.toString()).toEqual('11');
                                expect(helper.invoke('getCell', [7, 1]).textContent).toEqual('11.00');
                                done();
                            }, 10);
                        });
                    });
                });
            });
            it('cut and paste the filtered list', (done: Function) => {
                helper.invoke('selectRange', ['B1:B8']);
                setTimeout(() => {
                    helper.invoke('cut').then((): void => {
                        helper.invoke('paste', ['D1']);
                        setTimeout((): void => {
                            // need to remove this once the filter with cut/paste action is properly handled as like excel
                            //expect(!!helper.invoke('getCell', [0, 1]).querySelector('.e-filter-iconbtn')).toBeFalsy();
                            //expect(!!helper.invoke('getCell', [0, 3]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                            const inst: Spreadsheet = helper.getInstance();
                            expect(inst.sheets[0].rows[1].cells[1]).toBeNull();
                            expect(helper.invoke('getCell', [1, 1]).textContent).toEqual('');
                            expect(inst.sheets[0].rows[7].cells[1]).toBeNull();
                            expect(helper.invoke('getCell', [7, 1]).textContent).toEqual('');
                            expect(inst.sheets[0].rows[1].cells[3].value.toString()).toEqual('2');
                            expect(helper.invoke('getCell', [1, 3]).textContent).toEqual('2.00');
                            expect(inst.sheets[0].rows[7].cells[3].value.toString()).toEqual('11');
                            expect(helper.invoke('getCell', [7, 3]).textContent).toEqual('11.00');
                            done();
                        });
                    }, 10);
                });
            });

            it('copy the list and paste the list starting from row 2', (done: Function) => {
                helper.invoke('copy').then(() => {
                    helper.invoke('selectRange', ['D2']);
                    setTimeout((): void => {
                        helper.invoke('paste', ['D2']);
                        setTimeout((): void => {
                            const inst: Spreadsheet = helper.getInstance();
                            expect(inst.sheets[0].rows[1].cells[3].value.toString()).toEqual('Amount');
                            expect(helper.invoke('getCell', [1, 3]).textContent).toEqual('Amount');
                            expect(inst.sheets[0].rows[8].cells[3].value.toString()).toEqual('11');
                            expect(helper.invoke('getCell', [8, 3]).textContent).toEqual('11.00');
                            done();
                        }, 10);
                    });
                });
            });
        });

        describe('I309407, I301769, EJ2-61765 ->', () => {
            beforeEach((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (args: any) => {
                        for (let index: number = 1; index <= 10; index++) {
                            helper.getInstance().sheets[0].rows[index].cells[1].format = 'dd/MM/yyyy';
                        }
                    }
                } as any;
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('sort ascending on a column, the data gets vanished', (done: Function) => {
                const td: HTMLElement = (helper.getElement('.e-colhdr-table') as HTMLTableElement).tHead.rows[0].cells[3];
                helper.triggerMouseAction(
                    'mousedown', { x: td.getBoundingClientRect().left + 20, y: td.getBoundingClientRect().top + 10 },
                    null, td);
                helper.triggerMouseAction(
                    'mouseup', { x: td.getBoundingClientRect().left + 20, y: td.getBoundingClientRect().top + 10 },
                    document, td);
                setTimeout((): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[2].cells[3].value.toString()).toEqual('20');
                    expect(spreadsheet.sheets[0].rows[6].cells[3].value.toString()).toEqual('40');
                    expect(spreadsheet.sheets[0].rows[7].cells[3].value.toString()).toEqual('20');
                    expect(spreadsheet.sheets[0].rows[8].cells[3].value.toString()).toEqual('31');
                    helper.getElement('#' + helper.id + '_sorting').click();
                    helper.getElement('#' + helper.id + '_sorting-popup').querySelector('.e-item').click();
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].rows[0].cells[3].value.toString()).toEqual('Quantity');
                        expect(spreadsheet.sheets[0].rows[2].cells[3].value.toString()).toEqual('15');
                        expect(spreadsheet.sheets[0].rows[6].cells[3].value.toString()).toEqual('30');
                        expect(spreadsheet.sheets[0].rows[7].cells[3].value.toString()).toEqual('31');
                        expect(spreadsheet.sheets[0].rows[8].cells[3].value.toString()).toEqual('40');
                        done();
                    }, 10);
                }, 10);
            });
            it('Public method sort is not working as expected for Date', (done: Function) => {
                const sheet: SheetModel = helper.getInstance().getActiveSheet();
                helper.invoke('sort', [{ sortDescriptors: { order: 'Ascending', field: 'B' } }, 'B2:B52']).then((args: SortEventArgs) => {
                    helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                        expect(values.get('B2').value.toString()).toEqual('41674');
                        expect(getCell(1, 1, sheet).value.toString()).toEqual('41674');
                        expect(values.get('B3').value.toString()).toEqual('41684');
                        expect(getCell(2, 1, sheet).value.toString()).toEqual('41684');
                        expect(values.get('B10').value.toString()).toEqual('41964');
                        expect(getCell(9, 1, sheet).value.toString()).toEqual('41964');
                        expect(values.get('B11').value.toString()).toEqual('41973');
                        expect(getCell(10, 1, sheet).value.toString()).toEqual('41973');
                        done();
                    });
                });
            });
        });

        describe('EJ2-56060 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Multirange custom sort alert dialog not showing issue resolved.', (done: Function) => {
                helper.invoke('selectRange', ['A1:A100 B1:B100']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                let dialogName: string;
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    dialogName = args.dialogName;
                };
                helper.getElementFromSpreadsheet('#' + helper.id + '_sorting').click();
                setTimeout(() => {
                    helper.click('.e-sort-filter-ddb li:nth-child(3)');  
                });
                setTimeout(() => {
                    expect(dialogName).toBe('MultiRangeSortDialog');
                    done();
                });
            });
            it('customsort alert not showing while apply customsort on empty sheet', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertSheet();
                helper.invoke('selectRange', ['A1']);
                let dialogName: string;
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    dialogName = args.dialogName;
                };
                helper.getElementFromSpreadsheet('#' + helper.id + '_sorting').click();
                setTimeout(() => {
                    helper.click('.e-sort-filter-ddb li:nth-child(3)');  
                });
                setTimeout(() => {
                    expect(dialogName).toBe('SortRangeDialog');
                    done();
                });
            });
            it('Custom sort while A1 only has value', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertSheet();
                helper.invoke('selectRange', ['A1']);
                let dialogName: string;
                spreadsheet.updateCell({value: '10'},"A1");
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    dialogName = args.dialogName;
                };
                helper.getElementFromSpreadsheet('#' + helper.id + '_sorting').click();
                setTimeout(() => {
                    helper.click('.e-sort-filter-ddb li:nth-child(3)');  
                });
                setTimeout(() => {
                    expect(dialogName).toBe('CustomSortDialog');
                    done();
                });
            });
        });

        describe('EJ2-49332, EJ2-51133, EJ2-51376, EJ2-55120, EJ2-55397, EJ2-56132, SF-360222->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        helper.invoke('cellFormat', [{ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1']);
                        helper.invoke('numberFormat', ['dd/MM/yyyy', 'B2:B11']);
                    } 
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-49332 - Data gets duplicated while apply the sorting for hidden columns in spreadsheet', (done: Function) => {
                helper.invoke('hideColumn', [3]);
                expect(helper.getInstance().sheets[0].columns[3].hidden).toBeTruthy();
                helper.invoke('selectRange', ['C1']);
                expect(helper.invoke('getCell', [1, 2]).textContent).toBe('11:34:32 AM');
                expect(helper.invoke('getCell', [2, 2]).textContent).toBe('05:56:32 AM');
                expect(helper.invoke('getCell', [3, 2]).textContent).toBe('03:32:44 AM');
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_sorting-popup').querySelector('.e-item').click();
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 2]).textContent).toBe('Time');
                    expect(helper.invoke('getCell', [1, 2]).textContent).toBe('12:01:44 AM');
                    expect(helper.invoke('getCell', [2, 2]).textContent).toBe('12:43:59 AM');
                    done();
                }, 10);
            });
            it('EJ2-51133 - When sorting empty cells by ascending/descending, a script error occurs', (done: Function) => {
                helper.invoke('selectRange', ['M1:M6']);
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_sorting-popup').querySelector('.e-item').click();
                setTimeout(() => {
                    helper.setAnimationToNone('.e-dialog');
                    helper.click('.e-dialog .e-primary');
                    done();
                }, 10);
            });
            it('EJ2-51376 - Sorting Doesnot Work if the selected column contains an empty value', (done: Function) => {
                helper.invoke('selectRange', ['H2:H11']);
                helper.getElement('#' + helper.id + '_clear').click();
                helper.click('#' + helper.id + '_clear-popup ul li:nth-child(1)');
                helper.invoke('selectRange', ['H1']);
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_sorting-popup').querySelector('.e-item').click();
                setTimeout(() => {  
                    expect(helper.getInstance().sheets[0].rows[0].cells[7].value.toString()).toEqual('Profit');
                    done();
                }, 10);
            });
            it('EJ2-55120 - Need to fix the sorting issue with the date formatted value which contains header->', (done: Function) => {
                helper.invoke('selectRange', ['B1:B200']);
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(1)');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 1]).textContent).toBe('Date');
                    expect(helper.invoke('getCell', [1, 1]).textContent).toBe('04/02/2014');
                    expect(helper.invoke('getCell', [10, 1]).textContent).toBe('30/11/2014');
                    done();
                }, 10);
            });
            it('EJ2-55397 - Need to fix the sorting and filtering related issues->', (done: Function) => {
                helper.invoke('numberFormat', ['@', 'G2:G11']);
                helper.invoke('selectRange', ['G5']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(4, 6, [7, 1], false, false);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 6]).textContent).toBe('1');
                    expect(helper.invoke('getCell', [10, 6]).textContent).toBe('13');
                    done();
                }, 10);
            });
            it('EJ2-56132 - Problem with headers while sorting with select all operation->', (done: Function) => {
                const selectAl: HTMLElement = helper.getElement('#' + helper.id + '_select_all');
                helper.triggerMouseAction(
                    'mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null,
                selectAl);
                helper.triggerMouseAction(
                    'mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document,
                    selectAl);
                setTimeout(() => {
                    helper.getElement('#' + helper.id + '_sorting').click();
                    helper.getElement('#' + helper.id + '_sorting-popup').querySelector('.e-item').click();
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                        expect(helper.invoke('getCell', [10, 0]).textContent).toBe('T-Shirts');
                        done();
                    }, 2000);
                });
            });
            it('SF-360222 - sorting whole column, header cell too get sorted and undo after sorting changes selection range', (done: Function) => {
                helper.invoke('selectRange', ['A1:A200']);
                helper.click('#spreadsheet_sorting');
                helper.click('#spreadsheet_sorting-popup .e-item:nth-child(2)');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                    expect(helper.invoke('getCell', [1, 0]).textContent).toBe('T-Shirts');
                    helper.click('#spreadsheet_undo');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A200');
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                    expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                    helper.click('#spreadsheet_sorting');
                    helper.click('#spreadsheet_sorting-popup .e-item');
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                        done();
                    });
                },10);
            });
            it('EJ2-64739 - Custom number formatted values are not displayed after sorting', (done: Function) => {
                helper.invoke('selectRange', ['F2:F11']);
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_sorting-popup .e-item').click();
                setTimeout(() => {
                    setTimeout(() => {
                        const rows: any[] = helper.getInstance().sheets[0].rows;
                        expect(rows[1].cells[5].value).toBe(200);
                        expect(helper.invoke('getCell', [1, 5]).textContent).toBe('200');
                        expect(rows[5].cells[5].value).toBe(300);
                        expect(helper.invoke('getCell', [5, 5]).textContent).toBe('300');
                        expect(rows[7].cells[5].value).toBe(500);
                        expect(helper.invoke('getCell', [7, 5]).textContent).toBe('500');
                        expect(rows[10].cells[5].value).toBe(1210);
                        expect(helper.invoke('getCell', [10, 5]).textContent).toBe('1210');
                        done();
                    });
                });
            });
        });
        describe('EJ2-53804->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: '' }, { value: 'Yes'}] }, { cells: [{ value: '1' }, { value: 'Yes'}] },
                    { cells: [{ value: '2' }, { value: 'Yes'}] }, { cells: [{ value: '' }, { value: 'No'}] }, { cells: [{ value: '3' }, { value: 'Yes'}] },
                    { cells: [{ value: '4' }, { value: 'Yes'}] }, { cells: [{ value: '' }, { value: 'No'}] }, { cells: [{ value: '' }, { value: 'Yes'}] },
                    { cells: [{ value: '5' }, { value: 'No'}] }, { cells: [{ value: '' }, { value: 'Yes'}] }, { cells: [{ value: '' }, { value: 'No'}] }], selectedRange: 'A1'}]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Empty cell sorting issue in Spreadsheet->', (done: Function) => {
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_sorting-popup').querySelector('.e-item').click();
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[0].cells[0].value.toString()).toEqual('1');
                    expect(spreadsheet.sheets[0].rows[1].cells[0].value.toString()).toEqual('2');
                    expect(spreadsheet.sheets[0].rows[2].cells[0].value.toString()).toEqual('3');
                    expect(spreadsheet.sheets[0].rows[3].cells[0].value.toString()).toEqual('4');
                    expect(spreadsheet.sheets[0].rows[4].cells[0].value.toString()).toEqual('5');
                    done();
                }, 10);
            });
        });
        
        describe('EJ2-55988, SF-373280 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: () => {
                        helper.invoke('cellFormat', [{ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1']);
                    }
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Sorting does not work properly while using Column selection->', (done: Function) => {
                helper.click('#' + helper.id + '_sorting');
                helper.click('#' + helper.id + '_applyfilter');
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                helper.invoke('selectRange', ['A1:A200']);
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(1)');
                setTimeout(() => {
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                        expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Cricket Shoes');
                        expect(helper.invoke('getCell', [9, 0]).textContent).toBe('Sports Shoes');
                        expect(helper.invoke('getCell', [10, 0]).textContent).toBe('T-Shirts');
                        done();
                    });
                });
            });
            it('Empty cell updated at the last while performing sort action ->', (done: Function) => {
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                expect(sheet.rows[5].cells[0].value).toBe('Loafers');
                expect(helper.invoke('getCell', [5, 0]).textContent).toBe('Loafers');
                setCell(5, 0, sheet, null);
                expect(sheet.rows[5].cells[0]).toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(2)');
                setTimeout(() => {
                    setTimeout(() => {
                        expect(sheet.rows[5].cells[0].value).toBe('Running Shoes');
                        expect(helper.invoke('getCell', [5, 0]).textContent).toBe('Running Shoes');
                        expect(sheet.rows[10].cells[0]).toBeNull();
                        expect(helper.invoke('getCell', [10, 0]).textContent).toBe('');
                        done();
                    });
                });
            });
            it('Formula get #REF error on sorting', (done: Function) => {
                helper.invoke('selectRange', ['D1']);
                helper.invoke('updateCell', [{ formula: '=SUM(D2:D11)' }, 'D12']);
                const sheet: any = helper.invoke('getActiveSheet');
                expect(sheet.rows[11].cells[3].value).toBe(277);
                expect(sheet.rows[1].cells[3].value).toBe(50);
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(2)');
                setTimeout(() => {
                    setTimeout(() => {
                        expect(sheet.rows[1].cells[3].formula).toBe('=SUM(D1:D1)');
                        expect(sheet.rows[1].cells[3].value).toBe(0);
                        expect(sheet.rows[11].cells[3].formula).toBeUndefined();
                        expect(sheet.rows[11].cells[3].value).toBe(10);
                        done();
                    });
                });
            });
        });

        describe('EJ2-56206->', () => {
            beforeAll((done: Function) => {
                dataSource();
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: virtualData.slice(0, 10000) }] }],
                    beforeDataBound: () => {
                        helper.invoke('cellFormat', [{ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1']);
                    }
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Performance issue on sorting 10k data', (done: Function) => {
                const startTime: number = performance.now();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(1)');
                setTimeout(() => {
                    setTimeout(() => {
                        expect(performance.now() - startTime).toBeLessThan(7000);
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('ANATR');
                        expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe('ANATR');
                        done();
                    });
                });
            });

            it('Performance issue on undo for sorting', (done: Function) => {
                const startTime: number = performance.now();
                helper.click('#' + helper.id + '_undo');
                setTimeout(() => {
                    expect(performance.now() - startTime).toBeLessThan(5500);
                    expect(helper.invoke('getCell', [1, 0]).textContent).toBe(virtualData[0]['Name']);
                    expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(virtualData[0]['Name']);
                    done();
                });
            });

            it('Performance issue on redo for sorting', (done: Function) => {
                const startTime: number = performance.now();
                helper.click('#' + helper.id + '_redo');
                setTimeout(() => {
                    setTimeout(() => {
                        expect(performance.now() - startTime).toBeLessThan(6000);
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('ANATR');
                        expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe('ANATR');
                        done();
                    });
                });
            });
        });
    });

    describe('EJ2-60510->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Choosing of column in list does not work properly', (done: Function) => {
            helper.getElement('#' + helper.id + '_sorting').click();
            helper.getElement('#' + helper.id + '_sorting-popup').children[0].children[2].click();
            setTimeout(() => {
                helper.getElement('.e-sort-addbtn').click();
                let input: HTMLElement = document.querySelector('.e-ul').children[1].querySelector('.e-sort-field-ddl');
                helper.triggerMouseAction(
                    'mousedown', { x: input.getBoundingClientRect().left + 1, y: input.getBoundingClientRect().top + 1 }, input);
                helper.triggerMouseAction(
                    'mouseup', { x: input.getBoundingClientRect().left + 1, y: input.getBoundingClientRect().top + 1 }, input);
                setTimeout(() => {
                    let listValue = document.querySelector('.e-dropdownbase .e-ul').children[2] as HTMLElement;
                    listValue.click();
                    let textValue = document.querySelector('.e-ul').children[1].querySelector('.e-sort-field-ddl') as HTMLElement;
                    expect(textValue.children[0].textContent).toBe('Time');
                    done();
                });
            });
        });
    });

    describe('EJ2-62223->', () => {
        beforeEach((done: Function) => {
            dataSource();
            helper.initializeSpreadsheet({ sheets: [{ selectedRange: 'A1' }],
                created: () => {
                    const spreadsheet: Spreadsheet = helper.getInstance()
                    spreadsheet.updateCell({ value: 'Value', style: { fontWeight: 'bold' } }, 'A1');
                    spreadsheet.updateCell({ value: 'Desc', style: { fontWeight: 'bold' } }, 'B1');
                    spreadsheet.updateCell({ value: 'abc' }, 'A2');
                    spreadsheet.updateCell({ value: 'xyz' }, 'A3');
                    spreadsheet.updateCell({ value: 'Bundle a' }, 'B2');
                    spreadsheet.updateCell({ value: 'Bundle bbbb', wrap: true }, 'B3');
                }
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Exception while applying sort descending when there is no CF in sheet', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const activeCell: HTMLElement = helper.getElementFromSpreadsheet('.e-active-cell');
            expect(activeCell.style.height).toBe('20px');
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(2)');
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('xyz');
                expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe('xyz');
                expect(activeCell.style.height).toBe('20px');
                done();
            }, 20);
        });
    });
});