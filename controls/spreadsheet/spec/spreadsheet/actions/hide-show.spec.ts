import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { RowModel, onContentScroll, SheetModel } from '../../../src/index';
import { L10n } from '@syncfusion/ej2-base';

describe('Hide & Show ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('hideRow and hideColumn', (done: Function) => {
            helper.invoke('hideRow', [2, 3]);
            expect(helper.getInstance().sheets[0].rows[2].hidden).toBeTruthy();
            expect(helper.getInstance().sheets[0].rows[3].hidden).toBeTruthy();
            setTimeout(() => {
                let rows: any = helper.getElementFromSpreadsheet('.e-sheet-content').getElementsByClassName('e-row');
                expect(rows[1].getAttribute('aria-rowindex')).toBe('2');
                expect(rows[2].getAttribute('aria-rowindex')).toBe('5');

                rows = helper.getElementFromSpreadsheet('.e-row-header').getElementsByClassName('e-row');
                expect(rows[1].textContent).toContain('2');
                expect(rows[2].textContent).toContain('5');
                expect(rows[1].classList).toContain('e-hide-start');
                expect(rows[2].classList).toContain('e-hide-end');

                helper.invoke('hideRow', [2, 3, false]);
                expect(helper.getInstance().sheets[0].rows[2].hidden).toBeFalsy();
                expect(helper.getInstance().sheets[0].rows[3].hidden).toBeFalsy();
                setTimeout(() => {
                    let rows: any = helper.getElementFromSpreadsheet('.e-sheet-content').getElementsByClassName('e-row');
                    expect(rows[2].getAttribute('aria-rowindex')).toBe('3');
                    expect(rows[3].getAttribute('aria-rowindex')).toBe('4');

                    rows = helper.getElementFromSpreadsheet('.e-row-header').getElementsByClassName('e-row');
                    expect(rows[1].textContent).toContain('2');
                    expect(rows[2].textContent).toContain('3');
                    expect(rows[1].classList).not.toContain('e-hide-start');
                    expect(rows[2].classList).not.toContain('e-hide-end');

                    helper.invoke('hideColumn', [3, 4]);
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].columns[3].hidden).toBeTruthy();
                        expect(helper.getInstance().sheets[0].columns[4].hidden).toBeTruthy();
                        rows = helper.getElementFromSpreadsheet('.e-sheet-content').getElementsByClassName('e-row');
                        expect(rows[0].children[2].getAttribute('aria-colindex')).toBe('3');
                        expect(rows[0].children[3].getAttribute('aria-colindex')).toBe('6');
                        rows = helper.getElementFromSpreadsheet('.e-column-header').getElementsByClassName('e-header-row');
                        expect(rows[0].children[2].textContent).toContain('C');
                        expect(rows[0].children[3].textContent).toContain('F');
                        expect(rows[0].children[2].classList).toContain('e-hide-start');
                        expect(rows[0].children[3].classList).toContain('e-hide-end');

                        helper.invoke('hideColumn', [3, 4, false]);
                        setTimeout(() => {
                            expect(helper.getInstance().sheets[0].columns[3].hidden).toBeFalsy();
                            expect(helper.getInstance().sheets[0].columns[4].hidden).toBeFalsy();
                            rows = helper.getElementFromSpreadsheet('.e-sheet-content').getElementsByClassName('e-row');
                            expect(rows[0].children[2].getAttribute('aria-colindex')).toBe('3');
                            expect(rows[0].children[3].getAttribute('aria-colindex')).toBe('4');
                            rows = helper.getElementFromSpreadsheet('.e-column-header').getElementsByClassName('e-header-row');
                            expect(rows[0].children[2].textContent).toContain('C');
                            expect(rows[0].children[3].textContent).toContain('D');
                            expect(rows[0].children[2].classList).not.toContain('e-hide-start');
                            expect(rows[0].children[3].classList).not.toContain('e-hide-end');
                            done();
                        });
                    });
                });
            });
        });
        it('hideRow with headers hidden', (done: Function) => {
            const sheet: SheetModel = helper.invoke('getActiveSheet');
            helper.invoke('setSheetPropertyOnMute', [sheet, 'showHeaders', false]);
            helper.invoke('freezePanes', [3, 3]);
            setTimeout(() => {
                const freezeChildCount: number = helper.invoke('getSelectAllContent').firstElementChild.tBodies[0].childElementCount;
                const childCount: number = helper.invoke('getRowHeaderTable').tBodies[0].childElementCount;
                helper.invoke('hideRow', [2, 4]);
                expect(sheet.rows[2].hidden).toBeTruthy();
                expect(sheet.rows[3].hidden).toBeTruthy();
                expect(sheet.rows[4].hidden).toBeTruthy();
                expect(helper.invoke('getSelectAllContent').firstElementChild.tBodies[0].childElementCount).toBe(freezeChildCount - 1);
                expect(helper.invoke('getColHeaderTable').tBodies[0].childElementCount).toBe(freezeChildCount - 1);
                setTimeout(() => {
                    let tBody: HTMLTableSectionElement = helper.invoke('getRowHeaderTable').tBodies[0];
                    expect(tBody.childElementCount).toBe(childCount);
                    expect(tBody.rows[0].getAttribute('aria-rowindex')).toBe('6');
                    tBody = helper.invoke('getContentTable').tBodies[0];
                    expect(tBody.childElementCount).toBe(childCount);
                    expect(tBody.rows[0].getAttribute('aria-rowindex')).toBe('6');
                    helper.invoke('hideRow', [1, 4, false]);
                    expect(sheet.rows[1].hidden).toBeUndefined();
                    expect(sheet.rows[2].hidden).toBeFalsy();
                    expect(sheet.rows[3].hidden).toBeFalsy();
                    expect(sheet.rows[4].hidden).toBeFalsy();
                    expect(helper.invoke('getSelectAllContent').firstElementChild.tBodies[0].childElementCount).toBe(freezeChildCount);
                    expect(helper.invoke('getColHeaderTable').tBodies[0].childElementCount).toBe(freezeChildCount);
                    setTimeout(() => {
                        expect(tBody.childElementCount).toBe(childCount);
                        expect(tBody.rows[0].getAttribute('aria-rowindex')).toBe('4');
                        tBody = helper.invoke('getRowHeaderTable').tBodies[0];
                        expect(tBody.childElementCount).toBe(childCount);
                        expect(tBody.rows[0].getAttribute('aria-rowindex')).toBe('4');
                        done();
                    });
                });
            });
        });
    });

    describe('UI-Interaction with Protect Sheet and Localization->', () => {
        beforeAll((done: Function) => {
            L10n.load({
                'de-DE': {
                    'spreadsheet': {
                        'HideRows': 'Zeilen löschen',
                        'UnhideRows': 'Zeilen ausblenden',
                        'HideColumns': 'Spalten löschen',
                        'UnhideColumns': 'Spalten ausblenden',
                    }
                }
            });
            helper.initializeSpreadsheet({ sheets: [{ isProtected: true, protectSettings: { selectCells: true, formatCells: true, formatRows: true, insertLink:
                true, formatColumns: true }, ranges: [{ dataSource: defaultData }, ] }] , locale:'de-DE',  }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Hide Row->', (done: Function) => {
            helper.invoke('selectRange', ['A2:A3']);
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-rowhdr-table') as HTMLTableElement).rows[1].cells[0];
            let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
            setTimeout(() => {
                helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').click();
                setTimeout(() => {
                    helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                    expect(helper.getInstance().sheets[0].rows[1].hidden).toBeTruthy();
                    expect(helper.getInstance().sheets[0].rows[2].hidden).toBeTruthy();

                    let rows: any = helper.getElementFromSpreadsheet('.e-sheet-content').getElementsByClassName('e-row');
                    expect(rows[0].getAttribute('aria-rowindex')).toBe('1');
                    expect(rows[1].getAttribute('aria-rowindex')).toBe('4');

                    rows = helper.getElementFromSpreadsheet('.e-row-header').getElementsByClassName('e-row');
                    expect(rows[0].textContent).toContain('1');
                    expect(rows[1].textContent).toContain('4');
                    expect(rows[0].classList).toContain('e-hide-start');
                    expect(rows[1].classList).toContain('e-hide-end');
                    done();
                });
            });
        });

        it('UnHide Row->', (done: Function) => {
            helper.invoke('selectRange', ['A1:A5']);
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-rowhdr-table') as HTMLTableElement).rows[0].cells[0];
            let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
            setTimeout(() => {
                helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').click();
                setTimeout(() => {
                    helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                    expect(helper.getInstance().sheets[0].rows[1].hidden).toBeFalsy();
                    expect(helper.getInstance().sheets[0].rows[2].hidden).toBeFalsy();

                    let rows: any = helper.getElementFromSpreadsheet('.e-sheet-content').getElementsByClassName('e-row');
                    expect(rows[1].getAttribute('aria-rowindex')).toBe('2');
                    expect(rows[2].getAttribute('aria-rowindex')).toBe('3');

                    rows = helper.getElementFromSpreadsheet('.e-row-header').getElementsByClassName('e-row');
                    expect(rows[1].textContent).toContain('2');
                    expect(rows[2].textContent).toContain('3');
                    expect(rows[1].classList).not.toContain('e-hide-start');
                    expect(rows[2].classList).not.toContain('e-hide-end');
                    done();
                });
            });
        });

        it('Hide Column->', (done: Function) => {
            helper.invoke('selectRange', ['B1:C1']);
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[1];
            let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
            setTimeout(() => {
                helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').click();
                setTimeout(() => {
                    helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                    expect(helper.getInstance().sheets[0].columns[1].hidden).toBeTruthy();
                    expect(helper.getInstance().sheets[0].columns[2].hidden).toBeTruthy();

                    let rows = helper.getElementFromSpreadsheet('.e-sheet-content').getElementsByClassName('e-row');
                    expect(rows[0].children[1].getAttribute('aria-colindex')).toBe('4');
                    expect(rows[0].children[2].getAttribute('aria-colindex')).toBe('5');
                    
                    rows = helper.getElementFromSpreadsheet('.e-column-header').getElementsByClassName('e-header-row');
                    expect(rows[0].children[1].textContent).toContain('D');
                    expect(rows[0].children[2].textContent).toContain('E');
                    expect(rows[0].children[0].classList).toContain('e-hide-start');
                    expect(rows[0].children[1].classList).toContain('e-hide-end');
                    done();
                });
            });
        });

        it('UnHide Column->', (done: Function) => {
            helper.invoke('selectRange', ['A1:E1']);
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[0];
            let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
            setTimeout(() => {
                helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').click();
                setTimeout(() => {
                    helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                    expect(helper.getInstance().sheets[0].columns[1].hidden).toBeFalsy();
                    expect(helper.getInstance().sheets[0].columns[2].hidden).toBeFalsy();

                    let rows = helper.getElementFromSpreadsheet('.e-sheet-content').getElementsByClassName('e-row');
                    expect(rows[0].children[1].getAttribute('aria-colindex')).toBe('2');
                    expect(rows[0].children[2].getAttribute('aria-colindex')).toBe('3');
                    
                    rows = helper.getElementFromSpreadsheet('.e-column-header').getElementsByClassName('e-header-row');
                    expect(rows[0].children[1].textContent).toContain('B');
                    expect(rows[0].children[2].textContent).toContain('C');
                    expect(rows[0].children[0].classList).not.toContain('e-hide-start');
                    expect(rows[0].children[1].classList).not.toContain('e-hide-end');
                    done();
                });
            });
        });
    });

    describe('Hide with freeze pane ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }], frozenColumns: 3, frozenRows: 4, rows: [{ index: 3, cells:
                    [{ index: 1, colSpan: 3, rowSpan: 2 }] }], columns: [{ index: 2, hidden: true }], selectedRange: 'A4:CV5' }], height: 500 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Hide rows contains merged cells', (done: Function) => {
            const selectAllTable: HTMLTableElement = helper.invoke('getSelectAllContent').firstElementChild;
            expect(selectAllTable.rows.length).toBe(6);
            expect(selectAllTable.rows[5].classList.contains('e-empty')).toBeTruthy();
            expect(helper.invoke('getColHeaderTable').rows.length).toBe(5);
            helper.invoke('hideRow', [3, 4]);
            const rows: RowModel[] = helper.getInstance().sheets[0].rows;
            expect(rows[3].hidden).toBeTruthy();
            expect(rows[4].hidden).toBeTruthy();
            setTimeout(() => {
                expect(helper.invoke('getSelectAllContent').firstElementChild.rows.length).toBe(4);
                expect(helper.invoke('getColHeaderTable').rows.length).toBe(4);
                expect(helper.invoke('getRowHeaderTable').rows[0].getAttribute('aria-rowindex')).toBe('6');
                expect(helper.invoke('getContentTable').rows[0].getAttribute('aria-rowindex')).toBe('6');
                done();
            });
        });
        it('Hide first column inside freezepane and vertical scroll checking', (done: Function) => {
            helper.invoke('hideColumn', [2, 2, false]);
            helper.invoke('hideColumn', [0]);
            const spreadsheet: any = helper.getInstance();
            expect(spreadsheet.sheets[0].columns[2].hidden).toBeFalsy();
            expect(spreadsheet.sheets[0].columns[0].hidden).toBeTruthy();
            helper.invoke('getMainContent').parentElement.scrollTop = 400;
            spreadsheet.notify(onContentScroll, { scrollTop: 400, scrollLeft: 0 });
            setTimeout(() => {
                expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('D26');
                helper.invoke('getMainContent').parentElement.scrollTop = 0;
                spreadsheet.notify(onContentScroll, { scrollTop: 0, scrollLeft: 0 });
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('D6');
                    const rowHdrTable: HTMLTableElement = helper.invoke('getRowHeaderTable');
                    expect(rowHdrTable.rows[0].getAttribute('aria-rowindex')).toBe('6');
                    expect(rowHdrTable.rows[0].cells.length).toBe(3);
                    expect(rowHdrTable.rows[0].cells[0].classList.contains('e-header-cell')).toBeTruthy();
                    expect(rowHdrTable.rows[0].cells[1].getAttribute('aria-colindex')).toBe('2');
                    expect(helper.invoke('getContentTable').rows[0].getAttribute('aria-rowindex')).toBe('6');
                    done();
                });
            });
        });
    });

    describe('CR-Issues->', () => {
        describe('EJ2-50923, EJ2-53947', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{  ranges: [{ dataSource:defaultData }] }] , scrollSettings: { enableVirtualization: false }
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-50923 - Getting error while unhide 200 hidden rows in spreadsheet->', (done: Function) => {
                helper.invoke('hideRow', [2,202]);
                expect(helper.getInstance().sheets[0].rows[2].hidden).toBeTruthy();
                expect(helper.getInstance().sheets[0].rows[202].hidden).toBeTruthy();
                helper.invoke('hideRow', [2, 202, false]);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[2].hidden).toBeFalsy();
                    expect(helper.getInstance().sheets[0].rows[202].hidden).toBeFalsy();
                    done();
                });
            });

            it('EJ2-53947 - Undo-Redo actions are not working for hidden rows->', (done: Function) => {
                helper.invoke('selectRange', ['A3:A7']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(2, 0, [8], true);
                setTimeout(() => {
                   expect(helper.getInstance().sheets[0].rows[2].hidden).toBeTruthy();
                   expect(helper.getInstance().sheets[0].rows[5].hidden).toBeTruthy();
                   helper.invoke('selectRange', ['B2']);
                   helper.getElement('#' + helper.id + '_undo').click();
                   expect(helper.getInstance().sheets[0].rows[2].hidden).toBeFalsy();
                   expect(helper.getInstance().sheets[0].rows[5].hidden).toBeFalsy();
                   done();
                });
            });
        });
        describe('EJ2-54216->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rowCount: 11, colCount: 8, ranges: [{ dataSource: defaultData }] }], scrollSettings: { isFinite: true}
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Show/hide update with finite mode->', (done: Function) => {
                helper.invoke('selectRange', ['A8:A11']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(7, 0, [8], true);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[7].hidden).toBeTruthy();
                    expect(helper.getInstance().sheets[0].rows[10].hidden).toBeTruthy();
                    expect(helper.getInstance().sheets[0].rowCount).toBe(11);
                    expect(helper.getInstance().sheets[0].usedRange.rowIndex).toBe(10);
                    helper.invoke('selectRange', ['F1:H1']);
                    helper.openAndClickCMenuItem(0, 5, [8], false, true);
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].columns[5].hidden).toBeTruthy();
                        expect(helper.getInstance().sheets[0].columns[7].hidden).toBeTruthy();
                        expect(helper.getInstance().sheets[0].colCount).toBe(8);
                        expect(helper.getInstance().sheets[0].usedRange.colIndex).toBe(7);
                        done();
                    });
                });
            });
        });
        describe('EJ2-53422->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        const spreadsheet: any = helper.getInstance();
                        spreadsheet.applyFilter([{ field: 'A', predicate: 'or', operator: 'contains', value: 'Casual Shoes' }]);
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Need to fix the data shuffle issue while applying the filters and hiding the columns.->', (done: Function) => {
                helper.invoke('hideColumn', [2, 2]);
                setTimeout(() => {
                    helper.invoke('selectRange', ['A1']);
                    helper.getElement('#' + helper.id + '_sorting').click();
                    helper.getElement('#' + helper.id + '_clearfilter').click();
                    helper.invoke('hideColumn', [2, 2, false]);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [5, 3]).textContent).toBe('30');
                        expect(helper.invoke('getCell', [2, 3]).textContent).toBe('20');
                        expect(helper.invoke('getCell', [10, 3]).textContent).toBe('50');
                        done();
                    });
                });
            });
        });
        describe('EJ2-71836 - Hide/show with merged cells->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Hide/show columns on the merged cells ->', (done: Function) => {
                helper.invoke('merge', ['A1:F1']);
                helper.invoke('merge', ['A3:B3']);
                helper.invoke('merge', ['H2:J6']);
                helper.invoke('hideColumn', [0]);
                setTimeout(() => {
                    const sheet: SheetModel = helper.getInstance().sheets[0];
                    expect(sheet.columns[0].hidden).toBeTruthy();
                    expect(helper.invoke('getCell', [0, 1]).colSpan).toBe(5);
                    expect(helper.invoke('getCell', [1, 1]).colSpan).toBe(1);
                    helper.invoke('hideColumn', [0, 0, false]);
                    setTimeout(() => {
                        done();
                    });
                });
            });
            it('Hide/show both rows and column on the merged cells ->', (done: Function) => {
                const sheet: SheetModel = helper.getInstance().sheets[0];
                helper.invoke('hideColumn', [7]);
                expect(sheet.columns[7].hidden).toBeTruthy();
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 8]).colSpan).toBe(2);
                    expect(helper.invoke('getCell', [1, 8]).rowSpan).toBe(5);
                    helper.invoke('hideRow', [1]);
                    expect(sheet.rows[1].hidden).toBeTruthy();
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [2, 8]).colSpan).toBe(2);
                        expect(helper.invoke('getCell', [2, 8]).rowSpan).toBe(4);
                        done();
                    });
                });
            });
            it('Hide/show only rows on the merged cells ->', (done: Function) => {
                const sheet: SheetModel = helper.getInstance().sheets[0];
                helper.invoke('hideColumn', [7, 7, false]);
                expect(sheet.columns[7].hidden).toBeFalsy();
                setTimeout(() => {
                    expect(helper.invoke('getCell', [2, 7]).colSpan).toBe(3);
                    expect(helper.invoke('getCell', [2, 8]).colSpan).toBe(1);
                    helper.invoke('hideRow', [3]);
                    expect(sheet.rows[3].hidden).toBeTruthy();
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [2, 7]).rowSpan).toBe(3);
                        helper.invoke('hideRow', [5]);
                        setTimeout(() => {
                            expect(sheet.rows[5].hidden).toBeTruthy();
                            expect(helper.invoke('getCell', [2, 7]).rowSpan).toBe(2);
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-842256 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        ranges: [{ dataSource: defaultData }],
                        conditionalFormats: [
                            { type: "GreaterThan", cFColor: "RedFT", value:'20', range: 'D2:D11' },
                            { type: "GreaterThan", cFColor: "GreenFT", value:'10', range: 'D2:H2' }
                        ],
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Conditional format gets removed when clearing the filter for cf rule applied values ->', (done: Function) => {
                helper.getInstance().filterModule.getFilterOperator('Less');
                helper.getInstance().applyFilter([{ field: 'D', predicate: 'or', operator: 'lessthan', value: '20' }]);
                setTimeout(() => {
                    helper.invoke('clearFilter', ['D']);
                    expect(helper.invoke('getCell', [5, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                    expect(helper.invoke('getCell', [10, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                    expect(helper.invoke('getCell', [6, 3]).style.color).toBe('rgb(156, 0, 85)');
                    expect(helper.invoke('getCell', [9, 3]).style.color).toBe('rgb(156, 0, 85)');
                    helper.invoke('hideColumn', [4]);
                    helper.invoke('selectRange', ['D1:F1']);
                    let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[0];
                    let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                    setTimeout(() => {
                        helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').click();
                        setTimeout(() => {
                            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(198, 239, 206)');
                            expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(0, 97, 0)');
                            done();
                        });
                    });
                });
            });
        });
    });
});