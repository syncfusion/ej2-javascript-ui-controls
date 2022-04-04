import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';

describe('Auto fill ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Autofill drag is not working when autofill option buttion is visible', (done: Function) => {
            helper.invoke('selectRange', ['G10']);
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'G10']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [12, 6]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('G10:G10');
            expect(helper.invoke('getCell', [11, 6]).textContent).toBe('14');
            expect(helper.invoke('getCell', [12, 6]).textContent).toBe('15');
            td = helper.invoke('getCell', [15, 6]);
            coords = td.getBoundingClientRect();
            autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(instance.selectionModule.dAutoFillCell).toBe('G10:G13');
            expect(helper.invoke('getCell', [13, 6]).textContent).toBe('16');
            expect(helper.invoke('getCell', [14, 6]).textContent).toBe('17');
            expect(helper.invoke('getCell', [15, 6]).textContent).toBe('18');
            autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.triggerMouseAction('mouseup', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, document, autoFill);
            expect(instance.selectionModule.dAutoFillCell).toBe('G10:G13');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(3)');
            td = helper.invoke('getCell', [13, 6]);
            expect(td.textContent).toBe('');
            expect(td.style.fontWeight).toBe('bold');
            td = helper.invoke('getCell', [14, 6]);
            expect(td.textContent).toBe('');
            expect(td.style.fontWeight).toBe('bold');
            td = helper.invoke('getCell', [15, 6]);
            expect(td.textContent).toBe('');
            expect(td.style.fontWeight).toBe('bold');
            done();
        });
    });

    describe('CR Issues ->', () => {
        describe('EJ2-56558 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Auto fill does not hide when selection is in hidden range after undo & redo on filtered rows', (done: Function) => {
                helper.invoke('applyFilter').then(() => {
                    const btn: HTMLElement = helper.invoke('getCell', [0, 4]).querySelector('.e-filter-icon');
                    const coords = btn.getBoundingClientRect();
                    helper.triggerMouseAction('mousedown', { x: coords.left + 1, y: coords.top + 1 }, null, btn);
                    helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, btn);
                    setTimeout(() => {
                        setTimeout(() => {
                            helper.click('.e-filter-popup .e-ftrchk:nth-child(2) .e-chk-hidden');
                            helper.click('.e-filter-popup .e-ftrchk:nth-child(3) .e-chk-hidden');
                            helper.click('.e-filter-popup .e-primary');
                            setTimeout(() => {
                                helper.click('#spreadsheet_undo');
                                helper.invoke('selectRange', ['D4']);
                                helper.click('#spreadsheet_redo');
                                setTimeout(() => {
                                    const autofill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                                    expect(autofill.classList).toContain('e-hide');
                                    expect(getComputedStyle(autofill).display).toBe('none');
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});