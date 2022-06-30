import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { HyperlinkModel, Spreadsheet } from '../../../src';
import { getFormatFromType, BeforeHyperlinkArgs } from '../../../src/index';

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
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
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

        it('Open hyperlink', (done: Function) => {
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.getInstance().beforeHyperlinkClick = (args: BeforeHyperlinkArgs): void => {
                args.cancel = true;
                expect((args.hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
                expect(args.address).toBe('A1');
                expect(args.target).toBe('_blank');
            };
            helper.openAndClickCMenuItem(0, 0, [10]);
            helper.getInstance().beforeHyperlinkClick = undefined;
            done();
        });

        it('Edit hyperlink', (done: Function) => {
            helper.openAndClickCMenuItem(0, 0, [9]);
            setTimeout(() => {
                helper.getElements('.e-edithyperlink-dlg .e-webpage input')[1].value = 'www.amazon.com';
                helper.setAnimationToNone('.e-edithyperlink-dlg');
                helper.click('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                expect(helper.getInstance().sheets[0].rows[0].cells[0].hyperlink.address).toBe('http://www.amazon.com');
                expect(helper.invoke('getCell', [0, 0]).children[0].getAttribute('href')).toBe('http://www.amazon.com');
                done();
            });
        });

        it('Remove hyperlink', (done: Function) => {
            helper.openAndClickCMenuItem(0, 0, [11]);
            expect(helper.getInstance().sheets[0].rows[0].cells[0].hyperlink).toBeUndefined();
            expect(helper.invoke('getCell', [0, 0]).children[0]).toBeUndefined();
            done();
        });

        it('Hyperlink appplied to range', (done: Function) => {
            // Hyperlink appplied for given range - website
            helper.invoke('addHyperlink', ['www.syncfusion.com', 'A2:A4']);
            expect(helper.getInstance().sheets[0].rows[2].cells[0].hyperlink).toBe('http://www.syncfusion.com');
            let tag: HTMLElement = helper.invoke('getCell', [3, 0]).children[0];
            expect(tag.classList).toContain('e-hyperlink');
            expect(tag.classList).toContain('e-hyperlink-style');
            expect(tag.tagName).toBe('A');
            expect(tag.getAttribute('href')).toBe('http://www.syncfusion.com');
            // Hyperlink appplied for given range - Document
            helper.invoke('addHyperlink', [{ address: 'A9' }, 'E3:F5']);
            tag = helper.invoke('getCell', [2, 4]).children[0];
            expect(tag.classList).toContain('e-hyperlink');
            tag.click();
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A9:A9');
                expect(helper.getInstance().sheets[0].rows[2].cells[4].hyperlink.address).toBe('A9');
                helper.invoke('selectRange', ['K1']);
                // Hyperlink appplied - Empty Cell
                helper.invoke('addHyperlink', ['www.syncfusion.com', 'K1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[10].hyperlink).toBe('http://www.syncfusion.com');
                let value: HTMLElement = helper.invoke('getCell', [0, 10]).children[0];
                expect(value.textContent).toContain('http://www.syncfusion.com');
                expect(value.classList).toContain('e-hyperlink');
                expect(value.classList).toContain('e-hyperlink-style');
                expect(value.tagName).toBe('A');
                expect(value.getAttribute('href')).toBe('http://www.syncfusion.com');
                done();
            });
        });

        it('Remove hyperlink from empty cell', (done: Function) => {
            helper.openAndClickCMenuItem(0, 10, [11]);
            expect(helper.getInstance().sheets[0].rows[0].cells[10].hyperlink).toBeUndefined();
            expect(helper.invoke('getCell', [0, 10]).children[0]).toBeUndefined();
            done();
        });
    });

    describe('UI-Interaction ->' , () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Checking Insert Button in Hyperlink Dialog Box ->', (done: Function) => {
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                setTimeout(() => {
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    const btn: HTMLButtonElement = helper.getElement('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    expect(btn.disabled).toBeFalsy();
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = '';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    expect(btn.disabled).toBeTruthy();
                    done();
                });
            });
        });

        it('Checking Insert Button in Hyperlink Dialog Box - II ->', (done?: Function) => {
            helper.setAnimationToNone('.e-hyperlink-dlg');
            helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
            helper.getElements('.e-hyperlink-dlg .e-document .e-input')[1].value = ' ';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            const btn: HTMLButtonElement = helper.getElement('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
            expect(btn.disabled).toBeTruthy();
            helper.getElements('.e-hyperlink-dlg .e-document input')[1].value = 'K30';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            expect(btn.disabled).toBeFalsy();
            helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
            const td: HTMLElement = helper.invoke('getCell', [0, 0]).children[0];
            expect(td.classList).toContain('e-hyperlink');
            expect(td.classList).toContain('e-hyperlink-style');
            expect(td.tagName).toBe('A');
            // expect(td.getAttribute('ref')).toBe('Sheet1!K30');
            // td.click();
            // expect(helper.getInstance().sheets[0].selectedRange).toBe('K30:K30');
            done();
        });

        it('Open hyperlink ->', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.invoke('addHyperlink', [{ address: 'A10' }, 'C1']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 2]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.click('#' + helper.id + '_contextmenu li:nth-child(10)');
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A10:A10');
                    done();
                });
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('I328882 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Hyperlink style is not getting removed from cell', (done: Function) => {
                helper.switchRibbonTab(2);
                helper.getElement('#' + helper.id + '_hyperlink').click();
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    setTimeout(() => {
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
                });
            });
        describe('I328151 ->', () =>{
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() =>{ 
                helper.invoke('destroy');
            });
            it('Need to fix the issue with clear content in hyperlinks applied cells', (done: Function) => {
                helper.switchRibbonTab(2);
                helper.getElement('#' + helper.id + '_hyperlink').click();
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                setTimeout(() => {
                    helper.switchRibbonTab(1);
                    helper.getElement('#' + helper.id + '_clear').click();
                    helper.getElement('#' + helper.id + '_clear-popup').querySelector('.e-item').click();
                    done();
                });
            });
        });
        describe('EJ2-47899->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ 
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => { 
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.protectSheet(
                            'Sheet1', { selectCells: true, formatCells: true, formatRows: true, formatColumns: true, insertLink: true });
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cancel button not wroking for hyperlink popup', (done: Function) => {
                helper.invoke('selectRange', ['C5']);
                let td: HTMLTableCellElement = helper.invoke('getCell', [2, 4]);
                const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(9)');
                    setTimeout(() => {
                        helper.triggerKeyEvent('keydown', 65, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                        setTimeout(() => {
                            expect(helper.getElement('.e-editAlert-dlg')).toBeNull();
                            helper.setAnimationToNone('.e-hyperlink-dlg');
                            helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(2)');
                            expect(helper.getElement('.e-hyperlink-dlg')).toBeNull();
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-50410->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData}] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Hidden Sheet name Shown in Hyperlink dialog box', (done: Function) => {
                helper.click('.e-add-sheet-tab');
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().sheets.length).toBe(2);
                setTimeout(() => {
                    const td: HTMLTableCellElement = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                    const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                    setTimeout(() => {
                        helper.click('#' + helper.id + '_contextmenu li:nth-child(5)');
                        setTimeout(() => {
                            helper.invoke('selectRange', ['Sheet1!A1']);
                            helper.switchRibbonTab(2);
                            helper.getElement('#' + helper.id + '_hyperlink').click();
                            setTimeout(() => {
                                helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
                                let popUpElem: HTMLElement = helper.getElement('.e-cont .e-list-item .e-ul  ');
                                expect(popUpElem.childElementCount).toBe(1);
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('EJ2-50473', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.numberFormat(getFormatFromType('Currency'), 'E1:F11');
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cell value changes Alignment after adding Hyperlink', (done: Function) => {
                helper.invoke('selectRange', ['E2']);
                helper.switchRibbonTab(2);
                helper.getElement('#' + helper.id + '_hyperlink').click();
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                setTimeout(() => {
                    let td: HTMLElement = helper.invoke('getCell', [1, 4]);
                    setTimeout(() => {
                        expect(td.style.textAlign).toBe('');
                        done();
                    });
                });
            });
        });
    });
});