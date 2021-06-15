import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet } from "../../../src";
import { createElement } from "@syncfusion/ej2-base";

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
            expect(helper.invoke('getCell', [0, 0]).children[0].classList).toContain('e-filter-btn');
            setTimeout(() => {
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
    });
});