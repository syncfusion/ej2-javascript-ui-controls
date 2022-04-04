import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { SheetModel } from "../../../src/index";

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
});