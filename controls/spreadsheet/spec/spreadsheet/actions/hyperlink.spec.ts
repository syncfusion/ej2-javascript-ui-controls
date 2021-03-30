import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';

describe('Hyperlink ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.invoke('addHyperlink', ['www.google.com', 'A1']);
            expect(helper.getInstance().sheets[0].rows[0].cells[0].hyperlink).toBe('http://www.google.com');
            let td: HTMLElement = helper.invoke('getCell', [0, 0]).children[0];
            expect(td.classList).toContain('e-hyperlink');
            expect(td.classList).toContain('e-hyperlink-style');
            expect(td.tagName).toBe('A');
            expect(td.getAttribute('href')).toBe('http://www.google.com');
            // const prevHref: string = document.location.href; Need to check how this case need to be handled
            // td.click();
            // expect(document.location.href).toBe('https://www.google.com/');
            // location.href = prevHref;

            helper.invoke('addHyperlink', [{ address: 'C5' }, 'A2']);
            td = helper.invoke('getCell', [1, 0]).children[0];
            expect(td.classList).toContain('e-hyperlink');
            td.click();
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C5:C5');
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

        it('Insert hyperlink', (done: Function) => {
            (helper.getElementFromSpreadsheet('.e-tab-header').children[0].children[3] as HTMLElement).click();
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                setTimeout(() => {
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    helper.setAnimationToNone('.e-hyperlink-dlg');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    expect(helper.getInstance().sheets[0].rows[0].cells[0].hyperlink.address).toBe('http://www.google.com');
                    const td: HTMLElement = helper.invoke('getCell', [0, 0]).children[0];
                    expect(td.classList).toContain('e-hyperlink');
                    expect(td.classList).toContain('e-hyperlink-style');
                    expect(td.tagName).toBe('A');
                    expect(td.getAttribute('href')).toBe('http://www.google.com');
                    done();
                });
            });
        });

        it('Open hyperlink', (done: Function) => {
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                // helper.click('#' + helper.id + '_contextmenu li:nth-child(10)'); Need to check this how to handle this case
                setTimeout(() => {
                    done();
                });
            });
        });

        it('Edit hyperlink', (done: Function) => {
            let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.click('#' + helper.id + '_contextmenu li:nth-child(9)');
                setTimeout(() => {
                    setTimeout(() => {
                        helper.getElements('.e-edithyperlink-dlg .e-webpage input')[1].value = 'www.amazon.com';
                        helper.setAnimationToNone('.e-edithyperlink-dlg');
                        helper.click('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                        expect(helper.getInstance().sheets[0].rows[0].cells[0].hyperlink.address).toBe('http://www.amazon.com');
                        td = helper.invoke('getCell', [0, 0]).children[0];
                        expect(td.getAttribute('href')).toBe('http://www.amazon.com');
                        done();
                    });
                });
            });
        });

        it('Remove hyperlink', (done: Function) => {
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.click('#' + helper.id + '_contextmenu li:nth-child(11)');
                expect(helper.getInstance().sheets[0].rows[0].cells[0].hyperlink).toBeUndefined();
                expect(helper.invoke('getCell', [0, 0]).children[0]).toBeUndefined();
                done();
            });
        });

        it('Insert hyperlink for cell range', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            (helper.getElementFromSpreadsheet('.e-tab-header').children[0].children[3] as HTMLElement).click();
            //helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                setTimeout(() => {
                    // helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
                    // helper.getElements('.e-hyperlink-dlg .e-document input')[1].value = 'K30';
                    // helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
                    // helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    // expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[1])).toBe('{"value":"Date","hyperlink":{"address":"Sheet1!K30"}}');
                    // const td: HTMLElement = helper.invoke('getCell', [0, 1]).children[0];
                    // expect(td.classList).toContain('e-hyperlink');
                    // expect(td.classList).toContain('e-hyperlink-style');
                    // expect(td.tagName).toBe('A');
                    // expect(td.getAttribute('ref')).toBe('Sheet1!K30');
                    // td.click();
                    // expect(helper.getInstance().sheets[0].selectedRange).toBe('K30:K30');
                    done();
                });
            });
        });
    });
});