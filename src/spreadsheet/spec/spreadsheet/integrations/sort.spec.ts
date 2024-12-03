import { SpreadsheetModel, Spreadsheet } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, virtualData, dataSource } from '../util/datasource.spec';
import { CellModel, SortEventArgs, SortDescriptor, getCell, DialogBeforeOpenEventArgs, SheetModel, setCell, BeforeSortEventArgs } from '../../../src/index';

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
        it('Sort with custom time format testing', (done: Function) => {
            helper.invoke('numberFormat', ['h:mm AM/PM', 'I1:I5']);
            const sheet: any = helper.getInstance().getActiveSheet();
            helper.invoke('updateCell', [{ value: '11:34:32 AM' }, 'I2']);
            expect(sheet.rows[1].cells[8].value).toEqual('0.4823148148148148');
            helper.invoke('updateCell', [{ value: '5:56:32 AM' }, 'I3']);
            expect(sheet.rows[2].cells[8].value).toEqual('0.2475925925925926');
            helper.invoke('updateCell', [{ value: '3:32:44 AM' }, 'I4']);
            expect(sheet.rows[3].cells[8].value).toEqual('0.1477314814814815');
            helper.invoke('updateCell', [{ value: '12:01:44 AM' }, 'I5']);
            expect(sheet.rows[4].cells[8].value).toEqual('0.0012037037037037038');
            helper.invoke('selectRange', ['I1:I100']);
            helper.click(`#${helper.id}_sorting`);
            helper.click(`#${helper.id}_sorting-popup .e-item`);
            setTimeout((): void => {
                setTimeout((): void => {
                    expect(sheet.rows[1].cells[8].value).toEqual(0.0012037037037037038);
                    expect(sheet.rows[2].cells[8].value).toEqual(0.1477314814814815);
                    expect(sheet.rows[3].cells[8].value).toEqual(0.2475925925925926);
                    expect(sheet.rows[4].cells[8].value).toEqual(0.4823148148148148);
                    done();
                });
            });
        });
        it('Sorting on column with non auto-detected formatted numbers testing ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: any = spreadsheet.getActiveSheet();
            setCell(99, 4, sheet, { value: '$30.75' });
            expect(sheet.rows[99].cells[4].value).toBe('$30.75');
            spreadsheet.setSheetPropertyOnMute(sheet, 'usedRange', { rowIndex: 99, colIndex: sheet.usedRange.colIndex });
            helper.invoke('selectRange', ['E1:E100']);
            spreadsheet.sort().then(() => {
                expect(sheet.rows[0].cells[4].value).toBe('Price');
                expect(sheet.rows[1].cells[4].value).toBe(10);
                expect(sheet.rows[10].cells[4].value).toBe(30);
                expect(sheet.rows[11].cells[4].value).toBe(30.75);
                expect(sheet.rows[99].cells[4]).toBeNull();
                done()
            });
        });
    });

    describe('Custom sort dialog', () => {
        beforeAll((done: Function) => {
            model = { sheets: [{ ranges: [{ dataSource: defaultData }] }],
            created: (): void => {
                    helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                }
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Custom sort dialog error for selecting same column in dropdown', (done: Function) => {
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(3)');
            setTimeout(() => {
                helper.setAnimationToNone('.e-customsort-dlg.e-dialog');
                helper.click('.e-customsort-dlg .e-sort-addbtn');
                helper.click('.e-customsort-dlg .e-primary');
                setTimeout(() => {
                    expect(helper.getElement('.e-customsort-dlg .e-sort-error').textContent).toBe('All sort criteria must have a column specified. Check the selected sort criteria and try again.');
                    done();
                }, 20);
            });
        });
        it('Custom sort dialog error for not selecting in dropdown', (done: Function) => {
            helper.setAnimationToNone('.e-customsort-dlg.e-dialog');
            let input: HTMLElement = document.querySelector('.e-ul').children[1].querySelector('.e-sort-field-ddl');
            helper.triggerMouseAction('mousedown', { x: input.getBoundingClientRect().left + 1, y: input.getBoundingClientRect().top + 1 }, input);
            helper.triggerMouseAction('mouseup', { x: input.getBoundingClientRect().left + 1, y: input.getBoundingClientRect().top + 1 }, input);
            setTimeout(() => {
                let listValue = document.querySelector('.e-dropdownbase .e-ul').children[0] as HTMLElement;
                listValue.click();
                helper.click('.e-customsort-dlg .e-primary');
                setTimeout(() => {
                    expect(helper.getElement('.e-customsort-dlg .e-sort-error').textContent).toBe('  is being sorted by values more than once. Delete the duplicate sort criteria and try again.');
                    done();
                }, 20);
            });
        });
        it('Custom sort with uncheck headerbox', (done: Function) => {
            helper.click('.e-customsort-dlg .e-sort-delete');
            setTimeout(() => {
                helper.setAnimationToNone('.e-customsort-dlg.e-dialog');
                helper.click('.e-customsort-dlg .e-dlg-content .e-sort-header .e-sort-headercheckbox');
                helper.click('.e-customsort-dlg .e-primary');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Item Name');
                    done();
                }, 20);
            });
        });
        it('Add custom field in custom sort with uncheck header box', (done: Function) => {
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(3)');
            setTimeout(() => {
                helper.setAnimationToNone('.e-customsort-dlg.e-dialog');
                helper.click('.e-customsort-dlg .e-dlg-content .e-sort-header .e-sort-headercheckbox');
                setTimeout(() => {
                    helper.click('.e-customsort-dlg .e-sort-addbtn');
                    setTimeout(() => {
                        helper.click('.e-customsort-dlg .e-sort-delete');
                        done();
                    });
                });
            });
        });
        it('Custom sort with check headerbox', (done: Function) => {
            helper.click('.e-customsort-dlg .e-dlg-content .e-sort-header .e-sort-headercheckbox');
            let input: HTMLElement = document.querySelector('.e-ul').children[0].querySelector('.e-sort-field-ddl');
            helper.triggerMouseAction('mousedown', { x: input.getBoundingClientRect().left + 1, y: input.getBoundingClientRect().top + 1 }, input);
            helper.triggerMouseAction('mouseup', { x: input.getBoundingClientRect().left + 1, y: input.getBoundingClientRect().top + 1 }, input);
            setTimeout(() => {
                let listValue = document.querySelector('.e-dropdownbase .e-ul').children[0] as HTMLElement;
                listValue.click();
                helper.click('.e-customsort-dlg .e-primary');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Item Name');
                    done();
                }, 20);
            });
        });
        it('Apply custom fort with text formatting in header and clicking sorting radio button->', (done: Function) => {
            helper.invoke('updateCell', [{ value: '' }, 'H1']);
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H2:H11' }]);
            helper.invoke('selectRange', ['A1']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Text').click();
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(3)');
            setTimeout(() => {
                helper.setAnimationToNone('.e-customsort-dlg.e-dialog');
                helper.click('.e-customsort-dlg .e-sort-radiodesc');
                helper.click('.e-customsort-dlg .e-sort-radioasc');
                helper.click('.e-customsort-dlg .e-primary');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Cricket Shoes');
                    done();
                }, 20);
            });
        });
        it('Apply custom sort for empty cells->', (done: Function) => {
            helper.invoke('selectRange', ['M1']);
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(3)');
            setTimeout(() => {
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dialog .e-primary');
                done();
            }, 10);
        });
        it('Cancel opening custom sort dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
            args.cancel = true;
            };
            helper.invoke('selectRange', ['A1']);
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(3)');
            setTimeout(() => {
                var dialog = helper.getElement('.e-customsort-dlg.e-dialog');
                expect(!!dialog).toBeTruthy();    
                done();
            });
        });
        it('Cancel empty cells dialog opening->', (done: Function) => {
            helper.invoke('selectRange', ['M1']);
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(1)');
            setTimeout(() => {
                var dialog = helper.getElement('.e-customsort-dlg.e-dialog');
                expect(!!dialog).toBeTruthy();    
                done();
            }, 10);
        });
    });

    describe('Sort method testing', () => {
        beforeAll((done: Function) => {
            model = { sheets: [{ ranges: [{ dataSource: defaultData }] }],
            created: (): void => {
                    helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                }
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Sort method testing ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.sort({ sortDescriptors: [{ order: 'Ascending' }], containsHeader: true, caseSensitive: true }, 'A1:H11' )
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Cricket Shoes');
                expect(helper.invoke('getCell', [10, 0]).textContent).toBe('T-Shirts');
                done()
            }, 10);
        });
        it('Apply filter and sort ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.applyFilter([{ 'value': 10, 'field': 'E', 'predicate': 'and', 'operator': 'equal', 'type': 'number', 'matchCase': true, 'ignoreAccent': false }], 'A1:H1');
            setTimeout(() => {
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(1)');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                    expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Flip- Flops & Slippers');
                    expect(helper.invoke('getCell', [6, 0]).textContent).toBe('Running Shoes');
                    expect(helper.invoke('getCell', [10, 0]).textContent).toBe('T-Shirts');
                    done()
                }, 10);
            });
        });
        it('Cancelling sort', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.beforeSort = (args: BeforeSortEventArgs): void => {
                args.cancel = true;
            };
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(2)');
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Flip- Flops & Slippers');
                expect(helper.invoke('getCell', [6, 0]).textContent).toBe('Running Shoes');
                expect(helper.invoke('getCell', [10, 0]).textContent).toBe('T-Shirts');
                done()
            }, 10);
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
                expect(helper.invoke('getCell', [1, 1]).textContent).toEqual('           02 ');
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
                                expect(helper.invoke('getCell', [3, 1]).textContent).toEqual('           04 ');
                                expect(inst.sheets[0].rows[4].cells[1].value.toString()).toEqual('5');
                                expect(helper.invoke('getCell', [4, 1]).textContent).toEqual('           05 ');
                                expect(inst.sheets[0].rows[5].cells[1].value.toString()).toEqual('6');
                                expect(helper.invoke('getCell', [5, 1]).textContent).toEqual('           06 ');
                                expect(inst.sheets[0].rows[6].cells[1].value.toString()).toEqual('7');
                                expect(helper.invoke('getCell', [6, 1]).textContent).toEqual('           07 ');
                                expect(inst.sheets[0].rows[7].cells[1].value.toString()).toEqual('11');
                                expect(helper.invoke('getCell', [7, 1]).textContent).toEqual('           11 ');
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
                            expect(helper.invoke('getCell', [1, 3]).textContent).toEqual('           02 ');
                            expect(inst.sheets[0].rows[7].cells[3].value.toString()).toEqual('11');
                            expect(helper.invoke('getCell', [7, 3]).textContent).toEqual('           11 ');
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
                            expect(helper.invoke('getCell', [1, 3]).textContent).toEqual(' Amount ');
                            expect(inst.sheets[0].rows[8].cells[3].value.toString()).toEqual('11');
                            expect(helper.invoke('getCell', [8, 3]).textContent).toEqual('           11 ');
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
                    showAggregate: false,
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
                expect(helper.invoke('getCell', [2, 2]).textContent).toBe('5:56:32 AM');
                expect(helper.invoke('getCell', [3, 2]).textContent).toBe('3:32:44 AM');
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
                    }, 500);
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
                        //expect(performance.now() - startTime).toBeLessThan(7000);
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
        describe('EJ2-870477 - Checking Filter Indication Icon for Sorting in the Filter Header->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Apply filter and sort ascending using public sort method', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.applyFilter();
                spreadsheet.sort({ sortDescriptors: [{ order: 'Ascending', field: 'B' }] });
                setTimeout(() => {
                    setTimeout(() => {
                        let td: Element = helper.invoke('getCell', [0, 1]);
                        expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                        done();
                    });
                });
            });
            it('Undo & redo -> Using filter with public method sort ascending->', (done: Function) => {
                let td: Element = helper.invoke('getCell', [0, 1]);
                expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(td.children[0].children[0].classList).toContain('e-filter-icon');
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                        done();
                    });
                });
            });
            it('Filter with sort descending using public sort method', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.sort({ sortDescriptors: [{ order: 'Descending', field: 'C' }] });
                setTimeout(() => {
                    setTimeout(() => {
                        let td: Element = helper.invoke('getCell', [0, 2]);
                        expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                        done();
                    });
                });
            });
            it('Undo & redo -> Using filter with public method sort descending->', (done: Function) => {
                let td: Element = helper.invoke('getCell', [0, 2]);
                expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(td.children[0].children[0].classList).toContain('e-filter-icon');
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                        done();
                    });
                });
            });
            it('Apply filter and sort ascending using ribbon items ->', (done: Function) => {
                helper.invoke('selectRange', ['D1']);
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(1)');
                setTimeout(() => {
                    let td: Element = helper.invoke('getCell', [0, 3]);
                    expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                    done();
                }, 10);
            });
            it('Undo & redo -> Using filter with ribbon items sort ascending->', (done: Function) => {
                let td: Element = helper.invoke('getCell', [0, 3]);
                expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(td.children[0].children[0].classList).toContain('e-filter-icon');
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                        done();
                    });
                });
            });
            it('Filter with sort descending using ribbon items ->', (done: Function) => {
                helper.invoke('selectRange', ['E1']);
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(2)');
                setTimeout(() => {
                    let td: Element = helper.invoke('getCell', [0, 4]);
                    expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                    done();
                }, 10);
            });
            it('Undo & redo -> Using filter with ribbon items sort descending->', (done: Function) => {
                let td: Element = helper.invoke('getCell', [0, 4]);
                expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(td.children[0].children[0].classList).toContain('e-filter-icon');
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                        done();
                    });
                });
            });
            it('Apply filter and sort ascending using context menu items ->', (done: Function) => {
                helper.invoke('selectRange', ['F6']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(0, 0, [7, 1], false, false);
                setTimeout(() => {
                    let td: Element = helper.invoke('getCell', [0, 5]);
                    expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                    done();
                }, 10);
            });
            it('Undo & redo -> Using filter with context menu sort ascending->', (done: Function) => {
                let td: Element = helper.invoke('getCell', [0, 5]);
                expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(td.children[0].children[0].classList).toContain('e-filter-icon');
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                        done();
                    });
                });
            });
            it('Filter with sort descending using context menu items ->', (done: Function) => {
                helper.invoke('selectRange', ['G2']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(0, 0, [7, 2], false, false);
                setTimeout(() => {
                    let td: Element = helper.invoke('getCell', [0, 6]);
                    expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                    done();
                }, 10);
            });
            it('Undo & redo -> Using filter with context menu sort descending->', (done: Function) => {
                let td: Element = helper.invoke('getCell', [0, 6]);
                expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(td.children[0].children[0].classList).toContain('e-filter-icon');
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
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
            //expect(activeCell.style.height).toBe('20px');
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(2)');
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('xyz');
                expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe('xyz');
                //expect(activeCell.style.height).toBe('20px');
                done();
            }, 20);
        });
    });
    
    describe('Filtering - Date formate', () => {
        const datasource: Function = (count: number) => {
            const randomYear: Function = (min: number, max: number) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            const randomPerfix: Function = (arr: string[]): string => {
                const randomIndex = Math.floor(Math.random() * arr.length);
                return arr[randomIndex];
            }
            const result: Object[] = [];
            for (let i = count; i > 0; i--) {
                result.push({
                    Year: `${randomPerfix(['01/01/', '02/01', '03/02/', '04/02/', '05/03/', '06/03/'])}${randomYear(1900, 2024)}`,
                });
            }
            return result;
        };
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: datasource(10),
                        startCell: 'A1'
                    }]
                }],
                allowFiltering: true
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking the date filter', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            helper.invoke('selectRange', ['A1']);
            helper.invoke('getCell', [0, 0]).focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout((): void => {
                expect((spreadsheet.element.querySelectorAll('.e-excelfilter .e-checkboxlist .e-treeview .e-list-item .e-list-text')[0] as HTMLSpanElement).innerText !== null).toBeTruthy();
                helper.click('#' + spreadsheet.element.id + ' .e-footer-content .e-flat');
                done();
            }, 500);
        });
    });

    describe('Filtering - searching the data', (): void => {
        const datasource: Function = (count: number): Object[] => {
            const result: Object[] = [];
            for (let i = count; i > 0; i--) {
                result.push({
                    TaskID: i
                });
            }
            return result;
        };
        beforeAll((done: Function): void => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: datasource(1100),
                        startCell: 'A1'
                    }]
                }],
                allowFiltering: true
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply and open filter', (done: Function): void => {
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            helper.invoke('selectRange', ['A1']);
            helper.invoke('getCell', [0, 0]).focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: (): void => {}, target: td, altKey: true, keyCode: 40 });
            setTimeout((): void => {
                expect(1).toBe(1);
                done();
            }, 300);
        });
        it('Search - 1', (done: Function): void => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const inputEle: HTMLInputElement = helper.getElement('.e-filter-popup .e-searchinput');
            inputEle.value = '1'
            spreadsheet.notify('refreshCheckbox', { event: { type: 'keyup', target: inputEle } });
            const cboxes: NodeListOf<Element> = spreadsheet.element.querySelectorAll('.e-excelfilter .e-checkboxlist .e-ftrchk');
            expect(cboxes.length).toBe(374);
            expect(cboxes[2].textContent).toBe('1');
            expect(cboxes[373].textContent).toBe('1100');
            done();
        });
        it('Search - 2', (done: Function): void => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const inputEle: HTMLInputElement = helper.getElement('.e-filter-popup .e-searchinput');
            inputEle.value = '11111'
            spreadsheet.notify('refreshCheckbox', { event: { type: 'keyup', target: inputEle } });
            expect((spreadsheet.element.querySelectorAll('.e-excelfilter .e-checkboxlist span')[2] as HTMLSpanElement).innerText).toBe('No Matches Found');
            helper.click('#' + spreadsheet.element.id + ' .e-footer-content .e-flat');
            done();
        });
    });

    describe('Filter - Date formate and unto, reto', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: [],
                        startCell: 'A1'
                    }]
                }],
                allowFiltering: true
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('unto-reto - adding data - 1', function (done: Function) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.sheets[0].rows[0] = {
                cells: [{
                    value: 'spreadsheet',
                    notes: 'spreadsheet',
                    isReadOnly: false,
                    isLocked: false
                }]
            }
            spreadsheet.insertImage([{ src: "", height: 100, width: 400 }]);
            helper.openAndClickCMenuItem(0, 0, [9]);
            setTimeout((): void => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion1';
                done();
            });
        });
        it('unto-reto - adding data - 2', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const td = helper.invoke('getCell', [0, 0]);
            const coords = td.getBoundingClientRect();
            (spreadsheet.sheets[0].rows[0].cells[0]).isReadOnly = true;
            helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, undefined, td);
            helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, undefined, td);
            setTimeout((): void => {
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion1');
                done();
            });
        });
        it('perform unto-reto', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                expect(1).toBe(1);
                done();
            });
        });
    });

    describe('Footer tab sheet function test ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        name: 'sheet1', ranges: [{ dataSource: defaultData }]
                    },
                    {
                        name: 'sheet2', ranges: [{ dataSource: defaultData }]
                    },
                    {
                        name: 'sheet3', ranges: [{ dataSource: defaultData }]
                    }
                ],
                allowFiltering: true
            };
            helper.initializeSpreadsheet(model, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Filter popup check in sheet1', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.activeSheetIndex).toBe(0);
            expect(spreadsheet.sheets[0].rows[5].cells[4].value.toString()).toBe('10');
            (spreadsheet.element.querySelector('.e-sort-filter-ddb') as HTMLButtonElement).click();
            (document.querySelector('.e-sort-filter-ddb.e-popup-open #' + spreadsheet.element.id + '_applyfilter') as HTMLLIElement).click();
            const filter: NodeListOf<Element> = (spreadsheet.element.querySelectorAll('.e-filter-icon'));
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 4]);
            helper.invoke('selectRange', ['E1']);
            helper.invoke('getCell', [0, 4]).focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                expect(filter.length > 0).toBe(true);
                done();
            });
        });
        it('Apply filter to sheet1', (done: Function) => {
            expect((document.querySelectorAll('.e-checkboxlist .e-ftrchk')[1] as HTMLElement).innerText).toBe('10');
            (document.querySelectorAll('.e-checkboxlist .e-ftrchk')[1] as HTMLElement).click();
            (document.querySelectorAll('.e-footer-content .e-btn')[0] as HTMLButtonElement).click();
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().filterModule.filterCollection.get(0))).toBe('[{"value":"10","type":"number","field":"E","ignoreAccent":false,"matchCase":false,"isFilterByMenu":true,"operator":"notequal","predicate":"and"}]');
                done();
            });
        });
        it('Move sheet2 and check filter in sheet2', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            (document.querySelectorAll('.e-sheet-tab .e-toolbar-item')[1] as HTMLElement).click();
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(1);
                done();
            });
        });
        it('Move sheet2 and check filter in sheet2-1', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(8)');
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].name.toString()).toBe('sheet2');
                    const filter: NodeListOf<Element> = (spreadsheet.element.querySelectorAll('.e-filter-icon'));
                    expect(filter.length === 0).toBe(true);
                    done();
                });
            });
        });
        it('Move to sheet1 and check filter', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            (document.querySelectorAll('.e-sheet-tab .e-toolbar-item')[1] as HTMLElement).click();
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(1);
                expect(spreadsheet.sheets[1].name.toString()).toBe('sheet1');
                expect(JSON.stringify(helper.getInstance().filterModule.filterCollection.get(1))).toBe('[{"value":"10","type":"number","field":"E","ignoreAccent":false,"matchCase":false,"isFilterByMenu":true,"operator":"notequal","predicate":"and"}]');
                done();
            }, 500);
        });
        it('Move to sheet1 and check filter-1', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const filter: NodeListOf<Element> = (spreadsheet.element.querySelectorAll('.e-filter-icon'));
            expect(filter.length > 0).toBe(true);
            helper.triggerMouseAction('mousedown', undefined, spreadsheet.element, filter[4] as HTMLSpanElement);
            setTimeout(() => {
                (document.querySelectorAll('.e-checkboxlist .e-ftrchk')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-footer-content .e-btn')[0] as HTMLButtonElement).click();
                setTimeout(() => {
                    expect(JSON.stringify(helper.getInstance().filterModule.filterCollection.get(1))).toBe('[]');
                    done();
                }, 500);
            }, 500);
        });
        it('Create a sheet2 duplicate and check filter', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            (document.querySelectorAll('.e-sheet-tab .e-toolbar-item')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(0);
                expect(spreadsheet.sheets[0].name.toString()).toBe('sheet2');
                done();
            });
        });
        it('Create a sheet2 duplicate and check filter-1', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.click('#' + helper.id + '_contextmenu li:nth-child(3)');
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(1);
                const filter: NodeListOf<Element> = (spreadsheet.element.querySelectorAll('.e-filter-icon'));
                expect(filter.length === 0).toBe(true);
                expect(spreadsheet.sheets[1].name.toString()).toBe('sheet2 (2)');
                done();
            });
        });
        it('Check sheet1 filter after duplicate sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            (document.querySelectorAll('.e-sheet-tab .e-toolbar-item')[2] as HTMLElement).click();
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(2);
                expect(spreadsheet.sheets[2].name.toString()).toBe('sheet1');
                done();
            });
        });
        it('Check sheet1 filter after duplicate sheet-1', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const filter: NodeListOf<Element> = (spreadsheet.element.querySelectorAll('.e-filter-icon'));
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 4]);
            helper.invoke('selectRange', ['E1']);
            helper.invoke('getCell', [0, 4]).focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                expect(filter.length > 0).toBe(true);
                (document.querySelectorAll('.e-footer-content .e-btn')[1] as HTMLButtonElement).click();
                done();
            });
        });
    });
});
