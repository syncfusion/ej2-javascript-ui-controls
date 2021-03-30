import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';

describe('Protect sheet ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.invoke('protectSheet', ['Sheet1', {}]);
            expect(getComputedStyle(helper.getElementFromSpreadsheet('.e-active-cell')).display).toBe('none');
            expect(helper.getElements('.e-overlay').length).toBeGreaterThanOrEqual(23);

            helper.invoke('unprotectSheet', ['Sheet1']);
            setTimeout(() => {
                expect(getComputedStyle(helper.getElementFromSpreadsheet('.e-active-cell')).display).toBe('block');
                expect(helper.getElements('.e-overlay').length).toBeLessThanOrEqual(5);
                done();
            });
        });
    });

    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Protect sheet', (done: Function) => {
            (helper.getElementFromSpreadsheet('.e-tab-header').children[0].children[5] as HTMLElement).click();
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg');
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                helper.invoke('selectRange', ['D4']);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D4:D4');
                // helper.editInUI('Test'); // This case need to be fixed
                setTimeout(() => {
                    // expect(helper.getElementFromSpreadsheet('#' + helper.id + '_protect').textContent).toBe('Unprotect Sheet'); // Check this now
                    // expect(helper.getElementFromSpreadsheet('.e-editAlert-dlg')).not.toBeNull(); // This case need to be fixed
                    // helper.setAnimationToNone('.e-editAlert-dlg');
                    // helper.click('.e-editAlert-dlg .e-primary');
                    // expect(helper.invoke('getCell', [2, 3]).textContent).toBe('20');
                    done();
                });
            });
        });

        it('Delete in locked cell', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                helper.setAnimationToNone('.e-editAlert-dlg');
                expect(helper.getElement('.e-editAlert-dlg')).not.toBeNull();
                helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":"Item Name"}');
                done();
            });
        });

        it('Delete in unlocked cell', (done: Function) => {
            helper.invoke('lockCells', ['B2', false]);
            helper.invoke('selectRange', ['B2']);
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getElement('.e-editAlert-dlg')).toBeNull();
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[1])).toBe('{"format":"mm-dd-yyyy","isLocked":false}');
                done();
            });
        });

        it('Set unlocked to whole column', (done: Function) => {
            helper.invoke('selectRange', ['D1:D100']);
            helper.invoke('lockCells', [null, false]);
            expect(helper.getInstance().sheets[0].columns[3].isLocked).toBeFalsy();
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getElement('.e-editAlert-dlg')).toBeNull();
                done();
            });
        });

        it('Protect workbook', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                //helper.setAnimationToNone('.e-protectworkbook-dlg');
                (helper.getElementFromSpreadsheet('.e-protectworkbook-dlg input') as HTMLInputElement).value = 'T1@/a';
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'T1@/a';
                helper.click('.e-protectworkbook-dlg .e-primary');
                // This case need to be fixed.
                setTimeout(()=>{
                    done();
                });
            });
        });

        it('Un protect sheet', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            expect(helper.getInstance().sheets[0].isProtected).toBeFalsy();
            done();
        });
    });
});