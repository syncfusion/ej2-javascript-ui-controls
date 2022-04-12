import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData, filterData } from '../util/datasource.spec';
import { Spreadsheet, filterByCellValue } from '../../../src/index';
import { classList } from "@syncfusion/ej2-base";

describe('Filter ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    
    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Filter', (done: Function) => {
            helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).children[0].classList).toContain('e-filter-btn');
                expect(helper.invoke('getCell', [0, 4]).children[0].children[0].classList).toContain('e-filtered');
                done();
            });
        });

        it('Clear Filter', (done: Function) => {
            helper.invoke('clearFilter', ['E']);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 4]).children[0].children[0].classList).not.toContain('e-filtered');
                done();
            });
        });

        it('Remove Filter', (done: Function) => {
            helper.invoke('applyFilter', [null, 'A1:A1']);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 1]).children[0]).toBeUndefined();
                done();
            });
        });
    });
    describe('UI interaction checking ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply and remove filter using toolbar', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            const firstCell: HTMLElement = helper.invoke('getCell', [0, 0]);
            const lastCell: HTMLElement = helper.invoke('getCell', [0, spreadsheet.sheets[0].usedRange.colIndex]);
            expect(firstCell.querySelector('.e-filter-icon')).toBeNull();
            expect(lastCell.querySelector('.e-filter-icon')).toBeNull();
            helper.getElement('#' + helper.id + '_sorting').click();
            helper.getElement('#' + helper.id + '_applyfilter').click();
            expect(firstCell.querySelector('.e-filter-icon')).not.toBeNull();
            expect(lastCell.querySelector('.e-filter-icon')).not.toBeNull();
            expect(spreadsheet.filterModule.filterRange.size).toBe(1);
            expect(spreadsheet.filterModule.filterRange.get(0).range).toEqual([0, 0, 10, 7]);
            expect(spreadsheet.filterModule.filterRange.get(0).useFilterRange).toBeFalsy();
            expect(spreadsheet.filterModule.filterCollection.size).toBe(1);
            expect(spreadsheet.filterModule.filterCollection.get(0)).toEqual([]);
            helper.getElement('#' + helper.id + '_sorting').click();
            helper.getElement('#' + helper.id + '_applyfilter').click();
            expect(firstCell.querySelector('.e-filter-icon')).toBeNull();
            expect(lastCell.querySelector('.e-filter-icon')).toBeNull();
            expect(spreadsheet.filterModule.filterRange.size).toBe(0);
            expect(spreadsheet.filterModule.filterCollection.size).toBe(0);
            helper.getElement('#' + helper.id + '_sorting').click();
            helper.getElement('#' + helper.id + '_applyfilter').click();
            done();
        });
        it('Filter popup open close using key action', (done: Function) => {
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
            setTimeout(() => {
                let filterPopup: HTMLElement = helper.getElement().lastElementChild;
                expect(filterPopup.classList.contains('e-filter-popup')).toBeTruthy();
                expect(parseInt(filterPopup.style.left, 10)).toBeGreaterThan(0); // Left collision check
                helper.triggerKeyNativeEvent(38, false, false, null, 'keydown', true);
                expect(helper.getElement().querySelector('.e-filter-popup')).toBeNull();
                done();
            });
        });
    });
    describe('CR-Issues ->', () => {
        describe('I289560, FB22087, FB24231 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'A1:F1');
                    }
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Facing issues on spreadsheet - Filter applied after the specified range using applyFilter method', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.applyFilter(null, 'A1:F11');
                expect(!!helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                expect(!!helper.invoke('getCell', [0, 1]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                expect(!!helper.invoke('getCell', [0, 5]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                expect(!!helper.invoke('getCell', [0, 6]).querySelector('.e-filter-iconbtn')).toBeFalsy();
                done();
            });

            it('Filter icon disappears after refresh', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.applyFilter([{ field: 'H', predicate: 'or', operator: 'contains', value: '10' }]);
                setTimeout(() => {
                    spreadsheet.refresh();
                    setTimeout(() => {
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                            expect(helper.invoke('getCell', [0, 7]).querySelector('.e-filtered')).not.toBeNull();
                            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('10');
                            done();
                        });
                    });
                });
            });

            // it('Filter with unchecked values after open from json', (done: Function) => {
            //     const spreadsheet: Spreadsheet = helper.getInstance();
            //     spreadsheet.applyFilter();
            //     spreadsheet.applyFilter([{ field: 'A', predicate: 'and', operator: 'notequal', value: 'Casual Shoes' }, { field: 'A', predicate: 'and', operator: 'notequal', value: 'Sneakers' }]);
            //     setTimeout(() => {
            //         spreadsheet.saveAsJson().then((json: any) => {
            //             spreadsheet.openFromJson({ file: json.jsonObject });
            //             setTimeout(() => {
            //                 expect(spreadsheet.filterCollection[0].predicates.toString()).toBe('and,and');
            //                 expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(2)') as any).ariaRowIndex).toBe('3');
            //                 expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Sports Shoes');
            //                 expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(6) td').textContent).toBe('Running Shoes');
            //                 done();
            //             });
            //         });
            //     });
            // });

            // it('Cleared filter is not removed after open from json', (done: Function) => {
            //     const spreadsheet: Spreadsheet = helper.getInstance();
            //     helper.triggerKeyEvent('keydown', 76, null, true, true);
            //     expect(spreadsheet.filterCollection.length).toBe(0);
            //     spreadsheet.saveAsJson().then((json: any) => {
            //         spreadsheet.openFromJson({ file: json.jsonObject });
            //         setTimeout(() => {
            //             expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeNull();
            //             expect(helper.invoke('getCell', [0, 7]).querySelector('.e-filtered')).toBeNull();
            //             expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(2)') as any).ariaRowIndex).toBe('2');
            //             done();
            //         });
            //     });
            // });
        });

        // describe('I307401 -> Fiter UI updating ->', () => {
        //     beforeAll((done: Function) => {
        //         helper.initializeSpreadsheet({
        //             sheets: [{ ranges: [{ dataSource: defaultData }] }, {}, { ranges: [{ dataSource: defaultData }] }],
        //             created: (): void => {
        //                 const spreadsheet: any = helper.getInstance();
        //                 spreadsheet.applyFilter([{ field: "F", operator: "contains", value: 200 }]);
        //                 setTimeout(() => {
        //                     spreadsheet.filterModule.selectSortItemHandler(createElement('div', { className: 'e-filter-sortdesc' }));
        //                 });
        //             }
        //         }, done);
        //     });
        //     afterAll(() => {
        //         helper.invoke('destroy');
        //     });

        //     it('Insert sheet', (done: Function) => {
        //         helper.invoke('insertSheet', [0]);
        //         setTimeout(() => {
        //             helper.invoke('goTo', ['Sheet1!A1']);
        //             setTimeout(() => {
        //                 let td: Element = helper.invoke('getCell', [0, 0]);
        //                 expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                 expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Running Shoes');
        //                 expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('8');
        //                 td = helper.invoke('getCell', [0, 5]);
        //                 expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                 expect(helper.getInstance().filterCollection[0].sheetIndex).toBe(1);
        //                 done();
        //             });
        //         });
        //     });

        //     it('Delete sheet', (done: Function) => {
        //         const spreadsheet: any = helper.getInstance();
        //         spreadsheet.goTo('Sheet3!F2');
        //         setTimeout(() => {
        //             spreadsheet.applyFilter([{ field: "D", operator: "contains", value: 20 }]);
        //             setTimeout(() => {
        //                 spreadsheet.filterModule.selectSortItemHandler(createElement('div', { className: 'e-filter-sortdesc' }));
        //                 setTimeout(() => {
        //                     helper.invoke('goTo', ['Sheet4!A1']);
        //                     setTimeout(() => {
        //                         helper.getInstance().notify('removeSheetTab', {});
        //                         setTimeout(() => {
        //                             let td: Element = helper.invoke('getCell', [0, 0]);
        //                             expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                             expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Running Shoes');
        //                             expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('8');
        //                             td = helper.invoke('getCell', [0, 5]);
        //                             expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                             expect(helper.getInstance().filterCollection[0].sheetIndex).toBe(0);

        //                             helper.invoke('goTo', ['Sheet3!A1']);
        //                             setTimeout(() => {
        //                                 td = helper.invoke('getCell', [0, 5]);
        //                                 expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                                 expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Sports Shoes');
        //                                 expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('4');
        //                                 td = helper.invoke('getCell', [0, 3]);
        //                                 expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                                 expect(helper.getInstance().filterCollection[1].sheetIndex).toBe(2);
        //                                 done();
        //                             }, 30);
        //                         }, 20);
        //                     });
        //                 });
        //             });
        //         });
        //     });

        //     it('Insert Column', (done: Function) => {
        //         helper.invoke('insertColumn', [0, 1]);
        //         setTimeout(() => {
        //             let td: Element = helper.invoke('getCell', [0, 7]);
        //             expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //             expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td:nth-child(3)').textContent).toBe('Sports Shoes');
        //             expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('4');
        //             td = helper.invoke('getCell', [0, 5]);
        //             expect(td.children[0].children[0].classList).toContain('e-filtered');
        //             expect(helper.getInstance().filterCollection[1].filterRange).toBe('C1:J11');
        //             helper.invoke('insertColumn', [3, 4]);
        //             setTimeout(() => {
        //                 td = helper.invoke('getCell', [0, 9]);
        //                 expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                 td = helper.invoke('getCell', [0, 7]);
        //                 expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                 expect(helper.getInstance().filterCollection[1].filterRange).toBe('C1:L11');
        //                 done();
        //             });
        //         });
        //     });

        //     it('Delete Column', (done: Function) => {
        //         helper.invoke('delete', [0, 1, 'Column']);
        //         setTimeout(() => {
        //             let td: Element = helper.invoke('getCell', [0, 7]);
        //             expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //             expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Sports Shoes');
        //             expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('4');
        //             td = helper.invoke('getCell', [0, 5]);
        //             expect(td.children[0].children[0].classList).toContain('e-filtered');
        //             expect(helper.getInstance().filterCollection[1].filterRange).toBe('A1:J11');
        //             helper.invoke('delete', [1, 3, 'Column']);
        //             setTimeout(() => {
        //                 td = helper.invoke('getCell', [0, 4]);
        //                 expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                 td = helper.invoke('getCell', [0, 2]);
        //                 expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                 expect(helper.getInstance().filterCollection[1].filterRange).toBe('A1:G11');
        //                 helper.invoke('delete', [2, 2, 'Column']);
        //                 setTimeout(() => {
        //                     expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Casual Shoes');
        //                     expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('3');
        //                     expect(helper.getInstance().filterCollection[1].column.length).toBe(0);
        //                     done();
        //                 });
        //             });
        //         });
        //     });

        // });

        describe('I328009 ->', () => {
            let filterArgs: any;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    actionComplete: (args: any): void => {
                        if (args.action === 'filter') {
                            filterArgs = args.eventArgs;
                        }
                    }
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Filter event argument checking', (done: Function) => {
                helper.invoke('selectRange', ['E2']);
                helper.getInstance().filterModule.filterByCellValueHandler();
                setTimeout(() => {
                    expect(JSON.stringify(filterArgs.predicates)).toBe(JSON.stringify(helper.getInstance().filterModule.filterCollection.get(0)));
                    expect(filterArgs.range).toBe('A1:H11');
                    done();
                });
            });
        });
        describe('SF-360112 ->', () => {
            let filterArgs: any;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: filterData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Script error while performing undo continuously after applying filters', (done: Function) => {
                const id: string = '#' + helper.id;
                helper.getElement(`${id}_sorting`).click();
                helper.getElement(`${id}_applyfilter`).click();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                helper.invoke('selectRange', ['G1']);
                helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
                setTimeout(() => {
                    setTimeout(() => {
                        const cbox: HTMLElement = helper.getElement('.e-checkboxlist').lastElementChild.querySelector('.e-checkbox-wrapper');
                        (cbox.querySelector('.e-chk-hidden') as HTMLInputElement).checked = false;
                        classList(cbox.querySelector('.e-frame') as HTMLInputElement, ['e-uncheck'], ['e-check']);
                        helper.getElement('.e-filter-popup .e-btn.e-primary').click();
                        setTimeout(() => {
                            helper.triggerKeyNativeEvent(90, true);
                            helper.triggerKeyNativeEvent(90);
                            setTimeout(() => {
                                helper.invoke('endEdit');
                                helper.triggerKeyNativeEvent(90, true);
                                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeNull();
                                done();
                            });
                        });
                    });
                });
            });
        });

        describe('SF-361036, SF-361123 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });

            it('Paste is not working on filtered rows', (done: Function) => {
                helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }, { field: 'E', predicate: 'or', operator: 'equal', value: '20' }], 'A1:H1']);
                setTimeout(() => {
                    helper.invoke('copy', ['A9']).then(() => {
                        helper.invoke('paste', ['A5']);
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Loafers');
                            expect(helper.invoke('getCell', [6, 0]).textContent).toBe('Sneakers');
                            done();
                        });
                    });
                });
            });
        });
        describe('SF-364894 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ ranges: [{ dataSource: defaultData }], rowCount: 11 }], scrollSettings: { isFinite: true },
                    created: (): void => {
                        helper.invoke('merge', ['A2:G2']);
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Filtering is not proper in finite mode with less row count and merged cell', (done: Function) => {
                helper.invoke('applyFilter', [[{ field: 'F', predicate: 'or', operator: 'equal', value: '1210' }], 'A1:H11']);
                setTimeout(() => {
                    expect(helper.invoke('getContentTable').rows.length).toBe(2);
                    expect(helper.getInstance().viewport.bottomIndex).toBe(9);
                    done();
                });
            });
        });
        describe('SF-367021 ->', () => {
            let spreadsheet: any;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'B4:B4' }],
                    created: (): void => {
                        spreadsheet = helper.getInstance()
                        for (let i: number = 1; i < 11; i++) {
                            spreadsheet.updateCell({ format: 'dd/MM/yyyy' }, 'B' + (i + 1));
                        }
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Filter by date cell value not working', (done: Function) => {
                spreadsheet.notify(filterByCellValue, null);
                setTimeout(() => {
                    const predicates: any[] = spreadsheet.filterModule.filterCollection.get(0);
                    expect(predicates.length).toBe(1);
                    expect(predicates[0].field).toBe('B');
                    expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[1].isFiltered).toBeTruthy();
                    expect(helper.invoke('getContentTable').rows[1].cells[1].textContent).toBe('27/07/2014');
                    done();
                });
            });
        });
        describe('SF-368464 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }], frozenRows: 1, frozenColumns: 1, paneTopLeftCell: 'A1002' }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Filtering issue with freeze pane when the sheet is scrolled', (done: Function) => {
                const tableRowCount: number = helper.invoke('getContentTable').rows.length;
                helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
                setTimeout(() => {
                    expect(helper.invoke('getContentTable').rows.length).toBe(tableRowCount);
                    done();
                });
            });
        });
        describe('SF-369477 ->', () => {
            let spreadsheet: any;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'D7:D9', paneTopLeftCell: 'A7', frozenRows: 1 }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Cells jumbled up while filtering with freeze pane', (done: Function) => {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].topLeftCell).toBe('A1');
                expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('A7');
                helper.triggerKeyNativeEvent(46);
                helper.invoke(
                    'applyFilter', [[{ field: 'D', matchCase: false, operator: 'notequal', predicate: 'and', value: null,
                    ignoreAccent: false }, { field: 'D', matchCase: false, operator: 'notequal', predicate: 'and', value: undefined }],
                    'A1:H11'])
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].topLeftCell).toBe('A1');
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('A10');
                    done();
                });
            });
            it('Apply filter in multiple column and clear filter using context menu', (done: Function) => {
                helper.invoke('selectRange', ['E2']);
                let predicates: any[] = [].slice.call(spreadsheet.filterModule.filterCollection.get(0));
                predicates.push(
                    { value: 10, field: 'E', predicate: 'and', operator: 'notequal', type: 'number', matchCase: false,
                    ignoreAccent: false });
                helper.invoke('applyFilter', [predicates, 'A1:H11']);
                setTimeout(() => {
                    predicates = spreadsheet.filterModule.filterCollection.get(0);
                    expect(predicates.length).toBe(3);
                    expect(predicates[2].field).toBe('E');
                    expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[5].isFiltered).toBeTruthy();
                    expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-icon').classList.contains('e-filtered')).toBeTruthy();
                    helper.setAnimationToNone('#spreadsheet_contextmenu');
                    const checkFn: Function = (): void => {
                        expect(helper.getElement('#' + helper.id + '_cmenu_clearfilter').classList.contains('e-disabled')).toBeFalsy();
                    };
                    helper.openAndClickCMenuItem(4, 1, [6, 1], false, false, checkFn);
                    setTimeout(() => {
                        expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(2);
                        expect(spreadsheet.sheets[0].rows[5].hidden).toBeFalsy();
                        expect(spreadsheet.sheets[0].rows[5].isFiltered).toBeFalsy();
                        expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-icon').classList.contains('e-filtered')).toBeFalsy();
                        done();
                    });
                });
            });
            it('Clear filter in final filtered column in a range using context menu', (done: Function) => {
                helper.invoke('selectRange', ['D2']);
                expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-icon').classList.contains('e-filtered')).toBeTruthy();
                helper.openAndClickCMenuItem(3, 1, [6, 1]);
                setTimeout(() => {
                    expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(0);
                    expect(spreadsheet.sheets[0].rows[6].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[6].isFiltered).toBeFalsy();
                    expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-icon').classList.contains('e-filtered')).toBeFalsy();
                    done();
                });
            });
        });
    });

    describe('Filter Icon Missing In Duplicate Sheet ->', () => {

        describe('EJ2-55527 ->', () =>  {

            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
    
            afterAll(() => {
                helper.invoke('destroy');
            });
            
            it('Filter issue in duplicate sheet', (done: Function) => {

                helper.invoke('applyFilter', [[{ field: 'A', predicate: 'or', operator: 'equal', value: 'Casual Shoes' }], 'A1:H11']);
                helper.invoke('duplicateSheet', [0]);
                setTimeout(() => {
                    expect(helper.invoke("getCell",[0,0]).querySelector('span').classList).toContain('e-filtered');
                    expect(helper.getInstance().filterCollection[1].filterRange).toContain('A1:H11');
                    expect(JSON.stringify(helper.getInstance().filterModule.filterRange.get(1))).toBe('{"range":[0,0,10,7]}');
                    done();
                });
            });
        });  
    });
});