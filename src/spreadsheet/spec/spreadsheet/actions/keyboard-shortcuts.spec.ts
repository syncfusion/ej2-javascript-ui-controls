import { SpreadsheetModel, Spreadsheet } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel } from '../../../src';

/**
 *  Keyboard shortcuts spec
 */

describe('Keyboard shortcuts module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    let eventArg: Object;

    describe('UI interaction checking ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [
                            { dataSource: defaultData }
                        ]
                    }
                ]
            };
            helper.initializeSpreadsheet(model, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Cut shortcut testing', (done: Function) => {
            helper.invoke('selectRange', ['A2:A6']);
            helper.triggerKeyNativeEvent(88, true);
            setTimeout(() => {
				//Checking external cut opertion
                helper.triggerKeyEvent(
                    'cut', 88, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, { clipboardData: new DataTransfer() });
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                    helper.invoke('selectRange', ['J2']);
                    helper.triggerKeyEvent(
                        'paste', 86, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, { clipboardData: new DataTransfer() });
                    helper.invoke('getData', ['Sheet1!J2:J6']).then((values: Map<string, CellModel>) => {
                        expect(values.get('J2').value).toEqual('Casual Shoes');
                        expect(values.get('J3').value).toEqual('Sports Shoes');
                        expect(values.get('J4').value).toEqual('Formal Shoes');
                        expect(values.get('J5').value).toEqual('Sandals & Floaters');
                        expect(values.get('J6').value).toEqual('Flip- Flops & Slippers');
                        helper.triggerKeyNativeEvent(27);
                        expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).toBeNull();
                        //Checking paste from clipboard data.
                        // Unable to trigger external paste so commented
                        // helper.invoke('selectRange', ['M2']);
                        // helper.triggerKeyEvent(
                        //     'paste', 86, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null,
                        //     eventArg
                        // );
                        // helper.invoke('getData', ['Sheet1!M2:M6']).then((values: Map<string, CellModel>) => {
                        //     expect(values.get('M2').value).toEqual('Casual Shoes');
                        //     expect(values.get('M3').value).toEqual('Sports Shoes');
                        //     expect(values.get('M4').value).toEqual('Formal Shoes');
                        //     expect(values.get('M5').value).toEqual('Sandals & Floaters');
                        //     expect(values.get('M6').value).toEqual('Flip- Flops & Slippers');
                             done();
                        // });
                    });
                }, 10);
            }, 10);
        });

        it('Copy shortcut testing', (done: Function) => {
            helper.invoke('selectRange', ['D2:D6']);
            helper.triggerKeyNativeEvent(67, true);
            setTimeout(() => {
                eventArg = { clipboardData: new DataTransfer() };
                //Checking external copy opertion
                helper.triggerKeyEvent(
                    'copy', 88, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null,
                    eventArg
                );
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                    helper.invoke('selectRange', ['K2']);
                    helper.triggerKeyEvent('paste', 86, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, eventArg);
                    helper.invoke('getData', ['Sheet1!K2:K6']).then((values: Map<string, CellModel>) => {
                        expect(values.get('K2').value.toString()).toEqual('10');
                        expect(values.get('K3').value.toString()).toEqual('20');
                        expect(values.get('K4').value.toString()).toEqual('20');
                        expect(values.get('K5').value.toString()).toEqual('15');
                        expect(values.get('K6').value.toString()).toEqual('30');
                        done();
                    });
                }, 10);
            }, 10);
        });

        it('Paste shortcut testing', (done: Function) => {
            helper.invoke('selectRange', ['L2']);
            helper.triggerKeyEvent('paste', 86, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, eventArg);
            helper.invoke('getData', ['Sheet1!L2:L6']).then((values: Map<string, CellModel>) => {
                expect(values.get('L2').value.toString()).toEqual('10');
                expect(values.get('L3').value.toString()).toEqual('20');
                expect(values.get('L4').value.toString()).toEqual('20');
                expect(values.get('L5').value.toString()).toEqual('15');
                expect(values.get('L6').value.toString()).toEqual('30');
                helper.triggerKeyNativeEvent(27);
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).toBeNull();
                done();
            });
        });

        it('Bold shortcut testing', (done: Function) => {
            helper.triggerKeyNativeEvent(66, true);
            helper.invoke('getData', ['Sheet1!L2:L6']).then((values: Map<string, CellModel>) => {
                expect(values.get('L2').style.fontWeight).toEqual('bold');
                expect(values.get('L3').style.fontWeight).toEqual('bold');
                expect(values.get('L4').style.fontWeight).toEqual('bold');
                expect(values.get('L5').style.fontWeight).toEqual('bold');
                expect(values.get('L6').style.fontWeight).toEqual('bold');
                done();
            });
        });

        it('Bold shortcut revert testing', (done: Function) => {
            helper.triggerKeyNativeEvent(66, true);
            helper.invoke('getData', ['Sheet1!L2:L6']).then((values: Map<string, CellModel>) => {
                expect(values.get('L2').style.fontWeight).toEqual('normal');
                expect(values.get('L3').style.fontWeight).toEqual('normal');
                expect(values.get('L4').style.fontWeight).toEqual('normal');
                expect(values.get('L5').style.fontWeight).toEqual('normal');
                expect(values.get('L6').style.fontWeight).toEqual('normal');
                done();
            });
        });

        it('Italic shortcut testing', (done: Function) => {
            helper.triggerKeyNativeEvent(73, true);
            helper.invoke('getData', ['Sheet1!L2:L6']).then((values: Map<string, CellModel>) => {
                expect(values.get('L2').style.fontStyle).toEqual('italic');
                expect(values.get('L3').style.fontStyle).toEqual('italic');
                expect(values.get('L4').style.fontStyle).toEqual('italic');
                expect(values.get('L5').style.fontStyle).toEqual('italic');
                expect(values.get('L6').style.fontStyle).toEqual('italic');
                done();
            });
        });

        it('Italic shortcut revert testing', (done: Function) => {
            helper.triggerKeyNativeEvent(73, true);
            helper.invoke('getData', ['Sheet1!L2:L6']).then((values: Map<string, CellModel>) => {
                expect(values.get('L2').style.fontStyle).toEqual('normal');
                expect(values.get('L3').style.fontStyle).toEqual('normal');
                expect(values.get('L4').style.fontStyle).toEqual('normal');
                expect(values.get('L5').style.fontStyle).toEqual('normal');
                expect(values.get('L6').style.fontStyle).toEqual('normal');
                done();
            });
        });

        it('Text Decoration underline shortcut testing', (done: Function) => {
            helper.triggerKeyNativeEvent(85, true);
            helper.invoke('getData', ['Sheet1!L2:L6']).then((values: Map<string, CellModel>) => {
                expect(values.get('L2').style.textDecoration).toEqual('underline');
                expect(values.get('L3').style.textDecoration).toEqual('underline');
                expect(values.get('L4').style.textDecoration).toEqual('underline');
                expect(values.get('L5').style.textDecoration).toEqual('underline');
                expect(values.get('L6').style.textDecoration).toEqual('underline');
                done();
            });
        });

        it('Text Decoration underline shortcut revert testing', (done: Function) => {
            helper.triggerKeyNativeEvent(85, true);
            helper.invoke('getData', ['Sheet1!L2:L6']).then((values: Map<string, CellModel>) => {
                expect(values.get('L2').style.textDecoration).toEqual('none');
                expect(values.get('L3').style.textDecoration).toEqual('none');
                expect(values.get('L4').style.textDecoration).toEqual('none');
                expect(values.get('L5').style.textDecoration).toEqual('none');
                expect(values.get('L6').style.textDecoration).toEqual('none');
                done();
            });
        });

        it('Text Decoration line-through shortcut testing', (done: Function) => {
            helper.triggerKeyNativeEvent(53, true);
            helper.invoke('getData', ['Sheet1!L2:L6']).then((values: Map<string, CellModel>) => {
                expect(values.get('L2').style.textDecoration).toEqual('line-through');
                expect(values.get('L3').style.textDecoration).toEqual('line-through');
                expect(values.get('L4').style.textDecoration).toEqual('line-through');
                expect(values.get('L5').style.textDecoration).toEqual('line-through');
                expect(values.get('L6').style.textDecoration).toEqual('line-through');
                done();
            });
        });

        it('Text Decoration line-through shortcut revert testing', (done: Function) => {
            helper.triggerKeyNativeEvent(53, true);
            helper.invoke('getData', ['Sheet1!L2:L6']).then((values: Map<string, CellModel>) => {
                expect(values.get('L2').style.textDecoration).toEqual('none');
                expect(values.get('L3').style.textDecoration).toEqual('none');
                expect(values.get('L4').style.textDecoration).toEqual('none');
                expect(values.get('L5').style.textDecoration).toEqual('none');
                expect(values.get('L6').style.textDecoration).toEqual('none');
                done();
            });
        });
        it('SF-401897 -> Alt ribbon header text focus shortcut testing', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 18, altKey: true, preventDefault: (): void => {} })
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Home');
            helper.invoke('selectRange', ['B1']);
            helper.click(`#${helper.id}_sorting`);
            helper.click(`#${helper.id}_applyfilter`);
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 18, altKey: true, preventDefault: (): void => {} })
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeFalsy();
            helper.getInstance().showRibbon = false; //If the ribbon is not visible keyboard action should be prevented
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 18, altKey: true, preventDefault: (): void => {} })
            done();
        });
    });

    describe('Keyboard Shortcuts in Ribbon->', () => {
        let spreadsheet: any; let tbarEle: HTMLElement;
        const triggerToolbarAction: Function = (keyCode: number, count: number, action: string = 'keyup', ele: HTMLElement = tbarEle): void => {
            for (let i: number = 0; i < count; i++) {
                helper.triggerKeyNativeEvent(keyCode, false, false, ele, action, false, <HTMLElement>document.activeElement);
            }
        };
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Insert Tab switching->', (done: Function) => {
            spreadsheet = helper.getInstance();
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 78, altKey: true, preventDefault: (): void => {} });
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Insert');
            done();
        });
        it('Home Tab switch->', (done: Function) => {
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 72, altKey: true, preventDefault: (): void => {} });
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Home');
            done();
        });
        it('Data Tab switch->', (done: Function) => {
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 65, altKey: true, preventDefault: (): void => {} });
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Data');
            done();
        });
        it('View Tab switch->', (done: Function) => {
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 87, altKey: true, preventDefault: (): void => {} });
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('View');
            done();
        });
        it('Formulas Tab switch->', (done: Function) => {
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 77, altKey: true, preventDefault: (): void => {} });
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Formulas');
            done();
        });
        it('Tab and Shift + Tab key navigation in home tab->', (done: Function) => {
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 72, altKey: true, preventDefault: (): void => {} });
            helper.triggerKeyNativeEvent(9);
            expect(document.activeElement.id).toBe('spreadsheet_cut');
            helper.triggerKeyNativeEvent(9);
            expect(document.activeElement.classList.contains('e-drop-icon')).toBeTruthy();
            helper.triggerKeyNativeEvent(9);
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true);
            expect(document.activeElement.classList.contains('e-drop-icon')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true);
            expect(document.activeElement.getAttribute('aria-label')).toBe('Cut (Ctrl+X)');
            helper.triggerKeyNativeEvent(9, false, true);
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            helper.triggerKeyNativeEvent(9);
            expect(document.activeElement.id).toBe('spreadsheet_cut');
            done();
        });
        it('Toolbar Right and Left key navigation in Home Tab->', (done: Function) => {
            tbarEle = helper.getElementFromSpreadsheet('.e-ribbon .e-content .e-toolbar');
            triggerToolbarAction(39, 8);
            expect(document.activeElement.getAttribute('aria-label')).toBe('Underline');
            triggerToolbarAction(39, 10);
            expect(document.activeElement.getAttribute('aria-label')).toBe('Find & Replace');
            triggerToolbarAction(37, 3);
            expect(document.activeElement.classList.contains('e-cf-ddb')).toBeTruthy();
            done();
        });
        it('Tab and Shift + Tab key navigation in Insert Tab->', (done: Function) => {
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 78, altKey: true, preventDefault: (): void => { } });
            helper.triggerKeyNativeEvent(9);
            expect(document.activeElement.id).toBe('spreadsheet_hyperlink');
            triggerToolbarAction(39, 2);
            expect(document.activeElement.textContent).toBe('Chart');
            helper.triggerKeyNativeEvent(9);
            expect(document.activeElement.classList.contains('e-drop-icon')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true);
            expect(document.activeElement.id).toBe('spreadsheet_hyperlink');
            done();
        });
        it('Toolbar key action in chart design tab->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 18, altKey: true, preventDefault: (): void => { } });
            helper.triggerKeyNativeEvent(9);
            expect(document.activeElement.textContent).toBe('Add Chart Element');
            triggerToolbarAction(39, 3);
            expect(document.activeElement.textContent).toBe('Chart Type');
            done();
        });
        it('Tab and Shift + Tab key in Formulas tab->', (done: Function) => {
            spreadsheet.keyboardShortcutModule.ribbonShortCuts({ keyCode: 77, altKey: true, preventDefault: (): void => { } });
            helper.triggerKeyNativeEvent(9);
            expect(document.activeElement.textContent).toBe('Insert Function');
            helper.triggerKeyNativeEvent(9);
            expect(document.activeElement.classList.contains('e-drop-icon')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true);
            expect(document.activeElement.textContent).toBe('Insert Function');
            helper.triggerKeyNativeEvent(9, false, true);
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            done();
        });
        it('Expand/Collapse ribbon using Ctrl + F8 and Enter key->', (done: Function) => {
            const ribbon: HTMLElement = helper.getElement('.e-ribbon');
            expect(ribbon.classList.contains('e-collapsed')).toBeFalsy();
            helper.triggerKeyNativeEvent(119, true);
            expect(ribbon.classList.contains('e-collapsed')).toBeTruthy();
            helper.triggerKeyNativeEvent(119, true);
            expect(ribbon.classList.contains('e-collapsed')).toBeFalsy();
            helper.triggerKeyNativeEvent(9, false, true);
            triggerToolbarAction(13, 1, 'keydown', null);
            expect(ribbon.classList.contains('e-collapsed')).toBeTruthy();
            triggerToolbarAction(13, 1, 'keydown', null);
            expect(ribbon.classList.contains('e-collapsed')).toBeFalsy();
            done();
        });
    });

    describe('Key board Shortcuts->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Apply Ctrl + a ->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(65, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Open Edit Hyperlink Dialog using shortcut->', (done: Function) => {
            helper.invoke('addHyperlink', ['www.google.com', 'A1']);
            helper.triggerKeyNativeEvent(75, true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                var dialog = helper.getElement('.e-edithyperlink-dlg.e-dialog');
                // expect(!!dialog).toBeTruthy();
                // expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                helper.click('.e-edithyperlink-dlg .e-footer-content button:nth-child(1)');
                done();
            });
        });
        it('Open Find & Replace Dialog using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(72, true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-find-dlg.e-dialog');
                var dialog = helper.getElement('.e-find-dlg.e-dialog');
                expect(!!dialog).toBeTruthy();
                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                helper.click('.e-dlg-closeicon-btn.e-flat');
                done();
            });
        });
        it('Paste action using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.invoke('copy', ['A2']).then(() => {
                helper.invoke('selectRange', ['A3']);
                helper.triggerKeyNativeEvent(86, true);
                helper.triggerKeyEvent('paste', 86, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, { clipboardData: new DataTransfer() });
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[2].cells[0].value).toBe('Casual Shoes');
                    done();
                });
            });
        });
        it('Apply Filter using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(76, true, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).children[0].classList).toContain('e-filter-btn');
                done();
            });
        });
        it('Hide Row using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['C3']);
            helper.triggerKeyNativeEvent(57, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[2].hidden).toBeTruthy();
                done();
            });
        });
        it('Hide Column using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['C4']);
            helper.triggerKeyNativeEvent(48, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].columns[2].hidden).toBeTruthy();
                done();
            });
        });
        it('UnHide Row using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['C3']);
            helper.triggerKeyNativeEvent(57, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[2].hidden).toBeFalsy();
                done();
            });
        });
        it('UnHide Column using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['C4']);
            helper.triggerKeyNativeEvent(48, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].columns[2].hidden).toBeFalsy();
                done();
            });
        });
        it('Apply Border using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['E4']);
            helper.triggerKeyNativeEvent(55, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[3].cells[4].style.borderTop).toBe('1px solid #000000');
                expect(helper.getInstance().sheets[0].rows[3].cells[4].style.borderBottom).toBe('1px solid #000000');
                done();
            });
        });
        it('Open Formula Dialog using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['E4']);
            helper.triggerKeyNativeEvent(114, false, true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-spreadsheet-function-dlg.e-dialog');
                var dialog = helper.getElement('.e-spreadsheet-function-dlg.e-dialog');
                expect(!!dialog).toBeTruthy();
                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                helper.click('.e-dlg-closeicon-btn.e-flat');
                helper.triggerKeyNativeEvent(13);
                done();
            });
        });
        it('Apply general Number Format using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['B6']);
            helper.triggerKeyNativeEvent(192, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[5].cells[1].format).toBe('General');
                expect(helper.invoke('getCell', [5, 1]).textContent).toBe('41813');
                done();
            });
        });
        it('Apply "$#,##0.00;[Red]($#,##0.00)" Number Format using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['B6']);
            helper.triggerKeyNativeEvent(52, true, true);
            expect(helper.getInstance().sheets[0].rows[5].cells[1].format).toBe('$#,##0.00_);[Red]($#,##0.00)');
            expect(helper.invoke('getCell', [5, 1]).textContent).toBe('$41,813.00 ');
            done();
        });
        it('Apply "0%" Number Format using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['B6']);
            helper.triggerKeyNativeEvent(53, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[5].cells[1].format).toBe('0%');
                expect(helper.invoke('getCell', [5, 1]).textContent).toBe('4181300%');
                done();
            });
        });
        it('Apply "Scientific" Number Format using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['B6']);
            helper.triggerKeyNativeEvent(54, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[5].cells[1].format).toBe('0.00E+00');
                expect(helper.invoke('getCell', [5, 1]).textContent).toBe('4.18E+04');
                done();
            });
        });
        it('Apply "dd-mmm-yy" Number Format using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['B6']);
            helper.triggerKeyNativeEvent(51, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[5].cells[1].format).toBe('dd-mmm-yy');
                expect(helper.invoke('getCell', [5, 1]).textContent).toBe('23-Jun-14');
                done();
            });
        });
        it('Apply "h:mm AM/PM" Number Format using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['B6']);
            helper.triggerKeyNativeEvent(50, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[5].cells[1].format).toBe('h:mm AM/PM');
                expect(helper.invoke('getCell', [5, 1]).textContent).toBe('12:00 AM');
                done();
            });
        });
        it('Apply "0.00" Number Format using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['B6']);
            helper.triggerKeyNativeEvent(49, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[5].cells[1].format).toBe('0.00');
                expect(helper.invoke('getCell', [5, 1]).textContent).toBe('41813.00');
                done();
            });
        });
        it('Refresh New Sheet using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['B6']);
            const sheet: HTMLElement = helper.getElement('.e-spreadsheet');
            helper.triggerKeyNativeEvent(78, true, false, sheet, undefined, true);
            setTimeout(() => {
                helper.invoke('selectRange', ['A1']);
                expect(helper.invoke('getCell', [5, 1]).textContent).toBe('');
                done();
            });
        });
        it('Add New Sheet using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(122, false, true);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().sheets.length).toBe(2);
                done();
            });
        });
        it('List All Sheets using shortcut->', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(75, false, true, undefined, undefined, true);
            setTimeout(() => {
                let popUpElem: HTMLElement = helper.getElement('.e-dropdown-popup.e-sheets-list')
                expect(popUpElem.firstElementChild.childElementCount).toBe(2);
                helper.click('.e-sheets-list.e-dropdown-btn');
                done();
            });
        });
        it('Formula bar toggle checking', (done: Function) => {
            helper.triggerKeyNativeEvent(85, true, true);
            const formulaBar: HTMLElement = helper.getElementFromSpreadsheet('.e-formula-bar-panel');
            expect(formulaBar.classList.contains('e-expanded')).toBeTruthy();
            const dropIcon: HTMLElement = helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-drop-icon');
            expect(dropIcon.title).toBe('Collapse Formula Bar');
            expect(dropIcon.getAttribute('aria-label')).toBe('Expand Formula Bar');
            helper.triggerKeyNativeEvent(85, true, true);
            expect(dropIcon.title).toBe('Expand Formula Bar');
            expect(dropIcon.getAttribute('aria-label')).toBe('Collapse Formula Bar');
            expect(formulaBar.classList.contains('e-expanded')).toBeFalsy();
            done();
        });
    });

    describe('CR-Issues->', () => {
        describe('EJ2-54235->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ index: 2, cells: [{ index: 2, value: 'Test' }] }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Need to prevent paste multiple times after cut action.->', (done: Function) => {
                helper.invoke('selectRange', ['C3']);
                helper.triggerKeyNativeEvent(88, true);
                setTimeout(() => {
                    helper.triggerKeyEvent('cut', 88, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, { clipboardData: new DataTransfer() });
                    setTimeout(() => {
                        helper.invoke('selectRange', ['C5']);
                        helper.triggerKeyEvent('paste', 86, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, { clipboardData: new DataTransfer() });
                        setTimeout(() => {
                            expect(helper.getInstance().sheets[0].rows[4].cells[2].value.toString()).toEqual('Test');
                            helper.invoke('selectRange', ['D5']);
                            helper.triggerKeyEvent('paste', 86, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, { clipboardData: new DataTransfer() });
                            setTimeout(() => {
                                expect(helper.getInstance().sheets[0].rows[4].cells[3]).toBeNull;
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('EJ2-54313->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'H3:H7' }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Redo action working incorrectly when cut and paste the cell values->', (done: Function) => {
                helper.triggerKeyNativeEvent(88, true);
                setTimeout(() => {
                    helper.triggerKeyEvent('cut', 88, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, { clipboardData: new DataTransfer() });
                    setTimeout(() => {
                        helper.invoke('selectRange', ['J3']);
                        helper.triggerKeyEvent('paste', 86, helper.getElementFromSpreadsheet('.e-clipboard'), true, false, null, { clipboardData: new DataTransfer() });
                        expect(helper.getInstance().sheets[0].rows[2].cells[9].value.toString()).toEqual('50');
                        expect(helper.getInstance().sheets[0].rows[6].cells[9].value.toString()).toEqual('66');
                        setTimeout(() => {
                            helper.triggerKeyNativeEvent(90, true);
                            expect(helper.getInstance().sheets[0].rows[2].cells[9]).toBeNull;
                            expect(helper.getInstance().sheets[0].rows[6].cells[9]).toBeNull;
                            expect(helper.getInstance().sheets[0].rows[2].cells[7].value.toString()).toEqual('50');
                            expect(helper.getInstance().sheets[0].rows[6].cells[7].value.toString()).toEqual('66');
                            setTimeout(() => {
                                helper.triggerKeyNativeEvent(89, true);
                                setTimeout(() => {
                                    expect(helper.getInstance().sheets[0].rows[2].cells[7]).toBeNull;
                                    expect(helper.getInstance().sheets[0].rows[6].cells[7]).toBeNull;
                                    expect(helper.getInstance().sheets[0].rows[2].cells[9].value.toString()).toEqual('50');
                                    expect(helper.getInstance().sheets[0].rows[6].cells[9].value.toString()).toEqual('66');
                                    done();
                                });
                            });
                        });
                    });
                });
            })
        });
    });

    describe('Testing keyboard shortcuts in context menu cases ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }], scrollSettings: { enableVirtualization: false, isFinite: true }
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Open Context Menu using Shift+Fn+F10.', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            setTimeout(function () {
                helper.edit('F4', 'Test');
                helper.invoke('selectRange', ['E1:E1']);
                helper.triggerKeyNativeEvent(121, false, true);
                setTimeout(function () {
                    expect(spreadsheet.activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
        it('Open Context Menu using Shift+Fn+F10 in second row.', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            setTimeout(function () {
                helper.edit('F4', 'Test');
                helper.invoke('selectRange', ['E2:E2']);
                helper.triggerKeyNativeEvent(121, false, true);
                setTimeout(function () {
                    expect(spreadsheet.activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
        it('Open Context Menu using Shift+Fn+F10 in inside freeze column.', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(0, 3);
            setTimeout(() => {
                helper.edit('F4', 'Test');
                helper.invoke('selectRange', ['B3']);
                setTimeout(() => {
                    helper.triggerKeyNativeEvent(121, false, true);
                    setTimeout(() => {
                        expect(spreadsheet.activeSheetIndex).toEqual(0);
                        done();
                    });
                });
            });
        });
        it('Open Context Menu using Shift+Fn+F10 in inside freeze column by selecting whole column.', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(0, 3);
            setTimeout(() => {
                helper.edit('A4', 'Test');
                helper.invoke('selectRange', ['B1:B100']);
                setTimeout(() => {
                    helper.triggerKeyNativeEvent(121, false, true);
                    setTimeout(() => {
                        expect(spreadsheet.activeSheetIndex).toEqual(0);
                        done();
                    });
                });
            });
        });
        it('Open Context Menu using Shift+Fn+F10 in inside freeze row by selecting whole row.', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(2, 0);
            setTimeout(() => {
                helper.edit('A4', 'Test');
                helper.invoke('selectRange', ['A1:CV1']);
                setTimeout(() => {
                    helper.triggerKeyNativeEvent(121, false, true);
                    setTimeout(() => {
                        expect(spreadsheet.activeSheetIndex).toEqual(0);
                        done();
                    });
                });
            });
        });
        it('Open Context Menu using Shift+Fn+F10 with Freeze pane.', function (done) {
            const spreadsheet: Spreadsheet  = helper.getInstance();
            spreadsheet.freezePanes(2, 3);
            setTimeout(function () {
                helper.edit('F4', 'Test');
                helper.invoke('selectRange', ['E1:E1']);
                helper.triggerKeyNativeEvent(121, false, true);
                setTimeout(function () {
                    expect(spreadsheet.activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
        it('Open Context Menu using Shift+Fn+F10 with Column Selection .', (done: Function) => {
            helper.edit('A4', 'Test');
            helper.invoke('selectRange', ['A1:A100']);
            setTimeout(() => {
                helper.triggerKeyNativeEvent(121, false, true);
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
        it('Open Context Menu using Shift+Fn+F10 Row Selection.', (done: Function) => {
            helper.edit('A4', 'Test');
            helper.invoke('selectRange', ['A1:CV1']);
            setTimeout(() => {
                helper.triggerKeyNativeEvent(121, false, true);
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
        it('Open Context Menu using Shift+Fn+F10 with Column Selection with Frozen Column.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(1, 3);
            setTimeout(() => {
                helper.edit('F4', 'Test');
                helper.invoke('selectRange', ['F1:F100']);
                setTimeout(() => {
                    helper.triggerKeyNativeEvent(121, false, true);
                    setTimeout(() => {
                        expect(spreadsheet.activeSheetIndex).toEqual(0);
                        done();
                    });
                });
            });
        });
        it('Open Context Menu using Shift+Fn+F10 Row Selection with Frozen Row.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(1, 3);
            setTimeout(() => {
                helper.edit('F8', 'Test');
                helper.invoke('selectRange', ['A5:CV5']);
                setTimeout(() => {
                    helper.triggerKeyNativeEvent(121, false, true);
                    setTimeout(() => {
                        expect(spreadsheet.activeSheetIndex).toEqual(0);
                        done();
                    });
                });
            });
        });
        it('Hide Row and Column in Protect Sheet.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Sheet1', { selectCells: true, formatRows: true, formatColumns: true, formatCells: true });
            setTimeout(() => {
                helper.triggerKeyNativeEvent(57, true, false);
                setTimeout(() => {
                    helper.triggerKeyNativeEvent(48, true, false);
                    helper.triggerKeyNativeEvent(52, true, true);
                    expect(spreadsheet.activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
    });
});