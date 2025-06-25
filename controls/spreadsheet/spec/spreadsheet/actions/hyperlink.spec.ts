import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { AfterHyperlinkArgs, CellModel, DialogBeforeOpenEventArgs, HyperlinkModel, RowModel } from '../../../src';
import { getFormatFromType, BeforeHyperlinkArgs, setCellFormat } from '../../../src/index';
import { Spreadsheet } from "../../../src/index"; 
import { getComponent } from '@syncfusion/ej2-base';

describe('Hyperlink ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('Cell model and public method ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 11, cells: [{ hyperlink: { address: 'www.google.com' } }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Hyperlink cell binding', (done: Function) => {
            spreadsheet = helper.getInstance();
            const cell: CellModel = spreadsheet.sheets[0].rows[11].cells[0];
            expect((cell.hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
            expect(cell.style.textDecoration).toBe('underline');
            expect(cell.style.color).toBe('#00e');
            const cellEle: HTMLElement = helper.invoke('getCell', [11, 0]);
            expect(cellEle.querySelector('.e-hyperlink').textContent).toBe('http://www.google.com');
            expect(cellEle.style.textDecoration).toBe('underline');
            expect(cellEle.style.color).not.toBe('');
            done();
        });
        it('addHyperlink', (done: Function) => {
            helper.invoke('addHyperlink', ['www.google.com', 'A1']);
            expect(spreadsheet.sheets[0].rows[0].cells[0].hyperlink).toBe('http://www.google.com');
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
                expect(spreadsheet.sheets[0].selectedRange).toBe('C5:C5');
                done();
            }, 50);
        });
        it('Hyperlink applied through data range', (done: Function) => {
            helper.invoke('updateRange', [{ dataSource: [{ Link: 'https://www.syncfusion.com' }], startCell: 'A13' }]);
            helper.invoke('selectRange', ['A14:A14']);
            setTimeout(() => {
                const cell: CellModel = spreadsheet.sheets[0].rows[13].cells[0];
                expect(cell.hyperlink).toBe('https://www.syncfusion.com');
                expect(cell.style.textDecoration).toBe('underline');
                expect(cell.style.color).toBe('#00e');
                const cellEle: HTMLElement = helper.invoke('getCell', [13, 0]);
                expect(cellEle.querySelector('.e-hyperlink').textContent).toBe('https://www.syncfusion.com');
                expect(helper.getElement(`#${helper.id}_formula_input`).value).toBe('https://www.syncfusion.com');
                expect(cellEle.style.textDecoration).toBe('underline');
                expect(cellEle.style.color).not.toBe('');
                done();
            });
        });
    });

    describe('UI Interaction ->', () => {
        let sheet: any; let spreadsheet: any;
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
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                spreadsheet = helper.getInstance();
                sheet = spreadsheet.sheets[0];
                expect(sheet.rows[0].cells[0].hyperlink.address).toBe('http://www.google.com');
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
            spreadsheet.beforeHyperlinkClick = (args: BeforeHyperlinkArgs): void => {
                args.cancel = true;
                expect((args.hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
                expect(args.address).toBe('A1');
                expect(args.target).toBe('_blank');
            };
            expect(sheet.rows[0].cells[0].style.color).toBe('#00e');
            helper.openAndClickCMenuItem(0, 0, [12]);
            expect(sheet.rows[0].cells[0].style.color).toBe('#551a8b');
            spreadsheet.beforeHyperlinkClick = undefined;
            done();
        });

        it('Set different color format', (done: Function) => {
            spreadsheet.notify(setCellFormat, { style: { color: '#000000' }, onActionUpdate: true });
            expect(sheet.rows[0].cells[0].style.color).toBe('#000000');
            helper.invoke('undo');
            expect(sheet.rows[0].cells[0].style.color).toBe('#551a8b');
            done();
        });

        it('Edit hyperlink', (done: Function) => {
            helper.openAndClickCMenuItem(0, 0, [11]);
            setTimeout(() => {
                helper.getElements('.e-edithyperlink-dlg .e-webpage input')[1].value = 'www.amazon.com';
                helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                helper.click('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                expect(sheet.rows[0].cells[0].hyperlink.address).toBe('http://www.amazon.com');
                expect(helper.invoke('getCell', [0, 0]).children[0].getAttribute('href')).toBe('http://www.amazon.com');
                done();
            });
        });

        it('Remove hyperlink', (done: Function) => {
            helper.openAndClickCMenuItem(0, 0, [13]);
            expect(sheet.rows[0].cells[0].hyperlink).toBeUndefined();
            expect(helper.invoke('getCell', [0, 0]).children[0]).toBeUndefined();
            done();
        });

        it('Hyperlink appplied to range', (done: Function) => {
            // Hyperlink appplied for given range - website
            helper.invoke('addHyperlink', ['www.syncfusion.com', 'A2:A4']);
            expect(sheet.rows[2].cells[0].hyperlink).toBe('http://www.syncfusion.com');
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
                expect(sheet.selectedRange).toBe('A9:A9');
                expect(sheet.rows[2].cells[4].hyperlink.address).toBe('A9');
                helper.invoke('selectRange', ['K1']);
                // Hyperlink appplied - Empty Cell
                helper.invoke('addHyperlink', ['www.syncfusion.com', 'K1']);
                expect(sheet.rows[0].cells[10].hyperlink).toBe('http://www.syncfusion.com');
                let value: HTMLElement = helper.invoke('getCell', [0, 10]).children[0];
                expect(value.textContent).toContain('http://www.syncfusion.com');
                expect(value.classList).toContain('e-hyperlink');
                expect(value.classList).toContain('e-hyperlink-style');
                expect(value.tagName).toBe('A');
                expect(value.getAttribute('href')).toBe('http://www.syncfusion.com');
                done();
            }, 10);
        });
        it('Remove hyperlink from empty cell', (done: Function) => {
            helper.openAndClickCMenuItem(0, 10, [13]);
            setTimeout(() => {
                expect(sheet.rows[0].cells[10].hyperlink).toBeUndefined();
                expect(helper.invoke('getCell', [0, 10]).children[0]).toBeUndefined();
                done();
            }, 10);
        });
        it('Remove hyperlink using clear', (done: Function) => {
            helper.invoke('addHyperlink', ['www.syncfusion.com', 'A100']);
            expect(sheet.rows[99].cells[0].hyperlink).toBe('http://www.syncfusion.com');
            helper.invoke('clear', [{ range: 'A100', type: 'Clear All' }]);
            expect(sheet.rows[99].cells[0].hyperlink).toBeUndefined();
            done();
        });
        it('EJ2-931211 - Hyperlink applies to unmerged cells after unmerging merged cells', (done: Function) => {
            helper.invoke('merge', ['H10:H11']);
            const cell1: CellModel = helper.getInstance().sheets[0].rows[9].cells[7];
            const cell2: CellModel = helper.getInstance().sheets[0].rows[10].cells[7];
            expect(cell1.rowSpan).toBe(2);
            expect(cell2.rowSpan).toBe(-1);
            helper.invoke('insertHyperlink', [{ address: 'http://www.syncfusion.com' }, 'H10:H11', false]);
            expect(JSON.stringify(cell1.hyperlink)).toBe('{"address":"http://www.syncfusion.com"}');
            expect(JSON.stringify(cell2.hyperlink)).toBe(undefined);
            done();
        });
        it('935444-Apply Hyperlink to Range and Update One Cell Hyperlink Correctly ', function (done) {
            spreadsheet = helper.getInstance();
            sheet = spreadsheet.sheets[0];
            helper.invoke('selectRange', ['H15:H100']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(function () {
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                expect(sheet.rows[14].cells[7].hyperlink.address).toBe('http://www.google.com');
                helper.invoke('selectRange', ['H15']);
                helper.switchRibbonTab(2);
                helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
                helper.getElements('.e-edithyperlink-dlg .e-webpage input')[1].value = 'www.youtube.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-edithyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                helper.click('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                expect(sheet.rows[14].cells[7].hyperlink.address).toBe('http://www.youtube.com');
                expect(sheet.rows[20].cells[7].hyperlink.address).toBe('http://www.google.com');
                helper.invoke('selectRange', ['H15']);
                helper.switchRibbonTab(2);
                helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
                setTimeout(function () {
                    expect(helper.getElements('.e-edithyperlink-dlg .e-webpage input')[0].value).toBe('http://www.youtube.com');
                    helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                    helper.click('.e-edithyperlink-dlg .e-footer-content button:nth-child(2)');
                    done();
                });
            });
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
            helper.triggerKeyNativeEvent(75, true);
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
            helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
            helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
            helper.getElements('.e-hyperlink-dlg .e-document .e-input')[1].value = ' ';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            const btn: HTMLButtonElement = helper.getElement('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
            expect(btn.disabled).toBeTruthy();
            helper.getElements('.e-hyperlink-dlg .e-document input')[1].value = 'K30';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            expect(btn.disabled).toBeFalsy();
            helper.getElements('.e-hyperlink-dlg .e-document .e-input')[1].value = '';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            expect(btn.disabled).toBeTruthy();
            helper.getElements('.e-hyperlink-dlg .e-document .e-input')[1].value = 'Test22';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            expect(btn.disabled).toBeTruthy();
            helper.getElements('.e-hyperlink-dlg .e-document .e-input')[1].value = 'Test';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            expect(btn.disabled).toBeTruthy();
            helper.getElements('.e-hyperlink-dlg .e-document .e-input')[1].value = '22';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            expect(btn.disabled).toBeTruthy();
            helper.getElements('.e-hyperlink-dlg .e-document input')[1].value = 'K30';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
            const td: HTMLElement = helper.invoke('getCell', [0, 0]).children[0];
            expect(td.classList).toContain('e-hyperlink');
            expect(td.classList).toContain('e-hyperlink-style');
            expect(td.tagName).toBe('A');
            done();
        });

        it('Open hyperlink ->', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.invoke('addHyperlink', [{ address: 'A10' }, 'C1']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [12]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A10:A10');
                done();
            }, 20);
        });

        it('Add hyperlink to range with empty cells ->', (done: Function) => {
            const rows: RowModel[] = helper.getInstance().sheets[0].rows;
            expect(rows[9].cells[0].value).toBe('Cricket Shoes');
            expect(rows[10].cells[0].value).toBe('T-Shirts');
            expect(rows[11]).toBeUndefined();
            helper.invoke('insertHyperlink', [{ address: 'http://www.syncfusion.com' }, 'A10:A12', 'Hockey Shoes', false]);
            expect(rows[9].cells[0].value).toBe('Hockey Shoes');
            expect(rows[10].cells[0].value).toBe('T-Shirts');
            expect((rows[11].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect(rows[11].cells[0].value).toBeUndefined();
            done();
        });
        it('Currency formatted cell ribbon alighment changed after adding hyperlink ->', (done: Function) => {
            helper.invoke('numberFormat', ['$#,##0.00', 'E2']);
            helper.switchRibbonTab(1);
            helper.invoke('selectRange', ['E2']);
            const textAlignIcon: HTMLElement = helper.getElement(`#${helper.id}_text_align .e-btn-icon`);
            expect(textAlignIcon.className).toContain('e-right-icon');
            helper.triggerKeyNativeEvent(75, true);
            setTimeout((): void => {
                const address: HTMLInputElement = helper.getElements('.e-hyperlink-dlg .e-webpage input')[1];
                address.value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, address);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                expect(textAlignIcon.className).toContain('e-right-icon');
                done();
            });
        });
        it('EJ2-894977 -> Value not displayed on clearing the hyperlink address->', (done: Function) => {
            const rows: RowModel[] = helper.getInstance().sheets[0].rows;
            helper.invoke('updateCell', [{ value: '0' }, 'A5']);
            helper.invoke('insertHyperlink', [{ address: 'http://www.syncfusion.com' }, 'A1:A11', false]);
            expect(rows[0].cells[0].value).toBe('Item Name');
            expect(rows[1].cells[0].value).toBe('Casual Shoes');
            expect(rows[2].cells[0].value).toBe('Sports Shoes');
            expect(rows[3].cells[0].value).toBe('Formal Shoes');
            expect(helper.getInstance().sheets[0].rows[4].cells[0].value).toBe(0);
            expect(rows[5].cells[0].value).toBe('Flip- Flops & Slippers');
            expect(rows[6].cells[0].value).toBe('Sneakers');
            expect(rows[7].cells[0].value).toBe('Running Shoes');
            expect(rows[8].cells[0].value).toBe('Loafers');
            expect(rows[9].cells[0].value).toBe('Hockey Shoes');
            expect(rows[10].cells[0].value).toBe('T-Shirts');
            expect(rows[11].cells[0].value).toBeUndefined();
            expect((rows[0].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[1].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[2].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[3].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[4].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[5].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[6].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[7].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[8].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[9].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[10].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            expect((rows[11].cells[0].hyperlink as HyperlinkModel).address).toBe('http://www.syncfusion.com');
            done();
        });
    });

    describe('UI-Interaction - III ->' , () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('open hyperlink dialog for empty cell ->', (done: Function) => {
            helper.invoke('selectRange', ['K10']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(2)');
                done();
            });
        });
        it('Hyperlink Alert for Protect Sheet', (done: Function) => {
            helper.invoke('protectSheet', ['Sheet1', {}]);
            helper.triggerKeyNativeEvent(75, true);
            setTimeout(() => {
                var dialog = helper.getElement('.e-editAlert-dlg.e-dialog');
                expect(!!dialog).toBeTruthy();
                // expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                helper.invoke('unprotectSheet', ['Sheet1']);
                done();
            });
        });

        it('Apply Invalid Hyperlink->', (done: Function) => {
            helper.invoke('selectRange', ['E2']);
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Accounting').click();
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'S';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                helper.invoke('selectRange', ['E2']);
                let td: HTMLElement = helper.invoke('getCell', [1, 4]).children[0];
                td.click();
                setTimeout(() => {
                    var dialog = helper.getElement('.e-dlg-modal.e-dialog');
                    expect(!!dialog).toBeTruthy();
                    expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                    helper.setAnimationToNone('.e-dlg-modal.e-dialog');
                    helper.click('.e-dlg-modal .e-footer-content button:nth-child(1)');
                    done();
                });
            });
        });

        it('Opening Edit Hyperlink Dialog for Webpage Input->', (done: Function) => {
            helper.invoke('selectRange', ['E2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                helper.getElements('.e-edithyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-edithyperlink-dlg .e-webpage input')[1]);
                helper.click('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                done();
            },20);
        });

        it('Apply Cell Validation and Background Color and remove Hyperlink->', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.invoke('cellFormat', [{ backgroundColor: '#ff0000' }, 'Sheet1!C1']);
            helper.invoke('addDataValidation', [{ type: 'TextLength', operator: 'LessThanOrEqualTo', value1: '2' }, 'C1']);
            helper.invoke('addInvalidHighlight', ['C1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                helper.invoke('selectRange', ['C1']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(0, 2, [13]);
                expect(helper.getInstance().sheets[0].rows[0].cells[2].hyperlink).toBeUndefined();
                expect(helper.invoke('getCell', [0, 2]).children[0]).toBeUndefined();
                let td: HTMLElement = helper.invoke('getCell', [0, 2]);
                expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
                done();
            });
        });

        it('Clicking Web Page ->', (done: Function) => {
            helper.invoke('selectRange', ['D1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[0].click();
                const btn: HTMLButtonElement = helper.getElement('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                expect(btn.disabled).toBeTruthy();
                helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
                expect(btn.disabled).toBeFalsy();
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(2)');
                done();
            });
        });

        it('Apply Hyperlink with ":" ->', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog .e-link-dialog.e-tab', true);
                helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
                helper.getElements('.e-hyperlink-dlg .e-document input')[1].value = 'A10:A10';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                let tag: HTMLElement = helper.invoke('getCell', [0, 1]).children[0];
                expect(tag.classList).toContain('e-hyperlink');
                expect(tag.classList).toContain('e-hyperlink-style');
                expect(tag.tagName).toBe('A');
                expect(tag.getAttribute('ref')).toBe('Sheet1!A10:A10');
                tag.click();
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A10:A10');
                    done();
                }, 10);
            });
        });

        it('Apply Hyperlink with ": and / and no Numbers" ->', (done: Function) => {
            helper.invoke('selectRange', ['E1']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog .e-link-dialog.e-tab', true);
                helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
                helper.getElements('.e-hyperlink-dlg .e-document input')[1].value = 'A/:A/';
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                let tag: HTMLElement = helper.invoke('getCell', [0, 4]).children[0];
                expect(tag.classList).toContain('e-hyperlink');
                expect(tag.classList).toContain('e-hyperlink-style');
                expect(tag.tagName).toBe('A');
                expect(tag.getAttribute('ref')).toBe('Sheet1!A/:A/');
                tag.click();
                setTimeout(() => {
                    var dialog = helper.getElement('.e-dlg-modal.e-dialog');
                    expect(!!dialog).toBeTruthy();
                    expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                    helper.setAnimationToNone('.e-dlg-modal.e-dialog');
                    helper.click('.e-dlg-modal .e-footer-content button:nth-child(1)');
                    done();
                }, 10);
            });
        });

        it('Apply Hyperlink with ": and Numbers Only" ->', (done: Function) => {
            helper.invoke('selectRange', ['F1']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog .e-link-dialog.e-tab', true);
                helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
                helper.getElements('.e-hyperlink-dlg .e-document input')[1].value = '1:1';
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                let tag: HTMLElement = helper.invoke('getCell', [0, 5]).children[0];
                expect(tag.classList).toContain('e-hyperlink');
                expect(tag.classList).toContain('e-hyperlink-style');
                expect(tag.tagName).toBe('A');
                expect(tag.getAttribute('ref')).toBe('Sheet1!1:1');
                tag.click();
                setTimeout(() => {
                    var dialog = helper.getElement('.e-dlg-modal.e-dialog');
                    expect(!!dialog).toBeTruthy();
                    expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                    helper.setAnimationToNone('.e-dlg-modal.e-dialog');
                    helper.click('.e-dlg-modal .e-footer-content button:nth-child(1)');
                    done();
                }, 10);
            });
        });

        it('Cancel Removing hyperlink', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.actionBegin = (args: any): void => {
                if (args.action === 'removeHyperlink') {  
                    args.args.eventArgs.cancel = true; 
                }
            }
            helper.invoke('selectRange', ['E2']);
            const td: HTMLTableCellElement = helper.invoke('getCell', [1, 4]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(13)');
                expect(helper.invoke('getCell', [0, 1]).children.length).toBe(1);
                done();
            });
        });

        it('Apply Hyperlink and Checking Insert Button in Hyperlink Dialog Box ->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
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

        it('Apply Hyperlink and Checking Insert Button in Hyperlink Dialog Box - II ->', (done: Function) => {
            helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
            helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog .e-link-dialog.e-tab', true);
            helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
            helper.getElements('.e-hyperlink-dlg .e-document .e-input')[1].value = ' ';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            const btn: HTMLButtonElement = helper.getElement('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
            expect(btn.disabled).toBeTruthy();
            helper.getElements('.e-hyperlink-dlg .e-document input')[1].value = 'K30';
            helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-document input')[1]);
            expect(btn.disabled).toBeFalsy();
            helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
            let td: HTMLElement = helper.invoke('getCell', [0, 0]).children[0];
            expect(td.classList).toContain('e-hyperlink');
            expect(td.classList).toContain('e-hyperlink-style');
            expect(td.tagName).toBe('A');
            expect(td.getAttribute('ref')).toBe('Sheet1!K30');
            td.click();
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('K30:K30');
                done();
            }, 50);
        });

        it('Opening Edit Hyperlink Dialog for Document Input->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                helper.getElements('.e-edithyperlink-dlg .e-document input')[1].value = 'L30';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-edithyperlink-dlg .e-document input')[1]);
                helper.click('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                helper.invoke('selectRange', ['E2']);
                done();
            });
        });

        it('Cancel Openining hyperlink Dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                args.cancel = true;
            };
            helper.invoke('selectRange', ['H1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                expect(helper.getElement('.e-hyperlink-dlg.e-dialog')).toBeNull();
                done();
            }, 20);
        });

        it('Cancel Openining Edit hyperlink Dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                args.cancel = true;
            };
            helper.invoke('selectRange', ['B1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                expect(helper.getElement('.e-edithyperlink-dlg.e-dialog')).toBeNull();
                done();
            }, 20);
        });
    });

    describe('UI-Interaction - IV ->' , () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { rows: [{ cells: [{ value: 'Item Name' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Name box editing for defined name', (done: Function) => {
            helper.invoke('selectRange', ['A2:A5']);
            setTimeout(() => {
                let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                nameBox.click();
                nameBox.value = 'TestName';
                helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                nameBox.classList.remove('e-name-editing');
                done();
            }, 20);
        });
        it('Apply hyperlink with for defined names ->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog .e-link-dialog.e-tab', true);
                helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
                let editorElem = helper.getElementFromSpreadsheet().querySelectorAll('.e-hyperlink-dlg .e-treeview .e-icon-expandable')[0];
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                setTimeout(() => {
                    let editorElem = helper.getElementFromSpreadsheet().querySelectorAll('.e-hyperlink-dlg .e-treeview .e-fullrow')[4];
                    let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                    editorElem.dispatchEvent(e);
                    e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                    editorElem.dispatchEvent(e);
                    e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                    editorElem.dispatchEvent(e);
                    setTimeout(() => {
                        helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                        let tag: HTMLElement = helper.invoke('getCell', [0, 0]).children[0];
                        expect(tag.classList).toContain('e-hyperlink');
                        expect(tag.classList).toContain('e-hyperlink-style');
                        expect(tag.tagName).toBe('A');
                        tag.click();
                        setTimeout(() => {
                            // expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A5');
                            done();
                        });
                    });
                });
            });
        });
        it('Apply hyperlink with for defined names in another sheet->', (done: Function) => {
            helper.getElement().querySelectorAll('.e-sheet-tab .e-toolbar-item')[1].click();
            setTimeout(() => {
                helper.invoke('selectRange', ['A1']);
                helper.switchRibbonTab(2);
                helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
                setTimeout(() => {
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog .e-link-dialog.e-tab', true);
                    helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
                    let editorElem = helper.getElementFromSpreadsheet().querySelectorAll('.e-hyperlink-dlg .e-treeview .e-icon-expandable')[0];
                    let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                    editorElem.dispatchEvent(e);
                    e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                    editorElem.dispatchEvent(e);
                    e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                    editorElem.dispatchEvent(e);
                    setTimeout(() => {
                        let editorElem = helper.getElementFromSpreadsheet().querySelectorAll('.e-hyperlink-dlg .e-treeview .e-fullrow')[4];
                        let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                        editorElem.dispatchEvent(e);
                        e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                        editorElem.dispatchEvent(e);
                        e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                        editorElem.dispatchEvent(e);
                        setTimeout(() => {
                            helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                            let tag: HTMLElement = helper.invoke('getCell', [0, 0]).children[0];
                            expect(tag.classList).toContain('e-hyperlink');
                            expect(tag.classList).toContain('e-hyperlink-style');
                            expect(tag.tagName).toBe('A');
                            tag.click();
                            setTimeout(() => {
                                expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A5');
                                done();
                            }, 10);
                        });
                    });
                });
            });
        });
        it('Clicking sheet name in hyperlink dialog box->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                let editorElem = helper.getElementFromSpreadsheet().querySelectorAll('.e-edithyperlink-dlg .e-treeview .e-icon-expandable')[0];
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                setTimeout(() => {
                    let editorElem = helper.getElementFromSpreadsheet().querySelectorAll('.e-edithyperlink-dlg .e-treeview .e-fullrow')[1];
                    let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                    editorElem.dispatchEvent(e);
                    e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                    editorElem.dispatchEvent(e);
                    e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                    editorElem.dispatchEvent(e);
                    setTimeout(() => {
                        const btn: HTMLButtonElement = helper.getElement('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                        expect(btn.disabled).toBeFalsy();
                        done();
                    });
                });
            });
        });
        it('Clicking cell reference tab in hyperlink dialog box->', (done: Function) => {
            helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
            let editorElem = helper.getElementFromSpreadsheet().querySelectorAll('.e-edithyperlink-dlg .e-treeview .e-fullrow')[0];
            let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            setTimeout(() => {
                const btn: HTMLButtonElement = helper.getElement('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                expect(btn.disabled).toBeTruthy();
                done();
            });
        });
        it('Clicking cell reference tab and sheet name in hyperlink dialog box->', (done: Function) => {
            helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
            let editorElem = helper.getElementFromSpreadsheet().querySelectorAll('.e-edithyperlink-dlg .e-treeview .e-fullrow')[1];
            let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            setTimeout(() => {
                const btn: HTMLButtonElement = helper.getElement('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                expect(btn.disabled).toBeFalsy();
                done();
            });
        });
        it('Clicking other than active sheet in hyperlink dialog box->', (done: Function) => {
            helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
            let editorElem = helper.getElementFromSpreadsheet().querySelectorAll('.e-edithyperlink-dlg .e-treeview .e-fullrow')[2];
            let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            setTimeout(() => {
                const btn: HTMLButtonElement = helper.getElement('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                expect(btn.disabled).toBeFalsy();
                btn.click();
                helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
                setTimeout(() => {
                helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                    btn.click();
                    done();
                });
            });
        });
    });

    describe('Checking Hyperlink with protect sheets.->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect Sheet with public hyperlink method to check protect settings without hyperlink', (done: Function) => {
            const spreadsheet = helper.getInstance();
            helper.invoke('protectSheet', ['Sheet1', {}]);
            spreadsheet.addHyperlink('www.syncfusion.com', 'A2');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].cells[0].validation).toBeUndefined();
                done();
            });
        });
        it('Protect Sheet with public hyperlink method to check protect settings with hyperlink', (done: Function) => {
            const spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Sheet1', { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: true });
            spreadsheet.addHyperlink('www.syncfusion.com', 'A2');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].cells[0].validation).toBeUndefined();
                done();
            });
        });
    });

    describe('EJ2-923115 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Range is getting selected instead of single cell while clicking the hyperlink', (done: Function) => {
            const spreadsheet = helper.getInstance();
            spreadsheet.addHyperlink('Sheet1!A250', 'A60');
            spreadsheet.goTo('Sheet1!A60');
            setTimeout(() => {
                spreadsheet.selectRange('A60');
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(59, 0, [12]);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A250:A250');
                    done();
                }, 20);
            }, 20);
        });
    });

    describe('Checking hyperlink public method with different types of addresses ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { rows: [{ cells: [{ value: 'Item Name' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing hyperlink and its address as string ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange('A1');
            spreadsheet.addHyperlink('https://support.microsoft.com/en-us/office/use-autofilter-to-filter-your-data-7d87d63e-ebd0-424b-8106-e2ab61133d92', 'A1');
            expect(spreadsheet.sheets[0].rows[0].cells[0].style.color).toBe('#00e');
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [12]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.color).toBe('#551a8b');
                done();
            });
        });
        it('Testing remove hyperlink when address is string ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.removeHyperlink('A1');
            expect(spreadsheet.sheets[0].rows[0].cells[0].hyperlink).toBeUndefined();
            done();
        });
        it('Testing hyperlink and its address as object ->', (done: Function) => {
            helper.invoke('addHyperlink', [{ address: 'https://support.microsoft.com/en-us/office/use-autofilter-to-filter-your-data-7d87d63e-ebd0-424b-8106-e2ab61133d92' }, 'B1']);
            expect(helper.getInstance().sheets[0].rows[0].cells[1].hyperlink).toBeDefined();
            done();

        });
        it('Testing remove hyperlink when address is object ->', (done: Function) => {
            helper.invoke('removeHyperlink', ['B1']);
            expect(helper.getInstance().sheets[0].rows[0].cells[0].hyperlink).toBeUndefined();
            done();
        });
        it('Testing invalid hyperlink ansd its address ->', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            helper.invoke('addHyperlink', [{ address: 'http:/invalid_url' }, 'B1']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 1, [12]);
            setTimeout(() => {
                let dialog = helper.getElement('.e-dlg-modal.e-dialog');
                expect(!!dialog).toBeTruthy();
                helper.setAnimationToNone('.e-dlg-modal.e-dialog');
                helper.click('.e-dlg-modal .e-footer-content button:nth-child(1)');
                done();
            }, 20);
        });
    });

    describe('CR-Issues ->', () => {
        describe('I328882, I328151, EJ2-47899, EJ2-50473 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], 
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.numberFormat(getFormatFromType('Currency'), 'Sheet1!E1:F11');
                    } 
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });

            it('I328882 - Hyperlink style is not getting removed from cell', (done: Function) => {
                helper.switchRibbonTab(2);
                helper.getElement('#' + helper.id + '_hyperlink').click();
                setTimeout(() => {
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    setTimeout(() => {
                        helper.setAnimationToNone('#spreadsheet_contextmenu');
                        helper.openAndClickCMenuItem(0, 0, [13]);
                        expect(helper.getInstance().sheets[0].rows[0].cells[0].hyperlink).toBeUndefined();
                        expect(helper.invoke('getCell', [0, 0]).children[0]).toBeUndefined();
                        done();
                    });
                });
            });

            it('I328151 - Need to fix the issue with clear content in hyperlinks applied cells', (done: Function) => {
                helper.getElement('#' + helper.id + '_hyperlink').click();
                setTimeout(() => {
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    setTimeout(() => {
                        helper.switchRibbonTab(1);
                        helper.click('#spreadsheet_clear');
                        helper.click('#spreadsheet_clear-popup ul li:nth-child(3)');
                        expect(helper.invoke('getCell', [0, 0]).textContent).toBe('');
                        done();
                    });
                });
            });

            it('EJ2-47899 - Cancel button not wroking for hyperlink popup', (done: Function) => {
                helper.invoke('selectRange', ['A2']);
                let td: HTMLTableCellElement = helper.invoke('getCell', [1, 0]);
                const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(11)');
                    setTimeout(() => {
                        helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                        helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(2)');
                        expect(helper.getElement('.e-hyperlink-dlg.e-dialog')).toBeNull();
                        done();
                    });
                });
            });

            it('EJ2-50473 - Cell value changes Alignment after adding Hyperlink', (done: Function) => {
                helper.invoke('selectRange', ['E2']);
                helper.switchRibbonTab(2);
                helper.getElement('#' + helper.id + '_hyperlink').click();
                setTimeout(() => {
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    setTimeout(() => {
                        let td: HTMLElement = helper.invoke('getCell', [1, 4]);
                        expect(td.style.textAlign).toBe('');
                        done();
                    });
                });
            });

            it("EJ2-882827 Script error issue on opening the hyperlink dialog", (done: Function) => {
                helper.invoke('selectRange', ['A1:CV1']);
                helper.invoke("insertRow", [0, 0]);
                helper.switchRibbonTab(2);
                helper.getElementFromSpreadsheet("#" + helper.id + "_hyperlink").click();
                setTimeout(() => {
                    var dialog = helper.getElement(".e-control.e-dialog.e-lib.e-hyperlink-dlg.e-draggable.e-dlg-modal.e-popup.e-popup-open");
                    expect(!!dialog).toBeTruthy();
                    expect(dialog.classList.contains("e-hyperlink-dlg")).toBeTruthy();
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    done();
                }, 5);
            });
        });

        describe('EJ2-50410, EJ2-908917 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] },  {  }], activeSheetIndex: 1
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-50410 - Hidden Sheet name Shown in Hyperlink dialog box', (done: Function) => {
                const td: HTMLTableCellElement = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.setAnimationToNone('#spreadsheet_contextmenu');
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(5)');
                    setTimeout(() => {
                        helper.invoke('selectRange', ['Sheet1!A1']);
                        helper.switchRibbonTab(2);
                        helper.getElement('#' + helper.id + '_hyperlink').click();
                        setTimeout(() => {
                            helper.getElements('.e-hyperlink-dlg .e-toolbar-item')[1].click();
                            let popUpElem: HTMLElement = helper.getElement('.e-cont .e-list-item .e-ul  ');
                            expect(popUpElem.childElementCount).toBe(1);
                            helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                            helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(2)');
                            done();
                        });
                    }, 10);
                });
            });
            it('displayName option in addHyperLink() is not working as expected', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.addHyperlink("https://www.google.com/", "F12",'CustomDisplayText');
                spreadsheet.addHyperlink("https://www.google.com/", "F11",'CustomDisplayText');
                expect(spreadsheet.sheets[0].rows[10].cells[5].value).toBe('CustomDisplayText');
                expect(spreadsheet.sheets[0].rows[11].cells[5].value).toBe('CustomDisplayText');
                helper.invoke('selectRange', ['A1:B4']);
                spreadsheet.merge();
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                expect(td.rowSpan).toBe(4);
                expect(td.colSpan).toBe(2);
                spreadsheet.unMerge();
                expect(td.rowSpan).toBe(1);
                expect(td.colSpan).toBe(1);
                done();
            });
        });

        describe('EJ2-72081 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Insert button is not disabled on insert hyperlink dialog when switching from defined names to sheet name', (done: Function) => {
                helper.invoke('selectRange', ['A10:A12']);
                helper.switchRibbonTab(2);
                helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
                const btn: HTMLButtonElement = helper.getElement('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                setTimeout(() => {
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[0].value = '';
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    expect(helper.invoke('getCell', [9, 0]).querySelector('.e-hyperlink').textContent).toBe('http://www.google.com');
                    expect(helper.getInstance().sheets[0].rows[9].cells[0].value).toBe('');
                    expect(helper.invoke('getCell', [10, 0]).querySelector('.e-hyperlink').textContent).toBe('T-Shirts');
                    expect(helper.getInstance().sheets[0].rows[10].cells[0].value).toBe('T-Shirts');
                    expect(helper.invoke('getCell', [11, 0]).querySelector('.e-hyperlink').textContent).toBe('http://www.google.com');
                    expect(helper.getInstance().sheets[0].rows[11].cells[0].value).toBeUndefined();
                    helper.edit('G1', '');
                    helper.invoke('selectRange', ['G1:I1']);
                    helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
                    setTimeout(() => {
                        helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                        helper.getElements('.e-hyperlink-dlg .e-webpage input')[0].value = '';
                        helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                        helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                        helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                        expect(helper.invoke('getCell', [0, 6]).querySelector('.e-hyperlink').textContent).toBe('http://www.google.com');
                        expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toBe('');
                        expect(helper.invoke('getCell', [0, 7]).querySelector('.e-hyperlink').textContent).toBe('Profit');
                        expect(helper.getInstance().sheets[0].rows[0].cells[7].value).toBe('Profit');
                        expect(helper.invoke('getCell', [0, 8]).querySelector('.e-hyperlink').textContent).toBe('http://www.google.com');
                        expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBeUndefined();
                        done();
                    });
                });
            });
        });
        describe('CR-894015 ->', () => {
            let spreadsheet: Spreadsheet;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('The beforeHyperlinkClick event is not preventing the hyperlink navigation action', (done: Function) => {
                spreadsheet = helper.getInstance();
                spreadsheet.beforeHyperlinkClick = (args: BeforeHyperlinkArgs): void => {
                    args.cancel = true;
                };
                let afterHyperlinkClickSpy = jasmine.createSpy('afterHyperlinkClick');
                spreadsheet.afterHyperlinkClick = afterHyperlinkClickSpy;
                spreadsheet.addHyperlink('www.syncfusion.com', 'A1');
                spreadsheet.dataBind();
                helper.invoke('selectRange', ['A1']);
                const td = helper.invoke('getCell', [0, 0]).children[0];
                td.click();
                expect(afterHyperlinkClickSpy).not.toHaveBeenCalled();
                done();
            });
            it('UI -> The beforeHyperlinkClick event is not preventing the hyperlink navigation action', (done: Function) => {
                spreadsheet = helper.getInstance();
                spreadsheet.beforeHyperlinkClick = (args: BeforeHyperlinkArgs): void => {
                    args.cancel = true;
                };
                let afterHyperlinkClickSpy = jasmine.createSpy('afterHyperlinkClick');
                spreadsheet.afterHyperlinkClick = afterHyperlinkClickSpy;
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(0, 0, [12]);
                expect(afterHyperlinkClickSpy).not.toHaveBeenCalled();
                done();
            });
        });
    });

    describe('Autofill ->', () => {
        describe('WithoutFormattingOption ->', () => {
            let spreadsheet: any;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ ranges: [{ dataSource: defaultData }],
                    rows: [{ index: 1, cells: [{ index: 7, hyperlink: { address: 'www.google.com' } }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Autofill for some cells', (done: Function) => {
                helper.edit('H2', 'Sync');
                spreadsheet = helper.getInstance();
                helper.invoke('selectRange', ['H2']);
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [5, 7]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                const instance: any = helper.getInstance();
                expect(instance.selectionModule.dAutoFillCell).toBe('H2:H2');
                expect(helper.invoke('getCell', [3, 7]).textContent).toBe('Sync');
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(3)');
                expect(spreadsheet.sheets[0].rows[4].cells[7].hyperlink.address).toBe('http://www.google.com');
                done();
            });
            it('Undo action', () => {
                helper.getElement('#' + helper.id + '_undo').click();
                expect(spreadsheet.sheets[0].rows[4].cells[7].hyperlink).toBe(undefined);
            });
            it('Redo action', () => {
                helper.getElement('#' + helper.id + '_redo').click();
                expect(spreadsheet.sheets[0].rows[4].cells[7].hyperlink.address).toBe('http://www.google.com');
            });
        });

        describe('FormattingOnlyOption ->', () => {
            let spreadsheet: any;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ ranges: [{ dataSource: defaultData }],
                    rows: [{ index: 1, cells: [{ index: 7, hyperlink: { address: 'www.google.com' } }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Autofill for some cells', (done: Function) => {
                helper.edit('H2', 'Sync');
                spreadsheet = helper.getInstance();
                helper.invoke('selectRange', ['H2']);
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [5, 7]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                const instance: any = helper.getInstance();
                expect(instance.selectionModule.dAutoFillCell).toBe('H2:H2');
                expect(helper.invoke('getCell', [3, 7]).textContent).toBe('Sync');
                expect(td.querySelector('.e-hyperlink')).not.toBe(null);
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(2)');
                expect(spreadsheet.sheets[0].rows[4].cells[7].hyperlink.address).toBe('http://www.google.com');
                expect(td.querySelector('.e-hyperlink')).toBe(null);
                done();
            });
            it('Undo action', () => {
                helper.getElement('#' + helper.id + '_undo').click();
                expect(spreadsheet.sheets[0].rows[4].cells[7].hyperlink).toBe(undefined);
            });
            it('Redo action', () => {
                helper.getElement('#' + helper.id + '_redo').click();
                let td: HTMLElement = helper.invoke('getCell', [5, 7]);
                expect(spreadsheet.sheets[0].rows[4].cells[7].hyperlink.address).toBe('http://www.google.com');
                expect(td.querySelector('.e-hyperlink')).toBe(null);
                expect(spreadsheet.sheets[0].rows[4].cells[7].style.textDecoration).toBe('underline');
            });
        });

        describe('Undo redo hyperlink ranges ->', () => {
            let spreadsheet: Spreadsheet;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Insert hyperlink', (done: Function) => {
                helper.invoke('selectRange', ['J2:M5']);
                helper.switchRibbonTab(2);
                helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
                setTimeout(() => {
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[0].value = 'Hello';
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    done();
                });
            });
            it('Undo action', () => {
                spreadsheet = helper.getInstance();
                helper.switchRibbonTab(1);
                helper.getElement('#' + helper.id + '_undo').click();
                expect(spreadsheet.sheets[0].rows[3].cells[10].hyperlink).toBe(undefined);
            });
            it('Select cell', () => {
                helper.invoke('selectRange', ['P6']);
            });
            it('Redo action', () => {
                helper.getElement('#' + helper.id + '_redo').click();
                expect(spreadsheet.sheets[0].rows[1].cells[9].value).toBe('Hello');
                expect((spreadsheet.sheets[0].rows[3].cells[10].hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
            });
            it('EJ2-946552 - Hyperlink text is displayed twice inside the cell', (done: Function) => {
                helper.edit('H10', '55\n');
                const cell: CellModel = helper.getInstance().sheets[0].rows[9].cells[7];
                expect(cell.value).toEqual('55\n');
                expect(cell.wrap).toEqual(true);
                helper.invoke('insertHyperlink', [{ address: 'www.google.com' }, 'H10']);
                expect((cell.hyperlink as HyperlinkModel).address).toEqual('http://www.google.com');
                helper.openAndClickCMenuItem(0, 0, [11]);
                setTimeout(() => {
                    helper.getElements('.e-edithyperlink-dlg .e-webpage input')[1].value = 'www.syncfusion.com';
                    helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                    helper.click('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                    expect((cell.hyperlink as HyperlinkModel).address).toEqual('http://www.syncfusion.com');
                    const td: HTMLElement = helper.invoke('getCell', [9, 7]).children[0];
                    expect(td.textContent).toBe('55');
                    done();
                });
            });
            it('EJ2-881848 - Issue on Clearing the Conditional Formatting Rules', (done: Function) => {
                helper.invoke('insertHyperlink', ['www.google.com', 'H11']);
                expect(helper.getInstance().sheets[0].rows[10].cells[7].hyperlink).toBe('http://www.google.com');
                helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H11' }]);
                expect(helper.invoke('getCell', [10, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                expect(helper.invoke('getCell', [10, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                helper.invoke('selectRange', ['H11']);
                helper.getElement('#' + helper.id + '_conditionalformatting').click();
                const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
                (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
                helper.getElement('#cf_cr_cells').click();
                const cellEle: HTMLElement = helper.invoke('getCell', [10, 7]);
                expect(cellEle.querySelector('.e-databar')).toBeNull();
                expect(cellEle.querySelector('a')).not.toBeNull();
                expect(cellEle.querySelector('a').href).toBe('http://www.google.com/');
                done();
            });
        });

        describe('Hyperlink test ->', () => {
            let spreadsheet: Spreadsheet;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{
                    conditionalFormats: [
                      { type: "GreaterThan", cFColor: "GreenFT", value:'20', range: 'H1:H11' },
                    ],
                    ranges: [{
                        dataSource: defaultData
                    }],
                }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Add sheet icon testing', (done: Function) => {
                helper.click('.e-add-sheet-tab');
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().sheets.length).toBe(2);
                done();
            });
            it('Insert hyperlink', (done: Function) => {
                helper.invoke('selectRange', ['A1']);
                helper.edit('A1', 'Syncfusion');
                helper.switchRibbonTab(2);
                helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
                setTimeout(() => {
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    done();
                });
            });
            it('Apply autoFill', (done: Function) => {
                spreadsheet = helper.getInstance();
                const cell: CellModel = spreadsheet.sheets[1].rows[0].cells[0];
                expect((cell.hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
                expect(cell.style.textDecoration).toBe('underline');
                done();
            });
            it('clear format action', () => {
                helper.switchRibbonTab(1);
                helper.invoke('clear', [{ range: 'A1', type: 'Clear Format' }]);
                spreadsheet = helper.getInstance();
                const cell: CellModel = spreadsheet.sheets[1].rows[0].cells[0];
                expect((cell.hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
            });
            it('clear all action', () => {
                helper.invoke('clear', [{ range: 'A1', type: 'Clear All' }]);
                spreadsheet = helper.getInstance();
                const cell: CellModel = spreadsheet.sheets[1].rows[0].cells[0];
                expect((cell.hyperlink as HyperlinkModel)).toBe(undefined);
            });
        });
    });
    describe('allowHyperlink: false ->', () => {
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ 
                allowHyperlink: false,
                sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 11, cells: [{ hyperlink: { address: 'www.google.com' } }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Should check if parent of hyperlink button contains overlay class', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.switchRibbonTab(2);
            var hyperlinkbtn = helper.getElement('#spreadsheet_hyperlink');
            expect(hyperlinkbtn.parentElement.classList.contains('e-overlay')).toBe(true);
            const cell: CellModel = spreadsheet.sheets[0].rows[11].cells[0];
            expect((cell.hyperlink as HyperlinkModel).address).toBe('www.google.com');
            const cellEle: HTMLElement = helper.invoke('getCell', [11, 0]);
            expect(cellEle.querySelector('.e-hyperlink')).toBeNull();
            done();
        });
        it('Programmatic binding and editing of hyperlinks should not be allowed', (done: Function) => {
            spreadsheet = helper.getInstance();
            spreadsheet.addHyperlink('https://example.com', 'C3');
            const sheet = spreadsheet.sheets[0];
            expect(sheet.rows[2].cells[2].hyperlink).toBe(undefined);
            const cellEle: HTMLElement = helper.invoke('getCell', [2, 2]);
            expect(cellEle.querySelector('.e-hyperlink')).toBeNull();
            done();
        });
    });
    describe('Hyperlink click events ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Should trigger both beforeHyperlinkClick and afterHyperlinkClick events', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();            
            const beforeHyperlinkClickSpy = jasmine.createSpy('beforeHyperlinkClick');
            const afterHyperlinkClickSpy = jasmine.createSpy('afterHyperlinkClick');            
            spreadsheet.beforeHyperlinkClick = beforeHyperlinkClickSpy;
            spreadsheet.afterHyperlinkClick = afterHyperlinkClickSpy;
            helper.invoke('addHyperlink', ['www.google.com', 'A1']);
            helper.invoke('selectRange', ['A1']);
            let td: HTMLElement = helper.invoke('getCell', [0, 0]).children[0];
            td.click();
            expect(beforeHyperlinkClickSpy).toHaveBeenCalled();
            expect(afterHyperlinkClickSpy).toHaveBeenCalled();
            done();
        });
        it('Should handle cancellation in beforeHyperlinkClick event', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const afterHyperlinkClickSpy = jasmine.createSpy('afterHyperlinkClick');
            spreadsheet.afterHyperlinkClick = afterHyperlinkClickSpy;
            let beforeHyperlinkClickArgs: string = '';
            spreadsheet.beforeHyperlinkClick = (args: BeforeHyperlinkArgs): void => {
                args.cancel = true;
                beforeHyperlinkClickArgs = JSON.stringify(args);
            };
            helper.invoke('addHyperlink', ['www.google.com', 'A2']);
            helper.invoke('selectRange', ['A2']);
            let td: HTMLElement = helper.invoke('getCell', [1, 0]).children[0];
            td.click();
            expect(beforeHyperlinkClickArgs).toBe('{"hyperlink":"http://www.google.com","address":"A2","target":"_blank","cancel":true,"name":"beforeHyperlinkClick"}');
            expect(afterHyperlinkClickSpy).not.toHaveBeenCalled();
            spreadsheet.beforeHyperlinkClick = undefined;
            done();
        });
    });
});