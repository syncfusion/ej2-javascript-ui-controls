import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';

describe('Hide & Show ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
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
    });

    describe('UI Interaction ->', () => {

    });
});